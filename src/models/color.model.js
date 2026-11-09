
const pool = require('../config/database');

// Consultar todos los colores
const obtenerColores = async () => {
    const resultado = await pool.query(
        'SELECT * FROM colores ORDER BY id_color'
    );
    return resultado.rows;
};

// Consultar un color por ID
const obtenerColorPorId = async (id) => {
    const resultado = await pool.query(
        'SELECT * FROM colores WHERE id_color = $1',
        [id]
    );
    return resultado.rows[0];
};

// Crear un color
const crearColor = async (nombre_color) => {
    const resultado = await pool.query(
        `INSERT INTO colores (nombre_color)
         VALUES ($1)
         RETURNING *`,
        [nombre_color]
    );
    return resultado.rows[0];
};

// Actualizar un color
const actualizarColor = async (id, nombre_color) => {
    const resultado = await pool.query(
        `UPDATE colores
         SET nombre_color = $1
         WHERE id_color = $2
         RETURNING *`,
        [nombre_color, id]
    );
    return resultado.rows[0];
};

// Eliminar un color
const eliminarColor = async (id) => {
    const resultado = await pool.query(
        'DELETE FROM colores WHERE id_color = $1 RETURNING *',
        [id]
    );
    return resultado.rows[0];
};

module.exports = {
    obtenerColores,
    obtenerColorPorId,
    crearColor,
    actualizarColor,
    eliminarColor
};
