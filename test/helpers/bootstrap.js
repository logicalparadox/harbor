var chai = global.chai = require('chai')
  , chaiSpies = require('chai-spies');

chai.use(chaiSpies);

global.Should = chai.Should();
global.harbor = require('../..');
