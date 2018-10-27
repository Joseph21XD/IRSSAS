const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000
/*const uuid = require('uuid')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;*/

const {getHomePage, login, getMain, getAsada, getVisor, getComponente, logout, getnewAsada, postnewAsada} = require('./routes/controller');



// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host     : '127.0.0.1',
    user     : 'joseph',
    password : 'Joseph2131998',
    database : 'proyecto_asada'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


//AUTENTICATION
  /*const users = [
    {id: '2f24vvg', email: 'test@test.com', password: 'password'}
  ]

  // configure passport.js to use the local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      console.log('Inside local strategy callback')
      // here is where you make a call to the database
      // to find the user based on their username or email address
      // for now, we'll just pretend we found that it was users[0]
      const user = users[0] 
      if(email === user.email && password === user.password) {
        console.log('Local strategy returned true')
        return done(null, user)
      }
    }
  ));

  // tell passport how to serialize the user
  passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = users[0].id === id ? users[0] : false; 
    done(null, user);
  });

  //AUTENTICATION

  app.use(session({
    genid: (req) => {
      console.log('Inside session middleware genid function')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  app.use(passport.initialize());
  app.use(passport.session());*/


// configure middleware
app.set('port', PORT); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

app.use(require('express-session')({
 
        name: '_es_demo', // The name of the cookie
        secret: 'Ak1323e2sndwk_JEKFO', // The secret is required, and is used for signing cookies
        resave: false, // Force save of session for each request.
        saveUninitialized: false // Save a session that is new, but has not been modified
 
    }));

// routes for the app
app.get('/', getHomePage);
app.post('/', [login, getMain]);

app.get('/visor', getVisor);
app.get('/main', getMain);
app.get('/logout', logout);

app.get('/asada/add', getnewAsada);
app.post('/asada/add', postnewAsada);

app.get('/asada/:id', getAsada);
app.get('/:id', getComponente);





// set the app to listen on the port
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});