"use strict";

const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/account_model');

function good_user(user) {
    // Every `user` has the defined properties
    return ["fisrtname", "lastname", "email", "password"].every(value => {
        user.hasOwnProperty(value);
    });
}

exports.get_account_by_id = (req, res) => {
    let message;
    let status = 200;

    Account.findById(req.user_id, (err, account) => {
        if (err) {
            message = `Failed to get customer information.\nError: ${err.name}: ${err.message}`;
            status = 500;
        } else if (!account) {
            status = 400;
            message = `Failed to get customer information.\nThe user with id '${req.user_id}' could not be found.`;
        } else {
           message = "Successfully fetched account information.";
        }

        res.status(status).json({
            success: !!account,  // `!!` is shorthanded boolean conversion
            error: err || null,
            message: message,
            account: account,
        })
    });
};

exports.add_account = (req, res) => {
    let user;
    let message = "";
    let status = 200;

    bcrypt.hash(req.body.password, config.SALT_ROUNDS, (err, hash) => {
        user = new Account({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
            status: "Active",
        });

        user.save((err, new_user) => {
            if (err) {
                if (err.code === 11000) {
                    message = `Failed to create account.\nThe email '${req.body.email}' is already in use.`;
                    status = 409;
                } else {
                    message = `Failed to create account.`;
                    status = 400;
                }
                res.status(status).json({
                    success: !err,
                    error: err || null,
                    message: message,
                    token: null,
                    account: null,
                });
            } else {
                message = "Successfully created account.";

                let jwt_payload = {
                    // email: req.body.email,
                    id: new_user._id,
                };
                jwt.sign(jwt_payload, config.JWT_KEY, {expiresIn: '24h'}, (err, token) => {
                    if (err) {
                        status = 500;
                        message = "Failed to create authentication token."
                    }
                    res.status(status).json({
                        success: !err,
                        error: err ? err : null,
                        message: message,
                        token: token,
                        account: new_user,
                    });
                });
            }
        });
    });
};

exports.update_account_by_id = (req, res) => {
    let status = 200;
    let message = "";

    try {
        // `req.body.update` should be a json encoded object with the fields to update
        req.body.update = JSON.parse(req.body.update);
    } catch (e) {
        // Assume this is valid json; if not mongoose will throw an error and we'll return it below
    }

    if(req.body.update.hasOwnProperty("password")) {
        // TODO: Run hash function in sync so we don't have to deal with callback hell below
        req.body.update.password = bcrypt.hashSync(req.body.update.password, config.SALT_ROUNDS);
    }

    Account.findOneAndUpdate({_id: req.user_id},
        // Unpack `update` and ensure we update the `updatedOn` field.
        {
            ...req.body.update,
            updatedOn: Date.now()
        },
        // Return the updated document with `new`
        {
            new: true,
            runValidators: true,
        },
        (err, doc) => {

        if(err) {
            status = 500;
            message = `There was an error updating your account.`;
        } else {
            message = "Your account was successfully updated.";
        }

        res.status(status).json({
            success: !err,
            error: err || null,
            message: message,
            account: doc,
        });
    });
};

exports.delete_account_by_id = (req, res) => {
    let status = 200;
    let message = "";

    Account.findOneAndDelete({_id: req.user_id}, (err, account) => {
        if(err) {
            status = 500;
            message = `Failed to remove user.\nError: ${err.name}.`;
        } else if(!account) {
            status = 403;
            message = `Failed to remove user.\nCould not find customer id.`;
        } else {
            message = "Successfully removed user.";
        }

        res.status(status).json({
            success: !!account,
            error: err || null,
            message: message,
            account: account,
        });
    });
};