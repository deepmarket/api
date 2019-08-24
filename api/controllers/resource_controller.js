/**
 *
 * @fileoverview This file implements the logic for the `/resources` endpoints.
 * It is dependent on the resource route module.
 *
 */


"use strict";

let request = require('request');
const Resources = require('../models/resource_model');

/**
 * Returns a promise of a request to Spark api for information about the current workers 
 * in the spark cluster.
 * 
 * @returns {Promise}
 */
function get_spark_data() {
    // TODO: Define host dynamically
    let spark_api_url = "http://atlantic.cs.pdx.edu:8443/json";

    return new Promise((resolve, reject) => {
        request(spark_api_url, (err, res, body) => {
            if(err) {
                return reject(err);
            }
            return resolve(JSON.parse(body))
        });
    });
}

/**
 * Fetches all workers known to the spark cluster and updates the state of them
 * in the database.
 * 
 * @returns {object} An object containing the resources updated and any associated errors that occured
 * while updating them.
 */
async function update_resources_from_spark() {
    let updated_resources = null;
    let errors = [];
    try {
        let workers = await get_spark_data();

        for(let worker of workers.workers) {
            updated_resources = await Resources.findOneAndUpdate({ip_address: worker.host}, {status: worker.status});
        }
    } catch(err) {
        // TODO: Return a warning about unsuccessfully updating statuses
        console.error(`${err.code} - ${err.message}`);
        errors.push(err)
    }
    return {
        updated_resources: updated_resources,
        errors: errors,
    };
}

exports.get_resources_by_customer_id = async (req, res) => {
    let message = "";
    let status = 200;
    let id = req.user_id;
    let errors = [];

    let resources = null;
    try {
        // Updates status of a users resources known to spark
        let {errors: errs} = await update_resources_from_spark();

        if (errs.length !== 0) {
            errors.push(new Error("Unable to update resources from cluster"));
        }

        resources = await Resources.find({owner: id});

        message = "Successfully retrieved your resources.";

    } catch (err) {
        message = `There was an error while retrieving your resources.`;
        status = 500;
        errors.push(err);
    } finally {
        res.status(status).json({
            // If we have a new resource and there were no errors this was successful
            success: !!resources && (errors.length === 0),
            errors: errors,
            message: message,
            data: resources,
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
            price: req.body.price,
            owner: id,
            createdBy: id,
            updatedBy: id,
            machine_name: req.body.machine_name
        });

        new_resource = await resource.save();

        message = `${req.body.machine_name} was successfully added to your resources.`;
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
            success: (errors.length === 0),
            errors: errors,
            message: message,
            data: new_resource,
        });
    }
};

exports.update_resource_by_customer_id = async (req, res) => {
    let status = 200;
    let message = "";
    let errors = [];
    let updated_resource = null;

    try {
        // `req.body.update` should be a json encoded object with the fields to update
        req.body.update = JSON.parse(req.body.update);
    } catch (e) {
        // Assume this is valid json; if not mongoose will throw an error and we'll return it below
    }
    
    try {
        updated_resource = await Resources.findOneAndUpdate({_id: req.user_id},
            // Unpack `update` and set `updatedOn` field.
            {
                ...req.body.update,
                updatedOn: Date.now()
            },
            // Return the updated document with `new: true`
            {
                new: true,
                runValidators: true,
            }
        );
        message = `This resource was successfully updated.`;

    } catch (err) {
        status = 500;
        message = `There was an error updating this resource.`;
        errors.push(err)
    } finally {
        res.status(status).json({
            // If there were no errors we'll say this was successful
            success: (errors.length === 0),
            errors: errors,
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

    // Check for resource_id in params; value in body is deprecated
    // See: https://github.com/deepmarket/api/wiki/API-Enpoints#resources-resources for documentation on this
    let resource_id = req.params.resource_id;
    try {

        deleted_resource = await Resources.remove({
            owner: req.user_id,
            _id: resource_id,
        });

        message = `${req.body.machine_name} was successfully deleted from your resources.`;

    } catch(err) {

        message = `There was an unknown error while deleting ${req.body.machine_name}`;
        status = 500;
        errors.push(err);

    } finally {

        res.status(status).json({
            // Mongo returns number deleted as `n`
            success: (deleted_resource.n > 0),
            errors: errors,
            message: message,
            data: deleted_resource,
        });
    }
};