import { Router } from 'express';
import { listUsers, getUser, addUser, updateUser, deleteUser, loginUser } from '../controllers/users.controller.js';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware.js';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios (solo admin)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de usuarios por página.
 *     responses:
 *       200:
 *         description: Lista de usuarios paginada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/api/users', verifyToken, verifyRole(['admin']), listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalle de un usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/api/users/:id', verifyToken, getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 */
router.post('/api/users', addUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       400:
 *         description: Error en los datos enviados.
 */
router.put('/api/users/:id', verifyToken, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/api/users/:id', verifyToken, deleteUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *                 example: 'example@gmail.com'
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post('/api/login', loginUser);
export default router;
