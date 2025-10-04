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
                if (error || results.length === 0) {
                    return res.status(401).json({ msg: "Token no válido" });
                }

                req.usuario = results[0];  // Incluye el rol del usuario
                next();
            }
        );

        connection.end();
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default checkAuth;
