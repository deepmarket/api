"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');

// let path = require('path');
const config = require('./api/config/config.js');
const resources = require(`${config.ROUTES_PATH}/resources.js`);
const jobs = require(`${config.ROUTES_PATH}/jobs.js`);
const customer = require(`${config.ROUTES_PATH}/customer.js`);
const authenticate = require(`${config.ROUTES_PATH}/authenticate.js`);

const DEBUG = true; // flag for verbose console output
const PORT = 3000;

let app = express();
let router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// All endpoints extend from /api/v1/
app.use('/api/v1', router);

router.use('/authenticate', authenticate);
router.use('/account', customer);
router.use('/resources', resources);
router.use('/jobs', jobs);

mongoose.set('bufferCommands', false);

const dbURI = 'mongodb://localhost/ShareResources';

mongoose.Promise = global.Promise;

// Create the database connection
mongoose.connect(dbURI).then(() => {
        if(DEBUG) {
            console.log(`Connection to '${dbURI}' successful.`);
        }
    }).catch((err) => {
        console.log(`ERROR: ${err}`);
        console.log("NOTICE: Continuing without database connection.")
    });

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('NOTICE: Connection to database closed.');
});

// When the connection is open
mongoose.connection.on('open', () => {
    if(DEBUG) {
        console.log('Mongoose default connection is open');
    }
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        if(DEBUG) {
            console.log('Mongoose default connection disconnected through app termination');
        }
        process.exit(0);
    });
});

let server = app.listen(PORT, () => {
    if(DEBUG) {
	    console.log(`Server started on port ${PORT}`);
    }
});

function createServer() {
    return server;
}

module.exports = createServer;
