const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./db');

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

app.get('/roles/:id_rol', (req, res) => {
  const idRolSolicitado = req.params.id_rol; 
  
  const consultaSQL = 'SELECT * FROM roles WHERE id_rol = ?';
  
  db.query(consultaSQL, [idRolSolicitado], (error, resultados) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(resultados); 
    }
  });
});

// QUERY PARAMETER: Filtrar usuarios (ej. ?rol=1)
app.get('/usuarios', (req, res) => {
  // req.query guarda las variables que van después del "?"
  const filtroRol = req.query.id_rol; 
  
  let consultaSQL = 'SELECT * FROM usuarios';
  let variables = [];

  // Si el usuario envió un query de id_rol, modificamos la consulta SQL
  if (filtroRol) {
    consultaSQL += ' WHERE id_rol = ?';
    variables.push(filtroRol);
  }

  db.query(consultaSQL, variables, (error, resultados) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(resultados); 
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 