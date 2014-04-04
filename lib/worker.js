var async = require('async');

module.exports = function(config) {

  var config = config || {},
    log = config.log,
    wordCount = require('./word_count')(),
    wcStore = require('./wcStore')(config);

  return function(args, cb) {

    if (!args) {
      throw new Error('Must supply arguments');
    }

    var inputURL = args[0];

    if (!inputURL) {
      throw new Error('Args does not contain an array with one element.');
    }

    if (log) { log.info('Running worker'); }

    async.series([
      function(callback) {
        wordCount.countFromUrl(inputURL, function(err, result){
          log.info('In CB 1 countFromUrl');
          callback(null, {url: inputURL, word_count: result});
        });
      },
      function(err, callback) {
        log.info("wcData: " + wcData);
        wcStore.store(wcData.url, wcData.word_count, function(err, result) {
          log.info('In CB 2 store');
          log.info('RESULT: ' + result);
          callback(null, result);
        });
      }
    ],
    function(err, result) {
      if (err) {
        cb(err);
      } else {
        if (log) { log.info('Completed'); }
        cb(null, result);
      }
    });

  }

};
