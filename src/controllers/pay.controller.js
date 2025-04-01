import { handleStripeWebhook } from "../stripe/pay.js" // Importamos el servicio de Stripe

// Controlador para manejar el webhook de Stripe
export const webhookHandler = async (req, res) => {
    try {
        await handleStripeWebhook(req, res); // Llamamos al servicio para manejar el webhook
    } catch (error) {
        console.error('Error al procesar el webhook:', error);
        res.status(500).send('Error interno al procesar el webhook');
    }
};
