const express = require('express');
const router = express.Router();
const conexion = require("./database/db");


router.get('/notes', (req, res)=>{

  
     conexion.query( 'SELECT * FROM notas', (error, results)=>{
        if(error){
            throw error;
        }else{
              res.render('notes', {results:results } )
        }
    }) 
})

/* ruta para crear notas */

router.get('/create', (req, res)=>{
    res.render('create');
})

/* ruta para editar */

router.get("/edit/:id",(req,res)=>{
    const id  = req.params.id;
    
    conexion.query("SELECT * FROM notas WHERE id=?", [id],(error, results)=>{
      if(error){
        throw error;
      }
      res.render("edit",{tarea:results[0]});
    })
    })
  
//ruta para eliminar item

router.get("/delete/:id", (req,res)=>{
  
  const id = req.params.id;

  
  conexion.query("DELETE FROM notas WHERE id = ?", [id], (error, results)=>{
    if(error){
      throw error;
    }
    res.redirect("/notes");
    
  })
});













const crud = require('./controllers/crud');

router.post('/save', crud.save);
router.post("/update", crud.update)

module.exports = router;