"use strict";

const config = require('../config/config');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let customer = require('../models/customer');

// TODO: not sure why we're even doing this as we can just pass around significantly less meaningful and guaranteedly
// TODO: unique id's created by mongo? Should probably just refactor this whole thing. Grrr.
exports.getidbyemailid = (req, res) => {
    let message;
    let status = 200;

    // Find the customer by email id and subsequently select the `_id` property from the record.
    // customer_id will be used for subsequent requests, so send it back.
    customer.findOne({'emailid': req.params.emailId}, '_id', (err, customer_id) => {
        let id = null;
        if (err) {
            message = `Failed to get id.\nThe email '${req.params.emailid}' could not be found.`;
            status = 500;
        } else if (!customer_id) { // TODO: not sure why err isn't set when customer is not found.
            status = 400;
            message = `Failed to get id.\nThe email '${req.params.emailid}' could not be found.`;
        } else {
           message = "Successfully found id.";
           id = customer_id._id;
        }

        res.status(status).json({
            success: !!customer_id,  // `!!` is shorthanded boolean conversion
            error: err ? err : null,
            message: message,
            "CustomerId": id,
        })
    });
};

/* Add a new customer to the collection */
exports.addcustomer = (req, res) => {
    let user;
    let message = "";
    let status = 200;

    bcrypt.hash(req.body.password, config.SALT_ROUNDS, (err, hash) => {
        user = new customer({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            emailid: req.body.emailid,
            password: hash,
            status: "Active",
        });

        // TODO: really need to fix this callback hell, yah?
        user.save((err, new_user) => {
            if (err) {
                if (err.code == 11000) {
                    message = `Failed to create account.\nThe email '${req.body.emailid}' is already in use.`;
                    status = 400;
                } else {
                    message = `Failed to create account.\nError: ${err.name}.`;
                    status = 500;
                }
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: null,
                    // auth: true, // TODO: Not sure about this yet
                });
            } else {
                message = "Successfully created account.";

                let jwt_payload = {
                    email: req.body.emailid,
                    id: new_user._id,
                };
                jwt.sign(jwt_payload, config.JWT_KEY, {expiresIn: '24h'}, (err, token) => {
                    if (err) {
                        status = 400;
                        message = "Failed to create authentication token."
                    }
                    res.status(status).json({
                        success: !err,
                        error: err ? err : null,
                        message: message,
                        token: token,
                        // auth: true, // TODO: Not sure about this yet
                    });
                });
            }
        });
    });
};

/* UPDATE RESOURCE DETAILS */
exports.updateprofilebyid = (req, res) => {
    let status = 501;
    let message = "NOT IMPLEMENTED";

    res.status(status).json({
        success: false,
        error: null,
        message: message,
    });
};

/* DELETE PRODUCT */
exports.deletecustomerbyid = (req, res) => {
    let message = "";
    let status = 200;

    customer.findOneAndDelete({_id: req.user_id}, (err, customer) => {
        if(err) {
            status = 500;
            message = `Failed to remove user.\nError: ${err.name}.`;
        } else if(!customer) {
            // TODO: if customer is null this 'fails' silently. As in, it doesn't set err. Let client know?
            status = 400;
            message = `Failed to remove user.\nCould not find customer id.`;
        } else {
            message = "Successfully removed user.";
        }

        res.status(status).json({
            success: !!customer,
            error: err ? err : null,
            message: message,
        });
    });
};