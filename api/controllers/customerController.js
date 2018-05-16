"use strict";

const config = require('../config/config');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let customer = require('../models/customer');

exports.getidbyemailid = (req, res) => {
    let message;
    let status = 200;

    //search the user by email id and return the object id(customer id).
    //Customer Id will be used for subsequent requests.
    customer.findOne({'emailid': req.params.emailId}, (err, user) => {
        if (err) {
            message = `Failed to get id.\nThe email '${req.params.emailid}' could not be found.`;
            status = 403;
        } else {
            message = "Successfully found id.";
        }

        res.status(status).json({
            success: !err,
            error: err ? err : null,
            message: message,
            "CustomerId": user._id,
        })
    });
};

/* Add a new customer to the collection */
exports.addcustomer = (req, res) => {
    // TODO: check whether the token sent is valid or not.
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

        // TODO: wrap this in a promise and resolve it later yah?
        user.save(err => {
            if (err) {
                if (err.code == 11000) {
                    message = `Failed to create account.\nThe email '${req.body.emailid}' is already in use.`;
                } else {
                    message = `Failed to create account.\nError: ${err.name}.`;
                }
                status = 403;
            } else {
                message = "Successfully created account.";
            }
            res.status(status).json({
                success: !err,
                error: err ? err : null,
                message: message,
            });
        });
    });
};

/* UPDATE RESOURCE DETAILS */
exports.updateprofilebyid = (req, res) => {
    res.send('NOT IMPLEMENTED: "updateprofilebyid"');
};

/* DELETE PRODUCT */
exports.deletecustomerbyid = (req, res) => {
    let message = "";
    let status = 200;
    let id = req.params.id;

    customer.findOneAndDelete({_id: id}, (err, customer) => {
        if(err) {
            status = 403;
            message = `Failed to remove user.\nError: ${err.name}.`;
        } else if(!customer) {
            // TODO: if customer is null this 'fails' silently. As in, it doesn't set err. Perhaps let client know?
            status = 401;
            message = `Failed to remove user.\nCould not find customer id.`;
        } else {
            message = "Successfully removed user.";
        }

        res.status(status).json({
            success: !err,
            error: err ? err : null,
            message: message,
        });
    });
};