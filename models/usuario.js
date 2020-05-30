var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos ={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El role \'{VALUE}\' no está permitido.'
};

var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El campo Nombre es obligatorio.']},
    email: {type: String, unique: true, required: [true, 'El campo Email es obligatorio.']},
    password: {type: String, required: [true, 'El campo Contraseña es obligatorio.']},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    google: {type: Boolean, default: false},
});
usuarioSchema.plugin(uniqueValidator,{message : 'El campo \'{PATH}\' debe ser único.'});

module.exports = mongoose.model('Usuario', usuarioSchema);