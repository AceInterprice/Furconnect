import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del header Authorization
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();  // Continúa con la siguiente función
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        } else {
            return res.status(500).json({ message: 'Error en la autenticación del token' });
        }
    }
};


export const verifyRole = (requiredRoles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'No se puede verificar el rol del usuario' });
    }

    if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }

    next(); 
};
