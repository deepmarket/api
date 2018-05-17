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
const PORT = process.env.PORT || 8000;

let app = express();
let router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// All endpoints should extend from `/api/v1/`
app.use(config.API_ENDPOINT_EXTENSION, router);

router.use('/authenticate', authenticate);
router.use('/account', customer);
router.use('/resources', resources);
router.use('/jobs', jobs);

mongoose.set('bufferCommands', false);
mongoose.Promise = global.Promise;

// Create the database connection
mongoose.connect(config.DB_URI)
    .then(() => {
        if(DEBUG) {
            console.log(`Connection to '${config.DB_URI}' successful.`);
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
        console.log(`NOTICE: Using mongoose v${mongoose.version} ODM.`);
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
        console.log(`app listening on port: ${PORT}.`);
    }
});

let stop = () => {
    if(DEBUG) {
        console.log("Closing server.");
    }
    server.close();
};

module.exports.server = server;
module.exports.stop = stop;
