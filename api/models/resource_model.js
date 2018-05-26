/**
    TODO
*/

let Schema = require('mongoose').Schema;

let resourceSchema = new Schema({
    ip_address: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    ram: {
        type: Number,
        min: 0,
        required: true
    },
    cores: {
        type: Number,
        min: 0,
        required: true
    },
    cpus: {
        type: Number,
        min: 0,
        required: true
    },
    gpus: {
        type: Number,
        min: 0,
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    active_from: {
        type: Date,
        default: Date.now
    },
    active_to: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdOn: {
        type:Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    machine_name: {
        type: String,
        required: true
    }
});


mongoose.model('Resources', resourceSchema);  // Register model
let resources = mongoose.model('Resources'); // Instantiate model

module.exports = resources;