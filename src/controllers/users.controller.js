import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUserById, 
    deleteUserById, 
    loginUsers 
} from '../services/users.service.js';

import User from '../models/user.model.js';

// Listar todos los usuarios
export const listUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const totalUsers = await User.countDocuments();
        const users = await getUsers(page, pageSize);

        res.status(200).json({
            page,
            pageSize,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario solicitado
        const { id: requesterId, role: requesterRole } = req.user; // ID y rol del usuario logueado

        // Verificar si el usuario logueado es dueño del perfil o es administrador
        if (requesterId !== id && requesterRole !== 'admin') {
            return res.status(403).json({ error: "No tienes permiso para ver este perfil" });
        }

        const user = await getUserById(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar un nuevo usuario
export const addUser = async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, ciudad, estado, pais, role } = req.body; 

        // Validación: Asegurar que los campos obligatorios están completos
        if (!nombre || !apellido || !email || !password || !telefono || !ciudad || !estado || !pais) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben completarse." });
        }

        const newUser = await createUser(nombre, apellido, email, password, telefono, ciudad, estado, pais, role);
        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Inicio de sesión
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const { token, user } = await loginUsers(email, password);
        
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            token,
            user
        }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a actualizar
        const { id: requesterId, role: requesterRole } = req.user; // ID y rol del usuario logueado

        // Verificar si el usuario logueado es dueño del perfil o es administrador
        if (requesterId !== id && requesterRole !== 'admin') {
            return res.status(403).json({ error: "No tienes permiso para actualizar este perfil" });
        }

        const { imagen, nombre, apellido, email, password, telefono, ciudad, estado, pais } = req.body;
        const updatedUser = await updateUserById(id, imagen, nombre, apellido, email, password, telefono, ciudad, estado, pais);

        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const result = await deleteUserById(req.params.id);
        res.status(200).json({ message: 'Usuario eliminado', result });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
