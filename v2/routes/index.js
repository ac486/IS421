var express = require('express');
var router = express.Router();
var pool = require('../config/pool.js');
var passport = require('passport');
require('../config/passport.js')(passport);

router.post('/signup', function(req, res) {
    if (req.body) {
        var user = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        };

        pool.getConnection(function(err, connection) {
            var sql = 'INSERT into is421 (username, password, firstname, lastname, email) VALUES (?, ?, ?, ?, ?)';
            var values = [user.username, user.password, user.firstname, user.lastname, user.email];
            connection.query(sql, values, function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    connection.release();
                    res.send('Added User');
                }
            })
        });
    } else {
        res.statusCode(401);
    }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

router.post('/logout', function(req, res) {
    req.logout();
    res.send('Successfully Logged Out.');
});

router.get('/admin', function(req, res) {
    if (req.isAuthenticated()) {
        console.log(req.query);
        console.log(req.params);

        pool.getConnection(function(err, connection) {
            var sql = 'Select username, firstname, lastname, email, isAdmin from is421';
            connection.query(sql, function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    connection.release();
                    res.send(rows);
                }

            })
        })
    } else {
        res.sendStatus(401);
    }
});

router.get('/authentication', function(req, res) {
    if (!req.isAuthenticated()) {
        res.statusCode(401);
    }
})
module.exports = router;
