var expect = require('expect.js'),
wordCounter = require('../lib/word_count')(),
nock = require('nock');

describe('Word Count', function() {

  var sentence = "How much wood could a wood chuck chuck?";

  var paragraph = ["How much do you think? ",
    "As much wood as a wood chuck could chuck if a wood chuck ",
    "could chuck wood"].join("\n");

    var wcUrl = 'http://somewhere.example.com';

    it('can correctly count a sentence', function() {
      expect(wordCounter.count(sentence)).to.be.equal(8);
    });

    it('can correctly count a multiline paragraph', function() {
      expect(wordCounter.count(paragraph)).to.be.equal(21);
    });

    it('can count from a url', function(done) {
      var words_endpoint = nock(wcUrl)
      .get('/words.txt')
      .reply(200, paragraph, {'Content-Type': 'text/plain'});


      wordCounter.countFromUrl({url: wcUrl + '/words.txt'}, function(err, result) {
        expect(result.url).to.be.equal(wcUrl + '/words.txt');
        expect(result.word_count).to.be.equal(21);
        done();
      });


    });
});
