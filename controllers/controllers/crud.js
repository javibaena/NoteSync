const conexion = require("../database/db");

exports.save = (req, res )=>{
    const tarea = req.body.tarea;
    const rol = req.body.rol;
   conexion.query("INSERT INTO  notas SET ?", {tarea:tarea,rol:rol}, (error, results)=>{
    if(error){
        console.log(error);
    }else{
        res.redirect("notes");
    }
   })
}

exports.update = (req,res)=>{
    const id = req.body.id;
    const tarea = req.body.tarea;
    const rol = req.body.rol;
    conexion.query("UPDATE notas SET ? WHERE id = ?",[{tarea:tarea, rol:rol}, id] , (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect("/notes");
        }
    })
}
