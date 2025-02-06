import { Router } from 'express';
import { addPublication, getPublications, getPublicationById, updatePublication, deletePublication } from '../controllers/publication.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Publications
 *   description: Endpoints para gestionar publicaciones
 */

/**
 * @swagger
 * /api/publications:
 *   get:
 *     summary: Obtiene todas las publicaciones
 *     tags: [Publications]
 *     responses:
 *       200:
 *         description: Lista de publicaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publication'
 */
router.get('/api/publications', verifyToken, getPublications);

/**
 * @swagger
 * /api/publications/{id}:
 *   get:
 *     summary: Obtiene una publicación por ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Detalle de la publicación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       404:
 *         description: Publicación no encontrada.
 */
router.get('/api/publications/:id', verifyToken, getPublicationById);

/**
 * @swagger
 * /api/publications:
 *   post:
 *     summary: Crea una nueva publicación
 *     tags: [Publications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publication'
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 */
router.post('/api/publications', verifyToken, addPublication);

/**
 * @swagger
 * /api/publications/{id}:
 *   put:
 *     summary: Actualiza una publicación por ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publication'
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente.
 *       404:
 *         description: Publicación no encontrada.
 *       400:
 *         description: Error en los datos enviados.
 */
router.put('/api/publications/:id', verifyToken, updatePublication);

/**
 * @swagger
 * /api/publications/{id}:
 *   delete:
 *     summary: Elimina una publicación por ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente.
 *       404:
 *         description: Publicación no encontrada.
 */
router.delete('/api/publications/:id', verifyToken, deletePublication);

export default router;
