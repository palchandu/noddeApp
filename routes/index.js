var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('books');
    collection.find({},function(err,docs){
        res.render('index', { title: 'Admin' ,req:req,bookList:docs});
    })
  //res.render('index', { title: 'Express' });
});

module.exports = router;
