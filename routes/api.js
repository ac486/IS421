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

        var sql = 'Select * from is421 where username = ?';
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

module.exports = router;