import Stripe from 'stripe';
import User from '../models/user.model.js'; // Asegúrate de importar el modelo de User

// Inicializamos Stripe con la clave secreta desde las variables de entorno
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

// Función para manejar el webhook de Stripe
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature']; // Obtenemos la firma del webhook
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Usar el secret del webhook desde las variables de entorno

    let event;

    try {
        // Verificamos que la firma del webhook sea válida
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log('Error de verificación del webhook:', err.message);
        return res.status(400).send('Webhook Error'); // Responder con error si no es válido
    }

    // Manejo del evento checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object; // Extraemos la sesión de pago

        // Verifica que el pago se haya completado correctamente
        if (session.payment_status === 'paid') {
            const userId = session.metadata.userId; // Obtener el ID del usuario desde metadata

            try {
                // Buscar al usuario en la base de datos utilizando su ID
                const user = await User.findById(userId);

                if (user) {
                    // Actualizamos el estatus del usuario a 'premium'
                    user.estatus = 'premium'; 
                    await user.save(); // Guardamos el usuario con el nuevo estatus

                    console.log('💰 Pago exitoso, estatus actualizado a PREMIUM para el usuario:', userId);
                } else {
                    console.log('Usuario no encontrado con el ID:', userId);
                }
            } catch (error) {
                console.error('Error al actualizar el estatus del usuario:', error);
                res.status(500).send('Error interno al procesar el webhook');
                return;
            }
        }
    }

    // Responder con éxito a Stripe para que el webhook sea reconocido
    res.status(200).send('Evento recibido');
};
