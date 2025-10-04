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
        connection.query(
            "SELECT id_user, nombre, email, rol FROM user WHERE id_user = ?",
            [decoded.id],
            (error, results) => {
                // NO cierres la conexión aquí dentro del callback
                if (error || results.length === 0) {
                    if (connection.end) connection.end(); // Solo cerrar si hay error
                    return res.status(401).json({ msg: "Token no válido" });
                }

                req.usuario = results[0];
                if (connection.end) connection.end(); // Cerrar después de usar los resultados
                next();
            }
        );

    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default checkAuth;