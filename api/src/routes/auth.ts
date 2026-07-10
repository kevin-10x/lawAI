import { Hono } from 'hono';
import { Env } from '../types';
import { hashPassword, verifyPassword, createToken, getAuthUser } from '../auth';

const router = new Hono<{ Bindings: Env }>();

router.post('/register', async (c) => {
  const { email, username, password, full_name, phone, company } = await c.req.json();
  const db = c.env.DB;

  const existing = await db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').bind(email, username).first();
  if (existing) return c.json({ detail: 'Email or username already registered' }, 400);

  const hashed = await hashPassword(password);
  const { meta } = await db.prepare('INSERT INTO users (email, username, hashed_password, full_name, phone, company, role) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(email, username, hashed, full_name, phone || null, company || null, 'client').run();

  const user = await db.prepare('SELECT id, email, username, full_name, phone, role, company FROM users WHERE id = ?').bind(meta.last_row_id).first<{ id: number; email: string; username: string; full_name: string; phone: string; role: string; company: string }>();
  const token = await createToken(user!.id, user!.role, c.env.JWT_SECRET);

  return c.json({ access_token: token, token_type: 'bearer', user });
});

router.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  const db = c.env.DB;

  const user = await db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').bind(username, username).first() as any;
  if (!user || !(await verifyPassword(password, user.hashed_password))) {
    return c.json({ detail: 'Invalid credentials' }, 401);
  }

  const token = await createToken(user.id, user.role, c.env.JWT_SECRET);
  const { hashed_password, ...safe } = user;
  return c.json({ access_token: token, token_type: 'bearer', user: safe });
});

router.get('/me', async (c) => {
  const user = await getAuthUser(c.req.header('authorization'), c.env, c.env.DB);
  if (!user) return c.json({ detail: 'Unauthorized' }, 401);
  return c.json(user);
});

export default router;
