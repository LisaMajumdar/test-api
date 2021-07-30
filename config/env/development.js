'use strict';
const p = require('../../package.json');
var version = p.version;
module.exports = {
    jwt: {
        JWT_SECRET: process.env.SECRET_KEY,
        JWT_EXPIRES: '6000s', 
        JWT_ALGORITHM: process.env.JWT_ALGORITHM
    },
    sqlStorageSettings: {
        host: process.env.DB_HOST,
        db_name: process.env.DB_NAME,
        db_username: process.env.DB_USERNAME,
        db_pass: process.env.DB_PASS,
        db_dialect: process.env.DB_DIALECT
    },
    api_version: "1.0.0",
    api_developer: "",
    constants: {
      API_VERSION: "Api." + version,
      API_DEVELOPER: "",
      PAGE_LIMIT: "10",
      //HTTP CODES
      HTTP_RESPONSE_OK: '200',
      HTTP_RESPONSE_OK_NO_CONTENT: '204',
      HTTP_RESPONSE_BAD_REQUEST: '400',
      HTTP_RESPONSE_UNAUTHORIZED: '401',
      HTTP_RESPONSE_FORBIDDEN: '403',
      HTTP_RESPONSE_NOT_FOUND: '404',
      HTTP_RESPONSE_NOT_ACCEPTABLE: '406'
    },
    PARENTS_APPLICATION_NAME: "Test-API",
    LOGGER_SETTINGS: {
        logger_generate_level: 2, //0=>NOTHING, 1=>ERROR ONLY, 2=>INFO AND ERROR BOTH
        logger_enable_write: true, //ENABLE LOGGER TO WRITE
        logger_error_write_all: true,
        generate_sql_query_log: true,
        logger_enable_application_name: '', //APPLICATION NAME IF WANT TO GENERATE LOGGER ONLY FOR THAT APPLICATION
        logger_enable_module_name: '', //MODULE NAME IF WANT TO GENERATE ONLY PARTICULAR MODULE'S LOGGER EXAMPLE: /var/www/html/galerinha-admin-api/app/api/admin/v1/controllersadminUsersController.js.login
    },
    LOG_PATH: '',
    API_PATH: 'http://localhost:5000/' 
}