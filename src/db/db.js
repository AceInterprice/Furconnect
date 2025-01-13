import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        process.exit(1); // Termina el proceso si hay un error
    }
};

export default connectDB;
