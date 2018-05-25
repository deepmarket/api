
"use strict";

let router = require('express').Router();

const config = require('../config/config');
const authController = require(`${config.CONTROLLERS_PATH}/authController`);

/* Create a new customer */
router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;
