/**
 *
 * @fileoverview This file implements the logic for the resource endpoints.
 * It is dependent on the resource route module.
 *
 */


"use strict";

let request = require('request');
const Resources = require('../models/resource_model');

function get_spark_data() {
    let spark_api_url = "http://pacific.cs.pdx.edu:8443/json";

    return new Promise((resolve, reject) => {
        request(spark_api_url, (err, res, body) => {
            if(err) {
                return reject(err);
            }
            return resolve(JSON.parse(body))
        });
    });
}

async function update_resources() {

    try {
        let workers = await get_spark_data();

        for(let worker of workers.workers) {
            await Resources.findOneAndUpdate({ip_address: worker.host}, {status: worker.status});
        }
    } catch(err) {
        // TODO: Return a warning about unsuccessfully updating statuses
        console.error(`${err.code} - ${err.message}`);
    }
}

exports.get_resources_by_customer_id = async (req, res) => {
    let message = "";
    let status = 200;
    let id = req.user_id;
    let errors = [];

    // Updates status of a users resources known to spark
    await update_resources();

    let resources = null;
    try {
        resources = await Resources.find({owner: id});

        message = "Successfully retrieved your resources.";

    } catch (err) {
        message = `There was an error while retrieving your resources.`;
        status = 500;
        errors.push(err);
    } finally {
        res.status(status).json({
            success: !!resources,
            errors: errors,
            message: message,
            resources: resources,
        });
    }
};

exports.add_resource_by_customer_id = async (req, res) => {
    let message, resource;
    let status = 200;
    let id = req.user_id;
    let errors = [];

    let new_resource = null;

    try {
        // TODO: Move new resource creation to its own try/catch block
        // For some reason this has to be initialized earlier to work.
        resource = await new Resources({
            ip_address: req.body.ip_address,
            ram: req.body.ram,
            cores: req.body.cores,
            cpus: req.body.cpus,
            gpus: req.body.gpus,
            status: req.body.status,
            price: req.body.price,  // TODO: this may need to be determined server side
            owner: id,
            createdBy: id,
            updatedBy: id,
            machine_name: req.body.machine_name
        });

        new_resource = await resource.save();

        message = `${req.body.machine_name} was successfully as a resource.`;
    } catch(err) {
        if (err.code === 11000) {
            message = `A resource at '${req.body.ip_address}' has already been added.`;
        } else {
            message = `There was an unknown error while adding ${req.body.machine_name} as a resource.`;
        }
        errors.push(err);
        status = 500;
    } finally {
        res.status(status).json({
            success: !errors.length,
            errors: errors,
            message: message,
            resource: new_resource ? new_resource : null,
        });
    }
};

exports.update_resource_by_customer_id = async (req, res) => {
    let status = 200;
    let message = "";
    let updated_resource = null;

    try {
        // `req.body.update` should be a json encoded object with the fields to update
        req.body.update = JSON.parse(req.body.update);
    } catch (e) {
        // Assume this is valid json; if not mongoose will throw an error and we'll return it below
    }
    
    try {
        updated_resource = await Resources.findOneAndUpdate({_id: req.user_id},
            // Unpack `update` and ensure we update the `updatedOn` field.
            {
                ...req.body.update,
                updatedOn: Date.now()
            },
            // Return the updated document with `new`
            {
                new: true,
                runValidators: true,
            });
            message = "Your account was successfully updated.";

    } catch (err) {
        status = 500;
        message = `There was an error updating your account.`;
    } finally {
        res.status(status).json({
            success: !err,
            error: err || null,
            message: message,
            data: updated_resource,
        });
    }

};

exports.delete_resource_by_id = async (req, res) => {
    let message;
    let status = 200;
    let errors = [];

    let deleted_resource = null;
    // One of these methods should be deprecated; not sure which one though
    let resource_id = req.body.resource_id || req.params.resource_id;
    try {

        deleted_resource = await Resources.remove({
            owner: req.user_id,
            _id: resource_id,
        });

        message = `${req.body.machine_name} was successfully deleted from your resources.`;

    } catch(err) {

        message = `There was an unknown error while deleting this resource.`;
        status = 500;
        errors.push(err);

    } finally {

        res.status(status).json({
            // Mongo returns number deleted as `n`
            success: (deleted_resource.n > 0),
            errors: errors,
            message: message,
        });
    }
};