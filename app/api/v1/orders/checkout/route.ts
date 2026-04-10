import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { items, paymentMethod } = await req.json();
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    let totalAmount = 0;
    const processedItems: any[] = [];

    // 1. Validate items and stock
    for (const item of items) {
      const [product]: any = await conn.query(`
        SELECT p.*, pr.retail_price, pr.wholesale_price, pr.min_wholesale_quantity, i.stock_level, i.reserved_stock
        FROM products p
        JOIN product_prices pr ON p.id = pr.product_id
        JOIN inventory i ON p.id = i.product_id
        WHERE p.id = ? AND p.is_active = TRUE
      `, [item.productId]);

      if (!product) throw new Error(`Product ${item.productId} not found`);
      if ((product.stock_level - product.reserved_stock) < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = item.quantity >= product.min_wholesale_quantity
        ? product.wholesale_price
        : product.retail_price;

      totalAmount += price * item.quantity;
      processedItems.push({ productId: product.id, quantity: item.quantity, unitPrice: price });
    }

    // 2. Create Order
    const orderResult = await conn.query(
      `INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, 'pending_payment')`,
      [auth.user.id, totalAmount]
    );
    const orderId = Number(orderResult.insertId);

    // 3. Insert Items & Reserve Stock
    for (const item of processedItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.unitPrice]
      );
      await conn.query(
        `UPDATE inventory SET reserved_stock = reserved_stock + ? WHERE product_id = ?`,
        [item.quantity, item.productId]
      );
    }

    // 4. Payment record
    await conn.query(
      `INSERT INTO payments (order_id, method, status) VALUES (?, ?, 'pending')`,
      [orderId, paymentMethod || 'transfer']
    );

    await conn.commit();
    return NextResponse.json({ orderId, totalAmount, status: 'pending_payment' }, { status: 201 });
  } catch (err: any) {
    if (conn) await conn.rollback();
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    if (conn) conn.release();
  }
}
