import * as mariadb from 'mariadb';

// Singleton pool para reutilizar conexiones entre llamadas serverless
let pool: mariadb.Pool | null = null;

export function getPool(): mariadb.Pool {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 5,
      connectTimeout: 10000,
    });
  }
  return pool;
}
