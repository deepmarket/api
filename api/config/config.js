/* This file has the below configuration settings:
	1. MONGODB Connection Settings
	2. Global Paths to avoid hard coding in every file.
	3. Third Party SECRET KEYS

 */

"use strict";

const config = {};

// Config parameters of the database.
config.MONGO_DB_URI = "mongodburi";
config.DATABASE = "SHARE_RESOURCES";
config.SALT_ROUNDS = 10;

// Config for the PATHS. Make sure to check the below paths that are commonly used.
config.ROUTES_PATH = "./api/routes";
config.CONTROLLERS_PATH = "../controllers";
config.MODELS_PATH = "./api/models";
config.APPLICATION_CONFIG = "./api/config";
config.JWT_KEY = "$h!r#res0urces";
config.JOB_SCHEDULED = "Scheduled";

module.exports = config;