module.exports = function(app, passport) {

  // ============================
  // HOME PAGE (with login links)
  // ============================
  app.get('/home', function(req, res) {
    res.render('index');
  });

  app.get('/', function(req, res){
    // data.loggedInUsername = req.session.username;
    res.render('index', data);
  });


  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', {message: req.flash('loginMessage')}); 
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('signupMessage') });
  });


  app.get('/newpost', isLoggedIn, function(req, res){
  //check if logged in
    res.render('newpost', data);
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true, // allow Flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));


  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log("user profile page!");
    data.user = req.user;
    res.render('profile', data);
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    data.user = null;
    res.redirect('/');
  });
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

