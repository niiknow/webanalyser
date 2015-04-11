((document, navigator, screen, location) ->
  'use strict'
  
  url = require('url')
  domevent = require('domevent')
  FlasthDetect = require('FlasthDetect')

  $startTime = new Date().getTime()
  $endTime = new Date().getTime()
  $timeoutId = null
  $onLoadHandlers = []
  fd = new FlasthDetect()

  ###*
  # webanalyser
  ###
  class webanalyser
    getResult: ->
      # https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
      # use google analytic for basis of all url parameters so we do not start from scratch
      # it is also useful later for any kind of google analytic data aggregation
      rst = 
        sr: "#{screen.width}x#{screen.height}"
        vp: "#{screen.availWidth}x#{screen.availHeight}"
        sd: screen.colorDepth
        je: if navigator.javaEnabled then navigator.javaEnabled() else false
        ul: if navigator.languages then navigator.languages[0] else (navigator.language or navigator.userLanguage or navigator.browserLanguage) 

        ds: "web"
        dr: document.referrer

        dl: location.href
        dh: location.hostname
        dp: location.pathname
        dt: document.title
        z: new Date().getTime()
        clt: $endTime - $startTime

      if fd.installed
        rst.fl = "#{fd.major} #{fd.minor} r#{fd.revision}"
      return rst
    isReady: false
    ready: (f) ->
      if (@isReady)
        f()
      else
        domevent.ready f

  result = new webanalyser()

  # document ready
  domevent.ready ->
    $endTime = new Date().getTime()
    result.isReady = true

  module.exports = result

) document, navigator, screen, location