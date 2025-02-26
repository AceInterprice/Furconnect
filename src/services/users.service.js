import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios con paginación
export const getUsers = async (page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    return await User.find().skip(skip).limit(pageSize);
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
    return await User.findById(id); // Busca un usuario por ID
};

// Crear un nuevo usuario
export const createUser = async (imagen, nombre, apellido, email, password, telefono, ciudad, estado, pais, role = 'user', estatus = 'gratis') => {
    const userExist = await User.findOne({ email }); // Verifica si el correo ya está registrado
    if (userExist) throw new Error('El correo electrónico ya está registrado.');

    // Validar la contraseña antes de encriptarla
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = new User({ imagen, nombre, apellido, email, password: hashedPassword, telefono, ciudad, estado, pais, role, estatus });

    await newUser.save(); // Guarda el nuevo usuario en la base de datos
    return newUser;
};

// Inicio de sesión
export const loginUsers = async (email, password) => {
    const user = await User.findOne({ email }); // Busca el usuario por correo electrónico
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Verifica la contraseña
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: user._id, role: user.role, ciudad: user.ciudad, estado: user.estado, pais: user.pais }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Genera el token JWT

    return { 
        token, 
        user: {
            id: user._id,
            imagen: user.imagen,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono,
            ciudad: user.ciudad,
            estado: user.estado,
            pais: user.pais,
            role: user.role, 
            estatus: user.estatus
        }
    };
};

// Actualizar un usuario por ID
export const updateUserById = async (id, imagen, nombre, apellido, email, password, telefono, ciudad, estado, pais) => {
    const user = await User.findById(id); // Busca el usuario por ID
    if (!user) return null;

    user.imagen = imagen; 
    user.nombre = nombre;
    user.apellido = apellido;
    user.email = email;
    user.telefono = telefono;
    user.ciudad = ciudad;
    user.estado = estado;
    user.pais = pais;

    if (password) { // Solo encripta la nueva contraseña si se proporciona
        user.password = await bcrypt.hash(password, 10);
    }

    await user.save(); // Guarda los cambios en la base de datos
    return user;
};

// Eliminar un usuario por ID
export const deleteUserById = async (id) => {
    const result = await User.findByIdAndDelete(id); // Busca y elimina el usuario por ID
    if (!result) {
        throw new Error('Usuario no encontrado');
    }
    return { message: 'Eliminado correctamente' };
};
