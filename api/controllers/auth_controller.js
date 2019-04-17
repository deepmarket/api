"use strict";

const config = require('../config/config');

let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
// let customer = require('../models/customer_model');
const Customer = require('../models/customer_model');

// Authenticate user; return token
// exports.login = (req, res) => {
//     let message;
//     let status = 200;
//     let token = "";
//     let email = req.body.email;
//     let plaintext_password = req.body.password;
//
//     // TODO: man this is janky
//     customer.findOne({"email": email}, "email password", (err, user) => {
//         if (err) {
//             message = "Failed to log in.\nPlease verify your email/password combination.";
//             status = 403;
//         } else if(!user) {
//             message = "The provided email/password combination could not be found.";
//             status = 401;
//             res.status(status).json({
//                 success: !!user,
//                 error: err ? err : null,
//                 message: message,
//                 token: null,
//                 auth: false,
//             });
//         } else {
//             message = "Login unsuccessful";
//             bcrypt.compare(plaintext_password, user.password).then(auth => {
//                 if(auth) {
//                     token = jwt.sign({id: user._id}, config.JWT_KEY);
//                     message = "Login successful";
//                 }
//                 res.status(status).json({
//                     success: !err,
//                     error: err ? err : null,
//                     message: message,
//                     token: token,
//                     auth: auth,
//                 });
//             }).catch(err => {
//                 message = "Failed to log in.\nPlease verify your email and password.";
//                 status = 403;
//                 res.status(status).json({
//                     success: !err,
//                     error: err ? err : null,
//                     message: message,
//                     token: null,
//                     auth: false,
//                 });
//             });
//         }
//     });
// };

exports.login = async (req, res) => {
    let message;
    let status = 200;
    let errors = [];
    let token = "";
    let email = req.body.email;
    let plaintext_password = req.body.password;
    let customer = null, auth = null;

    try {
        customer = Customer.findOne({"email": email}, "email password");

        if(!customer) {
            message = "The provided email/password combination could not be found.";
            status = 401;
        }
    } catch(err) {
        message = "There was an error while attempting to log in.";
        errors.push(err);
        status = 500;
    }

    try {
        auth = await bcrypt.compare(plaintext_password, customer.password);
        if(!auth) {

        }

    } catch (err) {
        errors.push(err);
    }



    customer.findOne({"email": email}, "email password", (err, user) => {
        if (err) {
            message = "Failed to log in.\nPlease verify your email/password combination.";
            status = 403;
        } else if(!user) {
            message = "The provided email/password combination could not be found.";
            status = 401;
            res.status(status).json({
                success: !!user,
                error: err ? err : null,
                message: message,
                token: null,
                auth: false,
            });
        } else {
            message = "Login unsuccessful";
            bcrypt.compare(plaintext_password, user.password).then(auth => {
                if(auth) {
                    token = jwt.sign({id: user._id}, config.JWT_KEY);
                    message = "Login successful";
                }
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: token,
                    auth: auth,
                });
            }).catch(err => {
                message = "Failed to log in.\nPlease verify your email and password.";
                status = 403;
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: null,
                    auth: false,
                });
            });
        }
    });
};

exports.logout = (req, res) => {
    let message = "Successfully logged out.";
    let status = 200;

    res.status(status).json({
        success: true,
        errors: [],
        message: message,
        data: {
            token: null,
        },
        auth: false,
    })
};