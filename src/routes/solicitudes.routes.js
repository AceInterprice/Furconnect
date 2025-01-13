import { Router } from 'express';
import {
    listSolicitudesRecibidas,
    listSolicitudesEnviadas,
    updateSolicitudEstado,
    listAllSolicitudesEnviadas,
    listSolicitudesContestadas,
    addSolicitud,
    removeSolicitud,
    listSolicitudes
} from '../controllers/solicitudes.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Obtener todas las solicitudes
/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     summary: Obtiene todas las solicitudes (admin)
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de solicitudes por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Lista de todas las solicitudes con paginación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 solicitudes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Usuario no autenticado.
 */

router.get('/api/solicitudes', verifyToken, verifyRole(['admin']), listSolicitudes);





/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Endpoints para gestionar solicitudes de mascotas
 */

// Obtener solicitudes donde el usuario es el solicitado
/**
 * @swagger
 * /api/solicitudes/recibidas:
 *   get:
 *     summary: Obtiene solicitudes donde el usuario es el solicitado
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes recibidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Usuario no autenticado.
 */
router.get('/api/solicitudes/recibidas', verifyToken, listSolicitudesRecibidas);

// Obtener solicitudes donde el usuario es el solicitante
/**
 * @swagger
 * /api/solicitudes/enviadas:
 *   get:
 *     summary: Obtiene solicitudes donde el usuario es el solicitante
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes enviadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Usuario no autenticado.
 */
router.get('/api/solicitudes/enviadas', verifyToken, listSolicitudesEnviadas);

// Actualizar el estado de una solicitud a aceptado o rechazado
/**
 * @swagger
 * /api/solicitudes/{id}/estado:
 *   put:
 *     summary: Actualiza el estado de una solicitud (aceptar o rechazar)
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [aceptado, rechazado]
 *                 description: Estado de la solicitud
 *                 example: aceptado
 *     responses:
 *       200:
 *         description: Estado de la solicitud actualizado.
 *       400:
 *         description: Error en los datos enviados.
 *       404:
 *         description: Solicitud no encontrada.
 *       401:
 *         description: Usuario no autenticado.
 */
router.put('/api/solicitudes/:id/estado', verifyToken, updateSolicitudEstado);

// Ver todas las solicitudes hechas por el usuario
/**
 * @swagger
 * /api/solicitudes/enviadas/todas:
 *   get:
 *     summary: Obtiene todas las solicitudes que el usuario ha hecho
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de todas las solicitudes enviadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Usuario no autenticado.
 */
router.get('/api/solicitudes/enviadas/todas', verifyToken, listAllSolicitudesEnviadas);

// Ver todas las solicitudes contestadas por el usuario
/**
 * @swagger
 * /api/solicitudes/contestadas:
 *   get:
 *     summary: Obtiene todas las solicitudes que el usuario ha contestado
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes contestadas (aceptadas o rechazadas).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Usuario no autenticado.
 */
router.get('/api/solicitudes/contestadas', verifyToken, listSolicitudesContestadas);

// Crear una nueva solicitud
/**
 * @swagger
 * /api/solicitudes:
 *   post:
 *     summary: Crea una nueva solicitud
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Solicitud'
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 *       401:
 *         description: Usuario no autenticado.
 */
router.post('/api/solicitudes', verifyToken, addSolicitud);

// Eliminar una solicitud
/**
 * @swagger
 * /api/solicitudes/{id}:
 *   delete:
 *     summary: Elimina una solicitud por ID
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud eliminada exitosamente.
 *       404:
 *         description: Solicitud no encontrada.
 *       401:
 *         description: Usuario no autenticado.
 */
router.delete('/api/solicitudes/:id', verifyToken, removeSolicitud);






export default router;
