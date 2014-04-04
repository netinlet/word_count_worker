var request = require('superagent'),
    nano = require('nano')
    uuid = require('node-uuid');

/*
 * simple couch persistence
 */

module.exports = function(config) {

  var log = config.log
  var db = nano(config.wcDb.url).use(config.wcDb.db)

  return {
    store: function(url, word_count, callback) {
      db.insert({url: url, word_count: word_count}, uuid.v1(), function(err, body){
        callback(err, body);
      });
    }
  }
}
