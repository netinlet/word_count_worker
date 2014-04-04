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
    store: function(data, callback) {
      console.log('in store');
      db.insert({url: data.url, word_count: data.word_count}, uuid.v1(), function(err, body){
        callback(null, body);
      });
    }
  }
}
