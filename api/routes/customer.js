
"use strict";

let router = require('express').Router();

const config = require('../config/config.js');
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
let customer_controller = require(`${config.CONTROLLERS_PATH}/customerController`);


/* GET ALL RESOURCES */
//router.get('/', customer_controller.getallresources);
// router.get('/', customer_controller.getidbyemailid);

// Create a new customer
router.post('/', customer_controller.addcustomer);

// update customer details
router.put('/', verifyToken, customer_controller.updateprofilebyid);

// delete customer
router.delete('/', verifyToken, customer_controller.deletecustomerbyid);

module.exports = router;
