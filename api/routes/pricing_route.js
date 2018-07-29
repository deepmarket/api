
"use strict";

let express = require('express');
let router = express.Router();

let verifyToken = require("../controllers/verifyToken");
let price_controller = require('../controllers/pricing_controller');

router.get('/', price_controller.get_prices);

router.post('/:price_id', verifyToken, price_controller.add_price);

// router.put('/price_id', verifyToken, price_controller);

module.exports = router;
