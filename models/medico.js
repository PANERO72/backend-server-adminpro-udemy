var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El campo Nombre es obligatorio.']}, img: { type: String, required: false}, usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true}, hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'E campo ID del Hospital es obligatorio.']}
});

module.exports = mongoose.model('Medico', medicoSchema);