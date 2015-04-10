(function umd(require){
  if ('object' == typeof exports) {
    module.exports = require('1');
  } else if ('function' == typeof define && define.amd) {
    define(function(){ return require('1'); });
  } else {
    this['webanalyser'] = require('1');
  }
})((function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function() {
  (function(document, navigator, screen, location) {
    'use strict';
    var $endTime, $onLoadHandlers, $startTime, $timeoutId, canonical, canonicalPath, canonicalUrl, domevent, result, url, webanalyser;
    canonical = require('canonical');
    url = require('url');
    domevent = require('domevent');
    $startTime = new Date().getTime();
    $endTime = new Date().getTime();
    $timeoutId = null;
    $onLoadHandlers = [];

    /**
     * Return the canonical path for the page.
    #
     * @return {String}
     */
    canonicalPath = function() {
      var canon, parsed;
      canon = canonical();
      if (!canon) {
        return location.pathname;
      }
      parsed = url.parse(canon);
      return parsed.pathname;
    };

    /**
     * Return the canonical URL for the page concat the given `search`
     * and strip the hash.
    #
     * @param {String} search
     * @return {String}
     */
    canonicalUrl = function(search) {
      var canon, i;
      canon = canonical();
      if (canon) {
        if (~canon.indexOf('?')) {
          return canon;
        } else {
          return canon + search;
        }
      }
      url = location.href;
      i = url.indexOf('#');
      if (-1 === i) {
        return url;
      } else {
        return url.slice(0, i);
      }
    };
    webanalyser = (function() {
      function webanalyser() {}

      webanalyser.prototype.getResult = function() {
        var rst;
        rst = {
          sr: screen.width + "x" + screen.height,
          vp: screen.availWidth + "x" + screen.availHeight,
          sd: screen.colorDepth,
          je: navigator.javaEnabled ? navigator.javaEnabled() : false,
          ul: navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage || navigator.browserLanguage,
          ds: "web",
          dr: document.referrer,
          dl: canonicalUrl(location.search),
          dh: location.hostname,
          dp: canonicalPath(),
          dt: document.title,
          z: new Date().getTime(),
          clt: $endTime - $startTime
        };
        return rst;
      };

      webanalyser.prototype.isReady = false;

      webanalyser.prototype.ready = function(f) {
        if (this.isReady) {
          return f();
        } else {
          return domevent.ready(f);
        }
      };

      return webanalyser;

    })();
    result = new webanalyser();
    domevent.ready(function() {
      $endTime = new Date().getTime();
      return result.isReady = true;
    });
    return module.exports = result;
  })(document, navigator, screen, location);

}).call(this);

}, {"canonical":2,"url":3,"domevent":4}],
2: [function(require, module, exports) {
module.exports = function canonical () {
  var tags = document.getElementsByTagName('link');
  for (var i = 0, tag; tag = tags[i]; i++) {
    if ('canonical' == tag.getAttribute('rel')) return tag.getAttribute('href');
  }
};
}, {}],
3: [function(require, module, exports) {

/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(url){
  var a = document.createElement('a');
  a.href = url;
  return {
    href: a.href,
    host: a.host || location.host,
    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
    hash: a.hash,
    hostname: a.hostname || location.hostname,
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1)
  };
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
  return 0 == url.indexOf('//') || !!~url.indexOf('://');
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
  return !exports.isAbsolute(url);
};

/**
 * Check if `url` is cross domain.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isCrossDomain = function(url){
  url = exports.parse(url);
  var location = exports.parse(window.location.href);
  return url.hostname !== location.hostname
    || url.port !== location.port
    || url.protocol !== location.protocol;
};

/**
 * Return default port for `protocol`.
 *
 * @param  {String} protocol
 * @return {String}
 * @api private
 */
function port (protocol){
  switch (protocol) {
    case 'http:':
      return 80;
    case 'https:':
      return 443;
    default:
      return location.port;
  }
}

}, {}],
4: [function(require, module, exports) {
myObj = null
mydefine = function(h, F){
	myObj = F().$;
};
// minified.js config start -- use this comment to re-create a configuration in the Builder
// - Only sections always, each, error, ie6compatibility, 
// - ie7compatibility, ie8compatibility, ie9compatibility, off, on, onclick, parsejson, 
// - promise, ready, request, tojson, trigger, values, wait.


mydefine("minified",function(){function A(a){return a!=h?""+a:""}function B(a){return"string"==typeof a}function D(a){return a}function r(a,b,c){return A(a).replace(b,c!=h?c:"")}function E(a,b,c){for(var d in a)a.hasOwnProperty(d)&&b.call(c||a,d,a[d]);return a}function p(a,b,c){if(a)for(var d=0;d<a.length;d++)b.call(c||a,a[d],d);return a}function M(a,b){var c=[],d=l(b)?b:function(a){return b!=a};p(a,function(b,f){d.call(a,b,f)&&c.push(b)});return c}function t(a,b,c){var d=[];a(b,function(a,f){x(a=c.call(b,
a,f))?p(a,function(a){d.push(a)}):a!=h&&d.push(a)});return d}function F(a,b){var c=[];p(a,function(d,e){c.push(b.call(a,d,e))});return c}function K(a,b){var c=b||{},d;for(d in a)c[d]=a[d]}function L(a,b,c){if(l(a))return a.apply(c&&b,F(c||b,D))}function N(a){F(a,function(a){return L(a,void 0,void 0)})}function O(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}function l(a){return"function"==typeof a&&!a.item}function x(a){return a&&a.length!=h&&!B(a)&&!(a&&a.nodeType)&&!l(a)&&a!==u}
function P(a,b){for(var c=0;a&&c<a.length;c++)a[c]===b&&a.splice(c--,1)}function G(a){return a.Nia=a.Nia||++U}function Q(a,b){var c=[],d={},e;m(a,function(a){m(b(a),function(a){d[e=G(a)]||(c.push(a),d[e]=!0)})});return c}function V(a,b,c,d,e,f){return function(g,k){var v,q=g||u.event,R=!f,n=k||q.target||q.srcElement;if(f)for(;n&&n!=b&&!(R=f(n));)n=n.parentNode;R&&(v=(!a.apply(y(f?n:b),c||[q,d])||""==e)&&"|"!=e)&&!k&&(q.preventDefault&&(q.preventDefault(),q.stopPropagation()),q.cancelBubble=!0);return!v}}
function W(a,b){m(b,function(a){a.element.detachEvent("on"+a.a,a.b)})}function S(a){z?z.push(a):setTimeout(a,0)}function y(a,b,c){return l(a)?S(a):new H(w(a,b,c))}function w(a,b,c){function d(a){a=t(m,a,function n(a){return x(a)?t(m,a,n):a});return f?M(a,function(a){for(;a=a.parentNode;)if(a==f||c)return a==f}):a}function e(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var f,g,k,v;if(b&&1!=(b=w(b)).length)return Q(b,function(b){return w(a,b,c)});f=b&&
b[0];if(!B(a))return d(a);if(f&&1!=(f&&f.nodeType))return[];if(1<(b=a.split(/\s*,\s*/)).length)return Q(b,function(a){return w(a,f,c)});if(b=/(\S+)\s+(.+)$/.exec(a))return w(b[2],w(b[1],f),c);if(a!=(b=r(a,/^#/)))return d(document.getElementById(b));g=(b=/([\w-]*)\.?([\w-]*)/.exec(a))[1];v=b[2];b=(k=document.getElementsByClassName&&v)?(f||document).getElementsByClassName(v):(f||document).getElementsByTagName(g||"*");if(g=k?g:v)b=M(b,e(g,k?"tagName":"className"));return c?d(b):b}function X(a,b){function c(a,
b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var d={},e=d;if(l(a))return a;if("number"==typeof a)return function(b,c){return c==a};if(!a||"*"==a||B(a)&&(e=/^([\w-]*)\.?([\w-]*)$/.exec(a))){var f=c(e[1],"tagName"),g=c(e[2],"className");return function(a){return 1==(a&&a.nodeType)&&f(a)&&g(a)}}if(b)return function(c){return y(a,b).find(c)!=h};y(a).each(function(a){d[G(a)]=!0});return function(a){return d[G(a)]}}function m(a,b){x(a)?p(a,b):a!=h&&b(a,0);return a}
function I(){function a(a,d){b==h&&a!=h&&(b=a,g=x(d)?d:[d],setTimeout(function(){p(c,function(a){a()})},0));return b}var b,c=[],d=arguments,e=d.length,f=0,g=[];p(d,function q(c,b){try{c.then?c.then(function(c){var d;(c&&"object"==typeof c||l(c))&&l(d=c.then)?q(d,b):(g[b]=F(arguments,D),++f==e&&a(!0,2>e?g[b]:g))},function(c){g[b]=F(arguments,D);a(!1,2>e?g[b]:[g[b][0],g,b])}):c(function(){a(!0,arguments)},function(){a(!1,arguments)})}catch(d){a(!1,[d,g,b])}});a.stop=function(){p(d,function(a){a.stop&&
a.stop()});return L(a.stop0)};var k=a.then=function(d,e){function f(){try{var a=b?d:e;l(a)?function Y(a){try{var c,b=0;if((a&&"object"==typeof a||l(a))&&l(c=a.then)){if(a===k)throw new TypeError;c.call(a,function(a){b++||Y(a)},function(a){b++||k(!1,[a])});k.stop0=a.stop}else k(!0,[a])}catch(d){b++||k(!1,[d])}}(L(a,Z,g)):k(b,g)}catch(c){k(!1,[c])}}var k=I();k.stop0=a.stop;b!=h?setTimeout(f,0):c.push(f);return k};a.always=function(a){return k(a,a)};a.error=function(a){return k(0,a)};return a}function H(a,
b){var c=0;if(a)for(var d=0,e=a.length;d<e;d++){var f=a[d];if(b&&x(f))for(var g=0,k=f.length;g<k;g++)this[c++]=f[g];else this[c++]=f}else this[c++]=b;this.length=c;this._=!0}var u=this,U=1,C={},z=/^[ic]/.test(document.readyState)?h:[],J=!!document.all&&!document.addEventListener,h=null,Z;K({each:function(a){return function(b,c,d){return a(this,b,c,d)}}(p),f:0,values:function(a){var b=a||{};this.each(function(a){var d=a.name||a.id,e=A(a.value);if(/form/i.test(a.tagName))for(d=0;d<a.elements.length;d++)y(a.elements[d]).values(b);
else!d||/ox|io/i.test(a.type)&&!a.checked||(b[d]=b[d]==h?e:t(m,[b[d],e],D))});return b},on:function(a,b,c,d,e){return l(b)?this.on(h,a,b,c,e):B(d)?this.on(a,b,c,h,d):this.each(function(f,g){m(a?w(a,f):f,function(a){m(A(b).split(/\s/),function(b){var f=r(b,/[?|]/),h=!!e&&("blur"==f||"focus"==f),n=V(c,a,d,g,r(b,/[^?|]/g),e&&X(e,a));b={element:a,b:n,a:f,c:h};(c.M=c.M||[]).push(b);J?(a.attachEvent("on"+b.a+(h?"in":""),n),f=G(a),(C[f]=C[f]||[]).push(b)):(a.addEventListener(f,n,h),(a.M=a.M||[]).push(b))})})})},
onClick:function(a,b,c,d){return l(b)?this.on(a,"click",b,c,d):this.onClick(h,a,b,c)},trigger:function(a,b){return this.each(function(c){for(var d,e=c;e&&!d;)m(J?C[e.Nia]:e.M,function(e){e.a==a&&(d=d||!e.b(b,c))}),e=e.parentNode})},e:0},H.prototype);K({request:function(a,b,c,d){d=d||{};var e,f=0,g=I(),k=c&&c.constructor==d.constructor;try{g.xhr=e=u.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Msxml2.XMLHTTP.3.0"),g.stop0=function(){e.abort()},k&&(c=t(E,c,function(a,b){return t(m,b,function(b){return encodeURIComponent(a)+
(b!=h?"="+encodeURIComponent(b):"")})}).join("&")),c==h||/post/i.test(a)||(b+="?"+c,c=h),e.open(a,b,!0,d.user,d.pass),k&&/post/i.test(a)&&e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),E(d.headers,function(a,b){e.setRequestHeader(a,b)}),E(d.xhr,function(a,b){e[a]=b}),e.onreadystatechange=function(){4!=e.readyState||f++||(200==e.status?g(!0,[e.responseText,e]):g(!1,[e.status,e.responseText,e]))},e.send(c)}catch(l){f||g(!1,[0,h,A(l)])}return g},toJSON:function b(c){return c==
h?""+c:B(c=c.valueOf())?'"'+r(c,/[\\\"\x00-\x1f\u2028\u2029]/g,O)+'"':x(c)?"["+t(m,c,b).join()+"]":c&&"object"==typeof c?"{"+t(E,c,function(c,e){return b(c)+":"+b(e)}).join()+"}":A(c)},parseJSON:u.JSON?u.JSON.parse:function(b){b=r(b,/[\x00\xad\u0600-\uffff]/g,O);if(/^[[\],:{}\s]*$/.test(r(r(b,/\\["\\\/bfnrtu]/g),/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g)))return eval("("+b+")")},ready:S,off:function(b){m(b.M,function(b){J?(b.element.detachEvent("on"+b.a+(b.c?"in":""),b.b),P(C[b.element.Nia],b)):
(b.element.removeEventListener(b.a,b.b,b.c),P(b.element.M,b))});b.M=h},wait:function(b,c){var d=I(),e=setTimeout(function(){d(!0,c)},b);d.stop0=function(){d(!1);clearTimeout(e)};return d}},y);K({each:p,toObject:function(b,c){var d={};p(b,function(b){d[b]=c});return d},d:0,promise:I},function(){return new H(arguments,!0)});if(J){var T=function(){N(z);z=h};document.attachEvent("onreadystatechange",function(){/^[ic]/.test(document.readyState)&&T()});u.attachEvent("onload",T)}else document.addEventListener("DOMContentLoaded",
function(){N(z);z=h},!1);u.g=function(){m(C,W)};return{$:y,M:H,getter:{},setter:{}}});

module.exports = myObj;
}, {}]}, {}, {"1":""})
);