import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
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
        subject: 'Confirmar tu correo en nuestro sitio APV', 
        text: "Confirmar correo APV", 
        html: `<p>Hola ${nombre}, bienvenido a APV, necesitamos que compruebes tu email</p>
                <p>Tu cuenta esta lista, solo debes seguir el siguiente enlace para<a href="${process.env.FRONTEND_URL}/confirmar/${token}"> confirmarla</a></p>

                <p>Si tu no creaste esta cuenta, ignora este correo</p>
        
        `,
      });

      console.log("mensaje enviado: ", info.messageId)
}

export default emailRegistro;