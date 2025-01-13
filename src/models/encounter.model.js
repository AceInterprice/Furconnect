import mongoose from 'mongoose';

const encuentroSchema = new mongoose.Schema({
  mascota_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  mascota2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  ubicacion: {
    ciudad: { type: String, required: true },
    calle: { type: String, required: true },
    nombre_lugar: { type: String, required: true }
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'completado', 'cancelado'],
    required: true
  },
  division: {
    type: String
  }
});

const Encuentro = mongoose.model('Encuentro', encuentroSchema);

export default Encuentro;
