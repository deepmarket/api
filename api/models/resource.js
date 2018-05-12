/*
This file contains the model of the Resources Collection
Use this model to populate the Resources table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var resourceSchema = new Schema({
  ip_address: { type: String, unique: true, required: true},
  ram: { type: Number, required: true},
  cores: { type: Number, required: true },
  cpus: { type: Number, required: true },
  gpus: Number,
  status: {type:String,required: true},
  price: {type:Number ,required: true}, //Added by Soyoung
  active_from:{
     type: Date,
     default: Date.now   

  },
  active_to:{
    type: Date,
    default: Date.now

  },
  owner: {type: mongoose.Schema.Types.ObjectId, required: true},
  createdOn: {type:Date, default: Date.now},
  updatedOn: {type:Date, default: Date.now},
  createdBy: {type: mongoose.Schema.Types.ObjectId, required: true},
  updatedBy: {type: mongoose.Schema.Types.ObjectId, required: true},
  machine_name: {type: String, required: true}
});

// the schema is useless so far
// we need to create a model using it
var resources = mongoose.model('Resources', resourceSchema);

// make this available to our users in our Node applications
module.exports = resources;