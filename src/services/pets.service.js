import Pet from '../models/pet.model.js';

// Buscar mascotas por filtros de texto específico
export const searchPetsByText = async (query) => {
    const regex = new RegExp(query, "i"); // 'i' para búsqueda no sensible a mayúsculas
    return await Pet.find({
        $or: [
            { nombre: regex },
            { raza: regex },
            { tipo: regex },
            { color: regex },
            { temperamento: regex }
        ]
    }).populate('usuario_id'); // Retorna las mascotas que coinciden con el texto en los campos indicados
};


// Obtener todas las mascotas con paginación
export const getPets = async (page, limit) => {
    const skip = (page - 1) * limit; // Calcula el número de documentos a omitir
    const pets = await Pet.find()
        .populate('usuario_id')
        .skip(skip)
        .limit(limit);
        
    const total = await Pet.countDocuments(); // Total de mascotas

    return {
        total,
        page,
        pages: Math.ceil(total / limit),
        pets
    };
};


// Encontrar una mascota por ID
export const findPetById = async (id) => {
    const pet = await Pet.findById(id).populate('usuario_id'); // Busca la mascota por ID y llena el usuario_id
    return pet; // Retorna la mascota o null si no se encuentra
};

// Obtener mascotas por ID de dueño
export const getPetsByOwnerId = async (ownerId) => {
    return await Pet.find({ usuario_id: ownerId }) // Busca mascotas por ID de dueño

};


// Agregar una nueva mascota
export const addNewPet = async (usuario_id, nombre, raza, tipo, color, tamaño, edad, sexo, vacunas, temperamento, historial_cruzas, media, pedigree) => {
    const newPet = new Pet({ 
        usuario_id, 
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

    await newPet.save(); // Guarda la nueva mascota en la base de datos
    return newPet; // Retorna la mascota creada
};


// Eliminar una mascota
export const deletePet = async (id) => {
    const result = await Pet.findByIdAndDelete(id); // Busca y elimina la mascota por ID
    if (!result) {
        throw new Error('Mascota no encontrada');
    }
    return { message: 'Eliminado correctamente' }; // Retorna un mensaje de éxito
};

// Actualizar una mascota
export const updatePetInService = async (id, updates) => {
    const pet = await Pet.findByIdAndUpdate(id, updates, { new: true }).populate('usuario_id'); // Busca y actualiza la mascota
    if (!pet) {
        throw new Error('Mascota no encontrada');
    }
    return pet; // Retorna la mascota actualizada
};
