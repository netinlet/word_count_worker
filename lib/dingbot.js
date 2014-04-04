/**
 * Dingbot agent
 *
 * Use to ping Dingbot at a particular interval
 *
 * Must supply:
 *  - url: Dingbot url
 *  - name: to send to Dingbot
 *  - interval: how often to send ping in ms
 *  - (opt) log: log object to use to log results.
 *
 * Example:
 * var dingbot = require('./dingbot')({ url: 'http://dingbot.example.com', name: 'test-worker', interval: 60000, log: log });
 * dingbot.start();
 *
 * If you want to stop it:
 * dingbot.stop();
 */
var request = require('superagent');

module.exports = function(config) {
  var url = config.url,
    name = config.name,
    interval = config.interval,
    log = config.log;

  if (!url) {
    throw new Error('Must supply Dingbot url!');
  }

  if (!name) {
    throw new Error('Must supply worker name to send to Dingbot!');
  }

  if (!interval) {
    throw new Error('Must supply interval!');
  }

  var dingbotUrl = url + '/' + name;

  function checkin() {
    request.post(dingbotUrl).end(function() {
      if (log) { log.info('Dingbot checkin at ' + dingbotUrl); }
    });
  }

  var intervalId;

  return {
    start: function() {
      if (log) { log.info('Starting Dingbot!'); }
      intervalId = setInterval(checkin, interval);
    },
    stop: function() {
      if (intervalId) {
        if (log) { log.info('Stopping Dingbot!'); }
        clearInterval(intervalId);
      }
    }
  };

};

