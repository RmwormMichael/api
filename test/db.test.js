import conectarDB from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Prueba de conexión a la base de datos', () => {
  test('Verifica variables de entorno', () => {
    console.log('Credenciales MySQL:', {
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
  });

  test('Debería conectarse correctamente', async () => {
    const connection = await conectarDB();
    const [rows] = await connection.query('SELECT 1 + 1 AS resultado');
    expect(rows[0].resultado).toBe(2);
    await connection.end();
  }, 10000);
});