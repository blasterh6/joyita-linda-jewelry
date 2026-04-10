import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { currentPassword, newPassword } = await req.json();
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const [user]: any = await conn.query('SELECT password_hash FROM users WHERE id = ?', [auth.user.id]);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) return NextResponse.json({ error: 'Current password incorrect' }, { status: 401 });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, auth.user.id]);

    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error('Password update error:', err);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
