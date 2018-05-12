"use strict";

const config = require('../config/config');
// import config from '../config/config';

let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let customer = require('../models/customer');

// Authenticate user; return token
exports.authenticate = (req, res) => {
    let message, encrypted_password;
    let status = 200;
    let token = "";
    let email = req.body.emailid;
    let plaintext_password = req.body.password;

    let query = customer.findOne({
        "emailid": email,
    });

    query.select('emailid password');
    query.exec((err, user) => {
        if (err) {
            message = "Failed to log in.\nPlease verify your email and password";
            status = 403;
        } else {
            message = "Login successful";
            encrypted_password = user.password;
        }
    });

    // TODO: this needs to be tested still
    bcrypt.compare(plaintext_password, encrypted_password).then((res) => {
        if(res) {
            token = jwt.sign(email, config.JWT_KEY);
        }
    }).catch(err => {
        console.log(`Error in authcontroller: ${err}`);
        message = "Failed to log in.\nPlease verify your email and password";
    });

    res.status(status).json({
        token: token,
        message: message,
    });
};