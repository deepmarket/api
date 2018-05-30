"use strict";

let express = require('express');  // Express server
let bodyParser = require('body-parser');  // HTTP body parsing middleware giving us access to `req.body`
let mongoose = require('mongoose');  // Standard Mongo ODM
let morgan = require('morgan');  // Logging middleware

const config = require('./api/config/config.js');  // Configuration details
const resources = require(`${config.ROUTES_PATH}/resource_route.js`);  // Resource endpoints
const jobs = require(`${config.ROUTES_PATH}/jobs_route.js`);  // Job endpoints
const customer = require(`${config.ROUTES_PATH}/customer_route.js`);  // Customer endpoints
const authenticate = require(`${config.ROUTES_PATH}/auth_route.js`);  // Authentication endpoints
const DEBUG = true; // flag for verbose console output

// Selects applications port first by test, environment variable, and finally hardcoded.
const PORT = process.env.test ? 1234 : process.env.PORT || 8080;

let app = express();
let router = express.Router();

let log_level = "tiny";
if(DEBUG) {
    log_level = "dev";
}

app.use(morgan(log_level));
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
        console.log(`NOTICE: Using mongoose v${mongoose.version} on the database at ${config.DB_URI}.`);
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

/**
 * This function is used by the test harness for the purpose
 * of forcefully stopping the server in between tests.
 */
let stop = () => {
    if(DEBUG) {
        console.log("Closing server.");
    }
    server.close();
};

module.exports.server = server;
module.exports.stop = stop;
