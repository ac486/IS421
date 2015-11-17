/**
 * Created by Urvesh on 10/16/15.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pool = require('./pool.js');
var bcrypt = require('bcrypt');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        console.log('seralize', user.username);
        return done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        console.log('deseraizlie', username);
        pool.getConnection(function (err, connection) {

            var sql = 'Select * from is421 where username = ?';
            var values = [username];
            connection.query(sql, values, function (err, rows) {
                connection.release();
                console.log(rows[0]);
                if (err) {
                    console.log(err);
                    return done(err);
                }

                if (rows.length === 0) {
                    return done(null, false);
                }
                return done(null, rows[0]);
            });
        })
    });

    passport.use('local', new LocalStrategy(function (username, password, done) {
        console.log('\n\ninside local\n\n\n');
        pool.getConnection(function (err, connection) {

            var sql = 'Select * from is421 where username = ?';
            var values = [username];
            connection.query(sql, values, function (err, rows) {
                connection.release();
                if (err) {
                    return done(err);
                }
                var user = rows[0];

                if (rows.length === 0 ){
                    console.log('no user');
                    return done(null, false, {
                        message: 'User does not exist.'
                    });
                }

                if (user.password) {
                    bcrypt.compare(password, user.password, function(err, match) {
                        if (match) {
                            if (user.active) {
                                return done(null, user);
                            } else {
                                console.log('User has not been validated');
                                return done(null, false, {
                                    message: 'User has not been validated.'
                                })
                            }
                        } else {
                            console.log('Incorrect Password.');
                            return done(null, false, {
                                message: 'Incorrect Password.'
                            })
                        }
                    })
                }
            })
        })
    }));

    passport.use('adminLocal', new LocalStrategy(function (username, password, done) {
        console.log('inide loginas');
        console.log(username, password);
        pool.getConnection(function (err, connection) {

            var sql = 'Select * from is421 where username = ?';
            var values = [username];
            connection.query(sql, values, function(err, rows) {
                connection.release();
                var user = rows[0];
                console.log(user);
                if (user) {

                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'User does not exist'
                    });
                }
            })
        })
    }));
};