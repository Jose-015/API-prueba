
const express = require('express'); //Para creacion del servidor
const router = express.Router();
const database = require('mongoose'); //manejo de mongodb

//const clase2 = database.model('clas', clase); //metodo exportar modeles
const csvtojson = require('csvtojson'); //para poder importar CSV
//const csvtojson = require('async-csv');
/*const fs = require('fs');
//const fastcsv = require('fast-csv');*/

/*const multer = require('multer');
const upload = multer({dest: './staticfiles/Fotos'});///*


/* ================================================================================
 colecciones para el manejo de arbol
*/
const {
	clase, usuario, basedatos, origen, senescencia,
	escala, floracion, riego, serviciosEcosistemicos, fotos
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
 Rutas para pruebas de acceso a datos por medio de url
*/
// se usa junto con http:///obtener/valor1/valor2
// para usar el url clasico http://localhost:3000/registrarse?nombre=valor1&contrasena=valor2
// usar req.query;
router.get('/obtener/:i/:abc', (req, res)=>{
	const i = req.params.i;
	res.send(i + ' ' + req.params.abc);
});

//se usa para guardar datos de un metodo post, pensado en un archivo js, no basedatos
// si se agrega parametros se pueden usar con la url /obtener/:id y usar req.params
//router.post('/guardar', (req, res)=>{

	//const {nombre, fecha} = req.body;
	//combrobar que existe
	/*if(){
		const newMovie = {movies.length+1, req.body};
		res.json(save);
	}else{
		res.json(failed); 
		res.status(500).json({erro: 'error en el servidor'}); //Nuevo formato para los codigos
	}//*/
//});
// se usa para imprimir un dato json en la pagina
router.get('/prueba', (req, res)=>{
	const dato = {
		'nombre' : 'perro',
		'hola' : 'comoestas',
		'edad' : 34
	};
	//res.send(dato);
	res.json(dato); //Devuelve un Json, se puede usar res.json({objet});
});
/* ================================================================================
 Funciones par poder importar datos CSV a la base de datos.
*/

router.get('/importarCSV', function (req, res){
	res.sendFile('html/subirCSV.html', {root: './'})
	//res.end();
});

async function validar(nameCollection, dato){
	//Busca que el dato a introducir sea valido
	await nameCollection.findOne({'VALOR': dato}, (err, result)=>{
			if(err){  console.log('soy el mejor'); throw err; };    //There was an error with the database.
			if(!result){
				console.log('El valor introducido: ', dato, 'no es valido para la coleccion del modelo ', nameCollection); //The query found no results.
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

var temp;
function guardarDatos(nameCollection, data){
	return new Promise( async (resolve, reject)=>{
		//console.log('testcdnJIONVIWOJKLNUI9PNKOJNNEVIOn', nameCollection, basedatos);
		//if(nameCollection ==  basedatos){
			csvtojson()
			.fromString(data)
			.then( async (csvData) => {
				if(nameCollection == basedatos){
				Object.entries(csvData).forEach(function(element) {
					Object.entries(element[1]).forEach( async function(valores){
		 				switch (valores[0]) {
			 			case 'ORIGEN':
			 				//console.log(valores[1]);
			 				consulta = await validar(origen, valores[1]);
			 				break;
			 			case 'SENESCENCIA':
			 				consulta = validar(senescencia, valores[1]);
			 				break;
			 			case 'ESCALA':
			 				validar(escala, valores[1])	
			 				break;
			 			case 'FLORACION':
			 				consulta = validar(floracion, valores[1]);
			 				break;
			 			case 'RIEGO':
			 				consulta = validar(riego, valores[1]);
			 				break;
			 			case 'SERVICIOS_ECOSISTEMICOS':
			 				consulta = validar(serviciosEcosistemicos, valores[1]);
			 			break;
			 				default:
			  				break;
			  			}
		  			})
		  			console.log('aaaaaaaaaaa');
		  		});
				}else{
		 			console.log('guardando datos');
		 			await nameCollection.insertMany(csvData, (err, data) => {
		 				if(err){
			 				console.log(err);
			 			}else{
			 				//console.log(csvData);
		 					console.log( nameCollection ,' fue importado con exito');
		 					//resolve(nameCollection);
		 				}
		 			});
		 		}
			});

			console.log('datos', data);
			return resolve(data);
		/*}else{
			csvtojson()
			.fromString(data)
			.then( async (csvData) => {
				console.log('guardando datos');
		 		await nameCollection.insertMany(csvData, (err, data) => {
		 			if(err){
		 				console.log(err);
		 			}else{
		 				//console.log(csvData);
		 				console.log( nameCollection ,' fue importado con exito');
		 				resolve(nameCollection);
		 			}
		 		});//s*
		 	});
		}//*/
	});
}


async function guardar(nameCollection, data){
	//return new Promise( async (resolve, reject) => {
		console.log('como estas bb')
	//const datos = await csvtojson.parse(data);
	//console.log(datos);
	csvtojson().fromString(data)
	.then( async (csvData) => {
		console.log('guardando datos');
		await nameCollection.insertMany(csvData, (err, data) => {
			if(err){
				console.log(err);
			}else{
				//console.log(csvData);
				console.log( nameCollection ,' fue importado con exito');
	 		}
		});//*/
	});//*/
	//});
}


function verificarDatos(data){
	switch (valores[0]) {
		 			case 'ORIGEN':
		 				//console.log(valores[1]);
		 				consulta = validar(origen, valores[1]) /*.then( (valor)=>{
		 					temp.push(valor); 
		 				});//*/					
		 				consulta.then(valor=>console.log(valor));
		 				break;
		 			case 'SENESCENCIA':
		 			//console.log(valores[1]);
		 				consulta = validar(senescencia, valores[1])/*.then( (valor)=>{
								temp.push(valor);
		 					}); //*/
		 					break;
		 			case 'ESCALA':
		 			//console.log(valores[1]);
		 				validar(escala, valores[1])
		 					//console.log(valores[1]);
		 					break;
		 			case 'FLORACION':
		 				//console.log(valores[1]);
		 				 	/*consulta = validar(floracion, valores[1]).then( (valor)=>{
		 						temp.push(valor);
							});//*/
		 					break;
		 			case 'RIEGO':
		 				//console.log(valores[1]);
		 					consulta = validar(riego, valores[1])/*.then( (valor)=>{
		 						temp.push(valor);
		 					});//*/
		 					break;
		 			case 'SERVICIOS_ECOSISTEMICOS':
		 				//console.log(valores[1]);
		 					/*consulta = validar(serviciosEcosistemicos, valores[1]).then( (valor)=>{
		 						temp.push(valor);
		 					});//*/
		 			break;
		 				default:
		  				//console.log('erro');
		  				break;
		  			}
}

function VerificarArchivos(archivos){
	return new Promise( (resolve, reject) =>{
	//Object.entries(data).forEach( async (archivos) => {
		//console.log(archivos[1].name)
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
	//});
	});
}

router.post('/importarCSV', async (req, res)=>{

	const data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}
	//console.log(typeof data.file);

	//obtengo el nombre de los documentos csv para saber en que coleccion van a ir los datos
	await Object.entries(data).forEach( async (archivos) => {
		var promesa = VerificarArchivos(archivos);
		await promesa.then(async(result) =>{

			if(result == basedatos){
				console.log(archivos)

				//const vali = await validar(result, archivos[1].data.toString() );
				//return vali;
			}else{
				
				await guardar(result, archivos[1].data.toString());

				/*const datos = await csvtojson.parse(archivos[1].data.toString());
				console.log('hola', datos)
				
				/*datos.then( result => {
					await result.insertMany(datos, (err, data) => {
					if(err){
						console.log(err);
					}else{
						//console.log(csvData);
						console.log( result ,' fue importado con exito');
	 					//resolve(nameCollection);
	 				}
				});	
				});*/
			}
		}).then( result =>{
			console.log(result)
		}).catch( error =>{
			console.log(error);
		});
	});
	console.log('ADIOS');
});
/* ================================================================================
 Funciones par poder guardar imagenes CSV a la base de datos.
*/

router.get('/subirImagen', async (req, res)=>{
	res.sendFile('html/subirImagen.html', {root:'./'});
});

router.get('/visualizarImagen', async (req, res)=>{
	res.sendFile('staticfiles/Fotos/Carpeta1/ArchLinux.jpg', {root: './'});
} );

async function GuardarFotos(req, res, nombreCarpeta){
	var i=0;
	if(Object.keys(req.files.foto).length===9 && Object.keys(req.files.foto)[8] === 'mv'){
		console.log(req.files.foto.name);
		req.files.foto.mv('./staticfiles/Fotos/'+nombreCarpeta+'/'+req.files.foto.name, async function(err) {
			if (err){ return res.status(500).send(err);}
			var savedata = await new fotos({
				'Nombre': req.files.foto.name,
			    'Ruta': './staticfiles/Fotos/'+nombreCarpeta+'/'
			}).save( async function(err, result) {
			    if (err){throw err;}
		        if(result) {
				    console.log('guardado con exito');//res.json(result)
				    res.send('Archivo Trepado y Ruta Guardada');
				}
			})
		});
	}else{
		await Object.entries(req.files.foto).forEach( async (archivos) => {
			await archivos[1].mv('./staticfiles/Fotos/'+nombreCarpeta+'/'+archivos[1].name, async function(err) {
				if (err){ console.log('error')}//return res.status(500).send(err);}
				
				var savedata = await new fotos({
					'Nombre': archivos[1].name,
				    'Ruta': './staticfiles/Fotos/'+nombreCarpeta+'/'
				}).save( async function(err, result) {
				    if (err) throw err;
					i=i+1;
					if(result) {
				    	console.log(result);//res.json(result)
				    }
				    if(i===Object.keys(req.files.foto).length){
				       	res.send('Archivo Trepado y Ruta Guardada');
				    }
				})
			});//*/
		});
	}
}

/*mOutputStream.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename="+ sourceFileUri + strLineEnd);
mOutputStream.writeBytes("Content-Disposition: form-data; name=Opcion; value=1" + strLineEnd);
mOutputStream.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename="+ sourceFileUri + strLineEnd);*/

router.post('/subirImagen', async (req, res)=>{
	console.log(req);
	//console.log(Object.keys(req.files.foto));
	//console.log(parseFloat(req.body.Opcion));
	if (!req.files || Object.keys(req.files).length === 0) {
	return res.status(400).send('No files were uploaded.');
  	}
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	//let sampleFile = req.files.foto[0];
	//console.log(sampleFile);
	// Use the mv() method to place the file somewhere on your server
	switch (parseFloat(req.body.Opcion)) {
		case 1:
			console.log('Guardando en Carpeta 1');
			GuardarFotos(req, res, 'Carpeta1');
			break;
		case 2:
			console.log('Guardando en Carpeta 2');
			GuardarFotos(req, res, 'Carpeta2');
			break;
		case 3:
			console.log('Guardando en Carpeta 3');
			/*for(var i=0; i<3; i++){
				req.files.foto[i].mv('./staticfiles/Fotos/Carpeta3/'+req.files.foto[i].name, function(err) {
					if (err){return res.status(500).send(err);}
					//res.send('File uploaded!');
				});
			}*/
			GuardarFotos(req, res, 'Carpeta3');

			break;
		case 4:
			console.log('Guardando en Carpeta 4');
			GuardarFotos(req, res, 'Carpeta4');
			break;
		default:
			res.send('La seleccion no existe');
			break;
	}
	console.log("Fin del afuncion Post");
});


/* ================================================================================
node-fetch; Se usa para usar otros api
app.get('/desdeotroAPI',async (req, res) =>{
	const response = await fetch('http:');
	const users = await response.json();
	res.json(user);
}):
*/
module.exports = router;
//carpeta images para bae de datos, y usuarioset	