 /* 1 invocamos a express */
 const express = require('express');
 const path = require("path");
 const morgan = require('morgan');
 const conexion = require('./database/db');
 const session = require("express-session") /* modulo session */

/* invocamos bcryptjs */
const bcryptjs = require ('bcryptjs');
 const app = express();





 /* settings */
/* definimos puerto */
app.set("port", process.env.PUERTO || 3000);
const PUERTO = 3000;

/* invocamos dotenv  */
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});
/*  2 motor de platillas */
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views") );

const bodyParser = require("body-parser");//modulo body-parser


/* middlewares */
app.use(morgan('dev'));

/* routes */


/*  */




/* directorio public */
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));


app.use(bodyParser.json());
/* para capturar datos del formulario */
app.use(bodyParser.urlencoded({extended: true}));

/* importancion del enrutador */
app.use('/', require('./router'));

// Configuración de la sesión
app.use(session({
   secret: 'secreto',
   resave: true,
   saveUninitialized: true
 })); 
/* rutas */

app.get('/',(req, res)=>{
   res.render('index',{msg: ''})
})

app.get('/login',(req, res)=>{
   res.render('login')
});

app.get('/register',(req, res)=>{
   res.render('register.ejs');
})

/* registro */

app.post("/register", async (req, res)=>{
   const user = req.body.user;
   const name = req.body.name;
   const pass = req.body.password;
   let passwordHaash = await bcryptjs.hash(pass,8)
  conexion.query("INSERT INTO users SET ?", 
   {user:user, name : name, pass: passwordHaash},
   async (error, resulultado)=>{
       if(error){
           console.log(error);
       }
           console.log("el alta fue exitosa")
           res.render('login');

          
   })
   
})

/* login */

 //acceso login
 app.post("/auth", async(req, res)=>{
   const  user = req.body.user;
   const pass = req.body.password;
   let passwordHaash = await bcryptjs.hash(pass,8);
   if(user && pass){
       conexion.query("SELECT * FROM users WHERE user = ?", [user],
       async(error, resultado) =>{
           if(resultado.length== 0 || !(await bcryptjs.compare(pass, resultado[0].pass))){
               res.render("error");
           }
           res.redirect("notes");
       
       })
   }
});

//ruta logout corta la sesion
app.get("/logout", (req, res)=>{
   req.session.destroy(()=>{
       res.redirect("/")
   })
})




 app.listen(PUERTO, (req, res)=>{
    console.log(`el servidor esta escuchando en el puerto ${PUERTO}`)
 })