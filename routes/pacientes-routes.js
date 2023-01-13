import express from 'express';
import {   
            agregarPacientes, 
            obtenerPaciente, 
            obtenerPacientes,
            actualizarPaciente,
            eliminarPaciente
        } 
from '../controllers/pacientes-controllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken)
router.get('/', obtenerPacientes)
router.get('/:id', obtenerPaciente)
router.put('/:id', actualizarPaciente)
router.delete('/:id', eliminarPaciente)
router.post('/', agregarPacientes)
    
    
    


export default router;