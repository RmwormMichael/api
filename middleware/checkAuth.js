// middleware/checkAuth.js
import jwt from "jsonwebtoken";
import conectarDB from "../config/db.js"; 

const checkAuth = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ msg: "No hay token, permiso denegado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const connection = await conectarDB();
        
        // Usar promesas en lugar de callback para mejor control
        const query = (conn, sql, params) => {
            return new Promise((resolve, reject) => {
                conn.query(sql, params, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        };

        try {
            const results = await query(
                connection, 
                "SELECT id_user, nombre, email, rol FROM user WHERE id_user = $1",
                [decoded.id]
            );

            if (results.length === 0) {
                if (connection.end) connection.end();
                return res.status(401).json({ msg: "Token no válido" });
            }

            req.usuario = results[0];
            
            // Cerrar conexión después de obtener los datos
            if (connection.end) connection.end();
            next();

        } catch (queryError) {
            if (connection.end) connection.end();
            console.error("Error en consulta:", queryError);
            return res.status(401).json({ msg: "Token no válido" });
        }

    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default checkAuth;