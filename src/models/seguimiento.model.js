import mongoose from 'mongoose';

const seguimientoSchema = new mongoose.Schema({
  encuentro_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Encuentro',
    required: true
  },
  exitoso: {
    type: Boolean,
    required: true
  },
  actualizaciones: [
    {
      reporte_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },
      asunto: {
        type: String,
        required: true
      },
      descripcion: {
        type: String,
        required: true
      },
      adjuntos: [
        {
          tipo: {
            type: String,
            required: false
          },
          url: {
            type: String,
            required: false,
            match: /^(http|https):\/\/.*$/
          }
        }
      ]
    }
  ]
});

const Seguimiento = mongoose.model('Seguimiento', seguimientoSchema);

export default Seguimiento;
