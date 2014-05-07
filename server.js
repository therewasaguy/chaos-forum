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

// =====================
// image uploads
// =====================
// var cloudinary = require('cloudinary');

// console.log(cloudinary_api_key);

// cloudinary.config({ 
//   cloud_name: 'sample', 
//   api_key: '435364252876614', 
//   api_secret: '5CIGCMbQyRPLxQoY-G55nwj76Gg' 
// });


// configuration =======
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



// ==================================
// Handlebars Helpers
// =====================
hbs.registerHelper('greaterThan', function(v1, v2, options) {
  if (v1) {
    if(v1.length > v2) {
      return options.fn(this);
    }
  }
  return false;
});

hbs.registerHelper('trimString', function(passedString, maxLength) {
    var theString = passedString;
    if (passedString.length > maxLength)
      theString = passedString.substring(0,maxLength) + "...";
    return new hbs.SafeString(theString)
});

hbs.registerHelper('last', function(array) {
  return array[array.length-1];
});

var port = (process.env.PORT || 8080);
app.listen(port,function() {console.log('listening on port ' + port)});

