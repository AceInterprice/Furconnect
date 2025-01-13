import Seguimiento from '../models/seguimiento.model.js';

// Crear un nuevo seguimiento
export const crearSeguimiento = async (seguimientoData) => {
    const seguimiento = new Seguimiento(seguimientoData);
    console.log(seguimientoData.actualizaciones.adjuntos)
    return await seguimiento.save();
};

// Obtener un seguimiento por el ID del encuentro
export const getSeguimientoByEncuentroId = async (encuentroId) => {
    return await Seguimiento.findOne({ encuentro_id: encuentroId });
};
export const getSeguimientos = async () => {
    return await Seguimiento.find().limit(7500);
};

// Actualizar un seguimiento por su ID
export const updateSeguimientoById = async (seguimientoId, updateData) => {
    return await Seguimiento.findByIdAndUpdate(seguimientoId, updateData, { new: true });
};

// Eliminar solicitud
export const deleteSeguimientoById = async (id) => {
    return await Seguimiento.findByIdAndDelete(id);
};