var express = require('express');
var router = express.Router();
//var conn = require('../db.js');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
//router.get('/signup', function(req, res, next) {
//    res.send('idk');
//  //res.render('index', {
//  //    title: 'IS421'
//  //});
//});


//var mysql = require('mysql');
//
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: false,
//    database: 'njit'
//});
//connection.connect();

router.post('/signup', function(req, res) {
    if (req.body) {
        var user = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password
        }
    }

    //connection.query('insert into is421 (username, password, firstname, lastname, email, isAdmin) values (?,?,?,?,?,?) ', [user.username, user.password, user.firstname, o.lastname, o.email, true], function(err, rows) {
    //    console.log('rows:', rows);
    //    if (err) console.log(err);
    //});

    //connection.end();
    res.send('aaa');

});

//router.post('/login', passport.authenticate('local'), function(req, res) {
//    res.send('did it work?', req.user);
//})
//
//router.post('/login', passport.authenticate('local', {
//    successRedirect: '/dashboard',
//    failureRedirect: '/login',
//    failureFlash: 'Invalid username or password'
//}));

module.exports = router;
