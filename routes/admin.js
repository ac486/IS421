/**
 * Created by Urvesh on 10/2/2015.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

   var users = [
      {
         username: 'user1',
         firstname: 'Bob',
         lastname: 'Kentucky',
         email: 'bobk@aol.com',
         password: 'abc123',
         isAdmin: true
      },
      {
         username: 'user2',
         firstname: 'Ash',
         lastname: 'Pikachu',
         email: 'bob@pokemon.com',
         password: 'mewtwo',
         isAdmin: false
      }
   ];
   res.render('admin', {
      users: users
   });
});

module.exports = router;