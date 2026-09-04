const express = require('express');
const cors = require('cors');

const salonesRoutes = require('./routes/salones.routes');
const equiposRoutes = require('./routes/equipos.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const historialdRoutes = require('./routes/historial.routes');
const app = express();

app.use(express.json());
app.use(cors());

// Asignación de rutas
app.use('/salones', salonesRoutes);
app.use('/equipos', equiposRoutes);
app.use('/dashboard', dashboardRoutes)
app.use('/historial', historialdRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API estructurada y corriendo en http://localhost:${PORT}`);
});