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
            host: req.body.host, //either null or a username
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
                    var sql = 'INSERT into is421 (username, password, firstname, lastname, email, confirmationCode, host) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    var values = [user.username, user.password, user.firstname, user.lastname, user.email, user.confirmationCode, user.host];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            connection.release();
                            console.log(user.confirmationCode);

                            transporter.sendMail({
                                //from: 'is421.njit@gmail.com',
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
        res.end();
    }
});

router.get('/host', function(req, res) {
    var username = req.query.username;

    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'Select * from is421 where username = ?';
        var values = [username];
        connection.query(sql, values, function(err, rows) {
            connection.release();
            console.log(rows);
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

router.post('/confirmation', function(req, res) {
    var code = req.body.confirmation;

    if (code) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'UPDATE is421 SET active = true where confirmationCode = ?';
            var values = [code];
            connection.query(sql, values, function(err, rows) {
                console.log(rows);
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

router.get('/dashboard', function(req, res) {
    var username = req.user.username;
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'Select host from is421 where username = ?';
        var values = [username];
        connection.query(sql, values, function(err, rows) {
            connection.release();
            console.log(rows);
            if (err) {
                console.log(err);
            }

            if (rows[0].host) {
                res.json({
                    user: req.user,
                    message: 'You are registered under user: ' + rows[0].host
                });
            } else {
                res.json({
                    user: req.user,
                    message: req.user.username + ' you are the owner'
                })
            }
        })

    })
});

router.get('/admin', function(req, res) {
    if (req.isAuthenticated()) {

        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'Select username, firstname, lastname, email, isAdmin from is421 where host = ?';
            var values = [req.user.username];
            connection.query(sql, values, function(err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        data: rows,
                        user: req.user
                    });
                }
            })
        })
    } else {
        res.sendStatus(401);
    }
});

router.post('/admin/save', function(req, res) {
    var users = req.body;   //array of users
    if (users.length > 0) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            for (var i = 0; i < users.length; i++) {
                var sql = 'Update is421 set isAdmin = ? where username = ?';
                var values = [users[i].isAdmin, users[i].username];
                connection.query(sql, values, function (err, rows) {
                    //connection.release();
                    if (err) {
                        connection.log(err);
                    } else {
                        console.log('updated');
                        //res.send(rows);
                    }
                });
            }
            connection.release();
        });
    }
    res.send('Done');
});

router.post('/admin/delete', function(req, res){
    var usernames = req.body;   //array of usernames
    console.log(usernames);

    if (usernames.length > 0 ) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'Delete from is421 where username in (?)';
            var values  = usernames;
            connection.query(sql, values, function(err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                } else {
                    res.send(rows);
                }
            })
        });
    }
});

router.post('/forgotUsername', function(req, res) {
    var email = req.body.email;
    console.log(email);

    if (email) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'Select username from is421 where email = ? ';
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

                    var sql = 'Update is421 Set password = ? where username = ?';
                    var values = [hash, username];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log(rows);
                        }
                    });

                    sql = 'Select email from is421 where username = ?';
                    values = [username];
                    connection.query(sql, values, function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(rows[0].email);
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

router.post('/loginas', function(req, res, next) {
    req.logout();
    console.log('loginas user?', req.user);
    next();
}, passport.authenticate('adminLocal'), function (req, res){
    console.log('passport worked?');
    res.json({
        user: req.user
    })
});

router.get('/authentication', function(req, res) {
    if (!req.isAuthenticated()) {
        res.statusCode(401);
    }
});
module.exports = router;
