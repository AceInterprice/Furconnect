import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^.+@.+\..+$/,
    description: "Debe ser un email válido."
  },
  password: { type: String, required: true, 
    validate: {
      validator: function(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
    }
   },
  telefono: {
    type: String,
    match: /^[0-9]{10}$/, 
    description: "Número de teléfono de 10 dígitos."
  },
  ciudad: String,
  estado: { type: String, required: true },
  pais: { type: String, required: true },
  calificaciones: [
    {
      id_reseñador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      puntuacion: { type: Number, min: 0, max: 5 },
      comentario: String
    }
  ],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Campo opcional para el rol
  fecha_creacion: { type: Date, default: Date.now } // Fecha de creación
});


const User = mongoose.model("User", userSchema);

export default User;
