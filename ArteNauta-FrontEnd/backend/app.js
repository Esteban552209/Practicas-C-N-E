const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./db');

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

//PATH 1
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

// PATH 2
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

// PATH 3
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

// PATH 4
app.get('/comentarios/:idPublicacion/idPublicacion', (req, res) => {

  const idPublicacion = req.params.idPublicacion;

  const consultaSQL = `

    SELECT 
      c.contenido,
      c.fecha_comentario,

      u.nombre,
      u.apellido

    FROM Comentarios c

    INNER JOIN Usuarios u
      ON c.id_usuario_final = u.id_usuario

    WHERE c.id_publicacion = ?

    ORDER BY c.fecha_comentario DESC
  `;

  db.query(consultaSQL, [idPublicacion], (error, resultados) => {

    if(error){
      res.status(500).send(error);

    } else {
      res.json(resultados);
    }

  });

});

// PATH 5
app.get('/publicaciones/:idUsuario/idArtista', (req, res) => {

  const idUsuario = req.params.idUsuario;

  const consultaSQL = `

    SELECT 
      id_publicacion,
      titulo,
      contenido,
      fechaPublicacion,
      id_usuario_artista

    FROM Publicaciones

    WHERE id_usuario_artista = ?

    ORDER BY fechaPublicacion DESC
  `;

  db.query(consultaSQL, [idUsuario], (error, resultados) => {

    if(error){
      res.status(500).send(error);

    } else {
      res.json(resultados);
    }

  });

});

// QUERY 1
app.get('/notificaciones', (req, res) => {

  const idUsuario = req.query.id_usuario;

  const consultaSQL = `

    SELECT *
    FROM notificaciones

    WHERE id_usuario = ?

    ORDER BY fecha_notificacion DESC
  `;

  db.query(consultaSQL, [idUsuario], (error, resultados) => {

    if(error){
      res.status(500).send(error);

    } else {
      res.json(resultados);
    }

  });

});

//QUERY 2
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

// QUERY 3
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

// QUERY 4
app.get('/publicaciones', (req, res) => {

  const idCategoria = req.query.id_categoria;

  const consultaSQL = `

    SELECT 
      p.id_publicacion,
      p.titulo,
      p.contenido,
      p.fechaPublicacion,

      u.nombre,
      u.apellido,

      c.nombreCategoria

    FROM Publicaciones p

    INNER JOIN Usuarios u
      ON p.id_usuario_artista = u.id_usuario

    INNER JOIN Categorias c
      ON p.id_categoria = c.id_categoria

    WHERE p.id_categoria = ?

    ORDER BY p.fechaPublicacion DESC
  `;

  db.query(consultaSQL, [idCategoria], (error, resultados) => {

    if(error){
      res.status(500).send(error);

    } else {
      res.json(resultados);
    }

  });

});

// QUERY 5
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