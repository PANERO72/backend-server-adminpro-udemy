var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//var SEED = require('../config/config').SEED;

var Hospital = require('../models/hospital');

// Obtener hospital

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}).skip(desde).limit(5).populate('usuario', 'nombre email').exec( (err, hospitales) => {
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al obtener hospitales.', errors: err
            });
        }

        Hospital.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true, hospitales: hospitales, total: conteo
            });
        });
    });    
});

// Actualizar un hospital
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al buscar el hospital.', errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false, mensaje: 'El hospital con el ID ' + id + 'no existe.', errors: { message: 'No existe un hospital con ese ID.'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false, mensaje: 'Error al actualizar el hospital.', errors: err
                });
            }

            res.status(200).json({
                ok: true, hospital: hospitalGuardado
            });
        });
    });
});

// Crear un hospital
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false, mensaje: 'Error al crear hopital.', errors: err
            });
        }
        res.status(201).json({
            ok: true, hospital: hospitalGuardado 
        });
    });
});

// Eliminar un hospial por su ID
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al eliminar hospital.', errors: err
            });
        }
         
        if(!hospitalEliminado){
            return res.status(400).json({
                ok: false, mensaje: 'No existe un hospital con es ID.', errors: { message: 'El hospital con el ID: ' + id + ' no existe.'}
            });
        }
        res.status(200).json({
            ok: true, hospital: hospitalEliminado
        });
    });
});

module.exports = app;