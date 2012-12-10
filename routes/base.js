var mongo = require('mongodb');
  
exports.index = function(req, res){
  var collection,
    render = function (posts, next) {
      res.render('index', {
        posts: posts
      });
    },
    find = function (count, next) {
      var cursor = collection.find({})
        .limit(50)
        .sort({_id:-1});
      
      cursor.toArray(function (error, posts) {
        if (error) {
          console.warn(error);
        }
        render(posts);
      });
    },
    db = req.app.get("db");
    
  collection = new mongo.Collection(db, 'test_collection');
  collection.count(function (error, count) {
    find(count);
  });
};

exports.ioIndex = function (socket) {
  var db = socket.app.get("db"),
    io = socket.io;
  
  socket.on('post', function (postText) {
    var post = {
        text: postText
      };
    
    collection = new mongo.Collection(db, 'test_collection'),
    collection.insert( post, function (err, newPosts) {
      newPosts.forEach(function (newPost) {
        io.sockets.emit("post", newPost);
      });
    });
    
  });
}