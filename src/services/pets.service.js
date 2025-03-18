import Pet from '../models/pet.model.js';
import User from "../models/user.model.js";
import mongoose from 'mongoose';

export const searchPetsByText = async (filters = {}, locationFilters = {}, page = 1, limit = 20) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        let matchFilters = {};

        // 🔹 Filtrar por raza, tipo, color, temperamento, sexo
        if (filters.raza) matchFilters.raza = new RegExp(filters.raza, "i");
        if (filters.tipo) matchFilters.tipo = new RegExp(filters.tipo, "i");
        if (filters.color) matchFilters.color = new RegExp(filters.color, "i");
        if (filters.temperamento) matchFilters.temperamento = new RegExp(filters.temperamento, "i");
        if (filters.sexo) matchFilters.sexo = filters.sexo;
        if (filters.tamaño) matchFilters.tamaño = filters.tamaño;

        // 🔹 Filtrar por edad en rangos
        if (filters.edad) {
            switch (filters.edad) {
                case "1-5":
                    matchFilters.edad = { $gte: 1, $lte: 5 };
                    break;
                case "6-10":
                    matchFilters.edad = { $gte: 6, $lte: 10 };
                    break;
                case "11+":
                    matchFilters.edad = { $gte: 11 };
                    break;
            }
        }

        // 🔹 Filtrar directamente por ubicación en la colección de mascotas
        if (locationFilters.pais) matchFilters.pais = new RegExp(locationFilters.pais, "i");
        if (locationFilters.estado) matchFilters.estado = new RegExp(locationFilters.estado, "i");
        if (locationFilters.ciudad) matchFilters.ciudad = new RegExp(locationFilters.ciudad, "i");

        // 🔹 Obtener el total de registros
        const total = await Pet.countDocuments(matchFilters);

        // 🔹 Buscar mascotas con los filtros y paginación
        const pets = await Pet.find(matchFilters)
            .populate("usuario_id", "nombre email pais estado ciudad")
            .skip((page - 1) * limit)
            .limit(limit); 

        if (total === 0) {
            return { total, page, pages: 0, pets: [], message: "No hay búsquedas que coincidan con los filtros." };
        }

        return {
            total,
            page,
            pages: Math.ceil(total / limit),
            pets,
        };
    } catch (error) {
        throw new Error("Error al buscar mascotas: " + error.message);
    }
};

// Obtener todas las mascotas con paginación
export const getPets = async (page = 1, limit = 10) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        const [pets, total] = await Promise.all([
            Pet.find()
                .populate('usuario_id', 'nombre email') // Cargar datos básicos del dueño
                .skip((page - 1) * limit)
                .limit(limit),

            Pet.countDocuments()
        ]);

        return { total, page, pages: Math.ceil(total / limit), pets };
    } catch (error) {
        throw new Error("Error al obtener mascotas");
    }
};

// Encontrar una mascota por ID
export const findPetById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");
        const pet = await Pet.findById(id).populate('usuario_id', 'nombre email');
        if (!pet) throw new Error("Mascota no encontrada");
        return pet;
    } catch (error) {
        throw new Error(error.message || "Error al buscar la mascota");
    }
};

// Obtener mascotas por ID de dueño
export const getPetsByOwnerId = async (ownerId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) throw new Error("ID de usuario inválido");
        return await Pet.find({ usuario_id: ownerId });
    } catch (error) {
        throw new Error(error.message || "Error al obtener mascotas del usuario");
    }
};

export const addNewPet = async (usuario_id, imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(usuario_id)) throw new Error("ID de usuario inválido");
        
        // 🔹 Buscar al usuario en la base de datos
        const usuario = await User.findById(usuario_id);
        if (!usuario) throw new Error("Usuario no encontrado");

        // 🔹 Crear nueva mascota con la ubicación del usuario
        const newPet = new Pet({ 
            usuario_id,
            imagen, 
            nombre, 
            raza, 
            tipo, 
            color, 
            tamaño, 
            edad, 
            sexo, 
            vacunas, 
            temperamento, 
            historial_cruzas, 
            media,
            pedigree,
            pais: usuario.pais,   // 🔹 Guardamos la ubicación del dueño
            estado: usuario.estado,
            ciudad: usuario.ciudad
        });

        await newPet.save();
        return newPet;
    } catch (error) {
        throw new Error(error.message || "Error al agregar la mascota");
    }
};

// Actualizar una mascota
export const updatePetInService = async (id, updates) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

        const pet = await Pet.findByIdAndUpdate(id, updates, { new: true }).populate('usuario_id', 'nombre email');
        if (!pet) throw new Error("Mascota no encontrada");
        return pet;
    } catch (error) {
        throw new Error(error.message || "Error al actualizar la mascota");
    }
};

// Eliminar una mascota
export const deletePet = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

        const result = await Pet.findByIdAndDelete(id);
        if (!result) throw new Error("Mascota no encontrada");

        return { message: 'Eliminado correctamente' };
    } catch (error) {
        throw new Error(error.message || "Error al eliminar la mascota");
    }
};
