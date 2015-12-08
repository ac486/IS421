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
var moment = require('moment');
var debug = require('debug')
var log = debug('is421:api');
var logdb = debug('is421:sql');

// Projects Page
router.get('/dashboard', function(req, res) {
    log(req.method + ' ' + req.url);
    var username = req.user.username;
    var data = {
        user: req.user
    };

    pool.getConnection(function(err, connection) {
        if (!connection) res.send(500);
        logdb('got pool connection');

        async.waterfall([
            function(callback) {
                // Checks to see user belongs to an organization(user)
                log('first waterfall function')

                var sql = 'SELECT owner FROM User WHERE username = ?';
                var values = [username];
                connection.query(sql, values, function (err, rows) {
                    logdb(mysql.format(sql, values));
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
                // If user belongs to organization, get the owner's userId
                log('second waterfall function');
                if (owner) {
                    var sql = 'SELECT userId FROM User WHERE username = ?';
                    var values = [owner];
                    connection.query(sql, values, function (err, rows) {
                        logdb(mysql.format(sql, values));
                        if (err) console.log(err);

                        var userId = rows[0].userId;
                        callback(null, userId);
                    });

                // else user doesn't belong to organization, therefore he is the organization (admin)
                } else {
                    callback(null, req.user.userId);
                }
            }, function(userId, callback) {
                // Get the projects belonging to the organization(admin)
                log('third waterfall function');

                var sql = 'SELECT P.projectId, P.title, P.description FROM Project P INNER JOIN UserProject UP ' +
                    'ON P.projectId = UP.projectId AND UP.userId = ?';
                var values = [userId];
                connection.query(sql, values, function(err, rows) {
                    logdb(mysql.format(sql, values));
                    if (err) console.log(err);

                    data.projects = rows;
                    connection.release();
                    logdb('released connection. Returning...');
                    res.json(data);
                });
            }
        ]);
    });
});

// Create Project
router.post('/project/create', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var title = req.body.title;
    var description = req.body.description;
    var userId = req.user.userId;
    var projectId;

    pool.getConnection(function (err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'INSERT INTO Project (title, description) VALUES (?, ?)';
        var values = [title, description];
        connection.query(sql, values, function(err, result) {
            logdb(mysql.format(sql, values));
            if (err) console.log(err);
            projectId = result.insertId;

            sql = 'INSERT INTO UserProject (userId, projectId) VALUES (?,?)';
            values = [userId, projectId];
            connection.query(sql, values, function(err, result) {
                if (err) console.log(err);
            });
        });

        connection.release();
        logdb('released connection. Returning...');
        res.end();
    })
});

// Gets tasks for specified project
router.get('/project/:projectId', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var projectId = req.params.projectId;
    var data = {};

    pool.getConnection(function (err, connection) {
        log('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT * FROM Task WHERE projectId = ?';
        var values = [projectId];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            if (err) console.log(err);

            connection.release();
            logdb('released connection. Returning...');
            res.json({
                tasks: rows
            });
        });
    });
});

// Create task for the specified project
router.post('/project/:projectId/task/create', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var projectId = req.params.projectId;
    var title = req.body.title;
    var description = req.body.description;
    var assigned_to = req.body.assigned_to || req.user.username;
    var due_by = moment(req.body.due_by).format('YYYY-MM-DD HH-mm-ss');
    var created_at = moment(new Date).format('YYYY-MM-DD HH-mm-ss');

    pool.getConnection(function (err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'INSERT INTO Task (projectId, title, description, created_by, created_at, assigned_to, due_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
        var values = [projectId, title, description, req.user.username, created_at, assigned_to, due_by];
        connection.query(sql, values, function(err, result) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('released connection');
            if (err) console.log(err);
        });
        log('Returning...');
        res.end();
    })
});

router.put('/project/:projectId/task', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var projectId = req.params.projectId;
    var taskId = req.body.taskId;
    var title = req.body.title;
    var description = req.body.description;
    var assigned_to = req.body.assigned_to || req.user.username;
    var due_by = moment(req.body.due_by).format('YYYY-MM-DD HH-mm-ss');

    pool.getConnection(function (err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'UPDATE Task SET title = ?, description = ?, assigned_to = ?, due_by = ? WHERE taskId = ?';
        var values = [title, description, assigned_to, due_by, taskId];
        connection.query(sql, values, function (err, result) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('releasing connection');
            if (err) console.log(err);
        });
        log('returning...');
        res.end();
    })
});

// Update the status of one or multiple tasks
router.put('/project/:projectId/task/status', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var projectId = req.params.projectId;
    var ids = req.body.tasks;  //array of task Ids
    var status = req.body.status;

    pool.getConnection(function (err, connection) {
        logdb('got pool connection');
        if (!connection) req.send(500);

        var sql = 'UPDATE Task SET status = ? WHERE taskId IN (?)';
        var values = [status, ids];

        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            if (err) console.log(err);
            connection.release();
            log('released connection. Returning...');
            res.end();
        })
    });
});

// Get all tasks that are assigned to a certain user
router.get('/tasks', function(req, res, next) {
    log(req.method + ' ' + req.url);
    var username = req.query.username;

    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT * FROM Task WHERE assigned_to = ?';
        var values = [username];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('released connection');
            if (err) {
                console.log(err);
            } else {

                for (var i = 0; i < rows.length; i++) {
                    rows[i].created_at = moment(rows[i].created_at).format('MM/DD/YYYY');
                    rows[i].assigned_at = moment(rows[i].assigned_at).format('MM/DD/YYYY');
                    rows[i].due_by = moment(rows[i].due_by).format('MM/DD/YYYY');
                }

                log('returning...');
                res.json({
                    tasks: rows
                })
            }
        });
    });
});

