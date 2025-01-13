import { Router } from 'express';
import { createSeguimiento, getSeguimientoByEncuentro, updateSeguimiento, allSeguimientos, removeSeguimiento } from '../controllers/seguimiento.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seguimiento
 *   description: Endpoints para gestionar seguimientos de encuentros
 */

/**
 * @swagger
 * /api/seguimiento:
 *   post:
 *     summary: Crear un seguimiento para un encuentro
 *     tags: [Seguimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seguimiento'
 *     responses:
 *       201:
 *         description: Seguimiento creado exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.post('/api/seguimiento', verifyToken, createSeguimiento);
/**
 * @swagger
 * /api/seguimiento/encuentro/{encuentro_id}:
 *   get:
 *     summary: Obtener seguimiento por ID de encuentro
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: encuentro_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del encuentro
 *     responses:
 *       200:
 *         description: Seguimiento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seguimiento'
 *       404:
 *         description: Seguimiento no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/api/seguimiento/encuentro/:encuentro_id', verifyToken, getSeguimientoByEncuentro);
/**
 * @swagger
 * /api/seguimiento:
 *   get:
 *     summary: Obtener seguimientos
 *     tags: [Seguimiento]
 *     responses:
 *       200:
 *         description: Seguimiento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seguimiento'
 *       404:
 *         description: Seguimiento no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/api/seguimiento', verifyToken, allSeguimientos);
/**
 * @swagger
 * /api/seguimiento/{id}:
 *   put:
 *     summary: Actualizar un seguimiento por ID
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del seguimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seguimiento'
 *     responses:
 *       200:
 *         description: Seguimiento actualizado exitosamente.
 *       404:
 *         description: Seguimiento no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.put('/api/seguimiento/:id', verifyToken, updateSeguimiento);

router.delete('/api/seguimiento/:id', verifyToken, removeSeguimiento);

export default router;
