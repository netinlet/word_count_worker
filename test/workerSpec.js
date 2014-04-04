var expect = require('expect.js'),
    nock = require('nock');

describe('Word Count Worker', function() {

  var log = {
    info: function(input) {
      console.log(input);
    },
    error: function(input) {
      console.log(input);
    }
  };

  var config = {
    log: log,
    wcDb: {
      url: 'http://localhost:5984',
      db: 'word_count'
    },
  };
  var worker = require('../lib/worker')(config);

  it('Should throw error if no arguments supplied', function() {
    expect(worker).to.throwError();
  });

  it('Should process all steps', function(done) {
    var sentence = "How much wood could a wood chuck chuck?";
    var words_endpoint = nock('http://example.com')
      .get('/words.txt')
      .reply(200, sentence, {'Content-Type': 'text/plain'});

    var args = [
      "http://example.com/words.txt"
    ];

    worker(args, function(err, result) {
      expect(err).not.to.be.ok();
      expect(result.id).to.be.ok();
      done();
    });
  });

});
