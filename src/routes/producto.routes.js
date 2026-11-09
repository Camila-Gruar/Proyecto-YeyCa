
const express = require('express');
const router = express.Router();

const productoController = require('../controllers/producto.controller');

console.log('Controlador de Productos:', Object.keys(productoController));

router.get('/', productoController.listarProductos);
router.get('/:id', productoController.buscarProducto);
router.post('/', productoController.registrarProducto);
router.put('/:id', productoController.modificarProducto);
router.delete('/:id', productoController.borrarProducto);

console.log('Métodos de Productos registrados');

module.exports = router;

