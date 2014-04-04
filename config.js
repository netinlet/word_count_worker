module.exports = {
  name: process.env.WORKER_NAME || 'word_count_worker_dev',
  dingbot: {
    url: process.env.DINGBOT_URL || 'http://dingbot.example.com'
  },
  web: {
    port: process.env.PORT || 3000
  },
  cloudq: {
    url:  process.env.CLOUDQ_URL || 'http://foo:bar@localhost:8000'
  },
  word_count_db: {
    url: process.env.WORD_COUNT_DB || 'http://localhost:5984',
    db: 'word_count',
    design: 'din',
    view: 'lexi'
  }
};
