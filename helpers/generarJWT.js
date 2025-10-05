// helpers/generarJWT.js
import jwt from "jsonwebtoken";

const generarJWT = (id_user, rol) => {  // ← Cambiar parámetro a id_user
    return jwt.sign({ 
        id: id_user,  // ← Mantener 'id' aquí porque es lo que espera JWT
        rol  
    }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
};

export default generarJWT;