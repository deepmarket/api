
"use strict";

const config = require('../config/config');
let express = require('express');
let router = express.Router();
let authController = require(`${config.CONTROLLERS_PATH}/authController`);

/* Create a new customer */
router.post('/', authController.authenticate);

module.exports = router;
