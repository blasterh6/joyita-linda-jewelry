import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// GET /api/v1/admin/users — Admin: listado de todos los usuarios
export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows: any = await conn.query(`
      SELECT 
        id, 
        CONCAT(first_name, ' ', last_name) as name, 
        email, 
        role, 
        IF(is_active, 'Activo', 'Inactivo') as status,
        DATE_FORMAT(updated_at, 'Hace %kh') as last -- Simplificación para el demo
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY id DESC
    `);
    
    // Convert BigInts and properly map
    const users = JSON.parse(JSON.stringify(rows, (_, v) => typeof v === 'bigint' ? Number(v) : v));
    
    return NextResponse.json(users);
  } catch (err) {
    console.error('Admin list users error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
