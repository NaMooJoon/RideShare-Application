const mysql = require('mysql')
const option = require('../config/option');

// DATABASE SETTING
const options = {
    port: 3306,
    user: option.storageConfig.username,
    password: option.storageConfig.password,
    database: option.storageConfig.database,
    host: option.storageConfig.host
}
const connection = mysql.createConnection(options);
connection.connect();

exports.connection = connection;
exports.options = options;