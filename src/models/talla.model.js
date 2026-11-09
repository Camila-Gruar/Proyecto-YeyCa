
const pool = require('../config/database');

// Consultar todas las tallas
const obtenerTallas = async () => {
    const resultado = await pool.query(
        'SELECT * FROM tallas ORDER BY id_talla'
    );
    return resultado.rows;
};

// Consultar una talla por su ID
const obtenerTallaPorId = async (id) => {
    const resultado = await pool.query(
        'SELECT * FROM tallas WHERE id_talla = $1',
        [id]
    );
    return resultado.rows[0];
};

// Crear una talla
const crearTalla = async (numero_talla, tipo_producto) => {
    const resultado = await pool.query(
        `INSERT INTO tallas (numero_talla, tipo_producto)
         VALUES ($1, $2)
         RETURNING *`,
        [numero_talla, tipo_producto]
    );
    return resultado.rows[0];
};

// Actualizar una talla
const actualizarTalla = async (id, numero_talla, tipo_producto) => {
    const resultado = await pool.query(
        `UPDATE tallas
         SET numero_talla = $1, tipo_producto = $2
         WHERE id_talla = $3
         RETURNING *`,
        [numero_talla, tipo_producto, id]
    );
    return resultado.rows[0];
};

// Eliminar una talla
const eliminarTalla = async (id) => {
    const resultado = await pool.query(
        'DELETE FROM tallas WHERE id_talla = $1 RETURNING *',
        [id]
    );
    return resultado.rows[0];
};

module.exports = {
    obtenerTallas,
    obtenerTallaPorId,
    crearTalla,
    actualizarTalla,
    eliminarTalla
};
