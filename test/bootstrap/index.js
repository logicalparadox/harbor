var chai = global.chai = require('chai');
var chaiSpies = require('chai-spies');

chai.use(chaiSpies);

global.Should = chai.Should();
global.Harbor = require('../..');
