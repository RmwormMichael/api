// models/Orders.js
import conectarDB from '../config/db.js';

class Orders {

    // Crear un nuevo pedido
    static async create(data) {
        const connection = await conectarDB();

        return new Promise(async (resolve, reject) => {
            try {
                let query, values;

                if (connection.query) {
                    // MySQL
                    query = `
                        INSERT INTO orders (id_user, status, date_order, direction, description)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    values = [
                        data.id_user,
                        data.status || 'en proceso',
                        data.date_order,
                        data.direction,
                        data.description
                    ];
                    connection.query(query, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                } else {
                    // PostgreSQL
                    query = `
                        INSERT INTO orders (id_user, status, date_order, direction, description)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *
                    `;
                    values = [
                        data.id_user,
                        data.status || 'en proceso',
                        data.date_order,
                        data.direction,
                        data.description
                    ];
                    const result = await connection.query(query, values);
                    resolve(result.rows[0]);
                }

            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }

    // Obtener todos los pedidos
    static async getAll() {
        const connection = await conectarDB();
        return new Promise(async (resolve, reject) => {
            try {
                let query = 'SELECT * FROM orders';
                if (connection.query) {
                    // MySQL
                    connection.query(query, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                } else {
                    // PostgreSQL
                    const result = await connection.query(query);
                    resolve(result.rows);
                }
            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }

    // Obtener un pedido por ID
    static async getById(id) {
        const connection = await conectarDB();
        return new Promise(async (resolve, reject) => {
            try {
                let query = 'SELECT * FROM orders WHERE id_order = ?';
                let values = [id];

                if (!connection.query) {
                    // PostgreSQL
                    query = 'SELECT * FROM orders WHERE id_order = $1';
                }

                if (connection.query) {
                    connection.query(query, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results.length ? results[0] : null);
                    });
                } else {
                    const result = await connection.query(query, values);
                    resolve(result.rows.length ? result.rows[0] : null);
                }

            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }

    // Obtener pedidos de un usuario
    // Obtener pedidos de un usuario - CORREGIDO
    static async getByUserId(userId) {
        const connection = await conectarDB();
        return new Promise(async (resolve, reject) => {
            try {
                let query = 'SELECT * FROM orders WHERE id_user = ? ORDER BY date_order DESC';
                let values = [userId];

                if (!connection.query) {
                    // PostgreSQL
                    query = 'SELECT * FROM orders WHERE id_user = $1 ORDER BY date_order DESC';
                }

                if (connection.query) {
                    connection.query(query, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                } else {
                    const result = await connection.query(query, values);
                    resolve(result.rows);
                }

            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }

    // Actualizar pedido por ID
    static async update(id, data) {
        const connection = await conectarDB();
        return new Promise(async (resolve, reject) => {
            try {
                const fields = Object.keys(data).map((key, i) => connection.query ? `${key} = ?` : `${key} = $${i + 1}`).join(', ');
                const values = Object.values(data);

                if (connection.query) {
                    // MySQL
                    values.push(id);
                    const query = `UPDATE orders SET ${fields} WHERE id_order = ?`;
                    connection.query(query, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                } else {
                    // PostgreSQL
                    values.push(id);
                    const query = `UPDATE orders SET ${fields} WHERE id_order = $${values.length} RETURNING *`;
                    const result = await connection.query(query, values);
                    resolve(result.rows[0]);
                }

            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }

    // Eliminar pedido por ID
    static async delete(id) {
        const connection = await conectarDB();
        return new Promise(async (resolve, reject) => {
            try {
                let query = 'DELETE FROM orders WHERE id_order = ?';
                let values = [id];

                if (!connection.query) {
                    // PostgreSQL
                    query = 'DELETE FROM orders WHERE id_order = $1 RETURNING *';
                }

                if (connection.query) {
                    connection.query(query, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                } else {
                    const result = await connection.query(query, values);
                    resolve(result.rows[0]);
                }

            } catch (err) {
                reject(err);
            }
        }).finally(() => {
            if (connection.end) connection.end();
        });
    }
}

export default Orders;
