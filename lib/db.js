const mysql = require('mysql')
const option = require('../config/option');

// DATABASE SETTING
const connection = mysql.createConnection({
    port: 3306,
    user: option.storageConfig.username,
    password: option.storageConfig.password,
    database: option.storageConfig.database,
    host: option.storageConfig.host
})
connection.connect();

exports.connection = connection;