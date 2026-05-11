const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'artenauta'
});

conexion.connect((error) => {
  if (error) {
    console.error('El error de conexión es: ' + error);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

module.exports = conexion;