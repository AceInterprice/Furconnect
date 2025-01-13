import Encounter from '../models/encounter.model.js';

export const addEncounterToDB = async (encounterData) => {
    const encounter = new Encounter(encounterData);
    return await encounter.save();
};

export const getAllEncounters = async () => {
    return await Encounter.find().limit(100);
};


export const getEncounterByIdFromDB = async (id) => {
    return await Encounter.findById(id);
};

export const updateEncounterInDB = async (id, encounterData) => {
    return await Encounter.findByIdAndUpdate(id, encounterData, { new: true });
};

export const deleteEncounterFromDB = async (id) => {
    return await Encounter.findByIdAndDelete(id);
};
