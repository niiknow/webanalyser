webanalyser = require('../src/index.coffee')
assert = require('component-assert')
initTime = (new Date).getTime()

describe 'webanalyser.get', ->
  it 'should return defaults', ->
    df = webanalyser.get()
    # make sure default.referral is not empty
    df.dr = 'local'
    for k, v of df
      assert v, "#{k} should not be null or empty"

    assert df.z > initTime, 'z should be higher than init time'
    assert.equal df.dt, 'webanalyser', 'dt should be document title webanalyser'

describe 'webanalyser.windowSize', ->
  it 'should return valid width and height', ->
    ws = webanalyser.windowSize()
    assert ws.w > 1, 'valid width'
    assert ws.h > 1, 'valid height'
