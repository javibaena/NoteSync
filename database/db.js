const mysql = require ("mysql");
 
 //conexion base de datos
const conexion = mysql.createConnection({

    host: "sql8.freesqldatabase.com",
    port:  3306,
    user:"sql8616872",
    password:"nFjLCpZhCu",
    database:"sql8616872"
  });
  
  conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
  });

  module.exports = conexion; 