import Pet from '../models/pet.model.js';
import mongoose from 'mongoose';

export const searchPetsByText = async (queries, userLocation, page = 1, limit = 20) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        if (!Array.isArray(queries)) {
            queries = [queries];
        }

        const regexQueries = queries.map(query => new RegExp(query, "i"));

        const textFilters = {
            $or: regexQueries.flatMap(regex => [
                { edad: regex },
                { raza: regex },
                { tipo: regex },
                { color: regex },
                { temperamento: regex },
                { sexo: regex }
            ])
        };

        const pets = await Pet.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "usuario_id",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            {
                $match: {
                    "usuario.pais": userLocation.pais,
                    "usuario.estado": userLocation.estado,
                    "usuario.ciudad": userLocation.ciudad
                }
            },
            { $match: textFilters },
            {
                $project: {
                    imagen: 1,
                    nombre: 1,
                    raza: 1,
                    tipo: 1,
                    color: 1,
                    tamaño: 1,
                    edad: 1,
                    sexo: 1,
                    pedigree: 1,
                    vacunas: 1,
                    temperamento: 1,
                    historial_cruzas: 1,
                    media: 1,
                    fecha_registro: 1,
                    usuario: { 
                        _id: 1, 
                        nombre: 1, 
                        email: 1 
                    } // Solo devuelve estos 3 campos del usuario
                }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const total = await Pet.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "usuario_id",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            {
                $match: {
                    "usuario.pais": userLocation.pais,
                    "usuario.estado": userLocation.estado,
                    "usuario.ciudad": userLocation.ciudad
                }
            },
            { $match: textFilters },
            { $count: "total" }
        ]);

        return {
            pets,
            total: total.length > 0 ? total[0].total : 0,
            page,
            pages: Math.ceil((total.length > 0 ? total[0].total : 0) / limit)
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
