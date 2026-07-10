import { Hono } from 'hono';
import { Env } from '../types';
import { requireRole } from '../auth';

const router = new Hono<{ Bindings: Env }>();

router.get('/dashboard', async (c) => {
  await requireRole(c.req.header('authorization'), c.env, c.env.DB, 'admin');
  const db = c.env.DB;

  const totalClients = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'client'").first<{ count: number }>();
  const totalLawyers = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'lawyer'").first<{ count: number }>();
  const totalCases = await db.prepare('SELECT COUNT(*) as count FROM cases').first<{ count: number }>();
  const totalDocuments = await db.prepare('SELECT COUNT(*) as count FROM documents').first<{ count: number }>();
  const totalConsultations = await db.prepare('SELECT COUNT(*) as count FROM consultations').first<{ count: number }>();
  const revenue = await db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'").first<{ count: number; total: number }>();

  return c.json({
    total_clients: totalClients?.count || 0,
    total_lawyers: totalLawyers?.count || 0,
    total_cases: totalCases?.count || 0,
    total_documents: totalDocuments?.count || 0,
    total_consultations: totalConsultations?.count || 0,
    total_revenue: revenue?.count || 0,
    revenue_amount: revenue?.total || 0,
  });
});

router.get('/users', async (c) => {
  await requireRole(c.req.header('authorization'), c.env, c.env.DB, 'admin');
  const result = await c.env.DB.prepare('SELECT id, email, username, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC').all();
  return c.json(result.results);
});

export default router;
