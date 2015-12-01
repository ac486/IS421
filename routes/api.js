/**
 * Created by Urvesh on 11/2/15.
 */

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
var mysql = require('mysql');

router.get('/dashboard', function(req, res) {
    var username = req.user.username;
    var data = {
        user: req.user
    };

    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        async.waterfall([
            function(callback) {
                var sql = 'SELECT owner FROM User WHERE username = ?';
                var values = [username];
                connection.query(sql, values, function (err, rows) {

                    if (err) {
                        console.log(err);
                    }

                    if (rows[0].owner) {
                        data.message = 'You are registered under user: ' + rows[0].owner;
                    } else {
                        data.message = req.user.username + ' you are the owner'
                    }
                    callback(null, rows[0].owner);
                });
            }, function(owner, callback) {
                if (owner) {
                    var sql = 'SELECT userId FROM User WHERE username = ?';
                    var values = [owner];
                    connection.query(sql, values, function (err, rows) {
                        if (err) console.log(err);

                        var userId = rows[0].userId;
                        callback(null, userId);
                    });
                } else {
                    callback(null, req.user.userId);
                }
            }, function(userId, callback) {
                var sql = 'SELECT P.projectId, P.title, P.description FROM Project P INNER JOIN UserProject UP ' +
                    'ON P.projectId = UP.projectId AND UP.userId = ?';
                var values = [userId];
                connection.query(sql, values, function(err, rows) {
                    if (err) console.log(err);

                    data.projects = rows;
                    connection.release();
                    res.json(data);
                });
            }
        ]);
    });
});

router.post('/project/create', function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var userId = req.user.userId;
    var projectId;

    pool.getConnection(function (err, connection) {
        if (!connection) res.send(500);

        var sql = 'INSERT INTO Project (title, description) VALUES (?, ?)';
        var values = [title, description];
        connection.query(sql, values, function(err, result) {
            if (err) console.log(err);
            projectId = result.insertId;
            console.log(result);
            console.log(projectId);

            sql = 'INSERT INTO UserProject (userId, projectId) VALUES (?,?)';
            values = [userId, projectId];
            connection.query(sql, values, function(err, result) {
                if (err) console.log(err);
            });
        });

        connection.release();
        res.end();
    })
});

// Gets tasks for specified project
router.get('/project/:projectId', function(req, res, next) {
    var projectId = req.params.projectId;
    var data = {};

    pool.getConnection(function (err, connection) {
        if (!connection) res.send(500);

        var sql = 'SELECT * FROM Task WHERE projectId = ?';
        var values = [projectId];
        connection.query(sql, values, function(err, rows) {
            if (err) console.log(err);

            connection.release();
            res.json({
                tasks: rows
            });
        });
    });
});


router.post('/project/:projectId/task/create', function(req, res, next) {
    var projectId = req.params.projectId;
    var title = req.body.title;
    var description = req.body.description;
    pool.getConnection(function (err, connection) {
        if (!connection) res.send(500);

        var sql = 'INSERT INTO Task (projectId, title, description, created_by) VALUES (?,?, ?, ?)';
        var values = [projectId, title, description, req.user.username];
        connection.query(sql, values, function(err, result) {
            if (err) console.log(err);
            console.log(result.insertId);
        });
        res.end();
    })
});

router.put('/project/:projectId/task/status', function(req, res, next) {
    var projectId = req.params.projectId;
    var ids = req.body.tasks;  //array of task Ids
    var status = req.body.status;

    console.log(ids);
    pool.getConnection(function (err, connection) {
        if (!connection) req.send(500);

        var sql = 'UPDATE Task SET status = ? WHERE taskId IN (?)';
        var values = [status, ids];

        connection.query(sql, values, function(err, rows) {
            if (err) console.log(err);
            connection.release();
            console.log(rows);

            res.end();
        })
    });
});

