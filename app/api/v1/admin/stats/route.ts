import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth-helpers';

// GET /api/v1/admin/stats — Admin: métricas del dashboard
export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const pool = getPool();
  let conn;
  try {
    conn = await pool.getConnection();

    const [revenueRow]: any = await conn.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'`
    );
    const [ordersRow]: any = await conn.query(
      `SELECT COUNT(*) as total FROM orders`
    );
    const [usersRow]: any = await conn.query(
      `SELECT COUNT(*) as total FROM users WHERE is_active = TRUE AND deleted_at IS NULL`
    );
    const [categoryRows]: any = await conn.query(`
      SELECT c.name, COUNT(oi.id) as sales
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY c.id, c.name
      ORDER BY sales DESC
      LIMIT 6
    `);
    const [monthlyRows]: any = await conn.query(`
      SELECT DATE_FORMAT(created_at, '%b') as name, SUM(total_amount) as value
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND status != 'cancelled'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY MIN(created_at) ASC
    `);
    const [recentRows]: any = await conn.query(`
      SELECT 
        o.id,
        CONCAT('ORD-JL-', LPAD(o.id, 4, '0')) as order_code,
        CONCAT(u.first_name, ' ', u.last_name) as customer,
        o.total_amount as total,
        o.status,
        DATE_FORMAT(o.created_at, '%d/%m %H:%i') as date
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      totalRevenue: Number(revenueRow?.total || 0),
      totalOrders: Number(ordersRow?.total || 0),
      activeUsers: Number(usersRow?.total || 0),
      categories: JSON.parse(JSON.stringify(categoryRows, (_, v) => typeof v === 'bigint' ? Number(v) : v)),
      monthly: JSON.parse(JSON.stringify(monthlyRows, (_, v) => typeof v === 'bigint' ? Number(v) : v)),
      recentOrders: JSON.parse(JSON.stringify(recentRows, (_, v) => typeof v === 'bigint' ? Number(v) : v))
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
