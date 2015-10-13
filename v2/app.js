var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//var mysql = require('mysql');

//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: false,
//    database: 'njit'
//});
//connection.connect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//app.use(passport.initialize());
//app.use(passport.session());

//app.use('/', routes);
//app.use('/users', users);
//app.use('/api', routes);
app.use('/*', function(req, res) {
    res.render('layout');
});

app.listen(8080, function() {
    console.log('listening on port 8080');
});

//
//passport.use('local', new LocalStrategy(function(username, password, done) {
//    console.log(username, password);
//    connection.query('select username, password from is421 where username=?', [username], function(err, rows) {
//        console.log(rows);
//        if (err) return done (err);
//
//        if (rows) {
//            return done(null, rows[0]); //return the one and only user.
//        } else {
//            return done(null, false);
//        }
//    })
//}));
//
//passport.serializeUser(function(user, done) {
//    console.log('serlize:', user);
//    done(null, user.username);
//});
//
//passport.deserializeUser(function(username, done) {
//    connection.query('select * from is421 where username=?', [username], function(err, rows) {
//        done(err, rows);
//    })
//});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
