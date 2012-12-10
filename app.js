
/**
 * Module dependencies.
 */

var mongo = require('mongodb'),
  server = new mongo.Server('127.0.0.1', 27017, {}),
  _db = new mongo.Db('test', server, {});
  
  _db.open(function (error, db) {
    if (error) {
      throw error;
    }
    
    
  var express = require('express'),
    base = require('./routes/base'),
    user = require('./routes/user'),
    middleware = require('./middleware'),
    http = require('http'),
    path = require('path'),
    expressLayouts = require("express-ejs-layouts"),
    io = require('socket.io');
    
  var app = express();
  
  app.configure(function(){
    app.use(function (req, res, next) {
      res.locals.title = "Stream Wall";
      next();
    });
    
    app.set('db', db);
    
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    
    app.use(expressLayouts);
    // Also, I want a renderRaw function in my locals, so I can output the
    // actual contents of a file.
    app.use(middleware.rawRender)
    
    
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/media', express.static(path.join(__dirname, 'media')));
    
  });
  
  app.configure('development', function(){
    app.use(express.errorHandler());
  });
  
  app.get('/', base.index);
  app.get('/users', user.list);

  
  var server = http.createServer(app)
    .listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
  
  io = io.listen(server);
  /**
   * Now for the socket part.
   */
  io.sockets.on('connection', function (socket) {
    // This is when the socket is connected to, by client.
    // Now I want to emit when mongo creates something.
    io.sockets.emit('news', 'Connected');
    
    socket.app = app;
    socket.io = io;
    
    base.ioIndex(socket);
  });

});