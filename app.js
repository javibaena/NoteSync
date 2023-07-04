const express = require('express'); // Importamos el módulo Express, que nos permite crear y configurar el servidor web.
const path = require('path'); // Proporciona utilidades para trabajar con rutas de archivos y directorios.
const session = require('express-session'); // Middleware para la gestión de sesiones en Express.
const bcryptjs = require('bcryptjs'); // Librería para el hash de contraseñas.
const conexion = require('./database/db'); // Archivo que contiene la configuración de la conexión a la base de datos.
const app = express(); // Instancia principal de la aplicación Express.
const PUERTO = process.env.PUERTO || 3000; // Puerto en el que se ejecutará

// Configuración
app.set('port', PUERTO);
// Establece el puerto en el que el servidor escuchará las peticiones. PUERTO es una variable que almacena el número del puerto (por defecto 3000).

app.set('view engine', 'ejs');
// Configura el motor de plantillas EJS para renderizar vistas en el servidor.

app.set('views', path.join(__dirname, 'views'));



/*  Middlewares */

// Sirve los archivos estáticos de la carpeta 'public' cuando se accede a rutas que comienzan con '/resources'.
app.use('/resources', express.static('public'));

// Sirve los archivos estáticos de la carpeta 'public' cuando se accede a rutas que comienzan con '/resources' utilizando la ruta absoluta.
app.use('/resources', express.static(path.join(__dirname, 'public')));

// Parsea las solicitudes con formato JSON.
app.use(express.json());

// Parsea las solicitudes con datos de formulario codificados en formato URL.
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
// Establece la configuración de la sesión utilizando el módulo 'express-session'.
// 'secret' es la clave secreta utilizada para firmar la cookie de la sesión.
// 'resave' especifica si se debe guardar la sesión en el almacenamiento aunque no se haya modificado.
// 'saveUninitialized' especifica si se debe guardar una sesión que aún no se ha inicializado.
app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));


// Routes
app.use('/', require('./router'));

// Rutas
app.get('/', (req, res) => {
  res.render('index', { msg: '' });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});
// Logout
app.get('/logout', (req, res) => {
   req.session.destroy(() => {
     res.redirect('/');
   });
 });
 

// Registro
// Maneja la solicitud POST para registrar un nuevo usuario.
app.post('/register', async (req, res) => {
  const user = req.body.user;
  const pass = req.body.password;
  const passwordHash = await bcryptjs.hash(pass, 8);
   // Inserta el usuario en la base de datos.
  conexion.query('INSERT INTO users SET ?', { user, pass: passwordHash }, async (error, resultado) => {
    if (error) {
      console.log(error);
    } else {
      console.log('El alta fue exitosa');
      res.render('login');
    }
  });
});

// Login
// Maneja la solicitud POST para autenticar al usuario.
app.post('/auth', async (req, res) => {
  const user = req.body.user;
  const pass = req.body.password;
  // Genera el hash de la contraseña proporcionada por el usuario.
  const passwordHash = await bcryptjs.hash(pass, 8);

  if (user && pass) {
   // Consulta la base de datos para obtener el usuario correspondiente al nombre de usuario proporcionado.
    conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, resultado) => {
      if (resultado.length === 0 || !(await bcryptjs.compare(pass, resultado[0].pass))) {
         // Si no se encuentra el usuario o la contraseña no coincide, renderiza la página de error.
        res.render('error');
      } else {
         // Si el usuario y la contraseña son válidos, redirige al usuario a la página de notas.
        res.redirect('notes');
      }
    });
  }
});

// El servidor escucha en el puerto especificado.
// Se ejecuta cuando el servidor se inicia correctamente.
app.listen(PUERTO, () => {
  console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});