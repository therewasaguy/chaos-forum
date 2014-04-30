// post.js schema

// load the things we need
var mongoose = require('mongoose');

// name: "Tito Mitra",
//       subj: "Hello from Toronto",
//       time: new Date(),
//       desc: "Hey, I just wanted to check in with you from Toronto. I got here earlier today.",
//       imageSmall: "public/img/common/tilo-avatar.png",
//       body:

var postSchema = mongoose.Schema({

    username    : String,
    subject     : String,
    time        : Date,
    body        : String,
    image       : String

});

// methods ================
postSchema.methods.updateBlogs = function() {
  this.find(function (err, allPosts) {
    if (err) return console.error(err);
    data.blogs = allPosts;
    console.log(allPosts);
  });
  //query database to get the post count
  this.count({}, function (err, count){
    console.log("number of posts: ", count);
    data.blogCount = count;
  });  
}

//create the model for users and expose it to our own app
module.exports = mongoose.model('Blog', postSchema);


