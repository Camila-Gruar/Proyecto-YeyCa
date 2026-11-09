
const pool = require('../config/database');


const obtenerCategorias = async () => {
    const resultado = await pool.query(
        'SELECT * FROM categoria ORDER BY id_categoria'
    );

    return resultado.rows;
};


const obtenerCategoriaPorId = async (id) => {
    const resultado = await pool.query(
        'SELECT * FROM categoria WHERE id_categoria = $1',
        [id]
    );

    return resultado.rows[0];
};


const crearCategoria = async (nombre, descripcion) => {
    const resultado = await pool.query(
        `INSERT INTO categoria (nombre_categoria, descripcion)
         VALUES ($1, $2)
         RETURNING *`,
        [nombre, descripcion]
    );

    return resultado.rows[0];
};


const actualizarCategoria = async (id, nombre, descripcion) => {
    const resultado = await pool.query(
        `UPDATE categoria
         SET nombre_categoria = $1, descripcion = $2
         WHERE id_categoria = $3
         RETURNING *`,
        [nombre, descripcion, id]
    );

    return resultado.rows[0];
};


const eliminarCategoria = async (id) => {
    const resultado = await pool.query(
        'DELETE FROM categoria WHERE id_categoria = $1 RETURNING *',
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
