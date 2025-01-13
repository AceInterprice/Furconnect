import {
    obtenerSolicitudesRecibidas,
    obtenerSolicitudesEnviadas,
    actualizarEstadoSolicitud,
    obtenerTodasSolicitudesEnviadas,
    obtenerSolicitudesContestadas,
    getSolicitudes,
    createSolicitud,
    deleteSolicitudById,
} from '../services/solicitudes.service.js';
import ChatRoom from '../models/chatroom.model.js';


export const listSolicitudesRecibidas = async (req, res) => {
    try {
        const solicitudes = await obtenerSolicitudesRecibidas(req.user.id);
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listSolicitudesEnviadas = async (req, res) => {
    try {
        const solicitudes = await obtenerSolicitudesEnviadas(req.user.id);
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateSolicitudEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!['aceptado', 'rechazado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido.' });
        }

        const solicitud = await actualizarEstadoSolicitud(req.params.id, req.userId, estado);
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada o ya actualizada.' });

        // Si la solicitud es aceptada, crea una sala de chat
        if (estado === 'aceptado') {
            const chatRoom = new ChatRoom({
                usuarios: [solicitud.usuario_solicitante_id, solicitud.usuario_solicitado_id],
                solicitud: solicitud._id,
            });
            await chatRoom.save();

            // Aquí puedes emitir un evento a los usuarios conectados para que se unan a la sala de chat
            // Suponiendo que tengas acceso al objeto 'io' de Socket.IO, esto podría ser algo como:
            //io.to(solicitud.usuario_solicitante_id).emit("chatRoomCreated", chatRoom);
            //io.to(solicitud.usuario_solicitado_id).emit("chatRoomCreated", chatRoom);

            // Otras notificaciones o acciones aquí si las deseas (como enviar un mensaje de bienvenida)
        }

        res.status(200).json(solicitud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const listAllSolicitudesEnviadas = async (req, res) => {
    try {
        const solicitudes = await obtenerTodasSolicitudesEnviadas(req.user.id);
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listSolicitudesContestadas = async (req, res) => {
    try {
        const solicitudes = await obtenerSolicitudesContestadas(req.userId);
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listSolicitudes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const solicitudes = await getSolicitudes(page, limit);

        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const addSolicitud = async (req, res) => {
    try {
        const solicitudData = req.body; 
        const nuevaSolicitud = await createSolicitud(solicitudData);
        res.status(201).json({ message: 'Solicitud creada exitosamente', solicitud: nuevaSolicitud });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const removeSolicitud = async (req, res) => {
    try {
        await deleteSolicitudById(req.params.id);
        res.status(200).json({ message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
