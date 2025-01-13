import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
    mascota_solicitante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    usuario_solicitante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mascota_solicitado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    usuario_solicitado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    estado: { type: String, enum: ["pendiente", "aceptado", "rechazado"] },
    fecha_solicitud: { type: Date, default: Date.now, required: true }
});

// Crear el modelo de Solicitud
const Solicitud = mongoose.model('Solicitud', solicitudSchema);

export default Solicitud;
