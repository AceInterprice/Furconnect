import { Router } from 'express';
import { getCloudinarySignature } from "../controllers/cloudinary.Controller.js";

const router = Router();

// Ruta para obtener la firma de Cloudinary
router.get("/api/cloudinary-signature", getCloudinarySignature);

export default router;
