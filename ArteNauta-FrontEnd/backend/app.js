const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./db');

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

//PATHS
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

app.get('/usuarios/:id_usuario', (req, res) => {
  const idRolSolicitado = req.params.id_usuario; 
  
  const consultaSQL = 'SELECT * FROM usuarios WHERE id_usuario = ?';
  
  db.query(consultaSQL, [idRolSolicitado], (error, resultados) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(resultados); 
    }
  });
});

app.get('/publicaciones/:id_publicacion', (req, res) => {
  const idRolSolicitado = req.params.id_publicacion; 
  
  const consultaSQL = 'SELECT * FROM publicaciones WHERE id_publicacion = ?';
  
  db.query(consultaSQL, [idRolSolicitado], (error, resultados) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(resultados); 
    }
  });
});

//QUERYS
app.get('/usuarios', (req, res) => {
  const filtroRol = req.query.id_rol; 
  
  let consultaSQL = 'SELECT * FROM usuarios';
  let variables = [];

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

app.get('/comentarios', (req, res) => {
  const idPubliSolicitada = req.query.id_publicacion; 
  
  let consultaSQL = 'SELECT * FROM comentarios';
  let variables = [];

  if (idPubliSolicitada) {
    consultaSQL += ' WHERE id_publicacion = ?';
    variables.push(idPubliSolicitada);
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

app.get('/muro-publicaciones', (req, res) => {
  const filtroUsuario = req.query.id_usuario_artista;
  let consultaSQL = `
    SELECT 
      publicaciones.*, 
      usuarios.nombre AS nombre_artista, 
      usuarios.email
    FROM publicaciones
    JOIN usuarios ON publicaciones.id_usuario_artista = usuarios.id_usuario
  `;
  
  let variables = [];

  if (filtroUsuario) {
    consultaSQL += ' WHERE publicaciones.id_usuario_artista = ?';
    variables.push(filtroUsuario);
  }

  db.query(consultaSQL, variables, (error, resultados) => {
    if (error) {
      console.log("Error en la consulta:", error);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(resultados); 
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 