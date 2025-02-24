import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const getCloudinarySignature = (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    
    // 🔹 Cloudinary requiere que la clave secreta esté fuera de los parámetros
    const stringToSign = `timestamp=${timestamp}&upload_preset=${process.env.CLOUDINARY_UPLOAD_PRESET}`;
    const signature = crypto
        .createHash("sha256")
        .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
        .digest("hex");

    res.json({
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
};

