((win) ->
  'use strict'
  defaults = require('defaults')
  fd = require('flashdetect')
  $win = win
  $doc = $win.document
  $nav = $win.navigator
  $scr = $win.screen
  $loc = $win.location

  # https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  # use google analytic for basis of all url parameters so we do not start from scratch
  # it is also useful later for any kind of google analytic data aggregation
  $df = 
    sr: "#{$scr.width}x#{$scr.height}"
    vp: "#{$scr.availWidth}x#{$scr.availHeight}"
    sd: $scr.colorDepth
    je: if $nav.javaEnabled then (if $nav.javaEnabled() then 1 else 0) else 0
    ul: if $nav.languages then $nav.languages[0] else ($nav.language or $nav.userLanguage or $nav.browserLanguage) 

  ###*
  # webanalyser
  ###
  class webanalyser
    get: ->
      if (!$df.z?)
        rst = 
          dr: $doc.referrer
          dh: $loc.hostname
          z: new Date().getTime()
          
        if fd.installed
          rst.fl = "#{fd.major} #{fd.minor} #{fd.revisionStr}"

        $df = defaults(rst, $df)

      $df.dl = $loc.href
      $df.dt = $doc.title
      return $df

    windowSize: ->
      rst = { w: 0, h: 0 }
      if typeof $win.innerWidth is 'number'
        # Non-IE
        rst.w = $win.innerWidth
        rst.h = $win.innerHeight
      else if $doc.documentElement and ($doc.documentElement.clientWidth or $doc.documentElement.clientHeight)
        # IE 6+ in 'standards compliant mode'
        rst.w = $doc.documentElement.clientWidth
        rst.h = $doc.documentElement.clientHeight
      else if $doc.body and ($doc.body.clientWidth or $doc.body.clientHeight)
        # IE 4 compatible
        rst.w = $doc.body.clientWidth
        rst.h = $doc.body.clientHeight
      return rst

  result = new webanalyser()

  module.exports = result

) window