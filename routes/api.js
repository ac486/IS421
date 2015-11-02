/**
 * Created by Urvesh on 11/2/15.
 */

var express = require('express');
var router = express.Router();

router.get('/api/admin', function(req, res) {
    console.log('subdomain admin');
    res.json({
        message: 'WELCOME TO THE API DOMAINNNN'
    })
    //res.send('Welcome to the API DOMAIN');
});

module.exports = router;