router.get('/admin', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'SELECT username, firstname, lastname, email, isAdmin FROM User WHERE owner = ?';
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
});

router.post('/admin/save', function(req, res) {
    var users = req.body;   //array of users
    if (users.length > 0) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            for (var i = 0; i < users.length; i++) {
                var sql = 'UPDATE User SET isAdmin = ? WHERE username = ?';
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

    if (usernames.length > 0 ) {
        pool.getConnection(function(err, connection) {
            if (!connection) res.send(500);

            var sql = 'DELETE FROM User WHERE username IN (?)';
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

router.post('/loginas', function(req, res, next) {
    req.logout();
    next();
}, passport.authenticate('adminLocal'), function (req, res){
    res.json({
        user: req.user
    })
});

router.get('/user', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'SELECT * FROM User WHERE username = ?';
        var values = [req.user.username];
        connection.query(sql, values, function(err, rows) {
            connection.release();

            if (err) {
                console.log(err);
            } else {
                res.json({
                    user: rows[0]
                })
            }
        })
    });
});

router.post('/project/addUser', function(req, res) {
    var email = req.body.email;
    var admin = req.user.username;

    console.log(email, admin);
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'SELECT email, confirmationCode FROM User WHERE email = ?';
        var values = [email];
        connection.query(sql, values, function(err, rows) {

            if (err) {
                console.log(err);
            }

            if (rows.length > 0) {

                sql = 'UPDATE User SET owner = ? WHERE email = ?';
                values = [admin, email];
                connection.query(sql, values, function(err, rows) {
                    connection.release();
                    if (err) console.log(err);
                });


                transporter.sendMail({
                    to: rows[0].email,
                    subject: 'IS421 - Project Reassignment',
                    text: 'You have been reassigned under a new manager: ' + admin
                    //subject: 'IS421 - Join Project Confirmation',
                    //text: 'Enter the confirmation code to accept the request to join under ' + admin + ', ' + rows[0].confirmationCode
                }, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                    }
                });

                res.send({
                    message: rows[0].email + ' has been added to this project'
                });

            } else {
                transporter.sendMail({
                    to: email,
                    subject: 'NJIT IS421 New Project Invite',
                    text: 'Click the link to signup as a new user localhost:8080/' + admin + '/signup'
                }, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                    }
                });

                res.send({
                    message: email + ' has been invited to sign up for an account'
                });
            }
        })
    });
});

router.post('/project/removeUser', function(req, res) {
    var email = req.body.email;
    var admin = req.user.username;

    console.log(email, admin);
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'UPDATE User SET owner = ? where email = ?';

        //TODO figure out what to set owner to
        // if we set owner to null, the user becomes an admin
        // if we set it to ' ' space, app wil crash on dashboard because ' ' is not a user
        // for now, i will set it admin, must create super admin account

        var values = ['admin', email];
        connection.query(sql, values, function(err, rows) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
            connection.release();
            res.end();

        })
    });
});


router.get('/users/all', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);

        var sql = 'SELECT username, email, firstname, lastname, owner FROM User WHERE username <> ?;';
        var values = [req.user.username];

        connection.query(sql, values, function(err, rows) {
            if (err) console.log(err);

            res.json({
                userList: rows,
                user: req.user
            })
        })
    })
});

router.put('/project/delete', function(req, res) {
    var id = req.body.projectId;

    pool.getConnection(function (err, connection) {
        if (!connection) res.send(500);

        var sql = 'DELETE Project, UserProject, Task ' +
                    'FROM Project ' +
                    'LEFT JOIN UserProject ON Project.projectId = UserProject.projectId ' +
                    'LEFT JOIN Task ON Project.projectId = Task.projectId ' +
                    'WHERE Project.projectId = ?';
        var values = [id];

        connection.query(sql, values, function(err, result) {
            connection.release();
            if (err) console.log(err);
            console.log(result);
            res.end();
        })
    })
});

module.exports = router;