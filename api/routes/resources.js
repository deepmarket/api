"use strict";

let express = require('express');
let router = express.Router();

const config = require('../config/config.js');
let resources_controller = require(`${config.CONTROLLERS_PATH}/resourcesController.js`);


/* GET ALL RESOURCES */
router.get('/', resources_controller.getallresources);

/* GET ALL RESOURCES BY CUSTOMER_ID OR EMAIL_ID */
router.get('/:customerId', resources_controller.getresourcesbycustomerId);

/* ADD NEW RESOURCES UNDER THE USER ACCOUNT */
router.post('/:customerId', resources_controller.addresourcebycustomerId);

/* UPDATE RESOURCE DETAILS */
router.put('/:id', resources_controller.updateresourcebycustomerid);

/* DELETE PRODUCT */
router.delete('/:resourceId/:customerId', resources_controller.deleteresourcebyid);

module.exports = router;
