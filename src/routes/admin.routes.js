    import express from 'express';
    import User from '../models/user.model.js';
    import Pet from '../models/pet.model.js';
    import Solicitud from '../models/solicitud.model.js';
    import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

    const router = express.Router();

    // 1️⃣ Obtener la cantidad de usuarios activos en la app móvil
    router.get('/usuarios-activos', verifyToken, verifyRole(["admin"]), async (req, res) => {
        try {
            const usuariosActivos = await User.countDocuments({
                ultimo_login: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            });
            res.json({ usuariosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios activos' });
        }
    });

    // 2️⃣ Obtener las razas más populares en la app
    router.get('/razas-populares', verifyToken, verifyRole(["admin"]), async (req, res) => {
        try {
            const razasPopulares = await Pet.aggregate([
                { $group: { _id: '$raza', cantidad: { $sum: 1 } } },
                { $sort: { cantidad: -1 } },
                { $limit: 5 }
            ]);
            res.json(razasPopulares);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener razas populares' });
        }
    });

    // 3️⃣ Obtener la cantidad de solicitudes por estado
    router.get('/solicitudes-estado', verifyToken, verifyRole(["admin"]), async (req, res) => {
        try {
            const solicitudes = await Solicitud.aggregate([
                { $group: { _id: '$estado', total: { $sum: 1 } } }
            ]);
            res.json(solicitudes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener datos de solicitudes' });
        }
    });

    // 4️⃣ Obtener la cantidad de usuarios por plan (gratis/premium)
    router.get('/usuarios-plan', verifyToken, verifyRole(["admin"]), async (req, res) => {
        try {
            const usuariosPorPlan = await User.aggregate([
                { $group: { _id: '$estatus', cantidad: { $sum: 1 } } }
            ]);
            res.json(usuariosPorPlan);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener datos de usuarios por plan' });
        }
    });

    export default router;
