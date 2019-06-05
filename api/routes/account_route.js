/**
 * @fileoverview This file implements the routes for the customer endpoints.
 * It route's extend from the `/customer` endpoint
 * @exports {customer router}
 */

"use strict";

let router = require('express').Router();

const config = require('../config/config.js');
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
let account_controller = require(`${config.CONTROLLERS_PATH}/account_controller`);


// Get a users account information
router.get('/', verifyToken, account_controller.get_account_by_id);

// Create a new account
router.post('/', account_controller.add_account);

// Update a user's account details
router.put('/', verifyToken, account_controller.update_account_by_id);

// Delete a user's account
router.delete('/', verifyToken, account_controller.delete_account_by_id);

module.exports = router;
