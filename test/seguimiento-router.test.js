import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/seguimiento.routes.js'; // La ruta que contiene el router
import * as seguimientoController from '../src/controllers/seguimiento.controller.js';
import * as authMiddleware from '../src/middlewares/auth.middleware.js'; // Middleware de autenticación

// Crear la aplicación de Express
const app = express();
app.use(bodyParser.json());
app.use(router);

// Mocks de los controladores y el middleware
jest.mock('../src/controllers/seguimiento.controller.js');
jest.mock('../src/middlewares/auth.middleware.js');

describe('Seguimiento Router', () => {

  // Mock de la verificación de token
  authMiddleware.verifyToken = jest.fn((req, res, next) => next());

  // Test para crear un seguimiento
  it('should create a new seguimiento', async () => {
    const seguimientoData = {
      encuentro_id: '123',
      actualizaciones: {
        fecha: new Date(),
        adjuntos: ['file1.png'],
      },
    };

    // Simulamos que el controlador de crear seguimiento retorna el objeto creado
    seguimientoController.createSeguimiento.mockResolvedValue(seguimientoData);

    const response = await request(app)
      .post('/api/seguimiento')
      .send(seguimientoData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(seguimientoData);
    expect(seguimientoController.createSeguimiento).toHaveBeenCalledWith(expect.objectContaining(seguimientoData));
  });

  // Test para obtener un seguimiento por ID de encuentro
  it('should return a seguimiento by encuentro_id', async () => {
    const encuentroId = '123';
    const seguimiento = {
      encuentro_id: encuentroId,
      actualizaciones: { fecha: new Date(), adjuntos: ['file1.png'] },
    };

    // Simulamos la respuesta del controlador
    seguimientoController.getSeguimientoByEncuentro.mockResolvedValue(seguimiento);

    const response = await request(app).get(`/api/seguimiento/encuentro/${encuentroId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(seguimiento);
    expect(seguimientoController.getSeguimientoByEncuentro).toHaveBeenCalledWith(expect.objectContaining({ params: { encuentro_id: encuentroId } }));
  });

  // Test para obtener todos los seguimientos
  it('should return all seguimientos', async () => {
    const seguimientos = [
      { encuentro_id: '123', actualizaciones: { fecha: new Date(), adjuntos: ['file1.png'] } },
      { encuentro_id: '124', actualizaciones: { fecha: new Date(), adjuntos: [] } },
    ];

    // Simulamos la respuesta del controlador
    seguimientoController.allSeguimientos.mockResolvedValue(seguimientos);

    const response = await request(app).get('/api/seguimiento');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(seguimientos);
    expect(seguimientoController.allSeguimientos).toHaveBeenCalled();
  });

  // Test para actualizar un seguimiento
  it('should update a seguimiento by id', async () => {
    const seguimientoId = '1';
    const updateData = { 'actualizaciones.adjuntos': ['file2.png'] };
    const updatedSeguimiento = {
      _id: seguimientoId,
      encuentro_id: '123',
      actualizaciones: { fecha: new Date(), adjuntos: ['file2.png'] },
    };

    // Simulamos la respuesta del controlador
    seguimientoController.updateSeguimiento.mockResolvedValue(updatedSeguimiento);

    const response = await request(app)
      .put(`/api/seguimiento/${seguimientoId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedSeguimiento);
    expect(seguimientoController.updateSeguimiento).toHaveBeenCalledWith(expect.objectContaining({ params: { id: seguimientoId }, body: updateData }));
  });

  // Test para eliminar un seguimiento
  it('should delete a seguimiento by id', async () => {
    const seguimientoId = '1';

    // Simulamos la respuesta del controlador
    seguimientoController.removeSeguimiento.mockResolvedValue(true);

    const response = await request(app).delete(`/api/seguimiento/${seguimientoId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Solicitud eliminada exitosamente');
    expect(seguimientoController.removeSeguimiento).toHaveBeenCalledWith(expect.objectContaining({ params: { id: seguimientoId } }));
  });
});
