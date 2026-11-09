
const pool = require('../config/database');


const obtenerProductos = async () => {
    const consulta = `
        SELECT *
        FROM productos
        ORDER BY id_producto
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
};

// Consultar un producto por su ID
const obtenerProductoPorId = async (id) => {
    const consulta = `
        SELECT *
        FROM productos
        WHERE id_producto = $1
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};


const crearProducto = async (producto) => {
    const {
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        id_talla,
        id_color
    } = producto;

    const consulta = `
        INSERT INTO productos
        (nombre_producto, descripcion, precio, id_categoria, id_talla, id_color)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const resultado = await pool.query(consulta, [
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        id_talla,
        id_color
    ]);

    return resultado.rows[0];
};


const actualizarProducto = async (id, producto) => {
    const {
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        id_talla,
        id_color
    } = producto;

    const consulta = `
        UPDATE productos
        SET nombre_producto = $1,
            descripcion = $2,
            precio = $3,
            id_categoria = $4,
            id_talla = $5,
            id_color = $6
        WHERE id_producto = $7
        RETURNING *
    `;

    const resultado = await pool.query(consulta, [
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        id_talla,
        id_color,
        id
    ]);

    return resultado.rows[0];
};


const eliminarProducto = async (id) => {
    const consulta = `
        DELETE FROM productos
        WHERE id_producto = $1
        RETURNING *
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
