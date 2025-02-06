import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import petsRoutes from './routes/pets.routes.js';
import usersRoutes from './routes/users.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import encountersRoutes from './routes/encounters.routes.js';
import seguimientoRoutes from './routes/seguimiento.routes.js';
import chatRoomRoutes from './routes/chatroom.routes.js'; 
import publicationRoutes from './routes/publication.routes.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import connectDB from "./db/db.js";
import swaggerOptions from './swagger.js';


const __filename = fileURLToPath(import.meta.url); // Obtener el nombre del archivo actual
const __dirname = path.dirname(__filename); // Obtener el directorio del archivo actual

const app = express();

app.use(cors()); // Permitir todos los orígenes
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
connectDB();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

// Ajustar la ruta para servir archivos estáticos desde la carpeta 'public' fuera de 'src'
app.use(express.static(path.join(__dirname, '../public')));

app.get('/chat2', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/chat/index.html'));
  });

  app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/chat/script.js'));
  });
// Rutas de API
app.use(petsRoutes);
app.use(usersRoutes);
app.use(solicitudesRoutes);
app.use(encountersRoutes);
app.use(seguimientoRoutes);
app.use(chatRoomRoutes);
app.use(publicationRoutes);
export default app;