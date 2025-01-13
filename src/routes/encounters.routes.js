import { Router } from 'express';
import { addEncounter, listEncounters, getEncounterById, updateEncounter, deleteEncounter } from '../controllers/encounters.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Encuentros
 *   description: Endpoints para gestionar encuentros entre mascotas
 */

/**
 * @swagger
 * /api/encounters:
 *   get:
 *     summary: Obtiene todos los encuentros
 *     tags: [Encuentros]
 *     responses:
 *       200:
 *         description: Lista de encuentros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Encuentro'
 */
router.get('/api/encounters', verifyToken, listEncounters);

/**
 * @swagger
 * /api/encounters:
 *   post:
 *     summary: Crea un nuevo encuentro
 *     tags: [Encuentros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuentro'
 *     responses:
 *       201:
 *         description: Encuentro creado exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 */
router.post('/api/encounters', verifyToken, addEncounter);

/**
 * @swagger
 * /api/encounters/{id}:
 *   get:
 *     summary: Obtiene un encuentro por ID
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del encuentro
 *     responses:
 *       200:
 *         description: Detalle del encuentro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuentro'
 *       404:
 *         description: Encuentro no encontrado.
 */
router.get('/api/encounters/:id', verifyToken, getEncounterById);

/**
 * @swagger
 * /api/encounters/{id}:
 *   put:
 *     summary: Actualiza un encuentro por ID
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del encuentro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuentro'
 *     responses:
 *       200:
 *         description: Encuentro actualizado exitosamente.
 *       404:
 *         description: Encuentro no encontrado.
 *       400:
 *         description: Error en los datos enviados.
 */
router.put('/api/encounters/:id', verifyToken, updateEncounter);

/**
 * @swagger
 * /api/encounters/{id}:
 *   delete:
 *     summary: Elimina un encuentro por ID
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del encuentro
 *     responses:
 *       200:
 *         description: Encuentro eliminado exitosamente.
 *       404:
 *         description: Encuentro no encontrado.
 */
router.delete('/api/encounters/:id', verifyToken, deleteEncounter);

export default router;
