import { Hono } from 'hono';
import { Env } from '../types';
import { requireAuth } from '../auth';

const router = new Hono<{ Bindings: Env }>();

function randomRef() {
  return 'PAY-' + Array.from(crypto.getRandomValues(new Uint8Array(4))).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

router.post('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const { amount, method, phone_number, description } = await c.req.json();
  const ref = randomRef();
  const { meta } = await c.env.DB.prepare(
    'INSERT INTO payments (user_id, amount, currency, method, status, reference, phone_number, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, amount, 'KES', method || 'mpesa', 'completed', ref, phone_number || null, description || null).run();
  const payment = await c.env.DB.prepare('SELECT id, reference, amount, status, mpesa_code FROM payments WHERE id = ?').bind(meta.last_row_id).first();
  return c.json({ message: 'Payment completed', payment });
});

router.get('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const result = await c.env.DB.prepare('SELECT id, reference, amount, currency, method, status, description, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
  return c.json(result.results);
});

export default router;
