import { Hono } from 'hono';
import { Env } from '../types';
import { requireAuth } from '../auth';

const router = new Hono<{ Bindings: Env }>();

router.post('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const { title, case_type, description, jurisdiction, court } = await c.req.json();
  const { meta } = await c.env.DB.prepare(
    'INSERT INTO cases (client_id, title, case_type, description, jurisdiction, court, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, title, case_type || 'other', description || null, jurisdiction || null, court || null, 'pending').run();
  const caseItem = await c.env.DB.prepare('SELECT id, title, status FROM cases WHERE id = ?').bind(meta.last_row_id).first();
  return c.json({ message: 'Case created', case: caseItem });
});

router.get('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const result = await c.env.DB.prepare('SELECT id, title, case_number, case_type, status, jurisdiction, created_at FROM cases WHERE client_id = ? ORDER BY created_at DESC').bind(user.id).all();
  return c.json(result.results);
});

router.get('/:id', async (c) => {
  const caseItem = await c.env.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(c.req.param('id')).first();
  if (!caseItem) return c.json({ detail: 'Case not found' }, 404);
  return c.json(caseItem);
});

export default router;
