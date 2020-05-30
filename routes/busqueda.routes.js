var express = require("express");
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//========================================================================
// Buscar por colección
//========================================================================
app.get("/coleccion/:tabla/:busqueda",(req, res)=>{
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var tabla = req.params.tabla;
    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedico(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los criterios de búsqueda sólo son: Usuarios, Médicos y Hospitales.',
                error: {message: 'Tipo de tabla/colección no válido.'}
            });
    }
    promesa.then(data =>{
        res.status(200).json({
            ok: true,
            [tabla]:data
        });
    });
});

//========================================================================
// Buscar por médico, usuario y hospitales
//========================================================================
app.get("/todo/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedico(busqueda,regex),
            buscarUsuario(busqueda, regex)])
            .then( respuestas =>{
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
            });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject)=>{
        Hospital.find({ nombre: regex })
        .populate('usuario', 'nombre email role')
        .exec((err, hospitales) => {
            if (err) {
                reject('Error al cargar los hospitales.', err);
            }else{
                resolve(hospitales);
            }
        });
    });
    
}

function buscarMedico(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
        .populate('usuario', 'nombre email role')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                reject('Error al cargar los médicos.', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({},'nombre email role')
    .or([{nombre: regex}, {email: regex}])
    .exec( (err, usuarios)=>{
        if(err){
            reject('Error al cargar los usuarios.', err);
        }else{
            resolve(usuarios);
        }
    })
  });
}
module.exports = app;