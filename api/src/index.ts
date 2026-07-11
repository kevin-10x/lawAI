import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import consultationRoutes from './routes/consultations';
import caseRoutes from './routes/cases';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import { generateContract, legalChatbotResponse, analyzeCaseResearch } from './services/ai';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    const allowed = ['http://localhost:5173', 'http://localhost:3000', 'https://hauzral-legal.pages.dev'];
    if (allowed.includes(origin) || origin.endsWith('.hauzral-legal.pages.dev')) return origin;
    return null;
  },
  credentials: true,
}));

app.route('/api/auth', authRoutes);
app.route('/api/documents', documentRoutes);
app.route('/api/consultations', consultationRoutes);
app.route('/api/cases', caseRoutes);
app.route('/api/payments', paymentRoutes);
app.route('/api/admin', adminRoutes);

app.post('/api/ai/generate-contract', async (c) => {
  const { prompt } = await c.req.json();
  return c.json(generateContract(prompt));
});

app.post('/api/ai/chat', async (c) => {
  const { query } = await c.req.json();
  return c.json(legalChatbotResponse(query));
});

app.post('/api/ai/research', async (c) => {
  const { query } = await c.req.json();
  return c.json(analyzeCaseResearch(query));
});

app.get('/api/health', (c) => {
  return c.json({ status: 'healthy', service: 'Hauzral Legal Consultancy API', version: '1.0.0' });
});

export default app;
