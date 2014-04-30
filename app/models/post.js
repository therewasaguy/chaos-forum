// post.js schema

name: "Tito Mitra",
      subj: "Hello from Toronto",
      time: new Date(),
      desc: "Hey, I just wanted to check in with you from Toronto. I got here earlier today.",
      imageSmall: "public/img/common/tilo-avatar.png",
      body:

var postSchema = mongoose.Schema({

  username    : String,
  subject     : String,
  time        : Date,
  desc        : String,
  imageSmall  : String,
  body        : String,
  user        : {

  },
  peviousPosts  : Array,
}


});
