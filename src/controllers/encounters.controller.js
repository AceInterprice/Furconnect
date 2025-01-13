import { addEncounterToDB, getAllEncounters, getEncounterByIdFromDB, updateEncounterInDB, deleteEncounterFromDB } from '../services/encounters.service.js';

export const addEncounter = async (req, res) => {
    try {
        const newEncounter = req.body;
        const encounter = await addEncounterToDB(newEncounter);
        res.status(201).json(encounter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listEncounters = async (req, res) => {
    try {
        const encounters = await getAllEncounters();
        res.status(200).json(encounters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEncounterById = async (req, res) => {
    try {
        const encounter = await getEncounterByIdFromDB(req.params.id);
        if (!encounter) return res.status(404).json({ message: 'Encuentro no encontrado' });
        res.status(200).json(encounter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEncounter = async (req, res) => {
    try {
        const updatedEncounter = await updateEncounterInDB(req.params.id, req.body);
        if (!updatedEncounter) return res.status(404).json({ message: 'Encuentro no encontrado' });
        res.status(200).json(updatedEncounter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteEncounter = async (req, res) => {
    try {
        const deleted = await deleteEncounterFromDB(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Encuentro no encontrado' });
        res.status(200).json({ message: 'Encuentro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
