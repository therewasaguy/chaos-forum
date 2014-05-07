module.exports = function(app, passport) {
  
  var Blog = require('../app/models/post');

  // =====================================
  // LOADING POSTS =======================
  // =====================================

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
      next();
    });
  }


  // ============================
  // HOME PAGE (with login links)
  // ============================

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



  // app.get('/allPosts', function(req, res) {
  //   Blog.find(function (err, allPosts) {
  //     if (err) return console.error(err);
  //     res.locals.blogs = allPosts;
  //      console.log("loaded posts");
  //     res.send("Blogs: " + res.locals.blogs);
  //     });
  // });
  // =====================================
  // EDITING POSTS =======================
  // =====================================

  app.get('/editpost', isLoggedIn, function(req, res) {
    var dataToSend = data;
    // dataToSend.currentPost = req.body['currentPost'];
    console.log('post ID: ' + req.query['postID']);
    postID = req.query['postID'];

    // load the post info from the database and render it in the callback
    Blog.findOne({_id: postID}, function (err, thePost) {
      if (err) return console.error(err);
      dataToSend.thePost = thePost;
      res.render('editpost', dataToSend);
      console.log(thePost);
    });
  });

  app.post('/editpost', isLoggedIn, function(req, res) {
    newSubject = req.body['newSubject'];
    newBody = req.body['newBody'];
    newUsername = req.body['newUsername'];
    postID = req.body['postID'];
    console.log('id: ' + postID + 'new post ' + newSubject + ",  " + newBody + " by " + newUsername);

    // update the post in the database
    Blog.findOne({_id: postID}, function (err, thePost) {
      if (err) return console.error(err);
      if (!thePost.versions) {
        thePost.versions = [];
      }
      thePost.versions.push({
        user : newUsername,
        body : newBody,
        subject : newSubject,
        time : new Date()
      });
      thePost.save();
      console.log("length of the post versions: " + thePost.versions.length + "and the first version is " + thePost.versions[0]);
      res.redirect('/');
    });

    // Blog.update({_id: postID}, {$push: 
    //   {versions: {
    //     user : newUsername,
    //     body : newBody,
    //     subject : newSubject,
    //     time : new Date()
    //   }}}, function(err) {
    //     if(err) {
    //       console.log("error updating: " + err);
    //     } else{
    //       console.log("successfully updated!");
    //     }
    //   });
    // res.redirect('/');
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
//    console.log("user profile page!");
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
    newBlog.owner = req.body['username'];
    newBlog.subject = req.body['pSubject'];
    newBlog.time = new Date();
    newBlog.body = req.body['pBody'];
    newBlog.image = "public/img/common/tilo-avatar.png";
    newBlog.versions.push({
        user : req.body['username'],
        body : req.body['pBody'],
        subject : req.body['pSubject'],
        time : new Date()
      });


    // save the post
    newBlog.save(function(err) {
      if (err) {
        throw err;
      }
      else {

        res.redirect('/');


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

