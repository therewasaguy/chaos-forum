// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');


// populate the userNames and userCount
function updateUsers() {
  User.find(function (err, allUsers) {
    if (err) return console.error(err);
    data.users = allUsers;
    console.log("loaded users");
  });
  //query database to get the user count, which is asynchronous, set it on callback
  User.count({}, function( err, count){
      console.log( "Number of users:", count );
      data.userCount = count;
  });
}
updateUsers();


// expose this function to the app using module.exports
module.exports = function(passport) {

  // passport session setup requires for persistent login sessions.
  // passport needs ability to serialize and unserialize users out of session

  // serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // ==================
  // LOCAL SIGNUP
  // ==================

  passport.use('local-signup', new LocalStrategy({
    //uses username and password by default, override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows to pass the entire req to the callback
  },
  function(req, email, password, done) {

    // async so that User.findOne wont fire unless data is sent back
    // process.next tick defers the execution of an action till the next pass around the event loop
    process.nextTick(function() {

      //log the image name
      // find a user whose email is the same as the forms email, if the user exists
      User.findOne({ 'local.email' : email }, function(err, user) {
        // if there are any errors, return the errors
        if (err)
            return done(err);

        // check to see if there is already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email already exists'));
        } else {

          // if user does not exist, creat the user
          var newUser = new User();

            // ==============================================
            // TO DO: upload the image  here
            console.log("the image is: " + req.body['image']);
            console.log(req.files);
            cloudinary.uploader.upload(
              req.files.file.path,
              function(result) {
                console.log(result);
                var imageUrl = result.url;
              },
              {
                public_id: 'sample_id',
                crop: 'limit',
                
              }
              )


          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            else {
              updateUsers();  //update user count
              return done(null, newUser);
            }
          });
        }

      });

    });

  }));

  // ==================
  // LOCAL LOGIN
  // ==================

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) { // callback with email and pw

    // find a user whose email is the same as the form's
    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err)
        return done(err)

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password'));

      //otherwise, let em in!
      return done(null, user);
    });

  }));

};
