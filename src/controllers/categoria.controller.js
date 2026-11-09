
const categoriaModel = require('../models/categoria.model');

// Consultar todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar las categorías' });
    }
};

// Consultar una categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await categoriaModel.obtenerCategoriaPorId(req.params.id);

        if (!categoria) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar la categoría' });
    }
};

// Crear una categoría
const crearCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria || !nombre_categoria.trim()) {
            return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
        }

        const categoria = await categoriaModel.crearCategoria(
            nombre_categoria.trim(),
            descripcion ?? null
        );

        res.status(201).json(categoria);
    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
        }

        res.status(500).json({ mensaje: 'Error al crear la categoría' });
    }
};

// Actualizar una categoría
const actualizarCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria || !nombre_categoria.trim()) {
            return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
        }

        const categoria = await categoriaModel.actualizarCategoria(
            req.params.id,
            nombre_categoria.trim(),
            descripcion ?? null
        );

        if (!categoria) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
        }

        res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
    }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
    try {
        const categoria = await categoriaModel.eliminarCategoria(req.params.id);

        if (!categoria) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.status(200).json({ mensaje: 'Categoría eliminada correctamente', categoria });
    } catch (error) {
        console.error(error);

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoría porque está relacionada con productos'
            });
        }

        res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
