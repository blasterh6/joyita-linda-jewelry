import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// GET /api/v1/orders/my — Pedidos del usuario autenticado
export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows: any = await conn.query(`
      SELECT 
        o.id,
        CONCAT('ORD-JL-', LPAD(o.id, 4, '0')) as order_code,
        o.total_amount as total,
        o.status,
        DATE_FORMAT(o.created_at, '%d/%m/%Y') as date,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', p.name,
            'qty', oi.quantity,
            'price', oi.unit_price
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [auth.user.id]);

    const orders = rows.map((o: any) => ({
      ...o,
      total: Number(o.total),
      id: o.order_code,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    }));

    return NextResponse.json(orders);
  } catch (err) {
    console.error('My orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
