import { Router } from 'express';
import { listPets, getOnePet, getPetsByOwner, addPet, removePet, updatePet, searchPets } from '../controllers/pets.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { uploadMascota } from "../config/multer.config.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Endpoints para gestionar mascotas
 */

/**
 * @swagger
 * /api/pets/search:
 *   get:
 *     summary: Busca mascotas por texto en nombre, raza, tipo, color o temperamento
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Texto de búsqueda
 *     responses:
 *       200:
 *         description: Lista de mascotas que coinciden con el texto de búsqueda.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       404:
 *         description: No se encontraron mascotas.
 *       400:
 *         description: Falta el parámetro de búsqueda.
 */
router.get('/api/pets/search', verifyToken, searchPets);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Pets]
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
 *         description: Número de mascotas por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Lista de mascotas con paginación.
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
 *                 pets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 */
router.get('/api/pets', verifyToken, listPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtiene una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Detalle de una mascota.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada.
 */
router.get('/api/pets/:id', verifyToken, getOnePet);

/**
 * @swagger
 * /api/pets/owner/{ownerId}:
 *   get:
 *     summary: Obtiene todas las mascotas de un propietario
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del propietario
 *     responses:
 *       200:
 *         description: Lista de mascotas del propietario.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       404:
 *         description: No se encontraron mascotas para este propietario.
 */
router.get('/api/pets/owner/:ownerId', verifyToken, getPetsByOwner);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 */
router.post('/api/pets', verifyToken, addPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualiza una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente.
 *       404:
 *         description: Mascota no encontrada.
 *       400:
 *         description: Error en los datos enviados.
 */
router.put('/api/pets/:id', verifyToken, updatePet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Elimina una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente.
 *       404:
 *         description: Mascota no encontrada.
 */
router.delete('/api/pets/:id', verifyToken, removePet);

export default router;
