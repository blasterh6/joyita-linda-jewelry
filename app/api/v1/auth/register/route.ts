import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, roleId } = await req.json();
  const pool = getPool();
  let conn;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [roleId || 3, firstName, lastName, email, hashedPassword]
    );
    return NextResponse.json({ message: 'User registered successfully' });
  } catch (err: any) {
    console.error('Register error:', err);
    const isDuplicate = err?.code === 'ER_DUP_ENTRY';
    return NextResponse.json(
      { error: isDuplicate ? 'Email already registered' : 'Registration failed' },
      { status: isDuplicate ? 409 : 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
