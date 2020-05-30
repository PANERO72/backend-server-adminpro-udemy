var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  // tipos de colección
  var tiposValidos = ['hospitales','medicos','usuarios'];
  if(tiposValidos.indexOf(tipo)<0){
    return res.status(400).json({
      ok: false,
      mensaje: "Tipo de colección no válido.",
      errors: { message: 'Tipo de colección permitidos son: ' + tiposValidos.join(',') + '.' }
    });
  }

  if(!req.files){
    return res.status(400).json({
      ok: false,
      mensaje: "No se seleccionó nada.",
      errors: {message:  'Debe de seleccionar una imagen.'}
    });
  }
  // obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split('.');
  var extensionArchivo = nombreCortado[nombreCortado.length -1];

  // validación de extenciones
  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if(extensionesValidas.indexOf(extensionArchivo) < 0){
    return res.status(400).json({
      ok: false,
      mensaje: "Extensión de imagen no válida.",
      errors: { message: 'Las extensiones de imagen permitidas son: ' + extensionesValidas.join(', ') + '.' }
    });
  }
  // Nombre de archivo personalizado.
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  // mover el archivo a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err=>{
    if(err){
      return res
        .status(500)
        .json({
          ok: false,
          mensaje: "Error al mover archivo.",
          errors: err
        });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
    // res.status(200).json({
    //   ok: true,
    //   mensaje: "Archivo movido",
    //   extension: extensionArchivo
    // });
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res){
  if(tipo === 'usuarios'){
    Usuario.findById(id, (err, usuario)=>{
      if(!usuario){
        return res.status(400).json({
          ok: false,
          mensaje: "El Usuario no existe.",
          errors: {message: 'El Usuario no existe.'} 
        });
      }
      var pathViejo = './uploads/usuarios/'+ usuario.img;

      // si existe elimina la imagen anterior
      if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo);
      } 
      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado)=>{
        usuarioActualizado.password = "****";
        return  res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada.",
          usuario: usuarioActualizado
        });
      });
    });
  }
  // fin de la verificación de usuarios
  if(tipo === 'medicos'){
    Medico.findById(id ,(err, medico)=>{
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: "El Médico no existe.",
          errors: { message: 'El Médico no existe.' }
        });
      }

      var pathViejo = './uploads/medicos/' + medico.img;

      // si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo, (err) => {
          console.log('Imagen del médico elimanda.');
        });
      }
      medico.img = nombreArchivo;

      medico.save((err, medicoActualizado)=>{
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen del médico actualizada.",
          medico: medicoActualizado
        });
      });
    });
  }
  //Fin de la verificación de médicos
  if(tipo === 'hospitales'){
    Hospital.findById(id, (err, hospital)=>{
      if (!hospital) {
        return res
          .status(400)
          .json({
            ok: false,
            mensaje: "El Hospital no existe.",
            errors: { message: "El Hospital no existe." }
          });
      }
      var pathViejo = './uploads/hospitales/' + hospital.img;

      // si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo, (err) => {

        });
      }
      hospital.img = nombreArchivo;

      hospital.save((err, hospitalActualizado)=>{
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen del hospital actualizada.",
          hospital: hospitalActualizado
        });
      });
    });
  }
  //fin verificación de hospitales
  // fin de la función 
}

module.exports = app;