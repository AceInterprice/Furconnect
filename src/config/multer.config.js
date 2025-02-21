import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

// Función para crear almacenamiento dinámico en Cloudinary
const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName, // Carpeta dinámica (ej. "usuarios" o "mascotas")
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: (req, file) => Date.now() + "-" + file.originalname, // Generar un ID único
    },
  });
};

// Crear dos almacenamientos diferentes
const uploadMascota = multer({ storage: createStorage("mascotas") });
const uploadMedia = multer({storage: createStorage("Media")}); 
const uploadUsuario = multer({ storage: createStorage("usuarios") });

export { uploadMascota, uploadMedia, uploadUsuario };
