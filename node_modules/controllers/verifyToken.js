
"use strict";

let jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
    }
    jwt.verify(token, config.JWT_TOKEN, function(err, decoded) {
        if(err) {
            return res.status(403).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }
        // If everything good, save to request for use in other routes
        next();
    });
}

module.exports = verifyToken;