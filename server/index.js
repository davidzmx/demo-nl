const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require("cors");

const app = express();

// Databases
// Databases
const config = require('./config/config.dev');
const postgres = require('./postgres.db');
postgres.start(config.postgres.database);


// postgres.start(config.postgres.inegi_dwh);
//postgres.start(config.postgres.demo_nl);
//postgres.start(config.postgres.inegi_public);

// Settings
app.set('port', config.PORT);

// Middlewares
//const Authenticator = require('./helpers/Authenticator');
//const auth = new Authenticator();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/apidemo', require('./routes/demo.routes'));
/*
app.use('/api/localities', auth.verifyReqToken, require('./routes/localities.routes'));
app.use('/api/municipalities', auth.verifyReqToken, require('./routes/municipalities.routes'));
app.use('/api/states', auth.verifyReqToken, require('./routes/states.routes'));
app.use('/api/metropolitanAreas', auth.verifyReqToken, require('./routes/metropolitanAreas.routes'));
app.use('/api/regions', auth.verifyReqToken, require('./routes/regions.routes'));
app.use('/api/agebs', auth.verifyReqToken, require('./routes/agebs.routes'));
app.use('/api/cases', auth.verifyReqToken, require('./routes/cases.routes'));
app.use('/api/users', require('./routes/user.routes'));
*/

// Static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist', 'frontend')));

// Starting the server
//~ app.listen(app.get('port'), () => {
//~ console.log('Server on port', app.get('port'));
//~ });

const http = require('http');
const server = http.createServer(app);
server.listen(app.get('port'));
console.log("listening port: "+config.PORT)


// const socketController = require('./controllers/socket.controller.js');
// socketController.startListen(server);
