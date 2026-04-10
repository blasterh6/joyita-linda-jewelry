import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('SELECT 1');
    return NextResponse.json({ status: 'OK', database: 'Connected', platform: 'Joyita Linda' });
  } catch {
    return NextResponse.json({ status: 'ERROR', database: 'Disconnected' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
