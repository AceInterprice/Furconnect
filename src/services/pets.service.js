import Pet from '../models/pet.model.js';
import mongoose from 'mongoose';

export const searchPetsByText = async (queries = [], filters = {}, page = 1, limit = 20) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        if (!Array.isArray(queries)) {
            queries = [queries];
        }

        // Convertir cada término de búsqueda en una expresión regular
        const regexQueries = queries.map(query => new RegExp(query, "i"));

        // Construcción del filtro de búsqueda
        let matchFilters = {};

        if (regexQueries.length > 0) {
            matchFilters.$and = regexQueries.map(regex => ({
                $or: [
                    { raza: regex },
                    { tipo: regex },
                    { color: regex },
                    { temperamento: regex },
                    { sexo: regex }
                ]
            }));
        }

        // Aplicar filtros de país, estado y ciudad si están presentes
        if (filters.pais) matchFilters["ubicacion.pais"] = filters.pais;
        if (filters.estado) matchFilters["ubicacion.estado"] = filters.estado;
        if (filters.ciudad) matchFilters["ubicacion.ciudad"] = filters.ciudad;

        // Obtener mascotas con paginación y filtros aplicados
        const [pets, total] = await Promise.all([
            Pet.find(matchFilters)
                .populate("usuario_id", "nombre email") // Solo trae _id, nombre y email
                .skip((page - 1) * limit)
                .limit(limit),
            Pet.countDocuments(matchFilters)
        ]);

        return {
            total,
            page,
            pages: Math.ceil(total / limit),
            pets
        };
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
