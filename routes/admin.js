var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
//stprage configuration
const storage=multer.diskStorage({
    destination:'./public/upload/',
    filename:function(req,file,cb){
      cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
  });
  //Init Upload
  const upload=multer({
    storage:storage
  }).single('cover');


router.get('/', function(req, res, next) {
  res.render('admin/login', { title: 'Admin' })
});
router.get('/register', function(req, res, next) {
    res.render('admin/register', { title: 'Admin' })
  });
router.get('/forgot', function(req, res, next) {
    res.render('admin/forgot-password', { title: 'Admin' })
  });
router.get('/dashboard',function(req, res, next){
    res.render('admin/index', { title: 'Admin' ,req:req});
    //console.log(req.session.firstName);
});
router.get('/category',function(req, res, next){
    var db = req.db;
    var collection = db.get('category_list');
    collection.find({},function(err,docs){
        res.render('admin/category', { title: 'Admin' ,req:req,categoryList:docs});
    })
    
});
router.get('/books',function(req, res, next){
    var db = req.db;
    var collection = db.get('category_list');
    collection.find({},function(err,docs){
        res.render('admin/books', { title: 'Admin' ,req:req,categoryList:docs});
    })
    
});
router.get('/books_show',function(req, res, next){
    var db = req.db;
    var collection = db.get('books');
    collection.find({},function(err,docs){
        res.render('admin/books_list', { title: 'Admin' ,req:req,bookList:docs});
    })
    
});


router.post('/save_user', function(req, res, next) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var fName = req.body.fname;
    var lName = req.body.lname;
    var userEmail = req.body.email;
    var password = req.body.password;
    //set colection name
    var collection = db.get('admin_user');
    //first check that email is already exist or not
    collection.findOne({"email":userEmail},function(err,result){
        if(result)
        {
            req.flash('error', 'Email Already Esists!');
            res.redirect('../admin/register');
        }
        else
        {
             // Set our collection
    
            collection.insert({
                "firstName":fName,
                "lastName":lName,
                "email":userEmail,
                "password":password
            },
            function(err,doc){
                if (err) {
                    // If it failed, return error
                    //res.send("There was a problem adding the information to the database.");
                    res.render('admin/register', { title: 'Admin','error':'Something wrong!try again' });
                }
                else {
                    // And forward to success page
                    req.flash('success', 'Data added successfully!');
                    res.redirect("../admin");
                    //res.render('admin/login', { title: 'Admin','msg':'Successfully user registered' })
                }   
            });
        }
    });
   
    //res.render('admin/forgot-password', { title: 'Admin' })
  });
  router.post('/make_login',function(req,res,next){
    // Set our internal DB variable
    var db = req.db;
    var userEmail = req.body.email;
    var password = req.body.password;
    var collection = db.get('admin_user');
    collection.findOne({"email":userEmail,"password":password},function(err,result){
        if(result)
        {
            req.session.email=req.body.email;
            req.session.name=result.firstName;
            
            res.redirect('../admin/dashboard');
            
        }
        else
        {
            req.flash('error', 'Email or password is incorrect');
            res.redirect('../admin');
        }
    })
  });
  router.post('/addCategory',function(req,res,next){
    var obj = {};
    var cat=req.body.c;
    /*db part */
    var db = req.db;
    var collection = db.get('category_list');
    collection.insert({"category":cat},function(err,result){
        if(result)
        {
            res.send({ ok: true, msg: "successfully Category Added" });
        }
        else
        {
            res.send({ ok: false, msg: "Something wrong!try again" });
        }
    })
  });
  router.get('/logout', function (req, res, next) {
    delete req.session.email;
    delete req.session.name;
    res.redirect('/');
});
router.post('/addBooks',function(req,res,next){
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    
    //set colection name
    var collection = db.get('books');
    console.log(req.body);
    upload(req,res,function(err)
    {
        var Category = req.body.category;
        var Title = req.body.title;
        var Author = req.body.author;
        var Isbn = req.body.isbn;
        var Publisher=req.body.publisher;
        var Booknum=req.body.booknum;
        var Edition=req.body.edition;

        if(err)
        {
            res.render('admin/books', { title: 'Admin' ,req:req,categoryList:docs,msg:err});
        }
        else
        {
           // console.log(req.file.filename);
            collection.insert({
                "category":Category,
                "title":Title,
                "author":Author,
                "isbn":Isbn,
                "publisher":Publisher,
                "booknum":Booknum,
                "edition":Edition,
                'cover':req.file.filename
            },
            function(err,doc){
                if (err) {
                    // If it failed, return error
                    //res.send("There was a problem adding the information to the database.");
                    res.render('admin/books', { title: 'Admin','error':'Something wrong!try again',req:req });
                }
                else {
                    // And forward to success page
                    req.flash('success', 'Books added successfully!');
                    res.redirect('../admin/books_show');
                   
                }   
            });

            //res.send('Uploaded');
        }
    });
});
module.exports = router;