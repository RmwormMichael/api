import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

// Registrar un nuevo usuario
const registrar = async (req, res) => {
    const { email, nombre, password } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne(email);
    if (existeUsuario) {
        return res.status(400).json({ msg: "Usuario ya registrado" });
    }

    try {
        // Crear el objeto de datos para el nuevo usuario
        const usuarioData = {
            nombre,
            email,
            password,
            rol: "cliente",
            token: generarId(),  // Generar un token para la confirmación de cuenta
        };

        // Crear el usuario en la base de datos
        await Usuario.create(usuarioData);

        // Enviar el email de confirmación
        await emailRegistro({
            email: usuarioData.email,
            nombre: usuarioData.nombre,
            token: usuarioData.token, 
        });

        res.status(200).json({ msg: "Usuario registrado correctamente. Revisa tu email para confirmar tu cuenta." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};


// Autenticar usuario o iniciar sesión
const autenticar = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    try {
        const usuario = await Usuario.findOne(email);
        console.log("Usuario encontrado:", usuario);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const esValido = await Usuario.comprobarPassword(email, password);
        console.log("Contraseña válida:", esValido);

        if (!esValido) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const usuarioSinSensibles = {
            id: usuario.id_user,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
        };

        const token = generarJWT(usuario.id_user, usuario.rol);
        console.log("Token generado:", token);

        res.status(200).json({
            message: 'Usuario autenticado',
            usuario: usuarioSinSensibles,
            token
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};




// Confirmar cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    try {
        const usuario = await Usuario.findOneByToken(token);

        if (!usuario) {
            return res.status(404).json({ msg: "Token no válido o cuenta ya confirmada" });
        }

        // Actualizar la columna confirmed a true
        await Usuario.update(usuario.id_user, { confirmed: true });

        
        console.log("Cuenta confirmada para:", usuario.email);

        // ✅ Redirige al frontend después de confirmar
        res.redirect('http://127.0.0.1:5503/confirmed.html');

    } catch (error) {
        console.error("Error al confirmar la cuenta:", error);
        res.status(500).json({ msg: "Error al confirmar la cuenta" });
    }
};




// Olvidé mi contraseña
const olvidePassword = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne(email);
        if (!usuario) {
            return res.status(404).json({ msg: "El usuario no existe" });
        }

        const token = generarId();
        await Usuario.update(usuario.id_user, { token });

        await emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token,
        });

        res.status(200).json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al generar el token para el cambio de contraseña" });
    }
};


// Comprobar token
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOneByToken(token);
    if (usuario) {
        res.json({ msg: "Token válido" });
    } else {
        res.status(404).json({ msg: "Token no válido" });
    }
};


// Cambiar contraseña
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const usuario = await Usuario.findOneByToken(token);
        if (!usuario) {
            return res.status(404).json({ msg: "Token no válido" });
        }

        const hashedPassword = await Usuario.hashPassword(password);
        await Usuario.update(usuario.id_user, { 
            password: hashedPassword, 
            token: null  // Eliminar el token después de usarlo
        });

        res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al cambiar la contraseña" });
    }
};



// Obtener perfil del usuario autenticado
const perfil = async (req, res) => {
    res.json({
        id: req.usuario.id_user,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });
};




// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ msg: "Error al obtener los usuarios" });
    }
};




// actualizar un usuario
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    try {
        const usuario = await Usuario.getById(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const updates = {};
        if (nombre) updates.nombre = nombre;
        if (email) updates.email = email;
        if (password) updates.password = await Usuario.hashPassword(password);
        if (rol) updates.rol = rol;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ msg: "No se enviaron datos para actualizar." });
        }

        await Usuario.update(id, updates);

        res.json({ msg: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el usuario" });
    }
};





// Obtener un usuario por su ID
const getUserById =  async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await Usuario.getById(id);
      if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al obtener el usuario" });
    }
}

// Eliminar un usuario por su ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Usuario.delete(id);
      if (!result) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }
      res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al eliminar el usuario" });
    }
  }



export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    getUsuarios,
    updateUsuario,
    getUserById,
    deleteUser
};
