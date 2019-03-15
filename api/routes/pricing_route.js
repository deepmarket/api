
"use strict";

let express = require('express');
let router = express.Router();
const config = require('../config/config');

let verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
let price_controller = require(`${config.CONTROLLERS_PATH}/pricing_controller`);

router.get('/', price_controller.get_prices);

router.post('/', price_controller.add_price);
router.post('/', verifyToken, price_controller.add_price);

router.put('/', price_controller.update_price);
router.put('/', verifyToken, price_controller.update_price);

router.put('/', price_controller.delete_price);
router.put('/', verifyToken, price_controller.delete_price);

module.exports = router;
