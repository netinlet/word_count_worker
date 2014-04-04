var request = require('superagent');

module.exports = function(config, runWorker) {

  var url = config.url,
    name = config.name,
    log = config.log;

  if (!url) {
    throw new Error('Must supply url!');
  }

  if (!name) {
    throw new Error('Must supply name!');
  }

  if (!runWorker || !(typeof runWorker == 'function')) {
    throw new Error ('Must supply callback function');
  }

  var cloudqUrl = url + '/' + name;


  function isJobResponseValid(response) {
    if (!response) {
      return false;
    }

    if (response.statusCode !== 200) {
      if (log) { log.info('Unsuccessful response for %s status: %s', cloudqUrl, response.statusCode); }
      return false;
    }  else {
      if (log) { log.info({body: response.body}, 'Received response for %s', cloudqUrl); }
      if (response.body.status === 'empty') {
        if (log) { log.info('Queue empty for %s', cloudqUrl); }
        return false;
      }
      if (!response.body.id) {
        if (log) { log.info('No job id in response for %s', cloudqUrl); }
        return false;
      }
      return true;
    }
  }

  function pollQueue(done) {
    if (log) { log.info('Checking queue %s', cloudqUrl); }

    request.get(cloudqUrl)
      .end(function(error, response) {
        if (error) {
          if (log) { log.error(error, 'Error when checking queue'); }
          done('Error checking with queue');
        } else if(!isJobResponseValid(response)) {
          done("Message cannot be processed");
        } else {
          var jobUrl = cloudqUrl + '/' + response.body.id;
          if (log) { log.info({body: response.body}, 'Processing job: %s', jobUrl); }
          runWorker(response.body.args, deleteJob(jobUrl, done));
        }
      });
  }

  function deleteJob(jobUrl, done) {
    return function(err) {

      if (err) {
        if (log) { log.error(err, 'Error processing: %s', jobUrl); }
      } else {
        if (log) { log.info('Finished processing: %s', jobUrl); }
      }
      request.del(jobUrl)
        .end(function(error, response) {
          if (error) {
            if (log) {log.error({error: error}, 'Error deleting job: %s', jobUrl); }
          } else {
            if (log) { log.info('Deleted job: %s', jobUrl); }
          }
          done();
      });
    }
  }

  return {
    pollQueue: pollQueue
  };

};