// Admin Page - Get all users under the admin
router.get('/admin', function(req, res) {
    log(req.method + ' ' + req.url);
    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT username, firstname, lastname, email, isAdmin FROM User WHERE owner = ?';
        var values = [req.user.username];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('releasing connection');
            if (err) {
                console.log(err);
            } else {
                log('returning...');
                res.json({
                    data: rows,
                    user: req.user
                });
            }
        })
    })
});

// Update user settings provided by admin
router.post('/admin/save', function(req, res) {
    log(req.method + ' ' + req.url);
    var users = req.body;   //array of users
    if (users.length > 0) {
        pool.getConnection(function(err, connection) {
            logdb('got pool connection');
            if (!connection) res.send(500);

            for (var i = 0; i < users.length; i++) {
                var sql = 'UPDATE User SET isAdmin = ? WHERE username = ?';
                var values = [users[i].isAdmin, users[i].username];
                connection.query(sql, values, function (err, rows) {
                    //connection.release();
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log('updated');
                        //res.send(rows);
                    }
                });
            }
            connection.release();
            logdb('released conncetion');
        });
    }
    log('returning...');
    res.send('Done');
});


// Delete the user from the application
router.post('/admin/delete', function(req, res){
    log(req.method + ' ' + req.url);
    var usernames = req.body;   //array of usernames

    if (usernames.length > 0 ) {
        pool.getConnection(function(err, connection) {
            log('got pool connection');
            if (!connection) res.send(500);

            var sql = 'DELETE FROM User WHERE username IN (?)';
            var values  = usernames;
            connection.query(sql, values, function(err, rows) {
                logdb(mysql.format(sql, values));
                connection.release();
                logdb('released connection');
                if (err) {
                    console.log(err);
                } else {
                    log('returning...');
                    res.send(rows);
                }
            })
        });
    }
});

// Masquerade feature - admin can login as another user
router.post('/loginas', function(req, res, next) {
    log(req.method + ' ' + req.url);
    req.logout();
    next();
}, passport.authenticate('adminLocal'), function (req, res){
    log(req.method + ' ' + req.url);
    log('returning');
    res.json({
        user: req.user
    })
});

// Gets the current user information
router.get('/user', function(req, res, next) {
    log(req.method + ' ' + req.url);
    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT * FROM User WHERE username = ?';
        var values = [req.user.username];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('released connection');
            if (err) {
                console.log(err);
            } else {
                log('returning...');
                res.json({
                    user: rows[0]
                })
            }
        })
    });
});

// Add a new user to the current admin's organization
router.post('/project/addUser', function(req, res) {
    log(req.method + ' ' + req.url);
    var email = req.body.email;
    var admin = req.user.username;

    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT email, confirmationCode FROM User WHERE email = ?';
        var values = [email];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));

            if (err) {
                console.log(err);
            }

            if (rows.length > 0) {

                sql = 'UPDATE User SET owner = ? WHERE email = ?';
                values = [admin, email];
                connection.query(sql, values, function(err, rows) {
                    logdb(mysql.format(sql, values));
                    connection.release();
                    logdb('released connection');
                    if (err) console.log(err);
                });

                log('sending email for project reassignment');
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

                log('returning...');
                res.send({
                    message: rows[0].email + ' has been added to this project'
                });

            } else {
                log('sending email for project invite');
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

                log('returning...');
                res.send({
                    message: email + ' has been invited to sign up for an account'
                });
            }
        })
    });
});

// Remove a user from the admin's organization
router.post('/project/removeUser', function(req, res) {
    log(req.method + ' ' + req.url);
    var email = req.body.email;
    var admin = req.user.username;

    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'UPDATE User SET owner = ? where email = ?';

        //TODO figure out what to set owner to
        // if we set owner to null, the user becomes an admin
        // if we set it to ' ' space, app wil crash on dashboard because ' ' is not a user
        // for now, i will set it admin, must create super admin account

        var values = ['admin', email];
        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            if (err) {
                console.log(err);
            }
            connection.release();
            log('released connection, returning...');
            res.end();

        })
    });
});

// Get all the users on the application
router.get('/users/all', function(req, res) {
    log(req.method + ' ' + req.url);
    pool.getConnection(function(err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'SELECT username, email, firstname, lastname, owner FROM User WHERE username <> ?;';
        var values = [req.user.username];

        connection.query(sql, values, function(err, rows) {
            logdb(mysql.format(sql, values));
            if (err) console.log(err);

            connection.release();
            logdb('released connection. returning...');
            res.json({
                userList: rows,
                user: req.user
            })
        })
    })
});

// Delete a project
router.put('/project/delete', function(req, res) {
    log(req.method + ' ' + req.url);
    var id = req.body.projectId;

    pool.getConnection(function (err, connection) {
        logdb('got pool connection');
        if (!connection) res.send(500);

        var sql = 'DELETE Project, UserProject, Task ' +
                    'FROM Project ' +
                    'LEFT JOIN UserProject ON Project.projectId = UserProject.projectId ' +
                    'LEFT JOIN Task ON Project.projectId = Task.projectId ' +
                    'WHERE Project.projectId = ?';
        var values = [id];

        connection.query(sql, values, function(err, result) {
            logdb(mysql.format(sql, values));
            connection.release();
            logdb('released connection');
            if (err) console.log(err);
            log('returning');
            res.end();
        })
    })
});

module.exports = router;