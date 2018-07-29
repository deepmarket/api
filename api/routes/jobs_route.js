
"use strict";

let express = require('express');
let router = express.Router();

let verifyToken = require("../controllers/verifyToken");
let jobs_controller = require('../controllers/jobs_controller');


/* Get all Jobs */
router.get('/', verifyToken, jobs_controller.get_all_jobs);

/* Get All JOBS By customer_id */
router.get('/:job_id', verifyToken, jobs_controller.get_job_by_job_id);

/* Add new Jobs UNDER THE USER ACCOUNT */
router.post('/', verifyToken, jobs_controller.add_job);

/* UPDATE Job DETAILS */
router.put('/job_id', verifyToken, jobs_controller.update_job_status_by_job_id);

/* DELETE Job */
router.delete('/:job_id', verifyToken, jobs_controller.delete_job_by_job_id);

module.exports = router;
