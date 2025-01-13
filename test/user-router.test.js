import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from '../src/routes/users.routes.js'; // Ruta de usuarios
import User from '../src/models/user.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Inicializa la aplicación de Express
const app = express();
app.use(bodyParser.json());
app.use(userRouter);

describe('User API Endpoints', () => {
  let mongoServer;

  beforeAll(async () => {
    // Configura MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Detiene MongoDB en memoria y cierra la conexión
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpia la base de datos antes de cada prueba
    await User.deleteMany();
  });

  // Test para obtener todos los usuarios
  it('GET /api/users - Should return all users (paginated)', async () => {
    const users = [
      { nombre: 'User1', email: 'user1@example.com', password: 'password1', estado: 'MX', pais: 'MX' },
      { nombre: 'User2', email: 'user2@example.com', password: 'password2', estado: 'US', pais: 'US' },
    ];
    await User.insertMany(users);

    const response = await request(app).get('/api/users?page=1&pageSize=1');
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(1);
    expect(response.body.totalUsers).toBe(2);
  });

  // Test para obtener un usuario por ID
  it('GET /api/users/:id - Should return a user by ID', async () => {
    const newUser = await User.create({
      nombre: 'User1',
      email: 'user1@example.com',
      password: 'password1',
      estado: 'MX',
      pais: 'MX',
    });

    const response = await request(app).get(`/api/users/${newUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('user1@example.com');
  });

  // Test para crear un nuevo usuario
  it('POST /api/users - Should create a new user', async () => {
    const userData = {
      nombre: 'User3',
      email: 'user3@example.com',
      password: 'password3',
      telefono: '1234567890',
      estado: 'MX',
      pais: 'MX',
    };

    const response = await request(app).post('/api/users').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('user3@example.com');
  });

  // Test para actualizar un usuario
  it('PUT /api/users/:id - Should update a user by ID', async () => {
    const newUser = await User.create({
      nombre: 'User4',
      email: 'user4@example.com',
      password: 'password4',
      estado: 'MX',
      pais: 'MX',
    });

    const updateData = { nombre: 'UpdatedUser4', estado: 'US' };

    const response = await request(app).put(`/api/users/${newUser._id}`).send(updateData);
    expect(response.status).toBe(200);
    expect(response.body.user.nombre).toBe('UpdatedUser4');
  });

  // Test para eliminar un usuario
  it('DELETE /api/users/:id - Should delete a user by ID', async () => {
    const newUser = await User.create({
      nombre: 'User5',
      email: 'user5@example.com',
      password: 'password5',
      estado: 'MX',
      pais: 'MX',
    });

    const response = await request(app).delete(`/api/users/${newUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuario eliminado');
  });

  // Test para inicio de sesión
  it('POST /api/login - Should login a user and return a token', async () => {
    const hashedPassword = await bcrypt.hash('password6', 10);
    await User.create({
      nombre: 'User6',
      email: 'user6@example.com',
      password: hashedPassword,
      estado: 'MX',
      pais: 'MX',
    });

    const loginData = { email: 'user6@example.com', password: 'password6' };

    const response = await request(app).post('/api/login').send(loginData);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
