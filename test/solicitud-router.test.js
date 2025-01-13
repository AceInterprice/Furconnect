import request from 'supertest';
import app from '../src/app.js'; 
import * as solicitudesController from '../src/controllers/solicitudes.controller.js';
import * as authMiddleware from '../src/middlewares/auth.middleware.js';

// Mocking los controladores y middlewares
jest.mock('../src/controllers/solicitudes.controller.js');
jest.mock('../src/middlewares/auth.middleware.js');

describe('Solicitudes API Routes', () => {
  const mockUser = { id: 'user1', role: 'admin' };
  
  beforeEach(() => {
    // Mocking los controladores para devolver respuestas simuladas
    solicitudesController.listSolicitudesRecibidas = jest.fn().mockResolvedValue([{ id: 'solicitud1' }]);
    solicitudesController.listSolicitudesEnviadas = jest.fn().mockResolvedValue([{ id: 'solicitud2' }]);
    solicitudesController.updateSolicitudEstado = jest.fn().mockResolvedValue({ id: 'solicitud3', estado: 'aceptado' });
    solicitudesController.listAllSolicitudesEnviadas = jest.fn().mockResolvedValue([{ id: 'solicitud4' }]);
    solicitudesController.listSolicitudesContestadas = jest.fn().mockResolvedValue([{ id: 'solicitud5' }]);
    solicitudesController.listSolicitudes = jest.fn().mockResolvedValue([{ id: 'solicitud6' }]);
    solicitudesController.addSolicitud = jest.fn().mockResolvedValue({ id: 'solicitud7', estado: 'pendiente' });
    solicitudesController.removeSolicitud = jest.fn().mockResolvedValue({ id: 'solicitud8' });

    // Mocking el middleware de autenticación
    authMiddleware.verifyToken = jest.fn((req, res, next) => next()); // Simula que siempre pasa la verificación
    authMiddleware.verifyRole = jest.fn().mockImplementation((roles) => {
      return (req, res, next) => {
        if (roles.includes('admin')) {
          return next(); // Simula que el usuario tiene el rol adecuado
        }
        return res.status(403).json({ error: 'Forbidden' });
      };
    });
  });

  it('should list all solicitudes with pagination (admin)', async () => {
    const res = await request(app)
      .get('/api/solicitudes')
      .query({ page: 1, limit: 10 })
      .set('Authorization', 'Bearer token'); // Simula el token de autenticación

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'solicitud6' }]);
    expect(solicitudesController.listSolicitudes).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
  });

  it('should list solicitudes recibidas', async () => {
    const res = await request(app)
      .get('/api/solicitudes/recibidas')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'solicitud1' }]);
    expect(solicitudesController.listSolicitudesRecibidas).toHaveBeenCalled();
  });

  it('should list solicitudes enviadas', async () => {
    const res = await request(app)
      .get('/api/solicitudes/enviadas')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'solicitud2' }]);
    expect(solicitudesController.listSolicitudesEnviadas).toHaveBeenCalled();
  });

  it('should update solicitud estado', async () => {
    const res = await request(app)
      .put('/api/solicitudes/someId/estado')
      .set('Authorization', 'Bearer token')
      .send({ estado: 'aceptado' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'solicitud3', estado: 'aceptado' });
    expect(solicitudesController.updateSolicitudEstado).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
  });

  it('should add a new solicitud', async () => {
    const newSolicitud = { usuario_solicitante_id: 'user1', usuario_solicitado_id: 'user2' };
    
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', 'Bearer token')
      .send(newSolicitud);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'solicitud7', estado: 'pendiente' });
    expect(solicitudesController.addSolicitud).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
  });

  it('should remove solicitud by ID', async () => {
    const res = await request(app)
      .delete('/api/solicitudes/someId')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'solicitud8' });
    expect(solicitudesController.removeSolicitud).toHaveBeenCalled();
  });
});
