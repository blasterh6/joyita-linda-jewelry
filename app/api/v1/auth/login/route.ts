import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';
import { signToken } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const [user]: any = await conn.query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND u.deleted_at IS NULL',
      [email]
    );
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: Number(user.id), role: user.role_name });
    return NextResponse.json({ token, role: user.role_name, name: user.first_name, id: Number(user.id) });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
