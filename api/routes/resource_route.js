/**
 * @fileoverview This file defines the api endpoints for resources.
 *
 */

"use strict";

let router = require('express').Router();

const config = require('../config/config');
const resources_controller = require(`${config.CONTROLLERS_PATH}/resource_controller`);

// TODO: really can't think of a use for this
// router.get('/', resources_controller.getallresources);

router.get('/', resources_controller.getresourcesbycustomerid);

router.post('/', resources_controller.addresourcebycustomerid);

router.put('/', resources_controller.updateresourcebycustomerid);

router.delete('/:resourceId/', resources_controller.deleteresourcebyid);

module.exports = router;
