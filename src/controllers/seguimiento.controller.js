import { crearSeguimiento, getSeguimientoByEncuentroId, updateSeguimientoById, getSeguimientos, deleteSeguimientoById} from '../services/seguimiento.service.js';

// Crear seguimiento
export const createSeguimiento = async (req, res) => {
    console.log(req.body)
    try {
        const seguimiento = await crearSeguimiento(req.body);
        res.status(201).json(seguimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener seguimiento por ID de encuentro
export const getSeguimientoByEncuentro = async (req, res) => {
    try {
        const seguimiento = await getSeguimientoByEncuentroId(req.params.encuentro_id);
        if (!seguimiento) return res.status(404).json({ message: 'Seguimiento no encontrado' });
        res.status(200).json(seguimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const allSeguimientos = async (req, res) => {
    try {
        const seguimiento = await getSeguimientos();
        res.status(200).json(seguimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Actualizar seguimiento
export const updateSeguimiento = async (req, res) => {
    try {
        const seguimiento = await updateSeguimientoById(req.params.id, req.body);
        if (!seguimiento) return res.status(404).json({ message: 'Seguimiento no encontrado' });
        res.status(200).json(seguimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const removeSeguimiento = async (req, res) => {
    try {
        await deleteSeguimientoById(req.params.id);
        res.status(200).json({ message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
