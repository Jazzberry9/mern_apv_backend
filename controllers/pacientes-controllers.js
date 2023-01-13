import Paciente from "../models/Pacientes.js";

export const obtenerPacientes = async( req, res ) => {

    // obtiene todos los pacientes del veterinario logueado
    const pacientes = await Paciente.find()
                            .where('veterinario')
                            .equals(req.vet)
    
    if(!pacientes){
        res.status(404).json({
            msg: "No hay pacientes todavia"
        })
        return
    }
    res.send(pacientes)
}
export const agregarPacientes = async( req, res ) => {

    const { nombre, propietario, email, sintomas, fecha } = req.body;
    // crea nuevo paciente
    const paciente = new Paciente({nombre, propietario, email, sintomas, fecha});
    // le asigna a paciente el id del veterinario que lo creo
    paciente.veterinario = req.vet._id;
    // guarda en la base de datos
    try {
        const pacienteSaved = await paciente.save();
        res.send(pacienteSaved);
    } catch (error) {
        console.log(error);    
    }
}
export const obtenerPaciente = async ( req, res ) => {

    const { id } = req.params;

    const paciente = await Paciente.findById( id );
    // confirma que el paciente exista
    if(!paciente){
        res.status(404).json({
            msg: "Paciente no encontrado"
        })
        return
    }

    // chequea que el paciente a encontrar haya sido creado por el mismo vet que lo busca
    if( paciente.veterinario._id.toString() !== req.vet._id.toString()){
        return res.status(403).json({msg: 'Accion no valida'});
    }

    res.send({msg: 'Paciente encontrado', paciente})
}
export const actualizarPaciente = async ( req, res ) => {
    const { id } = req.params;
    const { nombre, email, sintomas, propietario, fecha } = req.body;
    const paciente = await Paciente.findById( id );
    // confirma que el paciente exista
    if(!paciente){
        return res.status(404).json({msg: "Paciente no encontrado"})
    }
    // chequea que el paciente a encontrar haya sido creado por el mismo vet que lo busca
    if( paciente.veterinario._id.toString() !== req.vet._id.toString()){
        return res.status(403).json({msg: 'Accion no valida'});
    }
    // actualizar paciente
    try {
        const updatedPatient = await Paciente.findByIdAndUpdate(id, {nombre, email, sintomas, propietario, fecha}, { returnDocument: 'after' });
        return res.status(200).json(updatedPatient)
    } catch (error) {
        console.log(error)
    }
}
export const eliminarPaciente = async ( req, res ) => {
    const { id } = req.params;
    // confirma el id y que el paciente exista
    const paciente = await Paciente.findById(id);
    if(!paciente){
        return res.status(404).json({msg: 'Paciente not found'});
    }
    // chequea que el paciente a encontrar haya sido creado por el mismo vet que lo busca
    // el req.vet es del middleware
    if( paciente.veterinario._id.toString() !== req.vet._id.toString()){
        return res.status(403).json({msg: 'Accion no valida'});
    }

    try {
        await Paciente.findByIdAndDelete(id);
        return res.status(200).json({msg: 'Paciente eliminado'})
    } catch (error) {
        console.log(error);
    }
}