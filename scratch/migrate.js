const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

async function migrate() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT) || 3306,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME
        });

        console.log("Conectado a la base de datos.");

        // Crear la tabla si no existe
        await conn.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                \`key\` VARCHAR(100) NOT NULL UNIQUE,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'settings' verificada/creada.");

        // Verificar si existe consultando el esquema
        const rows = await conn.query("SHOW TABLES LIKE 'settings'");
        if (rows.length > 0) {
            console.log("Confirmación: La tabla 'settings' existe en la base de datos.");
        } else {
            console.log("Error: La tabla 'settings' no se encontró después de la creación.");
        }

    } catch (err) {
        console.error("Error durante la migración:", err);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
