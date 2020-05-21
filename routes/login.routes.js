var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usiarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al buscar usuario.', errors: err
            });
        }

        if(!usiarioDB){
            return res.status(400).json({
                ok: false, mensaje: 'Credenciales incorrectas - email.', errors: err
            });
        }

        if(!bcrypt.compareSync(body.password, usiarioDB.password)){
            return res.status(400).json({
                ok: false, mensaje: 'Credenciales incorrectas - password.', errors: err
            });
        }

        // Crear un token de validación
        usiarioDB.password = '*****';
        var token = jwt.sign({ usuario: usiarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true, usuario: usiarioDB, token: token, id: usiarioDB._id
        });
    });
});


module.exports = app;