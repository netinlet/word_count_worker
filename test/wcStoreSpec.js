var expect = require('expect.js'),
nock = require('nock');

describe('wcStore service', function() {


  var config = {
    wcDb: {
      url: 'http://foo:bar@localhost:5984',
      db: 'word_count'
    }
  }
  var nano = require('nano')(config.wcDb.url);
  var wcStore = require('../lib/wcStore')(config);

  beforeEach(function(done) {
    nano.db.create(config.wcDb.db, function(err, result) {
      if (!err) {
        console.log('Created Database');
      }
      done();
    });
  });

  //afterEach(function(done) {
    //nano.db.destroy(config.wcDb.db, function(err, result) {
      //if (!err) {
        //console.log('Destroyed Database');
      //}
      //done();
    //});
  //});

  it('can store the url and wordcount', function(done) {
    wcStore.store('http://some.url', 87, function(err, result) {
      expect(result).not.to.be(undefined);
      expect(result.id).to.be.ok();
      expect(result.rev).to.be.ok();
      expect(result.ok).to.be.ok();
      done();
    });
  });
});


