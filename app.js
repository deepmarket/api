"use strict";

let express = require('express');  // Express server
let bodyParser = require('body-parser');  // HTTP body parsing middleware giving us access to `req.body`
let mongoose = require('mongoose');  // Standard Mongo ODM
let morgan = require('morgan');  // Logging middleware

const config = require('./api/config/config.js');  // Configuration details
const db = require('./db.js');
const resources = require(`${config.ROUTES_PATH}/resource_route.js`);  // Resource endpoints
const jobs = require(`${config.ROUTES_PATH}/jobs_route.js`);  // Job endpoints
const customer = require(`${config.ROUTES_PATH}/customer_route.js`);  // Customer endpoints
const authenticate = require(`${config.ROUTES_PATH}/auth_route.js`);  // Authentication endpoints
const pricing = require(`${config.ROUTES_PATH}/pricing_route`);  // Pricing endpoints
const DEBUG = process.env.DEBUG || true; // flag for verbose console output

// Selects applications port first by test, environment variable, and finally hardcoded.
const PORT = process.env.API_TEST ? 1234 : process.env.PORT || 8080;

let app = express();
let router = express.Router();

// Show extended output in debug mode
let log_level = DEBUG ? "dev" : "tiny";

app.use(morgan(log_level));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// All endpoints should extend from `/api/v1/`
app.use(config.API_ENDPOINT, router);

app.get('/', (req, res) => {
    res.redirect(config.API_ENDPOINT)
});

app.get(config.API_ENDPOINT, (req, res) => {
    res.send("<div style='margin: auto; display: flex'>API is: &nbsp;<div style='color: lightseagreen'> Online</div></div>");
});

router.use('/auth', authenticate);
router.use('/account', customer);
router.use('/resources', resources);
router.use('/jobs', jobs);
router.use('/pricing', pricing);

// mongoose.set('bufferCommands', false);
// mongoose.Promise = global.Promise;
//
// // Create the database connection
// mongoose.connect(config.DB_URI)
//     .then(() => {
//         if(DEBUG) {
//             // console.log(`Connection to '${config.DB_URI}' successful.`);
//         }
//     }).catch((err) => {
//         console.error(`ERROR: ${err}`);
//         console.log("NOTICE: Continuing without database connection.")
//     });
//
// // When the connection is disconnected
// mongoose.connection.on('disconnected', () => {
//     console.log('NOTICE: Connection to database closed.');
// });
//
// // When the connection is open
// mongoose.connection.on('open', () => {
//     // if(DEBUG) {
//     //     console.log(`NOTICE: Using mongoose v${mongoose.version} on the database at ${config.DB_URI}.`);
//     // }
// });
//
// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', () => {
//     mongoose.connection.close(() => {
//         if(DEBUG) {
//             console.log('Mongoose default connection disconnected through app termination');
//         }
//         process.exit(0);
//     });
// });

// app.listen(PORT, () => {
//     if(DEBUG) {
//         console.log(`app listening on port: ${PORT}.`);
//     }
// });

db.open_connection(config.DB_URI, DEBUG);

// ()=>{} is js noop
const noop = ()=>{};

/**
 * This function is used primarily by the test harness for the purpose
 * of creating a new server.
 *
 * @returns {Promise<any>} A promise that resolves the new server.
 */
let create_server = () => {
    return new Promise((resolve, reject) => {
        try {
            app.listen(PORT, () => {
                DEBUG ? console.log(`Application open on port: ${PORT}.`) : noop;
                resolve(app);
            })
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * This function is used by the test harness for the purpose
 * of forcefully stopping the server.
 */
let stop_server = (server) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(typeof server);
            server.close(() => {
                DEBUG ? console.log("Closing server.") : noop;
                resolve(process.exit(0));
            });
        } catch(err) {
            reject(err);
        }
    });
};


// module.exports.server = server;
module.exports.create = create_server;
module.exports.close = stop_server;
