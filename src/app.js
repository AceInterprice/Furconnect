import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import petsRoutes from './routes/pets.routes.js';
import usersRoutes from './routes/users.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import chatRoomRoutes from './routes/chatroom.routes.js';  
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import connectDB from "./db/db.js";
import swaggerOptions from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors()); 
app.use(cookieParser());
app.use(morgan('dev'));

// 📌 Aumentar el límite para permitir archivos grandes
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

// 📌 Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.get('/chat2', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/chat/index.html'));
});

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/chat/script.js'));
});

// 📌 Middleware para mejorar compatibilidad con CORS y archivos grandes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 📌 Rutas de API
app.use(petsRoutes);
app.use(usersRoutes);
app.use(solicitudesRoutes);
app.use(chatRoomRoutes);

export default app;
