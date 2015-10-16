var express = require('express');
var router = express.Router();
var pool = require('../config/pool.js');
var passport = require('passport');
require('../config/passport.js')(passport);
var bcrypt = require('bcrypt');
var async = require('async');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'is421.njit@gmail.com',
        pass: 'is421njit'
    }
});


router.post('/signup', function(req, res) {
    if (req.body) {
        var user = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
            confirmationCode: ''
        };

        async.waterfall([
            function(callback) {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(user.password, salt, function(err, hash) {
                        user.password = hash;
                        callback();
                    })
                })
            },

            function(callback) {
                bcrypt.genSalt(2, function(err, salt) {
                    bcrypt.hash(user.username, salt, function(err, hash) {
                        user.confirmationCode = hash;
                        callback();
                    })
                })
            },

            function() {
                pool.getConnection(function(err, connection) {
                    var sql = 'INSERT into is421 (username, password, firstname, lastname, email, confirmationCode) VALUES (?, ?, ?, ?, ?, ?)';
                    var values = [user.username, user.password, user.firstname, user.lastname, user.email, user.confirmationCode];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            connection.release();

                            transporter.sendMail({
                                from: 'is421.njit@gmail.com',
                                to: user.email,
                                subject: 'NJIT IS421 Confirmation ',
                                text: 'Please enter the following code to validate your account. \n' + user.confirmationCode

                            }, function(err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(info);
                                }
                            });


                            res.send('Confirmation Email Sent');
                        }
                    })
                });
            }
        ]);
    } else {
        res.statusCode(401);
    }
});

router.post('/confirmation', function(req, res) {
    var code = req.body.confirmation;

    if (code) {
        pool.getConnection(function(err, connection) {
            var sql = 'UPDATE is421 SET active = true where confirmationCode = ?';
            var values = [code];
            connection.query(sql, values, function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    connection.release();
                    res.send('User is now active.');
                }
            });
        })
    } else {
        console.log('ERR: code was empty specified.');
        res.statusCode(400)
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
});
module.exports = router;
