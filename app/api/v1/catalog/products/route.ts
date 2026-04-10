import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT p.*, 
             pr.retail_price, pr.wholesale_price, pr.min_wholesale_quantity, pr.currency,
             c.name as category_name
      FROM products p
      JOIN product_prices pr ON p.id = pr.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE AND p.deleted_at IS NULL
    `);
    // Convert BigInt to number for JSON serialization
    const products = JSON.parse(JSON.stringify(rows, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    ));
    return NextResponse.json(products);
  } catch (err) {
    console.error('Catalog fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Not Implemented - Admin Role Required' }, { status: 501 });
}
