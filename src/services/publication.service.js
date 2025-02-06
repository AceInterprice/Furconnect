import Publication from '../models/public.model.js';

// Agregar una publicación
export const addPublicationToDB = async (publicationData) => {
  const publication = new Publication(publicationData);
  return await publication.save();
};

// Obtener todas las publicaciones
export const getAllPublications = async () => {
  return await Publication.find().limit(100);
};

// Obtener una publicación por su ID
export const getPublicationByIdFromDB = async (id) => {
  return await Publication.findById(id);
};

// Actualizar una publicación
export const updatePublicationInDB = async (id, publicationData) => {
  return await Publication.findByIdAndUpdate(id, publicationData, { new: true });
};

// Eliminar una publicación
export const deletePublicationFromDB = async (id) => {
  return await Publication.findByIdAndDelete(id);
};
