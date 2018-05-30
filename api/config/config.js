/* This file has the below configuration settings:
	1. MONGODB Connection Settings
	2. Global Paths to avoid hard coding in every file.
	3. Third Party SECRET KEYS

 */

"use strict";

const config = {};

// Config parameters of the database.
config.API_ENDPOINT_EXTENSION = "/api/v1";
config.DB_URI = "mongodb://localhost/ShareResources";
config.DATABASE = "SHARE_RESOURCES";
config.JWT_KEY = "$h!r#res0urces";  // TODO: probably use env var instead?
config.SALT_ROUNDS = 10;

// Config for the PATHS. Make sure to check the below paths that are commonly used.
config.ROUTES_PATH = "./api/routes";
config.CONTROLLERS_PATH = "../controllers";
config.MODELS_PATH = "./api/models";
config.APPLICATION_CONFIG = "./api/config";

config.JOB_STATUS = {
    SCHEDULED: "Scheduled",
    PENDING: "Pending",
    ACTIVE: "Active",
    FINISHED: "Finished",
    FAILED: "Failed",
};

module.exports = config;