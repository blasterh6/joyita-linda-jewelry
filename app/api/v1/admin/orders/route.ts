import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// GET /api/v1/admin/orders — Admin: todos los pedidos
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
        o.id,
        CONCAT('ORD-JL-', LPAD(o.id, 4, '0')) as order_code,
        CONCAT(u.first_name, ' ', u.last_name) as customer,
        o.total_amount as total,
        o.status,
        DATE_FORMAT(o.created_at, '%d/%m/%Y') as date
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);
    return NextResponse.json(
      JSON.parse(JSON.stringify(rows, (_, v) => typeof v === 'bigint' ? Number(v) : v))
    );
  } catch (err) {
    console.error('Admin orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

// PATCH /api/v1/admin/orders — Admin: actualizar status de orden
export async function PATCH(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { orderId, status } = await req.json();
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
