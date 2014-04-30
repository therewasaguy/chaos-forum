module.exports = function(app, passport) {
  
  var Blog = require('../app/models/post');


  // ============================
  // HOME PAGE (with login links)
  // ============================

  app.use(getBlogCount);
  app.use(getAllPosts);

  app.get('/home', function(req, res) {
    res.render('index');
  });

  function getBlogCount(req, res, next){
    Blog.count(function(err, count){
      res.locals.blogCount = count;
      
      next();
    }); 
  }

  function getAllPosts(req, res, next){
    Blog.find(function (err, allPosts) {
      if (err) return console.error(err);
      res.locals.blogs = allPosts;
      console.log(res.locals.blogs);
      next();
    });
  }

  app.get('/allPosts', function(req, res) {
    Blog.find(function (err, allPosts) {
      if (err) return console.error(err);
      res.locals.blogs = allPosts;
      console.log(res.locals.blogs);
      res.send("Blogs: " + res.locals.blogs);
      });
  });


  app.get('/', function(req, res){
    var dataToSend = data;
    if (data.redirect) {
          dataToSend.message = 'must be logged in to do that';
          data.redirect = false;
    }
    else {
      data.message = 0;
      data.redirect = false;
    }
    res.render('index', dataToSend);
  });

  app.get('/users', function(req, res) {
//    data.users = [{name:'jason'}, {name:'jimmy'}, {name:'john'}, {name:'yo'}];
    res.render('users', data);
  });

  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    var dataToSend = data;
    dataToSend.message = req.flash('loginMessage');
    res.render('login', data); 
  });

  app.get('/new_account_duplicate', function(req, res) {
    var dataToSend = data;
    dataToSend.message = req.flash('signupMessage');

    // render the page and pass in any flash data if it exists
    res.render('login', dataToSend); 
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    var dataToSend = data;
    dataToSend.message = req.flash('signupMessage');

    // render the page and pass in any flash data if it exists
    res.render('login', dataToSend);
  });


  app.get('/newpost', isLoggedIn, function(req, res){
  //check if logged in
    res.render('newpost', data);
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/new_account_duplicate',
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


  // =====================================
  // NEW POST ============================
  // =====================================
  app.post('/newpost', function(req, res){
    // create the post
    var newBlog = new Blog();
    newBlog.username = req.body['username'];
    newBlog.subject = req.body['pSubject'];
    newBlog.time = new Date();
    newBlog.body = req.body['pBody'];
    newBlog.image = "public/img/common/tilo-avatar.png";

    // save the post
    newBlog.save(function(err) {
      if (err) {
        throw err;
      }
      else {

        res.redirect('/');

//        Blog.updateBlogs();  //update blog count is index page's responsibility

        //render the index page with the new blog and a message saying "nice one!"
//        res.render('index', data);

//        return done(null, newBlog);

      }
    });


  });



};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    data.message = 0;
    return next();
  }

  // if they aren't redirect them to the home page with error message "must be logged in to do that"
  data.redirect = true;
  res.redirect('/'); //, { message: req.flash('must be logged in to do that') });
}

