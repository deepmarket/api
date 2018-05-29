/*
This file contains the model of the Jobs Collection
Use this model to populate the Resources table
*/

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let jobSchema = new Schema({
    workers: { type: String, required: true},
    cores: { type: String, required: true},
    memory: { type: String, required: true },
    source_files: { type: [String], required: true },
    input_files: {type: [String], required:true},
    status: {type: String, required:true},
    //ip_address:{type: String, required:true, unique: true},
    start_time:{type: Date},
    end_time:{type: Date},
    logs:{ type:[String]},
    customerid: {type: mongoose.Schema.Types.ObjectId, required:true}, // editted from customerid: {type: Schema.Objectid, required:true},
    resources:[{resourceId: String, price:Number}],
    created_on: {type:Date, default: Date.now, required: true},
    updated_on: {type:Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, required: true},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, required: true}
});

// Create a model to interact with from the schema
let jobs = mongoose.model('Jobs', jobSchema);

module.exports = jobs;
