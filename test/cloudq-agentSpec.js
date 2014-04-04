var expect = require('expect.js'),
  sinon = require('sinon');

describe('CloudQ Agent', function(){

  var agent = require('../lib/cloudq-agent.js');

  it('Should throw error if service is not present or does not contain pollQueue method', function() {

    expect(agent).to.throwError();
    expect(function() { agent({}); } ).to.throwError();

  });

  it('Should create agent with start and stop methods', function() {
    var instance = agent({ pollQueue: function() {} });

    expect(instance.start).to.be.ok();
    expect(instance.stop).to.be.ok();

  });

  describe('Polling Queue', function() {

    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('Should run service pollQueue method when started', function() {

      var SUCCESS_INTERVAL = 1;

      var service = {
          pollQueue: sinon.stub().yields()
        },
        instance = agent(service, { cloudq: { success_interval: SUCCESS_INTERVAL } });

      instance.start();

      expect(service.pollQueue.called).to.be(false);

      clock.tick(SUCCESS_INTERVAL);

      expect(service.pollQueue.called).to.be(true);

      expect(service.pollQueue.calledTwice).to.be(false);

      clock.tick(SUCCESS_INTERVAL);

      expect(service.pollQueue.calledTwice).to.be(true);

      instance.stop();

      expect(service.pollQueue.calledThrice).to.be(false);

      clock.tick(1);

      expect(service.pollQueue.calledThrice).to.be(false);

    });

  });



});