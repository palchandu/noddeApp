var express = require('express');
var router = express.Router();

function getCategory (req, res, next) {
  var db = req.db;
  var collection = db.get('category_list');

  collection.find({}, {}, function(e, docs) {
    req.cat_data = docs;
    return next();
  });
}

function getBooks (req, res, next) {
  var db = req.db;
  var collection = db.get('books');

  collection.find({}, {}, function(e, docs) {
    req.book_data = docs;
    return next();
  });
}

function renderData(req, res) {
  res.render('home/book', {
    categoryList: req.cat_data,
      bookList: req.book_data,
      title: 'Admin' ,
      req:req
  });
}

/* GET users listing. */
router.get('/', getCategory,getBooks,renderData);

module.exports = router;