import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// GET /api/v1/settings?key=xxx
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    if (key) {
      const [row]: any = await conn.query('SELECT value FROM settings WHERE `key` = ?', [key]);
      return NextResponse.json({ value: row?.value || null });
    } else {
      const rows: any = await conn.query('SELECT `key`, value FROM settings');
      const settings = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
      return NextResponse.json(settings);
    }
  } catch (err) {
    return NextResponse.json({ value: null });
  } finally {
    if (conn) conn.release();
  }
}

// PUT /api/v1/settings — Admin: guardar configuración
export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json(); // { key: string, value: string }
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [body.key, body.value, body.value]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
