/**
 * @fileoverview This file manages a connection to the database.
 * It is intended to have an interface that is as generic as possible
 * so as to reduce dependency on the db itself.
 *
 * @requires mongoose The database ORM we're using.
 * Note: Mongoose is reliant on mongodb as a backend.
 */


"use strict";

let mongoose = require('mongoose');

mongoose.set('bufferCommands', false);


// TODO: refactor so this is more OOP-esque...
let connect = async (db_name, debug=false) => {

    try {
        // TODO: i.e. add this to the constructor
        ['open', 'disconnected'].forEach(db_event => {
            mongoose.connection.on(db_event, () => {
                if(debug) {
                    console.log(`NOTICE: Database is now ${db_event}.`);
                }
            });
        });

        await mongoose.connect(db_name);

    } catch(err) {

        console.error(`ERROR: ${err}`);
        process.exit(1)  // Can't do much without a db connection; exit.

    } finally {
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

// TODO: Add this to the destructor...
let close = () => {
    mongoose.connection.close(() => {
        console.log('NOTICE: Closing database connection');
    })
};

module.exports.open_connection = connect;
module.exports.close_connection = close;