import nodemailer from 'nodemailer';

const emailForgotPass = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
    });

    const { email, nombre, token } = datos;

    // Enviar el email
    let info = await transport.sendMail({
        from: 'Random page, puedo colocar anything', 
        to: email, 
        subject: 'Restablece tu password', 
        text: "Restablece tu password", 
        html: `<p>Hola ${nombre}, has solicitado restablecer tu password.</p>
                <p>Sigue el siguiente enlace para generar un nuevo password: <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a></p>

                <p>Si no solicitaste este email, ignora este correo</p>
        
        `,
      });

      console.log("mensaje enviado: ", info.messageId)
}

export default emailForgotPass;