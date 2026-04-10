import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// POST /api/v1/orders — Crear nuevo pedido
export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { items, shipping, tax, total } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1. Insertar orden
    const orderResult = await conn.query(
      `INSERT INTO orders (customer_id, status, total_amount, shipping_cost, tax_amount, currency) 
       VALUES (?, 'preparing', ?, ?, ?, 'MXN')`,
      [auth.user.id, total, shipping, tax]
    );
    
    const orderId = orderResult.insertId;

    // 2. Insertar items
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.qty, item.price]
      );
    }

    await conn.commit();
    return NextResponse.json({ success: true, orderId: Number(orderId) });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
