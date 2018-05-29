
"use strict";

let router = require('express').Router();

const config = require('../config/config');
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
const authController = require(`${config.CONTROLLERS_PATH}/authController`);

/* Create a new customer */
router.post('/login', authController.login);

router.post('/logout', verifyToken, authController.logout);

module.exports = router;
