var expect = require('expect.js'),
  request = require('supertest');

describe('Health', function() {

  var healthServer = require('../lib/health');

  it('Should return a server with a listen method', function() {

    var server = healthServer();
    expect(server).to.be.ok();
    expect(server.listen).to.be.ok();

  });

  it('Should create a server that response with 200', function(done) {

    var server = healthServer();

    request(server)
      .get('/health')
      .expect(200, done);

  });

});