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
app.use(passport.initialize()); //
app.use(passport.session()); //
app.use(flash());

data = configDB.getData(); //this loads the placeholder data

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./config/passport')(passport); // pass passport for configuration


// /////////////////////////////////////////////

          // app.post('/index', function(req, res){
          //   console.log('body params: ', req.body);

          //   var username = req.body['username'];
          //   var email = req.body['email'];
          //   var password = req.body['password'];
          //   var postSubject = req.body['pSubject'];
          //   var postBody = req.body['pBody'];

          //   if ( validSignup(username, password, email)) {
          //     req.session.username = username;
          //     data.loggedIn = true;
          //     data.u = username;
          //   //add new post 
          //     if (postSubject) {
          //       data.posts.push( {
          //         name: req.session.username,
          //         subj: postSubject,
          //         time: new Date(),
          //         desc: postSubject,
          //         imageSmall: "/img/common/tilo-avatar.png",
          //         body: postBody
          //       })
          //     }
          //     res.render('index', data);

          //   } else {
          //     res.render('signup', {failedLogin: true, posts: data.posts});
          //   }
          // });



// ==================================
// Handlebars Helpers
// =====================
hbs.registerHelper('greaterThan', function(v1, v2, options) {
  if(v1.length > v2) {
    return options.fn(this);
  }
  return false;
});


var port = (process.env.PORT || 8080);
app.listen(port,function() {console.log('listening on port ' + port)});

