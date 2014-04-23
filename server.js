var express = require('express');

var app = express();
var bodyParser = require('body-parser')
var xhbs = require('hbs');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongodb = require('mongodb');
// var uri = 'ds053688.mongolab.com:53688/users';

var tempdb = require('./data/posts.js');
// console.log(tempdb.posts[0].name);



hbs = xhbs.create();
app.use("/public", express.static('public'));
hbs.defaultLayout = "layout";

console.log(hbs.defaultLayout);

app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('view options', { layout: '../layouts/main'}); //set the default layout


app.use( bodyParser() );
app.use( cookieParser() ); //has to come before the session
app.use( expressSession( {secret: 'kljkasl'}) ); //secret has to be some string


function checkLoggedIn(req, res, next) { //next is a function that allows us to do something to req/res then move on to the next piece of middleware.
  console.log('hello checkin it OUT !');
  if (req.session.username) {
    res.locals.loggedInUsername = req.session.username;
    console.log('logged in as '+ req.session.username);
  }
  next();
}

app.use( checkLoggedIn );


//
app.get('/set_session', function(req, res) {
  req.session.username = req.query.username;
  res.send("Session was set");
});

app.get('/see_session', function(req, res) {
  res.send("session.username: " + req.session.username);
});

app.get('/', function(req, res){
  var data = {};
  data.loggedInUsername = req.session.username;
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  console.log('body params: ', req.body);

  var username = req.body['username'];
  var password = req.body['password'];

  if ( passwordIsValid(username, password)) {
    req.session.username = username;
    res.render('index', {loggedIn: true, u: username});
  } else {
    res.render('login', {failedLogin: true});
  }
});

app.get('/signup', function(req, res){
  if ( passwordIsValid(username, password)) {
    req.session.username = username;
    req.render('index', {loggedIn: true, u: username});
  } else {
    res.render('signup', {failedLogin: true});
  }

});

app.post('/signup', function(req, res){
  console.log('body params: ', req.body);

  var username = req.body['username'];
  var email = req.body['email'];
  var password = req.body['password'];

  if ( validSignup(username, password, email)) {
    req.session.username = username;
    res.render('index', {loggedIn: true, u: username});
  } else {
    res.render('signup', {failedLogin: true});
  }
});

function validSignup(u, p, e) {
  //will add validator to ensure that u p and e are new / valid
  return true;
}

function passwordIsValid(user, pass) {
  return true;
  // if (user === 'itpclass' && pass === 'letmein') {
  //   return true;
  // } else {
  //   return false;
  // }
}

//app.get(*) --> catchall

app.listen(8000,function() {console.log('listening!')});


