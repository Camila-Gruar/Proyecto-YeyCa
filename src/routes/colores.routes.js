
const express = require('express');
const router = express.Router();

const coloresController = require('../controllers/color.controller');

router.get('/', coloresController.obtenerColores);
router.get('/:id', coloresController.obtenerColorPorId);
router.post('/', coloresController.crearColor);
router.put('/:id', coloresController.actualizarColor);
router.delete('/:id', coloresController.eliminarColor);

module.exports = router;
