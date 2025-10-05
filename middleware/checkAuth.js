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
        console.log('Token decodificado - ID:', decoded.id);

        const pool = await conectarDB();
        
        try {
            // CORRECCIÓN: Usar id_user en lugar de id
            const query = 'SELECT id_user, nombre, email, rol FROM "user" WHERE id_user = $1';
            const result = await pool.query(query, [decoded.id]);
            
            console.log('Resultados de la consulta:', result.rows);

            if (result.rows.length === 0) {
                return res.status(401).json({ msg: "Usuario no encontrado" });
            }

            // CORRECCIÓN: Usar id_user en lugar de id
            req.usuario = {
                id_user: result.rows[0].id_user,
                nombre: result.rows[0].nombre,
                email: result.rows[0].email,
                rol: result.rows[0].rol
            };
            
            console.log('Usuario autenticado:', req.usuario);
            next();

        } catch (queryError) {
            console.error("Error en consulta SQL:", queryError);
            return res.status(401).json({ msg: "Error en autenticación" });
        }

    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default checkAuth;