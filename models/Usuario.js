// models/Usuario.js
import conectarDB from '../config/db.js';
import bcrypt from 'bcrypt';

class Usuario {

  static async create(data) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      data.password = await Usuario.hashPassword(data.password);

      const query = `
        INSERT INTO "user" (nombre, email, password, rol, token)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_user
      `;
      const values = [
        data.nombre,
        data.email,
        data.password,
        data.rol,
        data.token
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getAll() {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user"`;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user" WHERE id_user = $1`;
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async findOneByToken(token) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user" WHERE token = $1 LIMIT 1`;
      const result = await client.query(query, [token]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async update(id, updates) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const keys = Object.keys(updates);
      const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = [...Object.values(updates), id];

      const query = `
        UPDATE "user"
        SET ${setQuery}
        WHERE id_user = $${keys.length + 1}
      `;
      await client.query(query, values);

      return true;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `DELETE FROM "user" WHERE id_user = $1`;
      await client.query(query, [id]);
      return true;
    } finally {
      client.release();
    }
  }

  static async searchByName(name) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user" WHERE nombre ILIKE $1`;
      const result = await client.query(query, [`%${name}%`]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findOne(email) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user" WHERE email = $1 LIMIT 1`;
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async comprobarPassword(email, password) {
    const pool = await conectarDB();
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM "user" WHERE email = $1 LIMIT 1`;
      const result = await client.query(query, [email]);

      if (result.rows.length === 0) return false;

      const usuario = result.rows[0];
      return await bcrypt.compare(password, usuario.password);
    } finally {
      client.release();
    }
  }
}

export default Usuario;
