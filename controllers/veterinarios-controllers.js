import Veterinario from "../models/Veterinario.js";
import { generarJWT } from "../helpers/generarJWT.js";
import random from '../helpers/generarID.js';
import emailRegistro from "../helpers/emailRegister.js";
import emailForgotPass from "../helpers/emailForgotPass.js";

import bcrypt from 'bcrypt';

export const registrar = async ( req, res) => {

    try {

        const { email, password, nombre } = req.body;

        const verificarEmail = await Veterinario.findOne({email})

        if( verificarEmail ){
            res.status(400).send({
                error: "Email ya registrado en la base de datos"
            })
            return;
        }
        // crear veterinario
        const veterinario = new Veterinario({nombre, email, password});
        // hashear password
        const salt = await bcrypt.genSalt(10);
        veterinario.password = await bcrypt.hash(password, salt)

        // mandar email al correo creado
        emailRegistro({
            nombre,
            email,
            token: veterinario.token
        });

        // guardar veterinario
        await veterinario.save();
        
        // mandar info vet
        res.send({
            veterinario
        })
    
    } catch (error) {
        console.log(error);
    }
}
export const perfil = ( req, res) => {

    const { vet } = req

    res.json( vet )
}
export const confirmar = async ( req, res ) => {

        const { token } = req.params;
        const verificarToken = await Veterinario.findOne({token});
        
        if( !verificarToken ){
            res.status(404).send({
                msg: 'Token no valido'
            })
            return
        }

        try {
            await Veterinario.findOneAndUpdate({token},{ confirmed: true, token : null});

            res.status(200).json({
                msg: 'Usuario verificado'
            });

        } catch (error) {
            console.log(error);
        }
}
export const login = async ( req, res ) => {

    const { email, password } = req.body;

    // comrpobar si el usuario existe
    const usuario = await Veterinario.findOne({ email })
    if(!usuario){
        res.status(403).json({
            msg: 'el usuario no existe'
        });
        return;
    }
    // comprobar si el usuario esta confirmado
    if(!usuario.confirmed){
        res.status(403).json({
            msg: 'Tu cuenta no ha sido confirmada'
        })
        return;
    }

    // revisar si el password es correcto
    const comprobarPassword = await bcrypt.compare(password, usuario.password);
    if(!comprobarPassword){
        res.status(403).json({
            msg: 'password incorrecta'
        });
        return;
    }
    
    // arreglando problema de login con el front
    usuario.token =  generarJWT(usuario.id);
    res.status(200).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });


}
export const forgotPass = async ( req, res ) => {
    const { email } = req.body;

    const verifyUser = await Veterinario.findOne({email});

    if( !verifyUser){
        res.status(404).json({
            msg: "Error, usuario no encontrado"
        })
    }
    try {
        verifyUser.token = random();
        await verifyUser.save();
        const { nombre, token } = verifyUser;
        // enviar email con instrucciones
        emailForgotPass({
            email,
            nombre,
            token
        })

        res.status(200).json({
            msg: "Correo enviado con las instrucciones para restaurar tu correo"
        })
    
    } catch (error) {
        console.log(error);    
    }

}
export const comprobarToken = async ( req, res ) => {
    const { token } = req.params;

    const isTokenValid = await Veterinario.findOne({token});

    if(!isTokenValid){
        res.status(400).json({
            msg: "invalid token"
        });
        return;
    }
    res.status(200).json({
        msg: "Token valido, el usuario existe"
    })
}
export const nuevoPassword = async ( req, res ) => {
    const { token } = req.params;
    const { password } = req.body;

    if(!token || !password){
        res.status(404).json({msg: "token or password not found"});
    }

    const user = await Veterinario.findOne({ token });
    if(!user){
        res.status(400).json({
            msg: 'Hubo un error'
        });
    }

    try {
        user.token = null;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).json({ msg: "nueva password guardada"});

    } catch (error) {
        console.log(error);
    }


}
export const actualizarPerfil = async ( req, res ) => {

    // extraer del body
    const { id } = req.params;
    const { nombre, email, web, telefono } = req.body;
    // chequea si el email en body ya existe en bd
    const usuario = await Veterinario.findById(id);
    if(!usuario){
        res.status(400).json({
            msg: 'Error papa'
        })
        return;
    }
    // si es diferente, lo esta cambiando
    if(usuario.email !== email){
        const emailExist = await Veterinario.findOne({email});
        if(emailExist){
            res.status(400).json({
                msg: 'existe en bd'
            })
        return
        }
    }

    try {
        // guarda info en bd
        const mrVet = await Veterinario.findByIdAndUpdate(id, {nombre, email, web, telefono}, { returnDocument: 'after' });
        await mrVet.save()
        res.status(200).json(
            mrVet
        )
    } catch (error) {
        console.log(error);
    }

        
}
export const actualizarPassword = async ( req, res ) => {
    // leer los datos
    const { id } = req.vet;
    const { pwd_actual, pwd_nuevo  } = req.body;

    // comprobar que el veterinario exista
    const usuario = await Veterinario.findById(id);
    if(!usuario){
        res.status(400).json({
            msg: 'Error papa'
        })
        return;
    }

    // comprobar su password
    const comprobarPassword = await bcrypt.compare(pwd_actual, usuario.password);
    if(!comprobarPassword){
        res.status(403).json({
            msg: 'password incorrecta'
        });
        return;
    }
    
    // almacenar el nuevo password
    try {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(pwd_nuevo, salt)
        await usuario.save()

        res.status(200).json({
            msg: 'Password almacenado en la bd'
        })
        
    } catch (error) {
        console.log(error);
    }
    
}




  
