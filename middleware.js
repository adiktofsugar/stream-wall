var fs = require('fs'),
    utils = require('./node_modules/express/node_modules/connect').utils;

exports.rawRender = function (req, res, next) {
    var render = res.render;
    res.render = function (view, options, fn) {
      
      var options = options || {};
      
      // support callback function as second arg
      if ('function' == typeof options) {
        fn = options, options = {};
      }
      
      options = utils.merge({
          rawRender: function (path) {
            var str = fs.readFileSync(path);
            return str;
          }
        }, options);
      
      render.call(res, view, options, fn);
    };
    next();
  };
