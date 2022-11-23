const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuariosSchema = new Schema({
	username: { type: String, required: true,  unique: true },
	password: { type: String, required: true },
	direccion: { type: String, required: true, },
}, {collection: "Usuarios"});

module.exports = mongoose.model ('Usuarios', UsuariosSchema);
