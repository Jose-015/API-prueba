
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
async function guardar(nameCollection, data){
	
	//.fromFile(__dirname + '/../staticfiles/clases.csv')
	return new Promise ( resolve => {
		csvtojson() 
	.fromString(data)
	.then( async (csvData) => {
	 	/*for(var i=0; i<csvData; i++){
	 		temp = parseFloat(csvData[i].numalum);
	 		csvData[i].numalum = temp;
	 	}*/
	 	//console.log(typeof nameCollection)
	 	if(nameCollection == basedatos){
		 	Object.entries(csvData).forEach(function(element) {		 		
		 	Object.entries(element[1]).forEach(  function(valores){
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
	 				resolve(nameCollection);
	 			}
	 		});
		}
	});
	});
}






router.post('/importarCSV', (req, res)=>{

	const data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}
	//console.log(typeof data.file);

	//obtengo el nombre de los documentos csv para saber en que coleccion van a ir los datos
	//var promesa = new Promise( (resolve, reject)=> {
	Object.entries(data).forEach( async (archivos) => {
		//console.log(archivos[1].name)
		switch(archivos[1].name){
			case 'BASEDATOS.csv':
				console.log(1);
				//const string = archivos[1].data.toString();
				guardar(basedatos, archivos[1].data.toString());
				break;
			case 'ESCALA.csv':
			console.log(2);
				//guardar(escala, archivos[1].data.toString());
				break;
			case 'RIEGO.csv':
			console.log(3);
				//guardar(riego, archivos[1].data.toString());
				break;
			case 'FLORACION.csv':
			console.log(4);
				//guardar(floracion, archivos[1].data.toString());
				break;
			case 'SENESCENCIA.csv':
			console.log(5);
				//guardar(senescencia, archivos[1].data.toString());
				break;
			case 'ORIGEN.csv':
			console.log(6);
				guardar(origen, archivos[1].data.toString());
				break;
			case 'SERVICIOS_ECOSISTEMICOS.csv':
			console.log(7);
				//guardar(serviciosEcosistemicos, archivos[1].data.toString());
				break;
			default:
				console.log('datos no registrados verifique los archvivos asignados.')
				break;
		}
	})
	
	console.log('ADIOS *******************************************************************/');
	
	//promesa.then((valor) => {res.redirect('/')} );
	//Guardamos los datos de los archivos, en la base de datos.
	/*console.log(data);
	csvtojson() 
					.fromString(data.file.data.toString())
					.then(  (csvData) => {
					 	//console.log(csvData);
					 	//console.log(nameCollection);
					 	origen.insertMany(csvData, (err, data) => {
					 		if(err){
					 			console.log(err);
					 		}else{
					 			console.log('Datos importados con exito');
					 		}
					 	}); 
					});
	*/res.redirect('/');//*/
	//.map(obj => {
});

module.exports = router;
//carpeta images para bae de datos, y usuarioset	