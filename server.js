var Logger = require('bunyan'),
  log = new Logger({ name: 'word_count_worker'}),
  config = require('./config');

var ONE_MINUTE = 1000 * 60;

config.log = log;

var dingbot = require('./lib/dingbot')({
    url: config.dingbot.url,
    name: config.name,
    interval: ONE_MINUTE,
    log: log
  });

var healthServer = require('./lib/health')({
  log: log
}).listen(config.web.port);

var worker = require('./lib/worker')(config);

var cloudqService = require('./lib/cloudq-service')({
  url: config.cloudq.url,
  name: 'word_count_worker',
  log: log
}, worker);

var cloudqAgent = require('./lib/cloudq-agent')(cloudqService, config);

log.info('Starting');

dingbot.start();

cloudqAgent.start();

