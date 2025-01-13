import { Router } from 'express';
import { getChatRooms, getChatRoomById } from '../controllers/chatroom.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/chatrooms', verifyToken, getChatRooms); // Listar todas las salas de chat del usuario
router.get('/chatrooms/:id', verifyToken, getChatRoomById); // Obtener detalles de una sala de chat

export default router;