import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { addEncounterToDB, getAllEncounters, getEncounterByIdFromDB, updateEncounterInDB, deleteEncounterFromDB } from '../src/services/encounters.service.js';
import Encounter from '../src/models/encounter.model.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Encuentros Service', () => {
  it('debería agregar un nuevo encuentro', async () => {
    const encounterData = {
      mascota_id: new mongoose.Types.ObjectId(),
      mascota2_id: new mongoose.Types.ObjectId(),
      fecha: new Date(),
      ubicacion: { ciudad: 'Ciudad X', calle: 'Calle Y', nombre_lugar: 'Lugar Z' },
      estado: 'pendiente',
    };

    const encounter = await addEncounterToDB(encounterData);
    expect(encounter).toHaveProperty('_id');
    expect(encounter.mascota_id).toEqual(encounterData.mascota_id);
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('debería obtener todos los encuentros', async () => {
    const encounters = await getAllEncounters();
    expect(encounters).toBeInstanceOf(Array);
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('debería obtener un encuentro por ID', async () => {
    const encounterData = {
      mascota_id: new mongoose.Types.ObjectId(),
      mascota2_id: new mongoose.Types.ObjectId(),
      fecha: new Date(),
      ubicacion: { ciudad: 'Ciudad X', calle: 'Calle Y', nombre_lugar: 'Lugar Z' },
      estado: 'pendiente',
    };

    const encounter = await addEncounterToDB(encounterData);
    const fetchedEncounter = await getEncounterByIdFromDB(encounter._id);
    expect(fetchedEncounter._id.toString()).toBe(encounter._id.toString());
  }, 10000); // Limita el tiempo de la prueba a 5000 ms

  it('debería actualizar un encuentro', async () => {
    const encounterData = {
      mascota_id: new mongoose.Types.ObjectId(),
      mascota2_id: new mongoose.Types.ObjectId(),
      fecha: new Date(),
      ubicacion: { ciudad: 'Ciudad X', calle: 'Calle Y', nombre_lugar: 'Lugar Z' },
      estado: 'pendiente',
    };

    const encounter = await addEncounterToDB(encounterData);
    const updatedData = { estado: 'confirmado' };
    const updatedEncounter = await updateEncounterInDB(encounter._id, updatedData);
    expect(updatedEncounter.estado).toBe('confirmado');
  }, 5000); // Limita el tiempo de la prueba a 5000 ms

  it('debería eliminar un encuentro', async () => {
    const encounterData = {
      mascota_id: new mongoose.Types.ObjectId(),
      mascota2_id: new mongoose.Types.ObjectId(),
      fecha: new Date(),
      ubicacion: { ciudad: 'Ciudad X', calle: 'Calle Y', nombre_lugar: 'Lugar Z' },
      estado: 'pendiente',
    };

    const encounter = await addEncounterToDB(encounterData);
    const deletedEncounter = await deleteEncounterFromDB(encounter._id);
    expect(deletedEncounter._id.toString()).toBe(encounter._id.toString());
  }, 10000); // Limita el tiempo de la prueba a 5000 ms
});
