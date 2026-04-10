import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_joyita_linda_2026';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

export function authenticateRequest(req: NextRequest): { user: any } | { error: string; status: number } {
  const token = getTokenFromRequest(req);
  if (!token) return { error: 'Unauthorized - Token missing', status: 401 };
  try {
    const user = verifyToken(token);
    return { user };
  } catch {
    return { error: 'Forbidden - Invalid session', status: 403 };
  }
}
