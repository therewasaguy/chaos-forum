var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var bodyParser = require('body-parser')
var xhbs = require('hbs');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var logger = require('morgan');
var configDB = require('./config/database.js');


//configuration =======
mongoose.connect(configDB.url); //connect to the DB from database.js file

hbs = xhbs.create();
app.use("/public", express.static('public'));
hbs.defaultLayout = "layout";

app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('view options', { layout: '../layouts/main'}); //set the default layout

logger({ format: 'dev', immediate: true });
app.use( logger() ); // log every request to the console
app.use( bodyParser() );
app.use( cookieParser() ); //has to come before the session
app.use( expressSession( {secret: 'kljkasl'}) ); 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

data = configDB.getData(); //this loads the placeholder data

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./config/passport')(passport); // pass passport for configuration

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


/////////////////////////////////////////////
//might delete this stuffs:
          app.get('/set_session', function(req, res) {
            req.session.username = req.query.username;
            res.send("Session was set");
          });

          app.get('/see_session', function(req, res) {
            res.send("session.username: " + req.session.username);
          });
/////////////////////

          // app.post('/login', function(req, res){
          //   console.log('body params: ', req.body);

          //   var username = req.body['username'];
          //   var password = req.body['password'];

          //   if ( passwordIsValid(username, password)) {
          //     req.session.username = username;
          //     res.render('index', {loggedIn: true, u: username});
          //   } else {
          //     res.render('login', {failedLogin: true});
          //   }
          // });

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

          // app.post('/signup', function(req, res){
          //   console.log('body params: ', req.body);

          //   var username = req.body['username'];
          //   var email = req.body['email'];
          //   var password = req.body['password'];

          //   if ( validSignup(username, password, email)) {
          //     req.session.username = username;
          //     res.render('index', {loggedIn: true, u: username, posts: data.posts});
          //   } else {
          //     res.render('signup', {failedLogin: true, posts: data.posts});
          //   }
          // });

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
                  imageSmall: "/img/common/tilo-avatar.png",
                  body: postBody
                })
              }
              res.render('index', data);

            } else {
              res.render('signup', {failedLogin: true, posts: data.posts});
            }
          });
/////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>might delete

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

// ==================================
// Handlebars Helpers
// =====================
hbs.registerHelper('greaterThan', function(v1, v2) {
  if(v1 > v2) {
    return true;
  }
  return false;
});

var port = (process.env.PORT || 8080);
app.listen(port,function() {console.log('listening on port ' + port)});

