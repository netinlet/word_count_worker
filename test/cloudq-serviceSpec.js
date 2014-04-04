var expect = require('expect.js'),
  sinon = require('sinon'),
  nock = require('nock');

describe('CloudQ Service', function() {

  var cloudqService = require('../lib/cloudq-service');

  var noop = function() {};

  it('Should throw an error if not all required config parameters are set', function() {
    expect(cloudqService).to.throwError();

    expect(function() { cloudqService({ url: 'foo' }) }).to.throwError();

    expect(function() { cloudqService({ url: 'foo', name: 'bar' }) }).to.throwError();

    expect(function() { cloudqService({ url: 'foo', name: 'bar' }, 'not a function') }).to.throwError();

    expect(function() { cloudqService({}, noop) }).to.throwError();
  });

  it('Should create the monitor if all required config parameters are set and there is a callback', function() {

    var monitorInstance = cloudqService({url: 'http://test.dev', name: 'myWorker'}, noop);
    expect(monitorInstance).to.be.ok();

  });

  describe('Checking Queue', function() {

    var logSpy,
      callbackSpy,
      service;

    beforeEach(function() {
      logSpy = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      callbackSpy = sinon.stub();
      service = cloudqService({ url: 'http://test.dev', name: 'sample-worker', log: logSpy}, callbackSpy);
    });


    it('should log message if non successful response received', function(done) {

      nock('http://test.dev')
        .get('/sample-worker')
        .reply(500);

      service.pollQueue(function() {
        expect(logSpy.info.calledTwice).to.be(true);
        expect(callbackSpy.called).to.be(false);
        done();
      });

    });

    it('should log message if empty status received', function(done) {

      nock('http://test.dev')
        .get('/sample-worker')
        .reply(200, { status: 'empty' });

      service.pollQueue(function() {
        expect(logSpy.info.calledThrice).to.be(true);
        expect(callbackSpy.called).to.be(false);
        done();
      });

    });

    it('should log message if no id received', function(done) {

      var cloudq = nock('http://test.dev')
        .get('/sample-worker')
        .reply(200, { });

      service.pollQueue(function() {
        expect(logSpy.info.calledThrice).to.be(true);
        expect(callbackSpy.called).to.be(false);
        expect(cloudq.isDone()).to.be.ok();
        done();
      });

    });

    it('should call worker function if a good response is received', function(done) {

      var body = { id: '123', args: [{ foo: 'bar' }] };
      var cloudq = nock('http://test.dev')
        .get('/sample-worker')
          .reply(200, body)
        .delete('/sample-worker/' + body.id)
          .reply(200);

      callbackSpy.yields();

      service.pollQueue(function() {
        expect(logSpy.info.callCount).to.be(5);
        expect(callbackSpy.calledWith(body.args, sinon.match.func)).to.be(true);
        expect(cloudq.isDone()).to.be.ok();
        done();
      });

    });

  });

});
