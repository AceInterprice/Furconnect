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



// Buscar mascotas por texto
export const searchPets = async (req, res) => {
    try {
        const { query } = req.query; // Obtiene el parámetro de búsqueda de la query
        if (!query) {
            return res.status(400).json({ message: 'El parámetro de búsqueda es obligatorio' });
        }
        
        const pets = await searchPetsByText(query);
        
        if (pets.length === 0) {
            return res.status(404).json({ message: 'No se encontraron mascotas con esos criterios' });
        }
        
        res.status(200).json(pets);
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
            return res.status(404).json({ message: 'No se encontraron mascotas para este usuario' });
        }
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar una nueva mascota
export const addPet = async (req, res) => {
    try {
        const { usuario_id, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree } = req.body;
        const pet = await addNewPet(usuario_id, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree);
        res.status(201).json({ message: 'Mascota registrada exitosamente', pet });
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
        const { nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree } = req.body;
        const updatedPet = await updatePetInService(req.params.id, { nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree });

        if (!updatedPet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        
        res.status(200).json({ message: 'Mascota actualizada exitosamente', pet: updatedPet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
