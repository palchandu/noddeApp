var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('students');
  collection.find({},{},function(e,docs){
    res.render('home/contact', { title: 'Express',"student" : docs })
  });
  
});

module.exports = router;