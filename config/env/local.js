'use strict';
const p = require('../../package.json');
var version = p.version;
module.exports = {
    JWTSETTINGS: {
        secretKey: process.env.SECRET_KEY,
        accessTokenExpire: '300s', 
    },
    sqlStorageSettings: {
        host: process.env.DB_HOST,
        db_name: process.env.DB_NAME,
        db_username: process.env.DB_USERNAME,
        db_pass: process.env.DB_PASS,
        db_dialect: process.env.DB_DIALECT
    }
}