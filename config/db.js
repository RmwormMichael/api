// config/db.js
import mysql from "mysql2/promise"; // Soporta async/await
import pkg from "pg"; // Para PostgreSQL
const { Pool } = pkg;

let connection = null;

const conectarDB = async () => {
  try {
    // Detectar entorno por variable
    if (process.env.USE_POSTGRES === "true") {
      // ✅ CONEXIÓN A POSTGRES (Render)
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      await pool.connect();
      console.log("✅ Conectado a PostgreSQL en Render");
      connection = pool;
    } else {
      // ✅ CONEXIÓN A MYSQL LOCAL (Workbench)
      connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT || 3306,
        charset: "utf8mb4"
      });

      console.log(
        `✅ MySQL conectado en ${connection.config.host}:${connection.config.port}`
      );
    }

    return connection;
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
export { connection };
