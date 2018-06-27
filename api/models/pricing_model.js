/**
 * @fileoverview This file contains the definition of the pricing schema.
 * It is dependent on mongoose.
 * @exports {pricingSchema} The price schema definition.
 */

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let priceSchema = new Schema({
    time_slot: {
        type: String,
        required: true,
    },
    total_price: {
        type: Number,
        min: 0,
        // required: true,  // TODO: likely calculated on the backend.
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    prices_per_hour: {
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
        }
    }
});

// Create a model to interact with from the schema
mongoose.model('Prices', priceSchema);
let prices = mongoose.model('Price');

module.exports = prices;
