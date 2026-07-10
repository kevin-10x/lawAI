import { Hono } from 'hono';
import { Env } from '../types';
import { requireAuth } from '../auth';

const router = new Hono<{ Bindings: Env }>();

router.post('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const { title, description, practice_area, mode, scheduled_date, duration_minutes } = await c.req.json();
  const { meta } = await c.env.DB.prepare(
    'INSERT INTO consultations (client_id, title, description, practice_area, mode, scheduled_date, duration_minutes, fee, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, title, description || null, practice_area || null, mode || 'video', scheduled_date || null, duration_minutes || 30, 1500, 'scheduled').run();
  const cons = await c.env.DB.prepare('SELECT id, title, status FROM consultations WHERE id = ?').bind(meta.last_row_id).first();
  return c.json({ message: 'Consultation booked', consultation: cons });
});

router.get('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  let query = 'SELECT id, title, practice_area, mode, status, scheduled_date, fee, created_at FROM consultations WHERE client_id = ? ORDER BY created_at DESC';
  if (user.role === 'lawyer') query = 'SELECT id, title, practice_area, mode, status, scheduled_date, fee, created_at FROM consultations WHERE lawyer_id = ? ORDER BY created_at DESC';
  const result = await c.env.DB.prepare(query).bind(user.id).all();
  return c.json(result.results);
});

router.get('/:id', async (c) => {
  const cons = await c.env.DB.prepare('SELECT * FROM consultations WHERE id = ?').bind(c.req.param('id')).first();
  if (!cons) return c.json({ detail: 'Consultation not found' }, 404);
  return c.json(cons);
});

router.patch('/:id/status', async (c) => {
  const status = c.req.query('status');
  await c.env.DB.prepare('UPDATE consultations SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run();
  return c.json({ message: `Consultation status updated to ${status}` });
});

export default router;
