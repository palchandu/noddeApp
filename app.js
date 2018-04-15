var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

//database connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/lbs');

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
var index = require('./routes/index');
var users = require('./routes/users');
var books = require('./routes/books');
var contact = require('./routes/contact');
var admin = require('./routes/admin');
var store = require('store');
var app = express();


/**Flash Message */
var flash = require('express-flash');
/**Session set */
var session = require('express-session');

var ajax=require('express-ajax');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});
app.use(cookieParser('keyboardt'));
app.use(session({ 
  secret: 'keyboardt',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 }
}));

  app.use(ajax);

app.use('/', index);
app.use('/users', users);
app.use('/books', books);
app.use('/contact', contact);
app.use('/admin', admin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
