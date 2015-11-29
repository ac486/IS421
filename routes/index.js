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
var crypto = require('crypto');

router.post('/signup', function(req, res) {
    if (req.body) {
        var user = {
            owner: req.body.owner, //either null or a username
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
                    if (!connection) res.send(500);

                    user.isAdmin = !user.owner; //if user has owner, he cannot be an admin initially

                    // Removed confirmation page so made user active by default
                    var sql = 'INSERT INTO User (username, password, firstname, lastname, email, confirmationCode, owner, isAdmin, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    var values = [user.username, user.password, user.firstname, user.lastname, user.email, user.confirmationCode, user.owner, user.isAdmin, true];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            connection.release();
                            console.log(user.confirmationCode);

                            //transporter.sendMail({
                            //    //from: 'is421.njit@gmail.com',
                            //    to: user.email,
                            //    subject: 'NJIT IS421 Confirmation ',
                            //    text: 'Please enter the following code to validate your account. \n' + user.confirmationCode
                            //
                            //}, function(err, info) {
                            //    if (err) {
                            //        console.log(err);
                            //    } else {
                            //        console.log(info);
                            //    }
                            //});
                            res.send('Confirmation Email Sent');
                        }
                    })
                });
            }
        ]);
    } else {
        res.end();
    }
});

router.post('/confirmation', function(req, res) {
    var code = req.body.confirmation;

    if (code) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'UPDATE User SET active = true WHERE confirmationCode = ?';
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

router.post('/forgotUsername', function(req, res) {
    var email = req.body.email;
    console.log(email);

    if (email) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'SELECT username FROM User where email = ? ';
            var values = [email];
            connection.query(sql, values, function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    transporter.sendMail({
                        to: email,
                        subject: 'Username for is421',
                        text: 'This is your username: ' + rows[0].username
                    });
                }
            })
        })
    }
    res.send();
});

router.post('/forgotPassword', function(req, res) {
    var username = req.body.username;
    console.log(username);

    if (username) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);
            var password = crypto.randomBytes(7).toString('hex');
            console.log(password);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    var hash = hash;

                    var sql = 'UPDATE User SET password = ? WHERE username = ?';
                    var values = [hash, username];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log(rows);
                        }
                    });

                    sql = 'SELECT email FROM User WHERE username = ?';
                    values = [username];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            transporter.sendMail({
                                to: rows[0].email,
                                subject: 'temporary password',
                                text: 'your temp password is: ' + password
                            });
                        }
                    });
                    connection.release();
                })
            });
        })
    }
    res.send();
});

router.get('/owner', function(req, res) {
    var username = req.query.username;

    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        console.log(username);
        var sql = 'SELECT * FROM User WHERE username = ?';
        var values = [username];
        connection.query(sql, values, function(err, rows) {
            connection.release();
            if (err) {
                console.log(err);
            }
            if (rows.length > 0) {
                res.end();
            } else {
                res.sendStatus(404);    //user does not exist
            }
        });
    });
});

router.get('/authentication', function(req, res) {
    if (!req.isAuthenticated()) {
        res.statusCode(401);
    }
});
module.exports = router;
