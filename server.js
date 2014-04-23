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


var data = { posts: [ {
    name: "Tito Mitra",
    subj: "Hello from Toronto",
    time: new Date(),
    desc: "Hey, I just wanted to check in with you from Toronto. I got here earlier today.",
    imageSmall: "'/img/common/tilo-avatar.png'",
    body: "Hey, I just wanted to check in with you from Toronto. I got here earlier today. The bagels are fresh and the coffee is stale."
  },
  {
    name: "Jack",
    subj: "hey what's up?",
    time: new Date(),
    desc: "I wanna know how to do this thing. Do you know how to do it?",
    imageSmall: "'/img/tilo-avatar.png'",
    body: "I wanna know how to do this thing. Do you know how to do it? It involved NODE JS and a Handlebar Mustache and a Cadillac and an Oldsmobile."
  },
  {
    name: "Jill",
    subj: "Is anybody reading this?",
    time: new Date(),
    desc: "I was wondering what is my view count and what type of layout to use?",
    imageSmall: "'/img/tilo-avatar.png'",
    body: "I was wondering what is my view count and what type of layout to use? And how many posts to make in the automatic post generator machine."
  }]
};

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
    // console.log('logged in as '+ req.session.username);
    data.username = req.session.username;
    console.log("username is: " + data.username);
  }
  next();
}

app.use( checkLoggedIn );


app.get('/set_session', function(req, res) {
  req.session.username = req.query.username;
  res.send("Session was set");
});

app.get('/see_session', function(req, res) {
  res.send("session.username: " + req.session.username);
});

app.get('/', function(req, res){
  data.loggedInUsername = req.session.username;
  res.render('index', data);
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
    data.loggedIn = true;
    data.u = username;
    req.render('index', data);
  } else {
    res.render('signup', {failedLogin: true});
  }

});

app.get('/newpost', function(req, res){
//check if logged in
  res.render('newpost', data);
});

app.post('/signup', function(req, res){
  console.log('body params: ', req.body);

  var username = req.body['username'];
  var email = req.body['email'];
  var password = req.body['password'];

  if ( validSignup(username, password, email)) {
    req.session.username = username;
    res.render('index', {loggedIn: true, u: username, posts: data.posts});
  } else {
    res.render('signup', {failedLogin: true, posts: data.posts});
  }
});

app.post('/index', function(req, res){
  console.log('body params: ', req.body);

  var username = req.body['username'];
  var email = req.body['email'];
  var password = req.body['password'];
  var postSubject = req.body['pSubject'];
  var postBody = req.body['pBody'];

  if ( validSignup(username, password, email)) {
    req.session.username = username;
    data.loggedIn = true;
    data.u = username;
  //add new post 
    if (postSubject) {
      data.posts.push( {
        name: req.session.username,
        subj: postSubject,
        time: new Date(),
        desc: postSubject,
        imageSmall: "'/img/common/tilo-avatar.png'",
        body: postBody
      })
    }
    res.render('index', data);

  } else {
    res.render('signup', {failedLogin: true, posts: data.posts});
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

app.listen(8000,function() {console.log('listening!')});

