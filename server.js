const express = require('express');
const path = require('path');
const { convertirTemperatura } = require('./helpers/convert');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - servir la página web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint para conversión de temperaturas
app.post('/api/convert', (req, res) => {
    try {
        const { temperature, unit } = req.body;

        // Validaciones
        if (!temperature || isNaN(temperature)) {
            return res.status(400).json({
                success: false,
                message: 'La temperatura debe ser un número válido'
            });
        }

        if (!unit || !['c', 'f', 'celsius', 'fahrenheit'].includes(unit.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Unidad no válida. Use "c" para Celsius o "f" para Fahrenheit'
            });
        }

        // Realizar la conversión
        const resultado = convertirTemperatura(parseFloat(temperature), unit);

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Ruta para obtener información de la API
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Conversor de Temperaturas API',
        version: '1.0.0',
        description: 'API para convertir temperaturas entre Celsius y Fahrenheit',
        endpoints: {
            'POST /api/convert': 'Convierte temperatura entre unidades',
            'GET /api/info': 'Información de la API'
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Aplicación web disponible en: http://localhost:${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}/api/convert`);
});

module.exports = app;
