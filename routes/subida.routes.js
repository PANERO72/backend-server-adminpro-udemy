var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validar el tipo de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false, mensaje: 'El tipo de colección no es válido.', errors: { message: 'Los tipos de colección son: ' + tiposValidos.join(', ') + '.'}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false, mensaje: 'No se subió nada.', errors: { message: 'Debe seleccionar una imagen.'}
        });
    }

    // obtener nombre y tipo de la imagen
    var archivo = req.files.imagen;
    var nombreRecortado = archivo.name.split('.');
    var extensionArchivo = nombreRecortado[nombreRecortado.length - 1];

    // Solo aceptamos estas extensiones de archivo
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false, mensaje: 'La extensión de la imagen no es válida.', errors: { message: 'Las extensiones de imagen permitidas son: ' + extensionesValidas.join(', ') + '.'}
        });
    }

    // Nombre personalizado de la imagen
    var nombrePersonalizado = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover la imagen del temporal al destino
    var ruta = `./uploads/${tipo}/${nombrePersonalizado}`;

    archivo.mv(ruta, err => {
        if(err){
            return res.status(500).json({
                ok: false, mensaje: 'Error al mover la imagen.', errors: err
            });
        }

        subirImagenPorTipo(tipo, id, nombrePersonalizado, res);

        // res.status(200).json({
        //     ok: true, mensaje: 'La imagen fue movida con éxito.', extensionArchivo: extensionArchivo
        // });

    });

});

function subirImagenPorTipo(tipo, id, nombrePersonalizado, res){
    if( tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario) => {
            if(!usuario){
                return res.status(200).json({
                    ok: true, mensaje: 'El usuario no exite.', errors: {message: 'El usuario no exite.'}
                });
            }
            
            var rutaAntigua = './uploads/usuarios/' + usuario.img;

            // Si exite la imagen antigua se eliminará
            if(fs.existsSync(rutaAntigua)){
                fs.unlinkSync(rutaAntigua);
            }

            usuario.img = nombrePersonalizado;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = '*****';
                return res.status(200).json({
                    ok: true, mensaje: 'La imagen del usuario fue actualizada con éxito.', usuario: usuarioActualizado
                });
            });
        });
    }
    
    if( tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital) => {
            if(!hospital){
                return res.status(200).json({
                    ok: true, mensaje: 'El hospital no exite.', errors: {message: 'El hospital no exite.'}
                });
            }
            
            var rutaAntigua = './uploads/hospitales/' + hospital.img;

            // Si exite la imagen antigua se eliminará
            if(fs.existsSync(rutaAntigua)){
                fs.unlinkSync(rutaAntigua);
            }

            hospital.img = nombrePersonalizado;
            hospital.save((err, hospitaloActualizado) => {
                return res.status(200).json({
                    ok: true, mensaje: 'La imagen del hospìtal fue actualizada con éxito.', hospital: hospitaloActualizado
                });
            });
        });
    }
    if( tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {

            if(!medico){
                return res.status(200).json({
                    ok: true, mensaje: 'El médico no exite.', errors: {message: 'El médico no exite.'}
                });
            }
            var rutaAntigua = './uploads/medicos/' + medico.img;

            // Si exite la imagen antigua se eliminará
            if(fs.existsSync(rutaAntigua)){
                fs.unlinkSync(rutaAntigua);
            }

            medico.img = nombrePersonalizado;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true, mensaje: 'La imagen del médico fue actualizada con éxito.', medico: medicoActualizado 
                });
            });
        });
    }
}

module.exports = app;