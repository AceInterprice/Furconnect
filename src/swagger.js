// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API FurConnect',
            version: '1.0.0',
            description: 'Documentación de la API de mascotas y usuarios',
            contact: {
                name: 'Soporte',
                email: 'soporte@example.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
            {
                url: 'https://furconnect-api.onrender.com',
                description: 'Servidor de producción',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Pet: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID de la mascota', example: '99' },
                        owner: { type: 'integer', description: 'ID del dueño de la mascota', example: '99' },
                        name: { type: 'string', description: 'Nombre de la mascota', example: 'Rex' },
                        raza: { type: 'string', description: 'Raza de la mascota', example: 'Golden Retriever' },
                        color: { type: 'string', description: 'Color de la mascota', example: 'Dorado' },
                        edad: { type: 'integer', description: 'Edad de la mascota en años', example: 3 },
                        pedigree: { type: 'boolean', description: 'Si la mascota tiene pedigree', example: true },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID del usuario', example: 'user123' },
                        name: { type: 'string', description: 'Nombre del usuario', example: 'Juan Pérez' },
                        email: { type: 'string', description: 'Email del usuario', example: 'juan.perez@example.com' },
                        password: { type: 'string', description: 'Contraseña encriptada del usuario', example: '$2b$10$2EIXwFS.TGbEjUlgBQQRt.3' },
                        role: { type: 'string', description: 'Rol del usuario (admin o user)', example: 'user', default: 'user' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del usuario', example: '2024-10-17T10:53:47.000Z' },
                    },
                },
                Solicitud: {
                    type: 'object',
                    properties: {
                        mascota_solicitante_id: { type: 'string', description: 'ID de la mascota solicitante', example: 'mascota123' },
                        usuario_solicitante_id: { type: 'string', description: 'ID del usuario solicitante', example: 'user123' },
                        mascota_solicitado_id: { type: 'string', description: 'ID de la mascota solicitada', example: 'mascota456' },
                        usuario_solicitado_id: { type: 'string', description: 'ID del usuario solicitado', example: 'user456' },
                        estado: { type: 'string', enum: ['pendiente', 'aceptado', 'rechazado'], description: 'Estado de la solicitud', example: 'pendiente' },
                        fecha_solicitud: { type: 'string', format: 'date', description: 'Fecha de la solicitud', example: '2024-10-29' },
                    },
                    required: ['mascota_solicitante_id', 'usuario_solicitante_id', 'mascota_solicitado_id', 'usuario_solicitado_id', 'estado', 'fecha_solicitud'],
                },
                Encuentro: {
                    type: 'object',
                    properties: {
                        mascota_id: { type: 'string', description: 'ID de la primera mascota', example: '6450c3d2e87f3e29c3d44f6a' },
                        mascota2_id: { type: 'string', description: 'ID de la segunda mascota', example: '6450c3d2e87f3e29c3d44f6b' },
                        fecha: { type: 'string', format: 'date-time', description: 'Fecha del encuentro', example: '2024-10-30T14:30:00.000Z' },
                        ubicacion: {
                            type: 'object',
                            properties: {
                                ciudad: { type: 'string', description: 'Ciudad del encuentro', example: 'Ciudad de México' },
                                calle: { type: 'string', description: 'Calle del encuentro', example: 'Avenida Reforma' },
                                nombre_lugar: { type: 'string', description: 'Nombre del lugar del encuentro', example: 'Parque de Chapultepec' },
                            },
                            required: ['ciudad', 'calle', 'nombre_lugar'],
                        },
                        estado: { type: 'string', enum: ['pendiente', 'confirmado', 'completado', 'cancelado'], description: 'Estado del encuentro', example: 'pendiente' },
                        division: { type: 'string', description: 'División del encuentro', example: 'zona norte' },
                    },
                },
                Seguimiento: {
                    type: 'object',
                    properties: {
                        encuentro_id: { type: 'string', description: 'ID del encuentro asociado', example: '6450c3d2e87f3e29c3d44f6a' },
                        exitoso: { type: 'boolean', description: 'Indicador de si el encuentro fue exitoso', example: true },
                        actualizaciones: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    reporte_id: { type: 'string', description: 'ID del reporte', example: 'reporte123' },
                                    asunto: { type: 'string', description: 'Asunto de la actualización', example: 'Primera revisión del encuentro' },
                                    descripcion: { type: 'string', description: 'Descripción de la actualización', example: 'El encuentro se realizó sin inconvenientes.' },
                                    adjuntos: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                tipo: { type: 'string', description: 'Tipo de adjunto', example: 'imagen' },
                                                url: { type: 'string', description: 'URL del adjunto', example: 'https://example.com/imagen.png' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    required: ['encuentro_id', 'exitoso', 'actualizaciones'],
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/pets.routes.js',
        './src/routes/users.routes.js',
        './src/routes/solicitudes.routes.js'
      ]
};


export default swaggerOptions;