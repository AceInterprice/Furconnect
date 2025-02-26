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

export const searchPets = async (req, res) => {
    try {
        const { query, page = 1, limit = 20 } = req.query;

        if (!query) {
            return res.status(400).json({ message: "El parámetro de búsqueda es obligatorio" });
        }

        // Verificar que req.user existe y tiene ubicación
        if (!req.user || !req.user.ciudad || !req.user.estado || !req.user.pais) {
            return res.status(400).json({ message: "No se pudo determinar la ubicación del usuario" });
        }

        // Obtener ubicación del usuario
        const userLocation = {
            ciudad: req.user.ciudad,
            estado: req.user.estado,
            pais: req.user.pais
        };

        // Validar que page y limit sean números válidos
        const pageNumber = isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
        const limitNumber = isNaN(parseInt(limit)) ? 20 : Math.max(1, parseInt(limit));

        // Llamar al servicio con la ubicación del usuario
        const { pets, total } = await searchPetsByText(query, userLocation, pageNumber, limitNumber);

        // En lugar de devolver 404, devolvemos 200 con un array vacío si no hay resultados
        res.status(200).json({
            pets,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber)
        });

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
        // Crea la mascota en la base de datos
        const pet = await addNewPet(usuario_id, imagen, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree);
        
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

