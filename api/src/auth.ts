import { sign, verify } from '@tsndr/cloudflare-worker-jwt';
import { Env } from './types';

const PBKDF2_ITERATIONS = 100000;
const SALT = 'hauzral-legal-v1';

async function pbkdf2Hash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(SALT), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string): Promise<string> {
  return pbkdf2Hash(password);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return pbkdf2Hash(password).then(h => h === hashed);
}

export async function createToken(userId: number, role: string, secret: string): Promise<string> {
  return sign({ user_id: userId, role, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 }, secret);
}

export async function getAuthUser(authorization: string | undefined, env: Env, db: D1Database): Promise<any> {
  if (!authorization || !authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice(7);
  try {
    const payload: any = await verify(token, env.JWT_SECRET);
    if (!payload.user_id) return null;
    return await db.prepare('SELECT id, email, username, full_name, phone, role, company, is_active, created_at FROM users WHERE id = ?').bind(payload.user_id).first();
  } catch {
    return null;
  }
}

export async function requireAuth(authorization: string | undefined, env: Env, db: D1Database) {
  const user = await getAuthUser(authorization, env, db);
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(authorization: string | undefined, env: Env, db: D1Database, ...roles: string[]) {
  const user = await requireAuth(authorization, env, db);
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}
