// models/Orders.js - VERSIÓN CORREGIDA
import conectarDB from '../config/db.js';

class Orders {
    // Crear un nuevo pedido
    static async create(data) {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO orders (id_user, status, date_order, direction, description)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const values = [
                data.id_user,
                data.status || 'en proceso',
                data.date_order,
                data.direction,
                data.description
            ];

            const result = await client.query(query, values);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    // Obtener todos los pedidos
    static async getAll() {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const query = `
                SELECT o.*, u.nombre as usuario_nombre 
                FROM orders o 
                LEFT JOIN "user" u ON o.id_user = u.id_user 
                ORDER BY o.date_order DESC
            `;
            const result = await client.query(query);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Obtener un pedido por ID
    static async getById(id) {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const query = `
                SELECT o.*, u.nombre as usuario_nombre 
                FROM orders o 
                LEFT JOIN "user" u ON o.id_user = u.id_user 
                WHERE o.id_order = $1
            `;
            const result = await client.query(query, [id]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    // Obtener pedidos de un usuario
    static async getByUserId(userId) {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const query = `
                SELECT * FROM orders 
                WHERE id_user = $1 
                ORDER BY date_order DESC
            `;
            const result = await client.query(query, [userId]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Actualizar pedido
    static async update(id, updates) {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const keys = Object.keys(updates);
            const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = [...Object.values(updates), id];

            const query = `
                UPDATE orders 
                SET ${setQuery} 
                WHERE id_order = $${keys.length + 1}
                RETURNING *
            `;
            const result = await client.query(query, values);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    // Eliminar pedido
    static async delete(id) {
        const pool = await conectarDB();
        const client = await pool.connect();
        try {
            const query = `DELETE FROM orders WHERE id_order = $1 RETURNING *`;
            const result = await client.query(query, [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

export default Orders;