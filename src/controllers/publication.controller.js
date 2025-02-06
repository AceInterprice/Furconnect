import { addPublicationToDB, getAllPublications, getPublicationByIdFromDB, updatePublicationInDB, deletePublicationFromDB } from '../services/publication.service.js';

// Agregar una publicación
export const addPublication = async (req, res) => {
  try {
    const publicationData = req.body; // Los datos de la publicación vienen del cuerpo de la solicitud
    const newPublication = await addPublicationToDB(publicationData);
    res.status(201).json({
      message: 'Publicación creada con éxito',
      publication: newPublication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al crear la publicación' });
  }
};

// Obtener todas las publicaciones
export const getPublications = async (req, res) => {
  try {
    const publications = await getAllPublications();
    res.status(200).json(publications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener las publicaciones' });
  }
};

// Obtener una publicación por ID
export const getPublicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const publication = await getPublicationByIdFromDB(id);
    if (!publication) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    res.status(200).json(publication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener la publicación' });
  }
};

// Actualizar una publicación
export const updatePublication = async (req, res) => {
  const { id } = req.params;
  const publicationData = req.body;
  try {
    const updatedPublication = await updatePublicationInDB(id, publicationData);
    if (!updatedPublication) {
      return res.status(404).json({ error: 'Publicación no encontrada para actualizar' });
    }
    res.status(200).json({
      message: 'Publicación actualizada con éxito',
      publication: updatedPublication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar la publicación' });
  }
};

// Eliminar una publicación
export const deletePublication = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPublication = await deletePublicationFromDB(id);
    if (!deletedPublication) {
      return res.status(404).json({ error: 'Publicación no encontrada para eliminar' });
    }
    res.status(200).json({
      message: 'Publicación eliminada con éxito',
      publication: deletedPublication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al eliminar la publicación' });
  }
};
