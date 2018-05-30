
"use strict";

let express = require('express');
let router = express.Router();

let jobs_controller = require('../controllers/jobs_controller');


/* Get all Jobs */
router.get('/', jobs_controller.getalljobs);

/* Get All JOBS By customer_id */
router.get('/:customerId', jobs_controller.getjobsbycustomerId);

/* Add new Jobs UNDER THE USER ACCOUNT */
router.post('/', jobs_controller.addjobsbycustomerId);

/* UPDATE Job DETAILS */
router.put('/:customerId', jobs_controller.updatejobstatusbyJobId);

/* DELETE Job */
router.delete('/:jobId/:customerId', jobs_controller.deletebyid);

module.exports = router;
