import Solicitud from '../models/solicitud.model.js';

// Obtener solicitudes donde el usuario es el solicitado
export const obtenerSolicitudesRecibidas = async (usuarioId) => {
    return await Solicitud.find({ usuario_solicitado_id: usuarioId }).populate('mascota_solicitante_id mascota_solicitado_id');
};

// Obtener solicitudes donde el usuario es el solicitante
export const obtenerSolicitudesEnviadas = async (usuarioId) => {
    return await Solicitud.find({ usuario_solicitante_id: usuarioId }).populate('mascota_solicitante_id mascota_solicitado_id');
};

// Actualizar estado de una solicitud (aceptar o rechazar)
export const actualizarEstadoSolicitud = async (solicitudId, usuarioId, estado) => {
    return await Solicitud.findOneAndUpdate(
        { _id: solicitudId, estado: 'pendiente' },
        { estado },
        { new: true }
    );
};

// Obtener todas las solicitudes hechas por el usuario
export const obtenerTodasSolicitudesEnviadas = async (usuarioId) => {
    return await Solicitud.find({ usuario_solicitante_id: usuarioId }).populate('mascota_solicitante_id mascota_solicitado_id');
};

// Obtener todas las solicitudes contestadas por el usuario
export const obtenerSolicitudesContestadas = async (usuarioId) => {
    return await Solicitud.find({
        usuario_solicitado_id: usuarioId,
        estado: { $in: ['aceptado', 'rechazado'] }
    }).populate('mascota_solicitante_id mascota_solicitado_id');
};

export const getSolicitudes = async (page, limit) => {
    const skip = (page - 1) * limit; // Calcula el número de documentos a omitir
    const requests = await Solicitud.find()
        .skip(skip)
        .limit(limit)
        .populate('mascota_solicitante_id mascota_solicitado_id');

    const total = await Solicitud.countDocuments(); // Total de solicitudes

    return {
        total,
        page,
        pages: Math.ceil(total / limit),
        requests
    };
};


// Crear una nueva solicitud
export const createSolicitud = async (data) => {
    const nuevaSolicitud = new Solicitud(data);
    return await nuevaSolicitud.save();
};

// Buscar solicitud por ID
export const findSolicitudById = async (id) => {
    return await Solicitud.findById(id).populate('mascota_solicitante_id usuario_solicitante_id mascota_solicitado_id usuario_solicitado_id');
};

// Eliminar solicitud
export const deleteSolicitudById = async (id) => {
    return await Solicitud.findByIdAndDelete(id);
};
