/**
 * @fileoverview This file contains the definition of the customer schema.
 * It is dependent on mongoose.
 * @exports {AccountSchema} The customer schema definition.
 */


"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AccountSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        default: 20.0,
        min: 0,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },
});

AccountSchema.path("email").validate(function (value) {
    // Ensure that a given email address is valid
    // See: https://stackoverflow.com/a/18022766/4668680 and it's related issues
    return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}, "Email must be a valid email address.");

// Compile schema
let accounts = mongoose.model('Customers', AccountSchema);

module.exports = accounts;
