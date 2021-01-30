
const express = require('express');
const app = express();

const morgan = require('morgan');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
app.use(fileUpload());
//app.use(fileUpload({limits:{ parts: 50*1024}, }));



//Configuraciones
//Variables que se pueden usar en todo la aplicacion
//app.set('nameapp', 'miprimerapi'); 
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2 );

mongoose.connect(`mongodb://localhost/usuarios`).then( function(){
	console.log('conectado a la base de datos');
});


//middlewares
app.use(morgan('dev'));  //Imprime en consola las solicitudes de los clientes.
//app.use(express.urlencoded({extended: true,})); //para pder usar json entre los html en nodejs.
app.use(express.urlencoded({extended: true, limit: '100000000mb' })); //para pder usar json entre los html en nodejs.
app.use(express.json()); //para soportar el formato json y entenderlos.
//app.use(express.json({ limit: '50000000mb'} )); //para soportar el formato json y entenderlos.


//Archivos estatidos


//rutas
//app.use(require('./rutasVerFinal.js'));
app.use(require('./rutas.js'));

//Iniciando servidor 
app.listen(app.get('port'), ()=>{

	console.log(`Servidor iniciado ${app.get('port')}`);
});
