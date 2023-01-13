import mongoose, { Schema } from 'mongoose';
import random from '../helpers/generarID.js';

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now(),
        required: true
    },
    sintomas: {
        type: String,
        default: null,
        required: true
    },
    veterinario: {
        type: Schema.Types.ObjectId,
        ref: 'Veterinario'
    }
    }, 
    {
        timestamps: true
    }
);

const Paciente = mongoose.model('Paciente', pacientesSchema);
export default Paciente;