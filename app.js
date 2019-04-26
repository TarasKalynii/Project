const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var session = require('express-session')
const fileUpload = require('express-fileupload');


app.use(fileUpload());


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

function checkingSession(req, res, next) {
  if (req.session.user_id == '5caf69ce12f07b103145f3a0') {
    res.redirect('/adminpage');
  }else {
    if (req.session.user_id) {
      next();
    }
    else {
      res.redirect('/login');
    }
  }
}

function checkingSessionAdmin(req, res, next) {
  if (req.session.user_id == '5caf69ce12f07b103145f3a0') {
    next();
  }
  else {
    res.redirect('/login');
  }
}


//express-session
app.use(session({
  secret: 'keyboard cat'
}));

//routers

const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const singerRouter = require('./routes/singer');


const User = require('./models/user');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connect to mongodb maybe");
});


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/singer', singerRouter);



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// index page
app.get('/index', checkingSession, function(req, res) {
    res.render('index');
});
// registration page
app.get('/registration', function(req, res) {
    res.render('registration');
});
// collaboration page
app.get('/collaboration', function(req, res) {
    res.render('collaboration');
});
// login page
app.get('/login', function(req, res) {
    req.session.destroy(function(err) {
    });
    res.render('login');
});
// profile page
app.get('/profile',checkingSession, function(req, res) {
    res.render('profile');
});
// admin page
app.get('/adminpage', checkingSessionAdmin, function(req, res) {
    res.render('adminpage');
});
// singer page
app.get('/singerpage', function(req, res) {
    res.render('singer');
});








app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
