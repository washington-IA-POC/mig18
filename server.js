const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // En producción, especifica dominios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined')); // Logging de requests

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Manejar rutas de AngularJS (SPA)
app.get('*', (req, res) => {
    // Para todas las rutas, servir index.html (SPA routing)
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado exitosamente!');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Backend: https://zwhf4xnv-5000.use2.devtunnels.ms/`);
    console.log('📝 Para detener: Ctrl + C');
    console.log('-----------------------------------');
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Cerrando servidor...');
    process.exit(0);
});
