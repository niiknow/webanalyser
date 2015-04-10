((document, navigator, screen, location) ->
  'use strict'
  
  canonical = require('canonical')
  url = require('url')
  each = require('each')

  $startTime = new Date().getTime()
  $endTime = new Date().getTime()
  $timeoutId = null
  $onLoadHandlers = []

  ###*
  # Return the canonical path for the page.
  #
  # @return {String}
  ###

  canonicalPath = ->
    canon = canonical()
    if !canon
      return location.pathname
    parsed = url.parse(canon)
    parsed.pathname

  ###*
  # Return the canonical URL for the page concat the given `search`
  # and strip the hash.
  #
  # @param {String} search
  # @return {String}
  ###

  canonicalUrl = (search) ->
    canon = canonical()
    if canon
      return if ~canon.indexOf('?') then canon else canon + search
    url = location.href
    i = url.indexOf('#')
    if -1 == i then url else url.slice(0, i)



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

        dl: canonicalUrl(location.search)
        dh: location.hostname
        dp: canonicalPath()
        dt: document.title
        z: new Date().getTime()
        clt: $endTime - $startTime

      #if fd.installed
        #rst.fl = "#{fd.major} #{fd.minor} r#{fd.revision}"
      return rst
    isReady: false
    ready: (f) ->
      if (@isReady)
        f()
      else
        $onLoadHandlers.push(f)

  result = new webanalyser()
    
  onComplete = ->
    $endTime = new Date().getTime()
    result.isReady = true
    each($onLoadHandlers, (f, i) ->
      f()
    )
    return

  onLoadDetect = ->
    if document.readyState == 'complete'
      onComplete()
      return

    if $timeoutId then clearTimeout($timeoutId)

    return $timeoutId = setTimeout(onLoadDetect, 11)

  onLoadDetect()

  module.exports = result

) document, navigator, screen, location