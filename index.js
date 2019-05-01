
// importar bibliotecas
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000

//llamar funciones de controller.js

const {getCrudComponente, saveComponente, getCrudSubcomponente, saveSubComponente, getCrudIndicador, getIndicador, deleteIndicador, updateIndicador, newIndicador, createIndicador, getCrudAsadasR,getCrudAsadasU, getPresentAsada, saveAsada, newAsada, createAsada, deleteAsada, crudFormularios, sendForm, getCrudUsuario, saveUsuario, getUsuariosAsadas,setUsuariosAsada} = require('./routes/cruds');
const {getHomePage, login, getMain, getVisor, getComponente, logout, getSites, selected, grafico, getRiesgo,  histFormulario, getAnno, getRespuestas,comparaMapas, getAsada, getInfoGeneral} = require('./routes/controller');




//conexion de BD
/*
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
    host     : 'aa1p73vf0lmbvdr.cyzdjp7x4zfl.us-east-2.rds.amazonaws.com',
    user     : 'joseph',
    password : '12345678',
    database : 'ebdb',
    port : '3306'
*/
const db = mysql.createConnection ({
    host     : '127.0.0.1',
    user     : 'userasada',
    password : 'asada',
    database : 'proyecto_asada'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// configuracion de Express
app.set('port', PORT); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(fileUpload()); 
// creacion de express-session
app.use(require('express-session')({
 
        name: '_es_demo', 
        secret: 'Ak1323e2sndwk_JEKFO', 
        resave: false, 
        saveUninitialized: false 
 
    }));



// rutas con sus respectivas funciones
app.get('/', getHomePage);
app.post('/', [login, getMain]);

app.get('/visor', getVisor);
app.get('/main', getMain);
app.get('/logout', logout);
app.get('/getSites', getSites);
app.get('/getComponente', getComponente);
app.get('/componente', getCrudComponente);
app.get('/subcomponente', getCrudSubcomponente);
app.get('/indicador', getCrudIndicador);
app.get('/asadas', getCrudAsadasR);
app.get('/asadas/:id', getCrudAsadasU);
app.get('/presentacionAsadas', getPresentAsada);
app.get('/saveasada', saveAsada);
app.get('/usuario', getCrudUsuario);
app.get('/saveUsuario', saveUsuario);
app.get('/saveComponente', saveComponente);
app.get('/savesubcomponente', saveSubComponente);
app.get('/indicador/:id', getIndicador);
app.get('/deleteindicador', deleteIndicador);
app.get('/updateindicador', updateIndicador);
app.get('/newindicador', newIndicador);
app.post('/createindicador', createIndicador);
app.get('/usuario', getCrudUsuario);
app.get('/newasada',newAsada);
app.post('/createasada',createAsada);
app.get('/deleteasada', deleteAsada);
app.get('/selected', selected);
app.get('/grafico', grafico);
app.get('/getRiesgo', getRiesgo);
app.get('/getAsada', getAsada);
app.get('/crudFormularios', crudFormularios);
app.get('/infoGeneral', getInfoGeneral);
app.post('/sendForm', sendForm);
app.get('/changeAsadaUser', getUsuariosAsadas);
app.get('/setUsuariosAsada',setUsuariosAsada);
app.get('/histFormulario', histFormulario);
app.get('/getAnno', getAnno);
app.get('/getRespuestas',getRespuestas);
app.get('/comparaMapas', comparaMapas)

// llamada al puerto 
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
