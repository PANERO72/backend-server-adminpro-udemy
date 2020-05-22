var express = require('express');
var fs = require('fs');

var app = express();


app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var ruta = `./uploads/${tipo}/${img}`;

    fs.exists( ruta, existe => {
        if(!existe){
            ruta = './assets/img/no-img.123.jpg';
        }

        res.sendfile(ruta);
    });
});

module.exports = app;