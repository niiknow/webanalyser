((document, navigator, screen, location) ->
  'use strict'
  defaults = require('defaults')
  domevent = require('domevent')
  FlasthDetect = require('FlasthDetect')

  $startTime = new Date().getTime()
  $endTime = new Date().getTime()
  $timeoutId = null
  $onLoadHandlers = []

  # https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  # use google analytic for basis of all url parameters so we do not start from scratch
  # it is also useful later for any kind of google analytic data aggregation
  $defaults = 
    sr: "#{screen.width}x#{screen.height}"
    vp: "#{screen.availWidth}x#{screen.availHeight}"
    sd: screen.colorDepth
    je: if navigator.javaEnabled then navigator.javaEnabled() else false
    ul: if navigator.languages then navigator.languages[0] else (navigator.language or navigator.userLanguage or navigator.browserLanguage) 

  ###*
  # webanalyser
  ###
  class webanalyser
    getResult: ->
      return $defaults
    isReady: false
    ready: (f) ->
      if (@isReady)
        f()
      else
        domevent.ready f

  result = new webanalyser()

  # document ready
  domevent.ready ->
    result.isReady = true
    $endTime = new Date().getTime()
    rst = 
      dr: document.referrer
      dl: location.href
      dh: location.hostname
      dp: location.pathname
      dt: document.title
      z: new Date().getTime()
      clt: $endTime - $startTime
    fd = new FlasthDetect()
    if fd.installed
      rst.fl = "#{fd.major} #{fd.minor} r#{fd.revision}"

    $defaults = defaults(rst, $defaults)

  module.exports = result

) document, navigator, screen, location