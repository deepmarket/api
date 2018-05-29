/**
 * Return the ratio of the inline text length of the links in an element to
 * the inline text length of the entire element.
 *
 * @param {Node} node - Types or not: either works.
 * @throws {PartyError|Hearty} Multiple types work fine.
 * @returns {Number} Types and descriptions are both supported.
 */

const config = require('../config/config');
var mongoose = require('mongoose');
var jobs = require('../models/job_model');

exports.getalljobs = function(req, res) {
    jobs.find(function(err, jobs) {
        if (err) {
            message = "Error while retrieving the Jobs";
            res.status(403).json({ message });
        } else {
            res.json(jobs);
        }
    });
};

/* GET ALL jobs BY CUSTOMER_ID */
exports.getjobsbycustomerId = function(req, res) {
    //var customer= req.params.customerId;
    //var customer2=mongoose.Types.ObjectId(customer);
    console.log(req.params.customerId);
    jobs.find({ customerid: req.params.customerId }, function(err, jobs) {
        if (err) {
            message = "Error while retrieving the job for the provided customer Id";
            res.status(403).json({ message });
        } else {
            res.json(jobs);
        }
    });
};

/* ADD NEW Jobs UNDER THE USER ACCOUNT */
exports.addjobsbycustomerId = function(req, res) {

    var message;

    //job object without source files and resource files
    var job = new jobs({
        workers: req.body.workers,
        cores: req.body.cores,
        memory: req.body.memory,
        status: config.JOB_SCHEDULED,
        start_time: Date.now(),
        end_time: Date.now(),
        customerid: req.body.customerId, // editted from customerid: {type: Schema.Objectid, required:true},
        created_on: Date.now(),
        updated_on: Date.now(),
        createdBy: req.body.customerId,
        updatedBy: req.body.customerId
    });

    //HDFS path where the files are uploaded, before submitting the job
    job.source_files.push(req.body.source_files);
    job.input_files.push(req.body.input_files);


    job.save(function(error, job) {
        if (error) {
            console.error(error);
            if (error.code == 11000) {
                message = " Adding a jobs by Customer id failed! ip_address already exists.";
            } else
                message = "Adding a jobs by Customer id failed!";

            res.status(403).json({ message });

        } else {
            message = "A jobs with a customer id is added successfully";
            res.status(200).json({
                message,
                job
            });

        }

    });


};

/* UPDATE job DETAILS */
exports.updatejobstatusbyJobId = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

/* DELETE job by using the JobId,customerId sent by the client */
exports.deletebyid = function(req, res) {
    var message;

    jobs.remove({ _id: req.params.jobId, customerid: req.params.customerId }, function(err) {
        if (err) {
            message = " Job deletion failed!";
            res.status(403).json({ 'message': message });
        } else {
            message = "Job Deletion successful";
            res.status(200).json({
                'message': message
            });
        }

    });
};