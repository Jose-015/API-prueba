
const express = require('express'); //Para creacion del servidor
const router = express.Router();
const database = require('mongoose'); //manejo de mongodb

//const clase2 = database.model('clas', clase); //metodo exportar modeles
const csvtojson = require('csvtojson'); //para poder importar CSV
/*/const multer = require('multer');

/* ================================================================================
 colecciones para el manejo de arbol
*/
const {
	clase, usuario, basedatos, origen, senescencia,
	escala, floracion, riego, serviciosEcosistemicos
} = require('../basedatos/basedatos');

	
/* Directorio Principal de la Web*/
router.get('/', (req, res)=>{
	res.send({'title': 'hola'});
	//res.json({'title': 'jola'});
});

/* ================================================================================
Funciones para registrar y loguear usuarios
*/
/* funcion para guardar los datos un nuevo usuario.*/
router.post('/api/registrar', async function (req, res){
	console.log(req.body);
	//await user.insert(req.body);
	console.log(clase);
	res.send(200, req.body); //validacion de usuarios
	//guardar.
});

/* funcion para validar el ingreso de los usuarios.*/
router.post('/api/login', async function (req, res){
	const {nombre, password } = req.body;
	const datos =  await usuario.find(); 
	console.log(datos);
	res.end();
});

/* funcion para obtener los datos de las nuevas personas*/
router.get('/api/obtener', async function (req, res){
	//const usua = new usuarios.find();
	console.log( await basedatos.find());
});

/* ================================================================================
 Funciones par poder importar datos CSV a la base de datos.
*/

router.get('/importarCSV', function (req, res){
	res.sendFile('html/subirCSV.html', {root: './'})
	//res.end();
});

async function guardar(nameCollection, data){
	csvtojson().fromString(data)
	.then( async (csvData) => {
		console.log('guardando datos');
		await nameCollection.insertMany(csvData, (err, data) => {
			if(err){
				console.log(err);
			}else{
				console.log( nameCollection ,' fue importado con exito');
	 		}
		});
	});
}

function VerificarArchivos(archivos){
	return new Promise( (resolve, reject) =>{
		switch(archivos[1].name){
			case 'BASEDATOS.csv':
				resolve(basedatos);
				break;
			case 'ESCALA.csv':
			console.log(2);
				resolve(escala);
				break;
			case 'RIEGO.csv':
				resolve(riego);
				break;
			case 'FLORACION.csv':
				resolve(floracion);
				break;
			case 'SENESCENCIA.csv':
				console.log(5);
				resolve(senescencia);
				break;
			case 'ORIGEN.csv':
				console.log(6);
				resolve(origen);
				break;
			case 'SERVICIOS_ECOSISTEMICOS.csv':
				console.log(7);
				resolve(serviciosEcosistemicos);
				break;
			default:
				console.log('datos no registrados verifique los archvivos asignados.');
				reject();
				break;
		}
	});
}

router.post('/importarCSV', async (req, res)=>{

	const data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}
	//console.log(typeof data.file);

	//obtengo el nombre de los documentos csv para saber en que coleccion van a ir los datos
	await Object.entries(data).forEach( async (archivos) => {
		var promesa = VerificarArchivos(archivos);
		
		await promesa
		.then(async(result) =>{			
				await guardar(result, archivos[1].data.toString());
				res.redirect('/');
		}).catch( error =>{
			console.log(error);
		});
	});
	console.log('ADIOS');
});

async function validar(nameCollection, dato){
	//Busca que el dato a introducir sea valido
	await nameCollection.findOne({'VALOR': dato}, (err, result)=>{
			if(err){  console.log('soy el mejor'); throw err; };    //There was an error with the database.
			if(!result){
				console.log('El valor introducido: ', dato);
				console.log('no es valido para la coleccion del modelo ', nameCollection);//The query found no results.
				console.log('si los datos son correctos ignore esta advertencia'); 
				dato = {'status':false, 'consulta': nameCollection };
			} 
			else{
				console.log('El dato '+dato+' es valido para el modelo: ', nameCollection)
				dato = {'status': true, 'consulta': nameCollection };
			}
		});
	//};
	return dato;
}

router.post('/validarBaseDatos', (req, res)=>{
	let data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}

	data = data.file7.data.toString();
	csvtojson() 
	.fromString(data)
	.then( async (csvData) => {
	 	await Object.entries(csvData).forEach(async function(element) {		 		
		 	await Object.entries(element[1]).forEach(  function(valores){
		 		switch (valores[0]) {
		 			case 'ORIGEN':
		 				validar(origen, valores[1]);
		 				break;
		 			case 'SENESCENCIA':
		 				validar(senescencia, valores[1]); //*/
		 					break;
		 			case 'ESCALA':
		 				validar(escala, valores[1]);
		 					break;
		 			case 'FLORACION':
		 				validar(floracion, valores[1]);
		 				break;
		 			case 'RIEGO':
		 				validar(riego, valores[1]);
		 				break;
		 			case 'SERVICIOS_ECOSISTEMICOS':
		 				validar(serviciosEcosistemicos, valores[1]);
		 				break;
		 			default:
		  				console.log('los datos ', valores[1], 'no se validan para ', valores[0]);
		  				break;
		  		}
		  	});
		});
		res.redirect('/importarCSV');
	});
});
module.exports = router;
//carpeta images para bae de datos, y usuarioset	