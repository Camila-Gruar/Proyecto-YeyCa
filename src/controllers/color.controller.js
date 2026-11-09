
const colorModel = require('../models/color.model');

// Consultar todos los colores
const obtenerColores = async (req, res) => {
    try {
        const colores = await colorModel.obtenerColores();
        res.status(200).json(colores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar los colores' });
    }
};

// Consultar un color por ID
const obtenerColorPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del color no es válido' });
        }

        const color = await colorModel.obtenerColorPorId(id);

        if (!color) {
            return res.status(404).json({ mensaje: 'Color no encontrado' });
        }

        res.status(200).json(color);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar el color' });
    }
};

// Crear un color
const crearColor = async (req, res) => {
    try {
        const { nombre_color } = req.body;

        if (
            typeof nombre_color !== 'string' ||
            !nombre_color.trim() ||
            nombre_color.trim().length > 50
        ) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio y debe tener máximo 50 caracteres'
            });
        }

        const color = await colorModel.crearColor(nombre_color.trim());
        res.status(201).json(color);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el color' });
    }
};

// Actualizar un color
const actualizarColor = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre_color } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del color no es válido' });
        }

        if (
            typeof nombre_color !== 'string' ||
            !nombre_color.trim() ||
            nombre_color.trim().length > 50
        ) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio y debe tener máximo 50 caracteres'
            });
        }

        const color = await colorModel.actualizarColor(id, nombre_color.trim());

        if (!color) {
            return res.status(404).json({ mensaje: 'Color no encontrado' });
        }

        res.status(200).json(color);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el color' });
    }
};

// Eliminar un color
const eliminarColor = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del color no es válido' });
        }

        const color = await colorModel.eliminarColor(id);

        if (!color) {
            return res.status(404).json({ mensaje: 'Color no encontrado' });
        }

        res.status(200).json({
            mensaje: 'Color eliminado correctamente',
            color
        });
    } catch (error) {
        console.error(error);

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar el color porque está relacionado con otros registros'
            });
        }

        res.status(500).json({ mensaje: 'Error al eliminar el color' });
    }
};

module.exports = {
    obtenerColores,
    obtenerColorPorId,
    crearColor,
    actualizarColor,
    eliminarColor
};
