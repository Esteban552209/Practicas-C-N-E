const express = require('express');
const cors = require('cors');

const salonesRoutes = require('./routes/salones.routes');
const equiposRoutes = require('./routes/equipos.routes');
const app = express();

app.use(express.json());
app.use(cors());

// Asignación de rutas
app.use('/salones', salonesRoutes);
app.use('/equipos', equiposRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API estructurada y corriendo en http://localhost:${PORT}`);
});