var async = require('async');

var noop = function() {};

module.exports = function(service, config) {

  if (!service || !service.pollQueue) {
    throw new Error('Service must be supplied and contain a pollQueue method');
  }

  config = config || { cloudq: {} };

  var log = config.log,
    SUCCESS_INTERVAL = config.cloudq.success_interval || 1000,
    FAILED_INTERVAL = config.cloudq.failed_interval || 1000 * 90,
    interval = SUCCESS_INTERVAL;

  var running,
    timeoutId;

  function delay(fn) {
    return function(whilstCallback) {

      function throttleCallback(err) {
        if (err) {
          if (log) { log.info({err: err}, 'Setting to delayed interval of %s', FAILED_INTERVAL); }
          interval = FAILED_INTERVAL;
        } else {
          interval = SUCCESS_INTERVAL;
        }
        whilstCallback();
      }

      timeoutId = setTimeout(function() { fn(throttleCallback); }, interval);
    }
  }

  return {
    start: function(stoppedCallback) {
      stoppedCallback = stoppedCallback || noop;
      if (running) { return; }
      running = true;
      async.whilst(function() { return running; }, delay(service.pollQueue), stoppedCallback);
    },
    stop: function() {
      running = false;
      clearTimeout(timeoutId);
    }
  };

};