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


    wordCount.countFromUrl(inputURL, function(err, result) {
      if (err) {
        console.log('error processing wordcount');
      } else {
        wcStore.store(result, function(err, result){
          if (err) {
            console.log('error processing store');
          } else {
            cb(null, result)
          }
        });
      }
    });

    //async.series([
      //wordCount.countFromUrl(inputURL),
      //wcStore.store
    //],
    //function(err, result) {
      //if (err) {
        //cb(err);
      //} else {
        //if (log) { log.info('Completed'); }
        //cb(null, result);
      //}
    //});

  }

};
