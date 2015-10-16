/**
 * Created by Urvesh on 10/16/15.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pool = require('./pool.js');
var bcrypt = require('bcrypt');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        return done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        pool.getConnection(function (err, connection) {

            var sql = 'Select * from is421 where username = ?';
            var values = [username];
            connection.query(sql, values, function (err, rows) {
                connection.release();
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
};