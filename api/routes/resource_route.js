/**
 *
 * @fileoverview This file defines the api endpoints for resources.
 *
 */

"use strict";

const router = require('express').Router();
const config = require('../config/config');
const resources_controller = require(`${config.CONTROLLERS_PATH}/resource_controller`);
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);

// TODO: really can't think of a use for this
// router.get('/', resources_controller.getallresources);

router.get('/', verifyToken, resources_controller.getresourcesbycustomerid);

router.post('/', verifyToken, resources_controller.addresourcebycustomerid);

router.put('/', verifyToken, resources_controller.updateresourcebycustomerid);

router.delete('/', verifyToken, resources_controller.deleteresourcebyid);

module.exports = router;
