import request from 'supertest';
import app from '../src/app.js';  // Asegúrate de que la app de Express esté exportada correctamente
import mongoose from 'mongoose';
import Pet from '../src/models/pet.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Crea una instancia de MongoMemoryServer para las pruebas
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // Crea un servidor MongoDB en memoria
  const mongoUri = mongoServer.getUri();  // Obtiene la URI de la base de datos en memoria

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();  // Elimina todos los datos al finalizar
  await mongoose.connection.close();
  await mongoServer.stop();  // Detiene el servidor de MongoDB en memoria
});

// Test para crear una nueva mascota
describe('POST /api/newpet', () => {
  it('should create a new pet', async () => {
    const newPet = {
      usuario_id: mongoose.Types.ObjectId(), // ID ficticio de usuario
      nombre: 'Fido',
      raza: 'Chihuahua',
      tipo: 'Venado',
      color: 'Negro',
      tamaño: 'pequeño',
      edad: 2,
      sexo: 'macho',
      pedigree: true,
      vacunas: ['rabia', 'moquillo'],
      temperamento: 'fiel',
      historial_cruzas: [],
      media: ['https://example.com/pet.jpg']
    };

    const response = await request(app)
      .post('/api/newpet')
      .send(newPet)
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Mascota registrada exitosamente');
    expect(response.body.pet).toHaveProperty('_id');
    expect(response.body.pet.nombre).toBe('Fido');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});

// Test para obtener todas las mascotas
describe('GET /api/pets', () => {
  it('should return a list of pets with pagination', async () => {
    const response = await request(app)
      .get('/api/pets')
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(200);
    expect(response.body.pets).toBeInstanceOf(Array);
    expect(response.body.pages).toBeGreaterThan(0);
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});

// Test para buscar mascotas por texto
describe('GET /api/pets/search', () => {
  it('should return pets that match the search query', async () => {
    const response = await request(app)
      .get('/api/pets/search?query=Fido')
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].nombre).toBe('Fido');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('should return 404 if no pets are found', async () => {
    const response = await request(app)
      .get('/api/pets/search?query=UnknownPet')
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No se encontraron mascotas con esos criterios');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});

// Test para obtener una mascota por ID
describe('GET /api/pets/:id', () => {
  it('should return a pet by ID', async () => {
    const pet = await Pet.create({
      usuario_id: mongoose.Types.ObjectId(),
      nombre: 'Rex',
      raza: 'Pastor Alemán',
      tipo: 'Perro',
      color: 'Marrón',
      tamaño: 'grande',
      edad: 3,
      sexo: 'macho',
      pedigree: true,
      vacunas: ['rabia'],
      temperamento: 'fiel',
      historial_cruzas: [],
      media: ['https://example.com/pet2.jpg']
    });

    const response = await request(app)
      .get(`/api/pets/${pet._id}`)
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Rex');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('should return 404 if pet not found', async () => {
    const response = await request(app)
      .get('/api/pets/6354f99b15d8b42c9c88d7f0')  // ID inválido
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Mascota no encontrada');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});

// Test para eliminar una mascota
describe('DELETE /api/pets/:id', () => {
  it('should delete a pet by ID', async () => {
    const pet = await Pet.create({
      usuario_id: mongoose.Types.ObjectId(),
      nombre: 'Bobby',
      raza: 'Bulldog',
      tipo: 'Perro',
      color: 'Blanco',
      tamaño: 'mediano',
      edad: 4,
      sexo: 'macho',
      pedigree: true,
      vacunas: ['rabia'],
      temperamento: 'amigable',
      historial_cruzas: [],
      media: ['https://example.com/pet3.jpg']
    });

    const response = await request(app)
      .delete(`/api/pets/${pet._id}`)
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Eliminado correctamente');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('should return 404 if pet not found', async () => {
    const response = await request(app)
      .delete('/api/pets/6354f99b15d8b42c9c88d7f0') // ID inválido
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Mascota no encontrada');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});

// Test para actualizar una mascota
describe('PUT /api/updatepet/:id', () => {
  it('should update a pet by ID', async () => {
    const pet = await Pet.create({
      usuario_id: mongoose.Types.ObjectId(),
      nombre: 'Rocky',
      raza: 'Pitbull',
      tipo: 'Perro',
      color: 'Negro',
      tamaño: 'grande',
      edad: 5,
      sexo: 'macho',
      pedigree: true,
      vacunas: ['rabia'],
      temperamento: 'valiente',
      historial_cruzas: [],
      media: ['https://example.com/pet4.jpg']
    });

    const updatedData = { nombre: 'Rocky Updated' };
    const response = await request(app)
      .put(`/api/updatepet/${pet._id}`)
      .send(updatedData)
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Mascota actualizada exitosamente');
    expect(response.body.pet.nombre).toBe('Rocky Updated');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('should return 404 if pet not found', async () => {
    const response = await request(app)
      .put('/api/updatepet/6354f99b15d8b42c9c88d7f0') // ID inválido
      .send({ nombre: 'Updated Pet' })
      .set('Authorization', 'Bearer test-token'); // Si es necesario

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Mascota no encontrada');
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});
