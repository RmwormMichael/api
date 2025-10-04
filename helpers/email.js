import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {

    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    //Informacion del email

    try {
      const info = await transport.sendMail({
          from: '"GloboStudio - Globos Artisticos" <cuentas@GloboStudio.com>',
          to: email,
          subject: "GloboStudio . Comprueba tu cuenta",
          text: "Comprueba tu cuenta en GloboStudio",
          html: `
              <p>Hola ${nombre} Comprueba tu cuenta en GloboStudio</p>
              <p>Tu cuenta ya casi esta lista, solo debes comprobar en el siguiente enlace</p>
              <a href="http://localhost:4000/api/usuarios/confirmar/${token}">Comprobar Cuenta</a>
              <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
          `,
      });
      console.log('Correo enviado:', info);
   } catch (error) {
      console.error('Error al enviar el correo:', error);
   }
   
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  // Cambia esta línea para usar query params en lugar de ruta
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;

  await transport.sendMail({
      from: '"GloboStudio - Globos Artisticos" <cuentas@GloboStudio.com>',
      to: email,
      subject: "GloboStudio - Reestablece tu Password",
      html: `
          <p>Hola ${nombre}, has solicitado reestablecer tu password de GloboStudio</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${resetUrl}">Restablecer Contraseña</a>
          <p>El enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      `,
  });
};