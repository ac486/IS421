var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
    res.render('newIndex');
});

router.get('/dashboard', function(req, res) {
    res.render('newDashboard');
});

router.get('/profile', function(req, res) {
    res.render('newProfile');
});


router.get('/adminDashboard', function(req, res) {
    res.render('newAdminDashboard');
});

module.exports = router;
