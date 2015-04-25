
var webanalyser = require('../lib')
  , assert = require('component-assert');

var initTime = new Date().getTime();

describe('webanalyser.getResult', function(){
  it('should return defaults', function(){
    var df = webanalyser.getResult();
    assert(df.z > initTime, "z should be higher than init time");
    assert.equal(df.dt, "webanalyser", "dt should be document title webanalyser");
  })
})