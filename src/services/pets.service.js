import Pet from '../models/pet.model.js';
import mongoose from 'mongoose';

// Buscar mascotas por filtros de texto específico y ubicación del usuario
export const searchPetsByText = async (query, userLocation, page = 1, limit = 20) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        const regex = new RegExp(query, "i");

        // Filtros de búsqueda por texto
        const textFilters = {
            $or: [
                { nombre: regex },
                { raza: regex },
                { tipo: regex },
                { color: regex },
                { temperamento: regex }
            ]
        };

        // Filtro de ubicación basado en la del usuario
        const locationFilter = {
            "usuario_id.pais": userLocation.pais,
            "usuario_id.estado": userLocation.estado,
            "usuario_id.ciudad": userLocation.ciudad
        };

        const finalFilters = { ...textFilters, ...locationFilter };

        const [pets, total] = await Promise.all([
            Pet.find(finalFilters)
                .populate('usuario_id', 'nombre email pais estado ciudad')
                .skip((page - 1) * limit)
                .limit(limit),

            Pet.countDocuments(finalFilters)
        ]);

        return { pets, total, page, pages: Math.ceil(total / limit) };
    } catch (error) {
        throw new Error("Error al buscar mascotas");
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

// Agregar una nueva mascota
export const addNewPet = async (usuario_id, imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(usuario_id)) throw new Error("ID de usuario inválido");

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
            pedigree
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
