/**
 * @fileoverview This file contains the definition of the pricing schema.
 * It is dependent on mongoose.
 * @exports {pricingSchema} The price schema definition.
 */

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let priceSchema = new Schema({
   // Combination of time_slot and created_on fields will give the price details for that particular day
    time_slot: {
        type: Number,
        required: true,
    },
    cpus: {
        type: Number,
        required: true,
        min: 0,
    },
    gpus: {
        type: Number,
        required: true,
        min: 0,
    },
    memory: {
        type: Number,
        required: true,
        min: 0,
    },
    disk_space: {
        type: Number,
        required: true,
        min: 0,
    },
    created_on: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_on: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

mongoose.model('Prices', priceSchema);
let prices = mongoose.model('Price');

module.exports = prices;
