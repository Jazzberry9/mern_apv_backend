import express from "express";

import {    confirmar, 
            perfil, 
            registrar, 
            login,
            forgotPass,
            comprobarToken,
            nuevoPassword,
            actualizarPerfil,
            actualizarPassword
        } 
from "../controllers/veterinarios-controllers.js";

import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

// public
router.post('/', registrar);
router.post('/login', login);
router.get('/confirmar/:token', confirmar);
router.post('/forgot-password', forgotPass);
router.get('/forgot-password/:token', comprobarToken);
router.post('/forgot-password/:token', nuevoPassword);


// private
router.use(verifyToken);
router.get('/perfil', perfil);
router.put('/perfil/:id', actualizarPerfil)
router.put('/cambiar-password/', actualizarPassword)



export default router;