import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import chatroomRouter from '../src/routes/chatroom.routes.js'; // Ruta de salas de chat
import ChatRoom from '../src/models/chatroom.model.js';
import User from '../src/models/user.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

// Inicializa la aplicación de Express
const app = express();
app.use(bodyParser.json());
app.use(chatroomRouter);

describe('Chatroom API Endpoints', () => {
  let mongoServer;
  let token;
  let user;

  beforeAll(async () => {
    // Configura MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Crea un usuario de prueba y genera un token de autenticación
    user = await User.create({
      nombre: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      estado: 'MX',
      pais: 'MX',
    });

    token = jwt.sign({ id: user._id }, 'test_secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    // Detiene MongoDB en memoria y cierra la conexión
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpia las colecciones antes de cada prueba
    await ChatRoom.deleteMany();
  });

  // Test para obtener todas las salas de chat del usuario
  it('GET /chatrooms - Should return all chatrooms for the user', async () => {
    // Crea salas de chat de prueba
    const chatRooms = [
      { usuarios: [user._id], mensajes: [] },
      { usuarios: [user._id], mensajes: [] },
    ];
    await ChatRoom.insertMany(chatRooms);

    const response = await request(app)
      .get('/chatrooms')
      .set('Authorization', `Bearer ${token}`); // Envía el token en la cabecera

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].usuarios[0].nombre).toBe('Test User');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  // Test para obtener detalles de una sala de chat por ID
  it('GET /chatrooms/:id - Should return chatroom details by ID', async () => {
    // Crea una sala de chat de prueba
    const chatRoom = await ChatRoom.create({
      usuarios: [user._id],
      mensajes: [
        {
          sender: user._id,
          contenido: 'Hola, este es un mensaje de prueba',
        },
      ],
    });

    const response = await request(app)
      .get(`/chatrooms/${chatRoom._id}`)
      .set('Authorization', `Bearer ${token}`); // Envía el token en la cabecera

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(chatRoom._id.toString());
    expect(response.body.mensajes[0].contenido).toBe('Hola, este es un mensaje de prueba');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  // Test para manejar cuando no se encuentra una sala de chat
  it('GET /chatrooms/:id - Should return 404 if chatroom is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/chatrooms/${fakeId}`)
      .set('Authorization', `Bearer ${token}`); // Envía el token en la cabecera

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Sala de chat no encontrada');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  // Test para manejo de errores del servidor
  it('GET /chatrooms - Should return 500 if an error occurs', async () => {
    // Simula un error en la base de datos desconectándola temporalmente
    await mongoose.disconnect();

    const response = await request(app)
      .get('/chatrooms')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();

    // Reconecta la base de datos para las siguientes pruebas
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});
