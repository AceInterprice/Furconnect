import Pet from "../models/pet.model.js";
import { 
    getPets, 
    addNewPet, 
    deletePet, 
    findPetById, 
    getPetsByOwnerId, 
    updatePetInService,
    searchPetsByText 
} from "../services/pets.service.js";
import mongoose from "mongoose";

export const searchPets = async (req, res) => {
    try {
        const { raza, tipo, color, temperamento, sexo, tamaño, edad, ciudad, estado, pais, page = 1, limit = 20 } = req.query;

        // 🔹 Validar que page y limit sean números válidos
        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.max(1, parseInt(limit) || 20);

        // 🔹 Construir objeto de filtros
        const filters = {};
        if (raza) filters.raza = new RegExp(raza, "i");
        if (tipo) filters.tipo = new RegExp(tipo, "i");
        if (color) filters.color = new RegExp(color, "i");
        if (temperamento) filters.temperamento = new RegExp(temperamento, "i");
        if (sexo) filters.sexo = sexo;
        if (tamaño) filters.tamaño = tamaño;
        if (edad) filters.edad = edad; // 🔥 La lógica de edad se maneja en `searchPetsByText`

        // 🔹 Construir filtros de ubicación correctamente
        const locationFilters = {};
        if (pais) locationFilters.pais = new RegExp(pais, "i");
        if (estado) locationFilters.estado = new RegExp(estado, "i");
        if (ciudad) locationFilters.ciudad = new RegExp(ciudad, "i");

        // 🔹 Llamar al servicio con los filtros aplicados
        const { pets, total, pages, message } = await searchPetsByText(filters, locationFilters, pageNumber, limitNumber);

        // 🔹 Manejar el caso donde no hay coincidencias
        if (total === 0) {
            return res.status(200).json({ message: message || "No hay búsquedas que coincidan.", pets: [], total: 0, page: pageNumber, pages: 0 });
        }

        // 🔹 Responder con los resultados
        res.status(200).json({ pets, total, page: pageNumber, pages });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas las mascotas
export const listPets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pets = await getPets(page, limit);

        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una mascota por ID
export const getOnePet = async (req, res) => {
    try {
        const pet = await findPetById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener mascotas por ID de dueño
export const getPetsByOwner = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const pets = await getPetsByOwnerId(ownerId);
        if (pets.length === 0) {
            return res.status(204).json({ message: 'No se encontraron mascotas para este usuario' });
        }
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar una nueva mascota
export const addPet = async (req, res) => {
    try {
        const { imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree } = req.body;
        const usuario_id = req.user.id;

        // 🔹 Validar que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        // 🔹 Buscar al usuario en la base de datos
        const usuario = await User.findById(usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // 🔹 Agregar la mascota con la ubicación del usuario
        const pet = await addNewPet(
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
            usuario.pais,   // Ahora pasamos la ubicación aquí
            usuario.estado,
            usuario.ciudad
        );

        res.status(201).json({ message: "Mascota registrada exitosamente", pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una mascota
export const removePet = async (req, res) => {
    try {
        const result = await deletePet(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// Actualizar una mascota
export const updatePet = async (req, res) => {
    try {
        const { imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, pedigree, media } = req.body;
        
        const updates = { imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, pedigree, media };

        // Actualiza la mascota en la base de datos
        const updatedPet = await updatePetInService(req.params.id, updates);

        if (!updatedPet) {
            return res.status(404).json({ message: "Mascota no encontrada" });
        }

        res.status(200).json({ message: "Mascota actualizada exitosamente", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

