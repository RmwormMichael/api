// models/Orders.js
import conectarDB from '../config/db.js';

class Orders {


    
    static async create(data) {
        const connection = await conectarDB();
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO orders (id_user, status, date_order, direction, description) 
                VALUES (?, ?, ?, ?, ?)
            `;

            connection.query(query, [
                data.id_user,
                data.status || 'en proceso', // Si no se envía, asigna 'en proceso'
                data.date_order,
                data.direction,
                data.description
            ], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }).finally(() => {
            connection.end();
        });
    }






    // Obtener todos los pedidos
    static async getAll() {
        const connection = await conectarDB();
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM orders', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);  // Devuelve todos los pedidos
                }
            });
        }).finally(() => {
            connection.end();  // Cierra la conexión
        });
    }

    // Obtener un pedido por su ID
    static async getById(id) {
        const connection = await conectarDB();
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM orders WHERE id_order = ?', [id], (error, results) => {
                if (error) {
                    reject(error);
                } else if (results.length === 0) {
                    resolve(null);  // Si no se encuentra el pedido
                } else {
                    resolve(results[0]);  // Devuelve el pedido encontrado
                }
            });
        }).finally(() => {
            connection.end();
        });
    }

    // Obtener todos los pedidos de un usuario específico
static async getByUserId(userId) {
    const connection = await conectarDB();
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM orders WHERE id_user = ?', [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }).finally(() => {
        connection.end();
    });
}

    
    
    // Actualizar un pedido por su ID
    static async update(id, data) {
        const connection = await conectarDB();
        return new Promise((resolve, reject) => {
            connection.query('UPDATE orders SET ? WHERE id_order = ?', [data, id], (error, results) => {
                if (error) {
                    reject(error);
                } else if (results.affectedRows === 0) {
                    resolve(null);  // Si no se actualizó ningún pedido
                } else {
                    resolve(results);
                }
            });
        }).finally(() => {
            connection.end();
        });
    }


    
    // Eliminar un pedido por su ID
    static async delete(id) {
        const connection = await conectarDB();
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM orders WHERE id_order = ?', [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);  // Retorna el resultado de la eliminación
                }
            });
        }).finally(() => {
            connection.end();
        });
    }
}

export default Orders;