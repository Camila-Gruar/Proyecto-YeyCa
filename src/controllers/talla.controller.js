
const tallaModel = require('../models/talla.model');

// Consultar todas las tallas
const obtenerTallas = async (req, res) => {
    try {
        const tallas = await tallaModel.obtenerTallas();
        res.status(200).json(tallas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar las tallas' });
    }
};

// Consultar una talla por ID
const obtenerTallaPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID de la talla no es válido' });
        }

        const talla = await tallaModel.obtenerTallaPorId(id);

        if (!talla) {
            return res.status(404).json({ mensaje: 'Talla no encontrada' });
        }

        res.status(200).json(talla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar la talla' });
    }
};

// Crear una talla
const crearTalla = async (req, res) => {
    try {
        const { numero_talla, tipo_producto } = req.body;

        if (
            typeof numero_talla !== 'string' ||
            !numero_talla.trim() ||
            typeof tipo_producto !== 'string' ||
            !tipo_producto.trim()
        ) {
            return res.status(400).json({
                mensaje: 'El número de talla y el tipo de producto son obligatorios'
            });
        }

        const talla = await tallaModel.crearTalla(
            numero_talla.trim(),
            tipo_producto.trim()
        );

        res.status(201).json(talla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear la talla' });
    }
};

// Actualizar una talla
const actualizarTalla = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { numero_talla, tipo_producto } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID de la talla no es válido' });
        }

        if (
            typeof numero_talla !== 'string' ||
            !numero_talla.trim() ||
            typeof tipo_producto !== 'string' ||
            !tipo_producto.trim()
        ) {
            return res.status(400).json({
                mensaje: 'El número de talla y el tipo de producto son obligatorios'
            });
        }

        const talla = await tallaModel.actualizarTalla(
            id,
            numero_talla.trim(),
            tipo_producto.trim()
        );

        if (!talla) {
            return res.status(404).json({ mensaje: 'Talla no encontrada' });
        }

        res.status(200).json(talla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar la talla' });
    }
};

// Eliminar una talla
const eliminarTalla = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID de la talla no es válido' });
        }

        const talla = await tallaModel.eliminarTalla(id);

        if (!talla) {
            return res.status(404).json({ mensaje: 'Talla no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Talla eliminada correctamente',
            talla
        });
    } catch (error) {
        console.error(error);

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la talla porque está relacionada con otros registros'
            });
        }

        res.status(500).json({ mensaje: 'Error al eliminar la talla' });
    }
};

module.exports = {
    obtenerTallas,
    obtenerTallaPorId,
    crearTalla,
    actualizarTalla,
    eliminarTalla
};
