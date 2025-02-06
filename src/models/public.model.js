import mongoose, { Schema } from "mongoose";

const publicSchema = new mongoose.Schema({
  imagen: [{
    type: String,
    description: "URL de la imagen de tu mascota"
  }],
  etiqueta: { type: String, enum: ["Cruza", "Social"], required: true },
  titulo: { type: String, required: true, minlength: 5, maxlength: 100 },
  descripcion: { type: String, required: true, minlength: 10, maxlength: 500 },
  mascota_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true
  },
  raza: { type: String, required: true },
  vacunas: [{ type: String }],
  sexo: { type: String, enum: ["macho", "hembra"], required: true },
  temperamento: { type: String, enum: ["Amigable", "Tímido", "Juguetón", "Tranquilo", "Otro"] },
  pedigree: { type: Boolean, default: false },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  telefono: {
    type: String,
    match: /^[0-9]{10}$/,
    description: "Número de teléfono de 10 dígitos."
  },
  ciudad: { type: String, required: true, index: true },
  estado: { type: String, required: true, index: true },
  pais: { type: String, required: true, index: true },
  fecha_publicacion: { type: Date, default: Date.now },
  estado_publicacion: {
    type: String,
    enum: ["Disponible", "Finalizado"],
    default: "Disponible",
    description: "Estado de la publicación"
  }
});

const publication = mongoose.model("Publication", publicSchema);

export default publication;
