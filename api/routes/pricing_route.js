
"use strict";

let express = require('express');
let router = express.Router();

let verifyToken = require("../controllers/verifyToken");
let price_controller = require('../controllers/pricing_controller');

router.get('/', price_controller);

router.post('/:price_id', verifyToken, price_controller);

// router.put('/price_id', verifyToken, price_controller);

module.exports = router;
