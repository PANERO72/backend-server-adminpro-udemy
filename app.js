//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Inicializar variables
var app = express();

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./routes/app.routes');
var usuarioRoutes = require('./routes/usuario.routes');
var loginRoutes = require('./routes/login.routes');
var hospitalRoutes = require('./routes/hospital.routes');
var medicoRoutes = require('./routes/medico.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var uploadRoutes = require('./routes/subida.routes');
var imagenesRoutes = require('./routes/imagenes.routes');

// conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' on line');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use("/subida", uploadRoutes);
app.use("/imagenes", imagenesRoutes);
app.use('/', appRoutes);

// Excuchar peticiones
app.listen(3000, () =>{
    console.log('Server puerto 3000: \x1b[32m%s\x1b[0m',' on line');
});