/**
 *
 */

var http = require('http');

module.exports = function(config) {

  var config = config || {},
    log = config.log;

  var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify({ ok: true}));

    if (log) {
      log.info("%s %s status: %s", req.method, req.url, res.statusCode);
    }
  });

  return server;

};