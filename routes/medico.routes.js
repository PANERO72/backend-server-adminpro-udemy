var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//var SEED = require('../config/config').SEED;

var Medico = require('../models/medico');

// Obtener médico

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}).skip(desde).limit(5).populate('usuario', 'nombre email').populate('hospital').exec( (err, medicos) => {
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al obtener los medicos.', errors: err
            });
        }

        Medico.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true, medicos: medicos, total: conteo
            });
        });

    });    
});

// Actualizar un médico
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al buscar el médico.', errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok: false, mensaje: 'El médico con el ID ' + id + 'no existe.', errors: { message: 'No existe un médico con ese ID.'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicoGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false, mensaje: 'Error al actualizar el médico.', errors: err
                });
            }

            res.status(200).json({
                ok: true, medico: medicoGuardado
            });
        });
    });
});

// Crear un médico
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false, mensaje: 'Error al crear el médico.', errors: err
            });
        }
        res.status(201).json({
            ok: true, medico: medicoGuardado 
        });
    });
});

// Eliminar un médico por su ID
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al eliminar el médico.', errors: err
            });
        }
         
        if(!medicoEliminado){
            return res.status(400).json({
                ok: false, mensaje: 'No existe un médico con es ID.', errors: { message: 'El médico con el ID: ' + id + ' no existe.'}
            });
        }
        res.status(200).json({
            ok: true, medico: medicoEliminado
        });
    });
});

module.exports = app;