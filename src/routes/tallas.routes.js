const express = require('express');
const router = express.Router();
const tallaController = require('../controllers/talla.controller');

console.log('Rutas de Tallas cargadas');

// Ruta de prueba
router.get('/prueba', (req, res) => {
    res.json({ mensaje: 'Las rutas de Tallas funcionan' });
});

// Consultar todas las tallas
router.get('/', tallaController.obtenerTallas);

// Consultar una talla por ID
router.get('/:id', tallaController.obtenerTallaPorId);

// Crear una talla
router.post('/', tallaController.crearTalla);

// Actualizar una talla
router.put('/:id', tallaController.actualizarTalla);

// Eliminar una talla
router.delete('/:id', tallaController.eliminarTalla);

module.exports = router;
