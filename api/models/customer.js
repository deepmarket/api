/*

This file contains the model of the Resources Collection
Use this model to populate the Resources table

*/

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let customerSchema = new Schema({
    firstname: {type: String, required:true},
    lastname: {type: String, required: true},
    emailid: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    status: {type: String, required: true},
    createdOn: {type: Date, default: Date.now()},
    updatedOn: {type: Date, default: Date.now()},
});

// Create a model to interact with from the schema
mongoose.model('Customers', customerSchema);
let customers = mongoose.model('Customers');

module.exports = customers;
