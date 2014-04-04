var request = require('superagent');

/*
 * Simple Word counter
 */

module.exports = function() {

  function countWords(text) {
    return text.split(" ").length;
  };

  return {
    count: function(text) {
      return countWords(text);
    },

   countFromUrl: function(url, callback) {
      request.get(url, function(err, resp) {
        callback(null, countWords(resp.text));
      });
    }
  }
};
