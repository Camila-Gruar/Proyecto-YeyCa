
const Producto = require('../models/productos.model');

// Consultar todos los productos
const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: 'Error al consultar los productos' });
    }
};

// Consultar un producto por ID
const buscarProducto = async (req, res) => {
    try {
        const producto = await Producto.obtenerProductoPorId(req.params.id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: 'Error al consultar el producto' });
    }
};

// Crear un producto
const registrarProducto = async (req, res) => {
    try {
        const producto = await Producto.crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: 'Error al crear el producto' });
    }
};

// Actualizar un producto
const modificarProducto = async (req, res) => {
    try {
        const producto = await Producto.actualizarProducto(
            req.params.id,
            req.body
        );

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
const borrarProducto = async (req, res) => {
    try {
        const producto = await Producto.eliminarProducto(req.params.id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({
            mensaje: 'Producto eliminado correctamente',
            producto
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};

module.exports = {
    listarProductos,
    buscarProducto,
    registrarProducto,
    modificarProducto,
    borrarProducto
};
