
"use strict";

const config = require('./api/config/config');
let mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let connect = async (db_name, debug=false) => {

    try {
        await mongoose.connect(db_name);
    } catch(err) {
        console.error(`ERROR: ${err}`);

        // Can't do much without a db connection; exit.
        process.exit(1)
    } finally {

        mongoose.connection.on(['open', 'disconnected'].forEach((goose_event) => {
            if(debug) {
                console.log(`NOTICE: database is now ${goose_event}`);
            }
        }));

        // If the Node process ends, close the database connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                if(debug) {
                    console.log('NOTICE: Closing database connection');
                }
                process.exit(0);
            });
        });
    }
};

module.exports.open_connection = connect;