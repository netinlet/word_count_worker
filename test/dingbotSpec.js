var expect = require('expect.js'),
  sinon = require('sinon'),
  nock = require('nock');

describe('Dingbot', function() {

  var dingbot = require('../lib/dingbot');

  it('Should throw error if not all required config parameters are set', function() {
    expect(dingbot).to.throwError();
    expect(function() { dingbot({}) }).to.throwError();
    expect(function() { dingbot({name: 'foo'}) }).to.throwError();
    expect(function() { dingbot({url: 'http://foo.dev'}) }).to.throwError();
    expect(function() { dingbot({interval: 1000}) }).to.throwError();
  });

  it('Should create the agent if all required config parameters are set', function() {
    var instance = dingbot({ name: 'foo', url: 'http://dingbot.dev', interval: 2000});

    expect(instance).to.be.ok();
    expect(instance.start).to.be.ok();
    expect(instance.stop).to.be.ok();
  });

  describe('Running check', function() {

    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('Should run dingbot check once per interval', function() {

      var config = {
        name: 'foo',
        url: 'http://dingbot.dev',
        interval: 1000
      };

      var server = nock(config.url)
        .post('/' + config.name)
          .times(2)
          .reply(200);

      var instance = dingbot(config);

      instance.start();

      clock.tick(config.interval);

      clock.tick(config.interval);

      instance.stop();

      clock.tick(config.interval);

      //Not the best test because does not confirm it was called twice.
      expect(server.isDone()).to.be.ok();


    });


  });

});