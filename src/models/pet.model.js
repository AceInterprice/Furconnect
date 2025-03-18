import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  imagen: {type: String, description: "Imagen de la mascota"},
  nombre: { type: String, required: true },
  raza: { type: String, required: true},
  tipo: { type: String, required: true },
  color: String,
  tamaño: { type: String, enum: ["pequeño", "mediano", "grande"] },
  edad: { type: Number, min: 1, required: true },
  sexo: { type: String, enum: ["macho", "hembra"], required: true },
  pedigree: { type: Boolean, default: false },
  vacunas: [{ type: String }],
  temperamento: String,
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  historial_cruzas: [
    {
      pareja_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
      fecha: { type: Date, required: true },
      exitoso: { type: Boolean, required: true }
    }
  ],
  media: [
    {
      type: String,
      description: "URL de imágenes o videos de la mascota",
    }
  ],
  pais: String,
  estado: String,
  ciudad: String,
  fecha_registro: { type: Date, default: Date.now }
});


const Pet = mongoose.model("Pet", petSchema);

export default Pet;
