// config/db.js
import pkg from "pg";
const { Pool } = pkg;
import mysql from "mysql2/promise"; // Solo para entorno local si lo necesitas

let pool = null;

const conectarDB = async () => {
  try {
    if (process.env.USE_POSTGRES === "true") {
      if (!pool) {
        pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        console.log("✅ Conectado a PostgreSQL en Render");
      }
      return pool;
    } else {
      // ✅ Para entorno LOCAL (MySQL Workbench)
      const mysqlConnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT || 3306,
        charset: "utf8mb4"
      });

      console.log(
        `✅ MySQL conectado en ${mysqlConnection.config.host}:${mysqlConnection.config.port}`
      );

      return mysqlConnection;
    }
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
