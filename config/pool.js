/**
 * Created by Urvesh on 10/16/15.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'user1',
    password: '1234',
    database: 'is421'
});

module.exports = pool;
