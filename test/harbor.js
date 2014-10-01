var http = require('http');

describe('harbor', function () {
  var serv = http.createServer();

  before(function (done) {
    serv.listen(4200, done);
  });

  after(function (done) {
    serv.on('close', done);
    serv.close();
  });

  describe('when ports available', function () {
    var finder = Harbor(4200, 4205)

    beforeEach(function () {
      finder.removeAllListeners();
    });

    it('can find a port', function (done) {
      var claim = chai.spy(function (name, port) {
        name.should.equal('http');
        port.should.equal(4201);
      });

      var full = chai.spy();

      finder.on('claim', claim);
      finder.on('full', full);

      finder.claim('http', function (err, port) {
        Should.not.exist(err);
        port.should.equal(4201);
        finder.ports.should.have.property('http', 4201);
        finder.claimed.should.include(4201);
        claim.should.have.been.called.once;
        full.should.have.not.been.called();
        done();
      });
    });

    it('can release a port', function () {
      var release = chai.spy(function (name, port) {
        name.should.equal('http');
        port.should.equal(4201);
      });

      finder.on('release', release);
      finder.release('http');

      release.should.have.been.called.once;
      finder.claimed.should.not.include(4201);
      finder.ports.should.not.have.property('http');
    });

    it('can claim a specific port', function (done) {
      var claim = chai.spy(function (name, port) {
        name.should.equal('http');
        port.should.equal(4300);
      });

      var full = chai.spy();

      finder.on('claim', claim);
      finder.on('full', full);

      finder.claim('http', 4300, function (err, port) {
        Should.not.exist(err);
        port.should.equal(4300);
        finder.ports.should.have.property('http', 4300);
        finder.claimed.should.include(4300);
        claim.should.have.been.called.once;
        full.should.have.not.been.called();
        done();
      });
    });
  });

  describe('when port not available', function () {
    var finder = Harbor(4200, 4200);

    beforeEach(function () {
      finder.removeAllListeners();
    });

    it('will emit `full` and return error', function (done) {
      var claim = chai.spy()
        , full = chai.spy();

      finder.on('claim', claim);
      finder.on('full', full);

      finder.claim('http', function (err, port) {
        Should.exist(err);
        Should.not.exist(port);
        err.message.should.equal('No ports available in range.');
        claim.should.have.not.been.called();
        full.should.have.been.called.once;
        done();
      });
    });

  });

});
