import { Router } from 'express';
import { webhookHandler } from '../controllers/pay.controller.js'; // Importamos el controlador

const router = Router();

// Ruta para recibir el webhook de Stripe
router.post('/webhook', webhookHandler);

export default router;
