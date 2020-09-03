var express = require("express");
var app = express();
var bcrypt = require("bcryptjs");

var Usuario = require('../models/usuario');
var jwt = require("jsonwebtoken");
var mdAutenticacion = require("../middlewares/autenticacion");

var SEED = require('../config/config').SEED;
//========================================================================
// Obtener todos los usuarios
//=======================================================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({},'_id nombre email img role google')
    .skip(desde)
    .limit(5)
    .exec(
    (err, usuarios) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: "Error cargando usuarios.",
                errors : err
            });
        }
        Usuario.count({},(err, conteo)=>{
            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                total: conteo
            });
        }); 
    })
});

//========================================================================
// Crear un nuevo usuario
//========================================================================  
app.post("/" ,(req, res)=>{
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al crear usuario.",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario 
            });
    });
});

//========================================================================
// Actualizar usuario
//========================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    mensaje: "Error al buscar usuario.",
                    errors: err
                });
        }
        if (!usuario) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: "El usuario no existe.",
                    errors: { message: 'No existe un usuario con ese ID.' }
                });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario.",
                    errors: err
                });
            }
            usuarioGuardado.password = '*****';
            res.status(200).json({ ok: true, usuario: usuarioGuardado });
        });
    });
});

//========================================================================
// Eliminar usuario por el id
//========================================================================
app.delete('/:id', mdAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id,(err, usuarioEliminado)=>{
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    mensaje: "Error al eliminar usuario.",
                    errors: err
                });
        }
        if (!usuarioEliminado) {
          return res
            .status(400)
            .json({
              ok: false,
              mensaje: "No existe un usuario con ese ID.",
              errors: {message: 'El usuario con el ' + id + ' no existe.'}
            });
        }
        res.status(200).json({
           // ok: true, mensaje: 'Usuario elimado.'
           ok: true, usuario: usuarioEliminado
        });
    });
});
module.exports = app;