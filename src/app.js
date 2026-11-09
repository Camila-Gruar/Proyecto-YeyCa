

require('dotenv').config();

const express = require('express');
const pool = require('./config/database');

const categoriaRoutes = require('./routes/categoria.routes');
const tallaRoutes = require('./routes/tallas.routes');
const colorRoutes = require('./routes/colores.routes');
const productoRoutes = require('./routes/producto.routes');

const app = express();



app.use(express.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/productos', productoRoutes);



console.log('Rutas de Productos cargadas');

app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.get('/prueba-conexion', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');

        res.json({
            mensaje: 'Conexion con PostgreSQL exitosa',
            fecha: resultado.rows[0].now
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensaje: 'Error al conectar con PostgreSQL'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
