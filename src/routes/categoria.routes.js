
const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoria.controller');

// Consultar todas las categorías
router.get('/', categoriaController.obtenerCategorias);

// Consultar una categoría por su ID
router.get('/:id', categoriaController.obtenerCategoriaPorId);

// Crear una categoría
router.post('/', categoriaController.crearCategoria);

// Actualizar una categoría
router.put('/:id', categoriaController.actualizarCategoria);

// Eliminar una categoría
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
