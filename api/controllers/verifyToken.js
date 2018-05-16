
"use strict";

const config = require('../config/config');
let jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({
            success: false,
            err: null,
            message: 'No token provided.',
        });
    }
    // TODO: pretty sure this should be JWT_KEY not JWT_TOKEN
    jwt.verify(token, config.JWT_TOKEN, function(err, decoded) {
        if(err) {
            return res.status(403).send({
                success: false,
                error: err ? err : null,
                message: 'Failed to authenticate with provided token.',
            });
        }
        // If everything good, save to request for use in other routes
        next();
    });
}

module.exports = verifyToken;