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

   countFromUrl: function(data, callback) {
      request.get(data.url, function(err, resp) {
        console.log('in countFromUrl');
        var wc = countWords(resp.text);
        callback(null, {url: data.url, word_count: wc});
      });
    }
  }
};
