// Importar librerías
var express = require('express');
var mongoose = require('mongoose');
var bodPparser = require('body-parser');

// Inicializar variables
var app = express ();

// Confuigurar módulo Body Parser
// Analizar cabecera application/x-www-form-urlencode
app.use(bodPparser.urlencoded({extended: false}));

// Analizar cabecera application/json
app.use(bodPparser.json());

// Importar archivo rutas
var appRoutes = require('./routes/app.routes');
var usuarioRoutes = require('./routes/usuario.routes');
var hospitalRoutes = require('./routes/hospital.routes');
var medicoRoutes = require('./routes/medico.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var loginRoutes = require('./routes/login.routes');
var subidaRoutes = require('./routes/subida.routes');
var imagenesRoutes = require('./routes/imagenes.routes');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes); 
app.use('/busqueda', busquedaRoutes);
app.use('/subida', subidaRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/login', loginRoutes);

// esta siempre tiene que ser la última ruta
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express se está ejecuntamdo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});