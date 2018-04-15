var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('home/login', { title: 'Express' })
});
router.get('/registration', function(req, res, next) {
  res.render('home/registration', { title: 'Express' })
});

module.exports = router;
