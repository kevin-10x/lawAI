import { Hono } from 'hono';
import { Env } from '../types';
import { requireAuth } from '../auth';
import { analyzeDocumentContent } from '../services/ai';

const router = new Hono<{ Bindings: Env }>();

router.post('/upload', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const title = (formData.get('title') as string) || file.name;

  if (!file) return c.json({ detail: 'No file provided' }, 400);

  const key = `${user.id}/${Date.now()}-${file.name}`;
  await c.env.DOCUMENTS.put(key, file);

  const { meta } = await c.env.DB.prepare(
    'INSERT INTO documents (user_id, title, file_path, file_type, doc_type, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(user.id, title, key, file.name.split('.').pop(), 'other', 'completed').run();

  const doc = await c.env.DB.prepare('SELECT id, title, status FROM documents WHERE id = ?').bind(meta.last_row_id).first();
  return c.json({ message: 'Document uploaded', document: doc });
});

router.post('/analyze/:id', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const docId = c.req.param('id');
  const { content } = await c.req.json();

  const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(docId, user.id).first();
  if (!doc) return c.json({ detail: 'Document not found' }, 404);

  const analysis = analyzeDocumentContent(content || '');
  await c.env.DB.prepare('UPDATE documents SET ai_analysis = ?, risk_score = ?, status = ? WHERE id = ?')
    .bind(JSON.stringify(analysis), analysis.risk_score, 'completed', docId).run();

  return c.json(analysis);
});

router.get('/', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const docs = await c.env.DB.prepare('SELECT id, title, doc_type, status, risk_score, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
  return c.json(docs.results);
});

router.get('/:id', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!doc) return c.json({ detail: 'Document not found' }, 404);
  return c.json(doc);
});

router.delete('/:id', async (c) => {
  const user = await requireAuth(c.req.header('authorization'), c.env, c.env.DB);
  const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!doc) return c.json({ detail: 'Document not found' }, 404);
  await c.env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ message: 'Document deleted' });
});

export default router;
