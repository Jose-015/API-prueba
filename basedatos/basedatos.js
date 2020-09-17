const database = require('mongoose');
const Schema = database.Schema;

const clase = new Schema({
	nombre : String,
	numalum : Number,
	status : {
		type: Boolean,
		default: false
	}
});

const usuario = new Schema({
	nombre: {type: String, default: 'hola'}, //nombre de usuario
	contrasena:{ type: String, default: 'hnas ew'}, //contraseña
	status: {  //Se añade un false por default, nos sirve para saber si ha sido creado.
		type: Boolean,
		default: false
	}
});

const basedatos = new Schema({
	NOMBRE: String,
	NOMBREMAYA: String,
	NOMBRECIENTIFICO: String,
	FAMILIA: String,
	ESPECIE: String,
	ORIGEN: String,
	SENESCENCIA: String,
	ESCALA: String,
	FLORACION: String,
	RIEGO: String,
	SERVICIOSECOSISTEMICOS: String,
	DESCRIPCION: String
	//tipode hoja: 
});

const origen = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String

});

const senescencia = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String
});

const escala = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String,
});

const floracion = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String,	
});

const riego = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String	
});

const serviciosEcosistemicos = new Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String	
});

const fotos = new Schema({
	Nombre: String,
	Ruta: String
});

module.exports = { 
	//el modelo collection agrega una s, al final si no se incluye nombreCollection
	//nombre, valor{ modelo('nombreModel', variableSchema, nombreCollection)}
	clase : database.model('Clases', clase, 'clase'), 
	usuario: database.model('Usuarios', usuario, 'usuarios'),
	basedatos: database.model('Basedatos', basedatos,'basedatos'),
	origen: database.model('Origen', origen, 'origen'),
	senescencia: database.model('Senescencia', senescencia,'senescencia'),
	escala: database.model('Escala', escala, 'escala'),
	floracion: database.model('Floracion', floracion, 'floracion'),
	riego: database.model('Riego', riego, 'riego'),
	serviciosEcosistemicos: database.model('ServiciosEcosistemicos', serviciosEcosistemicos, 'serviciosEcosistemicos'),
	fotos: database.model('Fotos', fotos, 'fotos')

}
//module.exports = database.model('usuarios', usuario);