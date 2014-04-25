var data = { posts: [ {
      name: "Tito Mitra",
      subj: "Hello from Toronto",
      time: new Date(),
      desc: "Hey, I just wanted to check in with you from Toronto. I got here earlier today.",
      imageSmall: "public/img/common/tilo-avatar.png",
      body: "Hey, I just wanted to check in with you from Toronto. I got here earlier today. The bagels are fresh and the coffee is stale."
    },
    {
      name: "Jack",
      subj: "hey what's up?",
      time: new Date(),
      desc: "I wanna know how to do this thing. Do you know how to do it?",
      imageSmall: "public/img/common/tilo-avatar.png",
      body: "I wanna know how to do this thing. Do you know how to do it? It involved NODE JS and a Handlebar Mustache and a Cadillac and an Oldsmobile."
    },
    {
      name: "Jill",
      subj: "Is anybody reading this?",
      time: new Date(),
      desc: "I was wondering what is my view count and what type of layout to use?",
      imageSmall: "public/img/common/tilo-avatar.png",
      body: "I was wondering what is my view count and what type of layout to use? And how many posts to make in the automatic post generator machine."
    }]
  };

module.exports = {
  getData: function() {
    return data;
  },
  'url' : 'mongodb://jason:letmein@ds035498.mongolab.com:35498/chaosforum' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
}
