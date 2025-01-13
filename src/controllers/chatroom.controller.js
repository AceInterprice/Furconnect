import ChatRoom from '../models/chatroom.model.js';

export const getChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({ usuarios: req.user.id }).populate('usuarios', 'nombre email');
        res.status(200).json(chatRooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getChatRoomById = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.id).populate('mensajes.sender', 'nombre email');
        if (!chatRoom) return res.status(404).json({ message: 'Sala de chat no encontrada' });
        res.status(200).json(chatRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
