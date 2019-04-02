
// importar bibliotecas
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000

//llamar funciones de controller.js
const {getCrudComponente,saveComponente,getCrudSubcomponente, saveSubComponente, getCrudIndicador, getIndicador, deleteIndicador, updateIndicador, newIndicador, createIndicador, getCrudUsuario, getCrudAsadas, newAsada, createAsada,deleteAsada, crudFormularios, sendForm} = require('./routes/cruds');
const {getHomePage, login, getMain, getVisor, getComponente, logout, getSites, selected, grafico, getRiesgo} = require('./routes/controller');


//conexion de BD
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
app.get('/asadas', getCrudAsadas);
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
app.get('/crudFormularios', crudFormularios);
app.post('/sendForm', sendForm);

// llamada al puerto 
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});