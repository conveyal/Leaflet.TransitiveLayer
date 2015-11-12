/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var L = __webpack_require__(1);
	var Transitive = __webpack_require__(2);
	L.TransitiveLayer = __webpack_require__(101);

	// set some Leaflet map configuration properties
	var config = {
	  tileUrl: 'http://{s}.tiles.mapbox.com/v3/conveyal.ie3o67m0/{z}/{x}/{y}.png',
	  initLatLng: new L.LatLng(38.903324, -77.04448), // DC
	  initZoom: 13
	};

	// set up the leaflet map, disabling inertia and zoom animation
	var map = L.map('map', {
	  inertia: false,
	  zoomAnimation: false
	});

	// add the base TileLayer
	map.addLayer(new L.TileLayer(config.tileUrl));

	// create the Transitive instance
	var transitive = new Transitive({
	  data: DATA,
	  useDynamicRendering: true,
	  draggableTypes: ['PLACE']
	});

	// create and add the Transitive layer to the map
	var transitiveLayer = new L.TransitiveLayer(transitive);
	map.addLayer(transitiveLayer);

	// set the initial map view
	map.setView(config.initLatLng, config.initZoom);

	// set up the demo clear/load controls
	document.getElementById("clear").onclick = function (event) {
	  transitive.clearData();
	};

	document.getElementById("load").onclick = function (event) {
	  transitive.updateData(DATA);
	  map.fitBounds(transitiveLayer.getBounds());
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
	 (c) 2010-2013, Vladimir Agafonkin
	 (c) 2010-2011, CloudMade
	*/'use strict';(function(window,document,undefined){var oldL=window.L,L={};L.version = '0.7.7'; // define Leaflet for Node module pattern loaders, including Browserify
	if(typeof module === 'object' && typeof module.exports === 'object'){module.exports = L; // define Leaflet as an AMD module
	}else if(true){!(__WEBPACK_AMD_DEFINE_FACTORY__ = (L), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));} // define Leaflet as a global L variable, saving the original L to restore later if needed
	L.noConflict = function(){window.L = oldL;return this;};window.L = L; /*
	 * L.Util contains various utility functions used throughout Leaflet code.
	 */L.Util = {extend:function extend(dest){ // (Object[, Object, ...]) ->
	var sources=Array.prototype.slice.call(arguments,1),i,j,len,src;for(j = 0,len = sources.length;j < len;j++) {src = sources[j] || {};for(i in src) {if(src.hasOwnProperty(i)){dest[i] = src[i];}}}return dest;},bind:function bind(fn,obj){ // (Function, Object) -> Function
	var args=arguments.length > 2?Array.prototype.slice.call(arguments,2):null;return function(){return fn.apply(obj,args || arguments);};},stamp:(function(){var lastId=0,key='_leaflet_id';return function(obj){obj[key] = obj[key] || ++lastId;return obj[key];};})(),invokeEach:function invokeEach(obj,method,context){var i,args;if(typeof obj === 'object'){args = Array.prototype.slice.call(arguments,3);for(i in obj) {method.apply(context,[i,obj[i]].concat(args));}return true;}return false;},limitExecByInterval:function limitExecByInterval(fn,time,context){var lock,execOnUnlock;return function wrapperFn(){var args=arguments;if(lock){execOnUnlock = true;return;}lock = true;setTimeout(function(){lock = false;if(execOnUnlock){wrapperFn.apply(context,args);execOnUnlock = false;}},time);fn.apply(context,args);};},falseFn:function falseFn(){return false;},formatNum:function formatNum(num,digits){var pow=Math.pow(10,digits || 5);return Math.round(num * pow) / pow;},trim:function trim(str){return str.trim?str.trim():str.replace(/^\s+|\s+$/g,'');},splitWords:function splitWords(str){return L.Util.trim(str).split(/\s+/);},setOptions:function setOptions(obj,options){obj.options = L.extend({},obj.options,options);return obj.options;},getParamString:function getParamString(obj,existingUrl,uppercase){var params=[];for(var i in obj) {params.push(encodeURIComponent(uppercase?i.toUpperCase():i) + '=' + encodeURIComponent(obj[i]));}return (!existingUrl || existingUrl.indexOf('?') === -1?'?':'&') + params.join('&');},template:function template(str,data){return str.replace(/\{ *([\w_]+) *\}/g,function(str,key){var value=data[key];if(value === undefined){throw new Error('No value provided for variable ' + str);}else if(typeof value === 'function'){value = value(data);}return value;});},isArray:Array.isArray || function(obj){return Object.prototype.toString.call(obj) === '[object Array]';},emptyImageUrl:'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='};(function(){ // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	function getPrefixed(name){var i,fn,prefixes=['webkit','moz','o','ms'];for(i = 0;i < prefixes.length && !fn;i++) {fn = window[prefixes[i] + name];}return fn;}var lastTime=0;function timeoutDefer(fn){var time=+new Date(),timeToCall=Math.max(0,16 - (time - lastTime));lastTime = time + timeToCall;return window.setTimeout(fn,timeToCall);}var requestFn=window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;var cancelFn=window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function(id){window.clearTimeout(id);};L.Util.requestAnimFrame = function(fn,context,immediate,element){fn = L.bind(fn,context);if(immediate && requestFn === timeoutDefer){fn();}else {return requestFn.call(window,fn,element);}};L.Util.cancelAnimFrame = function(id){if(id){cancelFn.call(window,id);}};})(); // shortcuts for most used utility functions
	L.extend = L.Util.extend;L.bind = L.Util.bind;L.stamp = L.Util.stamp;L.setOptions = L.Util.setOptions; /*
	 * L.Class powers the OOP facilities of the library.
	 * Thanks to John Resig and Dean Edwards for inspiration!
	 */L.Class = function(){};L.Class.extend = function(props){ // extended class with the new prototype
	var NewClass=function NewClass(){ // call the constructor
	if(this.initialize){this.initialize.apply(this,arguments);} // call all constructor hooks
	if(this._initHooks){this.callInitHooks();}}; // instantiate class without calling constructor
	var F=function F(){};F.prototype = this.prototype;var proto=new F();proto.constructor = NewClass;NewClass.prototype = proto; //inherit parent's statics
	for(var i in this) {if(this.hasOwnProperty(i) && i !== 'prototype'){NewClass[i] = this[i];}} // mix static properties into the class
	if(props.statics){L.extend(NewClass,props.statics);delete props.statics;} // mix includes into the prototype
	if(props.includes){L.Util.extend.apply(null,[proto].concat(props.includes));delete props.includes;} // merge options
	if(props.options && proto.options){props.options = L.extend({},proto.options,props.options);} // mix given properties into the prototype
	L.extend(proto,props);proto._initHooks = [];var parent=this; // jshint camelcase: false
	NewClass.__super__ = parent.prototype; // add method for calling all hooks
	proto.callInitHooks = function(){if(this._initHooksCalled){return;}if(parent.prototype.callInitHooks){parent.prototype.callInitHooks.call(this);}this._initHooksCalled = true;for(var i=0,len=proto._initHooks.length;i < len;i++) {proto._initHooks[i].call(this);}};return NewClass;}; // method for adding properties to prototype
	L.Class.include = function(props){L.extend(this.prototype,props);}; // merge new default options to the Class
	L.Class.mergeOptions = function(options){L.extend(this.prototype.options,options);}; // add a constructor hook
	L.Class.addInitHook = function(fn){ // (Function) || (String, args...)
	var args=Array.prototype.slice.call(arguments,1);var init=typeof fn === 'function'?fn:function(){this[fn].apply(this,args);};this.prototype._initHooks = this.prototype._initHooks || [];this.prototype._initHooks.push(init);}; /*
	 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
	 */var eventsKey='_leaflet_events';L.Mixin = {};L.Mixin.Events = {addEventListener:function addEventListener(types,fn,context){ // (String, Function[, Object]) or (Object[, Object])
	// types can be a map of types/handlers
	if(L.Util.invokeEach(types,this.addEventListener,this,fn,context)){return this;}var events=this[eventsKey] = this[eventsKey] || {},contextId=context && context !== this && L.stamp(context),i,len,event,type,indexKey,indexLenKey,typeIndex; // types can be a string of space-separated words
	types = L.Util.splitWords(types);for(i = 0,len = types.length;i < len;i++) {event = {action:fn,context:context || this};type = types[i];if(contextId){ // store listeners of a particular context in a separate hash (if it has an id)
	// gives a major performance boost when removing thousands of map layers
	indexKey = type + '_idx';indexLenKey = indexKey + '_len';typeIndex = events[indexKey] = events[indexKey] || {};if(!typeIndex[contextId]){typeIndex[contextId] = []; // keep track of the number of keys in the index to quickly check if it's empty
	events[indexLenKey] = (events[indexLenKey] || 0) + 1;}typeIndex[contextId].push(event);}else {events[type] = events[type] || [];events[type].push(event);}}return this;},hasEventListeners:function hasEventListeners(type){ // (String) -> Boolean
	var events=this[eventsKey];return !!events && (type in events && events[type].length > 0 || type + '_idx' in events && events[type + '_idx_len'] > 0);},removeEventListener:function removeEventListener(types,fn,context){ // ([String, Function, Object]) or (Object[, Object])
	if(!this[eventsKey]){return this;}if(!types){return this.clearAllEventListeners();}if(L.Util.invokeEach(types,this.removeEventListener,this,fn,context)){return this;}var events=this[eventsKey],contextId=context && context !== this && L.stamp(context),i,len,type,listeners,j,indexKey,indexLenKey,typeIndex,removed;types = L.Util.splitWords(types);for(i = 0,len = types.length;i < len;i++) {type = types[i];indexKey = type + '_idx';indexLenKey = indexKey + '_len';typeIndex = events[indexKey];if(!fn){ // clear all listeners for a type if function isn't specified
	delete events[type];delete events[indexKey];delete events[indexLenKey];}else {listeners = contextId && typeIndex?typeIndex[contextId]:events[type];if(listeners){for(j = listeners.length - 1;j >= 0;j--) {if(listeners[j].action === fn && (!context || listeners[j].context === context)){removed = listeners.splice(j,1); // set the old action to a no-op, because it is possible
	// that the listener is being iterated over as part of a dispatch
	removed[0].action = L.Util.falseFn;}}if(context && typeIndex && listeners.length === 0){delete typeIndex[contextId];events[indexLenKey]--;}}}}return this;},clearAllEventListeners:function clearAllEventListeners(){delete this[eventsKey];return this;},fireEvent:function fireEvent(type,data){ // (String[, Object])
	if(!this.hasEventListeners(type)){return this;}var event=L.Util.extend({},data,{type:type,target:this});var events=this[eventsKey],listeners,i,len,typeIndex,contextId;if(events[type]){ // make sure adding/removing listeners inside other listeners won't cause infinite loop
	listeners = events[type].slice();for(i = 0,len = listeners.length;i < len;i++) {listeners[i].action.call(listeners[i].context,event);}} // fire event for the context-indexed listeners as well
	typeIndex = events[type + '_idx'];for(contextId in typeIndex) {listeners = typeIndex[contextId].slice();if(listeners){for(i = 0,len = listeners.length;i < len;i++) {listeners[i].action.call(listeners[i].context,event);}}}return this;},addOneTimeEventListener:function addOneTimeEventListener(types,fn,context){if(L.Util.invokeEach(types,this.addOneTimeEventListener,this,fn,context)){return this;}var handler=L.bind(function(){this.removeEventListener(types,fn,context).removeEventListener(types,handler,context);},this);return this.addEventListener(types,fn,context).addEventListener(types,handler,context);}};L.Mixin.Events.on = L.Mixin.Events.addEventListener;L.Mixin.Events.off = L.Mixin.Events.removeEventListener;L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;L.Mixin.Events.fire = L.Mixin.Events.fireEvent; /*
	 * L.Browser handles different browser and feature detections for internal Leaflet use.
	 */(function(){var ie=('ActiveXObject' in window),ielt9=ie && !document.addEventListener, // terrible browser detection to work around Safari / iOS / Android browser bugs
	ua=navigator.userAgent.toLowerCase(),webkit=ua.indexOf('webkit') !== -1,chrome=ua.indexOf('chrome') !== -1,phantomjs=ua.indexOf('phantom') !== -1,android=ua.indexOf('android') !== -1,android23=ua.search('android [23]') !== -1,gecko=ua.indexOf('gecko') !== -1,mobile=typeof orientation !== undefined + '',msPointer=!window.PointerEvent && window.MSPointerEvent,pointer=window.PointerEvent && window.navigator.pointerEnabled || msPointer,retina='devicePixelRatio' in window && window.devicePixelRatio > 1 || 'matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') && window.matchMedia('(min-resolution:144dpi)').matches,doc=document.documentElement,ie3d=ie && 'transition' in doc.style,webkit3d='WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !android23,gecko3d=('MozPerspective' in doc.style),opera3d=('OTransition' in doc.style),any3d=!window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;var touch=!window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);L.Browser = {ie:ie,ielt9:ielt9,webkit:webkit,gecko:gecko && !webkit && !window.opera && !ie,android:android,android23:android23,chrome:chrome,ie3d:ie3d,webkit3d:webkit3d,gecko3d:gecko3d,opera3d:opera3d,any3d:any3d,mobile:mobile,mobileWebkit:mobile && webkit,mobileWebkit3d:mobile && webkit3d,mobileOpera:mobile && window.opera,touch:touch,msPointer:msPointer,pointer:pointer,retina:retina};})(); /*
	 * L.Point represents a point with x and y coordinates.
	 */L.Point = function( /*Number*/x, /*Number*/y, /*Boolean*/round){this.x = round?Math.round(x):x;this.y = round?Math.round(y):y;};L.Point.prototype = {clone:function clone(){return new L.Point(this.x,this.y);}, // non-destructive, returns a new point
	add:function add(point){return this.clone()._add(L.point(point));}, // destructive, used directly for performance in situations where it's safe to modify existing point
	_add:function _add(point){this.x += point.x;this.y += point.y;return this;},subtract:function subtract(point){return this.clone()._subtract(L.point(point));},_subtract:function _subtract(point){this.x -= point.x;this.y -= point.y;return this;},divideBy:function divideBy(num){return this.clone()._divideBy(num);},_divideBy:function _divideBy(num){this.x /= num;this.y /= num;return this;},multiplyBy:function multiplyBy(num){return this.clone()._multiplyBy(num);},_multiplyBy:function _multiplyBy(num){this.x *= num;this.y *= num;return this;},round:function round(){return this.clone()._round();},_round:function _round(){this.x = Math.round(this.x);this.y = Math.round(this.y);return this;},floor:function floor(){return this.clone()._floor();},_floor:function _floor(){this.x = Math.floor(this.x);this.y = Math.floor(this.y);return this;},distanceTo:function distanceTo(point){point = L.point(point);var x=point.x - this.x,y=point.y - this.y;return Math.sqrt(x * x + y * y);},equals:function equals(point){point = L.point(point);return point.x === this.x && point.y === this.y;},contains:function contains(point){point = L.point(point);return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);},toString:function toString(){return 'Point(' + L.Util.formatNum(this.x) + ', ' + L.Util.formatNum(this.y) + ')';}};L.point = function(x,y,round){if(x instanceof L.Point){return x;}if(L.Util.isArray(x)){return new L.Point(x[0],x[1]);}if(x === undefined || x === null){return x;}return new L.Point(x,y,round);}; /*
	 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
	 */L.Bounds = function(a,b){ //(Point, Point) or Point[]
	if(!a){return;}var points=b?[a,b]:a;for(var i=0,len=points.length;i < len;i++) {this.extend(points[i]);}};L.Bounds.prototype = { // extend the bounds to contain the given point
	extend:function extend(point){ // (Point)
	point = L.point(point);if(!this.min && !this.max){this.min = point.clone();this.max = point.clone();}else {this.min.x = Math.min(point.x,this.min.x);this.max.x = Math.max(point.x,this.max.x);this.min.y = Math.min(point.y,this.min.y);this.max.y = Math.max(point.y,this.max.y);}return this;},getCenter:function getCenter(round){ // (Boolean) -> Point
	return new L.Point((this.min.x + this.max.x) / 2,(this.min.y + this.max.y) / 2,round);},getBottomLeft:function getBottomLeft(){ // -> Point
	return new L.Point(this.min.x,this.max.y);},getTopRight:function getTopRight(){ // -> Point
	return new L.Point(this.max.x,this.min.y);},getSize:function getSize(){return this.max.subtract(this.min);},contains:function contains(obj){ // (Bounds) or (Point) -> Boolean
	var min,max;if(typeof obj[0] === 'number' || obj instanceof L.Point){obj = L.point(obj);}else {obj = L.bounds(obj);}if(obj instanceof L.Bounds){min = obj.min;max = obj.max;}else {min = max = obj;}return min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y;},intersects:function intersects(bounds){ // (Bounds) -> Boolean
	bounds = L.bounds(bounds);var min=this.min,max=this.max,min2=bounds.min,max2=bounds.max,xIntersects=max2.x >= min.x && min2.x <= max.x,yIntersects=max2.y >= min.y && min2.y <= max.y;return xIntersects && yIntersects;},isValid:function isValid(){return !!(this.min && this.max);}};L.bounds = function(a,b){ // (Bounds) or (Point, Point) or (Point[])
	if(!a || a instanceof L.Bounds){return a;}return new L.Bounds(a,b);}; /*
	 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
	 */L.Transformation = function(a,b,c,d){this._a = a;this._b = b;this._c = c;this._d = d;};L.Transformation.prototype = {transform:function transform(point,scale){ // (Point, Number) -> Point
	return this._transform(point.clone(),scale);}, // destructive transform (faster)
	_transform:function _transform(point,scale){scale = scale || 1;point.x = scale * (this._a * point.x + this._b);point.y = scale * (this._c * point.y + this._d);return point;},untransform:function untransform(point,scale){scale = scale || 1;return new L.Point((point.x / scale - this._b) / this._a,(point.y / scale - this._d) / this._c);}}; /*
	 * L.DomUtil contains various utility functions for working with DOM.
	 */L.DomUtil = {get:function get(id){return typeof id === 'string'?document.getElementById(id):id;},getStyle:function getStyle(el,style){var value=el.style[style];if(!value && el.currentStyle){value = el.currentStyle[style];}if((!value || value === 'auto') && document.defaultView){var css=document.defaultView.getComputedStyle(el,null);value = css?css[style]:null;}return value === 'auto'?null:value;},getViewportOffset:function getViewportOffset(element){var top=0,left=0,el=element,docBody=document.body,docEl=document.documentElement,pos;do {top += el.offsetTop || 0;left += el.offsetLeft || 0; //add borders
	top += parseInt(L.DomUtil.getStyle(el,'borderTopWidth'),10) || 0;left += parseInt(L.DomUtil.getStyle(el,'borderLeftWidth'),10) || 0;pos = L.DomUtil.getStyle(el,'position');if(el.offsetParent === docBody && pos === 'absolute'){break;}if(pos === 'fixed'){top += docBody.scrollTop || docEl.scrollTop || 0;left += docBody.scrollLeft || docEl.scrollLeft || 0;break;}if(pos === 'relative' && !el.offsetLeft){var width=L.DomUtil.getStyle(el,'width'),maxWidth=L.DomUtil.getStyle(el,'max-width'),r=el.getBoundingClientRect();if(width !== 'none' || maxWidth !== 'none'){left += r.left + el.clientLeft;} //calculate full y offset since we're breaking out of the loop
	top += r.top + (docBody.scrollTop || docEl.scrollTop || 0);break;}el = el.offsetParent;}while(el);el = element;do {if(el === docBody){break;}top -= el.scrollTop || 0;left -= el.scrollLeft || 0;el = el.parentNode;}while(el);return new L.Point(left,top);},documentIsLtr:function documentIsLtr(){if(!L.DomUtil._docIsLtrCached){L.DomUtil._docIsLtrCached = true;L.DomUtil._docIsLtr = L.DomUtil.getStyle(document.body,'direction') === 'ltr';}return L.DomUtil._docIsLtr;},create:function create(tagName,className,container){var el=document.createElement(tagName);el.className = className;if(container){container.appendChild(el);}return el;},hasClass:function hasClass(el,name){if(el.classList !== undefined){return el.classList.contains(name);}var className=L.DomUtil._getClass(el);return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);},addClass:function addClass(el,name){if(el.classList !== undefined){var classes=L.Util.splitWords(name);for(var i=0,len=classes.length;i < len;i++) {el.classList.add(classes[i]);}}else if(!L.DomUtil.hasClass(el,name)){var className=L.DomUtil._getClass(el);L.DomUtil._setClass(el,(className?className + ' ':'') + name);}},removeClass:function removeClass(el,name){if(el.classList !== undefined){el.classList.remove(name);}else {L.DomUtil._setClass(el,L.Util.trim((' ' + L.DomUtil._getClass(el) + ' ').replace(' ' + name + ' ',' ')));}},_setClass:function _setClass(el,name){if(el.className.baseVal === undefined){el.className = name;}else { // in case of SVG element
	el.className.baseVal = name;}},_getClass:function _getClass(el){return el.className.baseVal === undefined?el.className:el.className.baseVal;},setOpacity:function setOpacity(el,value){if('opacity' in el.style){el.style.opacity = value;}else if('filter' in el.style){var filter=false,filterName='DXImageTransform.Microsoft.Alpha'; // filters collection throws an error if we try to retrieve a filter that doesn't exist
	try{filter = el.filters.item(filterName);}catch(e) { // don't set opacity to 1 if we haven't already set an opacity,
	// it isn't needed and breaks transparent pngs.
	if(value === 1){return;}}value = Math.round(value * 100);if(filter){filter.Enabled = value !== 100;filter.Opacity = value;}else {el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';}}},testProp:function testProp(props){var style=document.documentElement.style;for(var i=0;i < props.length;i++) {if(props[i] in style){return props[i];}}return false;},getTranslateString:function getTranslateString(point){ // on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
	// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
	// (same speed either way), Opera 12 doesn't support translate3d
	var is3d=L.Browser.webkit3d,open='translate' + (is3d?'3d':'') + '(',close=(is3d?',0':'') + ')';return open + point.x + 'px,' + point.y + 'px' + close;},getScaleString:function getScaleString(scale,origin){var preTranslateStr=L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),scaleStr=' scale(' + scale + ') ';return preTranslateStr + scaleStr;},setPosition:function setPosition(el,point,disable3D){ // (HTMLElement, Point[, Boolean])
	// jshint camelcase: false
	el._leaflet_pos = point;if(!disable3D && L.Browser.any3d){el.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(point);}else {el.style.left = point.x + 'px';el.style.top = point.y + 'px';}},getPosition:function getPosition(el){ // this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance
	// jshint camelcase: false
	return el._leaflet_pos;}}; // prefix style property names
	L.DomUtil.TRANSFORM = L.DomUtil.testProp(['transform','WebkitTransform','OTransform','MozTransform','msTransform']); // webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser
	L.DomUtil.TRANSITION = L.DomUtil.testProp(['webkitTransition','transition','OTransition','MozTransition','msTransition']);L.DomUtil.TRANSITION_END = L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition'?L.DomUtil.TRANSITION + 'End':'transitionend';(function(){if('onselectstart' in document){L.extend(L.DomUtil,{disableTextSelection:function disableTextSelection(){L.DomEvent.on(window,'selectstart',L.DomEvent.preventDefault);},enableTextSelection:function enableTextSelection(){L.DomEvent.off(window,'selectstart',L.DomEvent.preventDefault);}});}else {var userSelectProperty=L.DomUtil.testProp(['userSelect','WebkitUserSelect','OUserSelect','MozUserSelect','msUserSelect']);L.extend(L.DomUtil,{disableTextSelection:function disableTextSelection(){if(userSelectProperty){var style=document.documentElement.style;this._userSelect = style[userSelectProperty];style[userSelectProperty] = 'none';}},enableTextSelection:function enableTextSelection(){if(userSelectProperty){document.documentElement.style[userSelectProperty] = this._userSelect;delete this._userSelect;}}});}L.extend(L.DomUtil,{disableImageDrag:function disableImageDrag(){L.DomEvent.on(window,'dragstart',L.DomEvent.preventDefault);},enableImageDrag:function enableImageDrag(){L.DomEvent.off(window,'dragstart',L.DomEvent.preventDefault);}});})(); /*
	 * L.LatLng represents a geographical point with latitude and longitude coordinates.
	 */L.LatLng = function(lat,lng,alt){ // (Number, Number, Number)
	lat = parseFloat(lat);lng = parseFloat(lng);if(isNaN(lat) || isNaN(lng)){throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');}this.lat = lat;this.lng = lng;if(alt !== undefined){this.alt = parseFloat(alt);}};L.extend(L.LatLng,{DEG_TO_RAD:Math.PI / 180,RAD_TO_DEG:180 / Math.PI,MAX_MARGIN:1.0E-9 // max margin of error for the "equals" check
	});L.LatLng.prototype = {equals:function equals(obj){ // (LatLng) -> Boolean
	if(!obj){return false;}obj = L.latLng(obj);var margin=Math.max(Math.abs(this.lat - obj.lat),Math.abs(this.lng - obj.lng));return margin <= L.LatLng.MAX_MARGIN;},toString:function toString(precision){ // (Number) -> String
	return 'LatLng(' + L.Util.formatNum(this.lat,precision) + ', ' + L.Util.formatNum(this.lng,precision) + ')';}, // Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
	// TODO move to projection code, LatLng shouldn't know about Earth
	distanceTo:function distanceTo(other){ // (LatLng) -> Number
	other = L.latLng(other);var R=6378137, // earth radius in meters
	d2r=L.LatLng.DEG_TO_RAD,dLat=(other.lat - this.lat) * d2r,dLon=(other.lng - this.lng) * d2r,lat1=this.lat * d2r,lat2=other.lat * d2r,sin1=Math.sin(dLat / 2),sin2=Math.sin(dLon / 2);var a=sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);return R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a));},wrap:function wrap(a,b){ // (Number, Number) -> LatLng
	var lng=this.lng;a = a || -180;b = b || 180;lng = (lng + b) % (b - a) + (lng < a || lng === b?b:a);return new L.LatLng(this.lat,lng);}};L.latLng = function(a,b){ // (LatLng) or ([Number, Number]) or (Number, Number)
	if(a instanceof L.LatLng){return a;}if(L.Util.isArray(a)){if(typeof a[0] === 'number' || typeof a[0] === 'string'){return new L.LatLng(a[0],a[1],a[2]);}else {return null;}}if(a === undefined || a === null){return a;}if(typeof a === 'object' && 'lat' in a){return new L.LatLng(a.lat,'lng' in a?a.lng:a.lon);}if(b === undefined){return null;}return new L.LatLng(a,b);}; /*
	 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
	 */L.LatLngBounds = function(southWest,northEast){ // (LatLng, LatLng) or (LatLng[])
	if(!southWest){return;}var latlngs=northEast?[southWest,northEast]:southWest;for(var i=0,len=latlngs.length;i < len;i++) {this.extend(latlngs[i]);}};L.LatLngBounds.prototype = { // extend the bounds to contain the given point or bounds
	extend:function extend(obj){ // (LatLng) or (LatLngBounds)
	if(!obj){return this;}var latLng=L.latLng(obj);if(latLng !== null){obj = latLng;}else {obj = L.latLngBounds(obj);}if(obj instanceof L.LatLng){if(!this._southWest && !this._northEast){this._southWest = new L.LatLng(obj.lat,obj.lng);this._northEast = new L.LatLng(obj.lat,obj.lng);}else {this._southWest.lat = Math.min(obj.lat,this._southWest.lat);this._southWest.lng = Math.min(obj.lng,this._southWest.lng);this._northEast.lat = Math.max(obj.lat,this._northEast.lat);this._northEast.lng = Math.max(obj.lng,this._northEast.lng);}}else if(obj instanceof L.LatLngBounds){this.extend(obj._southWest);this.extend(obj._northEast);}return this;}, // extend the bounds by a percentage
	pad:function pad(bufferRatio){ // (Number) -> LatLngBounds
	var sw=this._southWest,ne=this._northEast,heightBuffer=Math.abs(sw.lat - ne.lat) * bufferRatio,widthBuffer=Math.abs(sw.lng - ne.lng) * bufferRatio;return new L.LatLngBounds(new L.LatLng(sw.lat - heightBuffer,sw.lng - widthBuffer),new L.LatLng(ne.lat + heightBuffer,ne.lng + widthBuffer));},getCenter:function getCenter(){ // -> LatLng
	return new L.LatLng((this._southWest.lat + this._northEast.lat) / 2,(this._southWest.lng + this._northEast.lng) / 2);},getSouthWest:function getSouthWest(){return this._southWest;},getNorthEast:function getNorthEast(){return this._northEast;},getNorthWest:function getNorthWest(){return new L.LatLng(this.getNorth(),this.getWest());},getSouthEast:function getSouthEast(){return new L.LatLng(this.getSouth(),this.getEast());},getWest:function getWest(){return this._southWest.lng;},getSouth:function getSouth(){return this._southWest.lat;},getEast:function getEast(){return this._northEast.lng;},getNorth:function getNorth(){return this._northEast.lat;},contains:function contains(obj){ // (LatLngBounds) or (LatLng) -> Boolean
	if(typeof obj[0] === 'number' || obj instanceof L.LatLng){obj = L.latLng(obj);}else {obj = L.latLngBounds(obj);}var sw=this._southWest,ne=this._northEast,sw2,ne2;if(obj instanceof L.LatLngBounds){sw2 = obj.getSouthWest();ne2 = obj.getNorthEast();}else {sw2 = ne2 = obj;}return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;},intersects:function intersects(bounds){ // (LatLngBounds)
	bounds = L.latLngBounds(bounds);var sw=this._southWest,ne=this._northEast,sw2=bounds.getSouthWest(),ne2=bounds.getNorthEast(),latIntersects=ne2.lat >= sw.lat && sw2.lat <= ne.lat,lngIntersects=ne2.lng >= sw.lng && sw2.lng <= ne.lng;return latIntersects && lngIntersects;},toBBoxString:function toBBoxString(){return [this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(',');},equals:function equals(bounds){ // (LatLngBounds)
	if(!bounds){return false;}bounds = L.latLngBounds(bounds);return this._southWest.equals(bounds.getSouthWest()) && this._northEast.equals(bounds.getNorthEast());},isValid:function isValid(){return !!(this._southWest && this._northEast);}}; //TODO International date line?
	L.latLngBounds = function(a,b){ // (LatLngBounds) or (LatLng, LatLng)
	if(!a || a instanceof L.LatLngBounds){return a;}return new L.LatLngBounds(a,b);}; /*
	 * L.Projection contains various geographical projections used by CRS classes.
	 */L.Projection = {}; /*
	 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
	 */L.Projection.SphericalMercator = {MAX_LATITUDE:85.0511287798,project:function project(latlng){ // (LatLng) -> Point
	var d=L.LatLng.DEG_TO_RAD,max=this.MAX_LATITUDE,lat=Math.max(Math.min(max,latlng.lat),-max),x=latlng.lng * d,y=lat * d;y = Math.log(Math.tan(Math.PI / 4 + y / 2));return new L.Point(x,y);},unproject:function unproject(point){ // (Point, Boolean) -> LatLng
	var d=L.LatLng.RAD_TO_DEG,lng=point.x * d,lat=(2 * Math.atan(Math.exp(point.y)) - Math.PI / 2) * d;return new L.LatLng(lat,lng);}}; /*
	 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
	 */L.Projection.LonLat = {project:function project(latlng){return new L.Point(latlng.lng,latlng.lat);},unproject:function unproject(point){return new L.LatLng(point.y,point.x);}}; /*
	 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
	 */L.CRS = {latLngToPoint:function latLngToPoint(latlng,zoom){ // (LatLng, Number) -> Point
	var projectedPoint=this.projection.project(latlng),scale=this.scale(zoom);return this.transformation._transform(projectedPoint,scale);},pointToLatLng:function pointToLatLng(point,zoom){ // (Point, Number[, Boolean]) -> LatLng
	var scale=this.scale(zoom),untransformedPoint=this.transformation.untransform(point,scale);return this.projection.unproject(untransformedPoint);},project:function project(latlng){return this.projection.project(latlng);},scale:function scale(zoom){return 256 * Math.pow(2,zoom);},getSize:function getSize(zoom){var s=this.scale(zoom);return L.point(s,s);}}; /*
	 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
	 */L.CRS.Simple = L.extend({},L.CRS,{projection:L.Projection.LonLat,transformation:new L.Transformation(1,0,-1,0),scale:function scale(zoom){return Math.pow(2,zoom);}}); /*
	 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
	 * and is used by Leaflet by default.
	 */L.CRS.EPSG3857 = L.extend({},L.CRS,{code:'EPSG:3857',projection:L.Projection.SphericalMercator,transformation:new L.Transformation(0.5 / Math.PI,0.5,-0.5 / Math.PI,0.5),project:function project(latlng){ // (LatLng) -> Point
	var projectedPoint=this.projection.project(latlng),earthRadius=6378137;return projectedPoint.multiplyBy(earthRadius);}});L.CRS.EPSG900913 = L.extend({},L.CRS.EPSG3857,{code:'EPSG:900913'}); /*
	 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
	 */L.CRS.EPSG4326 = L.extend({},L.CRS,{code:'EPSG:4326',projection:L.Projection.LonLat,transformation:new L.Transformation(1 / 360,0.5,-1 / 360,0.5)}); /*
	 * L.Map is the central class of the API - it is used to create a map.
	 */L.Map = L.Class.extend({includes:L.Mixin.Events,options:{crs:L.CRS.EPSG3857, /*
			center: LatLng,
			zoom: Number,
			layers: Array,
			*/fadeAnimation:L.DomUtil.TRANSITION && !L.Browser.android23,trackResize:true,markerZoomAnimation:L.DomUtil.TRANSITION && L.Browser.any3d},initialize:function initialize(id,options){ // (HTMLElement or String, Object)
	options = L.setOptions(this,options);this._initContainer(id);this._initLayout(); // hack for https://github.com/Leaflet/Leaflet/issues/1980
	this._onResize = L.bind(this._onResize,this);this._initEvents();if(options.maxBounds){this.setMaxBounds(options.maxBounds);}if(options.center && options.zoom !== undefined){this.setView(L.latLng(options.center),options.zoom,{reset:true});}this._handlers = [];this._layers = {};this._zoomBoundLayers = {};this._tileLayersNum = 0;this.callInitHooks();this._addLayers(options.layers);}, // public methods that modify map state
	// replaced by animation-powered implementation in Map.PanAnimation.js
	setView:function setView(center,zoom){zoom = zoom === undefined?this.getZoom():zoom;this._resetView(L.latLng(center),this._limitZoom(zoom));return this;},setZoom:function setZoom(zoom,options){if(!this._loaded){this._zoom = this._limitZoom(zoom);return this;}return this.setView(this.getCenter(),zoom,{zoom:options});},zoomIn:function zoomIn(delta,options){return this.setZoom(this._zoom + (delta || 1),options);},zoomOut:function zoomOut(delta,options){return this.setZoom(this._zoom - (delta || 1),options);},setZoomAround:function setZoomAround(latlng,zoom,options){var scale=this.getZoomScale(zoom),viewHalf=this.getSize().divideBy(2),containerPoint=latlng instanceof L.Point?latlng:this.latLngToContainerPoint(latlng),centerOffset=containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),newCenter=this.containerPointToLatLng(viewHalf.add(centerOffset));return this.setView(newCenter,zoom,{zoom:options});},fitBounds:function fitBounds(bounds,options){options = options || {};bounds = bounds.getBounds?bounds.getBounds():L.latLngBounds(bounds);var paddingTL=L.point(options.paddingTopLeft || options.padding || [0,0]),paddingBR=L.point(options.paddingBottomRight || options.padding || [0,0]),zoom=this.getBoundsZoom(bounds,false,paddingTL.add(paddingBR));zoom = options.maxZoom?Math.min(options.maxZoom,zoom):zoom;var paddingOffset=paddingBR.subtract(paddingTL).divideBy(2),swPoint=this.project(bounds.getSouthWest(),zoom),nePoint=this.project(bounds.getNorthEast(),zoom),center=this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset),zoom);return this.setView(center,zoom,options);},fitWorld:function fitWorld(options){return this.fitBounds([[-90,-180],[90,180]],options);},panTo:function panTo(center,options){ // (LatLng)
	return this.setView(center,this._zoom,{pan:options});},panBy:function panBy(offset){ // (Point)
	// replaced with animated panBy in Map.PanAnimation.js
	this.fire('movestart');this._rawPanBy(L.point(offset));this.fire('move');return this.fire('moveend');},setMaxBounds:function setMaxBounds(bounds){bounds = L.latLngBounds(bounds);this.options.maxBounds = bounds;if(!bounds){return this.off('moveend',this._panInsideMaxBounds,this);}if(this._loaded){this._panInsideMaxBounds();}return this.on('moveend',this._panInsideMaxBounds,this);},panInsideBounds:function panInsideBounds(bounds,options){var center=this.getCenter(),newCenter=this._limitCenter(center,this._zoom,bounds);if(center.equals(newCenter)){return this;}return this.panTo(newCenter,options);},addLayer:function addLayer(layer){ // TODO method is too big, refactor
	var id=L.stamp(layer);if(this._layers[id]){return this;}this._layers[id] = layer; // TODO getMaxZoom, getMinZoom in ILayer (instead of options)
	if(layer.options && (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))){this._zoomBoundLayers[id] = layer;this._updateZoomLevels();} // TODO looks ugly, refactor!!!
	if(this.options.zoomAnimation && L.TileLayer && layer instanceof L.TileLayer){this._tileLayersNum++;this._tileLayersToLoad++;layer.on('load',this._onTileLayerLoad,this);}if(this._loaded){this._layerAdd(layer);}return this;},removeLayer:function removeLayer(layer){var id=L.stamp(layer);if(!this._layers[id]){return this;}if(this._loaded){layer.onRemove(this);}delete this._layers[id];if(this._loaded){this.fire('layerremove',{layer:layer});}if(this._zoomBoundLayers[id]){delete this._zoomBoundLayers[id];this._updateZoomLevels();} // TODO looks ugly, refactor
	if(this.options.zoomAnimation && L.TileLayer && layer instanceof L.TileLayer){this._tileLayersNum--;this._tileLayersToLoad--;layer.off('load',this._onTileLayerLoad,this);}return this;},hasLayer:function hasLayer(layer){if(!layer){return false;}return L.stamp(layer) in this._layers;},eachLayer:function eachLayer(method,context){for(var i in this._layers) {method.call(context,this._layers[i]);}return this;},invalidateSize:function invalidateSize(options){if(!this._loaded){return this;}options = L.extend({animate:false,pan:true},options === true?{animate:true}:options);var oldSize=this.getSize();this._sizeChanged = true;this._initialCenter = null;var newSize=this.getSize(),oldCenter=oldSize.divideBy(2).round(),newCenter=newSize.divideBy(2).round(),offset=oldCenter.subtract(newCenter);if(!offset.x && !offset.y){return this;}if(options.animate && options.pan){this.panBy(offset);}else {if(options.pan){this._rawPanBy(offset);}this.fire('move');if(options.debounceMoveend){clearTimeout(this._sizeTimer);this._sizeTimer = setTimeout(L.bind(this.fire,this,'moveend'),200);}else {this.fire('moveend');}}return this.fire('resize',{oldSize:oldSize,newSize:newSize});}, // TODO handler.addTo
	addHandler:function addHandler(name,HandlerClass){if(!HandlerClass){return this;}var handler=this[name] = new HandlerClass(this);this._handlers.push(handler);if(this.options[name]){handler.enable();}return this;},remove:function remove(){if(this._loaded){this.fire('unload');}this._initEvents('off');try{ // throws error in IE6-8
	delete this._container._leaflet;}catch(e) {this._container._leaflet = undefined;}this._clearPanes();if(this._clearControlPos){this._clearControlPos();}this._clearHandlers();return this;}, // public methods for getting map state
	getCenter:function getCenter(){ // (Boolean) -> LatLng
	this._checkIfLoaded();if(this._initialCenter && !this._moved()){return this._initialCenter;}return this.layerPointToLatLng(this._getCenterLayerPoint());},getZoom:function getZoom(){return this._zoom;},getBounds:function getBounds(){var bounds=this.getPixelBounds(),sw=this.unproject(bounds.getBottomLeft()),ne=this.unproject(bounds.getTopRight());return new L.LatLngBounds(sw,ne);},getMinZoom:function getMinZoom(){return this.options.minZoom === undefined?this._layersMinZoom === undefined?0:this._layersMinZoom:this.options.minZoom;},getMaxZoom:function getMaxZoom(){return this.options.maxZoom === undefined?this._layersMaxZoom === undefined?Infinity:this._layersMaxZoom:this.options.maxZoom;},getBoundsZoom:function getBoundsZoom(bounds,inside,padding){ // (LatLngBounds[, Boolean, Point]) -> Number
	bounds = L.latLngBounds(bounds);var zoom=this.getMinZoom() - (inside?1:0),maxZoom=this.getMaxZoom(),size=this.getSize(),nw=bounds.getNorthWest(),se=bounds.getSouthEast(),zoomNotFound=true,boundsSize;padding = L.point(padding || [0,0]);do {zoom++;boundsSize = this.project(se,zoom).subtract(this.project(nw,zoom)).add(padding);zoomNotFound = !inside?size.contains(boundsSize):boundsSize.x < size.x || boundsSize.y < size.y;}while(zoomNotFound && zoom <= maxZoom);if(zoomNotFound && inside){return null;}return inside?zoom:zoom - 1;},getSize:function getSize(){if(!this._size || this._sizeChanged){this._size = new L.Point(this._container.clientWidth,this._container.clientHeight);this._sizeChanged = false;}return this._size.clone();},getPixelBounds:function getPixelBounds(){var topLeftPoint=this._getTopLeftPoint();return new L.Bounds(topLeftPoint,topLeftPoint.add(this.getSize()));},getPixelOrigin:function getPixelOrigin(){this._checkIfLoaded();return this._initialTopLeftPoint;},getPanes:function getPanes(){return this._panes;},getContainer:function getContainer(){return this._container;}, // TODO replace with universal implementation after refactoring projections
	getZoomScale:function getZoomScale(toZoom){var crs=this.options.crs;return crs.scale(toZoom) / crs.scale(this._zoom);},getScaleZoom:function getScaleZoom(scale){return this._zoom + Math.log(scale) / Math.LN2;}, // conversion methods
	project:function project(latlng,zoom){ // (LatLng[, Number]) -> Point
	zoom = zoom === undefined?this._zoom:zoom;return this.options.crs.latLngToPoint(L.latLng(latlng),zoom);},unproject:function unproject(point,zoom){ // (Point[, Number]) -> LatLng
	zoom = zoom === undefined?this._zoom:zoom;return this.options.crs.pointToLatLng(L.point(point),zoom);},layerPointToLatLng:function layerPointToLatLng(point){ // (Point)
	var projectedPoint=L.point(point).add(this.getPixelOrigin());return this.unproject(projectedPoint);},latLngToLayerPoint:function latLngToLayerPoint(latlng){ // (LatLng)
	var projectedPoint=this.project(L.latLng(latlng))._round();return projectedPoint._subtract(this.getPixelOrigin());},containerPointToLayerPoint:function containerPointToLayerPoint(point){ // (Point)
	return L.point(point).subtract(this._getMapPanePos());},layerPointToContainerPoint:function layerPointToContainerPoint(point){ // (Point)
	return L.point(point).add(this._getMapPanePos());},containerPointToLatLng:function containerPointToLatLng(point){var layerPoint=this.containerPointToLayerPoint(L.point(point));return this.layerPointToLatLng(layerPoint);},latLngToContainerPoint:function latLngToContainerPoint(latlng){return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));},mouseEventToContainerPoint:function mouseEventToContainerPoint(e){ // (MouseEvent)
	return L.DomEvent.getMousePosition(e,this._container);},mouseEventToLayerPoint:function mouseEventToLayerPoint(e){ // (MouseEvent)
	return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));},mouseEventToLatLng:function mouseEventToLatLng(e){ // (MouseEvent)
	return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));}, // map initialization methods
	_initContainer:function _initContainer(id){var container=this._container = L.DomUtil.get(id);if(!container){throw new Error('Map container not found.');}else if(container._leaflet){throw new Error('Map container is already initialized.');}container._leaflet = true;},_initLayout:function _initLayout(){var container=this._container;L.DomUtil.addClass(container,'leaflet-container' + (L.Browser.touch?' leaflet-touch':'') + (L.Browser.retina?' leaflet-retina':'') + (L.Browser.ielt9?' leaflet-oldie':'') + (this.options.fadeAnimation?' leaflet-fade-anim':''));var position=L.DomUtil.getStyle(container,'position');if(position !== 'absolute' && position !== 'relative' && position !== 'fixed'){container.style.position = 'relative';}this._initPanes();if(this._initControlPos){this._initControlPos();}},_initPanes:function _initPanes(){var panes=this._panes = {};this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane',this._container);this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane',this._mapPane);panes.objectsPane = this._createPane('leaflet-objects-pane',this._mapPane);panes.shadowPane = this._createPane('leaflet-shadow-pane');panes.overlayPane = this._createPane('leaflet-overlay-pane');panes.markerPane = this._createPane('leaflet-marker-pane');panes.popupPane = this._createPane('leaflet-popup-pane');var zoomHide=' leaflet-zoom-hide';if(!this.options.markerZoomAnimation){L.DomUtil.addClass(panes.markerPane,zoomHide);L.DomUtil.addClass(panes.shadowPane,zoomHide);L.DomUtil.addClass(panes.popupPane,zoomHide);}},_createPane:function _createPane(className,container){return L.DomUtil.create('div',className,container || this._panes.objectsPane);},_clearPanes:function _clearPanes(){this._container.removeChild(this._mapPane);},_addLayers:function _addLayers(layers){layers = layers?L.Util.isArray(layers)?layers:[layers]:[];for(var i=0,len=layers.length;i < len;i++) {this.addLayer(layers[i]);}}, // private methods that modify map state
	_resetView:function _resetView(center,zoom,preserveMapOffset,afterZoomAnim){var zoomChanged=this._zoom !== zoom;if(!afterZoomAnim){this.fire('movestart');if(zoomChanged){this.fire('zoomstart');}}this._zoom = zoom;this._initialCenter = center;this._initialTopLeftPoint = this._getNewTopLeftPoint(center);if(!preserveMapOffset){L.DomUtil.setPosition(this._mapPane,new L.Point(0,0));}else {this._initialTopLeftPoint._add(this._getMapPanePos());}this._tileLayersToLoad = this._tileLayersNum;var loading=!this._loaded;this._loaded = true;this.fire('viewreset',{hard:!preserveMapOffset});if(loading){this.fire('load');this.eachLayer(this._layerAdd,this);}this.fire('move');if(zoomChanged || afterZoomAnim){this.fire('zoomend');}this.fire('moveend',{hard:!preserveMapOffset});},_rawPanBy:function _rawPanBy(offset){L.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(offset));},_getZoomSpan:function _getZoomSpan(){return this.getMaxZoom() - this.getMinZoom();},_updateZoomLevels:function _updateZoomLevels(){var i,minZoom=Infinity,maxZoom=-Infinity,oldZoomSpan=this._getZoomSpan();for(i in this._zoomBoundLayers) {var layer=this._zoomBoundLayers[i];if(!isNaN(layer.options.minZoom)){minZoom = Math.min(minZoom,layer.options.minZoom);}if(!isNaN(layer.options.maxZoom)){maxZoom = Math.max(maxZoom,layer.options.maxZoom);}}if(i === undefined){ // we have no tilelayers
	this._layersMaxZoom = this._layersMinZoom = undefined;}else {this._layersMaxZoom = maxZoom;this._layersMinZoom = minZoom;}if(oldZoomSpan !== this._getZoomSpan()){this.fire('zoomlevelschange');}},_panInsideMaxBounds:function _panInsideMaxBounds(){this.panInsideBounds(this.options.maxBounds);},_checkIfLoaded:function _checkIfLoaded(){if(!this._loaded){throw new Error('Set map center and zoom first.');}}, // map events
	_initEvents:function _initEvents(onOff){if(!L.DomEvent){return;}onOff = onOff || 'on';L.DomEvent[onOff](this._container,'click',this._onMouseClick,this);var events=['dblclick','mousedown','mouseup','mouseenter','mouseleave','mousemove','contextmenu'],i,len;for(i = 0,len = events.length;i < len;i++) {L.DomEvent[onOff](this._container,events[i],this._fireMouseEvent,this);}if(this.options.trackResize){L.DomEvent[onOff](window,'resize',this._onResize,this);}},_onResize:function _onResize(){L.Util.cancelAnimFrame(this._resizeRequest);this._resizeRequest = L.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:true});},this,false,this._container);},_onMouseClick:function _onMouseClick(e){if(!this._loaded || !e._simulated && (this.dragging && this.dragging.moved() || this.boxZoom && this.boxZoom.moved()) || L.DomEvent._skipped(e)){return;}this.fire('preclick');this._fireMouseEvent(e);},_fireMouseEvent:function _fireMouseEvent(e){if(!this._loaded || L.DomEvent._skipped(e)){return;}var type=e.type;type = type === 'mouseenter'?'mouseover':type === 'mouseleave'?'mouseout':type;if(!this.hasEventListeners(type)){return;}if(type === 'contextmenu'){L.DomEvent.preventDefault(e);}var containerPoint=this.mouseEventToContainerPoint(e),layerPoint=this.containerPointToLayerPoint(containerPoint),latlng=this.layerPointToLatLng(layerPoint);this.fire(type,{latlng:latlng,layerPoint:layerPoint,containerPoint:containerPoint,originalEvent:e});},_onTileLayerLoad:function _onTileLayerLoad(){this._tileLayersToLoad--;if(this._tileLayersNum && !this._tileLayersToLoad){this.fire('tilelayersload');}},_clearHandlers:function _clearHandlers(){for(var i=0,len=this._handlers.length;i < len;i++) {this._handlers[i].disable();}},whenReady:function whenReady(callback,context){if(this._loaded){callback.call(context || this,this);}else {this.on('load',callback,context);}return this;},_layerAdd:function _layerAdd(layer){layer.onAdd(this);this.fire('layeradd',{layer:layer});}, // private methods for getting map state
	_getMapPanePos:function _getMapPanePos(){return L.DomUtil.getPosition(this._mapPane);},_moved:function _moved(){var pos=this._getMapPanePos();return pos && !pos.equals([0,0]);},_getTopLeftPoint:function _getTopLeftPoint(){return this.getPixelOrigin().subtract(this._getMapPanePos());},_getNewTopLeftPoint:function _getNewTopLeftPoint(center,zoom){var viewHalf=this.getSize()._divideBy(2); // TODO round on display, not calculation to increase precision?
	return this.project(center,zoom)._subtract(viewHalf)._round();},_latLngToNewLayerPoint:function _latLngToNewLayerPoint(latlng,newZoom,newCenter){var topLeft=this._getNewTopLeftPoint(newCenter,newZoom).add(this._getMapPanePos());return this.project(latlng,newZoom)._subtract(topLeft);}, // layer point of the current center
	_getCenterLayerPoint:function _getCenterLayerPoint(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2));}, // offset of the specified place to the current center in pixels
	_getCenterOffset:function _getCenterOffset(latlng){return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());}, // adjust center for view to get inside bounds
	_limitCenter:function _limitCenter(center,zoom,bounds){if(!bounds){return center;}var centerPoint=this.project(center,zoom),viewHalf=this.getSize().divideBy(2),viewBounds=new L.Bounds(centerPoint.subtract(viewHalf),centerPoint.add(viewHalf)),offset=this._getBoundsOffset(viewBounds,bounds,zoom);return this.unproject(centerPoint.add(offset),zoom);}, // adjust offset for view to get inside bounds
	_limitOffset:function _limitOffset(offset,bounds){if(!bounds){return offset;}var viewBounds=this.getPixelBounds(),newBounds=new L.Bounds(viewBounds.min.add(offset),viewBounds.max.add(offset));return offset.add(this._getBoundsOffset(newBounds,bounds));}, // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	_getBoundsOffset:function _getBoundsOffset(pxBounds,maxBounds,zoom){var nwOffset=this.project(maxBounds.getNorthWest(),zoom).subtract(pxBounds.min),seOffset=this.project(maxBounds.getSouthEast(),zoom).subtract(pxBounds.max),dx=this._rebound(nwOffset.x,-seOffset.x),dy=this._rebound(nwOffset.y,-seOffset.y);return new L.Point(dx,dy);},_rebound:function _rebound(left,right){return left + right > 0?Math.round(left - right) / 2:Math.max(0,Math.ceil(left)) - Math.max(0,Math.floor(right));},_limitZoom:function _limitZoom(zoom){var min=this.getMinZoom(),max=this.getMaxZoom();return Math.max(min,Math.min(max,zoom));}});L.map = function(id,options){return new L.Map(id,options);}; /*
	 * Mercator projection that takes into account that the Earth is not a perfect sphere.
	 * Less popular than spherical mercator; used by projections like EPSG:3395.
	 */L.Projection.Mercator = {MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function project(latlng){ // (LatLng) -> Point
	var d=L.LatLng.DEG_TO_RAD,max=this.MAX_LATITUDE,lat=Math.max(Math.min(max,latlng.lat),-max),r=this.R_MAJOR,r2=this.R_MINOR,x=latlng.lng * d * r,y=lat * d,tmp=r2 / r,eccent=Math.sqrt(1.0 - tmp * tmp),con=eccent * Math.sin(y);con = Math.pow((1 - con) / (1 + con),eccent * 0.5);var ts=Math.tan(0.5 * (Math.PI * 0.5 - y)) / con;y = -r * Math.log(ts);return new L.Point(x,y);},unproject:function unproject(point){ // (Point, Boolean) -> LatLng
	var d=L.LatLng.RAD_TO_DEG,r=this.R_MAJOR,r2=this.R_MINOR,lng=point.x * d / r,tmp=r2 / r,eccent=Math.sqrt(1 - tmp * tmp),ts=Math.exp(-point.y / r),phi=Math.PI / 2 - 2 * Math.atan(ts),numIter=15,tol=1e-7,i=numIter,dphi=0.1,con;while(Math.abs(dphi) > tol && --i > 0) {con = eccent * Math.sin(phi);dphi = Math.PI / 2 - 2 * Math.atan(ts * Math.pow((1.0 - con) / (1.0 + con),0.5 * eccent)) - phi;phi += dphi;}return new L.LatLng(phi * d,lng);}};L.CRS.EPSG3395 = L.extend({},L.CRS,{code:'EPSG:3395',projection:L.Projection.Mercator,transformation:(function(){var m=L.Projection.Mercator,r=m.R_MAJOR,scale=0.5 / (Math.PI * r);return new L.Transformation(scale,0.5,-scale,0.5);})()}); /*
	 * L.TileLayer is used for standard xyz-numbered tile layers.
	 */L.TileLayer = L.Class.extend({includes:L.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:'abc',errorTileUrl:'',attribution:'',zoomOffset:0,opacity:1, /*
			maxNativeZoom: null,
			zIndex: null,
			tms: false,
			continuousWorld: false,
			noWrap: false,
			zoomReverse: false,
			detectRetina: false,
			reuseTiles: false,
			bounds: false,
			*/unloadInvisibleTiles:L.Browser.mobile,updateWhenIdle:L.Browser.mobile},initialize:function initialize(url,options){options = L.setOptions(this,options); // detecting retina displays, adjusting tileSize and zoom levels
	if(options.detectRetina && L.Browser.retina && options.maxZoom > 0){options.tileSize = Math.floor(options.tileSize / 2);options.zoomOffset++;if(options.minZoom > 0){options.minZoom--;}this.options.maxZoom--;}if(options.bounds){options.bounds = L.latLngBounds(options.bounds);}this._url = url;var subdomains=this.options.subdomains;if(typeof subdomains === 'string'){this.options.subdomains = subdomains.split('');}},onAdd:function onAdd(map){this._map = map;this._animated = map._zoomAnimated; // create a container div for tiles
	this._initContainer(); // set up events
	map.on({'viewreset':this._reset,'moveend':this._update},this);if(this._animated){map.on({'zoomanim':this._animateZoom,'zoomend':this._endZoomAnim},this);}if(!this.options.updateWhenIdle){this._limitedUpdate = L.Util.limitExecByInterval(this._update,150,this);map.on('move',this._limitedUpdate,this);}this._reset();this._update();},addTo:function addTo(map){map.addLayer(this);return this;},onRemove:function onRemove(map){this._container.parentNode.removeChild(this._container);map.off({'viewreset':this._reset,'moveend':this._update},this);if(this._animated){map.off({'zoomanim':this._animateZoom,'zoomend':this._endZoomAnim},this);}if(!this.options.updateWhenIdle){map.off('move',this._limitedUpdate,this);}this._container = null;this._map = null;},bringToFront:function bringToFront(){var pane=this._map._panes.tilePane;if(this._container){pane.appendChild(this._container);this._setAutoZIndex(pane,Math.max);}return this;},bringToBack:function bringToBack(){var pane=this._map._panes.tilePane;if(this._container){pane.insertBefore(this._container,pane.firstChild);this._setAutoZIndex(pane,Math.min);}return this;},getAttribution:function getAttribution(){return this.options.attribution;},getContainer:function getContainer(){return this._container;},setOpacity:function setOpacity(opacity){this.options.opacity = opacity;if(this._map){this._updateOpacity();}return this;},setZIndex:function setZIndex(zIndex){this.options.zIndex = zIndex;this._updateZIndex();return this;},setUrl:function setUrl(url,noRedraw){this._url = url;if(!noRedraw){this.redraw();}return this;},redraw:function redraw(){if(this._map){this._reset({hard:true});this._update();}return this;},_updateZIndex:function _updateZIndex(){if(this._container && this.options.zIndex !== undefined){this._container.style.zIndex = this.options.zIndex;}},_setAutoZIndex:function _setAutoZIndex(pane,compare){var layers=pane.children,edgeZIndex=-compare(Infinity,-Infinity), // -Infinity for max, Infinity for min
	zIndex,i,len;for(i = 0,len = layers.length;i < len;i++) {if(layers[i] !== this._container){zIndex = parseInt(layers[i].style.zIndex,10);if(!isNaN(zIndex)){edgeZIndex = compare(edgeZIndex,zIndex);}}}this.options.zIndex = this._container.style.zIndex = (isFinite(edgeZIndex)?edgeZIndex:0) + compare(1,-1);},_updateOpacity:function _updateOpacity(){var i,tiles=this._tiles;if(L.Browser.ielt9){for(i in tiles) {L.DomUtil.setOpacity(tiles[i],this.options.opacity);}}else {L.DomUtil.setOpacity(this._container,this.options.opacity);}},_initContainer:function _initContainer(){var tilePane=this._map._panes.tilePane;if(!this._container){this._container = L.DomUtil.create('div','leaflet-layer');this._updateZIndex();if(this._animated){var className='leaflet-tile-container';this._bgBuffer = L.DomUtil.create('div',className,this._container);this._tileContainer = L.DomUtil.create('div',className,this._container);}else {this._tileContainer = this._container;}tilePane.appendChild(this._container);if(this.options.opacity < 1){this._updateOpacity();}}},_reset:function _reset(e){for(var key in this._tiles) {this.fire('tileunload',{tile:this._tiles[key]});}this._tiles = {};this._tilesToLoad = 0;if(this.options.reuseTiles){this._unusedTiles = [];}this._tileContainer.innerHTML = '';if(this._animated && e && e.hard){this._clearBgBuffer();}this._initContainer();},_getTileSize:function _getTileSize(){var map=this._map,zoom=map.getZoom() + this.options.zoomOffset,zoomN=this.options.maxNativeZoom,tileSize=this.options.tileSize;if(zoomN && zoom > zoomN){tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);}return tileSize;},_update:function _update(){if(!this._map){return;}var map=this._map,bounds=map.getPixelBounds(),zoom=map.getZoom(),tileSize=this._getTileSize();if(zoom > this.options.maxZoom || zoom < this.options.minZoom){return;}var tileBounds=L.bounds(bounds.min.divideBy(tileSize)._floor(),bounds.max.divideBy(tileSize)._floor());this._addTilesFromCenterOut(tileBounds);if(this.options.unloadInvisibleTiles || this.options.reuseTiles){this._removeOtherTiles(tileBounds);}},_addTilesFromCenterOut:function _addTilesFromCenterOut(bounds){var queue=[],center=bounds.getCenter();var j,i,point;for(j = bounds.min.y;j <= bounds.max.y;j++) {for(i = bounds.min.x;i <= bounds.max.x;i++) {point = new L.Point(i,j);if(this._tileShouldBeLoaded(point)){queue.push(point);}}}var tilesToLoad=queue.length;if(tilesToLoad === 0){return;} // load tiles in order of their distance to center
	queue.sort(function(a,b){return a.distanceTo(center) - b.distanceTo(center);});var fragment=document.createDocumentFragment(); // if its the first batch of tiles to load
	if(!this._tilesToLoad){this.fire('loading');}this._tilesToLoad += tilesToLoad;for(i = 0;i < tilesToLoad;i++) {this._addTile(queue[i],fragment);}this._tileContainer.appendChild(fragment);},_tileShouldBeLoaded:function _tileShouldBeLoaded(tilePoint){if(tilePoint.x + ':' + tilePoint.y in this._tiles){return false; // already loaded
	}var options=this.options;if(!options.continuousWorld){var limit=this._getWrapTileNum(); // don't load if exceeds world bounds
	if(options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x) || tilePoint.y < 0 || tilePoint.y >= limit.y){return false;}}if(options.bounds){var tileSize=this._getTileSize(),nwPoint=tilePoint.multiplyBy(tileSize),sePoint=nwPoint.add([tileSize,tileSize]),nw=this._map.unproject(nwPoint),se=this._map.unproject(sePoint); // TODO temporary hack, will be removed after refactoring projections
	// https://github.com/Leaflet/Leaflet/issues/1618
	if(!options.continuousWorld && !options.noWrap){nw = nw.wrap();se = se.wrap();}if(!options.bounds.intersects([nw,se])){return false;}}return true;},_removeOtherTiles:function _removeOtherTiles(bounds){var kArr,x,y,key;for(key in this._tiles) {kArr = key.split(':');x = parseInt(kArr[0],10);y = parseInt(kArr[1],10); // remove tile if it's out of bounds
	if(x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y){this._removeTile(key);}}},_removeTile:function _removeTile(key){var tile=this._tiles[key];this.fire('tileunload',{tile:tile,url:tile.src});if(this.options.reuseTiles){L.DomUtil.removeClass(tile,'leaflet-tile-loaded');this._unusedTiles.push(tile);}else if(tile.parentNode === this._tileContainer){this._tileContainer.removeChild(tile);} // for https://github.com/CloudMade/Leaflet/issues/137
	if(!L.Browser.android){tile.onload = null;tile.src = L.Util.emptyImageUrl;}delete this._tiles[key];},_addTile:function _addTile(tilePoint,container){var tilePos=this._getTilePos(tilePoint); // get unused tile - or create a new tile
	var tile=this._getTile(); /*
			Chrome 20 layouts much faster with top/left (verify with timeline, frames)
			Android 4 browser has display issues with top/left and requires transform instead
			(other browsers don't currently care) - see debug/hacks/jitter.html for an example
			*/L.DomUtil.setPosition(tile,tilePos,L.Browser.chrome);this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;this._loadTile(tile,tilePoint);if(tile.parentNode !== this._tileContainer){container.appendChild(tile);}},_getZoomForUrl:function _getZoomForUrl(){var options=this.options,zoom=this._map.getZoom();if(options.zoomReverse){zoom = options.maxZoom - zoom;}zoom += options.zoomOffset;return options.maxNativeZoom?Math.min(zoom,options.maxNativeZoom):zoom;},_getTilePos:function _getTilePos(tilePoint){var origin=this._map.getPixelOrigin(),tileSize=this._getTileSize();return tilePoint.multiplyBy(tileSize).subtract(origin);}, // image-specific code (override to implement e.g. Canvas or SVG tile layer)
	getTileUrl:function getTileUrl(tilePoint){return L.Util.template(this._url,L.extend({s:this._getSubdomain(tilePoint),z:tilePoint.z,x:tilePoint.x,y:tilePoint.y},this.options));},_getWrapTileNum:function _getWrapTileNum(){var crs=this._map.options.crs,size=crs.getSize(this._map.getZoom());return size.divideBy(this._getTileSize())._floor();},_adjustTilePoint:function _adjustTilePoint(tilePoint){var limit=this._getWrapTileNum(); // wrap tile coordinates
	if(!this.options.continuousWorld && !this.options.noWrap){tilePoint.x = (tilePoint.x % limit.x + limit.x) % limit.x;}if(this.options.tms){tilePoint.y = limit.y - tilePoint.y - 1;}tilePoint.z = this._getZoomForUrl();},_getSubdomain:function _getSubdomain(tilePoint){var index=Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;return this.options.subdomains[index];},_getTile:function _getTile(){if(this.options.reuseTiles && this._unusedTiles.length > 0){var tile=this._unusedTiles.pop();this._resetTile(tile);return tile;}return this._createTile();}, // Override if data stored on a tile needs to be cleaned up before reuse
	_resetTile:function _resetTile() /*tile*/{},_createTile:function _createTile(){var tile=L.DomUtil.create('img','leaflet-tile');tile.style.width = tile.style.height = this._getTileSize() + 'px';tile.galleryimg = 'no';tile.onselectstart = tile.onmousemove = L.Util.falseFn;if(L.Browser.ielt9 && this.options.opacity !== undefined){L.DomUtil.setOpacity(tile,this.options.opacity);} // without this hack, tiles disappear after zoom on Chrome for Android
	// https://github.com/Leaflet/Leaflet/issues/2078
	if(L.Browser.mobileWebkit3d){tile.style.WebkitBackfaceVisibility = 'hidden';}return tile;},_loadTile:function _loadTile(tile,tilePoint){tile._layer = this;tile.onload = this._tileOnLoad;tile.onerror = this._tileOnError;this._adjustTilePoint(tilePoint);tile.src = this.getTileUrl(tilePoint);this.fire('tileloadstart',{tile:tile,url:tile.src});},_tileLoaded:function _tileLoaded(){this._tilesToLoad--;if(this._animated){L.DomUtil.addClass(this._tileContainer,'leaflet-zoom-animated');}if(!this._tilesToLoad){this.fire('load');if(this._animated){ // clear scaled tiles after all new tiles are loaded (for performance)
	clearTimeout(this._clearBgBufferTimer);this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer,this),500);}}},_tileOnLoad:function _tileOnLoad(){var layer=this._layer; //Only if we are loading an actual image
	if(this.src !== L.Util.emptyImageUrl){L.DomUtil.addClass(this,'leaflet-tile-loaded');layer.fire('tileload',{tile:this,url:this.src});}layer._tileLoaded();},_tileOnError:function _tileOnError(){var layer=this._layer;layer.fire('tileerror',{tile:this,url:this.src});var newUrl=layer.options.errorTileUrl;if(newUrl){this.src = newUrl;}layer._tileLoaded();}});L.tileLayer = function(url,options){return new L.TileLayer(url,options);}; /*
	 * L.TileLayer.WMS is used for putting WMS tile layers on the map.
	 */L.TileLayer.WMS = L.TileLayer.extend({defaultWmsParams:{service:'WMS',request:'GetMap',version:'1.1.1',layers:'',styles:'',format:'image/jpeg',transparent:false},initialize:function initialize(url,options){ // (String, Object)
	this._url = url;var wmsParams=L.extend({},this.defaultWmsParams),tileSize=options.tileSize || this.options.tileSize;if(options.detectRetina && L.Browser.retina){wmsParams.width = wmsParams.height = tileSize * 2;}else {wmsParams.width = wmsParams.height = tileSize;}for(var i in options) { // all keys that are not TileLayer options go to WMS params
	if(!this.options.hasOwnProperty(i) && i !== 'crs'){wmsParams[i] = options[i];}}this.wmsParams = wmsParams;L.setOptions(this,options);},onAdd:function onAdd(map){this._crs = this.options.crs || map.options.crs;this._wmsVersion = parseFloat(this.wmsParams.version);var projectionKey=this._wmsVersion >= 1.3?'crs':'srs';this.wmsParams[projectionKey] = this._crs.code;L.TileLayer.prototype.onAdd.call(this,map);},getTileUrl:function getTileUrl(tilePoint){ // (Point, Number) -> String
	var map=this._map,tileSize=this.options.tileSize,nwPoint=tilePoint.multiplyBy(tileSize),sePoint=nwPoint.add([tileSize,tileSize]),nw=this._crs.project(map.unproject(nwPoint,tilePoint.z)),se=this._crs.project(map.unproject(sePoint,tilePoint.z)),bbox=this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326?[se.y,nw.x,nw.y,se.x].join(','):[nw.x,se.y,se.x,nw.y].join(','),url=L.Util.template(this._url,{s:this._getSubdomain(tilePoint)});return url + L.Util.getParamString(this.wmsParams,url,true) + '&BBOX=' + bbox;},setParams:function setParams(params,noRedraw){L.extend(this.wmsParams,params);if(!noRedraw){this.redraw();}return this;}});L.tileLayer.wms = function(url,options){return new L.TileLayer.WMS(url,options);}; /*
	 * L.TileLayer.Canvas is a class that you can use as a base for creating
	 * dynamically drawn Canvas-based tile layers.
	 */L.TileLayer.Canvas = L.TileLayer.extend({options:{async:false},initialize:function initialize(options){L.setOptions(this,options);},redraw:function redraw(){if(this._map){this._reset({hard:true});this._update();}for(var i in this._tiles) {this._redrawTile(this._tiles[i]);}return this;},_redrawTile:function _redrawTile(tile){this.drawTile(tile,tile._tilePoint,this._map._zoom);},_createTile:function _createTile(){var tile=L.DomUtil.create('canvas','leaflet-tile');tile.width = tile.height = this.options.tileSize;tile.onselectstart = tile.onmousemove = L.Util.falseFn;return tile;},_loadTile:function _loadTile(tile,tilePoint){tile._layer = this;tile._tilePoint = tilePoint;this._redrawTile(tile);if(!this.options.async){this.tileDrawn(tile);}},drawTile:function drawTile() /*tile, tilePoint*/{ // override with rendering code
	},tileDrawn:function tileDrawn(tile){this._tileOnLoad.call(tile);}});L.tileLayer.canvas = function(options){return new L.TileLayer.Canvas(options);}; /*
	 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
	 */L.ImageOverlay = L.Class.extend({includes:L.Mixin.Events,options:{opacity:1},initialize:function initialize(url,bounds,options){ // (String, LatLngBounds, Object)
	this._url = url;this._bounds = L.latLngBounds(bounds);L.setOptions(this,options);},onAdd:function onAdd(map){this._map = map;if(!this._image){this._initImage();}map._panes.overlayPane.appendChild(this._image);map.on('viewreset',this._reset,this);if(map.options.zoomAnimation && L.Browser.any3d){map.on('zoomanim',this._animateZoom,this);}this._reset();},onRemove:function onRemove(map){map.getPanes().overlayPane.removeChild(this._image);map.off('viewreset',this._reset,this);if(map.options.zoomAnimation){map.off('zoomanim',this._animateZoom,this);}},addTo:function addTo(map){map.addLayer(this);return this;},setOpacity:function setOpacity(opacity){this.options.opacity = opacity;this._updateOpacity();return this;}, // TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront:function bringToFront(){if(this._image){this._map._panes.overlayPane.appendChild(this._image);}return this;},bringToBack:function bringToBack(){var pane=this._map._panes.overlayPane;if(this._image){pane.insertBefore(this._image,pane.firstChild);}return this;},setUrl:function setUrl(url){this._url = url;this._image.src = this._url;},getAttribution:function getAttribution(){return this.options.attribution;},_initImage:function _initImage(){this._image = L.DomUtil.create('img','leaflet-image-layer');if(this._map.options.zoomAnimation && L.Browser.any3d){L.DomUtil.addClass(this._image,'leaflet-zoom-animated');}else {L.DomUtil.addClass(this._image,'leaflet-zoom-hide');}this._updateOpacity(); //TODO createImage util method to remove duplication
	L.extend(this._image,{galleryimg:'no',onselectstart:L.Util.falseFn,onmousemove:L.Util.falseFn,onload:L.bind(this._onImageLoad,this),src:this._url});},_animateZoom:function _animateZoom(e){var map=this._map,image=this._image,scale=map.getZoomScale(e.zoom),nw=this._bounds.getNorthWest(),se=this._bounds.getSouthEast(),topLeft=map._latLngToNewLayerPoint(nw,e.zoom,e.center),size=map._latLngToNewLayerPoint(se,e.zoom,e.center)._subtract(topLeft),origin=topLeft._add(size._multiplyBy(1 / 2 * (1 - 1 / scale)));image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';},_reset:function _reset(){var image=this._image,topLeft=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),size=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);L.DomUtil.setPosition(image,topLeft);image.style.width = size.x + 'px';image.style.height = size.y + 'px';},_onImageLoad:function _onImageLoad(){this.fire('load');},_updateOpacity:function _updateOpacity(){L.DomUtil.setOpacity(this._image,this.options.opacity);}});L.imageOverlay = function(url,bounds,options){return new L.ImageOverlay(url,bounds,options);}; /*
	 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
	 */L.Icon = L.Class.extend({options:{ /*
			iconUrl: (String) (required)
			iconRetinaUrl: (String) (optional, used for retina devices if detected)
			iconSize: (Point) (can be set through CSS)
			iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
			popupAnchor: (Point) (if not specified, popup opens in the anchor point)
			shadowUrl: (String) (no shadow by default)
			shadowRetinaUrl: (String) (optional, used for retina devices if detected)
			shadowSize: (Point)
			shadowAnchor: (Point)
			*/className:''},initialize:function initialize(options){L.setOptions(this,options);},createIcon:function createIcon(oldIcon){return this._createIcon('icon',oldIcon);},createShadow:function createShadow(oldIcon){return this._createIcon('shadow',oldIcon);},_createIcon:function _createIcon(name,oldIcon){var src=this._getIconUrl(name);if(!src){if(name === 'icon'){throw new Error('iconUrl not set in Icon options (see the docs).');}return null;}var img;if(!oldIcon || oldIcon.tagName !== 'IMG'){img = this._createImg(src);}else {img = this._createImg(src,oldIcon);}this._setIconStyles(img,name);return img;},_setIconStyles:function _setIconStyles(img,name){var options=this.options,size=L.point(options[name + 'Size']),anchor;if(name === 'shadow'){anchor = L.point(options.shadowAnchor || options.iconAnchor);}else {anchor = L.point(options.iconAnchor);}if(!anchor && size){anchor = size.divideBy(2,true);}img.className = 'leaflet-marker-' + name + ' ' + options.className;if(anchor){img.style.marginLeft = -anchor.x + 'px';img.style.marginTop = -anchor.y + 'px';}if(size){img.style.width = size.x + 'px';img.style.height = size.y + 'px';}},_createImg:function _createImg(src,el){el = el || document.createElement('img');el.src = src;return el;},_getIconUrl:function _getIconUrl(name){if(L.Browser.retina && this.options[name + 'RetinaUrl']){return this.options[name + 'RetinaUrl'];}return this.options[name + 'Url'];}});L.icon = function(options){return new L.Icon(options);}; /*
	 * L.Icon.Default is the blue marker icon used by default in Leaflet.
	 */L.Icon.Default = L.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function _getIconUrl(name){var key=name + 'Url';if(this.options[key]){return this.options[key];}if(L.Browser.retina && name === 'icon'){name += '-2x';}var path=L.Icon.Default.imagePath;if(!path){throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');}return path + '/marker-' + name + '.png';}});L.Icon.Default.imagePath = (function(){var scripts=document.getElementsByTagName('script'),leafletRe=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;var i,len,src,matches,path;for(i = 0,len = scripts.length;i < len;i++) {src = scripts[i].src;matches = src.match(leafletRe);if(matches){path = src.split(leafletRe)[0];return (path?path + '/':'') + 'images';}}})(); /*
	 * L.Marker is used to display clickable/draggable icons on the map.
	 */L.Marker = L.Class.extend({includes:L.Mixin.Events,options:{icon:new L.Icon.Default(),title:'',alt:'',clickable:true,draggable:false,keyboard:true,zIndexOffset:0,opacity:1,riseOnHover:false,riseOffset:250},initialize:function initialize(latlng,options){L.setOptions(this,options);this._latlng = L.latLng(latlng);},onAdd:function onAdd(map){this._map = map;map.on('viewreset',this.update,this);this._initIcon();this.update();this.fire('add');if(map.options.zoomAnimation && map.options.markerZoomAnimation){map.on('zoomanim',this._animateZoom,this);}},addTo:function addTo(map){map.addLayer(this);return this;},onRemove:function onRemove(map){if(this.dragging){this.dragging.disable();}this._removeIcon();this._removeShadow();this.fire('remove');map.off({'viewreset':this.update,'zoomanim':this._animateZoom},this);this._map = null;},getLatLng:function getLatLng(){return this._latlng;},setLatLng:function setLatLng(latlng){this._latlng = L.latLng(latlng);this.update();return this.fire('move',{latlng:this._latlng});},setZIndexOffset:function setZIndexOffset(offset){this.options.zIndexOffset = offset;this.update();return this;},setIcon:function setIcon(icon){this.options.icon = icon;if(this._map){this._initIcon();this.update();}if(this._popup){this.bindPopup(this._popup);}return this;},update:function update(){if(this._icon){this._setPos(this._map.latLngToLayerPoint(this._latlng).round());}return this;},_initIcon:function _initIcon(){var options=this.options,map=this._map,animation=map.options.zoomAnimation && map.options.markerZoomAnimation,classToAdd=animation?'leaflet-zoom-animated':'leaflet-zoom-hide';var icon=options.icon.createIcon(this._icon),addIcon=false; // if we're not reusing the icon, remove the old one and init new one
	if(icon !== this._icon){if(this._icon){this._removeIcon();}addIcon = true;if(options.title){icon.title = options.title;}if(options.alt){icon.alt = options.alt;}}L.DomUtil.addClass(icon,classToAdd);if(options.keyboard){icon.tabIndex = '0';}this._icon = icon;this._initInteraction();if(options.riseOnHover){L.DomEvent.on(icon,'mouseover',this._bringToFront,this).on(icon,'mouseout',this._resetZIndex,this);}var newShadow=options.icon.createShadow(this._shadow),addShadow=false;if(newShadow !== this._shadow){this._removeShadow();addShadow = true;}if(newShadow){L.DomUtil.addClass(newShadow,classToAdd);}this._shadow = newShadow;if(options.opacity < 1){this._updateOpacity();}var panes=this._map._panes;if(addIcon){panes.markerPane.appendChild(this._icon);}if(newShadow && addShadow){panes.shadowPane.appendChild(this._shadow);}},_removeIcon:function _removeIcon(){if(this.options.riseOnHover){L.DomEvent.off(this._icon,'mouseover',this._bringToFront).off(this._icon,'mouseout',this._resetZIndex);}this._map._panes.markerPane.removeChild(this._icon);this._icon = null;},_removeShadow:function _removeShadow(){if(this._shadow){this._map._panes.shadowPane.removeChild(this._shadow);}this._shadow = null;},_setPos:function _setPos(pos){L.DomUtil.setPosition(this._icon,pos);if(this._shadow){L.DomUtil.setPosition(this._shadow,pos);}this._zIndex = pos.y + this.options.zIndexOffset;this._resetZIndex();},_updateZIndex:function _updateZIndex(offset){this._icon.style.zIndex = this._zIndex + offset;},_animateZoom:function _animateZoom(opt){var pos=this._map._latLngToNewLayerPoint(this._latlng,opt.zoom,opt.center).round();this._setPos(pos);},_initInteraction:function _initInteraction(){if(!this.options.clickable){return;} // TODO refactor into something shared with Map/Path/etc. to DRY it up
	var icon=this._icon,events=['dblclick','mousedown','mouseover','mouseout','contextmenu'];L.DomUtil.addClass(icon,'leaflet-clickable');L.DomEvent.on(icon,'click',this._onMouseClick,this);L.DomEvent.on(icon,'keypress',this._onKeyPress,this);for(var i=0;i < events.length;i++) {L.DomEvent.on(icon,events[i],this._fireMouseEvent,this);}if(L.Handler.MarkerDrag){this.dragging = new L.Handler.MarkerDrag(this);if(this.options.draggable){this.dragging.enable();}}},_onMouseClick:function _onMouseClick(e){var wasDragged=this.dragging && this.dragging.moved();if(this.hasEventListeners(e.type) || wasDragged){L.DomEvent.stopPropagation(e);}if(wasDragged){return;}if((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()){return;}this.fire(e.type,{originalEvent:e,latlng:this._latlng});},_onKeyPress:function _onKeyPress(e){if(e.keyCode === 13){this.fire('click',{originalEvent:e,latlng:this._latlng});}},_fireMouseEvent:function _fireMouseEvent(e){this.fire(e.type,{originalEvent:e,latlng:this._latlng}); // TODO proper custom event propagation
	// this line will always be called if marker is in a FeatureGroup
	if(e.type === 'contextmenu' && this.hasEventListeners(e.type)){L.DomEvent.preventDefault(e);}if(e.type !== 'mousedown'){L.DomEvent.stopPropagation(e);}else {L.DomEvent.preventDefault(e);}},setOpacity:function setOpacity(opacity){this.options.opacity = opacity;if(this._map){this._updateOpacity();}return this;},_updateOpacity:function _updateOpacity(){L.DomUtil.setOpacity(this._icon,this.options.opacity);if(this._shadow){L.DomUtil.setOpacity(this._shadow,this.options.opacity);}},_bringToFront:function _bringToFront(){this._updateZIndex(this.options.riseOffset);},_resetZIndex:function _resetZIndex(){this._updateZIndex(0);}});L.marker = function(latlng,options){return new L.Marker(latlng,options);}; /*
	 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
	 * to use with L.Marker.
	 */L.DivIcon = L.Icon.extend({options:{iconSize:[12,12], // also can be set through CSS
	/*
			iconAnchor: (Point)
			popupAnchor: (Point)
			html: (String)
			bgPos: (Point)
			*/className:'leaflet-div-icon',html:false},createIcon:function createIcon(oldIcon){var div=oldIcon && oldIcon.tagName === 'DIV'?oldIcon:document.createElement('div'),options=this.options;if(options.html !== false){div.innerHTML = options.html;}else {div.innerHTML = '';}if(options.bgPos){div.style.backgroundPosition = -options.bgPos.x + 'px ' + -options.bgPos.y + 'px';}this._setIconStyles(div,'icon');return div;},createShadow:function createShadow(){return null;}});L.divIcon = function(options){return new L.DivIcon(options);}; /*
	 * L.Popup is used for displaying popups on the map.
	 */L.Map.mergeOptions({closePopupOnClick:true});L.Popup = L.Class.extend({includes:L.Mixin.Events,options:{minWidth:50,maxWidth:300, // maxHeight: null,
	autoPan:true,closeButton:true,offset:[0,7],autoPanPadding:[5,5], // autoPanPaddingTopLeft: null,
	// autoPanPaddingBottomRight: null,
	keepInView:false,className:'',zoomAnimation:true},initialize:function initialize(options,source){L.setOptions(this,options);this._source = source;this._animated = L.Browser.any3d && this.options.zoomAnimation;this._isOpen = false;},onAdd:function onAdd(map){this._map = map;if(!this._container){this._initLayout();}var animFade=map.options.fadeAnimation;if(animFade){L.DomUtil.setOpacity(this._container,0);}map._panes.popupPane.appendChild(this._container);map.on(this._getEvents(),this);this.update();if(animFade){L.DomUtil.setOpacity(this._container,1);}this.fire('open');map.fire('popupopen',{popup:this});if(this._source){this._source.fire('popupopen',{popup:this});}},addTo:function addTo(map){map.addLayer(this);return this;},openOn:function openOn(map){map.openPopup(this);return this;},onRemove:function onRemove(map){map._panes.popupPane.removeChild(this._container);L.Util.falseFn(this._container.offsetWidth); // force reflow
	map.off(this._getEvents(),this);if(map.options.fadeAnimation){L.DomUtil.setOpacity(this._container,0);}this._map = null;this.fire('close');map.fire('popupclose',{popup:this});if(this._source){this._source.fire('popupclose',{popup:this});}},getLatLng:function getLatLng(){return this._latlng;},setLatLng:function setLatLng(latlng){this._latlng = L.latLng(latlng);if(this._map){this._updatePosition();this._adjustPan();}return this;},getContent:function getContent(){return this._content;},setContent:function setContent(content){this._content = content;this.update();return this;},update:function update(){if(!this._map){return;}this._container.style.visibility = 'hidden';this._updateContent();this._updateLayout();this._updatePosition();this._container.style.visibility = '';this._adjustPan();},_getEvents:function _getEvents(){var events={viewreset:this._updatePosition};if(this._animated){events.zoomanim = this._zoomAnimation;}if('closeOnClick' in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick){events.preclick = this._close;}if(this.options.keepInView){events.moveend = this._adjustPan;}return events;},_close:function _close(){if(this._map){this._map.closePopup(this);}},_initLayout:function _initLayout(){var prefix='leaflet-popup',containerClass=prefix + ' ' + this.options.className + ' leaflet-zoom-' + (this._animated?'animated':'hide'),container=this._container = L.DomUtil.create('div',containerClass),closeButton;if(this.options.closeButton){closeButton = this._closeButton = L.DomUtil.create('a',prefix + '-close-button',container);closeButton.href = '#close';closeButton.innerHTML = '&#215;';L.DomEvent.disableClickPropagation(closeButton);L.DomEvent.on(closeButton,'click',this._onCloseButtonClick,this);}var wrapper=this._wrapper = L.DomUtil.create('div',prefix + '-content-wrapper',container);L.DomEvent.disableClickPropagation(wrapper);this._contentNode = L.DomUtil.create('div',prefix + '-content',wrapper);L.DomEvent.disableScrollPropagation(this._contentNode);L.DomEvent.on(wrapper,'contextmenu',L.DomEvent.stopPropagation);this._tipContainer = L.DomUtil.create('div',prefix + '-tip-container',container);this._tip = L.DomUtil.create('div',prefix + '-tip',this._tipContainer);},_updateContent:function _updateContent(){if(!this._content){return;}if(typeof this._content === 'string'){this._contentNode.innerHTML = this._content;}else {while(this._contentNode.hasChildNodes()) {this._contentNode.removeChild(this._contentNode.firstChild);}this._contentNode.appendChild(this._content);}this.fire('contentupdate');},_updateLayout:function _updateLayout(){var container=this._contentNode,style=container.style;style.width = '';style.whiteSpace = 'nowrap';var width=container.offsetWidth;width = Math.min(width,this.options.maxWidth);width = Math.max(width,this.options.minWidth);style.width = width + 1 + 'px';style.whiteSpace = '';style.height = '';var height=container.offsetHeight,maxHeight=this.options.maxHeight,scrolledClass='leaflet-popup-scrolled';if(maxHeight && height > maxHeight){style.height = maxHeight + 'px';L.DomUtil.addClass(container,scrolledClass);}else {L.DomUtil.removeClass(container,scrolledClass);}this._containerWidth = this._container.offsetWidth;},_updatePosition:function _updatePosition(){if(!this._map){return;}var pos=this._map.latLngToLayerPoint(this._latlng),animated=this._animated,offset=L.point(this.options.offset);if(animated){L.DomUtil.setPosition(this._container,pos);}this._containerBottom = -offset.y - (animated?0:pos.y);this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated?0:pos.x); // bottom position the popup in case the height of the popup changes (images loading etc)
	this._container.style.bottom = this._containerBottom + 'px';this._container.style.left = this._containerLeft + 'px';},_zoomAnimation:function _zoomAnimation(opt){var pos=this._map._latLngToNewLayerPoint(this._latlng,opt.zoom,opt.center);L.DomUtil.setPosition(this._container,pos);},_adjustPan:function _adjustPan(){if(!this.options.autoPan){return;}var map=this._map,containerHeight=this._container.offsetHeight,containerWidth=this._containerWidth,layerPos=new L.Point(this._containerLeft,-containerHeight - this._containerBottom);if(this._animated){layerPos._add(L.DomUtil.getPosition(this._container));}var containerPos=map.layerPointToContainerPoint(layerPos),padding=L.point(this.options.autoPanPadding),paddingTL=L.point(this.options.autoPanPaddingTopLeft || padding),paddingBR=L.point(this.options.autoPanPaddingBottomRight || padding),size=map.getSize(),dx=0,dy=0;if(containerPos.x + containerWidth + paddingBR.x > size.x){ // right
	dx = containerPos.x + containerWidth - size.x + paddingBR.x;}if(containerPos.x - dx - paddingTL.x < 0){ // left
	dx = containerPos.x - paddingTL.x;}if(containerPos.y + containerHeight + paddingBR.y > size.y){ // bottom
	dy = containerPos.y + containerHeight - size.y + paddingBR.y;}if(containerPos.y - dy - paddingTL.y < 0){ // top
	dy = containerPos.y - paddingTL.y;}if(dx || dy){map.fire('autopanstart').panBy([dx,dy]);}},_onCloseButtonClick:function _onCloseButtonClick(e){this._close();L.DomEvent.stop(e);}});L.popup = function(options,source){return new L.Popup(options,source);};L.Map.include({openPopup:function openPopup(popup,latlng,options){ // (Popup) or (String || HTMLElement, LatLng[, Object])
	this.closePopup();if(!(popup instanceof L.Popup)){var content=popup;popup = new L.Popup(options).setLatLng(latlng).setContent(content);}popup._isOpen = true;this._popup = popup;return this.addLayer(popup);},closePopup:function closePopup(popup){if(!popup || popup === this._popup){popup = this._popup;this._popup = null;}if(popup){this.removeLayer(popup);popup._isOpen = false;}return this;}}); /*
	 * Popup extension to L.Marker, adding popup-related methods.
	 */L.Marker.include({openPopup:function openPopup(){if(this._popup && this._map && !this._map.hasLayer(this._popup)){this._popup.setLatLng(this._latlng);this._map.openPopup(this._popup);}return this;},closePopup:function closePopup(){if(this._popup){this._popup._close();}return this;},togglePopup:function togglePopup(){if(this._popup){if(this._popup._isOpen){this.closePopup();}else {this.openPopup();}}return this;},bindPopup:function bindPopup(content,options){var anchor=L.point(this.options.icon.options.popupAnchor || [0,0]);anchor = anchor.add(L.Popup.prototype.options.offset);if(options && options.offset){anchor = anchor.add(options.offset);}options = L.extend({offset:anchor},options);if(!this._popupHandlersAdded){this.on('click',this.togglePopup,this).on('remove',this.closePopup,this).on('move',this._movePopup,this);this._popupHandlersAdded = true;}if(content instanceof L.Popup){L.setOptions(content,options);this._popup = content;content._source = this;}else {this._popup = new L.Popup(options,this).setContent(content);}return this;},setPopupContent:function setPopupContent(content){if(this._popup){this._popup.setContent(content);}return this;},unbindPopup:function unbindPopup(){if(this._popup){this._popup = null;this.off('click',this.togglePopup,this).off('remove',this.closePopup,this).off('move',this._movePopup,this);this._popupHandlersAdded = false;}return this;},getPopup:function getPopup(){return this._popup;},_movePopup:function _movePopup(e){this._popup.setLatLng(e.latlng);}}); /*
	 * L.LayerGroup is a class to combine several layers into one so that
	 * you can manipulate the group (e.g. add/remove it) as one layer.
	 */L.LayerGroup = L.Class.extend({initialize:function initialize(layers){this._layers = {};var i,len;if(layers){for(i = 0,len = layers.length;i < len;i++) {this.addLayer(layers[i]);}}},addLayer:function addLayer(layer){var id=this.getLayerId(layer);this._layers[id] = layer;if(this._map){this._map.addLayer(layer);}return this;},removeLayer:function removeLayer(layer){var id=layer in this._layers?layer:this.getLayerId(layer);if(this._map && this._layers[id]){this._map.removeLayer(this._layers[id]);}delete this._layers[id];return this;},hasLayer:function hasLayer(layer){if(!layer){return false;}return layer in this._layers || this.getLayerId(layer) in this._layers;},clearLayers:function clearLayers(){this.eachLayer(this.removeLayer,this);return this;},invoke:function invoke(methodName){var args=Array.prototype.slice.call(arguments,1),i,layer;for(i in this._layers) {layer = this._layers[i];if(layer[methodName]){layer[methodName].apply(layer,args);}}return this;},onAdd:function onAdd(map){this._map = map;this.eachLayer(map.addLayer,map);},onRemove:function onRemove(map){this.eachLayer(map.removeLayer,map);this._map = null;},addTo:function addTo(map){map.addLayer(this);return this;},eachLayer:function eachLayer(method,context){for(var i in this._layers) {method.call(context,this._layers[i]);}return this;},getLayer:function getLayer(id){return this._layers[id];},getLayers:function getLayers(){var layers=[];for(var i in this._layers) {layers.push(this._layers[i]);}return layers;},setZIndex:function setZIndex(zIndex){return this.invoke('setZIndex',zIndex);},getLayerId:function getLayerId(layer){return L.stamp(layer);}});L.layerGroup = function(layers){return new L.LayerGroup(layers);}; /*
	 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
	 * shared between a group of interactive layers (like vectors or markers).
	 */L.FeatureGroup = L.LayerGroup.extend({includes:L.Mixin.Events,statics:{EVENTS:'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'},addLayer:function addLayer(layer){if(this.hasLayer(layer)){return this;}if('on' in layer){layer.on(L.FeatureGroup.EVENTS,this._propagateEvent,this);}L.LayerGroup.prototype.addLayer.call(this,layer);if(this._popupContent && layer.bindPopup){layer.bindPopup(this._popupContent,this._popupOptions);}return this.fire('layeradd',{layer:layer});},removeLayer:function removeLayer(layer){if(!this.hasLayer(layer)){return this;}if(layer in this._layers){layer = this._layers[layer];}if('off' in layer){layer.off(L.FeatureGroup.EVENTS,this._propagateEvent,this);}L.LayerGroup.prototype.removeLayer.call(this,layer);if(this._popupContent){this.invoke('unbindPopup');}return this.fire('layerremove',{layer:layer});},bindPopup:function bindPopup(content,options){this._popupContent = content;this._popupOptions = options;return this.invoke('bindPopup',content,options);},openPopup:function openPopup(latlng){ // open popup on the first layer
	for(var id in this._layers) {this._layers[id].openPopup(latlng);break;}return this;},setStyle:function setStyle(style){return this.invoke('setStyle',style);},bringToFront:function bringToFront(){return this.invoke('bringToFront');},bringToBack:function bringToBack(){return this.invoke('bringToBack');},getBounds:function getBounds(){var bounds=new L.LatLngBounds();this.eachLayer(function(layer){bounds.extend(layer instanceof L.Marker?layer.getLatLng():layer.getBounds());});return bounds;},_propagateEvent:function _propagateEvent(e){e = L.extend({layer:e.target,target:this},e);this.fire(e.type,e);}});L.featureGroup = function(layers){return new L.FeatureGroup(layers);}; /*
	 * L.Path is a base class for rendering vector paths on a map. Inherited by Polyline, Circle, etc.
	 */L.Path = L.Class.extend({includes:[L.Mixin.Events],statics:{ // how much to extend the clip area around the map view
	// (relative to its size, e.g. 0.5 is half the screen in each direction)
	// set it so that SVG element doesn't exceed 1280px (vectors flicker on dragend if it is)
	CLIP_PADDING:(function(){var max=L.Browser.mobile?1280:2000,target=(max / Math.max(window.outerWidth,window.outerHeight) - 1) / 2;return Math.max(0,Math.min(0.5,target));})()},options:{stroke:true,color:'#0033ff',dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:0.5,fill:false,fillColor:null, //same as color by default
	fillOpacity:0.2,clickable:true},initialize:function initialize(options){L.setOptions(this,options);},onAdd:function onAdd(map){this._map = map;if(!this._container){this._initElements();this._initEvents();}this.projectLatlngs();this._updatePath();if(this._container){this._map._pathRoot.appendChild(this._container);}this.fire('add');map.on({'viewreset':this.projectLatlngs,'moveend':this._updatePath},this);},addTo:function addTo(map){map.addLayer(this);return this;},onRemove:function onRemove(map){map._pathRoot.removeChild(this._container); // Need to fire remove event before we set _map to null as the event hooks might need the object
	this.fire('remove');this._map = null;if(L.Browser.vml){this._container = null;this._stroke = null;this._fill = null;}map.off({'viewreset':this.projectLatlngs,'moveend':this._updatePath},this);},projectLatlngs:function projectLatlngs(){ // do all projection stuff here
	},setStyle:function setStyle(style){L.setOptions(this,style);if(this._container){this._updateStyle();}return this;},redraw:function redraw(){if(this._map){this.projectLatlngs();this._updatePath();}return this;}});L.Map.include({_updatePathViewport:function _updatePathViewport(){var p=L.Path.CLIP_PADDING,size=this.getSize(),panePos=L.DomUtil.getPosition(this._mapPane),min=panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),max=min.add(size.multiplyBy(1 + p * 2)._round());this._pathViewport = new L.Bounds(min,max);}}); /*
	 * Extends L.Path with SVG-specific rendering code.
	 */L.Path.SVG_NS = 'http://www.w3.org/2000/svg';L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS,'svg').createSVGRect);L.Path = L.Path.extend({statics:{SVG:L.Browser.svg},bringToFront:function bringToFront(){var root=this._map._pathRoot,path=this._container;if(path && root.lastChild !== path){root.appendChild(path);}return this;},bringToBack:function bringToBack(){var root=this._map._pathRoot,path=this._container,first=root.firstChild;if(path && first !== path){root.insertBefore(path,first);}return this;},getPathString:function getPathString(){ // form path string here
	},_createElement:function _createElement(name){return document.createElementNS(L.Path.SVG_NS,name);},_initElements:function _initElements(){this._map._initPathRoot();this._initPath();this._initStyle();},_initPath:function _initPath(){this._container = this._createElement('g');this._path = this._createElement('path');if(this.options.className){L.DomUtil.addClass(this._path,this.options.className);}this._container.appendChild(this._path);},_initStyle:function _initStyle(){if(this.options.stroke){this._path.setAttribute('stroke-linejoin','round');this._path.setAttribute('stroke-linecap','round');}if(this.options.fill){this._path.setAttribute('fill-rule','evenodd');}if(this.options.pointerEvents){this._path.setAttribute('pointer-events',this.options.pointerEvents);}if(!this.options.clickable && !this.options.pointerEvents){this._path.setAttribute('pointer-events','none');}this._updateStyle();},_updateStyle:function _updateStyle(){if(this.options.stroke){this._path.setAttribute('stroke',this.options.color);this._path.setAttribute('stroke-opacity',this.options.opacity);this._path.setAttribute('stroke-width',this.options.weight);if(this.options.dashArray){this._path.setAttribute('stroke-dasharray',this.options.dashArray);}else {this._path.removeAttribute('stroke-dasharray');}if(this.options.lineCap){this._path.setAttribute('stroke-linecap',this.options.lineCap);}if(this.options.lineJoin){this._path.setAttribute('stroke-linejoin',this.options.lineJoin);}}else {this._path.setAttribute('stroke','none');}if(this.options.fill){this._path.setAttribute('fill',this.options.fillColor || this.options.color);this._path.setAttribute('fill-opacity',this.options.fillOpacity);}else {this._path.setAttribute('fill','none');}},_updatePath:function _updatePath(){var str=this.getPathString();if(!str){ // fix webkit empty string parsing bug
	str = 'M0 0';}this._path.setAttribute('d',str);}, // TODO remove duplication with L.Map
	_initEvents:function _initEvents(){if(this.options.clickable){if(L.Browser.svg || !L.Browser.vml){L.DomUtil.addClass(this._path,'leaflet-clickable');}L.DomEvent.on(this._container,'click',this._onMouseClick,this);var events=['dblclick','mousedown','mouseover','mouseout','mousemove','contextmenu'];for(var i=0;i < events.length;i++) {L.DomEvent.on(this._container,events[i],this._fireMouseEvent,this);}}},_onMouseClick:function _onMouseClick(e){if(this._map.dragging && this._map.dragging.moved()){return;}this._fireMouseEvent(e);},_fireMouseEvent:function _fireMouseEvent(e){if(!this._map || !this.hasEventListeners(e.type)){return;}var map=this._map,containerPoint=map.mouseEventToContainerPoint(e),layerPoint=map.containerPointToLayerPoint(containerPoint),latlng=map.layerPointToLatLng(layerPoint);this.fire(e.type,{latlng:latlng,layerPoint:layerPoint,containerPoint:containerPoint,originalEvent:e});if(e.type === 'contextmenu'){L.DomEvent.preventDefault(e);}if(e.type !== 'mousemove'){L.DomEvent.stopPropagation(e);}}});L.Map.include({_initPathRoot:function _initPathRoot(){if(!this._pathRoot){this._pathRoot = L.Path.prototype._createElement('svg');this._panes.overlayPane.appendChild(this._pathRoot);if(this.options.zoomAnimation && L.Browser.any3d){L.DomUtil.addClass(this._pathRoot,'leaflet-zoom-animated');this.on({'zoomanim':this._animatePathZoom,'zoomend':this._endPathZoom});}else {L.DomUtil.addClass(this._pathRoot,'leaflet-zoom-hide');}this.on('moveend',this._updateSvgViewport);this._updateSvgViewport();}},_animatePathZoom:function _animatePathZoom(e){var scale=this.getZoomScale(e.zoom),offset=this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);this._pathRoot.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';this._pathZooming = true;},_endPathZoom:function _endPathZoom(){this._pathZooming = false;},_updateSvgViewport:function _updateSvgViewport(){if(this._pathZooming){ // Do not update SVGs while a zoom animation is going on otherwise the animation will break.
	// When the zoom animation ends we will be updated again anyway
	// This fixes the case where you do a momentum move and zoom while the move is still ongoing.
	return;}this._updatePathViewport();var vp=this._pathViewport,min=vp.min,max=vp.max,width=max.x - min.x,height=max.y - min.y,root=this._pathRoot,pane=this._panes.overlayPane; // Hack to make flicker on drag end on mobile webkit less irritating
	if(L.Browser.mobileWebkit){pane.removeChild(root);}L.DomUtil.setPosition(root,min);root.setAttribute('width',width);root.setAttribute('height',height);root.setAttribute('viewBox',[min.x,min.y,width,height].join(' '));if(L.Browser.mobileWebkit){pane.appendChild(root);}}}); /*
	 * Popup extension to L.Path (polylines, polygons, circles), adding popup-related methods.
	 */L.Path.include({bindPopup:function bindPopup(content,options){if(content instanceof L.Popup){this._popup = content;}else {if(!this._popup || options){this._popup = new L.Popup(options,this);}this._popup.setContent(content);}if(!this._popupHandlersAdded){this.on('click',this._openPopup,this).on('remove',this.closePopup,this);this._popupHandlersAdded = true;}return this;},unbindPopup:function unbindPopup(){if(this._popup){this._popup = null;this.off('click',this._openPopup).off('remove',this.closePopup);this._popupHandlersAdded = false;}return this;},openPopup:function openPopup(latlng){if(this._popup){ // open the popup from one of the path's points if not specified
	latlng = latlng || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)];this._openPopup({latlng:latlng});}return this;},closePopup:function closePopup(){if(this._popup){this._popup._close();}return this;},_openPopup:function _openPopup(e){this._popup.setLatLng(e.latlng);this._map.openPopup(this._popup);}}); /*
	 * Vector rendering for IE6-8 through VML.
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */L.Browser.vml = !L.Browser.svg && (function(){try{var div=document.createElement('div');div.innerHTML = '<v:shape adj="1"/>';var shape=div.firstChild;shape.style.behavior = 'url(#default#VML)';return shape && typeof shape.adj === 'object';}catch(e) {return false;}})();L.Path = L.Browser.svg || !L.Browser.vml?L.Path:L.Path.extend({statics:{VML:true,CLIP_PADDING:0.02},_createElement:(function(){try{document.namespaces.add('lvml','urn:schemas-microsoft-com:vml');return function(name){return document.createElement('<lvml:' + name + ' class="lvml">');};}catch(e) {return function(name){return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');};}})(),_initPath:function _initPath(){var container=this._container = this._createElement('shape');L.DomUtil.addClass(container,'leaflet-vml-shape' + (this.options.className?' ' + this.options.className:''));if(this.options.clickable){L.DomUtil.addClass(container,'leaflet-clickable');}container.coordsize = '1 1';this._path = this._createElement('path');container.appendChild(this._path);this._map._pathRoot.appendChild(container);},_initStyle:function _initStyle(){this._updateStyle();},_updateStyle:function _updateStyle(){var stroke=this._stroke,fill=this._fill,options=this.options,container=this._container;container.stroked = options.stroke;container.filled = options.fill;if(options.stroke){if(!stroke){stroke = this._stroke = this._createElement('stroke');stroke.endcap = 'round';container.appendChild(stroke);}stroke.weight = options.weight + 'px';stroke.color = options.color;stroke.opacity = options.opacity;if(options.dashArray){stroke.dashStyle = L.Util.isArray(options.dashArray)?options.dashArray.join(' '):options.dashArray.replace(/( *, *)/g,' ');}else {stroke.dashStyle = '';}if(options.lineCap){stroke.endcap = options.lineCap.replace('butt','flat');}if(options.lineJoin){stroke.joinstyle = options.lineJoin;}}else if(stroke){container.removeChild(stroke);this._stroke = null;}if(options.fill){if(!fill){fill = this._fill = this._createElement('fill');container.appendChild(fill);}fill.color = options.fillColor || options.color;fill.opacity = options.fillOpacity;}else if(fill){container.removeChild(fill);this._fill = null;}},_updatePath:function _updatePath(){var style=this._container.style;style.display = 'none';this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
	style.display = '';}});L.Map.include(L.Browser.svg || !L.Browser.vml?{}:{_initPathRoot:function _initPathRoot(){if(this._pathRoot){return;}var root=this._pathRoot = document.createElement('div');root.className = 'leaflet-vml-container';this._panes.overlayPane.appendChild(root);this.on('moveend',this._updatePathViewport);this._updatePathViewport();}}); /*
	 * Vector rendering for all browsers that support canvas.
	 */L.Browser.canvas = (function(){return !!document.createElement('canvas').getContext;})();L.Path = L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas?L.Path:L.Path.extend({statics:{ //CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
	CANVAS:true,SVG:false},redraw:function redraw(){if(this._map){this.projectLatlngs();this._requestUpdate();}return this;},setStyle:function setStyle(style){L.setOptions(this,style);if(this._map){this._updateStyle();this._requestUpdate();}return this;},onRemove:function onRemove(map){map.off('viewreset',this.projectLatlngs,this).off('moveend',this._updatePath,this);if(this.options.clickable){this._map.off('click',this._onClick,this);this._map.off('mousemove',this._onMouseMove,this);}this._requestUpdate();this.fire('remove');this._map = null;},_requestUpdate:function _requestUpdate(){if(this._map && !L.Path._updateRequest){L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd,this._map);}},_fireMapMoveEnd:function _fireMapMoveEnd(){L.Path._updateRequest = null;this.fire('moveend');},_initElements:function _initElements(){this._map._initPathRoot();this._ctx = this._map._canvasCtx;},_updateStyle:function _updateStyle(){var options=this.options;if(options.stroke){this._ctx.lineWidth = options.weight;this._ctx.strokeStyle = options.color;}if(options.fill){this._ctx.fillStyle = options.fillColor || options.color;}if(options.lineCap){this._ctx.lineCap = options.lineCap;}if(options.lineJoin){this._ctx.lineJoin = options.lineJoin;}},_drawPath:function _drawPath(){var i,j,len,len2,point,drawMethod;this._ctx.beginPath();for(i = 0,len = this._parts.length;i < len;i++) {for(j = 0,len2 = this._parts[i].length;j < len2;j++) {point = this._parts[i][j];drawMethod = (j === 0?'move':'line') + 'To';this._ctx[drawMethod](point.x,point.y);} // TODO refactor ugly hack
	if(this instanceof L.Polygon){this._ctx.closePath();}}},_checkIfEmpty:function _checkIfEmpty(){return !this._parts.length;},_updatePath:function _updatePath(){if(this._checkIfEmpty()){return;}var ctx=this._ctx,options=this.options;this._drawPath();ctx.save();this._updateStyle();if(options.fill){ctx.globalAlpha = options.fillOpacity;ctx.fill(options.fillRule || 'evenodd');}if(options.stroke){ctx.globalAlpha = options.opacity;ctx.stroke();}ctx.restore(); // TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},_initEvents:function _initEvents(){if(this.options.clickable){this._map.on('mousemove',this._onMouseMove,this);this._map.on('click dblclick contextmenu',this._fireMouseEvent,this);}},_fireMouseEvent:function _fireMouseEvent(e){if(this._containsPoint(e.layerPoint)){this.fire(e.type,e);}},_onMouseMove:function _onMouseMove(e){if(!this._map || this._map._animatingZoom){return;} // TODO don't do on each move
	if(this._containsPoint(e.layerPoint)){this._ctx.canvas.style.cursor = 'pointer';this._mouseInside = true;this.fire('mouseover',e);}else if(this._mouseInside){this._ctx.canvas.style.cursor = '';this._mouseInside = false;this.fire('mouseout',e);}}});L.Map.include(L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas?{}:{_initPathRoot:function _initPathRoot(){var root=this._pathRoot,ctx;if(!root){root = this._pathRoot = document.createElement('canvas');root.style.position = 'absolute';ctx = this._canvasCtx = root.getContext('2d');ctx.lineCap = 'round';ctx.lineJoin = 'round';this._panes.overlayPane.appendChild(root);if(this.options.zoomAnimation){this._pathRoot.className = 'leaflet-zoom-animated';this.on('zoomanim',this._animatePathZoom);this.on('zoomend',this._endPathZoom);}this.on('moveend',this._updateCanvasViewport);this._updateCanvasViewport();}},_updateCanvasViewport:function _updateCanvasViewport(){ // don't redraw while zooming. See _updateSvgViewport for more details
	if(this._pathZooming){return;}this._updatePathViewport();var vp=this._pathViewport,min=vp.min,size=vp.max.subtract(min),root=this._pathRoot; //TODO check if this works properly on mobile webkit
	L.DomUtil.setPosition(root,min);root.width = size.x;root.height = size.y;root.getContext('2d').translate(-min.x,-min.y);}}); /*
	 * L.LineUtil contains different utility functions for line segments
	 * and polylines (clipping, simplification, distances, etc.)
	 */ /*jshint bitwise:false */ // allow bitwise operations for this file
	L.LineUtil = { // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.
	simplify:function simplify( /*Point[]*/points, /*Number*/tolerance){if(!tolerance || !points.length){return points.slice();}var sqTolerance=tolerance * tolerance; // stage 1: vertex reduction
	points = this._reducePoints(points,sqTolerance); // stage 2: Douglas-Peucker simplification
	points = this._simplifyDP(points,sqTolerance);return points;}, // distance from a point to a segment between two points
	pointToSegmentDistance:function pointToSegmentDistance( /*Point*/p, /*Point*/p1, /*Point*/p2){return Math.sqrt(this._sqClosestPointOnSegment(p,p1,p2,true));},closestPointOnSegment:function closestPointOnSegment( /*Point*/p, /*Point*/p1, /*Point*/p2){return this._sqClosestPointOnSegment(p,p1,p2);}, // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_simplifyDP:function _simplifyDP(points,sqTolerance){var len=points.length,ArrayConstructor=typeof Uint8Array !== undefined + ''?Uint8Array:Array,markers=new ArrayConstructor(len);markers[0] = markers[len - 1] = 1;this._simplifyDPStep(points,markers,sqTolerance,0,len - 1);var i,newPoints=[];for(i = 0;i < len;i++) {if(markers[i]){newPoints.push(points[i]);}}return newPoints;},_simplifyDPStep:function _simplifyDPStep(points,markers,sqTolerance,first,last){var maxSqDist=0,index,i,sqDist;for(i = first + 1;i <= last - 1;i++) {sqDist = this._sqClosestPointOnSegment(points[i],points[first],points[last],true);if(sqDist > maxSqDist){index = i;maxSqDist = sqDist;}}if(maxSqDist > sqTolerance){markers[index] = 1;this._simplifyDPStep(points,markers,sqTolerance,first,index);this._simplifyDPStep(points,markers,sqTolerance,index,last);}}, // reduce points that are too close to each other to a single point
	_reducePoints:function _reducePoints(points,sqTolerance){var reducedPoints=[points[0]];for(var i=1,prev=0,len=points.length;i < len;i++) {if(this._sqDist(points[i],points[prev]) > sqTolerance){reducedPoints.push(points[i]);prev = i;}}if(prev < len - 1){reducedPoints.push(points[len - 1]);}return reducedPoints;}, // Cohen-Sutherland line clipping algorithm.
	// Used to avoid rendering parts of a polyline that are not currently visible.
	clipSegment:function clipSegment(a,b,bounds,useLastCode){var codeA=useLastCode?this._lastCode:this._getBitCode(a,bounds),codeB=this._getBitCode(b,bounds),codeOut,p,newCode; // save 2nd code to avoid calculating it on the next segment
	this._lastCode = codeB;while(true) { // if a,b is inside the clip window (trivial accept)
	if(!(codeA | codeB)){return [a,b]; // if a,b is outside the clip window (trivial reject)
	}else if(codeA & codeB){return false; // other cases
	}else {codeOut = codeA || codeB;p = this._getEdgeIntersection(a,b,codeOut,bounds);newCode = this._getBitCode(p,bounds);if(codeOut === codeA){a = p;codeA = newCode;}else {b = p;codeB = newCode;}}}},_getEdgeIntersection:function _getEdgeIntersection(a,b,code,bounds){var dx=b.x - a.x,dy=b.y - a.y,min=bounds.min,max=bounds.max;if(code & 8){ // top
	return new L.Point(a.x + dx * (max.y - a.y) / dy,max.y);}else if(code & 4){ // bottom
	return new L.Point(a.x + dx * (min.y - a.y) / dy,min.y);}else if(code & 2){ // right
	return new L.Point(max.x,a.y + dy * (max.x - a.x) / dx);}else if(code & 1){ // left
	return new L.Point(min.x,a.y + dy * (min.x - a.x) / dx);}},_getBitCode:function _getBitCode( /*Point*/p,bounds){var code=0;if(p.x < bounds.min.x){ // left
	code |= 1;}else if(p.x > bounds.max.x){ // right
	code |= 2;}if(p.y < bounds.min.y){ // bottom
	code |= 4;}else if(p.y > bounds.max.y){ // top
	code |= 8;}return code;}, // square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist:function _sqDist(p1,p2){var dx=p2.x - p1.x,dy=p2.y - p1.y;return dx * dx + dy * dy;}, // return closest point on segment or distance to that point
	_sqClosestPointOnSegment:function _sqClosestPointOnSegment(p,p1,p2,sqDist){var x=p1.x,y=p1.y,dx=p2.x - x,dy=p2.y - y,dot=dx * dx + dy * dy,t;if(dot > 0){t = ((p.x - x) * dx + (p.y - y) * dy) / dot;if(t > 1){x = p2.x;y = p2.y;}else if(t > 0){x += dx * t;y += dy * t;}}dx = p.x - x;dy = p.y - y;return sqDist?dx * dx + dy * dy:new L.Point(x,y);}}; /*
	 * L.Polyline is used to display polylines on a map.
	 */L.Polyline = L.Path.extend({initialize:function initialize(latlngs,options){L.Path.prototype.initialize.call(this,options);this._latlngs = this._convertLatLngs(latlngs);},options:{ // how much to simplify the polyline on each zoom level
	// more = better performance and smoother look, less = more accurate
	smoothFactor:1.0,noClip:false},projectLatlngs:function projectLatlngs(){this._originalPoints = [];for(var i=0,len=this._latlngs.length;i < len;i++) {this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);}},getPathString:function getPathString(){for(var i=0,len=this._parts.length,str='';i < len;i++) {str += this._getPathPartStr(this._parts[i]);}return str;},getLatLngs:function getLatLngs(){return this._latlngs;},setLatLngs:function setLatLngs(latlngs){this._latlngs = this._convertLatLngs(latlngs);return this.redraw();},addLatLng:function addLatLng(latlng){this._latlngs.push(L.latLng(latlng));return this.redraw();},spliceLatLngs:function spliceLatLngs(){ // (Number index, Number howMany)
	var removed=[].splice.apply(this._latlngs,arguments);this._convertLatLngs(this._latlngs,true);this.redraw();return removed;},closestLayerPoint:function closestLayerPoint(p){var minDistance=Infinity,parts=this._parts,p1,p2,minPoint=null;for(var j=0,jLen=parts.length;j < jLen;j++) {var points=parts[j];for(var i=1,len=points.length;i < len;i++) {p1 = points[i - 1];p2 = points[i];var sqDist=L.LineUtil._sqClosestPointOnSegment(p,p1,p2,true);if(sqDist < minDistance){minDistance = sqDist;minPoint = L.LineUtil._sqClosestPointOnSegment(p,p1,p2);}}}if(minPoint){minPoint.distance = Math.sqrt(minDistance);}return minPoint;},getBounds:function getBounds(){return new L.LatLngBounds(this.getLatLngs());},_convertLatLngs:function _convertLatLngs(latlngs,overwrite){var i,len,target=overwrite?latlngs:[];for(i = 0,len = latlngs.length;i < len;i++) {if(L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== 'number'){return;}target[i] = L.latLng(latlngs[i]);}return target;},_initEvents:function _initEvents(){L.Path.prototype._initEvents.call(this);},_getPathPartStr:function _getPathPartStr(points){var round=L.Path.VML;for(var j=0,len2=points.length,str='',p;j < len2;j++) {p = points[j];if(round){p._round();}str += (j?'L':'M') + p.x + ' ' + p.y;}return str;},_clipPoints:function _clipPoints(){var points=this._originalPoints,len=points.length,i,k,segment;if(this.options.noClip){this._parts = [points];return;}this._parts = [];var parts=this._parts,vp=this._map._pathViewport,lu=L.LineUtil;for(i = 0,k = 0;i < len - 1;i++) {segment = lu.clipSegment(points[i],points[i + 1],vp,i);if(!segment){continue;}parts[k] = parts[k] || [];parts[k].push(segment[0]); // if segment goes out of screen, or it's the last one, it's the end of the line part
	if(segment[1] !== points[i + 1] || i === len - 2){parts[k].push(segment[1]);k++;}}}, // simplify each clipped part of the polyline
	_simplifyPoints:function _simplifyPoints(){var parts=this._parts,lu=L.LineUtil;for(var i=0,len=parts.length;i < len;i++) {parts[i] = lu.simplify(parts[i],this.options.smoothFactor);}},_updatePath:function _updatePath(){if(!this._map){return;}this._clipPoints();this._simplifyPoints();L.Path.prototype._updatePath.call(this);}});L.polyline = function(latlngs,options){return new L.Polyline(latlngs,options);}; /*
	 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
	 */ /*jshint bitwise:false */ // allow bitwise operations here
	L.PolyUtil = {}; /*
	 * Sutherland-Hodgeman polygon clipping algorithm.
	 * Used to avoid rendering parts of a polygon that are not currently visible.
	 */L.PolyUtil.clipPolygon = function(points,bounds){var clippedPoints,edges=[1,4,2,8],i,j,k,a,b,len,edge,p,lu=L.LineUtil;for(i = 0,len = points.length;i < len;i++) {points[i]._code = lu._getBitCode(points[i],bounds);} // for each edge (left, bottom, right, top)
	for(k = 0;k < 4;k++) {edge = edges[k];clippedPoints = [];for(i = 0,len = points.length,j = len - 1;i < len;j = i++) {a = points[i];b = points[j]; // if a is inside the clip window
	if(!(a._code & edge)){ // if b is outside the clip window (a->b goes out of screen)
	if(b._code & edge){p = lu._getEdgeIntersection(b,a,edge,bounds);p._code = lu._getBitCode(p,bounds);clippedPoints.push(p);}clippedPoints.push(a); // else if b is inside the clip window (a->b enters the screen)
	}else if(!(b._code & edge)){p = lu._getEdgeIntersection(b,a,edge,bounds);p._code = lu._getBitCode(p,bounds);clippedPoints.push(p);}}points = clippedPoints;}return points;}; /*
	 * L.Polygon is used to display polygons on a map.
	 */L.Polygon = L.Polyline.extend({options:{fill:true},initialize:function initialize(latlngs,options){L.Polyline.prototype.initialize.call(this,latlngs,options);this._initWithHoles(latlngs);},_initWithHoles:function _initWithHoles(latlngs){var i,len,hole;if(latlngs && L.Util.isArray(latlngs[0]) && typeof latlngs[0][0] !== 'number'){this._latlngs = this._convertLatLngs(latlngs[0]);this._holes = latlngs.slice(1);for(i = 0,len = this._holes.length;i < len;i++) {hole = this._holes[i] = this._convertLatLngs(this._holes[i]);if(hole[0].equals(hole[hole.length - 1])){hole.pop();}}} // filter out last point if its equal to the first one
	latlngs = this._latlngs;if(latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])){latlngs.pop();}},projectLatlngs:function projectLatlngs(){L.Polyline.prototype.projectLatlngs.call(this); // project polygon holes points
	// TODO move this logic to Polyline to get rid of duplication
	this._holePoints = [];if(!this._holes){return;}var i,j,len,len2;for(i = 0,len = this._holes.length;i < len;i++) {this._holePoints[i] = [];for(j = 0,len2 = this._holes[i].length;j < len2;j++) {this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);}}},setLatLngs:function setLatLngs(latlngs){if(latlngs && L.Util.isArray(latlngs[0]) && typeof latlngs[0][0] !== 'number'){this._initWithHoles(latlngs);return this.redraw();}else {return L.Polyline.prototype.setLatLngs.call(this,latlngs);}},_clipPoints:function _clipPoints(){var points=this._originalPoints,newParts=[];this._parts = [points].concat(this._holePoints);if(this.options.noClip){return;}for(var i=0,len=this._parts.length;i < len;i++) {var clipped=L.PolyUtil.clipPolygon(this._parts[i],this._map._pathViewport);if(clipped.length){newParts.push(clipped);}}this._parts = newParts;},_getPathPartStr:function _getPathPartStr(points){var str=L.Polyline.prototype._getPathPartStr.call(this,points);return str + (L.Browser.svg?'z':'x');}});L.polygon = function(latlngs,options){return new L.Polygon(latlngs,options);}; /*
	 * Contains L.MultiPolyline and L.MultiPolygon layers.
	 */(function(){function createMulti(Klass){return L.FeatureGroup.extend({initialize:function initialize(latlngs,options){this._layers = {};this._options = options;this.setLatLngs(latlngs);},setLatLngs:function setLatLngs(latlngs){var i=0,len=latlngs.length;this.eachLayer(function(layer){if(i < len){layer.setLatLngs(latlngs[i++]);}else {this.removeLayer(layer);}},this);while(i < len) {this.addLayer(new Klass(latlngs[i++],this._options));}return this;},getLatLngs:function getLatLngs(){var latlngs=[];this.eachLayer(function(layer){latlngs.push(layer.getLatLngs());});return latlngs;}});}L.MultiPolyline = createMulti(L.Polyline);L.MultiPolygon = createMulti(L.Polygon);L.multiPolyline = function(latlngs,options){return new L.MultiPolyline(latlngs,options);};L.multiPolygon = function(latlngs,options){return new L.MultiPolygon(latlngs,options);};})(); /*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */L.Rectangle = L.Polygon.extend({initialize:function initialize(latLngBounds,options){L.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(latLngBounds),options);},setBounds:function setBounds(latLngBounds){this.setLatLngs(this._boundsToLatLngs(latLngBounds));},_boundsToLatLngs:function _boundsToLatLngs(latLngBounds){latLngBounds = L.latLngBounds(latLngBounds);return [latLngBounds.getSouthWest(),latLngBounds.getNorthWest(),latLngBounds.getNorthEast(),latLngBounds.getSouthEast()];}});L.rectangle = function(latLngBounds,options){return new L.Rectangle(latLngBounds,options);}; /*
	 * L.Circle is a circle overlay (with a certain radius in meters).
	 */L.Circle = L.Path.extend({initialize:function initialize(latlng,radius,options){L.Path.prototype.initialize.call(this,options);this._latlng = L.latLng(latlng);this._mRadius = radius;},options:{fill:true},setLatLng:function setLatLng(latlng){this._latlng = L.latLng(latlng);return this.redraw();},setRadius:function setRadius(radius){this._mRadius = radius;return this.redraw();},projectLatlngs:function projectLatlngs(){var lngRadius=this._getLngRadius(),latlng=this._latlng,pointLeft=this._map.latLngToLayerPoint([latlng.lat,latlng.lng - lngRadius]);this._point = this._map.latLngToLayerPoint(latlng);this._radius = Math.max(this._point.x - pointLeft.x,1);},getBounds:function getBounds(){var lngRadius=this._getLngRadius(),latRadius=this._mRadius / 40075017 * 360,latlng=this._latlng;return new L.LatLngBounds([latlng.lat - latRadius,latlng.lng - lngRadius],[latlng.lat + latRadius,latlng.lng + lngRadius]);},getLatLng:function getLatLng(){return this._latlng;},getPathString:function getPathString(){var p=this._point,r=this._radius;if(this._checkIfEmpty()){return '';}if(L.Browser.svg){return 'M' + p.x + ',' + (p.y - r) + 'A' + r + ',' + r + ',0,1,1,' + (p.x - 0.1) + ',' + (p.y - r) + ' z';}else {p._round();r = Math.round(r);return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + 65535 * 360;}},getRadius:function getRadius(){return this._mRadius;}, // TODO Earth hardcoded, move into projection code!
	_getLatRadius:function _getLatRadius(){return this._mRadius / 40075017 * 360;},_getLngRadius:function _getLngRadius(){return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);},_checkIfEmpty:function _checkIfEmpty(){if(!this._map){return false;}var vp=this._map._pathViewport,r=this._radius,p=this._point;return p.x - r > vp.max.x || p.y - r > vp.max.y || p.x + r < vp.min.x || p.y + r < vp.min.y;}});L.circle = function(latlng,radius,options){return new L.Circle(latlng,radius,options);}; /*
	 * L.CircleMarker is a circle overlay with a permanent pixel radius.
	 */L.CircleMarker = L.Circle.extend({options:{radius:10,weight:2},initialize:function initialize(latlng,options){L.Circle.prototype.initialize.call(this,latlng,null,options);this._radius = this.options.radius;},projectLatlngs:function projectLatlngs(){this._point = this._map.latLngToLayerPoint(this._latlng);},_updateStyle:function _updateStyle(){L.Circle.prototype._updateStyle.call(this);this.setRadius(this.options.radius);},setLatLng:function setLatLng(latlng){L.Circle.prototype.setLatLng.call(this,latlng);if(this._popup && this._popup._isOpen){this._popup.setLatLng(latlng);}return this;},setRadius:function setRadius(radius){this.options.radius = this._radius = radius;return this.redraw();},getRadius:function getRadius(){return this._radius;}});L.circleMarker = function(latlng,options){return new L.CircleMarker(latlng,options);}; /*
	 * Extends L.Polyline to be able to manually detect clicks on Canvas-rendered polylines.
	 */L.Polyline.include(!L.Path.CANVAS?{}:{_containsPoint:function _containsPoint(p,closed){var i,j,k,len,len2,dist,part,w=this.options.weight / 2;if(L.Browser.touch){w += 10; // polyline click tolerance on touch devices
	}for(i = 0,len = this._parts.length;i < len;i++) {part = this._parts[i];for(j = 0,len2 = part.length,k = len2 - 1;j < len2;k = j++) {if(!closed && j === 0){continue;}dist = L.LineUtil.pointToSegmentDistance(p,part[k],part[j]);if(dist <= w){return true;}}}return false;}}); /*
	 * Extends L.Polygon to be able to manually detect clicks on Canvas-rendered polygons.
	 */L.Polygon.include(!L.Path.CANVAS?{}:{_containsPoint:function _containsPoint(p){var inside=false,part,p1,p2,i,j,k,len,len2; // TODO optimization: check if within bounds first
	if(L.Polyline.prototype._containsPoint.call(this,p,true)){ // click on polygon border
	return true;} // ray casting algorithm for detecting if point is in polygon
	for(i = 0,len = this._parts.length;i < len;i++) {part = this._parts[i];for(j = 0,len2 = part.length,k = len2 - 1;j < len2;k = j++) {p1 = part[j];p2 = part[k];if(p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x){inside = !inside;}}}return inside;}}); /*
	 * Extends L.Circle with Canvas-specific code.
	 */L.Circle.include(!L.Path.CANVAS?{}:{_drawPath:function _drawPath(){var p=this._point;this._ctx.beginPath();this._ctx.arc(p.x,p.y,this._radius,0,Math.PI * 2,false);},_containsPoint:function _containsPoint(p){var center=this._point,w2=this.options.stroke?this.options.weight / 2:0;return p.distanceTo(center) <= this._radius + w2;}}); /*
	 * CircleMarker canvas specific drawing parts.
	 */L.CircleMarker.include(!L.Path.CANVAS?{}:{_updateStyle:function _updateStyle(){L.Path.prototype._updateStyle.call(this);}}); /*
	 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
	 */L.GeoJSON = L.FeatureGroup.extend({initialize:function initialize(geojson,options){L.setOptions(this,options);this._layers = {};if(geojson){this.addData(geojson);}},addData:function addData(geojson){var features=L.Util.isArray(geojson)?geojson:geojson.features,i,len,feature;if(features){for(i = 0,len = features.length;i < len;i++) { // Only add this if geometry or geometries are set and not null
	feature = features[i];if(feature.geometries || feature.geometry || feature.features || feature.coordinates){this.addData(features[i]);}}return this;}var options=this.options;if(options.filter && !options.filter(geojson)){return;}var layer=L.GeoJSON.geometryToLayer(geojson,options.pointToLayer,options.coordsToLatLng,options);layer.feature = L.GeoJSON.asFeature(geojson);layer.defaultOptions = layer.options;this.resetStyle(layer);if(options.onEachFeature){options.onEachFeature(geojson,layer);}return this.addLayer(layer);},resetStyle:function resetStyle(layer){var style=this.options.style;if(style){ // reset any custom styles
	L.Util.extend(layer.options,layer.defaultOptions);this._setLayerStyle(layer,style);}},setStyle:function setStyle(style){this.eachLayer(function(layer){this._setLayerStyle(layer,style);},this);},_setLayerStyle:function _setLayerStyle(layer,style){if(typeof style === 'function'){style = style(layer.feature);}if(layer.setStyle){layer.setStyle(style);}}});L.extend(L.GeoJSON,{geometryToLayer:function geometryToLayer(geojson,pointToLayer,coordsToLatLng,vectorOptions){var geometry=geojson.type === 'Feature'?geojson.geometry:geojson,coords=geometry.coordinates,layers=[],latlng,latlngs,i,len;coordsToLatLng = coordsToLatLng || this.coordsToLatLng;switch(geometry.type){case 'Point':latlng = coordsToLatLng(coords);return pointToLayer?pointToLayer(geojson,latlng):new L.Marker(latlng);case 'MultiPoint':for(i = 0,len = coords.length;i < len;i++) {latlng = coordsToLatLng(coords[i]);layers.push(pointToLayer?pointToLayer(geojson,latlng):new L.Marker(latlng));}return new L.FeatureGroup(layers);case 'LineString':latlngs = this.coordsToLatLngs(coords,0,coordsToLatLng);return new L.Polyline(latlngs,vectorOptions);case 'Polygon':if(coords.length === 2 && !coords[1].length){throw new Error('Invalid GeoJSON object.');}latlngs = this.coordsToLatLngs(coords,1,coordsToLatLng);return new L.Polygon(latlngs,vectorOptions);case 'MultiLineString':latlngs = this.coordsToLatLngs(coords,1,coordsToLatLng);return new L.MultiPolyline(latlngs,vectorOptions);case 'MultiPolygon':latlngs = this.coordsToLatLngs(coords,2,coordsToLatLng);return new L.MultiPolygon(latlngs,vectorOptions);case 'GeometryCollection':for(i = 0,len = geometry.geometries.length;i < len;i++) {layers.push(this.geometryToLayer({geometry:geometry.geometries[i],type:'Feature',properties:geojson.properties},pointToLayer,coordsToLatLng,vectorOptions));}return new L.FeatureGroup(layers);default:throw new Error('Invalid GeoJSON object.');}},coordsToLatLng:function coordsToLatLng(coords){ // (Array[, Boolean]) -> LatLng
	return new L.LatLng(coords[1],coords[0],coords[2]);},coordsToLatLngs:function coordsToLatLngs(coords,levelsDeep,coordsToLatLng){ // (Array[, Number, Function]) -> Array
	var latlng,i,len,latlngs=[];for(i = 0,len = coords.length;i < len;i++) {latlng = levelsDeep?this.coordsToLatLngs(coords[i],levelsDeep - 1,coordsToLatLng):(coordsToLatLng || this.coordsToLatLng)(coords[i]);latlngs.push(latlng);}return latlngs;},latLngToCoords:function latLngToCoords(latlng){var coords=[latlng.lng,latlng.lat];if(latlng.alt !== undefined){coords.push(latlng.alt);}return coords;},latLngsToCoords:function latLngsToCoords(latLngs){var coords=[];for(var i=0,len=latLngs.length;i < len;i++) {coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));}return coords;},getFeature:function getFeature(layer,newGeometry){return layer.feature?L.extend({},layer.feature,{geometry:newGeometry}):L.GeoJSON.asFeature(newGeometry);},asFeature:function asFeature(geoJSON){if(geoJSON.type === 'Feature'){return geoJSON;}return {type:'Feature',properties:{},geometry:geoJSON};}});var PointToGeoJSON={toGeoJSON:function toGeoJSON(){return L.GeoJSON.getFeature(this,{type:'Point',coordinates:L.GeoJSON.latLngToCoords(this.getLatLng())});}};L.Marker.include(PointToGeoJSON);L.Circle.include(PointToGeoJSON);L.CircleMarker.include(PointToGeoJSON);L.Polyline.include({toGeoJSON:function toGeoJSON(){return L.GeoJSON.getFeature(this,{type:'LineString',coordinates:L.GeoJSON.latLngsToCoords(this.getLatLngs())});}});L.Polygon.include({toGeoJSON:function toGeoJSON(){var coords=[L.GeoJSON.latLngsToCoords(this.getLatLngs())],i,len,hole;coords[0].push(coords[0][0]);if(this._holes){for(i = 0,len = this._holes.length;i < len;i++) {hole = L.GeoJSON.latLngsToCoords(this._holes[i]);hole.push(hole[0]);coords.push(hole);}}return L.GeoJSON.getFeature(this,{type:'Polygon',coordinates:coords});}});(function(){function multiToGeoJSON(type){return function(){var coords=[];this.eachLayer(function(layer){coords.push(layer.toGeoJSON().geometry.coordinates);});return L.GeoJSON.getFeature(this,{type:type,coordinates:coords});};}L.MultiPolyline.include({toGeoJSON:multiToGeoJSON('MultiLineString')});L.MultiPolygon.include({toGeoJSON:multiToGeoJSON('MultiPolygon')});L.LayerGroup.include({toGeoJSON:function toGeoJSON(){var geometry=this.feature && this.feature.geometry,jsons=[],json;if(geometry && geometry.type === 'MultiPoint'){return multiToGeoJSON('MultiPoint').call(this);}var isGeometryCollection=geometry && geometry.type === 'GeometryCollection';this.eachLayer(function(layer){if(layer.toGeoJSON){json = layer.toGeoJSON();jsons.push(isGeometryCollection?json.geometry:L.GeoJSON.asFeature(json));}});if(isGeometryCollection){return L.GeoJSON.getFeature(this,{geometries:jsons,type:'GeometryCollection'});}return {type:'FeatureCollection',features:jsons};}});})();L.geoJson = function(geojson,options){return new L.GeoJSON(geojson,options);}; /*
	 * L.DomEvent contains functions for working with DOM events.
	 */L.DomEvent = { /* inspired by John Resig, Dean Edwards and YUI addEvent implementations */addListener:function addListener(obj,type,fn,context){ // (HTMLElement, String, Function[, Object])
	var id=L.stamp(fn),key='_leaflet_' + type + id,handler,originalHandler,newType;if(obj[key]){return this;}handler = function(e){return fn.call(context || obj,e || L.DomEvent._getEvent());};if(L.Browser.pointer && type.indexOf('touch') === 0){return this.addPointerListener(obj,type,handler,id);}if(L.Browser.touch && type === 'dblclick' && this.addDoubleTapListener){this.addDoubleTapListener(obj,handler,id);}if('addEventListener' in obj){if(type === 'mousewheel'){obj.addEventListener('DOMMouseScroll',handler,false);obj.addEventListener(type,handler,false);}else if(type === 'mouseenter' || type === 'mouseleave'){originalHandler = handler;newType = type === 'mouseenter'?'mouseover':'mouseout';handler = function(e){if(!L.DomEvent._checkMouse(obj,e)){return;}return originalHandler(e);};obj.addEventListener(newType,handler,false);}else if(type === 'click' && L.Browser.android){originalHandler = handler;handler = function(e){return L.DomEvent._filterClick(e,originalHandler);};obj.addEventListener(type,handler,false);}else {obj.addEventListener(type,handler,false);}}else if('attachEvent' in obj){obj.attachEvent('on' + type,handler);}obj[key] = handler;return this;},removeListener:function removeListener(obj,type,fn){ // (HTMLElement, String, Function)
	var id=L.stamp(fn),key='_leaflet_' + type + id,handler=obj[key];if(!handler){return this;}if(L.Browser.pointer && type.indexOf('touch') === 0){this.removePointerListener(obj,type,id);}else if(L.Browser.touch && type === 'dblclick' && this.removeDoubleTapListener){this.removeDoubleTapListener(obj,id);}else if('removeEventListener' in obj){if(type === 'mousewheel'){obj.removeEventListener('DOMMouseScroll',handler,false);obj.removeEventListener(type,handler,false);}else if(type === 'mouseenter' || type === 'mouseleave'){obj.removeEventListener(type === 'mouseenter'?'mouseover':'mouseout',handler,false);}else {obj.removeEventListener(type,handler,false);}}else if('detachEvent' in obj){obj.detachEvent('on' + type,handler);}obj[key] = null;return this;},stopPropagation:function stopPropagation(e){if(e.stopPropagation){e.stopPropagation();}else {e.cancelBubble = true;}L.DomEvent._skipped(e);return this;},disableScrollPropagation:function disableScrollPropagation(el){var stop=L.DomEvent.stopPropagation;return L.DomEvent.on(el,'mousewheel',stop).on(el,'MozMousePixelScroll',stop);},disableClickPropagation:function disableClickPropagation(el){var stop=L.DomEvent.stopPropagation;for(var i=L.Draggable.START.length - 1;i >= 0;i--) {L.DomEvent.on(el,L.Draggable.START[i],stop);}return L.DomEvent.on(el,'click',L.DomEvent._fakeStop).on(el,'dblclick',stop);},preventDefault:function preventDefault(e){if(e.preventDefault){e.preventDefault();}else {e.returnValue = false;}return this;},stop:function stop(e){return L.DomEvent.preventDefault(e).stopPropagation(e);},getMousePosition:function getMousePosition(e,container){if(!container){return new L.Point(e.clientX,e.clientY);}var rect=container.getBoundingClientRect();return new L.Point(e.clientX - rect.left - container.clientLeft,e.clientY - rect.top - container.clientTop);},getWheelDelta:function getWheelDelta(e){var delta=0;if(e.wheelDelta){delta = e.wheelDelta / 120;}if(e.detail){delta = -e.detail / 3;}return delta;},_skipEvents:{},_fakeStop:function _fakeStop(e){ // fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
	L.DomEvent._skipEvents[e.type] = true;},_skipped:function _skipped(e){var skipped=this._skipEvents[e.type]; // reset when checking, as it's only used in map container and propagates outside of the map
	this._skipEvents[e.type] = false;return skipped;}, // check if element really left/entered the event target (for mouseenter/mouseleave)
	_checkMouse:function _checkMouse(el,e){var related=e.relatedTarget;if(!related){return true;}try{while(related && related !== el) {related = related.parentNode;}}catch(err) {return false;}return related !== el;},_getEvent:function _getEvent(){ // evil magic for IE
	/*jshint noarg:false */var e=window.event;if(!e){var caller=arguments.callee.caller;while(caller) {e = caller['arguments'][0];if(e && window.Event === e.constructor){break;}caller = caller.caller;}}return e;}, // this is a horrible workaround for a bug in Android where a single touch triggers two click events
	_filterClick:function _filterClick(e,handler){var timeStamp=e.timeStamp || e.originalEvent.timeStamp,elapsed=L.DomEvent._lastClick && timeStamp - L.DomEvent._lastClick; // are they closer together than 500ms yet more than 100ms?
	// Android typically triggers them ~300ms apart while multiple listeners
	// on the same event should be triggered far faster;
	// or check if click is simulated on the element, and if it is, reject any non-simulated events
	if(elapsed && elapsed > 100 && elapsed < 500 || e.target._simulatedClick && !e._simulated){L.DomEvent.stop(e);return;}L.DomEvent._lastClick = timeStamp;return handler(e);}};L.DomEvent.on = L.DomEvent.addListener;L.DomEvent.off = L.DomEvent.removeListener; /*
	 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	 */L.Draggable = L.Class.extend({includes:L.Mixin.Events,statics:{START:L.Browser.touch?['touchstart','mousedown']:['mousedown'],END:{mousedown:'mouseup',touchstart:'touchend',pointerdown:'touchend',MSPointerDown:'touchend'},MOVE:{mousedown:'mousemove',touchstart:'touchmove',pointerdown:'touchmove',MSPointerDown:'touchmove'}},initialize:function initialize(element,dragStartTarget){this._element = element;this._dragStartTarget = dragStartTarget || element;},enable:function enable(){if(this._enabled){return;}for(var i=L.Draggable.START.length - 1;i >= 0;i--) {L.DomEvent.on(this._dragStartTarget,L.Draggable.START[i],this._onDown,this);}this._enabled = true;},disable:function disable(){if(!this._enabled){return;}for(var i=L.Draggable.START.length - 1;i >= 0;i--) {L.DomEvent.off(this._dragStartTarget,L.Draggable.START[i],this._onDown,this);}this._enabled = false;this._moved = false;},_onDown:function _onDown(e){this._moved = false;if(e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches){return;}L.DomEvent.stopPropagation(e);if(L.Draggable._disabled){return;}L.DomUtil.disableImageDrag();L.DomUtil.disableTextSelection();if(this._moving){return;}var first=e.touches?e.touches[0]:e;this._startPoint = new L.Point(first.clientX,first.clientY);this._startPos = this._newPos = L.DomUtil.getPosition(this._element);L.DomEvent.on(document,L.Draggable.MOVE[e.type],this._onMove,this).on(document,L.Draggable.END[e.type],this._onUp,this);},_onMove:function _onMove(e){if(e.touches && e.touches.length > 1){this._moved = true;return;}var first=e.touches && e.touches.length === 1?e.touches[0]:e,newPoint=new L.Point(first.clientX,first.clientY),offset=newPoint.subtract(this._startPoint);if(!offset.x && !offset.y){return;}if(L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3){return;}L.DomEvent.preventDefault(e);if(!this._moved){this.fire('dragstart');this._moved = true;this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);L.DomUtil.addClass(document.body,'leaflet-dragging');this._lastTarget = e.target || e.srcElement;L.DomUtil.addClass(this._lastTarget,'leaflet-drag-target');}this._newPos = this._startPos.add(offset);this._moving = true;L.Util.cancelAnimFrame(this._animRequest);this._animRequest = L.Util.requestAnimFrame(this._updatePosition,this,true,this._dragStartTarget);},_updatePosition:function _updatePosition(){this.fire('predrag');L.DomUtil.setPosition(this._element,this._newPos);this.fire('drag');},_onUp:function _onUp(){L.DomUtil.removeClass(document.body,'leaflet-dragging');if(this._lastTarget){L.DomUtil.removeClass(this._lastTarget,'leaflet-drag-target');this._lastTarget = null;}for(var i in L.Draggable.MOVE) {L.DomEvent.off(document,L.Draggable.MOVE[i],this._onMove).off(document,L.Draggable.END[i],this._onUp);}L.DomUtil.enableImageDrag();L.DomUtil.enableTextSelection();if(this._moved && this._moving){ // ensure drag is not fired after dragend
	L.Util.cancelAnimFrame(this._animRequest);this.fire('dragend',{distance:this._newPos.distanceTo(this._startPos)});}this._moving = false;}}); /*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/L.Handler = L.Class.extend({initialize:function initialize(map){this._map = map;},enable:function enable(){if(this._enabled){return;}this._enabled = true;this.addHooks();},disable:function disable(){if(!this._enabled){return;}this._enabled = false;this.removeHooks();},enabled:function enabled(){return !!this._enabled;}}); /*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */L.Map.mergeOptions({dragging:true,inertia:!L.Browser.android23,inertiaDeceleration:3400, // px/s^2
	inertiaMaxSpeed:Infinity, // px/s
	inertiaThreshold:L.Browser.touch?32:18, // ms
	easeLinearity:0.25, // TODO refactor, move to CRS
	worldCopyJump:false});L.Map.Drag = L.Handler.extend({addHooks:function addHooks(){if(!this._draggable){var map=this._map;this._draggable = new L.Draggable(map._mapPane,map._container);this._draggable.on({'dragstart':this._onDragStart,'drag':this._onDrag,'dragend':this._onDragEnd},this);if(map.options.worldCopyJump){this._draggable.on('predrag',this._onPreDrag,this);map.on('viewreset',this._onViewReset,this);map.whenReady(this._onViewReset,this);}}this._draggable.enable();},removeHooks:function removeHooks(){this._draggable.disable();},moved:function moved(){return this._draggable && this._draggable._moved;},_onDragStart:function _onDragStart(){var map=this._map;if(map._panAnim){map._panAnim.stop();}map.fire('movestart').fire('dragstart');if(map.options.inertia){this._positions = [];this._times = [];}},_onDrag:function _onDrag(){if(this._map.options.inertia){var time=this._lastTime = +new Date(),pos=this._lastPos = this._draggable._newPos;this._positions.push(pos);this._times.push(time);if(time - this._times[0] > 200){this._positions.shift();this._times.shift();}}this._map.fire('move').fire('drag');},_onViewReset:function _onViewReset(){ // TODO fix hardcoded Earth values
	var pxCenter=this._map.getSize()._divideBy(2),pxWorldCenter=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;this._worldWidth = this._map.project([0,180]).x;},_onPreDrag:function _onPreDrag(){ // TODO refactor to be able to adjust map pane position after zoom
	var worldWidth=this._worldWidth,halfWidth=Math.round(worldWidth / 2),dx=this._initialWorldOffset,x=this._draggable._newPos.x,newX1=(x - halfWidth + dx) % worldWidth + halfWidth - dx,newX2=(x + halfWidth + dx) % worldWidth - halfWidth - dx,newX=Math.abs(newX1 + dx) < Math.abs(newX2 + dx)?newX1:newX2;this._draggable._newPos.x = newX;},_onDragEnd:function _onDragEnd(e){var map=this._map,options=map.options,delay=+new Date() - this._lastTime,noInertia=!options.inertia || delay > options.inertiaThreshold || !this._positions[0];map.fire('dragend',e);if(noInertia){map.fire('moveend');}else {var direction=this._lastPos.subtract(this._positions[0]),duration=(this._lastTime + delay - this._times[0]) / 1000,ease=options.easeLinearity,speedVector=direction.multiplyBy(ease / duration),speed=speedVector.distanceTo([0,0]),limitedSpeed=Math.min(options.inertiaMaxSpeed,speed),limitedSpeedVector=speedVector.multiplyBy(limitedSpeed / speed),decelerationDuration=limitedSpeed / (options.inertiaDeceleration * ease),offset=limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();if(!offset.x || !offset.y){map.fire('moveend');}else {offset = map._limitOffset(offset,map.options.maxBounds);L.Util.requestAnimFrame(function(){map.panBy(offset,{duration:decelerationDuration,easeLinearity:ease,noMoveStart:true});});}}}});L.Map.addInitHook('addHandler','dragging',L.Map.Drag); /*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */L.Map.mergeOptions({doubleClickZoom:true});L.Map.DoubleClickZoom = L.Handler.extend({addHooks:function addHooks(){this._map.on('dblclick',this._onDoubleClick,this);},removeHooks:function removeHooks(){this._map.off('dblclick',this._onDoubleClick,this);},_onDoubleClick:function _onDoubleClick(e){var map=this._map,zoom=map.getZoom() + (e.originalEvent.shiftKey?-1:1);if(map.options.doubleClickZoom === 'center'){map.setZoom(zoom);}else {map.setZoomAround(e.containerPoint,zoom);}}});L.Map.addInitHook('addHandler','doubleClickZoom',L.Map.DoubleClickZoom); /*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */L.Map.mergeOptions({scrollWheelZoom:true});L.Map.ScrollWheelZoom = L.Handler.extend({addHooks:function addHooks(){L.DomEvent.on(this._map._container,'mousewheel',this._onWheelScroll,this);L.DomEvent.on(this._map._container,'MozMousePixelScroll',L.DomEvent.preventDefault);this._delta = 0;},removeHooks:function removeHooks(){L.DomEvent.off(this._map._container,'mousewheel',this._onWheelScroll);L.DomEvent.off(this._map._container,'MozMousePixelScroll',L.DomEvent.preventDefault);},_onWheelScroll:function _onWheelScroll(e){var delta=L.DomEvent.getWheelDelta(e);this._delta += delta;this._lastMousePos = this._map.mouseEventToContainerPoint(e);if(!this._startTime){this._startTime = +new Date();}var left=Math.max(40 - (+new Date() - this._startTime),0);clearTimeout(this._timer);this._timer = setTimeout(L.bind(this._performZoom,this),left);L.DomEvent.preventDefault(e);L.DomEvent.stopPropagation(e);},_performZoom:function _performZoom(){var map=this._map,delta=this._delta,zoom=map.getZoom();delta = delta > 0?Math.ceil(delta):Math.floor(delta);delta = Math.max(Math.min(delta,4),-4);delta = map._limitZoom(zoom + delta) - zoom;this._delta = 0;this._startTime = null;if(!delta){return;}if(map.options.scrollWheelZoom === 'center'){map.setZoom(zoom + delta);}else {map.setZoomAround(this._lastMousePos,zoom + delta);}}});L.Map.addInitHook('addHandler','scrollWheelZoom',L.Map.ScrollWheelZoom); /*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */L.extend(L.DomEvent,{_touchstart:L.Browser.msPointer?'MSPointerDown':L.Browser.pointer?'pointerdown':'touchstart',_touchend:L.Browser.msPointer?'MSPointerUp':L.Browser.pointer?'pointerup':'touchend', // inspired by Zepto touch code by Thomas Fuchs
	addDoubleTapListener:function addDoubleTapListener(obj,handler,id){var last,doubleTap=false,delay=250,touch,pre='_leaflet_',touchstart=this._touchstart,touchend=this._touchend,trackedTouches=[];function onTouchStart(e){var count;if(L.Browser.pointer){trackedTouches.push(e.pointerId);count = trackedTouches.length;}else {count = e.touches.length;}if(count > 1){return;}var now=Date.now(),delta=now - (last || now);touch = e.touches?e.touches[0]:e;doubleTap = delta > 0 && delta <= delay;last = now;}function onTouchEnd(e){if(L.Browser.pointer){var idx=trackedTouches.indexOf(e.pointerId);if(idx === -1){return;}trackedTouches.splice(idx,1);}if(doubleTap){if(L.Browser.pointer){ // work around .type being readonly with MSPointer* events
	var newTouch={},prop; // jshint forin:false
	for(var i in touch) {prop = touch[i];if(typeof prop === 'function'){newTouch[i] = prop.bind(touch);}else {newTouch[i] = prop;}}touch = newTouch;}touch.type = 'dblclick';handler(touch);last = null;}}obj[pre + touchstart + id] = onTouchStart;obj[pre + touchend + id] = onTouchEnd; // on pointer we need to listen on the document, otherwise a drag starting on the map and moving off screen
	// will not come through to us, so we will lose track of how many touches are ongoing
	var endElement=L.Browser.pointer?document.documentElement:obj;obj.addEventListener(touchstart,onTouchStart,false);endElement.addEventListener(touchend,onTouchEnd,false);if(L.Browser.pointer){endElement.addEventListener(L.DomEvent.POINTER_CANCEL,onTouchEnd,false);}return this;},removeDoubleTapListener:function removeDoubleTapListener(obj,id){var pre='_leaflet_';obj.removeEventListener(this._touchstart,obj[pre + this._touchstart + id],false);(L.Browser.pointer?document.documentElement:obj).removeEventListener(this._touchend,obj[pre + this._touchend + id],false);if(L.Browser.pointer){document.documentElement.removeEventListener(L.DomEvent.POINTER_CANCEL,obj[pre + this._touchend + id],false);}return this;}}); /*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */L.extend(L.DomEvent,{ //static
	POINTER_DOWN:L.Browser.msPointer?'MSPointerDown':'pointerdown',POINTER_MOVE:L.Browser.msPointer?'MSPointerMove':'pointermove',POINTER_UP:L.Browser.msPointer?'MSPointerUp':'pointerup',POINTER_CANCEL:L.Browser.msPointer?'MSPointerCancel':'pointercancel',_pointers:[],_pointerDocumentListener:false, // Provides a touch events wrapper for (ms)pointer events.
	// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019
	//ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890
	addPointerListener:function addPointerListener(obj,type,handler,id){switch(type){case 'touchstart':return this.addPointerListenerStart(obj,type,handler,id);case 'touchend':return this.addPointerListenerEnd(obj,type,handler,id);case 'touchmove':return this.addPointerListenerMove(obj,type,handler,id);default:throw 'Unknown touch event type';}},addPointerListenerStart:function addPointerListenerStart(obj,type,handler,id){var pre='_leaflet_',pointers=this._pointers;var cb=function cb(e){if(e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE){L.DomEvent.preventDefault(e);}var alreadyInArray=false;for(var i=0;i < pointers.length;i++) {if(pointers[i].pointerId === e.pointerId){alreadyInArray = true;break;}}if(!alreadyInArray){pointers.push(e);}e.touches = pointers.slice();e.changedTouches = [e];handler(e);};obj[pre + 'touchstart' + id] = cb;obj.addEventListener(this.POINTER_DOWN,cb,false); // need to also listen for end events to keep the _pointers list accurate
	// this needs to be on the body and never go away
	if(!this._pointerDocumentListener){var internalCb=function internalCb(e){for(var i=0;i < pointers.length;i++) {if(pointers[i].pointerId === e.pointerId){pointers.splice(i,1);break;}}}; //We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
	document.documentElement.addEventListener(this.POINTER_UP,internalCb,false);document.documentElement.addEventListener(this.POINTER_CANCEL,internalCb,false);this._pointerDocumentListener = true;}return this;},addPointerListenerMove:function addPointerListenerMove(obj,type,handler,id){var pre='_leaflet_',touches=this._pointers;function cb(e){ // don't fire touch moves when mouse isn't down
	if((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0){return;}for(var i=0;i < touches.length;i++) {if(touches[i].pointerId === e.pointerId){touches[i] = e;break;}}e.touches = touches.slice();e.changedTouches = [e];handler(e);}obj[pre + 'touchmove' + id] = cb;obj.addEventListener(this.POINTER_MOVE,cb,false);return this;},addPointerListenerEnd:function addPointerListenerEnd(obj,type,handler,id){var pre='_leaflet_',touches=this._pointers;var cb=function cb(e){for(var i=0;i < touches.length;i++) {if(touches[i].pointerId === e.pointerId){touches.splice(i,1);break;}}e.touches = touches.slice();e.changedTouches = [e];handler(e);};obj[pre + 'touchend' + id] = cb;obj.addEventListener(this.POINTER_UP,cb,false);obj.addEventListener(this.POINTER_CANCEL,cb,false);return this;},removePointerListener:function removePointerListener(obj,type,id){var pre='_leaflet_',cb=obj[pre + type + id];switch(type){case 'touchstart':obj.removeEventListener(this.POINTER_DOWN,cb,false);break;case 'touchmove':obj.removeEventListener(this.POINTER_MOVE,cb,false);break;case 'touchend':obj.removeEventListener(this.POINTER_UP,cb,false);obj.removeEventListener(this.POINTER_CANCEL,cb,false);break;}return this;}}); /*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */L.Map.mergeOptions({touchZoom:L.Browser.touch && !L.Browser.android23,bounceAtZoomLimits:true});L.Map.TouchZoom = L.Handler.extend({addHooks:function addHooks(){L.DomEvent.on(this._map._container,'touchstart',this._onTouchStart,this);},removeHooks:function removeHooks(){L.DomEvent.off(this._map._container,'touchstart',this._onTouchStart,this);},_onTouchStart:function _onTouchStart(e){var map=this._map;if(!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming){return;}var p1=map.mouseEventToLayerPoint(e.touches[0]),p2=map.mouseEventToLayerPoint(e.touches[1]),viewCenter=map._getCenterLayerPoint();this._startCenter = p1.add(p2)._divideBy(2);this._startDist = p1.distanceTo(p2);this._moved = false;this._zooming = true;this._centerOffset = viewCenter.subtract(this._startCenter);if(map._panAnim){map._panAnim.stop();}L.DomEvent.on(document,'touchmove',this._onTouchMove,this).on(document,'touchend',this._onTouchEnd,this);L.DomEvent.preventDefault(e);},_onTouchMove:function _onTouchMove(e){var map=this._map;if(!e.touches || e.touches.length !== 2 || !this._zooming){return;}var p1=map.mouseEventToLayerPoint(e.touches[0]),p2=map.mouseEventToLayerPoint(e.touches[1]);this._scale = p1.distanceTo(p2) / this._startDist;this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);if(this._scale === 1){return;}if(!map.options.bounceAtZoomLimits){if(map.getZoom() === map.getMinZoom() && this._scale < 1 || map.getZoom() === map.getMaxZoom() && this._scale > 1){return;}}if(!this._moved){L.DomUtil.addClass(map._mapPane,'leaflet-touching');map.fire('movestart').fire('zoomstart');this._moved = true;}L.Util.cancelAnimFrame(this._animRequest);this._animRequest = L.Util.requestAnimFrame(this._updateOnMove,this,true,this._map._container);L.DomEvent.preventDefault(e);},_updateOnMove:function _updateOnMove(){var map=this._map,origin=this._getScaleOrigin(),center=map.layerPointToLatLng(origin),zoom=map.getScaleZoom(this._scale);map._animateZoom(center,zoom,this._startCenter,this._scale,this._delta,false,true);},_onTouchEnd:function _onTouchEnd(){if(!this._moved || !this._zooming){this._zooming = false;return;}var map=this._map;this._zooming = false;L.DomUtil.removeClass(map._mapPane,'leaflet-touching');L.Util.cancelAnimFrame(this._animRequest);L.DomEvent.off(document,'touchmove',this._onTouchMove).off(document,'touchend',this._onTouchEnd);var origin=this._getScaleOrigin(),center=map.layerPointToLatLng(origin),oldZoom=map.getZoom(),floatZoomDelta=map.getScaleZoom(this._scale) - oldZoom,roundZoomDelta=floatZoomDelta > 0?Math.ceil(floatZoomDelta):Math.floor(floatZoomDelta),zoom=map._limitZoom(oldZoom + roundZoomDelta),scale=map.getZoomScale(zoom) / this._scale;map._animateZoom(center,zoom,origin,scale);},_getScaleOrigin:function _getScaleOrigin(){var centerOffset=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(centerOffset);}});L.Map.addInitHook('addHandler','touchZoom',L.Map.TouchZoom); /*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */L.Map.mergeOptions({tap:true,tapTolerance:15});L.Map.Tap = L.Handler.extend({addHooks:function addHooks(){L.DomEvent.on(this._map._container,'touchstart',this._onDown,this);},removeHooks:function removeHooks(){L.DomEvent.off(this._map._container,'touchstart',this._onDown,this);},_onDown:function _onDown(e){if(!e.touches){return;}L.DomEvent.preventDefault(e);this._fireClick = true; // don't simulate click or track longpress if more than 1 touch
	if(e.touches.length > 1){this._fireClick = false;clearTimeout(this._holdTimeout);return;}var first=e.touches[0],el=first.target;this._startPos = this._newPos = new L.Point(first.clientX,first.clientY); // if touching a link, highlight it
	if(el.tagName && el.tagName.toLowerCase() === 'a'){L.DomUtil.addClass(el,'leaflet-active');} // simulate long hold but setting a timeout
	this._holdTimeout = setTimeout(L.bind(function(){if(this._isTapValid()){this._fireClick = false;this._onUp();this._simulateEvent('contextmenu',first);}},this),1000);L.DomEvent.on(document,'touchmove',this._onMove,this).on(document,'touchend',this._onUp,this);},_onUp:function _onUp(e){clearTimeout(this._holdTimeout);L.DomEvent.off(document,'touchmove',this._onMove,this).off(document,'touchend',this._onUp,this);if(this._fireClick && e && e.changedTouches){var first=e.changedTouches[0],el=first.target;if(el && el.tagName && el.tagName.toLowerCase() === 'a'){L.DomUtil.removeClass(el,'leaflet-active');} // simulate click if the touch didn't move too much
	if(this._isTapValid()){this._simulateEvent('click',first);}}},_isTapValid:function _isTapValid(){return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;},_onMove:function _onMove(e){var first=e.touches[0];this._newPos = new L.Point(first.clientX,first.clientY);},_simulateEvent:function _simulateEvent(type,e){var simulatedEvent=document.createEvent('MouseEvents');simulatedEvent._simulated = true;e.target._simulatedClick = true;simulatedEvent.initMouseEvent(type,true,true,window,1,e.screenX,e.screenY,e.clientX,e.clientY,false,false,false,false,0,null);e.target.dispatchEvent(simulatedEvent);}});if(L.Browser.touch && !L.Browser.pointer){L.Map.addInitHook('addHandler','tap',L.Map.Tap);} /*
	 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
	  * (zoom to a selected bounding box), enabled by default.
	 */L.Map.mergeOptions({boxZoom:true});L.Map.BoxZoom = L.Handler.extend({initialize:function initialize(map){this._map = map;this._container = map._container;this._pane = map._panes.overlayPane;this._moved = false;},addHooks:function addHooks(){L.DomEvent.on(this._container,'mousedown',this._onMouseDown,this);},removeHooks:function removeHooks(){L.DomEvent.off(this._container,'mousedown',this._onMouseDown);this._moved = false;},moved:function moved(){return this._moved;},_onMouseDown:function _onMouseDown(e){this._moved = false;if(!e.shiftKey || e.which !== 1 && e.button !== 1){return false;}L.DomUtil.disableTextSelection();L.DomUtil.disableImageDrag();this._startLayerPoint = this._map.mouseEventToLayerPoint(e);L.DomEvent.on(document,'mousemove',this._onMouseMove,this).on(document,'mouseup',this._onMouseUp,this).on(document,'keydown',this._onKeyDown,this);},_onMouseMove:function _onMouseMove(e){if(!this._moved){this._box = L.DomUtil.create('div','leaflet-zoom-box',this._pane);L.DomUtil.setPosition(this._box,this._startLayerPoint); //TODO refactor: move cursor to styles
	this._container.style.cursor = 'crosshair';this._map.fire('boxzoomstart');}var startPoint=this._startLayerPoint,box=this._box,layerPoint=this._map.mouseEventToLayerPoint(e),offset=layerPoint.subtract(startPoint),newPos=new L.Point(Math.min(layerPoint.x,startPoint.x),Math.min(layerPoint.y,startPoint.y));L.DomUtil.setPosition(box,newPos);this._moved = true; // TODO refactor: remove hardcoded 4 pixels
	box.style.width = Math.max(0,Math.abs(offset.x) - 4) + 'px';box.style.height = Math.max(0,Math.abs(offset.y) - 4) + 'px';},_finish:function _finish(){if(this._moved){this._pane.removeChild(this._box);this._container.style.cursor = '';}L.DomUtil.enableTextSelection();L.DomUtil.enableImageDrag();L.DomEvent.off(document,'mousemove',this._onMouseMove).off(document,'mouseup',this._onMouseUp).off(document,'keydown',this._onKeyDown);},_onMouseUp:function _onMouseUp(e){this._finish();var map=this._map,layerPoint=map.mouseEventToLayerPoint(e);if(this._startLayerPoint.equals(layerPoint)){return;}var bounds=new L.LatLngBounds(map.layerPointToLatLng(this._startLayerPoint),map.layerPointToLatLng(layerPoint));map.fitBounds(bounds);map.fire('boxzoomend',{boxZoomBounds:bounds});},_onKeyDown:function _onKeyDown(e){if(e.keyCode === 27){this._finish();}}});L.Map.addInitHook('addHandler','boxZoom',L.Map.BoxZoom); /*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */L.Map.mergeOptions({keyboard:true,keyboardPanOffset:80,keyboardZoomOffset:1});L.Map.Keyboard = L.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function initialize(map){this._map = map;this._setPanOffset(map.options.keyboardPanOffset);this._setZoomOffset(map.options.keyboardZoomOffset);},addHooks:function addHooks(){var container=this._map._container; // make the container focusable by tabbing
	if(container.tabIndex === -1){container.tabIndex = '0';}L.DomEvent.on(container,'focus',this._onFocus,this).on(container,'blur',this._onBlur,this).on(container,'mousedown',this._onMouseDown,this);this._map.on('focus',this._addHooks,this).on('blur',this._removeHooks,this);},removeHooks:function removeHooks(){this._removeHooks();var container=this._map._container;L.DomEvent.off(container,'focus',this._onFocus,this).off(container,'blur',this._onBlur,this).off(container,'mousedown',this._onMouseDown,this);this._map.off('focus',this._addHooks,this).off('blur',this._removeHooks,this);},_onMouseDown:function _onMouseDown(){if(this._focused){return;}var body=document.body,docEl=document.documentElement,top=body.scrollTop || docEl.scrollTop,left=body.scrollLeft || docEl.scrollLeft;this._map._container.focus();window.scrollTo(left,top);},_onFocus:function _onFocus(){this._focused = true;this._map.fire('focus');},_onBlur:function _onBlur(){this._focused = false;this._map.fire('blur');},_setPanOffset:function _setPanOffset(pan){var keys=this._panKeys = {},codes=this.keyCodes,i,len;for(i = 0,len = codes.left.length;i < len;i++) {keys[codes.left[i]] = [-1 * pan,0];}for(i = 0,len = codes.right.length;i < len;i++) {keys[codes.right[i]] = [pan,0];}for(i = 0,len = codes.down.length;i < len;i++) {keys[codes.down[i]] = [0,pan];}for(i = 0,len = codes.up.length;i < len;i++) {keys[codes.up[i]] = [0,-1 * pan];}},_setZoomOffset:function _setZoomOffset(zoom){var keys=this._zoomKeys = {},codes=this.keyCodes,i,len;for(i = 0,len = codes.zoomIn.length;i < len;i++) {keys[codes.zoomIn[i]] = zoom;}for(i = 0,len = codes.zoomOut.length;i < len;i++) {keys[codes.zoomOut[i]] = -zoom;}},_addHooks:function _addHooks(){L.DomEvent.on(document,'keydown',this._onKeyDown,this);},_removeHooks:function _removeHooks(){L.DomEvent.off(document,'keydown',this._onKeyDown,this);},_onKeyDown:function _onKeyDown(e){var key=e.keyCode,map=this._map;if(key in this._panKeys){if(map._panAnim && map._panAnim._inProgress){return;}map.panBy(this._panKeys[key]);if(map.options.maxBounds){map.panInsideBounds(map.options.maxBounds);}}else if(key in this._zoomKeys){map.setZoom(map.getZoom() + this._zoomKeys[key]);}else {return;}L.DomEvent.stop(e);}});L.Map.addInitHook('addHandler','keyboard',L.Map.Keyboard); /*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */L.Handler.MarkerDrag = L.Handler.extend({initialize:function initialize(marker){this._marker = marker;},addHooks:function addHooks(){var icon=this._marker._icon;if(!this._draggable){this._draggable = new L.Draggable(icon,icon);}this._draggable.on('dragstart',this._onDragStart,this).on('drag',this._onDrag,this).on('dragend',this._onDragEnd,this);this._draggable.enable();L.DomUtil.addClass(this._marker._icon,'leaflet-marker-draggable');},removeHooks:function removeHooks(){this._draggable.off('dragstart',this._onDragStart,this).off('drag',this._onDrag,this).off('dragend',this._onDragEnd,this);this._draggable.disable();L.DomUtil.removeClass(this._marker._icon,'leaflet-marker-draggable');},moved:function moved(){return this._draggable && this._draggable._moved;},_onDragStart:function _onDragStart(){this._marker.closePopup().fire('movestart').fire('dragstart');},_onDrag:function _onDrag(){var marker=this._marker,shadow=marker._shadow,iconPos=L.DomUtil.getPosition(marker._icon),latlng=marker._map.layerPointToLatLng(iconPos); // update shadow position
	if(shadow){L.DomUtil.setPosition(shadow,iconPos);}marker._latlng = latlng;marker.fire('move',{latlng:latlng}).fire('drag');},_onDragEnd:function _onDragEnd(e){this._marker.fire('moveend').fire('dragend',e);}}); /*
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */L.Control = L.Class.extend({options:{position:'topright'},initialize:function initialize(options){L.setOptions(this,options);},getPosition:function getPosition(){return this.options.position;},setPosition:function setPosition(position){var map=this._map;if(map){map.removeControl(this);}this.options.position = position;if(map){map.addControl(this);}return this;},getContainer:function getContainer(){return this._container;},addTo:function addTo(map){this._map = map;var container=this._container = this.onAdd(map),pos=this.getPosition(),corner=map._controlCorners[pos];L.DomUtil.addClass(container,'leaflet-control');if(pos.indexOf('bottom') !== -1){corner.insertBefore(container,corner.firstChild);}else {corner.appendChild(container);}return this;},removeFrom:function removeFrom(map){var pos=this.getPosition(),corner=map._controlCorners[pos];corner.removeChild(this._container);this._map = null;if(this.onRemove){this.onRemove(map);}return this;},_refocusOnMap:function _refocusOnMap(){if(this._map){this._map.getContainer().focus();}}});L.control = function(options){return new L.Control(options);}; // adds control-related methods to L.Map
	L.Map.include({addControl:function addControl(control){control.addTo(this);return this;},removeControl:function removeControl(control){control.removeFrom(this);return this;},_initControlPos:function _initControlPos(){var corners=this._controlCorners = {},l='leaflet-',container=this._controlContainer = L.DomUtil.create('div',l + 'control-container',this._container);function createCorner(vSide,hSide){var className=l + vSide + ' ' + l + hSide;corners[vSide + hSide] = L.DomUtil.create('div',className,container);}createCorner('top','left');createCorner('top','right');createCorner('bottom','left');createCorner('bottom','right');},_clearControlPos:function _clearControlPos(){this._container.removeChild(this._controlContainer);}}); /*
	 * L.Control.Zoom is used for the default zoom buttons on the map.
	 */L.Control.Zoom = L.Control.extend({options:{position:'topleft',zoomInText:'+',zoomInTitle:'Zoom in',zoomOutText:'-',zoomOutTitle:'Zoom out'},onAdd:function onAdd(map){var zoomName='leaflet-control-zoom',container=L.DomUtil.create('div',zoomName + ' leaflet-bar');this._map = map;this._zoomInButton = this._createButton(this.options.zoomInText,this.options.zoomInTitle,zoomName + '-in',container,this._zoomIn,this);this._zoomOutButton = this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,zoomName + '-out',container,this._zoomOut,this);this._updateDisabled();map.on('zoomend zoomlevelschange',this._updateDisabled,this);return container;},onRemove:function onRemove(map){map.off('zoomend zoomlevelschange',this._updateDisabled,this);},_zoomIn:function _zoomIn(e){this._map.zoomIn(e.shiftKey?3:1);},_zoomOut:function _zoomOut(e){this._map.zoomOut(e.shiftKey?3:1);},_createButton:function _createButton(html,title,className,container,fn,context){var link=L.DomUtil.create('a',className,container);link.innerHTML = html;link.href = '#';link.title = title;var stop=L.DomEvent.stopPropagation;L.DomEvent.on(link,'click',stop).on(link,'mousedown',stop).on(link,'dblclick',stop).on(link,'click',L.DomEvent.preventDefault).on(link,'click',fn,context).on(link,'click',this._refocusOnMap,context);return link;},_updateDisabled:function _updateDisabled(){var map=this._map,className='leaflet-disabled';L.DomUtil.removeClass(this._zoomInButton,className);L.DomUtil.removeClass(this._zoomOutButton,className);if(map._zoom === map.getMinZoom()){L.DomUtil.addClass(this._zoomOutButton,className);}if(map._zoom === map.getMaxZoom()){L.DomUtil.addClass(this._zoomInButton,className);}}});L.Map.mergeOptions({zoomControl:true});L.Map.addInitHook(function(){if(this.options.zoomControl){this.zoomControl = new L.Control.Zoom();this.addControl(this.zoomControl);}});L.control.zoom = function(options){return new L.Control.Zoom(options);}; /*
	 * L.Control.Attribution is used for displaying attribution on the map (added by default).
	 */L.Control.Attribution = L.Control.extend({options:{position:'bottomright',prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function initialize(options){L.setOptions(this,options);this._attributions = {};},onAdd:function onAdd(map){this._container = L.DomUtil.create('div','leaflet-control-attribution');L.DomEvent.disableClickPropagation(this._container);for(var i in map._layers) {if(map._layers[i].getAttribution){this.addAttribution(map._layers[i].getAttribution());}}map.on('layeradd',this._onLayerAdd,this).on('layerremove',this._onLayerRemove,this);this._update();return this._container;},onRemove:function onRemove(map){map.off('layeradd',this._onLayerAdd).off('layerremove',this._onLayerRemove);},setPrefix:function setPrefix(prefix){this.options.prefix = prefix;this._update();return this;},addAttribution:function addAttribution(text){if(!text){return;}if(!this._attributions[text]){this._attributions[text] = 0;}this._attributions[text]++;this._update();return this;},removeAttribution:function removeAttribution(text){if(!text){return;}if(this._attributions[text]){this._attributions[text]--;this._update();}return this;},_update:function _update(){if(!this._map){return;}var attribs=[];for(var i in this._attributions) {if(this._attributions[i]){attribs.push(i);}}var prefixAndAttribs=[];if(this.options.prefix){prefixAndAttribs.push(this.options.prefix);}if(attribs.length){prefixAndAttribs.push(attribs.join(', '));}this._container.innerHTML = prefixAndAttribs.join(' | ');},_onLayerAdd:function _onLayerAdd(e){if(e.layer.getAttribution){this.addAttribution(e.layer.getAttribution());}},_onLayerRemove:function _onLayerRemove(e){if(e.layer.getAttribution){this.removeAttribution(e.layer.getAttribution());}}});L.Map.mergeOptions({attributionControl:true});L.Map.addInitHook(function(){if(this.options.attributionControl){this.attributionControl = new L.Control.Attribution().addTo(this);}});L.control.attribution = function(options){return new L.Control.Attribution(options);}; /*
	 * L.Control.Scale is used for displaying metric/imperial scale on the map.
	 */L.Control.Scale = L.Control.extend({options:{position:'bottomleft',maxWidth:100,metric:true,imperial:true,updateWhenIdle:false},onAdd:function onAdd(map){this._map = map;var className='leaflet-control-scale',container=L.DomUtil.create('div',className),options=this.options;this._addScales(options,className,container);map.on(options.updateWhenIdle?'moveend':'move',this._update,this);map.whenReady(this._update,this);return container;},onRemove:function onRemove(map){map.off(this.options.updateWhenIdle?'moveend':'move',this._update,this);},_addScales:function _addScales(options,className,container){if(options.metric){this._mScale = L.DomUtil.create('div',className + '-line',container);}if(options.imperial){this._iScale = L.DomUtil.create('div',className + '-line',container);}},_update:function _update(){var bounds=this._map.getBounds(),centerLat=bounds.getCenter().lat,halfWorldMeters=6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),dist=halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,size=this._map.getSize(),options=this.options,maxMeters=0;if(size.x > 0){maxMeters = dist * (options.maxWidth / size.x);}this._updateScales(options,maxMeters);},_updateScales:function _updateScales(options,maxMeters){if(options.metric && maxMeters){this._updateMetric(maxMeters);}if(options.imperial && maxMeters){this._updateImperial(maxMeters);}},_updateMetric:function _updateMetric(maxMeters){var meters=this._getRoundNum(maxMeters);this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';this._mScale.innerHTML = meters < 1000?meters + ' m':meters / 1000 + ' km';},_updateImperial:function _updateImperial(maxMeters){var maxFeet=maxMeters * 3.2808399,scale=this._iScale,maxMiles,miles,feet;if(maxFeet > 5280){maxMiles = maxFeet / 5280;miles = this._getRoundNum(maxMiles);scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';scale.innerHTML = miles + ' mi';}else {feet = this._getRoundNum(maxFeet);scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';scale.innerHTML = feet + ' ft';}},_getScaleWidth:function _getScaleWidth(ratio){return Math.round(this.options.maxWidth * ratio) - 10;},_getRoundNum:function _getRoundNum(num){var pow10=Math.pow(10,(Math.floor(num) + '').length - 1),d=num / pow10;d = d >= 10?10:d >= 5?5:d >= 3?3:d >= 2?2:1;return pow10 * d;}});L.control.scale = function(options){return new L.Control.Scale(options);}; /*
	 * L.Control.Layers is a control to allow users to switch between different layers on the map.
	 */L.Control.Layers = L.Control.extend({options:{collapsed:true,position:'topright',autoZIndex:true},initialize:function initialize(baseLayers,overlays,options){L.setOptions(this,options);this._layers = {};this._lastZIndex = 0;this._handlingClick = false;for(var i in baseLayers) {this._addLayer(baseLayers[i],i);}for(i in overlays) {this._addLayer(overlays[i],i,true);}},onAdd:function onAdd(map){this._initLayout();this._update();map.on('layeradd',this._onLayerChange,this).on('layerremove',this._onLayerChange,this);return this._container;},onRemove:function onRemove(map){map.off('layeradd',this._onLayerChange,this).off('layerremove',this._onLayerChange,this);},addBaseLayer:function addBaseLayer(layer,name){this._addLayer(layer,name);this._update();return this;},addOverlay:function addOverlay(layer,name){this._addLayer(layer,name,true);this._update();return this;},removeLayer:function removeLayer(layer){var id=L.stamp(layer);delete this._layers[id];this._update();return this;},_initLayout:function _initLayout(){var className='leaflet-control-layers',container=this._container = L.DomUtil.create('div',className); //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
	container.setAttribute('aria-haspopup',true);if(!L.Browser.touch){L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);}else {L.DomEvent.on(container,'click',L.DomEvent.stopPropagation);}var form=this._form = L.DomUtil.create('form',className + '-list');if(this.options.collapsed){if(!L.Browser.android){L.DomEvent.on(container,'mouseover',this._expand,this).on(container,'mouseout',this._collapse,this);}var link=this._layersLink = L.DomUtil.create('a',className + '-toggle',container);link.href = '#';link.title = 'Layers';if(L.Browser.touch){L.DomEvent.on(link,'click',L.DomEvent.stop).on(link,'click',this._expand,this);}else {L.DomEvent.on(link,'focus',this._expand,this);} //Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
	L.DomEvent.on(form,'click',function(){setTimeout(L.bind(this._onInputClick,this),0);},this);this._map.on('click',this._collapse,this); // TODO keyboard accessibility
	}else {this._expand();}this._baseLayersList = L.DomUtil.create('div',className + '-base',form);this._separator = L.DomUtil.create('div',className + '-separator',form);this._overlaysList = L.DomUtil.create('div',className + '-overlays',form);container.appendChild(form);},_addLayer:function _addLayer(layer,name,overlay){var id=L.stamp(layer);this._layers[id] = {layer:layer,name:name,overlay:overlay};if(this.options.autoZIndex && layer.setZIndex){this._lastZIndex++;layer.setZIndex(this._lastZIndex);}},_update:function _update(){if(!this._container){return;}this._baseLayersList.innerHTML = '';this._overlaysList.innerHTML = '';var baseLayersPresent=false,overlaysPresent=false,i,obj;for(i in this._layers) {obj = this._layers[i];this._addItem(obj);overlaysPresent = overlaysPresent || obj.overlay;baseLayersPresent = baseLayersPresent || !obj.overlay;}this._separator.style.display = overlaysPresent && baseLayersPresent?'':'none';},_onLayerChange:function _onLayerChange(e){var obj=this._layers[L.stamp(e.layer)];if(!obj){return;}if(!this._handlingClick){this._update();}var type=obj.overlay?e.type === 'layeradd'?'overlayadd':'overlayremove':e.type === 'layeradd'?'baselayerchange':null;if(type){this._map.fire(type,obj);}}, // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement:function _createRadioElement(name,checked){var radioHtml='<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';if(checked){radioHtml += ' checked="checked"';}radioHtml += '/>';var radioFragment=document.createElement('div');radioFragment.innerHTML = radioHtml;return radioFragment.firstChild;},_addItem:function _addItem(obj){var label=document.createElement('label'),input,checked=this._map.hasLayer(obj.layer);if(obj.overlay){input = document.createElement('input');input.type = 'checkbox';input.className = 'leaflet-control-layers-selector';input.defaultChecked = checked;}else {input = this._createRadioElement('leaflet-base-layers',checked);}input.layerId = L.stamp(obj.layer);L.DomEvent.on(input,'click',this._onInputClick,this);var name=document.createElement('span');name.innerHTML = ' ' + obj.name;label.appendChild(input);label.appendChild(name);var container=obj.overlay?this._overlaysList:this._baseLayersList;container.appendChild(label);return label;},_onInputClick:function _onInputClick(){var i,input,obj,inputs=this._form.getElementsByTagName('input'),inputsLen=inputs.length;this._handlingClick = true;for(i = 0;i < inputsLen;i++) {input = inputs[i];obj = this._layers[input.layerId];if(input.checked && !this._map.hasLayer(obj.layer)){this._map.addLayer(obj.layer);}else if(!input.checked && this._map.hasLayer(obj.layer)){this._map.removeLayer(obj.layer);}}this._handlingClick = false;this._refocusOnMap();},_expand:function _expand(){L.DomUtil.addClass(this._container,'leaflet-control-layers-expanded');},_collapse:function _collapse(){this._container.className = this._container.className.replace(' leaflet-control-layers-expanded','');}});L.control.layers = function(baseLayers,overlays,options){return new L.Control.Layers(baseLayers,overlays,options);}; /*
	 * L.PosAnimation is used by Leaflet internally for pan animations.
	 */L.PosAnimation = L.Class.extend({includes:L.Mixin.Events,run:function run(el,newPos,duration,easeLinearity){ // (HTMLElement, Point[, Number, Number])
	this.stop();this._el = el;this._inProgress = true;this._newPos = newPos;this.fire('start');el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) + 's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';L.DomEvent.on(el,L.DomUtil.TRANSITION_END,this._onTransitionEnd,this);L.DomUtil.setPosition(el,newPos); // toggle reflow, Chrome flickers for some reason if you don't do this
	L.Util.falseFn(el.offsetWidth); // there's no native way to track value updates of transitioned properties, so we imitate this
	this._stepTimer = setInterval(L.bind(this._onStep,this),50);},stop:function stop(){if(!this._inProgress){return;} // if we just removed the transition property, the element would jump to its final position,
	// so we need to make it stay at the current position
	L.DomUtil.setPosition(this._el,this._getPos());this._onTransitionEnd();L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
	},_onStep:function _onStep(){var stepPos=this._getPos();if(!stepPos){this._onTransitionEnd();return;} // jshint camelcase: false
	// make L.DomUtil.getPosition return intermediate position value during animation
	this._el._leaflet_pos = stepPos;this.fire('step');}, // you can't easily get intermediate values of properties animated with CSS3 Transitions,
	// we need to parse computed style (in case of transform it returns matrix string)
	_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function _getPos(){var left,top,matches,el=this._el,style=window.getComputedStyle(el);if(L.Browser.any3d){matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);if(!matches){return;}left = parseFloat(matches[1]);top = parseFloat(matches[2]);}else {left = parseFloat(style.left);top = parseFloat(style.top);}return new L.Point(left,top,true);},_onTransitionEnd:function _onTransitionEnd(){L.DomEvent.off(this._el,L.DomUtil.TRANSITION_END,this._onTransitionEnd,this);if(!this._inProgress){return;}this._inProgress = false;this._el.style[L.DomUtil.TRANSITION] = ''; // jshint camelcase: false
	// make sure L.DomUtil.getPosition returns the final position value after animation
	this._el._leaflet_pos = this._newPos;clearInterval(this._stepTimer);this.fire('step').fire('end');}}); /*
	 * Extends L.Map to handle panning animations.
	 */L.Map.include({setView:function setView(center,zoom,options){zoom = zoom === undefined?this._zoom:this._limitZoom(zoom);center = this._limitCenter(L.latLng(center),zoom,this.options.maxBounds);options = options || {};if(this._panAnim){this._panAnim.stop();}if(this._loaded && !options.reset && options !== true){if(options.animate !== undefined){options.zoom = L.extend({animate:options.animate},options.zoom);options.pan = L.extend({animate:options.animate},options.pan);} // try animating pan or zoom
	var animated=this._zoom !== zoom?this._tryAnimatedZoom && this._tryAnimatedZoom(center,zoom,options.zoom):this._tryAnimatedPan(center,options.pan);if(animated){ // prevent resize handler call, the view will refresh after animation anyway
	clearTimeout(this._sizeTimer);return this;}} // animation didn't start, just reset the map view
	this._resetView(center,zoom);return this;},panBy:function panBy(offset,options){offset = L.point(offset).round();options = options || {};if(!offset.x && !offset.y){return this;}if(!this._panAnim){this._panAnim = new L.PosAnimation();this._panAnim.on({'step':this._onPanTransitionStep,'end':this._onPanTransitionEnd},this);} // don't fire movestart if animating inertia
	if(!options.noMoveStart){this.fire('movestart');} // animate pan unless animate: false specified
	if(options.animate !== false){L.DomUtil.addClass(this._mapPane,'leaflet-pan-anim');var newPos=this._getMapPanePos().subtract(offset);this._panAnim.run(this._mapPane,newPos,options.duration || 0.25,options.easeLinearity);}else {this._rawPanBy(offset);this.fire('move').fire('moveend');}return this;},_onPanTransitionStep:function _onPanTransitionStep(){this.fire('move');},_onPanTransitionEnd:function _onPanTransitionEnd(){L.DomUtil.removeClass(this._mapPane,'leaflet-pan-anim');this.fire('moveend');},_tryAnimatedPan:function _tryAnimatedPan(center,options){ // difference between the new and current centers in pixels
	var offset=this._getCenterOffset(center)._floor(); // don't animate too far unless animate: true specified in options
	if((options && options.animate) !== true && !this.getSize().contains(offset)){return false;}this.panBy(offset,options);return true;}}); /*
	 * L.PosAnimation fallback implementation that powers Leaflet pan animations
	 * in browsers that don't support CSS3 Transitions.
	 */L.PosAnimation = L.DomUtil.TRANSITION?L.PosAnimation:L.PosAnimation.extend({run:function run(el,newPos,duration,easeLinearity){ // (HTMLElement, Point[, Number, Number])
	this.stop();this._el = el;this._inProgress = true;this._duration = duration || 0.25;this._easeOutPower = 1 / Math.max(easeLinearity || 0.5,0.2);this._startPos = L.DomUtil.getPosition(el);this._offset = newPos.subtract(this._startPos);this._startTime = +new Date();this.fire('start');this._animate();},stop:function stop(){if(!this._inProgress){return;}this._step();this._complete();},_animate:function _animate(){ // animation loop
	this._animId = L.Util.requestAnimFrame(this._animate,this);this._step();},_step:function _step(){var elapsed=+new Date() - this._startTime,duration=this._duration * 1000;if(elapsed < duration){this._runFrame(this._easeOut(elapsed / duration));}else {this._runFrame(1);this._complete();}},_runFrame:function _runFrame(progress){var pos=this._startPos.add(this._offset.multiplyBy(progress));L.DomUtil.setPosition(this._el,pos);this.fire('step');},_complete:function _complete(){L.Util.cancelAnimFrame(this._animId);this._inProgress = false;this.fire('end');},_easeOut:function _easeOut(t){return 1 - Math.pow(1 - t,this._easeOutPower);}}); /*
	 * Extends L.Map to handle zoom animations.
	 */L.Map.mergeOptions({zoomAnimation:true,zoomAnimationThreshold:4});if(L.DomUtil.TRANSITION){L.Map.addInitHook(function(){ // don't animate on browsers without hardware-accelerated transitions or old Android/Opera
	this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera; // zoom transitions run with the same duration for all layers, so if one of transitionend events
	// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
	if(this._zoomAnimated){L.DomEvent.on(this._mapPane,L.DomUtil.TRANSITION_END,this._catchTransitionEnd,this);}});}L.Map.include(!L.DomUtil.TRANSITION?{}:{_catchTransitionEnd:function _catchTransitionEnd(e){if(this._animatingZoom && e.propertyName.indexOf('transform') >= 0){this._onZoomTransitionEnd();}},_nothingToAnimate:function _nothingToAnimate(){return !this._container.getElementsByClassName('leaflet-zoom-animated').length;},_tryAnimatedZoom:function _tryAnimatedZoom(center,zoom,options){if(this._animatingZoom){return true;}options = options || {}; // don't animate if disabled, not supported or zoom difference is too large
	if(!this._zoomAnimated || options.animate === false || this._nothingToAnimate() || Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold){return false;} // offset is the pixel coords of the zoom origin relative to the current center
	var scale=this.getZoomScale(zoom),offset=this._getCenterOffset(center)._divideBy(1 - 1 / scale),origin=this._getCenterLayerPoint()._add(offset); // don't animate if the zoom origin isn't within one screen from the current center, unless forced
	if(options.animate !== true && !this.getSize().contains(offset)){return false;}this.fire('movestart').fire('zoomstart');this._animateZoom(center,zoom,origin,scale,null,true);return true;},_animateZoom:function _animateZoom(center,zoom,origin,scale,delta,backwards,forTouchZoom){if(!forTouchZoom){this._animatingZoom = true;} // put transform transition on all layers with leaflet-zoom-animated class
	L.DomUtil.addClass(this._mapPane,'leaflet-zoom-anim'); // remember what center/zoom to set after animation
	this._animateToCenter = center;this._animateToZoom = zoom; // disable any dragging during animation
	if(L.Draggable){L.Draggable._disabled = true;}L.Util.requestAnimFrame(function(){this.fire('zoomanim',{center:center,zoom:zoom,origin:origin,scale:scale,delta:delta,backwards:backwards}); // horrible hack to work around a Chrome bug https://github.com/Leaflet/Leaflet/issues/3689
	setTimeout(L.bind(this._onZoomTransitionEnd,this),250);},this);},_onZoomTransitionEnd:function _onZoomTransitionEnd(){if(!this._animatingZoom){return;}this._animatingZoom = false;L.DomUtil.removeClass(this._mapPane,'leaflet-zoom-anim');L.Util.requestAnimFrame(function(){this._resetView(this._animateToCenter,this._animateToZoom,true,true);if(L.Draggable){L.Draggable._disabled = false;}},this);}}); /*
		Zoom animation logic for L.TileLayer.
	*/L.TileLayer.include({_animateZoom:function _animateZoom(e){if(!this._animating){this._animating = true;this._prepareBgBuffer();}var bg=this._bgBuffer,transform=L.DomUtil.TRANSFORM,initialTransform=e.delta?L.DomUtil.getTranslateString(e.delta):bg.style[transform],scaleStr=L.DomUtil.getScaleString(e.scale,e.origin);bg.style[transform] = e.backwards?scaleStr + ' ' + initialTransform:initialTransform + ' ' + scaleStr;},_endZoomAnim:function _endZoomAnim(){var front=this._tileContainer,bg=this._bgBuffer;front.style.visibility = '';front.parentNode.appendChild(front); // Bring to fore
	// force reflow
	L.Util.falseFn(bg.offsetWidth);var zoom=this._map.getZoom();if(zoom > this.options.maxZoom || zoom < this.options.minZoom){this._clearBgBuffer();}this._animating = false;},_clearBgBuffer:function _clearBgBuffer(){var map=this._map;if(map && !map._animatingZoom && !map.touchZoom._zooming){this._bgBuffer.innerHTML = '';this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';}},_prepareBgBuffer:function _prepareBgBuffer(){var front=this._tileContainer,bg=this._bgBuffer; // if foreground layer doesn't have many tiles but bg layer does,
	// keep the existing bg layer and just zoom it some more
	var bgLoaded=this._getLoadedTilesPercentage(bg),frontLoaded=this._getLoadedTilesPercentage(front);if(bg && bgLoaded > 0.5 && frontLoaded < 0.5){front.style.visibility = 'hidden';this._stopLoadingImages(front);return;} // prepare the buffer to become the front tile pane
	bg.style.visibility = 'hidden';bg.style[L.DomUtil.TRANSFORM] = ''; // switch out the current layer to be the new bg layer (and vice-versa)
	this._tileContainer = bg;bg = this._bgBuffer = front;this._stopLoadingImages(bg); //prevent bg buffer from clearing right after zoom
	clearTimeout(this._clearBgBufferTimer);},_getLoadedTilesPercentage:function _getLoadedTilesPercentage(container){var tiles=container.getElementsByTagName('img'),i,len,count=0;for(i = 0,len = tiles.length;i < len;i++) {if(tiles[i].complete){count++;}}return count / len;}, // stops loading all tiles in the background layer
	_stopLoadingImages:function _stopLoadingImages(container){var tiles=Array.prototype.slice.call(container.getElementsByTagName('img')),i,len,tile;for(i = 0,len = tiles.length;i < len;i++) {tile = tiles[i];if(!tile.complete){tile.onload = L.Util.falseFn;tile.onerror = L.Util.falseFn;tile.src = L.Util.emptyImageUrl;tile.parentNode.removeChild(tile);}}}}); /*
	 * Provides L.Map with convenient shortcuts for using browser geolocation features.
	 */L.Map.include({_defaultLocateOptions:{watch:false,setView:false,maxZoom:Infinity,timeout:10000,maximumAge:0,enableHighAccuracy:false},locate:function locate( /*Object*/options){options = this._locateOptions = L.extend(this._defaultLocateOptions,options);if(!navigator.geolocation){this._handleGeolocationError({code:0,message:'Geolocation not supported.'});return this;}var onResponse=L.bind(this._handleGeolocationResponse,this),onError=L.bind(this._handleGeolocationError,this);if(options.watch){this._locationWatchId = navigator.geolocation.watchPosition(onResponse,onError,options);}else {navigator.geolocation.getCurrentPosition(onResponse,onError,options);}return this;},stopLocate:function stopLocate(){if(navigator.geolocation){navigator.geolocation.clearWatch(this._locationWatchId);}if(this._locateOptions){this._locateOptions.setView = false;}return this;},_handleGeolocationError:function _handleGeolocationError(error){var c=error.code,message=error.message || (c === 1?'permission denied':c === 2?'position unavailable':'timeout');if(this._locateOptions.setView && !this._loaded){this.fitWorld();}this.fire('locationerror',{code:c,message:'Geolocation error: ' + message + '.'});},_handleGeolocationResponse:function _handleGeolocationResponse(pos){var lat=pos.coords.latitude,lng=pos.coords.longitude,latlng=new L.LatLng(lat,lng),latAccuracy=180 * pos.coords.accuracy / 40075017,lngAccuracy=latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),bounds=L.latLngBounds([lat - latAccuracy,lng - lngAccuracy],[lat + latAccuracy,lng + lngAccuracy]),options=this._locateOptions;if(options.setView){var zoom=Math.min(this.getBoundsZoom(bounds),options.maxZoom);this.setView(latlng,zoom);}var data={latlng:latlng,bounds:bounds,timestamp:pos.timestamp};for(var i in pos.coords) {if(typeof pos.coords[i] === 'number'){data[i] = pos.coords[i];}}this.fire('locationfound',data);}});})(window,document);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var debug = __webpack_require__(9)('transitive');
	var Emitter = __webpack_require__(12);

	var Network = __webpack_require__(13);

	var Display = __webpack_require__(58);

	var DefaultRenderer = __webpack_require__(62);
	var WireframeRenderer = __webpack_require__(65);

	var Styler = __webpack_require__(66);
	var Labeler = __webpack_require__(98);

	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	__webpack_require__(100);

	/*
	 * Expose `Transitive`
	 */

	module.exports = Transitive;

	/**
	 * Expose `version`
	 */

	module.exports.version = '0.8.0';

	/**
	 * Create a new instance of `Transitive`
	 *
	 * @param {Object} options object
	 *   - data {Object} data to render
	 *   - styles {Object} styles to apply
	 *   - el {Element} the DOM element to render the main display to
	 *   - legendEl {Element} the DOM element to render the legend to
	 *   - drawGrid {Boolean} whether to draw a background grid (defaults to false)
	 *   - gridCellSize {Number} resolution of the grid in SphericalMercator meters
	 *   - draggableTypes {Array} a list of network element types to enable dragging for
	 *   - initialBounds {Array} initial lon/lat bounds for the display expressed as [[west, south], [east, north]]
	 *   - displayMargins {Object} padding to apply to the initial rendered network within the display. Expressed in pixels for top/bottom/left/right
	 *   - mapboxId {String} an Mapbox tileset id for rendering background tiles (Deprecated -- use Leaflet with Leaflet.TransitiveLayer)
	 *   - zoomEnabled {Boolean} whether to enable the display's built-in zoom/pan functionality (defaults to true)
	 *   - autoResize {Boolean} whether the display should listen for window resize events and update automatically (defaults to true)
	 *   - groupEdges {Boolean} whether to consider edges with the same origin/destination equivalent for rendering, even if intermediate stop sequence is different (defaults to true)
	 */

	function Transitive(options) {

	  if (!(this instanceof Transitive)) return new Transitive(options);

	  this.options = options;
	  if (this.options.zoomEnabled === undefined) this.options.zoomEnabled = true;
	  if (this.options.autoResize === undefined) this.options.autoResize = true;
	  if (this.options.groupEdges === undefined) this.options.groupEdges = true;

	  if (options.el) this.setElement(options.el);

	  this.data = options.data;

	  this.setRenderer(this.options.initialRenderer || "default");

	  this.labeler = new Labeler(this);
	  this.styler = new Styler(options.styles);
	}

	/**
	 * Mixin `Emitter`
	 */

	Emitter(Transitive.prototype);

	/**
	 * Clear the Network data and redraw the (empty) map
	 */

	Transitive.prototype.clearData = function () {
	  this.network = this.data = null;
	  this.labeler.clear();
	  this.emit('clear data', this);
	};

	/**
	 * Update the Network data and redraw the map
	 */

	Transitive.prototype.updateData = function (data) {
	  this.network = null;
	  this.data = data;
	  if (this.display) this.display.scaleSet = false;
	  this.labeler.clear();
	  this.emit('update data', this);
	};

	/**
	 * Return the collection of default segment styles for a mode.
	 *
	 * @param {String} an OTP mode string
	 */

	Transitive.prototype.getModeStyles = function (mode) {
	  return this.styler.getModeStyles(mode, this.display || new Display(this));
	};

	/** Display/Render Methods **/

	/**
	 * Set the DOM element that serves as the main map canvas
	 */

	Transitive.prototype.setElement = function (el, legendEl) {
	  if (this.el) d3.select(this.el).selectAll('*').remove();

	  this.el = el;
	  this.display = new Display(this);

	  // Emit click events
	  var self = this;
	  this.display.svg.on('click', function () {
	    var x = d3.event.x;
	    var y = d3.event.y;
	    var geographic = sm.inverse([x, y]);
	    self.emit('click', {
	      x: x,
	      y: y,
	      lng: geographic[0],
	      lat: geographic[1]
	    });
	  });

	  this.emit('set element', this, this.el);
	  return this;
	};

	/**
	 * Set the DOM element that serves as the main map canvas
	 */

	Transitive.prototype.setRenderer = function (type) {
	  switch (type) {
	    case 'wireframe':
	      this.renderer = new WireframeRenderer(this);
	      break;
	    case 'default':
	      this.renderer = new DefaultRenderer(this);
	      break;
	  }
	};

	/**
	 * Render
	 */

	Transitive.prototype.render = function () {

	  if (!this.network) {
	    this.network = new Network(this, this.data);
	  }

	  if (!this.display.scaleSet) {
	    this.display.setScale(this.network.graph.bounds(), this.options);
	  }

	  this.renderer.render();

	  this.emit('render', this);
	};

	/**
	 * Render to
	 *
	 * @param {Element} el
	 */

	Transitive.prototype.renderTo = function (el) {
	  this.setElement(el);
	  this.render();

	  this.emit('render to', this);
	  return this;
	};

	/**
	 * Refresh
	 */

	Transitive.prototype.refresh = function (panning) {
	  if (!this.network) {
	    this.render();
	  }

	  this.renderer.refresh();
	};

	/**
	 * focusJourney
	 */

	Transitive.prototype.focusJourney = function (journeyId) {
	  var path = journeyId ? this.network.journeys[journeyId].path : null;
	  this.renderer.focusPath(path);
	};

	/**
	 * Sets the Display bounds
	 * @param {Array} lon/lat bounds expressed as [[west, south], [east, north]]
	 */

	Transitive.prototype.setDisplayBounds = function (llBounds) {
	  this.display.updateDomains([sm.forward(llBounds[0]), sm.forward(llBounds[1])]);
	  this.display.zoomChanged();
	};

	/**
	 * Gets the Network bounds
	 * @returns {Array} lon/lat bounds expressed as [[west, south], [east, north]]
	 */

	Transitive.prototype.getNetworkBounds = function () {
	  if (!this.network || !this.network.graph) return null;
	  var graphBounds = this.network.graph.bounds();
	  var ll1 = sm.inverse(graphBounds[0]),
	      ll2 = sm.inverse(graphBounds[1]);
	  return [[Math.min(ll1[0], ll2[0]), Math.min(ll1[1], ll2[1])], [Math.max(ll1[0], ll2[0]), Math.max(ll1[1], ll2[1])]];
	};

	/**
	 * resize
	 */

	Transitive.prototype.resize = function (width, height) {
	  if (!this.display) return;
	  d3.select(this.display.el).style("width", width + 'px').style("height", height + 'px');
	  this.display.resized();
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";var _Object$defineProperty=__webpack_require__(4)["default"];var _Object$create=__webpack_require__(7)["default"];!(function(){var d3={version:"3.5.8"};var d3_arraySlice=[].slice,d3_array=function d3_array(list){return d3_arraySlice.call(list);};var d3_document=this.document;function d3_documentElement(node){return node && (node.ownerDocument || node.document || node).documentElement;}function d3_window(node){return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);}if(d3_document){try{d3_array(d3_document.documentElement.childNodes)[0].nodeType;}catch(e) {d3_array = function(list){var i=list.length,array=new Array(i);while(i--) array[i] = list[i];return array;};}}if(!Date.now)Date.now = function(){return +new Date();};if(d3_document){try{d3_document.createElement("DIV").style.setProperty("opacity",0,"");}catch(error) {var d3_element_prototype=this.Element.prototype,d3_element_setAttribute=d3_element_prototype.setAttribute,d3_element_setAttributeNS=d3_element_prototype.setAttributeNS,d3_style_prototype=this.CSSStyleDeclaration.prototype,d3_style_setProperty=d3_style_prototype.setProperty;d3_element_prototype.setAttribute = function(name,value){d3_element_setAttribute.call(this,name,value + "");};d3_element_prototype.setAttributeNS = function(space,local,value){d3_element_setAttributeNS.call(this,space,local,value + "");};d3_style_prototype.setProperty = function(name,value,priority){d3_style_setProperty.call(this,name,value + "",priority);};}}d3.ascending = d3_ascending;function d3_ascending(a,b){return a < b?-1:a > b?1:a >= b?0:NaN;}d3.descending = function(a,b){return b < a?-1:b > a?1:b >= a?0:NaN;};d3.min = function(array,f){var i=-1,n=array.length,a,b;if(arguments.length === 1){while(++i < n) if((b = array[i]) != null && b >= b){a = b;break;}while(++i < n) if((b = array[i]) != null && a > b)a = b;}else {while(++i < n) if((b = f.call(array,array[i],i)) != null && b >= b){a = b;break;}while(++i < n) if((b = f.call(array,array[i],i)) != null && a > b)a = b;}return a;};d3.max = function(array,f){var i=-1,n=array.length,a,b;if(arguments.length === 1){while(++i < n) if((b = array[i]) != null && b >= b){a = b;break;}while(++i < n) if((b = array[i]) != null && b > a)a = b;}else {while(++i < n) if((b = f.call(array,array[i],i)) != null && b >= b){a = b;break;}while(++i < n) if((b = f.call(array,array[i],i)) != null && b > a)a = b;}return a;};d3.extent = function(array,f){var i=-1,n=array.length,a,b,c;if(arguments.length === 1){while(++i < n) if((b = array[i]) != null && b >= b){a = c = b;break;}while(++i < n) if((b = array[i]) != null){if(a > b)a = b;if(c < b)c = b;}}else {while(++i < n) if((b = f.call(array,array[i],i)) != null && b >= b){a = c = b;break;}while(++i < n) if((b = f.call(array,array[i],i)) != null){if(a > b)a = b;if(c < b)c = b;}}return [a,c];};function d3_number(x){return x === null?NaN:+x;}function d3_numeric(x){return !isNaN(x);}d3.sum = function(array,f){var s=0,n=array.length,a,i=-1;if(arguments.length === 1){while(++i < n) if(d3_numeric(a = +array[i]))s += a;}else {while(++i < n) if(d3_numeric(a = +f.call(array,array[i],i)))s += a;}return s;};d3.mean = function(array,f){var s=0,n=array.length,a,i=-1,j=n;if(arguments.length === 1){while(++i < n) if(d3_numeric(a = d3_number(array[i])))s += a;else --j;}else {while(++i < n) if(d3_numeric(a = d3_number(f.call(array,array[i],i))))s += a;else --j;}if(j)return s / j;};d3.quantile = function(values,p){var H=(values.length - 1) * p + 1,h=Math.floor(H),v=+values[h - 1],e=H - h;return e?v + e * (values[h] - v):v;};d3.median = function(array,f){var numbers=[],n=array.length,a,i=-1;if(arguments.length === 1){while(++i < n) if(d3_numeric(a = d3_number(array[i])))numbers.push(a);}else {while(++i < n) if(d3_numeric(a = d3_number(f.call(array,array[i],i))))numbers.push(a);}if(numbers.length)return d3.quantile(numbers.sort(d3_ascending),.5);};d3.variance = function(array,f){var n=array.length,m=0,a,d,s=0,i=-1,j=0;if(arguments.length === 1){while(++i < n) {if(d3_numeric(a = d3_number(array[i]))){d = a - m;m += d / ++j;s += d * (a - m);}}}else {while(++i < n) {if(d3_numeric(a = d3_number(f.call(array,array[i],i)))){d = a - m;m += d / ++j;s += d * (a - m);}}}if(j > 1)return s / (j - 1);};d3.deviation = function(){var v=d3.variance.apply(this,arguments);return v?Math.sqrt(v):v;};function d3_bisector(compare){return {left:function left(a,x,lo,hi){if(arguments.length < 3)lo = 0;if(arguments.length < 4)hi = a.length;while(lo < hi) {var mid=lo + hi >>> 1;if(compare(a[mid],x) < 0)lo = mid + 1;else hi = mid;}return lo;},right:function right(a,x,lo,hi){if(arguments.length < 3)lo = 0;if(arguments.length < 4)hi = a.length;while(lo < hi) {var mid=lo + hi >>> 1;if(compare(a[mid],x) > 0)hi = mid;else lo = mid + 1;}return lo;}};}var d3_bisect=d3_bisector(d3_ascending);d3.bisectLeft = d3_bisect.left;d3.bisect = d3.bisectRight = d3_bisect.right;d3.bisector = function(f){return d3_bisector(f.length === 1?function(d,x){return d3_ascending(f(d),x);}:f);};d3.shuffle = function(array,i0,i1){if((m = arguments.length) < 3){i1 = array.length;if(m < 2)i0 = 0;}var m=i1 - i0,t,i;while(m) {i = Math.random() * m-- | 0;t = array[m + i0],array[m + i0] = array[i + i0],array[i + i0] = t;}return array;};d3.permute = function(array,indexes){var i=indexes.length,permutes=new Array(i);while(i--) permutes[i] = array[indexes[i]];return permutes;};d3.pairs = function(array){var i=0,n=array.length - 1,p0,p1=array[0],pairs=new Array(n < 0?0:n);while(i < n) pairs[i] = [p0 = p1,p1 = array[++i]];return pairs;};d3.zip = function(){if(!(n = arguments.length))return [];for(var i=-1,m=d3.min(arguments,d3_zipLength),zips=new Array(m);++i < m;) {for(var j=-1,n,zip=zips[i] = new Array(n);++j < n;) {zip[j] = arguments[j][i];}}return zips;};function d3_zipLength(d){return d.length;}d3.transpose = function(matrix){return d3.zip.apply(d3,matrix);};d3.keys = function(map){var keys=[];for(var key in map) keys.push(key);return keys;};d3.values = function(map){var values=[];for(var key in map) values.push(map[key]);return values;};d3.entries = function(map){var entries=[];for(var key in map) entries.push({key:key,value:map[key]});return entries;};d3.merge = function(arrays){var n=arrays.length,m,i=-1,j=0,merged,array;while(++i < n) j += arrays[i].length;merged = new Array(j);while(--n >= 0) {array = arrays[n];m = array.length;while(--m >= 0) {merged[--j] = array[m];}}return merged;};var abs=Math.abs;d3.range = function(start,stop,step){if(arguments.length < 3){step = 1;if(arguments.length < 2){stop = start;start = 0;}}if((stop - start) / step === Infinity)throw new Error("infinite range");var range=[],k=d3_range_integerScale(abs(step)),i=-1,j;start *= k,stop *= k,step *= k;if(step < 0)while((j = start + step * ++i) > stop) range.push(j / k);else while((j = start + step * ++i) < stop) range.push(j / k);return range;};function d3_range_integerScale(x){var k=1;while(x * k % 1) k *= 10;return k;}function d3_class(ctor,properties){for(var key in properties) {_Object$defineProperty(ctor.prototype,key,{value:properties[key],enumerable:false});}}d3.map = function(object,f){var map=new d3_Map();if(object instanceof d3_Map){object.forEach(function(key,value){map.set(key,value);});}else if(Array.isArray(object)){var i=-1,n=object.length,o;if(arguments.length === 1)while(++i < n) map.set(i,object[i]);else while(++i < n) map.set(f.call(object,o = object[i],i),o);}else {for(var key in object) map.set(key,object[key]);}return map;};function d3_Map(){this._ = _Object$create(null);}var d3_map_proto="__proto__",d3_map_zero="\x00";d3_class(d3_Map,{has:d3_map_has,get:function get(key){return this._[d3_map_escape(key)];},set:function set(key,value){return this._[d3_map_escape(key)] = value;},remove:d3_map_remove,keys:d3_map_keys,values:function values(){var values=[];for(var key in this._) values.push(this._[key]);return values;},entries:function entries(){var entries=[];for(var key in this._) entries.push({key:d3_map_unescape(key),value:this._[key]});return entries;},size:d3_map_size,empty:d3_map_empty,forEach:function forEach(f){for(var key in this._) f.call(this,d3_map_unescape(key),this._[key]);}});function d3_map_escape(key){return (key += "") === d3_map_proto || key[0] === d3_map_zero?d3_map_zero + key:key;}function d3_map_unescape(key){return (key += "")[0] === d3_map_zero?key.slice(1):key;}function d3_map_has(key){return d3_map_escape(key) in this._;}function d3_map_remove(key){return (key = d3_map_escape(key)) in this._ && delete this._[key];}function d3_map_keys(){var keys=[];for(var key in this._) keys.push(d3_map_unescape(key));return keys;}function d3_map_size(){var size=0;for(var key in this._) ++size;return size;}function d3_map_empty(){for(var key in this._) return false;return true;}d3.nest = function(){var nest={},keys=[],sortKeys=[],sortValues,rollup;function map(mapType,array,depth){if(depth >= keys.length)return rollup?rollup.call(nest,array):sortValues?array.sort(sortValues):array;var i=-1,n=array.length,key=keys[depth++],keyValue,object,setter,valuesByKey=new d3_Map(),values;while(++i < n) {if(values = valuesByKey.get(keyValue = key(object = array[i]))){values.push(object);}else {valuesByKey.set(keyValue,[object]);}}if(mapType){object = mapType();setter = function(keyValue,values){object.set(keyValue,map(mapType,values,depth));};}else {object = {};setter = function(keyValue,values){object[keyValue] = map(mapType,values,depth);};}valuesByKey.forEach(setter);return object;}function entries(map,depth){if(depth >= keys.length)return map;var array=[],sortKey=sortKeys[depth++];map.forEach(function(key,keyMap){array.push({key:key,values:entries(keyMap,depth)});});return sortKey?array.sort(function(a,b){return sortKey(a.key,b.key);}):array;}nest.map = function(array,mapType){return map(mapType,array,0);};nest.entries = function(array){return entries(map(d3.map,array,0),0);};nest.key = function(d){keys.push(d);return nest;};nest.sortKeys = function(order){sortKeys[keys.length - 1] = order;return nest;};nest.sortValues = function(order){sortValues = order;return nest;};nest.rollup = function(f){rollup = f;return nest;};return nest;};d3.set = function(array){var set=new d3_Set();if(array)for(var i=0,n=array.length;i < n;++i) set.add(array[i]);return set;};function d3_Set(){this._ = _Object$create(null);}d3_class(d3_Set,{has:d3_map_has,add:function add(key){this._[d3_map_escape(key += "")] = true;return key;},remove:d3_map_remove,values:d3_map_keys,size:d3_map_size,empty:d3_map_empty,forEach:function forEach(f){for(var key in this._) f.call(this,d3_map_unescape(key));}});d3.behavior = {};function d3_identity(d){return d;}d3.rebind = function(target,source){var i=1,n=arguments.length,method;while(++i < n) target[method = arguments[i]] = d3_rebind(target,source,source[method]);return target;};function d3_rebind(target,source,method){return function(){var value=method.apply(source,arguments);return value === source?target:value;};}function d3_vendorSymbol(object,name){if(name in object)return name;name = name.charAt(0).toUpperCase() + name.slice(1);for(var i=0,n=d3_vendorPrefixes.length;i < n;++i) {var prefixName=d3_vendorPrefixes[i] + name;if(prefixName in object)return prefixName;}}var d3_vendorPrefixes=["webkit","ms","moz","Moz","o","O"];function d3_noop(){}d3.dispatch = function(){var dispatch=new d3_dispatch(),i=-1,n=arguments.length;while(++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);return dispatch;};function d3_dispatch(){}d3_dispatch.prototype.on = function(type,listener){var i=type.indexOf("."),name="";if(i >= 0){name = type.slice(i + 1);type = type.slice(0,i);}if(type)return arguments.length < 2?this[type].on(name):this[type].on(name,listener);if(arguments.length === 2){if(listener == null)for(type in this) {if(this.hasOwnProperty(type))this[type].on(name,null);}return this;}};function d3_dispatch_event(dispatch){var listeners=[],listenerByName=new d3_Map();function event(){var z=listeners,i=-1,n=z.length,l;while(++i < n) if(l = z[i].on)l.apply(this,arguments);return dispatch;}event.on = function(name,listener){var l=listenerByName.get(name),i;if(arguments.length < 2)return l && l.on;if(l){l.on = null;listeners = listeners.slice(0,i = listeners.indexOf(l)).concat(listeners.slice(i + 1));listenerByName.remove(name);}if(listener)listeners.push(listenerByName.set(name,{on:listener}));return dispatch;};return event;}d3.event = null;function d3_eventPreventDefault(){d3.event.preventDefault();}function d3_eventSource(){var e=d3.event,s;while(s = e.sourceEvent) e = s;return e;}function d3_eventDispatch(target){var dispatch=new d3_dispatch(),i=0,n=arguments.length;while(++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);dispatch.of = function(thiz,argumentz){return function(e1){try{var e0=e1.sourceEvent = d3.event;e1.target = target;d3.event = e1;dispatch[e1.type].apply(thiz,argumentz);}finally {d3.event = e0;}};};return dispatch;}d3.requote = function(s){return s.replace(d3_requote_re,"\\$&");};var d3_requote_re=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;var d3_subclass=({}).__proto__?function(object,prototype){object.__proto__ = prototype;}:function(object,prototype){for(var property in prototype) object[property] = prototype[property];};function d3_selection(groups){d3_subclass(groups,d3_selectionPrototype);return groups;}var d3_select=function d3_select(s,n){return n.querySelector(s);},d3_selectAll=function d3_selectAll(s,n){return n.querySelectorAll(s);},_d3_selectMatches=function d3_selectMatches(n,s){var d3_selectMatcher=n.matches || n[d3_vendorSymbol(n,"matchesSelector")];_d3_selectMatches = function(n,s){return d3_selectMatcher.call(n,s);};return _d3_selectMatches(n,s);};if(typeof Sizzle === "function"){d3_select = function(s,n){return Sizzle(s,n)[0] || null;};d3_selectAll = Sizzle;_d3_selectMatches = Sizzle.matchesSelector;}d3.selection = function(){return d3.select(d3_document.documentElement);};var d3_selectionPrototype=d3.selection.prototype = [];d3_selectionPrototype.select = function(selector){var subgroups=[],subgroup,subnode,group,node;selector = d3_selection_selector(selector);for(var j=-1,m=this.length;++j < m;) {subgroups.push(subgroup = []);subgroup.parentNode = (group = this[j]).parentNode;for(var i=-1,n=group.length;++i < n;) {if(node = group[i]){subgroup.push(subnode = selector.call(node,node.__data__,i,j));if(subnode && "__data__" in node)subnode.__data__ = node.__data__;}else {subgroup.push(null);}}}return d3_selection(subgroups);};function d3_selection_selector(selector){return typeof selector === "function"?selector:function(){return d3_select(selector,this);};}d3_selectionPrototype.selectAll = function(selector){var subgroups=[],subgroup,node;selector = d3_selection_selectorAll(selector);for(var j=-1,m=this.length;++j < m;) {for(var group=this[j],i=-1,n=group.length;++i < n;) {if(node = group[i]){subgroups.push(subgroup = d3_array(selector.call(node,node.__data__,i,j)));subgroup.parentNode = node;}}}return d3_selection(subgroups);};function d3_selection_selectorAll(selector){return typeof selector === "function"?selector:function(){return d3_selectAll(selector,this);};}var d3_nsPrefix={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};d3.ns = {prefix:d3_nsPrefix,qualify:function qualify(name){var i=name.indexOf(":"),prefix=name;if(i >= 0 && (prefix = name.slice(0,i)) !== "xmlns")name = name.slice(i + 1);return d3_nsPrefix.hasOwnProperty(prefix)?{space:d3_nsPrefix[prefix],local:name}:name;}};d3_selectionPrototype.attr = function(name,value){if(arguments.length < 2){if(typeof name === "string"){var node=this.node();name = d3.ns.qualify(name);return name.local?node.getAttributeNS(name.space,name.local):node.getAttribute(name);}for(value in name) this.each(d3_selection_attr(value,name[value]));return this;}return this.each(d3_selection_attr(name,value));};function d3_selection_attr(name,value){name = d3.ns.qualify(name);function attrNull(){this.removeAttribute(name);}function attrNullNS(){this.removeAttributeNS(name.space,name.local);}function attrConstant(){this.setAttribute(name,value);}function attrConstantNS(){this.setAttributeNS(name.space,name.local,value);}function attrFunction(){var x=value.apply(this,arguments);if(x == null)this.removeAttribute(name);else this.setAttribute(name,x);}function attrFunctionNS(){var x=value.apply(this,arguments);if(x == null)this.removeAttributeNS(name.space,name.local);else this.setAttributeNS(name.space,name.local,x);}return value == null?name.local?attrNullNS:attrNull:typeof value === "function"?name.local?attrFunctionNS:attrFunction:name.local?attrConstantNS:attrConstant;}function d3_collapse(s){return s.trim().replace(/\s+/g," ");}d3_selectionPrototype.classed = function(name,value){if(arguments.length < 2){if(typeof name === "string"){var node=this.node(),n=(name = d3_selection_classes(name)).length,i=-1;if(value = node.classList){while(++i < n) if(!value.contains(name[i]))return false;}else {value = node.getAttribute("class");while(++i < n) if(!d3_selection_classedRe(name[i]).test(value))return false;}return true;}for(value in name) this.each(d3_selection_classed(value,name[value]));return this;}return this.each(d3_selection_classed(name,value));};function d3_selection_classedRe(name){return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)","g");}function d3_selection_classes(name){return (name + "").trim().split(/^|\s+/);}function d3_selection_classed(name,value){name = d3_selection_classes(name).map(d3_selection_classedName);var n=name.length;function classedConstant(){var i=-1;while(++i < n) name[i](this,value);}function classedFunction(){var i=-1,x=value.apply(this,arguments);while(++i < n) name[i](this,x);}return typeof value === "function"?classedFunction:classedConstant;}function d3_selection_classedName(name){var re=d3_selection_classedRe(name);return function(node,value){if(c = node.classList)return value?c.add(name):c.remove(name);var c=node.getAttribute("class") || "";if(value){re.lastIndex = 0;if(!re.test(c))node.setAttribute("class",d3_collapse(c + " " + name));}else {node.setAttribute("class",d3_collapse(c.replace(re," ")));}};}d3_selectionPrototype.style = function(name,value,priority){var n=arguments.length;if(n < 3){if(typeof name !== "string"){if(n < 2)value = "";for(priority in name) this.each(d3_selection_style(priority,name[priority],value));return this;}if(n < 2){var node=this.node();return d3_window(node).getComputedStyle(node,null).getPropertyValue(name);}priority = "";}return this.each(d3_selection_style(name,value,priority));};function d3_selection_style(name,value,priority){function styleNull(){this.style.removeProperty(name);}function styleConstant(){this.style.setProperty(name,value,priority);}function styleFunction(){var x=value.apply(this,arguments);if(x == null)this.style.removeProperty(name);else this.style.setProperty(name,x,priority);}return value == null?styleNull:typeof value === "function"?styleFunction:styleConstant;}d3_selectionPrototype.property = function(name,value){if(arguments.length < 2){if(typeof name === "string")return this.node()[name];for(value in name) this.each(d3_selection_property(value,name[value]));return this;}return this.each(d3_selection_property(name,value));};function d3_selection_property(name,value){function propertyNull(){delete this[name];}function propertyConstant(){this[name] = value;}function propertyFunction(){var x=value.apply(this,arguments);if(x == null)delete this[name];else this[name] = x;}return value == null?propertyNull:typeof value === "function"?propertyFunction:propertyConstant;}d3_selectionPrototype.text = function(value){return arguments.length?this.each(typeof value === "function"?function(){var v=value.apply(this,arguments);this.textContent = v == null?"":v;}:value == null?function(){this.textContent = "";}:function(){this.textContent = value;}):this.node().textContent;};d3_selectionPrototype.html = function(value){return arguments.length?this.each(typeof value === "function"?function(){var v=value.apply(this,arguments);this.innerHTML = v == null?"":v;}:value == null?function(){this.innerHTML = "";}:function(){this.innerHTML = value;}):this.node().innerHTML;};d3_selectionPrototype.append = function(name){name = d3_selection_creator(name);return this.select(function(){return this.appendChild(name.apply(this,arguments));});};function d3_selection_creator(name){function create(){var document=this.ownerDocument,namespace=this.namespaceURI;return namespace?document.createElementNS(namespace,name):document.createElement(name);}function createNS(){return this.ownerDocument.createElementNS(name.space,name.local);}return typeof name === "function"?name:(name = d3.ns.qualify(name)).local?createNS:create;}d3_selectionPrototype.insert = function(name,before){name = d3_selection_creator(name);before = d3_selection_selector(before);return this.select(function(){return this.insertBefore(name.apply(this,arguments),before.apply(this,arguments) || null);});};d3_selectionPrototype.remove = function(){return this.each(d3_selectionRemove);};function d3_selectionRemove(){var parent=this.parentNode;if(parent)parent.removeChild(this);}d3_selectionPrototype.data = function(value,key){var i=-1,n=this.length,group,node;if(!arguments.length){value = new Array(n = (group = this[0]).length);while(++i < n) {if(node = group[i]){value[i] = node.__data__;}}return value;}function bind(group,groupData){var i,n=group.length,m=groupData.length,n0=Math.min(n,m),updateNodes=new Array(m),enterNodes=new Array(m),exitNodes=new Array(n),node,nodeData;if(key){var nodeByKeyValue=new d3_Map(),keyValues=new Array(n),keyValue;for(i = -1;++i < n;) {if(node = group[i]){if(nodeByKeyValue.has(keyValue = key.call(node,node.__data__,i))){exitNodes[i] = node;}else {nodeByKeyValue.set(keyValue,node);}keyValues[i] = keyValue;}}for(i = -1;++i < m;) {if(!(node = nodeByKeyValue.get(keyValue = key.call(groupData,nodeData = groupData[i],i)))){enterNodes[i] = d3_selection_dataNode(nodeData);}else if(node !== true){updateNodes[i] = node;node.__data__ = nodeData;}nodeByKeyValue.set(keyValue,true);}for(i = -1;++i < n;) {if(i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true){exitNodes[i] = group[i];}}}else {for(i = -1;++i < n0;) {node = group[i];nodeData = groupData[i];if(node){node.__data__ = nodeData;updateNodes[i] = node;}else {enterNodes[i] = d3_selection_dataNode(nodeData);}}for(;i < m;++i) {enterNodes[i] = d3_selection_dataNode(groupData[i]);}for(;i < n;++i) {exitNodes[i] = group[i];}}enterNodes.update = updateNodes;enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;enter.push(enterNodes);update.push(updateNodes);exit.push(exitNodes);}var enter=d3_selection_enter([]),update=d3_selection([]),exit=d3_selection([]);if(typeof value === "function"){while(++i < n) {bind(group = this[i],value.call(group,group.parentNode.__data__,i));}}else {while(++i < n) {bind(group = this[i],value);}}update.enter = function(){return enter;};update.exit = function(){return exit;};return update;};function d3_selection_dataNode(data){return {__data__:data};}d3_selectionPrototype.datum = function(value){return arguments.length?this.property("__data__",value):this.property("__data__");};d3_selectionPrototype.filter = function(filter){var subgroups=[],subgroup,group,node;if(typeof filter !== "function")filter = d3_selection_filter(filter);for(var j=0,m=this.length;j < m;j++) {subgroups.push(subgroup = []);subgroup.parentNode = (group = this[j]).parentNode;for(var i=0,n=group.length;i < n;i++) {if((node = group[i]) && filter.call(node,node.__data__,i,j)){subgroup.push(node);}}}return d3_selection(subgroups);};function d3_selection_filter(selector){return function(){return _d3_selectMatches(this,selector);};}d3_selectionPrototype.order = function(){for(var j=-1,m=this.length;++j < m;) {for(var group=this[j],i=group.length - 1,next=group[i],node;--i >= 0;) {if(node = group[i]){if(next && next !== node.nextSibling)next.parentNode.insertBefore(node,next);next = node;}}}return this;};d3_selectionPrototype.sort = function(comparator){comparator = d3_selection_sortComparator.apply(this,arguments);for(var j=-1,m=this.length;++j < m;) this[j].sort(comparator);return this.order();};function d3_selection_sortComparator(comparator){if(!arguments.length)comparator = d3_ascending;return function(a,b){return a && b?comparator(a.__data__,b.__data__):!a - !b;};}d3_selectionPrototype.each = function(callback){return d3_selection_each(this,function(node,i,j){callback.call(node,node.__data__,i,j);});};function d3_selection_each(groups,callback){for(var j=0,m=groups.length;j < m;j++) {for(var group=groups[j],i=0,n=group.length,node;i < n;i++) {if(node = group[i])callback(node,i,j);}}return groups;}d3_selectionPrototype.call = function(callback){var args=d3_array(arguments);callback.apply(args[0] = this,args);return this;};d3_selectionPrototype.empty = function(){return !this.node();};d3_selectionPrototype.node = function(){for(var j=0,m=this.length;j < m;j++) {for(var group=this[j],i=0,n=group.length;i < n;i++) {var node=group[i];if(node)return node;}}return null;};d3_selectionPrototype.size = function(){var n=0;d3_selection_each(this,function(){++n;});return n;};function d3_selection_enter(selection){d3_subclass(selection,d3_selection_enterPrototype);return selection;}var d3_selection_enterPrototype=[];d3.selection.enter = d3_selection_enter;d3.selection.enter.prototype = d3_selection_enterPrototype;d3_selection_enterPrototype.append = d3_selectionPrototype.append;d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;d3_selection_enterPrototype.node = d3_selectionPrototype.node;d3_selection_enterPrototype.call = d3_selectionPrototype.call;d3_selection_enterPrototype.size = d3_selectionPrototype.size;d3_selection_enterPrototype.select = function(selector){var subgroups=[],subgroup,subnode,upgroup,group,node;for(var j=-1,m=this.length;++j < m;) {upgroup = (group = this[j]).update;subgroups.push(subgroup = []);subgroup.parentNode = group.parentNode;for(var i=-1,n=group.length;++i < n;) {if(node = group[i]){subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode,node.__data__,i,j));subnode.__data__ = node.__data__;}else {subgroup.push(null);}}}return d3_selection(subgroups);};d3_selection_enterPrototype.insert = function(name,before){if(arguments.length < 2)before = d3_selection_enterInsertBefore(this);return d3_selectionPrototype.insert.call(this,name,before);};function d3_selection_enterInsertBefore(enter){var i0,j0;return function(d,i,j){var group=enter[j].update,n=group.length,node;if(j != j0)j0 = j,i0 = 0;if(i >= i0)i0 = i + 1;while(!(node = group[i0]) && ++i0 < n);return node;};}d3.select = function(node){var group;if(typeof node === "string"){group = [d3_select(node,d3_document)];group.parentNode = d3_document.documentElement;}else {group = [node];group.parentNode = d3_documentElement(node);}return d3_selection([group]);};d3.selectAll = function(nodes){var group;if(typeof nodes === "string"){group = d3_array(d3_selectAll(nodes,d3_document));group.parentNode = d3_document.documentElement;}else {group = d3_array(nodes);group.parentNode = null;}return d3_selection([group]);};d3_selectionPrototype.on = function(type,listener,capture){var n=arguments.length;if(n < 3){if(typeof type !== "string"){if(n < 2)listener = false;for(capture in type) this.each(d3_selection_on(capture,type[capture],listener));return this;}if(n < 2)return (n = this.node()["__on" + type]) && n._;capture = false;}return this.each(d3_selection_on(type,listener,capture));};function d3_selection_on(type,listener,capture){var name="__on" + type,i=type.indexOf("."),wrap=d3_selection_onListener;if(i > 0)type = type.slice(0,i);var filter=d3_selection_onFilters.get(type);if(filter)type = filter,wrap = d3_selection_onFilter;function onRemove(){var l=this[name];if(l){this.removeEventListener(type,l,l.$);delete this[name];}}function onAdd(){var l=wrap(listener,d3_array(arguments));onRemove.call(this);this.addEventListener(type,this[name] = l,l.$ = capture);l._ = listener;}function removeAll(){var re=new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),match;for(var name in this) {if(match = name.match(re)){var l=this[name];this.removeEventListener(match[1],l,l.$);delete this[name];}}}return i?listener?onAdd:onRemove:listener?d3_noop:removeAll;}var d3_selection_onFilters=d3.map({mouseenter:"mouseover",mouseleave:"mouseout"});if(d3_document){d3_selection_onFilters.forEach(function(k){if("on" + k in d3_document)d3_selection_onFilters.remove(k);});}function d3_selection_onListener(listener,argumentz){return function(e){var o=d3.event;d3.event = e;argumentz[0] = this.__data__;try{listener.apply(this,argumentz);}finally {d3.event = o;}};}function d3_selection_onFilter(listener,argumentz){var l=d3_selection_onListener(listener,argumentz);return function(e){var target=this,related=e.relatedTarget;if(!related || related !== target && !(related.compareDocumentPosition(target) & 8)){l.call(target,e);}};}var d3_event_dragSelect,d3_event_dragId=0;function d3_event_dragSuppress(node){var name=".dragsuppress-" + ++d3_event_dragId,click="click" + name,w=d3.select(d3_window(node)).on("touchmove" + name,d3_eventPreventDefault).on("dragstart" + name,d3_eventPreventDefault).on("selectstart" + name,d3_eventPreventDefault);if(d3_event_dragSelect == null){d3_event_dragSelect = "onselectstart" in node?false:d3_vendorSymbol(node.style,"userSelect");}if(d3_event_dragSelect){var style=d3_documentElement(node).style,select=style[d3_event_dragSelect];style[d3_event_dragSelect] = "none";}return function(suppressClick){w.on(name,null);if(d3_event_dragSelect)style[d3_event_dragSelect] = select;if(suppressClick){var off=function off(){w.on(click,null);};w.on(click,function(){d3_eventPreventDefault();off();},true);setTimeout(off,0);}};}d3.mouse = function(container){return d3_mousePoint(container,d3_eventSource());};var d3_mouse_bug44083=this.navigator && /WebKit/.test(this.navigator.userAgent)?-1:0;function d3_mousePoint(container,e){if(e.changedTouches)e = e.changedTouches[0];var svg=container.ownerSVGElement || container;if(svg.createSVGPoint){var point=svg.createSVGPoint();if(d3_mouse_bug44083 < 0){var window=d3_window(container);if(window.scrollX || window.scrollY){svg = d3.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var ctm=svg[0][0].getScreenCTM();d3_mouse_bug44083 = !(ctm.f || ctm.e);svg.remove();}}if(d3_mouse_bug44083)point.x = e.pageX,point.y = e.pageY;else point.x = e.clientX,point.y = e.clientY;point = point.matrixTransform(container.getScreenCTM().inverse());return [point.x,point.y];}var rect=container.getBoundingClientRect();return [e.clientX - rect.left - container.clientLeft,e.clientY - rect.top - container.clientTop];}d3.touch = function(container,touches,identifier){if(arguments.length < 3)identifier = touches,touches = d3_eventSource().changedTouches;if(touches)for(var i=0,n=touches.length,touch;i < n;++i) {if((touch = touches[i]).identifier === identifier){return d3_mousePoint(container,touch);}}};d3.behavior.drag = function(){var event=d3_eventDispatch(drag,"drag","dragstart","dragend"),origin=null,mousedown=dragstart(d3_noop,d3.mouse,d3_window,"mousemove","mouseup"),touchstart=dragstart(d3_behavior_dragTouchId,d3.touch,d3_identity,"touchmove","touchend");function drag(){this.on("mousedown.drag",mousedown).on("touchstart.drag",touchstart);}function dragstart(id,position,subject,move,end){return function(){var that=this,target=d3.event.target,parent=that.parentNode,dispatch=event.of(that,arguments),dragged=0,dragId=id(),dragName=".drag" + (dragId == null?"":"-" + dragId),dragOffset,dragSubject=d3.select(subject(target)).on(move + dragName,moved).on(end + dragName,ended),dragRestore=d3_event_dragSuppress(target),position0=position(parent,dragId);if(origin){dragOffset = origin.apply(that,arguments);dragOffset = [dragOffset.x - position0[0],dragOffset.y - position0[1]];}else {dragOffset = [0,0];}dispatch({type:"dragstart"});function moved(){var position1=position(parent,dragId),dx,dy;if(!position1)return;dx = position1[0] - position0[0];dy = position1[1] - position0[1];dragged |= dx | dy;position0 = position1;dispatch({type:"drag",x:position1[0] + dragOffset[0],y:position1[1] + dragOffset[1],dx:dx,dy:dy});}function ended(){if(!position(parent,dragId))return;dragSubject.on(move + dragName,null).on(end + dragName,null);dragRestore(dragged && d3.event.target === target);dispatch({type:"dragend"});}};}drag.origin = function(x){if(!arguments.length)return origin;origin = x;return drag;};return d3.rebind(drag,event,"on");};function d3_behavior_dragTouchId(){return d3.event.changedTouches[0].identifier;}d3.touches = function(container,touches){if(arguments.length < 2)touches = d3_eventSource().touches;return touches?d3_array(touches).map(function(touch){var point=d3_mousePoint(container,touch);point.identifier = touch.identifier;return point;}):[];};var ε=1e-6,ε2=ε * ε,π=Math.PI,τ=2 * π,τε=τ - ε,halfπ=π / 2,d3_radians=π / 180,d3_degrees=180 / π;function d3_sgn(x){return x > 0?1:x < 0?-1:0;}function d3_cross2d(a,b,c){return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);}function d3_acos(x){return x > 1?0:x < -1?π:Math.acos(x);}function d3_asin(x){return x > 1?halfπ:x < -1?-halfπ:Math.asin(x);}function d3_sinh(x){return ((x = Math.exp(x)) - 1 / x) / 2;}function d3_cosh(x){return ((x = Math.exp(x)) + 1 / x) / 2;}function d3_tanh(x){return ((x = Math.exp(2 * x)) - 1) / (x + 1);}function d3_haversin(x){return (x = Math.sin(x / 2)) * x;}var ρ=Math.SQRT2,ρ2=2,ρ4=4;d3.interpolateZoom = function(p0,p1){var ux0=p0[0],uy0=p0[1],w0=p0[2],ux1=p1[0],uy1=p1[1],w1=p1[2],dx=ux1 - ux0,dy=uy1 - uy0,d2=dx * dx + dy * dy,i,S;if(d2 < ε2){S = Math.log(w1 / w0) / ρ;i = function(t){return [ux0 + t * dx,uy0 + t * dy,w0 * Math.exp(ρ * t * S)];};}else {var d1=Math.sqrt(d2),b0=(w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1),b1=(w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1),r0=Math.log(Math.sqrt(b0 * b0 + 1) - b0),r1=Math.log(Math.sqrt(b1 * b1 + 1) - b1);S = (r1 - r0) / ρ;i = function(t){var s=t * S,coshr0=d3_cosh(r0),u=w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));return [ux0 + u * dx,uy0 + u * dy,w0 * coshr0 / d3_cosh(ρ * s + r0)];};}i.duration = S * 1e3;return i;};d3.behavior.zoom = function(){var view={x:0,y:0,k:1},translate0,center0,center,size=[960,500],scaleExtent=d3_behavior_zoomInfinity,duration=250,zooming=0,mousedown="mousedown.zoom",mousemove="mousemove.zoom",mouseup="mouseup.zoom",mousewheelTimer,touchstart="touchstart.zoom",touchtime,event=d3_eventDispatch(zoom,"zoomstart","zoom","zoomend"),x0,x1,y0,y1;if(!d3_behavior_zoomWheel){d3_behavior_zoomWheel = "onwheel" in d3_document?(d3_behavior_zoomDelta = function(){return -d3.event.deltaY * (d3.event.deltaMode?120:1);},"wheel"):"onmousewheel" in d3_document?(d3_behavior_zoomDelta = function(){return d3.event.wheelDelta;},"mousewheel"):(d3_behavior_zoomDelta = function(){return -d3.event.detail;},"MozMousePixelScroll");}function zoom(g){g.on(mousedown,mousedowned).on(d3_behavior_zoomWheel + ".zoom",mousewheeled).on("dblclick.zoom",dblclicked).on(touchstart,touchstarted);}zoom.event = function(g){g.each(function(){var dispatch=event.of(this,arguments),view1=view;if(d3_transitionInheritId){d3.select(this).transition().each("start.zoom",function(){view = this.__chart__ || {x:0,y:0,k:1};zoomstarted(dispatch);}).tween("zoom:zoom",function(){var dx=size[0],dy=size[1],cx=center0?center0[0]:dx / 2,cy=center0?center0[1]:dy / 2,i=d3.interpolateZoom([(cx - view.x) / view.k,(cy - view.y) / view.k,dx / view.k],[(cx - view1.x) / view1.k,(cy - view1.y) / view1.k,dx / view1.k]);return function(t){var l=i(t),k=dx / l[2];this.__chart__ = view = {x:cx - l[0] * k,y:cy - l[1] * k,k:k};zoomed(dispatch);};}).each("interrupt.zoom",function(){zoomended(dispatch);}).each("end.zoom",function(){zoomended(dispatch);});}else {this.__chart__ = view;zoomstarted(dispatch);zoomed(dispatch);zoomended(dispatch);}});};zoom.translate = function(_){if(!arguments.length)return [view.x,view.y];view = {x:+_[0],y:+_[1],k:view.k};rescale();return zoom;};zoom.scale = function(_){if(!arguments.length)return view.k;view = {x:view.x,y:view.y,k:null};scaleTo(+_);rescale();return zoom;};zoom.scaleExtent = function(_){if(!arguments.length)return scaleExtent;scaleExtent = _ == null?d3_behavior_zoomInfinity:[+_[0],+_[1]];return zoom;};zoom.center = function(_){if(!arguments.length)return center;center = _ && [+_[0],+_[1]];return zoom;};zoom.size = function(_){if(!arguments.length)return size;size = _ && [+_[0],+_[1]];return zoom;};zoom.duration = function(_){if(!arguments.length)return duration;duration = +_;return zoom;};zoom.x = function(z){if(!arguments.length)return x1;x1 = z;x0 = z.copy();view = {x:0,y:0,k:1};return zoom;};zoom.y = function(z){if(!arguments.length)return y1;y1 = z;y0 = z.copy();view = {x:0,y:0,k:1};return zoom;};function location(p){return [(p[0] - view.x) / view.k,(p[1] - view.y) / view.k];}function point(l){return [l[0] * view.k + view.x,l[1] * view.k + view.y];}function scaleTo(s){view.k = Math.max(scaleExtent[0],Math.min(scaleExtent[1],s));}function translateTo(p,l){l = point(l);view.x += p[0] - l[0];view.y += p[1] - l[1];}function zoomTo(that,p,l,k){that.__chart__ = {x:view.x,y:view.y,k:view.k};scaleTo(Math.pow(2,k));translateTo(center0 = p,l);that = d3.select(that);if(duration > 0)that = that.transition().duration(duration);that.call(zoom.event);}function rescale(){if(x1)x1.domain(x0.range().map(function(x){return (x - view.x) / view.k;}).map(x0.invert));if(y1)y1.domain(y0.range().map(function(y){return (y - view.y) / view.k;}).map(y0.invert));}function zoomstarted(dispatch){if(! zooming++)dispatch({type:"zoomstart"});}function zoomed(dispatch){rescale();dispatch({type:"zoom",scale:view.k,translate:[view.x,view.y]});}function zoomended(dispatch){if(! --zooming)dispatch({type:"zoomend"}),center0 = null;}function mousedowned(){var that=this,target=d3.event.target,dispatch=event.of(that,arguments),dragged=0,subject=d3.select(d3_window(that)).on(mousemove,moved).on(mouseup,ended),location0=location(d3.mouse(that)),dragRestore=d3_event_dragSuppress(that);d3_selection_interrupt.call(that);zoomstarted(dispatch);function moved(){dragged = 1;translateTo(d3.mouse(that),location0);zoomed(dispatch);}function ended(){subject.on(mousemove,null).on(mouseup,null);dragRestore(dragged && d3.event.target === target);zoomended(dispatch);}}function touchstarted(){var that=this,dispatch=event.of(that,arguments),locations0={},distance0=0,scale0,zoomName=".zoom-" + d3.event.changedTouches[0].identifier,touchmove="touchmove" + zoomName,touchend="touchend" + zoomName,targets=[],subject=d3.select(that),dragRestore=d3_event_dragSuppress(that);started();zoomstarted(dispatch);subject.on(mousedown,null).on(touchstart,started);function relocate(){var touches=d3.touches(that);scale0 = view.k;touches.forEach(function(t){if(t.identifier in locations0)locations0[t.identifier] = location(t);});return touches;}function started(){var target=d3.event.target;d3.select(target).on(touchmove,moved).on(touchend,ended);targets.push(target);var changed=d3.event.changedTouches;for(var i=0,n=changed.length;i < n;++i) {locations0[changed[i].identifier] = null;}var touches=relocate(),now=Date.now();if(touches.length === 1){if(now - touchtime < 500){var p=touches[0];zoomTo(that,p,locations0[p.identifier],Math.floor(Math.log(view.k) / Math.LN2) + 1);d3_eventPreventDefault();}touchtime = now;}else if(touches.length > 1){var p=touches[0],q=touches[1],dx=p[0] - q[0],dy=p[1] - q[1];distance0 = dx * dx + dy * dy;}}function moved(){var touches=d3.touches(that),p0,l0,p1,l1;d3_selection_interrupt.call(that);for(var i=0,n=touches.length;i < n;++i,l1 = null) {p1 = touches[i];if(l1 = locations0[p1.identifier]){if(l0)break;p0 = p1,l0 = l1;}}if(l1){var distance1=(distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1,scale1=distance0 && Math.sqrt(distance1 / distance0);p0 = [(p0[0] + p1[0]) / 2,(p0[1] + p1[1]) / 2];l0 = [(l0[0] + l1[0]) / 2,(l0[1] + l1[1]) / 2];scaleTo(scale1 * scale0);}touchtime = null;translateTo(p0,l0);zoomed(dispatch);}function ended(){if(d3.event.touches.length){var changed=d3.event.changedTouches;for(var i=0,n=changed.length;i < n;++i) {delete locations0[changed[i].identifier];}for(var identifier in locations0) {return void relocate();}}d3.selectAll(targets).on(zoomName,null);subject.on(mousedown,mousedowned).on(touchstart,touchstarted);dragRestore();zoomended(dispatch);}}function mousewheeled(){var dispatch=event.of(this,arguments);if(mousewheelTimer)clearTimeout(mousewheelTimer);else d3_selection_interrupt.call(this),translate0 = location(center0 = center || d3.mouse(this)),zoomstarted(dispatch);mousewheelTimer = setTimeout(function(){mousewheelTimer = null;zoomended(dispatch);},50);d3_eventPreventDefault();scaleTo(Math.pow(2,d3_behavior_zoomDelta() * .002) * view.k);translateTo(center0,translate0);zoomed(dispatch);}function dblclicked(){var p=d3.mouse(this),k=Math.log(view.k) / Math.LN2;zoomTo(this,p,location(p),d3.event.shiftKey?Math.ceil(k) - 1:Math.floor(k) + 1);}return d3.rebind(zoom,event,"on");};var d3_behavior_zoomInfinity=[0,Infinity],d3_behavior_zoomDelta,d3_behavior_zoomWheel;d3.color = d3_color;function d3_color(){}d3_color.prototype.toString = function(){return this.rgb() + "";};d3.hsl = d3_hsl;function d3_hsl(h,s,l){return this instanceof d3_hsl?void (this.h = +h,this.s = +s,this.l = +l):arguments.length < 2?h instanceof d3_hsl?new d3_hsl(h.h,h.s,h.l):d3_rgb_parse("" + h,d3_rgb_hsl,d3_hsl):new d3_hsl(h,s,l);}var d3_hslPrototype=d3_hsl.prototype = new d3_color();d3_hslPrototype.brighter = function(k){k = Math.pow(.7,arguments.length?k:1);return new d3_hsl(this.h,this.s,this.l / k);};d3_hslPrototype.darker = function(k){k = Math.pow(.7,arguments.length?k:1);return new d3_hsl(this.h,this.s,k * this.l);};d3_hslPrototype.rgb = function(){return d3_hsl_rgb(this.h,this.s,this.l);};function d3_hsl_rgb(h,s,l){var m1,m2;h = isNaN(h)?0:(h %= 360) < 0?h + 360:h;s = isNaN(s)?0:s < 0?0:s > 1?1:s;l = l < 0?0:l > 1?1:l;m2 = l <= .5?l * (1 + s):l + s - l * s;m1 = 2 * l - m2;function v(h){if(h > 360)h -= 360;else if(h < 0)h += 360;if(h < 60)return m1 + (m2 - m1) * h / 60;if(h < 180)return m2;if(h < 240)return m1 + (m2 - m1) * (240 - h) / 60;return m1;}function vv(h){return Math.round(v(h) * 255);}return new d3_rgb(vv(h + 120),vv(h),vv(h - 120));}d3.hcl = d3_hcl;function d3_hcl(h,c,l){return this instanceof d3_hcl?void (this.h = +h,this.c = +c,this.l = +l):arguments.length < 2?h instanceof d3_hcl?new d3_hcl(h.h,h.c,h.l):h instanceof d3_lab?d3_lab_hcl(h.l,h.a,h.b):d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r,h.g,h.b)).l,h.a,h.b):new d3_hcl(h,c,l);}var d3_hclPrototype=d3_hcl.prototype = new d3_color();d3_hclPrototype.brighter = function(k){return new d3_hcl(this.h,this.c,Math.min(100,this.l + d3_lab_K * (arguments.length?k:1)));};d3_hclPrototype.darker = function(k){return new d3_hcl(this.h,this.c,Math.max(0,this.l - d3_lab_K * (arguments.length?k:1)));};d3_hclPrototype.rgb = function(){return d3_hcl_lab(this.h,this.c,this.l).rgb();};function d3_hcl_lab(h,c,l){if(isNaN(h))h = 0;if(isNaN(c))c = 0;return new d3_lab(l,Math.cos(h *= d3_radians) * c,Math.sin(h) * c);}d3.lab = d3_lab;function d3_lab(l,a,b){return this instanceof d3_lab?void (this.l = +l,this.a = +a,this.b = +b):arguments.length < 2?l instanceof d3_lab?new d3_lab(l.l,l.a,l.b):l instanceof d3_hcl?d3_hcl_lab(l.h,l.c,l.l):d3_rgb_lab((l = d3_rgb(l)).r,l.g,l.b):new d3_lab(l,a,b);}var d3_lab_K=18;var d3_lab_X=.95047,d3_lab_Y=1,d3_lab_Z=1.08883;var d3_labPrototype=d3_lab.prototype = new d3_color();d3_labPrototype.brighter = function(k){return new d3_lab(Math.min(100,this.l + d3_lab_K * (arguments.length?k:1)),this.a,this.b);};d3_labPrototype.darker = function(k){return new d3_lab(Math.max(0,this.l - d3_lab_K * (arguments.length?k:1)),this.a,this.b);};d3_labPrototype.rgb = function(){return d3_lab_rgb(this.l,this.a,this.b);};function d3_lab_rgb(l,a,b){var y=(l + 16) / 116,x=y + a / 500,z=y - b / 200;x = d3_lab_xyz(x) * d3_lab_X;y = d3_lab_xyz(y) * d3_lab_Y;z = d3_lab_xyz(z) * d3_lab_Z;return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z),d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z),d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));}function d3_lab_hcl(l,a,b){return l > 0?new d3_hcl(Math.atan2(b,a) * d3_degrees,Math.sqrt(a * a + b * b),l):new d3_hcl(NaN,NaN,l);}function d3_lab_xyz(x){return x > .206893034?x * x * x:(x - 4 / 29) / 7.787037;}function d3_xyz_lab(x){return x > .008856?Math.pow(x,1 / 3):7.787037 * x + 4 / 29;}function d3_xyz_rgb(r){return Math.round(255 * (r <= .00304?12.92 * r:1.055 * Math.pow(r,1 / 2.4) - .055));}d3.rgb = d3_rgb;function d3_rgb(r,g,b){return this instanceof d3_rgb?void (this.r = ~ ~r,this.g = ~ ~g,this.b = ~ ~b):arguments.length < 2?r instanceof d3_rgb?new d3_rgb(r.r,r.g,r.b):d3_rgb_parse("" + r,d3_rgb,d3_hsl_rgb):new d3_rgb(r,g,b);}function d3_rgbNumber(value){return new d3_rgb(value >> 16,value >> 8 & 255,value & 255);}function d3_rgbString(value){return d3_rgbNumber(value) + "";}var d3_rgbPrototype=d3_rgb.prototype = new d3_color();d3_rgbPrototype.brighter = function(k){k = Math.pow(.7,arguments.length?k:1);var r=this.r,g=this.g,b=this.b,i=30;if(!r && !g && !b)return new d3_rgb(i,i,i);if(r && r < i)r = i;if(g && g < i)g = i;if(b && b < i)b = i;return new d3_rgb(Math.min(255,r / k),Math.min(255,g / k),Math.min(255,b / k));};d3_rgbPrototype.darker = function(k){k = Math.pow(.7,arguments.length?k:1);return new d3_rgb(k * this.r,k * this.g,k * this.b);};d3_rgbPrototype.hsl = function(){return d3_rgb_hsl(this.r,this.g,this.b);};d3_rgbPrototype.toString = function(){return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);};function d3_rgb_hex(v){return v < 16?"0" + Math.max(0,v).toString(16):Math.min(255,v).toString(16);}function d3_rgb_parse(format,rgb,hsl){var r=0,g=0,b=0,m1,m2,color;m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());if(m1){m2 = m1[2].split(",");switch(m1[1]){case "hsl":{return hsl(parseFloat(m2[0]),parseFloat(m2[1]) / 100,parseFloat(m2[2]) / 100);}case "rgb":{return rgb(d3_rgb_parseNumber(m2[0]),d3_rgb_parseNumber(m2[1]),d3_rgb_parseNumber(m2[2]));}}}if(color = d3_rgb_names.get(format)){return rgb(color.r,color.g,color.b);}if(format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1),16))){if(format.length === 4){r = (color & 3840) >> 4;r = r >> 4 | r;g = color & 240;g = g >> 4 | g;b = color & 15;b = b << 4 | b;}else if(format.length === 7){r = (color & 16711680) >> 16;g = (color & 65280) >> 8;b = color & 255;}}return rgb(r,g,b);}function d3_rgb_hsl(r,g,b){var min=Math.min(r /= 255,g /= 255,b /= 255),max=Math.max(r,g,b),d=max - min,h,s,l=(max + min) / 2;if(d){s = l < .5?d / (max + min):d / (2 - max - min);if(r == max)h = (g - b) / d + (g < b?6:0);else if(g == max)h = (b - r) / d + 2;else h = (r - g) / d + 4;h *= 60;}else {h = NaN;s = l > 0 && l < 1?0:h;}return new d3_hsl(h,s,l);}function d3_rgb_lab(r,g,b){r = d3_rgb_xyz(r);g = d3_rgb_xyz(g);b = d3_rgb_xyz(b);var x=d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X),y=d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y),z=d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);return d3_lab(116 * y - 16,500 * (x - y),200 * (y - z));}function d3_rgb_xyz(r){return (r /= 255) <= .04045?r / 12.92:Math.pow((r + .055) / 1.055,2.4);}function d3_rgb_parseNumber(c){var f=parseFloat(c);return c.charAt(c.length - 1) === "%"?Math.round(f * 2.55):f;}var d3_rgb_names=d3.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});d3_rgb_names.forEach(function(key,value){d3_rgb_names.set(key,d3_rgbNumber(value));});function d3_functor(v){return typeof v === "function"?v:function(){return v;};}d3.functor = d3_functor;d3.xhr = d3_xhrType(d3_identity);function d3_xhrType(response){return function(url,mimeType,callback){if(arguments.length === 2 && typeof mimeType === "function")callback = mimeType,mimeType = null;return d3_xhr(url,mimeType,response,callback);};}function d3_xhr(url,mimeType,response,callback){var xhr={},dispatch=d3.dispatch("beforesend","progress","load","error"),headers={},request=new XMLHttpRequest(),responseType=null;if(this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url))request = new XDomainRequest();"onload" in request?request.onload = request.onerror = respond:request.onreadystatechange = function(){request.readyState > 3 && respond();};function respond(){var status=request.status,result;if(!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304){try{result = response.call(xhr,request);}catch(e) {dispatch.error.call(xhr,e);return;}dispatch.load.call(xhr,result);}else {dispatch.error.call(xhr,request);}}request.onprogress = function(event){var o=d3.event;d3.event = event;try{dispatch.progress.call(xhr,request);}finally {d3.event = o;}};xhr.header = function(name,value){name = (name + "").toLowerCase();if(arguments.length < 2)return headers[name];if(value == null)delete headers[name];else headers[name] = value + "";return xhr;};xhr.mimeType = function(value){if(!arguments.length)return mimeType;mimeType = value == null?null:value + "";return xhr;};xhr.responseType = function(value){if(!arguments.length)return responseType;responseType = value;return xhr;};xhr.response = function(value){response = value;return xhr;};["get","post"].forEach(function(method){xhr[method] = function(){return xhr.send.apply(xhr,[method].concat(d3_array(arguments)));};});xhr.send = function(method,data,callback){if(arguments.length === 2 && typeof data === "function")callback = data,data = null;request.open(method,url,true);if(mimeType != null && !("accept" in headers))headers["accept"] = mimeType + ",*/*";if(request.setRequestHeader)for(var name in headers) request.setRequestHeader(name,headers[name]);if(mimeType != null && request.overrideMimeType)request.overrideMimeType(mimeType);if(responseType != null)request.responseType = responseType;if(callback != null)xhr.on("error",callback).on("load",function(request){callback(null,request);});dispatch.beforesend.call(xhr,request);request.send(data == null?null:data);return xhr;};xhr.abort = function(){request.abort();return xhr;};d3.rebind(xhr,dispatch,"on");return callback == null?xhr:xhr.get(d3_xhr_fixCallback(callback));}function d3_xhr_fixCallback(callback){return callback.length === 1?function(error,request){callback(error == null?request:null);}:callback;}function d3_xhrHasResponse(request){var type=request.responseType;return type && type !== "text"?request.response:request.responseText;}d3.dsv = function(delimiter,mimeType){var reFormat=new RegExp('["' + delimiter + "\n]"),delimiterCode=delimiter.charCodeAt(0);function dsv(url,row,callback){if(arguments.length < 3)callback = row,row = null;var xhr=d3_xhr(url,mimeType,row == null?response:typedResponse(row),callback);xhr.row = function(_){return arguments.length?xhr.response((row = _) == null?response:typedResponse(_)):row;};return xhr;}function response(request){return dsv.parse(request.responseText);}function typedResponse(f){return function(request){return dsv.parse(request.responseText,f);};}dsv.parse = function(text,f){var o;return dsv.parseRows(text,function(row,i){if(o)return o(row,i - 1);var a=new Function("d","return {" + row.map(function(name,i){return JSON.stringify(name) + ": d[" + i + "]";}).join(",") + "}");o = f?function(row,i){return f(a(row),i);}:a;});};dsv.parseRows = function(text,f){var EOL={},EOF={},rows=[],N=text.length,I=0,n=0,t,eol;function token(){if(I >= N)return EOF;if(eol)return eol = false,EOL;var j=I;if(text.charCodeAt(j) === 34){var i=j;while(i++ < N) {if(text.charCodeAt(i) === 34){if(text.charCodeAt(i + 1) !== 34)break;++i;}}I = i + 2;var c=text.charCodeAt(i + 1);if(c === 13){eol = true;if(text.charCodeAt(i + 2) === 10)++I;}else if(c === 10){eol = true;}return text.slice(j + 1,i).replace(/""/g,'"');}while(I < N) {var c=text.charCodeAt(I++),k=1;if(c === 10)eol = true;else if(c === 13){eol = true;if(text.charCodeAt(I) === 10)++I,++k;}else if(c !== delimiterCode)continue;return text.slice(j,I - k);}return text.slice(j);}while((t = token()) !== EOF) {var a=[];while(t !== EOL && t !== EOF) {a.push(t);t = token();}if(f && (a = f(a,n++)) == null)continue;rows.push(a);}return rows;};dsv.format = function(rows){if(Array.isArray(rows[0]))return dsv.formatRows(rows);var fieldSet=new d3_Set(),fields=[];rows.forEach(function(row){for(var field in row) {if(!fieldSet.has(field)){fields.push(fieldSet.add(field));}}});return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row){return fields.map(function(field){return formatValue(row[field]);}).join(delimiter);})).join("\n");};dsv.formatRows = function(rows){return rows.map(formatRow).join("\n");};function formatRow(row){return row.map(formatValue).join(delimiter);}function formatValue(text){return reFormat.test(text)?'"' + text.replace(/\"/g,'""') + '"':text;}return dsv;};d3.csv = d3.dsv(",","text/csv");d3.tsv = d3.dsv("	","text/tab-separated-values");var d3_timer_queueHead,d3_timer_queueTail,d3_timer_interval,d3_timer_timeout,d3_timer_frame=this[d3_vendorSymbol(this,"requestAnimationFrame")] || function(callback){setTimeout(callback,17);};d3.timer = function(){d3_timer.apply(this,arguments);};function d3_timer(callback,delay,then){var n=arguments.length;if(n < 2)delay = 0;if(n < 3)then = Date.now();var time=then + delay,timer={c:callback,t:time,n:null};if(d3_timer_queueTail)d3_timer_queueTail.n = timer;else d3_timer_queueHead = timer;d3_timer_queueTail = timer;if(!d3_timer_interval){d3_timer_timeout = clearTimeout(d3_timer_timeout);d3_timer_interval = 1;d3_timer_frame(d3_timer_step);}return timer;}function d3_timer_step(){var now=d3_timer_mark(),delay=d3_timer_sweep() - now;if(delay > 24){if(isFinite(delay)){clearTimeout(d3_timer_timeout);d3_timer_timeout = setTimeout(d3_timer_step,delay);}d3_timer_interval = 0;}else {d3_timer_interval = 1;d3_timer_frame(d3_timer_step);}}d3.timer.flush = function(){d3_timer_mark();d3_timer_sweep();};function d3_timer_mark(){var now=Date.now(),timer=d3_timer_queueHead;while(timer) {if(now >= timer.t && timer.c(now - timer.t))timer.c = null;timer = timer.n;}return now;}function d3_timer_sweep(){var t0,t1=d3_timer_queueHead,time=Infinity;while(t1) {if(t1.c){if(t1.t < time)time = t1.t;t1 = (t0 = t1).n;}else {t1 = t0?t0.n = t1.n:d3_timer_queueHead = t1.n;}}d3_timer_queueTail = t0;return time;}function d3_format_precision(x,p){return p - (x?Math.ceil(Math.log(x) / Math.LN10):1);}d3.round = function(x,n){return n?Math.round(x * (n = Math.pow(10,n))) / n:Math.round(x);};var d3_formatPrefixes=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(d3_formatPrefix);d3.formatPrefix = function(value,precision){var i=0;if(value = +value){if(value < 0)value *= -1;if(precision)value = d3.round(value,d3_format_precision(value,precision));i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);i = Math.max(-24,Math.min(24,Math.floor((i - 1) / 3) * 3));}return d3_formatPrefixes[8 + i / 3];};function d3_formatPrefix(d,i){var k=Math.pow(10,abs(8 - i) * 3);return {scale:i > 8?function(d){return d / k;}:function(d){return d * k;},symbol:d};}function d3_locale_numberFormat(locale){var locale_decimal=locale.decimal,locale_thousands=locale.thousands,locale_grouping=locale.grouping,locale_currency=locale.currency,formatGroup=locale_grouping && locale_thousands?function(value,width){var i=value.length,t=[],j=0,g=locale_grouping[0],length=0;while(i > 0 && g > 0) {if(length + g + 1 > width)g = Math.max(1,width - length);t.push(value.substring(i -= g,i + g));if((length += g + 1) > width)break;g = locale_grouping[j = (j + 1) % locale_grouping.length];}return t.reverse().join(locale_thousands);}:d3_identity;return function(specifier){var match=d3_format_re.exec(specifier),fill=match[1] || " ",align=match[2] || ">",sign=match[3] || "-",symbol=match[4] || "",zfill=match[5],width=+match[6],comma=match[7],precision=match[8],type=match[9],scale=1,prefix="",suffix="",integer=false,exponent=true;if(precision)precision = +precision.substring(1);if(zfill || fill === "0" && align === "="){zfill = fill = "0";align = "=";}switch(type){case "n":comma = true;type = "g";break;case "%":scale = 100;suffix = "%";type = "f";break;case "p":scale = 100;suffix = "%";type = "r";break;case "b":case "o":case "x":case "X":if(symbol === "#")prefix = "0" + type.toLowerCase();case "c":exponent = false;case "d":integer = true;precision = 0;break;case "s":scale = -1;type = "r";break;}if(symbol === "$")prefix = locale_currency[0],suffix = locale_currency[1];if(type == "r" && !precision)type = "g";if(precision != null){if(type == "g")precision = Math.max(1,Math.min(21,precision));else if(type == "e" || type == "f")precision = Math.max(0,Math.min(20,precision));}type = d3_format_types.get(type) || d3_format_typeDefault;var zcomma=zfill && comma;return function(value){var fullSuffix=suffix;if(integer && value % 1)return "";var negative=value < 0 || value === 0 && 1 / value < 0?(value = -value,"-"):sign === "-"?"":sign;if(scale < 0){var unit=d3.formatPrefix(value,precision);value = unit.scale(value);fullSuffix = unit.symbol + suffix;}else {value *= scale;}value = type(value,precision);var i=value.lastIndexOf("."),before,after;if(i < 0){var j=exponent?value.lastIndexOf("e"):-1;if(j < 0)before = value,after = "";else before = value.substring(0,j),after = value.substring(j);}else {before = value.substring(0,i);after = locale_decimal + value.substring(i + 1);}if(!zfill && comma)before = formatGroup(before,Infinity);var length=prefix.length + before.length + after.length + (zcomma?0:negative.length),padding=length < width?new Array(length = width - length + 1).join(fill):"";if(zcomma)before = formatGroup(padding + before,padding.length?width - after.length:Infinity);negative += prefix;value = before + after;return (align === "<"?negative + value + padding:align === ">"?padding + negative + value:align === "^"?padding.substring(0,length >>= 1) + negative + value + padding.substring(length):negative + (zcomma?value:padding + value)) + fullSuffix;};};}var d3_format_re=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;var d3_format_types=d3.map({b:function b(x){return x.toString(2);},c:function c(x){return String.fromCharCode(x);},o:function o(x){return x.toString(8);},x:function x(_x){return _x.toString(16);},X:function X(x){return x.toString(16).toUpperCase();},g:function g(x,p){return x.toPrecision(p);},e:function e(x,p){return x.toExponential(p);},f:function f(x,p){return x.toFixed(p);},r:function r(x,p){return (x = d3.round(x,d3_format_precision(x,p))).toFixed(Math.max(0,Math.min(20,d3_format_precision(x * (1 + 1e-15),p))));}});function d3_format_typeDefault(x){return x + "";}var d3_time=d3.time = {},d3_date=Date;function d3_date_utc(){this._ = new Date(arguments.length > 1?Date.UTC.apply(this,arguments):arguments[0]);}d3_date_utc.prototype = {getDate:function getDate(){return this._.getUTCDate();},getDay:function getDay(){return this._.getUTCDay();},getFullYear:function getFullYear(){return this._.getUTCFullYear();},getHours:function getHours(){return this._.getUTCHours();},getMilliseconds:function getMilliseconds(){return this._.getUTCMilliseconds();},getMinutes:function getMinutes(){return this._.getUTCMinutes();},getMonth:function getMonth(){return this._.getUTCMonth();},getSeconds:function getSeconds(){return this._.getUTCSeconds();},getTime:function getTime(){return this._.getTime();},getTimezoneOffset:function getTimezoneOffset(){return 0;},valueOf:function valueOf(){return this._.valueOf();},setDate:function setDate(){d3_time_prototype.setUTCDate.apply(this._,arguments);},setDay:function setDay(){d3_time_prototype.setUTCDay.apply(this._,arguments);},setFullYear:function setFullYear(){d3_time_prototype.setUTCFullYear.apply(this._,arguments);},setHours:function setHours(){d3_time_prototype.setUTCHours.apply(this._,arguments);},setMilliseconds:function setMilliseconds(){d3_time_prototype.setUTCMilliseconds.apply(this._,arguments);},setMinutes:function setMinutes(){d3_time_prototype.setUTCMinutes.apply(this._,arguments);},setMonth:function setMonth(){d3_time_prototype.setUTCMonth.apply(this._,arguments);},setSeconds:function setSeconds(){d3_time_prototype.setUTCSeconds.apply(this._,arguments);},setTime:function setTime(){d3_time_prototype.setTime.apply(this._,arguments);}};var d3_time_prototype=Date.prototype;function d3_time_interval(local,step,number){function round(date){var d0=local(date),d1=offset(d0,1);return date - d0 < d1 - date?d0:d1;}function ceil(date){step(date = local(new d3_date(date - 1)),1);return date;}function offset(date,k){step(date = new d3_date(+date),k);return date;}function range(t0,t1,dt){var time=ceil(t0),times=[];if(dt > 1){while(time < t1) {if(!(number(time) % dt))times.push(new Date(+time));step(time,1);}}else {while(time < t1) times.push(new Date(+time)),step(time,1);}return times;}function range_utc(t0,t1,dt){try{d3_date = d3_date_utc;var utc=new d3_date_utc();utc._ = t0;return range(utc,t1,dt);}finally {d3_date = Date;}}local.floor = local;local.round = round;local.ceil = ceil;local.offset = offset;local.range = range;var utc=local.utc = d3_time_interval_utc(local);utc.floor = utc;utc.round = d3_time_interval_utc(round);utc.ceil = d3_time_interval_utc(ceil);utc.offset = d3_time_interval_utc(offset);utc.range = range_utc;return local;}function d3_time_interval_utc(method){return function(date,k){try{d3_date = d3_date_utc;var utc=new d3_date_utc();utc._ = date;return method(utc,k)._;}finally {d3_date = Date;}};}d3_time.year = d3_time_interval(function(date){date = d3_time.day(date);date.setMonth(0,1);return date;},function(date,offset){date.setFullYear(date.getFullYear() + offset);},function(date){return date.getFullYear();});d3_time.years = d3_time.year.range;d3_time.years.utc = d3_time.year.utc.range;d3_time.day = d3_time_interval(function(date){var day=new d3_date(2e3,0);day.setFullYear(date.getFullYear(),date.getMonth(),date.getDate());return day;},function(date,offset){date.setDate(date.getDate() + offset);},function(date){return date.getDate() - 1;});d3_time.days = d3_time.day.range;d3_time.days.utc = d3_time.day.utc.range;d3_time.dayOfYear = function(date){var year=d3_time.year(date);return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);};["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(day,i){i = 7 - i;var interval=d3_time[day] = d3_time_interval(function(date){(date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);return date;},function(date,offset){date.setDate(date.getDate() + Math.floor(offset) * 7);},function(date){var day=d3_time.year(date).getDay();return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);});d3_time[day + "s"] = interval.range;d3_time[day + "s"].utc = interval.utc.range;d3_time[day + "OfYear"] = function(date){var day=d3_time.year(date).getDay();return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);};});d3_time.week = d3_time.sunday;d3_time.weeks = d3_time.sunday.range;d3_time.weeks.utc = d3_time.sunday.utc.range;d3_time.weekOfYear = d3_time.sundayOfYear;function d3_locale_timeFormat(locale){var locale_dateTime=locale.dateTime,locale_date=locale.date,locale_time=locale.time,locale_periods=locale.periods,locale_days=locale.days,locale_shortDays=locale.shortDays,locale_months=locale.months,locale_shortMonths=locale.shortMonths;function d3_time_format(template){var n=template.length;function format(date){var string=[],i=-1,j=0,c,p,f;while(++i < n) {if(template.charCodeAt(i) === 37){string.push(template.slice(j,i));if((p = d3_time_formatPads[c = template.charAt(++i)]) != null)c = template.charAt(++i);if(f = d3_time_formats[c])c = f(date,p == null?c === "e"?" ":"0":p);string.push(c);j = i + 1;}}string.push(template.slice(j,i));return string.join("");}format.parse = function(string){var d={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},i=d3_time_parse(d,template,string,0);if(i != string.length)return null;if("p" in d)d.H = d.H % 12 + d.p * 12;var localZ=d.Z != null && d3_date !== d3_date_utc,date=new (localZ?d3_date_utc:d3_date)();if("j" in d)date.setFullYear(d.y,0,d.j);else if("W" in d || "U" in d){if(!("w" in d))d.w = "W" in d?1:0;date.setFullYear(d.y,0,1);date.setFullYear(d.y,0,"W" in d?(d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7:d.w + d.U * 7 - (date.getDay() + 6) % 7);}else date.setFullYear(d.y,d.m,d.d);date.setHours(d.H + (d.Z / 100 | 0),d.M + d.Z % 100,d.S,d.L);return localZ?date._:date;};format.toString = function(){return template;};return format;}function d3_time_parse(date,template,string,j){var c,p,t,i=0,n=template.length,m=string.length;while(i < n) {if(j >= m)return -1;c = template.charCodeAt(i++);if(c === 37){t = template.charAt(i++);p = d3_time_parsers[t in d3_time_formatPads?template.charAt(i++):t];if(!p || (j = p(date,string,j)) < 0)return -1;}else if(c != string.charCodeAt(j++)){return -1;}}return j;}d3_time_format.utc = function(template){var local=d3_time_format(template);function format(date){try{d3_date = d3_date_utc;var utc=new d3_date();utc._ = date;return local(utc);}finally {d3_date = Date;}}format.parse = function(string){try{d3_date = d3_date_utc;var date=local.parse(string);return date && date._;}finally {d3_date = Date;}};format.toString = local.toString;return format;};d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;var d3_time_periodLookup=d3.map(),d3_time_dayRe=d3_time_formatRe(locale_days),d3_time_dayLookup=d3_time_formatLookup(locale_days),d3_time_dayAbbrevRe=d3_time_formatRe(locale_shortDays),d3_time_dayAbbrevLookup=d3_time_formatLookup(locale_shortDays),d3_time_monthRe=d3_time_formatRe(locale_months),d3_time_monthLookup=d3_time_formatLookup(locale_months),d3_time_monthAbbrevRe=d3_time_formatRe(locale_shortMonths),d3_time_monthAbbrevLookup=d3_time_formatLookup(locale_shortMonths);locale_periods.forEach(function(p,i){d3_time_periodLookup.set(p.toLowerCase(),i);});var d3_time_formats={a:function a(d){return locale_shortDays[d.getDay()];},A:function A(d){return locale_days[d.getDay()];},b:function b(d){return locale_shortMonths[d.getMonth()];},B:function B(d){return locale_months[d.getMonth()];},c:d3_time_format(locale_dateTime),d:function d(_d,p){return d3_time_formatPad(_d.getDate(),p,2);},e:function e(d,p){return d3_time_formatPad(d.getDate(),p,2);},H:function H(d,p){return d3_time_formatPad(d.getHours(),p,2);},I:function I(d,p){return d3_time_formatPad(d.getHours() % 12 || 12,p,2);},j:function j(d,p){return d3_time_formatPad(1 + d3_time.dayOfYear(d),p,3);},L:function L(d,p){return d3_time_formatPad(d.getMilliseconds(),p,3);},m:function m(d,p){return d3_time_formatPad(d.getMonth() + 1,p,2);},M:function M(d,p){return d3_time_formatPad(d.getMinutes(),p,2);},p:function p(d){return locale_periods[+(d.getHours() >= 12)];},S:function S(d,p){return d3_time_formatPad(d.getSeconds(),p,2);},U:function U(d,p){return d3_time_formatPad(d3_time.sundayOfYear(d),p,2);},w:function w(d){return d.getDay();},W:function W(d,p){return d3_time_formatPad(d3_time.mondayOfYear(d),p,2);},x:d3_time_format(locale_date),X:d3_time_format(locale_time),y:function y(d,p){return d3_time_formatPad(d.getFullYear() % 100,p,2);},Y:function Y(d,p){return d3_time_formatPad(d.getFullYear() % 1e4,p,4);},Z:d3_time_zone,"%":function _(){return "%";}};var d3_time_parsers={a:d3_time_parseWeekdayAbbrev,A:d3_time_parseWeekday,b:d3_time_parseMonthAbbrev,B:d3_time_parseMonth,c:d3_time_parseLocaleFull,d:d3_time_parseDay,e:d3_time_parseDay,H:d3_time_parseHour24,I:d3_time_parseHour24,j:d3_time_parseDayOfYear,L:d3_time_parseMilliseconds,m:d3_time_parseMonthNumber,M:d3_time_parseMinutes,p:d3_time_parseAmPm,S:d3_time_parseSeconds,U:d3_time_parseWeekNumberSunday,w:d3_time_parseWeekdayNumber,W:d3_time_parseWeekNumberMonday,x:d3_time_parseLocaleDate,X:d3_time_parseLocaleTime,y:d3_time_parseYear,Y:d3_time_parseFullYear,Z:d3_time_parseZone,"%":d3_time_parseLiteralPercent};function d3_time_parseWeekdayAbbrev(date,string,i){d3_time_dayAbbrevRe.lastIndex = 0;var n=d3_time_dayAbbrevRe.exec(string.slice(i));return n?(date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()),i + n[0].length):-1;}function d3_time_parseWeekday(date,string,i){d3_time_dayRe.lastIndex = 0;var n=d3_time_dayRe.exec(string.slice(i));return n?(date.w = d3_time_dayLookup.get(n[0].toLowerCase()),i + n[0].length):-1;}function d3_time_parseMonthAbbrev(date,string,i){d3_time_monthAbbrevRe.lastIndex = 0;var n=d3_time_monthAbbrevRe.exec(string.slice(i));return n?(date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()),i + n[0].length):-1;}function d3_time_parseMonth(date,string,i){d3_time_monthRe.lastIndex = 0;var n=d3_time_monthRe.exec(string.slice(i));return n?(date.m = d3_time_monthLookup.get(n[0].toLowerCase()),i + n[0].length):-1;}function d3_time_parseLocaleFull(date,string,i){return d3_time_parse(date,d3_time_formats.c.toString(),string,i);}function d3_time_parseLocaleDate(date,string,i){return d3_time_parse(date,d3_time_formats.x.toString(),string,i);}function d3_time_parseLocaleTime(date,string,i){return d3_time_parse(date,d3_time_formats.X.toString(),string,i);}function d3_time_parseAmPm(date,string,i){var n=d3_time_periodLookup.get(string.slice(i,i += 2).toLowerCase());return n == null?-1:(date.p = n,i);}return d3_time_format;}var d3_time_formatPads={"-":"",_:" ","0":"0"},d3_time_numberRe=/^\s*\d+/,d3_time_percentRe=/^%/;function d3_time_formatPad(value,fill,width){var sign=value < 0?"-":"",string=(sign?-value:value) + "",length=string.length;return sign + (length < width?new Array(width - length + 1).join(fill) + string:string);}function d3_time_formatRe(names){return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")","i");}function d3_time_formatLookup(names){var map=new d3_Map(),i=-1,n=names.length;while(++i < n) map.set(names[i].toLowerCase(),i);return map;}function d3_time_parseWeekdayNumber(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 1));return n?(date.w = +n[0],i + n[0].length):-1;}function d3_time_parseWeekNumberSunday(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i));return n?(date.U = +n[0],i + n[0].length):-1;}function d3_time_parseWeekNumberMonday(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i));return n?(date.W = +n[0],i + n[0].length):-1;}function d3_time_parseFullYear(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 4));return n?(date.y = +n[0],i + n[0].length):-1;}function d3_time_parseYear(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.y = d3_time_expandYear(+n[0]),i + n[0].length):-1;}function d3_time_parseZone(date,string,i){return (/^[+-]\d{4}$/.test(string = string.slice(i,i + 5))?(date.Z = -string,i + 5):-1);}function d3_time_expandYear(d){return d + (d > 68?1900:2e3);}function d3_time_parseMonthNumber(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.m = n[0] - 1,i + n[0].length):-1;}function d3_time_parseDay(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.d = +n[0],i + n[0].length):-1;}function d3_time_parseDayOfYear(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 3));return n?(date.j = +n[0],i + n[0].length):-1;}function d3_time_parseHour24(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.H = +n[0],i + n[0].length):-1;}function d3_time_parseMinutes(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.M = +n[0],i + n[0].length):-1;}function d3_time_parseSeconds(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 2));return n?(date.S = +n[0],i + n[0].length):-1;}function d3_time_parseMilliseconds(date,string,i){d3_time_numberRe.lastIndex = 0;var n=d3_time_numberRe.exec(string.slice(i,i + 3));return n?(date.L = +n[0],i + n[0].length):-1;}function d3_time_zone(d){var z=d.getTimezoneOffset(),zs=z > 0?"-":"+",zh=abs(z) / 60 | 0,zm=abs(z) % 60;return zs + d3_time_formatPad(zh,"0",2) + d3_time_formatPad(zm,"0",2);}function d3_time_parseLiteralPercent(date,string,i){d3_time_percentRe.lastIndex = 0;var n=d3_time_percentRe.exec(string.slice(i,i + 1));return n?i + n[0].length:-1;}function d3_time_formatMulti(formats){var n=formats.length,i=-1;while(++i < n) formats[i][0] = this(formats[i][0]);return function(date){var i=0,f=formats[i];while(!f[1](date)) f = formats[++i];return f[0](date);};}d3.locale = function(locale){return {numberFormat:d3_locale_numberFormat(locale),timeFormat:d3_locale_timeFormat(locale)};};var d3_locale_enUS=d3.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});d3.format = d3_locale_enUS.numberFormat;d3.geo = {};function d3_adder(){}d3_adder.prototype = {s:0,t:0,add:function add(y){d3_adderSum(y,this.t,d3_adderTemp);d3_adderSum(d3_adderTemp.s,this.s,this);if(this.s)this.t += d3_adderTemp.t;else this.s = d3_adderTemp.t;},reset:function reset(){this.s = this.t = 0;},valueOf:function valueOf(){return this.s;}};var d3_adderTemp=new d3_adder();function d3_adderSum(a,b,o){var x=o.s = a + b,bv=x - a,av=x - bv;o.t = a - av + (b - bv);}d3.geo.stream = function(object,listener){if(object && d3_geo_streamObjectType.hasOwnProperty(object.type)){d3_geo_streamObjectType[object.type](object,listener);}else {d3_geo_streamGeometry(object,listener);}};function d3_geo_streamGeometry(geometry,listener){if(geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)){d3_geo_streamGeometryType[geometry.type](geometry,listener);}}var d3_geo_streamObjectType={Feature:function Feature(feature,listener){d3_geo_streamGeometry(feature.geometry,listener);},FeatureCollection:function FeatureCollection(object,listener){var features=object.features,i=-1,n=features.length;while(++i < n) d3_geo_streamGeometry(features[i].geometry,listener);}};var d3_geo_streamGeometryType={Sphere:function Sphere(object,listener){listener.sphere();},Point:function Point(object,listener){object = object.coordinates;listener.point(object[0],object[1],object[2]);},MultiPoint:function MultiPoint(object,listener){var coordinates=object.coordinates,i=-1,n=coordinates.length;while(++i < n) object = coordinates[i],listener.point(object[0],object[1],object[2]);},LineString:function LineString(object,listener){d3_geo_streamLine(object.coordinates,listener,0);},MultiLineString:function MultiLineString(object,listener){var coordinates=object.coordinates,i=-1,n=coordinates.length;while(++i < n) d3_geo_streamLine(coordinates[i],listener,0);},Polygon:function Polygon(object,listener){d3_geo_streamPolygon(object.coordinates,listener);},MultiPolygon:function MultiPolygon(object,listener){var coordinates=object.coordinates,i=-1,n=coordinates.length;while(++i < n) d3_geo_streamPolygon(coordinates[i],listener);},GeometryCollection:function GeometryCollection(object,listener){var geometries=object.geometries,i=-1,n=geometries.length;while(++i < n) d3_geo_streamGeometry(geometries[i],listener);}};function d3_geo_streamLine(coordinates,listener,closed){var i=-1,n=coordinates.length - closed,coordinate;listener.lineStart();while(++i < n) coordinate = coordinates[i],listener.point(coordinate[0],coordinate[1],coordinate[2]);listener.lineEnd();}function d3_geo_streamPolygon(coordinates,listener){var i=-1,n=coordinates.length;listener.polygonStart();while(++i < n) d3_geo_streamLine(coordinates[i],listener,1);listener.polygonEnd();}d3.geo.area = function(object){d3_geo_areaSum = 0;d3.geo.stream(object,d3_geo_area);return d3_geo_areaSum;};var d3_geo_areaSum,d3_geo_areaRingSum=new d3_adder();var d3_geo_area={sphere:function sphere(){d3_geo_areaSum += 4 * π;},point:d3_noop,lineStart:d3_noop,lineEnd:d3_noop,polygonStart:function polygonStart(){d3_geo_areaRingSum.reset();d3_geo_area.lineStart = d3_geo_areaRingStart;},polygonEnd:function polygonEnd(){var area=2 * d3_geo_areaRingSum;d3_geo_areaSum += area < 0?4 * π + area:area;d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;}};function d3_geo_areaRingStart(){var λ00,φ00,λ0,cosφ0,sinφ0;d3_geo_area.point = function(λ,φ){d3_geo_area.point = nextPoint;λ0 = (λ00 = λ) * d3_radians,cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4),sinφ0 = Math.sin(φ);};function nextPoint(λ,φ){λ *= d3_radians;φ = φ * d3_radians / 2 + π / 4;var dλ=λ - λ0,sdλ=dλ >= 0?1:-1,adλ=sdλ * dλ,cosφ=Math.cos(φ),sinφ=Math.sin(φ),k=sinφ0 * sinφ,u=cosφ0 * cosφ + k * Math.cos(adλ),v=k * sdλ * Math.sin(adλ);d3_geo_areaRingSum.add(Math.atan2(v,u));λ0 = λ,cosφ0 = cosφ,sinφ0 = sinφ;}d3_geo_area.lineEnd = function(){nextPoint(λ00,φ00);};}function d3_geo_cartesian(spherical){var λ=spherical[0],φ=spherical[1],cosφ=Math.cos(φ);return [cosφ * Math.cos(λ),cosφ * Math.sin(λ),Math.sin(φ)];}function d3_geo_cartesianDot(a,b){return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];}function d3_geo_cartesianCross(a,b){return [a[1] * b[2] - a[2] * b[1],a[2] * b[0] - a[0] * b[2],a[0] * b[1] - a[1] * b[0]];}function d3_geo_cartesianAdd(a,b){a[0] += b[0];a[1] += b[1];a[2] += b[2];}function d3_geo_cartesianScale(vector,k){return [vector[0] * k,vector[1] * k,vector[2] * k];}function d3_geo_cartesianNormalize(d){var l=Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);d[0] /= l;d[1] /= l;d[2] /= l;}function d3_geo_spherical(cartesian){return [Math.atan2(cartesian[1],cartesian[0]),d3_asin(cartesian[2])];}function d3_geo_sphericalEqual(a,b){return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;}d3.geo.bounds = (function(){var λ0,φ0,λ1,φ1,λ_,λ__,φ__,p0,dλSum,ranges,range;var bound={point:point,lineStart:lineStart,lineEnd:lineEnd,polygonStart:function polygonStart(){bound.point = ringPoint;bound.lineStart = ringStart;bound.lineEnd = ringEnd;dλSum = 0;d3_geo_area.polygonStart();},polygonEnd:function polygonEnd(){d3_geo_area.polygonEnd();bound.point = point;bound.lineStart = lineStart;bound.lineEnd = lineEnd;if(d3_geo_areaRingSum < 0)λ0 = -(λ1 = 180),φ0 = -(φ1 = 90);else if(dλSum > ε)φ1 = 90;else if(dλSum < -ε)φ0 = -90;range[0] = λ0,range[1] = λ1;}};function point(λ,φ){ranges.push(range = [λ0 = λ,λ1 = λ]);if(φ < φ0)φ0 = φ;if(φ > φ1)φ1 = φ;}function linePoint(λ,φ){var p=d3_geo_cartesian([λ * d3_radians,φ * d3_radians]);if(p0){var normal=d3_geo_cartesianCross(p0,p),equatorial=[normal[1],-normal[0],0],inflection=d3_geo_cartesianCross(equatorial,normal);d3_geo_cartesianNormalize(inflection);inflection = d3_geo_spherical(inflection);var dλ=λ - λ_,s=dλ > 0?1:-1,λi=inflection[0] * d3_degrees * s,antimeridian=abs(dλ) > 180;if(antimeridian ^ (s * λ_ < λi && λi < s * λ)){var φi=inflection[1] * d3_degrees;if(φi > φ1)φ1 = φi;}else if((λi = (λi + 360) % 360 - 180,antimeridian ^ (s * λ_ < λi && λi < s * λ))){var φi=-inflection[1] * d3_degrees;if(φi < φ0)φ0 = φi;}else {if(φ < φ0)φ0 = φ;if(φ > φ1)φ1 = φ;}if(antimeridian){if(λ < λ_){if(angle(λ0,λ) > angle(λ0,λ1))λ1 = λ;}else {if(angle(λ,λ1) > angle(λ0,λ1))λ0 = λ;}}else {if(λ1 >= λ0){if(λ < λ0)λ0 = λ;if(λ > λ1)λ1 = λ;}else {if(λ > λ_){if(angle(λ0,λ) > angle(λ0,λ1))λ1 = λ;}else {if(angle(λ,λ1) > angle(λ0,λ1))λ0 = λ;}}}}else {point(λ,φ);}p0 = p,λ_ = λ;}function lineStart(){bound.point = linePoint;}function lineEnd(){range[0] = λ0,range[1] = λ1;bound.point = point;p0 = null;}function ringPoint(λ,φ){if(p0){var dλ=λ - λ_;dλSum += abs(dλ) > 180?dλ + (dλ > 0?360:-360):dλ;}else λ__ = λ,φ__ = φ;d3_geo_area.point(λ,φ);linePoint(λ,φ);}function ringStart(){d3_geo_area.lineStart();}function ringEnd(){ringPoint(λ__,φ__);d3_geo_area.lineEnd();if(abs(dλSum) > ε)λ0 = -(λ1 = 180);range[0] = λ0,range[1] = λ1;p0 = null;}function angle(λ0,λ1){return (λ1 -= λ0) < 0?λ1 + 360:λ1;}function compareRanges(a,b){return a[0] - b[0];}function withinRange(x,range){return range[0] <= range[1]?range[0] <= x && x <= range[1]:x < range[0] || range[1] < x;}return function(feature){φ1 = λ1 = -(λ0 = φ0 = Infinity);ranges = [];d3.geo.stream(feature,bound);var n=ranges.length;if(n){ranges.sort(compareRanges);for(var i=1,a=ranges[0],b,merged=[a];i < n;++i) {b = ranges[i];if(withinRange(b[0],a) || withinRange(b[1],a)){if(angle(a[0],b[1]) > angle(a[0],a[1]))a[1] = b[1];if(angle(b[0],a[1]) > angle(a[0],a[1]))a[0] = b[0];}else {merged.push(a = b);}}var best=-Infinity,dλ;for(var n=merged.length - 1,i=0,a=merged[n],b;i <= n;a = b,++i) {b = merged[i];if((dλ = angle(a[1],b[0])) > best)best = dλ,λ0 = b[0],λ1 = a[1];}}ranges = range = null;return λ0 === Infinity || φ0 === Infinity?[[NaN,NaN],[NaN,NaN]]:[[λ0,φ0],[λ1,φ1]];};})();d3.geo.centroid = function(object){d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;d3.geo.stream(object,d3_geo_centroid);var x=d3_geo_centroidX2,y=d3_geo_centroidY2,z=d3_geo_centroidZ2,m=x * x + y * y + z * z;if(m < ε2){x = d3_geo_centroidX1,y = d3_geo_centroidY1,z = d3_geo_centroidZ1;if(d3_geo_centroidW1 < ε)x = d3_geo_centroidX0,y = d3_geo_centroidY0,z = d3_geo_centroidZ0;m = x * x + y * y + z * z;if(m < ε2)return [NaN,NaN];}return [Math.atan2(y,x) * d3_degrees,d3_asin(z / Math.sqrt(m)) * d3_degrees];};var d3_geo_centroidW0,d3_geo_centroidW1,d3_geo_centroidX0,d3_geo_centroidY0,d3_geo_centroidZ0,d3_geo_centroidX1,d3_geo_centroidY1,d3_geo_centroidZ1,d3_geo_centroidX2,d3_geo_centroidY2,d3_geo_centroidZ2;var d3_geo_centroid={sphere:d3_noop,point:d3_geo_centroidPoint,lineStart:d3_geo_centroidLineStart,lineEnd:d3_geo_centroidLineEnd,polygonStart:function polygonStart(){d3_geo_centroid.lineStart = d3_geo_centroidRingStart;},polygonEnd:function polygonEnd(){d3_geo_centroid.lineStart = d3_geo_centroidLineStart;}};function d3_geo_centroidPoint(λ,φ){λ *= d3_radians;var cosφ=Math.cos(φ *= d3_radians);d3_geo_centroidPointXYZ(cosφ * Math.cos(λ),cosφ * Math.sin(λ),Math.sin(φ));}function d3_geo_centroidPointXYZ(x,y,z){++d3_geo_centroidW0;d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;}function d3_geo_centroidLineStart(){var x0,y0,z0;d3_geo_centroid.point = function(λ,φ){λ *= d3_radians;var cosφ=Math.cos(φ *= d3_radians);x0 = cosφ * Math.cos(λ);y0 = cosφ * Math.sin(λ);z0 = Math.sin(φ);d3_geo_centroid.point = nextPoint;d3_geo_centroidPointXYZ(x0,y0,z0);};function nextPoint(λ,φ){λ *= d3_radians;var cosφ=Math.cos(φ *= d3_radians),x=cosφ * Math.cos(λ),y=cosφ * Math.sin(λ),z=Math.sin(φ),w=Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w),x0 * x + y0 * y + z0 * z);d3_geo_centroidW1 += w;d3_geo_centroidX1 += w * (x0 + (x0 = x));d3_geo_centroidY1 += w * (y0 + (y0 = y));d3_geo_centroidZ1 += w * (z0 + (z0 = z));d3_geo_centroidPointXYZ(x0,y0,z0);}}function d3_geo_centroidLineEnd(){d3_geo_centroid.point = d3_geo_centroidPoint;}function d3_geo_centroidRingStart(){var λ00,φ00,x0,y0,z0;d3_geo_centroid.point = function(λ,φ){λ00 = λ,φ00 = φ;d3_geo_centroid.point = nextPoint;λ *= d3_radians;var cosφ=Math.cos(φ *= d3_radians);x0 = cosφ * Math.cos(λ);y0 = cosφ * Math.sin(λ);z0 = Math.sin(φ);d3_geo_centroidPointXYZ(x0,y0,z0);};d3_geo_centroid.lineEnd = function(){nextPoint(λ00,φ00);d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;d3_geo_centroid.point = d3_geo_centroidPoint;};function nextPoint(λ,φ){λ *= d3_radians;var cosφ=Math.cos(φ *= d3_radians),x=cosφ * Math.cos(λ),y=cosφ * Math.sin(λ),z=Math.sin(φ),cx=y0 * z - z0 * y,cy=z0 * x - x0 * z,cz=x0 * y - y0 * x,m=Math.sqrt(cx * cx + cy * cy + cz * cz),u=x0 * x + y0 * y + z0 * z,v=m && -d3_acos(u) / m,w=Math.atan2(m,u);d3_geo_centroidX2 += v * cx;d3_geo_centroidY2 += v * cy;d3_geo_centroidZ2 += v * cz;d3_geo_centroidW1 += w;d3_geo_centroidX1 += w * (x0 + (x0 = x));d3_geo_centroidY1 += w * (y0 + (y0 = y));d3_geo_centroidZ1 += w * (z0 + (z0 = z));d3_geo_centroidPointXYZ(x0,y0,z0);}}function d3_geo_compose(a,b){function compose(x,y){return x = a(x,y),b(x[0],x[1]);}if(a.invert && b.invert)compose.invert = function(x,y){return x = b.invert(x,y),x && a.invert(x[0],x[1]);};return compose;}function d3_true(){return true;}function d3_geo_clipPolygon(segments,compare,clipStartInside,interpolate,listener){var subject=[],clip=[];segments.forEach(function(segment){if((n = segment.length - 1) <= 0)return;var n,p0=segment[0],p1=segment[n];if(d3_geo_sphericalEqual(p0,p1)){listener.lineStart();for(var i=0;i < n;++i) listener.point((p0 = segment[i])[0],p0[1]);listener.lineEnd();return;}var a=new d3_geo_clipPolygonIntersection(p0,segment,null,true),b=new d3_geo_clipPolygonIntersection(p0,null,a,false);a.o = b;subject.push(a);clip.push(b);a = new d3_geo_clipPolygonIntersection(p1,segment,null,false);b = new d3_geo_clipPolygonIntersection(p1,null,a,true);a.o = b;subject.push(a);clip.push(b);});clip.sort(compare);d3_geo_clipPolygonLinkCircular(subject);d3_geo_clipPolygonLinkCircular(clip);if(!subject.length)return;for(var i=0,entry=clipStartInside,n=clip.length;i < n;++i) {clip[i].e = entry = !entry;}var start=subject[0],points,point;while(1) {var current=start,isSubject=true;while(current.v) if((current = current.n) === start)return;points = current.z;listener.lineStart();do {current.v = current.o.v = true;if(current.e){if(isSubject){for(var i=0,n=points.length;i < n;++i) listener.point((point = points[i])[0],point[1]);}else {interpolate(current.x,current.n.x,1,listener);}current = current.n;}else {if(isSubject){points = current.p.z;for(var i=points.length - 1;i >= 0;--i) listener.point((point = points[i])[0],point[1]);}else {interpolate(current.x,current.p.x,-1,listener);}current = current.p;}current = current.o;points = current.z;isSubject = !isSubject;}while(!current.v);listener.lineEnd();}}function d3_geo_clipPolygonLinkCircular(array){if(!(n = array.length))return;var n,i=0,a=array[0],b;while(++i < n) {a.n = b = array[i];b.p = a;a = b;}a.n = b = array[0];b.p = a;}function d3_geo_clipPolygonIntersection(point,points,other,entry){this.x = point;this.z = points;this.o = other;this.e = entry;this.v = false;this.n = this.p = null;}function d3_geo_clip(pointVisible,clipLine,interpolate,clipStart){return function(rotate,listener){var line=clipLine(listener),rotatedClipStart=rotate.invert(clipStart[0],clipStart[1]);var clip={point:point,lineStart:lineStart,lineEnd:lineEnd,polygonStart:function polygonStart(){clip.point = pointRing;clip.lineStart = ringStart;clip.lineEnd = ringEnd;segments = [];polygon = [];},polygonEnd:function polygonEnd(){clip.point = point;clip.lineStart = lineStart;clip.lineEnd = lineEnd;segments = d3.merge(segments);var clipStartInside=d3_geo_pointInPolygon(rotatedClipStart,polygon);if(segments.length){if(!polygonStarted)listener.polygonStart(),polygonStarted = true;d3_geo_clipPolygon(segments,d3_geo_clipSort,clipStartInside,interpolate,listener);}else if(clipStartInside){if(!polygonStarted)listener.polygonStart(),polygonStarted = true;listener.lineStart();interpolate(null,null,1,listener);listener.lineEnd();}if(polygonStarted)listener.polygonEnd(),polygonStarted = false;segments = polygon = null;},sphere:function sphere(){listener.polygonStart();listener.lineStart();interpolate(null,null,1,listener);listener.lineEnd();listener.polygonEnd();}};function point(λ,φ){var point=rotate(λ,φ);if(pointVisible(λ = point[0],φ = point[1]))listener.point(λ,φ);}function pointLine(λ,φ){var point=rotate(λ,φ);line.point(point[0],point[1]);}function lineStart(){clip.point = pointLine;line.lineStart();}function lineEnd(){clip.point = point;line.lineEnd();}var segments;var buffer=d3_geo_clipBufferListener(),ringListener=clipLine(buffer),polygonStarted=false,polygon,ring;function pointRing(λ,φ){ring.push([λ,φ]);var point=rotate(λ,φ);ringListener.point(point[0],point[1]);}function ringStart(){ringListener.lineStart();ring = [];}function ringEnd(){pointRing(ring[0][0],ring[0][1]);ringListener.lineEnd();var clean=ringListener.clean(),ringSegments=buffer.buffer(),segment,n=ringSegments.length;ring.pop();polygon.push(ring);ring = null;if(!n)return;if(clean & 1){segment = ringSegments[0];var n=segment.length - 1,i=-1,point;if(n > 0){if(!polygonStarted)listener.polygonStart(),polygonStarted = true;listener.lineStart();while(++i < n) listener.point((point = segment[i])[0],point[1]);listener.lineEnd();}return;}if(n > 1 && clean & 2)ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));}return clip;};}function d3_geo_clipSegmentLength1(segment){return segment.length > 1;}function d3_geo_clipBufferListener(){var lines=[],line;return {lineStart:function lineStart(){lines.push(line = []);},point:function point(λ,φ){line.push([λ,φ]);},lineEnd:d3_noop,buffer:function buffer(){var buffer=lines;lines = [];line = null;return buffer;},rejoin:function rejoin(){if(lines.length > 1)lines.push(lines.pop().concat(lines.shift()));}};}function d3_geo_clipSort(a,b){return ((a = a.x)[0] < 0?a[1] - halfπ - ε:halfπ - a[1]) - ((b = b.x)[0] < 0?b[1] - halfπ - ε:halfπ - b[1]);}var d3_geo_clipAntimeridian=d3_geo_clip(d3_true,d3_geo_clipAntimeridianLine,d3_geo_clipAntimeridianInterpolate,[-π,-π / 2]);function d3_geo_clipAntimeridianLine(listener){var λ0=NaN,φ0=NaN,sλ0=NaN,_clean;return {lineStart:function lineStart(){listener.lineStart();_clean = 1;},point:function point(λ1,φ1){var sλ1=λ1 > 0?π:-π,dλ=abs(λ1 - λ0);if(abs(dλ - π) < ε){listener.point(λ0,φ0 = (φ0 + φ1) / 2 > 0?halfπ:-halfπ);listener.point(sλ0,φ0);listener.lineEnd();listener.lineStart();listener.point(sλ1,φ0);listener.point(λ1,φ0);_clean = 0;}else if(sλ0 !== sλ1 && dλ >= π){if(abs(λ0 - sλ0) < ε)λ0 -= sλ0 * ε;if(abs(λ1 - sλ1) < ε)λ1 -= sλ1 * ε;φ0 = d3_geo_clipAntimeridianIntersect(λ0,φ0,λ1,φ1);listener.point(sλ0,φ0);listener.lineEnd();listener.lineStart();listener.point(sλ1,φ0);_clean = 0;}listener.point(λ0 = λ1,φ0 = φ1);sλ0 = sλ1;},lineEnd:function lineEnd(){listener.lineEnd();λ0 = φ0 = NaN;},clean:function clean(){return 2 - _clean;}};}function d3_geo_clipAntimeridianIntersect(λ0,φ0,λ1,φ1){var cosφ0,cosφ1,sinλ0_λ1=Math.sin(λ0 - λ1);return abs(sinλ0_λ1) > ε?Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)):(φ0 + φ1) / 2;}function d3_geo_clipAntimeridianInterpolate(from,to,direction,listener){var φ;if(from == null){φ = direction * halfπ;listener.point(-π,φ);listener.point(0,φ);listener.point(π,φ);listener.point(π,0);listener.point(π,-φ);listener.point(0,-φ);listener.point(-π,-φ);listener.point(-π,0);listener.point(-π,φ);}else if(abs(from[0] - to[0]) > ε){var s=from[0] < to[0]?π:-π;φ = direction * s / 2;listener.point(-s,φ);listener.point(0,φ);listener.point(s,φ);}else {listener.point(to[0],to[1]);}}function d3_geo_pointInPolygon(point,polygon){var meridian=point[0],parallel=point[1],meridianNormal=[Math.sin(meridian),-Math.cos(meridian),0],polarAngle=0,winding=0;d3_geo_areaRingSum.reset();for(var i=0,n=polygon.length;i < n;++i) {var ring=polygon[i],m=ring.length;if(!m)continue;var point0=ring[0],λ0=point0[0],φ0=point0[1] / 2 + π / 4,sinφ0=Math.sin(φ0),cosφ0=Math.cos(φ0),j=1;while(true) {if(j === m)j = 0;point = ring[j];var λ=point[0],φ=point[1] / 2 + π / 4,sinφ=Math.sin(φ),cosφ=Math.cos(φ),dλ=λ - λ0,sdλ=dλ >= 0?1:-1,adλ=sdλ * dλ,antimeridian=adλ > π,k=sinφ0 * sinφ;d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ),cosφ0 * cosφ + k * Math.cos(adλ)));polarAngle += antimeridian?dλ + sdλ * τ:dλ;if(antimeridian ^ λ0 >= meridian ^ λ >= meridian){var arc=d3_geo_cartesianCross(d3_geo_cartesian(point0),d3_geo_cartesian(point));d3_geo_cartesianNormalize(arc);var intersection=d3_geo_cartesianCross(meridianNormal,arc);d3_geo_cartesianNormalize(intersection);var φarc=(antimeridian ^ dλ >= 0?-1:1) * d3_asin(intersection[2]);if(parallel > φarc || parallel === φarc && (arc[0] || arc[1])){winding += antimeridian ^ dλ >= 0?1:-1;}}if(! j++)break;λ0 = λ,sinφ0 = sinφ,cosφ0 = cosφ,point0 = point;}}return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;}function d3_geo_clipCircle(radius){var cr=Math.cos(radius),smallRadius=cr > 0,notHemisphere=abs(cr) > ε,interpolate=d3_geo_circleInterpolate(radius,6 * d3_radians);return d3_geo_clip(visible,clipLine,interpolate,smallRadius?[0,-radius]:[-π,radius - π]);function visible(λ,φ){return Math.cos(λ) * Math.cos(φ) > cr;}function clipLine(listener){var point0,c0,v0,v00,_clean2;return {lineStart:function lineStart(){v00 = v0 = false;_clean2 = 1;},point:function point(λ,φ){var point1=[λ,φ],point2,v=visible(λ,φ),c=smallRadius?v?0:code(λ,φ):v?code(λ + (λ < 0?π:-π),φ):0;if(!point0 && (v00 = v0 = v))listener.lineStart();if(v !== v0){point2 = intersect(point0,point1);if(d3_geo_sphericalEqual(point0,point2) || d3_geo_sphericalEqual(point1,point2)){point1[0] += ε;point1[1] += ε;v = visible(point1[0],point1[1]);}}if(v !== v0){_clean2 = 0;if(v){listener.lineStart();point2 = intersect(point1,point0);listener.point(point2[0],point2[1]);}else {point2 = intersect(point0,point1);listener.point(point2[0],point2[1]);listener.lineEnd();}point0 = point2;}else if(notHemisphere && point0 && smallRadius ^ v){var t;if(!(c & c0) && (t = intersect(point1,point0,true))){_clean2 = 0;if(smallRadius){listener.lineStart();listener.point(t[0][0],t[0][1]);listener.point(t[1][0],t[1][1]);listener.lineEnd();}else {listener.point(t[1][0],t[1][1]);listener.lineEnd();listener.lineStart();listener.point(t[0][0],t[0][1]);}}}if(v && (!point0 || !d3_geo_sphericalEqual(point0,point1))){listener.point(point1[0],point1[1]);}point0 = point1,v0 = v,c0 = c;},lineEnd:function lineEnd(){if(v0)listener.lineEnd();point0 = null;},clean:function clean(){return _clean2 | (v00 && v0) << 1;}};}function intersect(a,b,two){var pa=d3_geo_cartesian(a),pb=d3_geo_cartesian(b);var n1=[1,0,0],n2=d3_geo_cartesianCross(pa,pb),n2n2=d3_geo_cartesianDot(n2,n2),n1n2=n2[0],determinant=n2n2 - n1n2 * n1n2;if(!determinant)return !two && a;var c1=cr * n2n2 / determinant,c2=-cr * n1n2 / determinant,n1xn2=d3_geo_cartesianCross(n1,n2),A=d3_geo_cartesianScale(n1,c1),B=d3_geo_cartesianScale(n2,c2);d3_geo_cartesianAdd(A,B);var u=n1xn2,w=d3_geo_cartesianDot(A,u),uu=d3_geo_cartesianDot(u,u),t2=w * w - uu * (d3_geo_cartesianDot(A,A) - 1);if(t2 < 0)return;var t=Math.sqrt(t2),q=d3_geo_cartesianScale(u,(-w - t) / uu);d3_geo_cartesianAdd(q,A);q = d3_geo_spherical(q);if(!two)return q;var λ0=a[0],λ1=b[0],φ0=a[1],φ1=b[1],z;if(λ1 < λ0)z = λ0,λ0 = λ1,λ1 = z;var δλ=λ1 - λ0,polar=abs(δλ - π) < ε,meridian=polar || δλ < ε;if(!polar && φ1 < φ0)z = φ0,φ0 = φ1,φ1 = z;if(meridian?polar?φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε?φ0:φ1):φ0 <= q[1] && q[1] <= φ1:δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)){var q1=d3_geo_cartesianScale(u,(-w + t) / uu);d3_geo_cartesianAdd(q1,A);return [q,d3_geo_spherical(q1)];}}function code(λ,φ){var r=smallRadius?radius:π - radius,code=0;if(λ < -r)code |= 1;else if(λ > r)code |= 2;if(φ < -r)code |= 4;else if(φ > r)code |= 8;return code;}}function d3_geom_clipLine(x0,y0,x1,y1){return function(line){var a=line.a,b=line.b,ax=a.x,ay=a.y,bx=b.x,by=b.y,t0=0,t1=1,dx=bx - ax,dy=by - ay,r;r = x0 - ax;if(!dx && r > 0)return;r /= dx;if(dx < 0){if(r < t0)return;if(r < t1)t1 = r;}else if(dx > 0){if(r > t1)return;if(r > t0)t0 = r;}r = x1 - ax;if(!dx && r < 0)return;r /= dx;if(dx < 0){if(r > t1)return;if(r > t0)t0 = r;}else if(dx > 0){if(r < t0)return;if(r < t1)t1 = r;}r = y0 - ay;if(!dy && r > 0)return;r /= dy;if(dy < 0){if(r < t0)return;if(r < t1)t1 = r;}else if(dy > 0){if(r > t1)return;if(r > t0)t0 = r;}r = y1 - ay;if(!dy && r < 0)return;r /= dy;if(dy < 0){if(r > t1)return;if(r > t0)t0 = r;}else if(dy > 0){if(r < t0)return;if(r < t1)t1 = r;}if(t0 > 0)line.a = {x:ax + t0 * dx,y:ay + t0 * dy};if(t1 < 1)line.b = {x:ax + t1 * dx,y:ay + t1 * dy};return line;};}var d3_geo_clipExtentMAX=1e9;d3.geo.clipExtent = function(){var x0,y0,x1,y1,_stream,clip,clipExtent={stream:function stream(output){if(_stream)_stream.valid = false;_stream = clip(output);_stream.valid = true;return _stream;},extent:function extent(_){if(!arguments.length)return [[x0,y0],[x1,y1]];clip = d3_geo_clipExtent(x0 = +_[0][0],y0 = +_[0][1],x1 = +_[1][0],y1 = +_[1][1]);if(_stream)_stream.valid = false,_stream = null;return clipExtent;}};return clipExtent.extent([[0,0],[960,500]]);};function d3_geo_clipExtent(x0,y0,x1,y1){return function(listener){var listener_=listener,bufferListener=d3_geo_clipBufferListener(),clipLine=d3_geom_clipLine(x0,y0,x1,y1),segments,polygon,ring;var clip={point:point,lineStart:lineStart,lineEnd:lineEnd,polygonStart:function polygonStart(){listener = bufferListener;segments = [];polygon = [];clean = true;},polygonEnd:function polygonEnd(){listener = listener_;segments = d3.merge(segments);var clipStartInside=insidePolygon([x0,y1]),inside=clean && clipStartInside,visible=segments.length;if(inside || visible){listener.polygonStart();if(inside){listener.lineStart();interpolate(null,null,1,listener);listener.lineEnd();}if(visible){d3_geo_clipPolygon(segments,compare,clipStartInside,interpolate,listener);}listener.polygonEnd();}segments = polygon = ring = null;}};function insidePolygon(p){var wn=0,n=polygon.length,y=p[1];for(var i=0;i < n;++i) {for(var j=1,v=polygon[i],m=v.length,a=v[0],b;j < m;++j) {b = v[j];if(a[1] <= y){if(b[1] > y && d3_cross2d(a,b,p) > 0)++wn;}else {if(b[1] <= y && d3_cross2d(a,b,p) < 0)--wn;}a = b;}}return wn !== 0;}function interpolate(from,to,direction,listener){var a=0,a1=0;if(from == null || (a = corner(from,direction)) !== (a1 = corner(to,direction)) || comparePoints(from,to) < 0 ^ direction > 0){do {listener.point(a === 0 || a === 3?x0:x1,a > 1?y1:y0);}while((a = (a + direction + 4) % 4) !== a1);}else {listener.point(to[0],to[1]);}}function pointVisible(x,y){return x0 <= x && x <= x1 && y0 <= y && y <= y1;}function point(x,y){if(pointVisible(x,y))listener.point(x,y);}var x__,y__,v__,x_,y_,v_,first,clean;function lineStart(){clip.point = linePoint;if(polygon)polygon.push(ring = []);first = true;v_ = false;x_ = y_ = NaN;}function lineEnd(){if(segments){linePoint(x__,y__);if(v__ && v_)bufferListener.rejoin();segments.push(bufferListener.buffer());}clip.point = point;if(v_)listener.lineEnd();}function linePoint(x,y){x = Math.max(-d3_geo_clipExtentMAX,Math.min(d3_geo_clipExtentMAX,x));y = Math.max(-d3_geo_clipExtentMAX,Math.min(d3_geo_clipExtentMAX,y));var v=pointVisible(x,y);if(polygon)ring.push([x,y]);if(first){x__ = x,y__ = y,v__ = v;first = false;if(v){listener.lineStart();listener.point(x,y);}}else {if(v && v_)listener.point(x,y);else {var l={a:{x:x_,y:y_},b:{x:x,y:y}};if(clipLine(l)){if(!v_){listener.lineStart();listener.point(l.a.x,l.a.y);}listener.point(l.b.x,l.b.y);if(!v)listener.lineEnd();clean = false;}else if(v){listener.lineStart();listener.point(x,y);clean = false;}}}x_ = x,y_ = y,v_ = v;}return clip;};function corner(p,direction){return abs(p[0] - x0) < ε?direction > 0?0:3:abs(p[0] - x1) < ε?direction > 0?2:1:abs(p[1] - y0) < ε?direction > 0?1:0:direction > 0?3:2;}function compare(a,b){return comparePoints(a.x,b.x);}function comparePoints(a,b){var ca=corner(a,1),cb=corner(b,1);return ca !== cb?ca - cb:ca === 0?b[1] - a[1]:ca === 1?a[0] - b[0]:ca === 2?a[1] - b[1]:b[0] - a[0];}}function d3_geo_conic(projectAt){var φ0=0,φ1=π / 3,m=d3_geo_projectionMutator(projectAt),p=m(φ0,φ1);p.parallels = function(_){if(!arguments.length)return [φ0 / π * 180,φ1 / π * 180];return m(φ0 = _[0] * π / 180,φ1 = _[1] * π / 180);};return p;}function d3_geo_conicEqualArea(φ0,φ1){var sinφ0=Math.sin(φ0),n=(sinφ0 + Math.sin(φ1)) / 2,C=1 + sinφ0 * (2 * n - sinφ0),ρ0=Math.sqrt(C) / n;function forward(λ,φ){var ρ=Math.sqrt(C - 2 * n * Math.sin(φ)) / n;return [ρ * Math.sin(λ *= n),ρ0 - ρ * Math.cos(λ)];}forward.invert = function(x,y){var ρ0_y=ρ0 - y;return [Math.atan2(x,ρ0_y) / n,d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n))];};return forward;}(d3.geo.conicEqualArea = function(){return d3_geo_conic(d3_geo_conicEqualArea);}).raw = d3_geo_conicEqualArea;d3.geo.albers = function(){return d3.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070);};d3.geo.albersUsa = function(){var lower48=d3.geo.albers();var alaska=d3.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]);var hawaii=d3.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]);var _point,pointStream={point:function point(x,y){_point = [x,y];}},lower48Point,alaskaPoint,hawaiiPoint;function albersUsa(coordinates){var x=coordinates[0],y=coordinates[1];_point = null;(lower48Point(x,y),_point) || (alaskaPoint(x,y),_point) || hawaiiPoint(x,y);return _point;}albersUsa.invert = function(coordinates){var k=lower48.scale(),t=lower48.translate(),x=(coordinates[0] - t[0]) / k,y=(coordinates[1] - t[1]) / k;return (y >= .12 && y < .234 && x >= -.425 && x < -.214?alaska:y >= .166 && y < .234 && x >= -.214 && x < -.115?hawaii:lower48).invert(coordinates);};albersUsa.stream = function(stream){var lower48Stream=lower48.stream(stream),alaskaStream=alaska.stream(stream),hawaiiStream=hawaii.stream(stream);return {point:function point(x,y){lower48Stream.point(x,y);alaskaStream.point(x,y);hawaiiStream.point(x,y);},sphere:function sphere(){lower48Stream.sphere();alaskaStream.sphere();hawaiiStream.sphere();},lineStart:function lineStart(){lower48Stream.lineStart();alaskaStream.lineStart();hawaiiStream.lineStart();},lineEnd:function lineEnd(){lower48Stream.lineEnd();alaskaStream.lineEnd();hawaiiStream.lineEnd();},polygonStart:function polygonStart(){lower48Stream.polygonStart();alaskaStream.polygonStart();hawaiiStream.polygonStart();},polygonEnd:function polygonEnd(){lower48Stream.polygonEnd();alaskaStream.polygonEnd();hawaiiStream.polygonEnd();}};};albersUsa.precision = function(_){if(!arguments.length)return lower48.precision();lower48.precision(_);alaska.precision(_);hawaii.precision(_);return albersUsa;};albersUsa.scale = function(_){if(!arguments.length)return lower48.scale();lower48.scale(_);alaska.scale(_ * .35);hawaii.scale(_);return albersUsa.translate(lower48.translate());};albersUsa.translate = function(_){if(!arguments.length)return lower48.translate();var k=lower48.scale(),x=+_[0],y=+_[1];lower48Point = lower48.translate(_).clipExtent([[x - .455 * k,y - .238 * k],[x + .455 * k,y + .238 * k]]).stream(pointStream).point;alaskaPoint = alaska.translate([x - .307 * k,y + .201 * k]).clipExtent([[x - .425 * k + ε,y + .12 * k + ε],[x - .214 * k - ε,y + .234 * k - ε]]).stream(pointStream).point;hawaiiPoint = hawaii.translate([x - .205 * k,y + .212 * k]).clipExtent([[x - .214 * k + ε,y + .166 * k + ε],[x - .115 * k - ε,y + .234 * k - ε]]).stream(pointStream).point;return albersUsa;};return albersUsa.scale(1070);};var d3_geo_pathAreaSum,d3_geo_pathAreaPolygon,d3_geo_pathArea={point:d3_noop,lineStart:d3_noop,lineEnd:d3_noop,polygonStart:function polygonStart(){d3_geo_pathAreaPolygon = 0;d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;},polygonEnd:function polygonEnd(){d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);}};function d3_geo_pathAreaRingStart(){var x00,y00,x0,y0;d3_geo_pathArea.point = function(x,y){d3_geo_pathArea.point = nextPoint;x00 = x0 = x,y00 = y0 = y;};function nextPoint(x,y){d3_geo_pathAreaPolygon += y0 * x - x0 * y;x0 = x,y0 = y;}d3_geo_pathArea.lineEnd = function(){nextPoint(x00,y00);};}var d3_geo_pathBoundsX0,d3_geo_pathBoundsY0,d3_geo_pathBoundsX1,d3_geo_pathBoundsY1;var d3_geo_pathBounds={point:d3_geo_pathBoundsPoint,lineStart:d3_noop,lineEnd:d3_noop,polygonStart:d3_noop,polygonEnd:d3_noop};function d3_geo_pathBoundsPoint(x,y){if(x < d3_geo_pathBoundsX0)d3_geo_pathBoundsX0 = x;if(x > d3_geo_pathBoundsX1)d3_geo_pathBoundsX1 = x;if(y < d3_geo_pathBoundsY0)d3_geo_pathBoundsY0 = y;if(y > d3_geo_pathBoundsY1)d3_geo_pathBoundsY1 = y;}function d3_geo_pathBuffer(){var pointCircle=d3_geo_pathBufferCircle(4.5),buffer=[];var stream={point:point,lineStart:function lineStart(){stream.point = pointLineStart;},lineEnd:lineEnd,polygonStart:function polygonStart(){stream.lineEnd = lineEndPolygon;},polygonEnd:function polygonEnd(){stream.lineEnd = lineEnd;stream.point = point;},pointRadius:function pointRadius(_){pointCircle = d3_geo_pathBufferCircle(_);return stream;},result:function result(){if(buffer.length){var result=buffer.join("");buffer = [];return result;}}};function point(x,y){buffer.push("M",x,",",y,pointCircle);}function pointLineStart(x,y){buffer.push("M",x,",",y);stream.point = pointLine;}function pointLine(x,y){buffer.push("L",x,",",y);}function lineEnd(){stream.point = point;}function lineEndPolygon(){buffer.push("Z");}return stream;}function d3_geo_pathBufferCircle(radius){return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";}var d3_geo_pathCentroid={point:d3_geo_pathCentroidPoint,lineStart:d3_geo_pathCentroidLineStart,lineEnd:d3_geo_pathCentroidLineEnd,polygonStart:function polygonStart(){d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;},polygonEnd:function polygonEnd(){d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;}};function d3_geo_pathCentroidPoint(x,y){d3_geo_centroidX0 += x;d3_geo_centroidY0 += y;++d3_geo_centroidZ0;}function d3_geo_pathCentroidLineStart(){var x0,y0;d3_geo_pathCentroid.point = function(x,y){d3_geo_pathCentroid.point = nextPoint;d3_geo_pathCentroidPoint(x0 = x,y0 = y);};function nextPoint(x,y){var dx=x - x0,dy=y - y0,z=Math.sqrt(dx * dx + dy * dy);d3_geo_centroidX1 += z * (x0 + x) / 2;d3_geo_centroidY1 += z * (y0 + y) / 2;d3_geo_centroidZ1 += z;d3_geo_pathCentroidPoint(x0 = x,y0 = y);}}function d3_geo_pathCentroidLineEnd(){d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;}function d3_geo_pathCentroidRingStart(){var x00,y00,x0,y0;d3_geo_pathCentroid.point = function(x,y){d3_geo_pathCentroid.point = nextPoint;d3_geo_pathCentroidPoint(x00 = x0 = x,y00 = y0 = y);};function nextPoint(x,y){var dx=x - x0,dy=y - y0,z=Math.sqrt(dx * dx + dy * dy);d3_geo_centroidX1 += z * (x0 + x) / 2;d3_geo_centroidY1 += z * (y0 + y) / 2;d3_geo_centroidZ1 += z;z = y0 * x - x0 * y;d3_geo_centroidX2 += z * (x0 + x);d3_geo_centroidY2 += z * (y0 + y);d3_geo_centroidZ2 += z * 3;d3_geo_pathCentroidPoint(x0 = x,y0 = y);}d3_geo_pathCentroid.lineEnd = function(){nextPoint(x00,y00);};}function d3_geo_pathContext(context){var _pointRadius=4.5;var stream={point:point,lineStart:function lineStart(){stream.point = pointLineStart;},lineEnd:lineEnd,polygonStart:function polygonStart(){stream.lineEnd = lineEndPolygon;},polygonEnd:function polygonEnd(){stream.lineEnd = lineEnd;stream.point = point;},pointRadius:function pointRadius(_){_pointRadius = _;return stream;},result:d3_noop};function point(x,y){context.moveTo(x + _pointRadius,y);context.arc(x,y,_pointRadius,0,τ);}function pointLineStart(x,y){context.moveTo(x,y);stream.point = pointLine;}function pointLine(x,y){context.lineTo(x,y);}function lineEnd(){stream.point = point;}function lineEndPolygon(){context.closePath();}return stream;}function d3_geo_resample(project){var δ2=.5,cosMinDistance=Math.cos(30 * d3_radians),maxDepth=16;function resample(stream){return (maxDepth?resampleRecursive:resampleNone)(stream);}function resampleNone(stream){return d3_geo_transformPoint(stream,function(x,y){x = project(x,y);stream.point(x[0],x[1]);});}function resampleRecursive(stream){var λ00,φ00,x00,y00,a00,b00,c00,λ0,x0,y0,a0,b0,c0;var resample={point:point,lineStart:lineStart,lineEnd:lineEnd,polygonStart:function polygonStart(){stream.polygonStart();resample.lineStart = ringStart;},polygonEnd:function polygonEnd(){stream.polygonEnd();resample.lineStart = lineStart;}};function point(x,y){x = project(x,y);stream.point(x[0],x[1]);}function lineStart(){x0 = NaN;resample.point = linePoint;stream.lineStart();}function linePoint(λ,φ){var c=d3_geo_cartesian([λ,φ]),p=project(λ,φ);resampleLineTo(x0,y0,λ0,a0,b0,c0,x0 = p[0],y0 = p[1],λ0 = λ,a0 = c[0],b0 = c[1],c0 = c[2],maxDepth,stream);stream.point(x0,y0);}function lineEnd(){resample.point = point;stream.lineEnd();}function ringStart(){lineStart();resample.point = ringPoint;resample.lineEnd = ringEnd;}function ringPoint(λ,φ){linePoint(λ00 = λ,φ00 = φ),x00 = x0,y00 = y0,a00 = a0,b00 = b0,c00 = c0;resample.point = linePoint;}function ringEnd(){resampleLineTo(x0,y0,λ0,a0,b0,c0,x00,y00,λ00,a00,b00,c00,maxDepth,stream);resample.lineEnd = lineEnd;lineEnd();}return resample;}function resampleLineTo(x0,y0,λ0,a0,b0,c0,x1,y1,λ1,a1,b1,c1,depth,stream){var dx=x1 - x0,dy=y1 - y0,d2=dx * dx + dy * dy;if(d2 > 4 * δ2 && depth--){var a=a0 + a1,b=b0 + b1,c=c0 + c1,m=Math.sqrt(a * a + b * b + c * c),φ2=Math.asin(c /= m),λ2=abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε?(λ0 + λ1) / 2:Math.atan2(b,a),p=project(λ2,φ2),x2=p[0],y2=p[1],dx2=x2 - x0,dy2=y2 - y0,dz=dy * dx2 - dx * dy2;if(dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance){resampleLineTo(x0,y0,λ0,a0,b0,c0,x2,y2,λ2,a /= m,b /= m,c,depth,stream);stream.point(x2,y2);resampleLineTo(x2,y2,λ2,a,b,c,x1,y1,λ1,a1,b1,c1,depth,stream);}}}resample.precision = function(_){if(!arguments.length)return Math.sqrt(δ2);maxDepth = (δ2 = _ * _) > 0 && 16;return resample;};return resample;}d3.geo.path = function(){var pointRadius=4.5,projection,context,projectStream,contextStream,cacheStream;function path(object){if(object){if(typeof pointRadius === "function")contextStream.pointRadius(+pointRadius.apply(this,arguments));if(!cacheStream || !cacheStream.valid)cacheStream = projectStream(contextStream);d3.geo.stream(object,cacheStream);}return contextStream.result();}path.area = function(object){d3_geo_pathAreaSum = 0;d3.geo.stream(object,projectStream(d3_geo_pathArea));return d3_geo_pathAreaSum;};path.centroid = function(object){d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;d3.geo.stream(object,projectStream(d3_geo_pathCentroid));return d3_geo_centroidZ2?[d3_geo_centroidX2 / d3_geo_centroidZ2,d3_geo_centroidY2 / d3_geo_centroidZ2]:d3_geo_centroidZ1?[d3_geo_centroidX1 / d3_geo_centroidZ1,d3_geo_centroidY1 / d3_geo_centroidZ1]:d3_geo_centroidZ0?[d3_geo_centroidX0 / d3_geo_centroidZ0,d3_geo_centroidY0 / d3_geo_centroidZ0]:[NaN,NaN];};path.bounds = function(object){d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);d3.geo.stream(object,projectStream(d3_geo_pathBounds));return [[d3_geo_pathBoundsX0,d3_geo_pathBoundsY0],[d3_geo_pathBoundsX1,d3_geo_pathBoundsY1]];};path.projection = function(_){if(!arguments.length)return projection;projectStream = (projection = _)?_.stream || d3_geo_pathProjectStream(_):d3_identity;return reset();};path.context = function(_){if(!arguments.length)return context;contextStream = (context = _) == null?new d3_geo_pathBuffer():new d3_geo_pathContext(_);if(typeof pointRadius !== "function")contextStream.pointRadius(pointRadius);return reset();};path.pointRadius = function(_){if(!arguments.length)return pointRadius;pointRadius = typeof _ === "function"?_:(contextStream.pointRadius(+_),+_);return path;};function reset(){cacheStream = null;return path;}return path.projection(d3.geo.albersUsa()).context(null);};function d3_geo_pathProjectStream(project){var resample=d3_geo_resample(function(x,y){return project([x * d3_degrees,y * d3_degrees]);});return function(stream){return d3_geo_projectionRadians(resample(stream));};}d3.geo.transform = function(methods){return {stream:function stream(_stream2){var transform=new d3_geo_transform(_stream2);for(var k in methods) transform[k] = methods[k];return transform;}};};function d3_geo_transform(stream){this.stream = stream;}d3_geo_transform.prototype = {point:function point(x,y){this.stream.point(x,y);},sphere:function sphere(){this.stream.sphere();},lineStart:function lineStart(){this.stream.lineStart();},lineEnd:function lineEnd(){this.stream.lineEnd();},polygonStart:function polygonStart(){this.stream.polygonStart();},polygonEnd:function polygonEnd(){this.stream.polygonEnd();}};function d3_geo_transformPoint(stream,point){return {point:point,sphere:function sphere(){stream.sphere();},lineStart:function lineStart(){stream.lineStart();},lineEnd:function lineEnd(){stream.lineEnd();},polygonStart:function polygonStart(){stream.polygonStart();},polygonEnd:function polygonEnd(){stream.polygonEnd();}};}d3.geo.projection = d3_geo_projection;d3.geo.projectionMutator = d3_geo_projectionMutator;function d3_geo_projection(project){return d3_geo_projectionMutator(function(){return project;})();}function d3_geo_projectionMutator(projectAt){var project,rotate,projectRotate,projectResample=d3_geo_resample(function(x,y){x = project(x,y);return [x[0] * k + δx,δy - x[1] * k];}),k=150,x=480,y=250,λ=0,φ=0,δλ=0,δφ=0,δγ=0,δx,δy,preclip=d3_geo_clipAntimeridian,postclip=d3_identity,clipAngle=null,clipExtent=null,stream;function projection(point){point = projectRotate(point[0] * d3_radians,point[1] * d3_radians);return [point[0] * k + δx,δy - point[1] * k];}function invert(point){point = projectRotate.invert((point[0] - δx) / k,(δy - point[1]) / k);return point && [point[0] * d3_degrees,point[1] * d3_degrees];}projection.stream = function(output){if(stream)stream.valid = false;stream = d3_geo_projectionRadians(preclip(rotate,projectResample(postclip(output))));stream.valid = true;return stream;};projection.clipAngle = function(_){if(!arguments.length)return clipAngle;preclip = _ == null?(clipAngle = _,d3_geo_clipAntimeridian):d3_geo_clipCircle((clipAngle = +_) * d3_radians);return invalidate();};projection.clipExtent = function(_){if(!arguments.length)return clipExtent;clipExtent = _;postclip = _?d3_geo_clipExtent(_[0][0],_[0][1],_[1][0],_[1][1]):d3_identity;return invalidate();};projection.scale = function(_){if(!arguments.length)return k;k = +_;return reset();};projection.translate = function(_){if(!arguments.length)return [x,y];x = +_[0];y = +_[1];return reset();};projection.center = function(_){if(!arguments.length)return [λ * d3_degrees,φ * d3_degrees];λ = _[0] % 360 * d3_radians;φ = _[1] % 360 * d3_radians;return reset();};projection.rotate = function(_){if(!arguments.length)return [δλ * d3_degrees,δφ * d3_degrees,δγ * d3_degrees];δλ = _[0] % 360 * d3_radians;δφ = _[1] % 360 * d3_radians;δγ = _.length > 2?_[2] % 360 * d3_radians:0;return reset();};d3.rebind(projection,projectResample,"precision");function reset(){projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ,δφ,δγ),project);var center=project(λ,φ);δx = x - center[0] * k;δy = y + center[1] * k;return invalidate();}function invalidate(){if(stream)stream.valid = false,stream = null;return projection;}return function(){project = projectAt.apply(this,arguments);projection.invert = project.invert && invert;return reset();};}function d3_geo_projectionRadians(stream){return d3_geo_transformPoint(stream,function(x,y){stream.point(x * d3_radians,y * d3_radians);});}function d3_geo_equirectangular(λ,φ){return [λ,φ];}(d3.geo.equirectangular = function(){return d3_geo_projection(d3_geo_equirectangular);}).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;d3.geo.rotation = function(rotate){rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians,rotate[1] * d3_radians,rotate.length > 2?rotate[2] * d3_radians:0);function forward(coordinates){coordinates = rotate(coordinates[0] * d3_radians,coordinates[1] * d3_radians);return coordinates[0] *= d3_degrees,coordinates[1] *= d3_degrees,coordinates;}forward.invert = function(coordinates){coordinates = rotate.invert(coordinates[0] * d3_radians,coordinates[1] * d3_radians);return coordinates[0] *= d3_degrees,coordinates[1] *= d3_degrees,coordinates;};return forward;};function d3_geo_identityRotation(λ,φ){return [λ > π?λ - τ:λ < -π?λ + τ:λ,φ];}d3_geo_identityRotation.invert = d3_geo_equirectangular;function d3_geo_rotation(δλ,δφ,δγ){return δλ?δφ || δγ?d3_geo_compose(d3_geo_rotationλ(δλ),d3_geo_rotationφγ(δφ,δγ)):d3_geo_rotationλ(δλ):δφ || δγ?d3_geo_rotationφγ(δφ,δγ):d3_geo_identityRotation;}function d3_geo_forwardRotationλ(δλ){return function(λ,φ){return λ += δλ,[λ > π?λ - τ:λ < -π?λ + τ:λ,φ];};}function d3_geo_rotationλ(δλ){var rotation=d3_geo_forwardRotationλ(δλ);rotation.invert = d3_geo_forwardRotationλ(-δλ);return rotation;}function d3_geo_rotationφγ(δφ,δγ){var cosδφ=Math.cos(δφ),sinδφ=Math.sin(δφ),cosδγ=Math.cos(δγ),sinδγ=Math.sin(δγ);function rotation(λ,φ){var cosφ=Math.cos(φ),x=Math.cos(λ) * cosφ,y=Math.sin(λ) * cosφ,z=Math.sin(φ),k=z * cosδφ + x * sinδφ;return [Math.atan2(y * cosδγ - k * sinδγ,x * cosδφ - z * sinδφ),d3_asin(k * cosδγ + y * sinδγ)];}rotation.invert = function(λ,φ){var cosφ=Math.cos(φ),x=Math.cos(λ) * cosφ,y=Math.sin(λ) * cosφ,z=Math.sin(φ),k=z * cosδγ - y * sinδγ;return [Math.atan2(y * cosδγ + z * sinδγ,x * cosδφ + k * sinδφ),d3_asin(k * cosδφ - x * sinδφ)];};return rotation;}d3.geo.circle = function(){var origin=[0,0],angle,precision=6,interpolate;function circle(){var center=typeof origin === "function"?origin.apply(this,arguments):origin,rotate=d3_geo_rotation(-center[0] * d3_radians,-center[1] * d3_radians,0).invert,ring=[];interpolate(null,null,1,{point:function point(x,y){ring.push(x = rotate(x,y));x[0] *= d3_degrees,x[1] *= d3_degrees;}});return {type:"Polygon",coordinates:[ring]};}circle.origin = function(x){if(!arguments.length)return origin;origin = x;return circle;};circle.angle = function(x){if(!arguments.length)return angle;interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians,precision * d3_radians);return circle;};circle.precision = function(_){if(!arguments.length)return precision;interpolate = d3_geo_circleInterpolate(angle * d3_radians,(precision = +_) * d3_radians);return circle;};return circle.angle(90);};function d3_geo_circleInterpolate(radius,precision){var cr=Math.cos(radius),sr=Math.sin(radius);return function(from,to,direction,listener){var step=direction * precision;if(from != null){from = d3_geo_circleAngle(cr,from);to = d3_geo_circleAngle(cr,to);if(direction > 0?from < to:from > to)from += direction * τ;}else {from = radius + direction * τ;to = radius - .5 * step;}for(var point,t=from;direction > 0?t > to:t < to;t -= step) {listener.point((point = d3_geo_spherical([cr,-sr * Math.cos(t),-sr * Math.sin(t)]))[0],point[1]);}};}function d3_geo_circleAngle(cr,point){var a=d3_geo_cartesian(point);a[0] -= cr;d3_geo_cartesianNormalize(a);var angle=d3_acos(-a[1]);return ((-a[2] < 0?-angle:angle) + 2 * Math.PI - ε) % (2 * Math.PI);}d3.geo.distance = function(a,b){var Δλ=(b[0] - a[0]) * d3_radians,φ0=a[1] * d3_radians,φ1=b[1] * d3_radians,sinΔλ=Math.sin(Δλ),cosΔλ=Math.cos(Δλ),sinφ0=Math.sin(φ0),cosφ0=Math.cos(φ0),sinφ1=Math.sin(φ1),cosφ1=Math.cos(φ1),t;return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t),sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);};d3.geo.graticule = function(){var x1,x0,X1,X0,y1,y0,Y1,Y0,dx=10,dy=dx,DX=90,DY=360,x,y,X,Y,precision=2.5;function graticule(){return {type:"MultiLineString",coordinates:lines()};}function lines(){return d3.range(Math.ceil(X0 / DX) * DX,X1,DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY,Y1,DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx,x1,dx).filter(function(x){return abs(x % DX) > ε;}).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy,y1,dy).filter(function(y){return abs(y % DY) > ε;}).map(y));}graticule.lines = function(){return lines().map(function(coordinates){return {type:"LineString",coordinates:coordinates};});};graticule.outline = function(){return {type:"Polygon",coordinates:[X(X0).concat(Y(Y1).slice(1),X(X1).reverse().slice(1),Y(Y0).reverse().slice(1))]};};graticule.extent = function(_){if(!arguments.length)return graticule.minorExtent();return graticule.majorExtent(_).minorExtent(_);};graticule.majorExtent = function(_){if(!arguments.length)return [[X0,Y0],[X1,Y1]];X0 = +_[0][0],X1 = +_[1][0];Y0 = +_[0][1],Y1 = +_[1][1];if(X0 > X1)_ = X0,X0 = X1,X1 = _;if(Y0 > Y1)_ = Y0,Y0 = Y1,Y1 = _;return graticule.precision(precision);};graticule.minorExtent = function(_){if(!arguments.length)return [[x0,y0],[x1,y1]];x0 = +_[0][0],x1 = +_[1][0];y0 = +_[0][1],y1 = +_[1][1];if(x0 > x1)_ = x0,x0 = x1,x1 = _;if(y0 > y1)_ = y0,y0 = y1,y1 = _;return graticule.precision(precision);};graticule.step = function(_){if(!arguments.length)return graticule.minorStep();return graticule.majorStep(_).minorStep(_);};graticule.majorStep = function(_){if(!arguments.length)return [DX,DY];DX = +_[0],DY = +_[1];return graticule;};graticule.minorStep = function(_){if(!arguments.length)return [dx,dy];dx = +_[0],dy = +_[1];return graticule;};graticule.precision = function(_){if(!arguments.length)return precision;precision = +_;x = d3_geo_graticuleX(y0,y1,90);y = d3_geo_graticuleY(x0,x1,precision);X = d3_geo_graticuleX(Y0,Y1,90);Y = d3_geo_graticuleY(X0,X1,precision);return graticule;};return graticule.majorExtent([[-180,-90 + ε],[180,90 - ε]]).minorExtent([[-180,-80 - ε],[180,80 + ε]]);};function d3_geo_graticuleX(y0,y1,dy){var y=d3.range(y0,y1 - ε,dy).concat(y1);return function(x){return y.map(function(y){return [x,y];});};}function d3_geo_graticuleY(x0,x1,dx){var x=d3.range(x0,x1 - ε,dx).concat(x1);return function(y){return x.map(function(x){return [x,y];});};}function d3_source(d){return d.source;}function d3_target(d){return d.target;}d3.geo.greatArc = function(){var source=d3_source,source_,target=d3_target,target_;function greatArc(){return {type:"LineString",coordinates:[source_ || source.apply(this,arguments),target_ || target.apply(this,arguments)]};}greatArc.distance = function(){return d3.geo.distance(source_ || source.apply(this,arguments),target_ || target.apply(this,arguments));};greatArc.source = function(_){if(!arguments.length)return source;source = _,source_ = typeof _ === "function"?null:_;return greatArc;};greatArc.target = function(_){if(!arguments.length)return target;target = _,target_ = typeof _ === "function"?null:_;return greatArc;};greatArc.precision = function(){return arguments.length?greatArc:0;};return greatArc;};d3.geo.interpolate = function(source,target){return d3_geo_interpolate(source[0] * d3_radians,source[1] * d3_radians,target[0] * d3_radians,target[1] * d3_radians);};function d3_geo_interpolate(x0,y0,x1,y1){var cy0=Math.cos(y0),sy0=Math.sin(y0),cy1=Math.cos(y1),sy1=Math.sin(y1),kx0=cy0 * Math.cos(x0),ky0=cy0 * Math.sin(x0),kx1=cy1 * Math.cos(x1),ky1=cy1 * Math.sin(x1),d=2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))),k=1 / Math.sin(d);var interpolate=d?function(t){var B=Math.sin(t *= d) * k,A=Math.sin(d - t) * k,x=A * kx0 + B * kx1,y=A * ky0 + B * ky1,z=A * sy0 + B * sy1;return [Math.atan2(y,x) * d3_degrees,Math.atan2(z,Math.sqrt(x * x + y * y)) * d3_degrees];}:function(){return [x0 * d3_degrees,y0 * d3_degrees];};interpolate.distance = d;return interpolate;}d3.geo.length = function(object){d3_geo_lengthSum = 0;d3.geo.stream(object,d3_geo_length);return d3_geo_lengthSum;};var d3_geo_lengthSum;var d3_geo_length={sphere:d3_noop,point:d3_noop,lineStart:d3_geo_lengthLineStart,lineEnd:d3_noop,polygonStart:d3_noop,polygonEnd:d3_noop};function d3_geo_lengthLineStart(){var λ0,sinφ0,cosφ0;d3_geo_length.point = function(λ,φ){λ0 = λ * d3_radians,sinφ0 = Math.sin(φ *= d3_radians),cosφ0 = Math.cos(φ);d3_geo_length.point = nextPoint;};d3_geo_length.lineEnd = function(){d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;};function nextPoint(λ,φ){var sinφ=Math.sin(φ *= d3_radians),cosφ=Math.cos(φ),t=abs((λ *= d3_radians) - λ0),cosΔλ=Math.cos(t);d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t),sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);λ0 = λ,sinφ0 = sinφ,cosφ0 = cosφ;}}function d3_geo_azimuthal(scale,angle){function azimuthal(λ,φ){var cosλ=Math.cos(λ),cosφ=Math.cos(φ),k=scale(cosλ * cosφ);return [k * cosφ * Math.sin(λ),k * Math.sin(φ)];}azimuthal.invert = function(x,y){var ρ=Math.sqrt(x * x + y * y),c=angle(ρ),sinc=Math.sin(c),cosc=Math.cos(c);return [Math.atan2(x * sinc,ρ * cosc),Math.asin(ρ && y * sinc / ρ)];};return azimuthal;}var d3_geo_azimuthalEqualArea=d3_geo_azimuthal(function(cosλcosφ){return Math.sqrt(2 / (1 + cosλcosφ));},function(ρ){return 2 * Math.asin(ρ / 2);});(d3.geo.azimuthalEqualArea = function(){return d3_geo_projection(d3_geo_azimuthalEqualArea);}).raw = d3_geo_azimuthalEqualArea;var d3_geo_azimuthalEquidistant=d3_geo_azimuthal(function(cosλcosφ){var c=Math.acos(cosλcosφ);return c && c / Math.sin(c);},d3_identity);(d3.geo.azimuthalEquidistant = function(){return d3_geo_projection(d3_geo_azimuthalEquidistant);}).raw = d3_geo_azimuthalEquidistant;function d3_geo_conicConformal(φ0,φ1){var cosφ0=Math.cos(φ0),t=function t(φ){return Math.tan(π / 4 + φ / 2);},n=φ0 === φ1?Math.sin(φ0):Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),F=cosφ0 * Math.pow(t(φ0),n) / n;if(!n)return d3_geo_mercator;function forward(λ,φ){if(F > 0){if(φ < -halfπ + ε)φ = -halfπ + ε;}else {if(φ > halfπ - ε)φ = halfπ - ε;}var ρ=F / Math.pow(t(φ),n);return [ρ * Math.sin(n * λ),F - ρ * Math.cos(n * λ)];}forward.invert = function(x,y){var ρ0_y=F - y,ρ=d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);return [Math.atan2(x,ρ0_y) / n,2 * Math.atan(Math.pow(F / ρ,1 / n)) - halfπ];};return forward;}(d3.geo.conicConformal = function(){return d3_geo_conic(d3_geo_conicConformal);}).raw = d3_geo_conicConformal;function d3_geo_conicEquidistant(φ0,φ1){var cosφ0=Math.cos(φ0),n=φ0 === φ1?Math.sin(φ0):(cosφ0 - Math.cos(φ1)) / (φ1 - φ0),G=cosφ0 / n + φ0;if(abs(n) < ε)return d3_geo_equirectangular;function forward(λ,φ){var ρ=G - φ;return [ρ * Math.sin(n * λ),G - ρ * Math.cos(n * λ)];}forward.invert = function(x,y){var ρ0_y=G - y;return [Math.atan2(x,ρ0_y) / n,G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)];};return forward;}(d3.geo.conicEquidistant = function(){return d3_geo_conic(d3_geo_conicEquidistant);}).raw = d3_geo_conicEquidistant;var d3_geo_gnomonic=d3_geo_azimuthal(function(cosλcosφ){return 1 / cosλcosφ;},Math.atan);(d3.geo.gnomonic = function(){return d3_geo_projection(d3_geo_gnomonic);}).raw = d3_geo_gnomonic;function d3_geo_mercator(λ,φ){return [λ,Math.log(Math.tan(π / 4 + φ / 2))];}d3_geo_mercator.invert = function(x,y){return [x,2 * Math.atan(Math.exp(y)) - halfπ];};function d3_geo_mercatorProjection(project){var m=d3_geo_projection(project),scale=m.scale,translate=m.translate,clipExtent=m.clipExtent,clipAuto;m.scale = function(){var v=scale.apply(m,arguments);return v === m?clipAuto?m.clipExtent(null):m:v;};m.translate = function(){var v=translate.apply(m,arguments);return v === m?clipAuto?m.clipExtent(null):m:v;};m.clipExtent = function(_){var v=clipExtent.apply(m,arguments);if(v === m){if(clipAuto = _ == null){var k=π * scale(),t=translate();clipExtent([[t[0] - k,t[1] - k],[t[0] + k,t[1] + k]]);}}else if(clipAuto){v = null;}return v;};return m.clipExtent(null);}(d3.geo.mercator = function(){return d3_geo_mercatorProjection(d3_geo_mercator);}).raw = d3_geo_mercator;var d3_geo_orthographic=d3_geo_azimuthal(function(){return 1;},Math.asin);(d3.geo.orthographic = function(){return d3_geo_projection(d3_geo_orthographic);}).raw = d3_geo_orthographic;var d3_geo_stereographic=d3_geo_azimuthal(function(cosλcosφ){return 1 / (1 + cosλcosφ);},function(ρ){return 2 * Math.atan(ρ);});(d3.geo.stereographic = function(){return d3_geo_projection(d3_geo_stereographic);}).raw = d3_geo_stereographic;function d3_geo_transverseMercator(λ,φ){return [Math.log(Math.tan(π / 4 + φ / 2)),-λ];}d3_geo_transverseMercator.invert = function(x,y){return [-y,2 * Math.atan(Math.exp(x)) - halfπ];};(d3.geo.transverseMercator = function(){var projection=d3_geo_mercatorProjection(d3_geo_transverseMercator),center=projection.center,rotate=projection.rotate;projection.center = function(_){return _?center([-_[1],_[0]]):(_ = center(),[_[1],-_[0]]);};projection.rotate = function(_){return _?rotate([_[0],_[1],_.length > 2?_[2] + 90:90]):(_ = rotate(),[_[0],_[1],_[2] - 90]);};return rotate([0,0,90]);}).raw = d3_geo_transverseMercator;d3.geom = {};function d3_geom_pointX(d){return d[0];}function d3_geom_pointY(d){return d[1];}d3.geom.hull = function(vertices){var x=d3_geom_pointX,y=d3_geom_pointY;if(arguments.length)return hull(vertices);function hull(data){if(data.length < 3)return [];var fx=d3_functor(x),fy=d3_functor(y),i,n=data.length,points=[],flippedPoints=[];for(i = 0;i < n;i++) {points.push([+fx.call(this,data[i],i),+fy.call(this,data[i],i),i]);}points.sort(d3_geom_hullOrder);for(i = 0;i < n;i++) flippedPoints.push([points[i][0],-points[i][1]]);var upper=d3_geom_hullUpper(points),lower=d3_geom_hullUpper(flippedPoints);var skipLeft=lower[0] === upper[0],skipRight=lower[lower.length - 1] === upper[upper.length - 1],polygon=[];for(i = upper.length - 1;i >= 0;--i) polygon.push(data[points[upper[i]][2]]);for(i = +skipLeft;i < lower.length - skipRight;++i) polygon.push(data[points[lower[i]][2]]);return polygon;}hull.x = function(_){return arguments.length?(x = _,hull):x;};hull.y = function(_){return arguments.length?(y = _,hull):y;};return hull;};function d3_geom_hullUpper(points){var n=points.length,hull=[0,1],hs=2;for(var i=2;i < n;i++) {while(hs > 1 && d3_cross2d(points[hull[hs - 2]],points[hull[hs - 1]],points[i]) <= 0) --hs;hull[hs++] = i;}return hull.slice(0,hs);}function d3_geom_hullOrder(a,b){return a[0] - b[0] || a[1] - b[1];}d3.geom.polygon = function(coordinates){d3_subclass(coordinates,d3_geom_polygonPrototype);return coordinates;};var d3_geom_polygonPrototype=d3.geom.polygon.prototype = [];d3_geom_polygonPrototype.area = function(){var i=-1,n=this.length,a,b=this[n - 1],area=0;while(++i < n) {a = b;b = this[i];area += a[1] * b[0] - a[0] * b[1];}return area * .5;};d3_geom_polygonPrototype.centroid = function(k){var i=-1,n=this.length,x=0,y=0,a,b=this[n - 1],c;if(!arguments.length)k = -1 / (6 * this.area());while(++i < n) {a = b;b = this[i];c = a[0] * b[1] - b[0] * a[1];x += (a[0] + b[0]) * c;y += (a[1] + b[1]) * c;}return [x * k,y * k];};d3_geom_polygonPrototype.clip = function(subject){var input,closed=d3_geom_polygonClosed(subject),i=-1,n=this.length - d3_geom_polygonClosed(this),j,m,a=this[n - 1],b,c,d;while(++i < n) {input = subject.slice();subject.length = 0;b = this[i];c = input[(m = input.length - closed) - 1];j = -1;while(++j < m) {d = input[j];if(d3_geom_polygonInside(d,a,b)){if(!d3_geom_polygonInside(c,a,b)){subject.push(d3_geom_polygonIntersect(c,d,a,b));}subject.push(d);}else if(d3_geom_polygonInside(c,a,b)){subject.push(d3_geom_polygonIntersect(c,d,a,b));}c = d;}if(closed)subject.push(subject[0]);a = b;}return subject;};function d3_geom_polygonInside(p,a,b){return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);}function d3_geom_polygonIntersect(c,d,a,b){var x1=c[0],x3=a[0],x21=d[0] - x1,x43=b[0] - x3,y1=c[1],y3=a[1],y21=d[1] - y1,y43=b[1] - y3,ua=(x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);return [x1 + ua * x21,y1 + ua * y21];}function d3_geom_polygonClosed(coordinates){var a=coordinates[0],b=coordinates[coordinates.length - 1];return !(a[0] - b[0] || a[1] - b[1]);}var d3_geom_voronoiEdges,d3_geom_voronoiCells,d3_geom_voronoiBeaches,d3_geom_voronoiBeachPool=[],d3_geom_voronoiFirstCircle,d3_geom_voronoiCircles,d3_geom_voronoiCirclePool=[];function d3_geom_voronoiBeach(){d3_geom_voronoiRedBlackNode(this);this.edge = this.site = this.circle = null;}function d3_geom_voronoiCreateBeach(site){var beach=d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();beach.site = site;return beach;}function d3_geom_voronoiDetachBeach(beach){d3_geom_voronoiDetachCircle(beach);d3_geom_voronoiBeaches.remove(beach);d3_geom_voronoiBeachPool.push(beach);d3_geom_voronoiRedBlackNode(beach);}function d3_geom_voronoiRemoveBeach(beach){var circle=beach.circle,x=circle.x,y=circle.cy,vertex={x:x,y:y},previous=beach.P,next=beach.N,disappearing=[beach];d3_geom_voronoiDetachBeach(beach);var lArc=previous;while(lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {previous = lArc.P;disappearing.unshift(lArc);d3_geom_voronoiDetachBeach(lArc);lArc = previous;}disappearing.unshift(lArc);d3_geom_voronoiDetachCircle(lArc);var rArc=next;while(rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {next = rArc.N;disappearing.push(rArc);d3_geom_voronoiDetachBeach(rArc);rArc = next;}disappearing.push(rArc);d3_geom_voronoiDetachCircle(rArc);var nArcs=disappearing.length,iArc;for(iArc = 1;iArc < nArcs;++iArc) {rArc = disappearing[iArc];lArc = disappearing[iArc - 1];d3_geom_voronoiSetEdgeEnd(rArc.edge,lArc.site,rArc.site,vertex);}lArc = disappearing[0];rArc = disappearing[nArcs - 1];rArc.edge = d3_geom_voronoiCreateEdge(lArc.site,rArc.site,null,vertex);d3_geom_voronoiAttachCircle(lArc);d3_geom_voronoiAttachCircle(rArc);}function d3_geom_voronoiAddBeach(site){var x=site.x,directrix=site.y,lArc,rArc,dxl,dxr,node=d3_geom_voronoiBeaches._;while(node) {dxl = d3_geom_voronoiLeftBreakPoint(node,directrix) - x;if(dxl > ε)node = node.L;else {dxr = x - d3_geom_voronoiRightBreakPoint(node,directrix);if(dxr > ε){if(!node.R){lArc = node;break;}node = node.R;}else {if(dxl > -ε){lArc = node.P;rArc = node;}else if(dxr > -ε){lArc = node;rArc = node.N;}else {lArc = rArc = node;}break;}}}var newArc=d3_geom_voronoiCreateBeach(site);d3_geom_voronoiBeaches.insert(lArc,newArc);if(!lArc && !rArc)return;if(lArc === rArc){d3_geom_voronoiDetachCircle(lArc);rArc = d3_geom_voronoiCreateBeach(lArc.site);d3_geom_voronoiBeaches.insert(newArc,rArc);newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site,newArc.site);d3_geom_voronoiAttachCircle(lArc);d3_geom_voronoiAttachCircle(rArc);return;}if(!rArc){newArc.edge = d3_geom_voronoiCreateEdge(lArc.site,newArc.site);return;}d3_geom_voronoiDetachCircle(lArc);d3_geom_voronoiDetachCircle(rArc);var lSite=lArc.site,ax=lSite.x,ay=lSite.y,bx=site.x - ax,by=site.y - ay,rSite=rArc.site,cx=rSite.x - ax,cy=rSite.y - ay,d=2 * (bx * cy - by * cx),hb=bx * bx + by * by,hc=cx * cx + cy * cy,vertex={x:(cy * hb - by * hc) / d + ax,y:(bx * hc - cx * hb) / d + ay};d3_geom_voronoiSetEdgeEnd(rArc.edge,lSite,rSite,vertex);newArc.edge = d3_geom_voronoiCreateEdge(lSite,site,null,vertex);rArc.edge = d3_geom_voronoiCreateEdge(site,rSite,null,vertex);d3_geom_voronoiAttachCircle(lArc);d3_geom_voronoiAttachCircle(rArc);}function d3_geom_voronoiLeftBreakPoint(arc,directrix){var site=arc.site,rfocx=site.x,rfocy=site.y,pby2=rfocy - directrix;if(!pby2)return rfocx;var lArc=arc.P;if(!lArc)return -Infinity;site = lArc.site;var lfocx=site.x,lfocy=site.y,plby2=lfocy - directrix;if(!plby2)return lfocx;var hl=lfocx - rfocx,aby2=1 / pby2 - 1 / plby2,b=hl / plby2;if(aby2)return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;return (rfocx + lfocx) / 2;}function d3_geom_voronoiRightBreakPoint(arc,directrix){var rArc=arc.N;if(rArc)return d3_geom_voronoiLeftBreakPoint(rArc,directrix);var site=arc.site;return site.y === directrix?site.x:Infinity;}function d3_geom_voronoiCell(site){this.site = site;this.edges = [];}d3_geom_voronoiCell.prototype.prepare = function(){var halfEdges=this.edges,iHalfEdge=halfEdges.length,edge;while(iHalfEdge--) {edge = halfEdges[iHalfEdge].edge;if(!edge.b || !edge.a)halfEdges.splice(iHalfEdge,1);}halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);return halfEdges.length;};function d3_geom_voronoiCloseCells(extent){var x0=extent[0][0],x1=extent[1][0],y0=extent[0][1],y1=extent[1][1],x2,y2,x3,y3,cells=d3_geom_voronoiCells,iCell=cells.length,cell,iHalfEdge,halfEdges,nHalfEdges,start,end;while(iCell--) {cell = cells[iCell];if(!cell || !cell.prepare())continue;halfEdges = cell.edges;nHalfEdges = halfEdges.length;iHalfEdge = 0;while(iHalfEdge < nHalfEdges) {end = halfEdges[iHalfEdge].end(),x3 = end.x,y3 = end.y;start = halfEdges[++iHalfEdge % nHalfEdges].start(),x2 = start.x,y2 = start.y;if(abs(x3 - x2) > ε || abs(y3 - y2) > ε){halfEdges.splice(iHalfEdge,0,new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site,end,abs(x3 - x0) < ε && y1 - y3 > ε?{x:x0,y:abs(x2 - x0) < ε?y2:y1}:abs(y3 - y1) < ε && x1 - x3 > ε?{x:abs(y2 - y1) < ε?x2:x1,y:y1}:abs(x3 - x1) < ε && y3 - y0 > ε?{x:x1,y:abs(x2 - x1) < ε?y2:y0}:abs(y3 - y0) < ε && x3 - x0 > ε?{x:abs(y2 - y0) < ε?x2:x0,y:y0}:null),cell.site,null));++nHalfEdges;}}}}function d3_geom_voronoiHalfEdgeOrder(a,b){return b.angle - a.angle;}function d3_geom_voronoiCircle(){d3_geom_voronoiRedBlackNode(this);this.x = this.y = this.arc = this.site = this.cy = null;}function d3_geom_voronoiAttachCircle(arc){var lArc=arc.P,rArc=arc.N;if(!lArc || !rArc)return;var lSite=lArc.site,cSite=arc.site,rSite=rArc.site;if(lSite === rSite)return;var bx=cSite.x,by=cSite.y,ax=lSite.x - bx,ay=lSite.y - by,cx=rSite.x - bx,cy=rSite.y - by;var d=2 * (ax * cy - ay * cx);if(d >= -ε2)return;var ha=ax * ax + ay * ay,hc=cx * cx + cy * cy,x=(cy * ha - ay * hc) / d,y=(ax * hc - cx * ha) / d,cy=y + by;var circle=d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();circle.arc = arc;circle.site = cSite;circle.x = x + bx;circle.y = cy + Math.sqrt(x * x + y * y);circle.cy = cy;arc.circle = circle;var before=null,node=d3_geom_voronoiCircles._;while(node) {if(circle.y < node.y || circle.y === node.y && circle.x <= node.x){if(node.L)node = node.L;else {before = node.P;break;}}else {if(node.R)node = node.R;else {before = node;break;}}}d3_geom_voronoiCircles.insert(before,circle);if(!before)d3_geom_voronoiFirstCircle = circle;}function d3_geom_voronoiDetachCircle(arc){var circle=arc.circle;if(circle){if(!circle.P)d3_geom_voronoiFirstCircle = circle.N;d3_geom_voronoiCircles.remove(circle);d3_geom_voronoiCirclePool.push(circle);d3_geom_voronoiRedBlackNode(circle);arc.circle = null;}}function d3_geom_voronoiClipEdges(extent){var edges=d3_geom_voronoiEdges,clip=d3_geom_clipLine(extent[0][0],extent[0][1],extent[1][0],extent[1][1]),i=edges.length,e;while(i--) {e = edges[i];if(!d3_geom_voronoiConnectEdge(e,extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε){e.a = e.b = null;edges.splice(i,1);}}}function d3_geom_voronoiConnectEdge(edge,extent){var vb=edge.b;if(vb)return true;var va=edge.a,x0=extent[0][0],x1=extent[1][0],y0=extent[0][1],y1=extent[1][1],lSite=edge.l,rSite=edge.r,lx=lSite.x,ly=lSite.y,rx=rSite.x,ry=rSite.y,fx=(lx + rx) / 2,fy=(ly + ry) / 2,fm,fb;if(ry === ly){if(fx < x0 || fx >= x1)return;if(lx > rx){if(!va)va = {x:fx,y:y0};else if(va.y >= y1)return;vb = {x:fx,y:y1};}else {if(!va)va = {x:fx,y:y1};else if(va.y < y0)return;vb = {x:fx,y:y0};}}else {fm = (lx - rx) / (ry - ly);fb = fy - fm * fx;if(fm < -1 || fm > 1){if(lx > rx){if(!va)va = {x:(y0 - fb) / fm,y:y0};else if(va.y >= y1)return;vb = {x:(y1 - fb) / fm,y:y1};}else {if(!va)va = {x:(y1 - fb) / fm,y:y1};else if(va.y < y0)return;vb = {x:(y0 - fb) / fm,y:y0};}}else {if(ly < ry){if(!va)va = {x:x0,y:fm * x0 + fb};else if(va.x >= x1)return;vb = {x:x1,y:fm * x1 + fb};}else {if(!va)va = {x:x1,y:fm * x1 + fb};else if(va.x < x0)return;vb = {x:x0,y:fm * x0 + fb};}}}edge.a = va;edge.b = vb;return true;}function d3_geom_voronoiEdge(lSite,rSite){this.l = lSite;this.r = rSite;this.a = this.b = null;}function d3_geom_voronoiCreateEdge(lSite,rSite,va,vb){var edge=new d3_geom_voronoiEdge(lSite,rSite);d3_geom_voronoiEdges.push(edge);if(va)d3_geom_voronoiSetEdgeEnd(edge,lSite,rSite,va);if(vb)d3_geom_voronoiSetEdgeEnd(edge,rSite,lSite,vb);d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge,lSite,rSite));d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge,rSite,lSite));return edge;}function d3_geom_voronoiCreateBorderEdge(lSite,va,vb){var edge=new d3_geom_voronoiEdge(lSite,null);edge.a = va;edge.b = vb;d3_geom_voronoiEdges.push(edge);return edge;}function d3_geom_voronoiSetEdgeEnd(edge,lSite,rSite,vertex){if(!edge.a && !edge.b){edge.a = vertex;edge.l = lSite;edge.r = rSite;}else if(edge.l === rSite){edge.b = vertex;}else {edge.a = vertex;}}function d3_geom_voronoiHalfEdge(edge,lSite,rSite){var va=edge.a,vb=edge.b;this.edge = edge;this.site = lSite;this.angle = rSite?Math.atan2(rSite.y - lSite.y,rSite.x - lSite.x):edge.l === lSite?Math.atan2(vb.x - va.x,va.y - vb.y):Math.atan2(va.x - vb.x,vb.y - va.y);}d3_geom_voronoiHalfEdge.prototype = {start:function start(){return this.edge.l === this.site?this.edge.a:this.edge.b;},end:function end(){return this.edge.l === this.site?this.edge.b:this.edge.a;}};function d3_geom_voronoiRedBlackTree(){this._ = null;}function d3_geom_voronoiRedBlackNode(node){node.U = node.C = node.L = node.R = node.P = node.N = null;}d3_geom_voronoiRedBlackTree.prototype = {insert:function insert(after,node){var parent,grandpa,uncle;if(after){node.P = after;node.N = after.N;if(after.N)after.N.P = node;after.N = node;if(after.R){after = after.R;while(after.L) after = after.L;after.L = node;}else {after.R = node;}parent = after;}else if(this._){after = d3_geom_voronoiRedBlackFirst(this._);node.P = null;node.N = after;after.P = after.L = node;parent = after;}else {node.P = node.N = null;this._ = node;parent = null;}node.L = node.R = null;node.U = parent;node.C = true;after = node;while(parent && parent.C) {grandpa = parent.U;if(parent === grandpa.L){uncle = grandpa.R;if(uncle && uncle.C){parent.C = uncle.C = false;grandpa.C = true;after = grandpa;}else {if(after === parent.R){d3_geom_voronoiRedBlackRotateLeft(this,parent);after = parent;parent = after.U;}parent.C = false;grandpa.C = true;d3_geom_voronoiRedBlackRotateRight(this,grandpa);}}else {uncle = grandpa.L;if(uncle && uncle.C){parent.C = uncle.C = false;grandpa.C = true;after = grandpa;}else {if(after === parent.L){d3_geom_voronoiRedBlackRotateRight(this,parent);after = parent;parent = after.U;}parent.C = false;grandpa.C = true;d3_geom_voronoiRedBlackRotateLeft(this,grandpa);}}parent = after.U;}this._.C = false;},remove:function remove(node){if(node.N)node.N.P = node.P;if(node.P)node.P.N = node.N;node.N = node.P = null;var parent=node.U,sibling,left=node.L,right=node.R,next,red;if(!left)next = right;else if(!right)next = left;else next = d3_geom_voronoiRedBlackFirst(right);if(parent){if(parent.L === node)parent.L = next;else parent.R = next;}else {this._ = next;}if(left && right){red = next.C;next.C = node.C;next.L = left;left.U = next;if(next !== right){parent = next.U;next.U = node.U;node = next.R;parent.L = node;next.R = right;right.U = next;}else {next.U = parent;parent = next;node = next.R;}}else {red = node.C;node = next;}if(node)node.U = parent;if(red)return;if(node && node.C){node.C = false;return;}do {if(node === this._)break;if(node === parent.L){sibling = parent.R;if(sibling.C){sibling.C = false;parent.C = true;d3_geom_voronoiRedBlackRotateLeft(this,parent);sibling = parent.R;}if(sibling.L && sibling.L.C || sibling.R && sibling.R.C){if(!sibling.R || !sibling.R.C){sibling.L.C = false;sibling.C = true;d3_geom_voronoiRedBlackRotateRight(this,sibling);sibling = parent.R;}sibling.C = parent.C;parent.C = sibling.R.C = false;d3_geom_voronoiRedBlackRotateLeft(this,parent);node = this._;break;}}else {sibling = parent.L;if(sibling.C){sibling.C = false;parent.C = true;d3_geom_voronoiRedBlackRotateRight(this,parent);sibling = parent.L;}if(sibling.L && sibling.L.C || sibling.R && sibling.R.C){if(!sibling.L || !sibling.L.C){sibling.R.C = false;sibling.C = true;d3_geom_voronoiRedBlackRotateLeft(this,sibling);sibling = parent.L;}sibling.C = parent.C;parent.C = sibling.L.C = false;d3_geom_voronoiRedBlackRotateRight(this,parent);node = this._;break;}}sibling.C = true;node = parent;parent = parent.U;}while(!node.C);if(node)node.C = false;}};function d3_geom_voronoiRedBlackRotateLeft(tree,node){var p=node,q=node.R,parent=p.U;if(parent){if(parent.L === p)parent.L = q;else parent.R = q;}else {tree._ = q;}q.U = parent;p.U = q;p.R = q.L;if(p.R)p.R.U = p;q.L = p;}function d3_geom_voronoiRedBlackRotateRight(tree,node){var p=node,q=node.L,parent=p.U;if(parent){if(parent.L === p)parent.L = q;else parent.R = q;}else {tree._ = q;}q.U = parent;p.U = q;p.L = q.R;if(p.L)p.L.U = p;q.R = p;}function d3_geom_voronoiRedBlackFirst(node){while(node.L) node = node.L;return node;}function d3_geom_voronoi(sites,bbox){var site=sites.sort(d3_geom_voronoiVertexOrder).pop(),x0,y0,circle;d3_geom_voronoiEdges = [];d3_geom_voronoiCells = new Array(sites.length);d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();while(true) {circle = d3_geom_voronoiFirstCircle;if(site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)){if(site.x !== x0 || site.y !== y0){d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);d3_geom_voronoiAddBeach(site);x0 = site.x,y0 = site.y;}site = sites.pop();}else if(circle){d3_geom_voronoiRemoveBeach(circle.arc);}else {break;}}if(bbox)d3_geom_voronoiClipEdges(bbox),d3_geom_voronoiCloseCells(bbox);var diagram={cells:d3_geom_voronoiCells,edges:d3_geom_voronoiEdges};d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;return diagram;}function d3_geom_voronoiVertexOrder(a,b){return b.y - a.y || b.x - a.x;}d3.geom.voronoi = function(points){var x=d3_geom_pointX,y=d3_geom_pointY,fx=x,fy=y,clipExtent=d3_geom_voronoiClipExtent;if(points)return voronoi(points);function voronoi(data){var polygons=new Array(data.length),x0=clipExtent[0][0],y0=clipExtent[0][1],x1=clipExtent[1][0],y1=clipExtent[1][1];d3_geom_voronoi(sites(data),clipExtent).cells.forEach(function(cell,i){var edges=cell.edges,site=cell.site,polygon=polygons[i] = edges.length?edges.map(function(e){var s=e.start();return [s.x,s.y];}):site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1?[[x0,y1],[x1,y1],[x1,y0],[x0,y0]]:[];polygon.point = data[i];});return polygons;}function sites(data){return data.map(function(d,i){return {x:Math.round(fx(d,i) / ε) * ε,y:Math.round(fy(d,i) / ε) * ε,i:i};});}voronoi.links = function(data){return d3_geom_voronoi(sites(data)).edges.filter(function(edge){return edge.l && edge.r;}).map(function(edge){return {source:data[edge.l.i],target:data[edge.r.i]};});};voronoi.triangles = function(data){var triangles=[];d3_geom_voronoi(sites(data)).cells.forEach(function(cell,i){var site=cell.site,edges=cell.edges.sort(d3_geom_voronoiHalfEdgeOrder),j=-1,m=edges.length,e0,s0,e1=edges[m - 1].edge,s1=e1.l === site?e1.r:e1.l;while(++j < m) {e0 = e1;s0 = s1;e1 = edges[j].edge;s1 = e1.l === site?e1.r:e1.l;if(i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site,s0,s1) < 0){triangles.push([data[i],data[s0.i],data[s1.i]]);}}});return triangles;};voronoi.x = function(_){return arguments.length?(fx = d3_functor(x = _),voronoi):x;};voronoi.y = function(_){return arguments.length?(fy = d3_functor(y = _),voronoi):y;};voronoi.clipExtent = function(_){if(!arguments.length)return clipExtent === d3_geom_voronoiClipExtent?null:clipExtent;clipExtent = _ == null?d3_geom_voronoiClipExtent:_;return voronoi;};voronoi.size = function(_){if(!arguments.length)return clipExtent === d3_geom_voronoiClipExtent?null:clipExtent && clipExtent[1];return voronoi.clipExtent(_ && [[0,0],_]);};return voronoi;};var d3_geom_voronoiClipExtent=[[-1e6,-1e6],[1e6,1e6]];function d3_geom_voronoiTriangleArea(a,b,c){return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);}d3.geom.delaunay = function(vertices){return d3.geom.voronoi().triangles(vertices);};d3.geom.quadtree = function(points,x1,y1,x2,y2){var x=d3_geom_pointX,y=d3_geom_pointY,compat;if(compat = arguments.length){x = d3_geom_quadtreeCompatX;y = d3_geom_quadtreeCompatY;if(compat === 3){y2 = y1;x2 = x1;y1 = x1 = 0;}return quadtree(points);}function quadtree(data){var d,fx=d3_functor(x),fy=d3_functor(y),xs,ys,i,n,x1_,y1_,x2_,y2_;if(x1 != null){x1_ = x1,y1_ = y1,x2_ = x2,y2_ = y2;}else {x2_ = y2_ = -(x1_ = y1_ = Infinity);xs = [],ys = [];n = data.length;if(compat)for(i = 0;i < n;++i) {d = data[i];if(d.x < x1_)x1_ = d.x;if(d.y < y1_)y1_ = d.y;if(d.x > x2_)x2_ = d.x;if(d.y > y2_)y2_ = d.y;xs.push(d.x);ys.push(d.y);}else for(i = 0;i < n;++i) {var x_=+fx(d = data[i],i),y_=+fy(d,i);if(x_ < x1_)x1_ = x_;if(y_ < y1_)y1_ = y_;if(x_ > x2_)x2_ = x_;if(y_ > y2_)y2_ = y_;xs.push(x_);ys.push(y_);}}var dx=x2_ - x1_,dy=y2_ - y1_;if(dx > dy)y2_ = y1_ + dx;else x2_ = x1_ + dy;function insert(n,d,x,y,x1,y1,x2,y2){if(isNaN(x) || isNaN(y))return;if(n.leaf){var nx=n.x,ny=n.y;if(nx != null){if(abs(nx - x) + abs(ny - y) < .01){insertChild(n,d,x,y,x1,y1,x2,y2);}else {var nPoint=n.point;n.x = n.y = n.point = null;insertChild(n,nPoint,nx,ny,x1,y1,x2,y2);insertChild(n,d,x,y,x1,y1,x2,y2);}}else {n.x = x,n.y = y,n.point = d;}}else {insertChild(n,d,x,y,x1,y1,x2,y2);}}function insertChild(n,d,x,y,x1,y1,x2,y2){var xm=(x1 + x2) * .5,ym=(y1 + y2) * .5,right=x >= xm,below=y >= ym,i=below << 1 | right;n.leaf = false;n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());if(right)x1 = xm;else x2 = xm;if(below)y1 = ym;else y2 = ym;insert(n,d,x,y,x1,y1,x2,y2);}var root=d3_geom_quadtreeNode();root.add = function(d){insert(root,d,+fx(d,++i),+fy(d,i),x1_,y1_,x2_,y2_);};root.visit = function(f){d3_geom_quadtreeVisit(f,root,x1_,y1_,x2_,y2_);};root.find = function(point){return d3_geom_quadtreeFind(root,point[0],point[1],x1_,y1_,x2_,y2_);};i = -1;if(x1 == null){while(++i < n) {insert(root,data[i],xs[i],ys[i],x1_,y1_,x2_,y2_);}--i;}else data.forEach(root.add);xs = ys = data = d = null;return root;}quadtree.x = function(_){return arguments.length?(x = _,quadtree):x;};quadtree.y = function(_){return arguments.length?(y = _,quadtree):y;};quadtree.extent = function(_){if(!arguments.length)return x1 == null?null:[[x1,y1],[x2,y2]];if(_ == null)x1 = y1 = x2 = y2 = null;else x1 = +_[0][0],y1 = +_[0][1],x2 = +_[1][0],y2 = +_[1][1];return quadtree;};quadtree.size = function(_){if(!arguments.length)return x1 == null?null:[x2 - x1,y2 - y1];if(_ == null)x1 = y1 = x2 = y2 = null;else x1 = y1 = 0,x2 = +_[0],y2 = +_[1];return quadtree;};return quadtree;};function d3_geom_quadtreeCompatX(d){return d.x;}function d3_geom_quadtreeCompatY(d){return d.y;}function d3_geom_quadtreeNode(){return {leaf:true,nodes:[],point:null,x:null,y:null};}function d3_geom_quadtreeVisit(f,node,x1,y1,x2,y2){if(!f(node,x1,y1,x2,y2)){var sx=(x1 + x2) * .5,sy=(y1 + y2) * .5,children=node.nodes;if(children[0])d3_geom_quadtreeVisit(f,children[0],x1,y1,sx,sy);if(children[1])d3_geom_quadtreeVisit(f,children[1],sx,y1,x2,sy);if(children[2])d3_geom_quadtreeVisit(f,children[2],x1,sy,sx,y2);if(children[3])d3_geom_quadtreeVisit(f,children[3],sx,sy,x2,y2);}}function d3_geom_quadtreeFind(root,x,y,x0,y0,x3,y3){var minDistance2=Infinity,closestPoint;(function find(node,x1,y1,x2,y2){if(x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0)return;if(point = node.point){var point,dx=x - node.x,dy=y - node.y,distance2=dx * dx + dy * dy;if(distance2 < minDistance2){var distance=Math.sqrt(minDistance2 = distance2);x0 = x - distance,y0 = y - distance;x3 = x + distance,y3 = y + distance;closestPoint = point;}}var children=node.nodes,xm=(x1 + x2) * .5,ym=(y1 + y2) * .5,right=x >= xm,below=y >= ym;for(var i=below << 1 | right,j=i + 4;i < j;++i) {if(node = children[i & 3])switch(i & 3){case 0:find(node,x1,y1,xm,ym);break;case 1:find(node,xm,y1,x2,ym);break;case 2:find(node,x1,ym,xm,y2);break;case 3:find(node,xm,ym,x2,y2);break;}}})(root,x0,y0,x3,y3);return closestPoint;}d3.interpolateRgb = d3_interpolateRgb;function d3_interpolateRgb(a,b){a = d3.rgb(a);b = d3.rgb(b);var ar=a.r,ag=a.g,ab=a.b,br=b.r - ar,bg=b.g - ag,bb=b.b - ab;return function(t){return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));};}d3.interpolateObject = d3_interpolateObject;function d3_interpolateObject(a,b){var i={},c={},k;for(k in a) {if(k in b){i[k] = d3_interpolate(a[k],b[k]);}else {c[k] = a[k];}}for(k in b) {if(!(k in a)){c[k] = b[k];}}return function(t){for(k in i) c[k] = i[k](t);return c;};}d3.interpolateNumber = d3_interpolateNumber;function d3_interpolateNumber(a,b){a = +a,b = +b;return function(t){return a * (1 - t) + b * t;};}d3.interpolateString = d3_interpolateString;function d3_interpolateString(a,b){var bi=d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0,am,bm,bs,i=-1,s=[],q=[];a = a + "",b = b + "";while((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {if((bs = bm.index) > bi){bs = b.slice(bi,bs);if(s[i])s[i] += bs;else s[++i] = bs;}if((am = am[0]) === (bm = bm[0])){if(s[i])s[i] += bm;else s[++i] = bm;}else {s[++i] = null;q.push({i:i,x:d3_interpolateNumber(am,bm)});}bi = d3_interpolate_numberB.lastIndex;}if(bi < b.length){bs = b.slice(bi);if(s[i])s[i] += bs;else s[++i] = bs;}return s.length < 2?q[0]?(b = q[0].x,function(t){return b(t) + "";}):function(){return b;}:(b = q.length,function(t){for(var i=0,o;i < b;++i) s[(o = q[i]).i] = o.x(t);return s.join("");});}var d3_interpolate_numberA=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,d3_interpolate_numberB=new RegExp(d3_interpolate_numberA.source,"g");d3.interpolate = d3_interpolate;function d3_interpolate(a,b){var i=d3.interpolators.length,f;while(--i >= 0 && !(f = d3.interpolators[i](a,b)));return f;}d3.interpolators = [function(a,b){var t=typeof b;return (t === "string"?d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b)?d3_interpolateRgb:d3_interpolateString:b instanceof d3_color?d3_interpolateRgb:Array.isArray(b)?d3_interpolateArray:t === "object" && isNaN(b)?d3_interpolateObject:d3_interpolateNumber)(a,b);}];d3.interpolateArray = d3_interpolateArray;function d3_interpolateArray(a,b){var x=[],c=[],na=a.length,nb=b.length,n0=Math.min(a.length,b.length),i;for(i = 0;i < n0;++i) x.push(d3_interpolate(a[i],b[i]));for(;i < na;++i) c[i] = a[i];for(;i < nb;++i) c[i] = b[i];return function(t){for(i = 0;i < n0;++i) c[i] = x[i](t);return c;};}var d3_ease_default=function d3_ease_default(){return d3_identity;};var d3_ease=d3.map({linear:d3_ease_default,poly:d3_ease_poly,quad:function quad(){return d3_ease_quad;},cubic:function cubic(){return d3_ease_cubic;},sin:function sin(){return d3_ease_sin;},exp:function exp(){return d3_ease_exp;},circle:function circle(){return d3_ease_circle;},elastic:d3_ease_elastic,back:d3_ease_back,bounce:function bounce(){return d3_ease_bounce;}});var d3_ease_mode=d3.map({"in":d3_identity,out:d3_ease_reverse,"in-out":d3_ease_reflect,"out-in":function outIn(f){return d3_ease_reflect(d3_ease_reverse(f));}});d3.ease = function(name){var i=name.indexOf("-"),t=i >= 0?name.slice(0,i):name,m=i >= 0?name.slice(i + 1):"in";t = d3_ease.get(t) || d3_ease_default;m = d3_ease_mode.get(m) || d3_identity;return d3_ease_clamp(m(t.apply(null,d3_arraySlice.call(arguments,1))));};function d3_ease_clamp(f){return function(t){return t <= 0?0:t >= 1?1:f(t);};}function d3_ease_reverse(f){return function(t){return 1 - f(1 - t);};}function d3_ease_reflect(f){return function(t){return .5 * (t < .5?f(2 * t):2 - f(2 - 2 * t));};}function d3_ease_quad(t){return t * t;}function d3_ease_cubic(t){return t * t * t;}function d3_ease_cubicInOut(t){if(t <= 0)return 0;if(t >= 1)return 1;var t2=t * t,t3=t2 * t;return 4 * (t < .5?t3:3 * (t - t2) + t3 - .75);}function d3_ease_poly(e){return function(t){return Math.pow(t,e);};}function d3_ease_sin(t){return 1 - Math.cos(t * halfπ);}function d3_ease_exp(t){return Math.pow(2,10 * (t - 1));}function d3_ease_circle(t){return 1 - Math.sqrt(1 - t * t);}function d3_ease_elastic(a,p){var s;if(arguments.length < 2)p = .45;if(arguments.length)s = p / τ * Math.asin(1 / a);else a = 1,s = p / 4;return function(t){return 1 + a * Math.pow(2,-10 * t) * Math.sin((t - s) * τ / p);};}function d3_ease_back(s){if(!s)s = 1.70158;return function(t){return t * t * ((s + 1) * t - s);};}function d3_ease_bounce(t){return t < 1 / 2.75?7.5625 * t * t:t < 2 / 2.75?7.5625 * (t -= 1.5 / 2.75) * t + .75:t < 2.5 / 2.75?7.5625 * (t -= 2.25 / 2.75) * t + .9375:7.5625 * (t -= 2.625 / 2.75) * t + .984375;}d3.interpolateHcl = d3_interpolateHcl;function d3_interpolateHcl(a,b){a = d3.hcl(a);b = d3.hcl(b);var ah=a.h,ac=a.c,al=a.l,bh=b.h - ah,bc=b.c - ac,bl=b.l - al;if(isNaN(bc))bc = 0,ac = isNaN(ac)?b.c:ac;if(isNaN(bh))bh = 0,ah = isNaN(ah)?b.h:ah;else if(bh > 180)bh -= 360;else if(bh < -180)bh += 360;return function(t){return d3_hcl_lab(ah + bh * t,ac + bc * t,al + bl * t) + "";};}d3.interpolateHsl = d3_interpolateHsl;function d3_interpolateHsl(a,b){a = d3.hsl(a);b = d3.hsl(b);var ah=a.h,as=a.s,al=a.l,bh=b.h - ah,bs=b.s - as,bl=b.l - al;if(isNaN(bs))bs = 0,as = isNaN(as)?b.s:as;if(isNaN(bh))bh = 0,ah = isNaN(ah)?b.h:ah;else if(bh > 180)bh -= 360;else if(bh < -180)bh += 360;return function(t){return d3_hsl_rgb(ah + bh * t,as + bs * t,al + bl * t) + "";};}d3.interpolateLab = d3_interpolateLab;function d3_interpolateLab(a,b){a = d3.lab(a);b = d3.lab(b);var al=a.l,aa=a.a,ab=a.b,bl=b.l - al,ba=b.a - aa,bb=b.b - ab;return function(t){return d3_lab_rgb(al + bl * t,aa + ba * t,ab + bb * t) + "";};}d3.interpolateRound = d3_interpolateRound;function d3_interpolateRound(a,b){b -= a;return function(t){return Math.round(a + b * t);};}d3.transform = function(string){var g=d3_document.createElementNS(d3.ns.prefix.svg,"g");return (d3.transform = function(string){if(string != null){g.setAttribute("transform",string);var t=g.transform.baseVal.consolidate();}return new d3_transform(t?t.matrix:d3_transformIdentity);})(string);};function d3_transform(m){var r0=[m.a,m.b],r1=[m.c,m.d],kx=d3_transformNormalize(r0),kz=d3_transformDot(r0,r1),ky=d3_transformNormalize(d3_transformCombine(r1,r0,-kz)) || 0;if(r0[0] * r1[1] < r1[0] * r0[1]){r0[0] *= -1;r0[1] *= -1;kx *= -1;kz *= -1;}this.rotate = (kx?Math.atan2(r0[1],r0[0]):Math.atan2(-r1[0],r1[1])) * d3_degrees;this.translate = [m.e,m.f];this.scale = [kx,ky];this.skew = ky?Math.atan2(kz,ky) * d3_degrees:0;}d3_transform.prototype.toString = function(){return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";};function d3_transformDot(a,b){return a[0] * b[0] + a[1] * b[1];}function d3_transformNormalize(a){var k=Math.sqrt(d3_transformDot(a,a));if(k){a[0] /= k;a[1] /= k;}return k;}function d3_transformCombine(a,b,k){a[0] += k * b[0];a[1] += k * b[1];return a;}var d3_transformIdentity={a:1,b:0,c:0,d:1,e:0,f:0};d3.interpolateTransform = d3_interpolateTransform;function d3_interpolateTransformPop(s){return s.length?s.pop() + ",":"";}function d3_interpolateTranslate(ta,tb,s,q){if(ta[0] !== tb[0] || ta[1] !== tb[1]){var i=s.push("translate(",null,",",null,")");q.push({i:i - 4,x:d3_interpolateNumber(ta[0],tb[0])},{i:i - 2,x:d3_interpolateNumber(ta[1],tb[1])});}else if(tb[0] || tb[1]){s.push("translate(" + tb + ")");}}function d3_interpolateRotate(ra,rb,s,q){if(ra !== rb){if(ra - rb > 180)rb += 360;else if(rb - ra > 180)ra += 360;q.push({i:s.push(d3_interpolateTransformPop(s) + "rotate(",null,")") - 2,x:d3_interpolateNumber(ra,rb)});}else if(rb){s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");}}function d3_interpolateSkew(wa,wb,s,q){if(wa !== wb){q.push({i:s.push(d3_interpolateTransformPop(s) + "skewX(",null,")") - 2,x:d3_interpolateNumber(wa,wb)});}else if(wb){s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");}}function d3_interpolateScale(ka,kb,s,q){if(ka[0] !== kb[0] || ka[1] !== kb[1]){var i=s.push(d3_interpolateTransformPop(s) + "scale(",null,",",null,")");q.push({i:i - 4,x:d3_interpolateNumber(ka[0],kb[0])},{i:i - 2,x:d3_interpolateNumber(ka[1],kb[1])});}else if(kb[0] !== 1 || kb[1] !== 1){s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");}}function d3_interpolateTransform(a,b){var s=[],q=[];a = d3.transform(a),b = d3.transform(b);d3_interpolateTranslate(a.translate,b.translate,s,q);d3_interpolateRotate(a.rotate,b.rotate,s,q);d3_interpolateSkew(a.skew,b.skew,s,q);d3_interpolateScale(a.scale,b.scale,s,q);a = b = null;return function(t){var i=-1,n=q.length,o;while(++i < n) s[(o = q[i]).i] = o.x(t);return s.join("");};}function d3_uninterpolateNumber(a,b){b = (b -= a = +a) || 1 / b;return function(x){return (x - a) / b;};}function d3_uninterpolateClamp(a,b){b = (b -= a = +a) || 1 / b;return function(x){return Math.max(0,Math.min(1,(x - a) / b));};}d3.layout = {};d3.layout.bundle = function(){return function(links){var paths=[],i=-1,n=links.length;while(++i < n) paths.push(d3_layout_bundlePath(links[i]));return paths;};};function d3_layout_bundlePath(link){var start=link.source,end=link.target,lca=d3_layout_bundleLeastCommonAncestor(start,end),points=[start];while(start !== lca) {start = start.parent;points.push(start);}var k=points.length;while(end !== lca) {points.splice(k,0,end);end = end.parent;}return points;}function d3_layout_bundleAncestors(node){var ancestors=[],parent=node.parent;while(parent != null) {ancestors.push(node);node = parent;parent = parent.parent;}ancestors.push(node);return ancestors;}function d3_layout_bundleLeastCommonAncestor(a,b){if(a === b)return a;var aNodes=d3_layout_bundleAncestors(a),bNodes=d3_layout_bundleAncestors(b),aNode=aNodes.pop(),bNode=bNodes.pop(),sharedNode=null;while(aNode === bNode) {sharedNode = aNode;aNode = aNodes.pop();bNode = bNodes.pop();}return sharedNode;}d3.layout.chord = function(){var chord={},chords,groups,matrix,n,padding=0,sortGroups,sortSubgroups,sortChords;function relayout(){var subgroups={},groupSums=[],groupIndex=d3.range(n),subgroupIndex=[],k,x,x0,i,j;chords = [];groups = [];k = 0,i = -1;while(++i < n) {x = 0,j = -1;while(++j < n) {x += matrix[i][j];}groupSums.push(x);subgroupIndex.push(d3.range(n));k += x;}if(sortGroups){groupIndex.sort(function(a,b){return sortGroups(groupSums[a],groupSums[b]);});}if(sortSubgroups){subgroupIndex.forEach(function(d,i){d.sort(function(a,b){return sortSubgroups(matrix[i][a],matrix[i][b]);});});}k = (τ - padding * n) / k;x = 0,i = -1;while(++i < n) {x0 = x,j = -1;while(++j < n) {var di=groupIndex[i],dj=subgroupIndex[di][j],v=matrix[di][dj],a0=x,a1=x += v * k;subgroups[di + "-" + dj] = {index:di,subindex:dj,startAngle:a0,endAngle:a1,value:v};}groups[di] = {index:di,startAngle:x0,endAngle:x,value:(x - x0) / k};x += padding;}i = -1;while(++i < n) {j = i - 1;while(++j < n) {var source=subgroups[i + "-" + j],target=subgroups[j + "-" + i];if(source.value || target.value){chords.push(source.value < target.value?{source:target,target:source}:{source:source,target:target});}}}if(sortChords)resort();}function resort(){chords.sort(function(a,b){return sortChords((a.source.value + a.target.value) / 2,(b.source.value + b.target.value) / 2);});}chord.matrix = function(x){if(!arguments.length)return matrix;n = (matrix = x) && matrix.length;chords = groups = null;return chord;};chord.padding = function(x){if(!arguments.length)return padding;padding = x;chords = groups = null;return chord;};chord.sortGroups = function(x){if(!arguments.length)return sortGroups;sortGroups = x;chords = groups = null;return chord;};chord.sortSubgroups = function(x){if(!arguments.length)return sortSubgroups;sortSubgroups = x;chords = null;return chord;};chord.sortChords = function(x){if(!arguments.length)return sortChords;sortChords = x;if(chords)resort();return chord;};chord.chords = function(){if(!chords)relayout();return chords;};chord.groups = function(){if(!groups)relayout();return groups;};return chord;};d3.layout.force = function(){var force={},event=d3.dispatch("start","tick","end"),timer,size=[1,1],drag,alpha,friction=.9,linkDistance=d3_layout_forceLinkDistance,linkStrength=d3_layout_forceLinkStrength,charge=-30,chargeDistance2=d3_layout_forceChargeDistance2,gravity=.1,theta2=.64,nodes=[],links=[],distances,strengths,charges;function repulse(node){return function(quad,x1,_,x2){if(quad.point !== node){var dx=quad.cx - node.x,dy=quad.cy - node.y,dw=x2 - x1,dn=dx * dx + dy * dy;if(dw * dw / theta2 < dn){if(dn < chargeDistance2){var k=quad.charge / dn;node.px -= dx * k;node.py -= dy * k;}return true;}if(quad.point && dn && dn < chargeDistance2){var k=quad.pointCharge / dn;node.px -= dx * k;node.py -= dy * k;}}return !quad.charge;};}force.tick = function(){if((alpha *= .99) < .005){timer = null;event.end({type:"end",alpha:alpha = 0});return true;}var n=nodes.length,m=links.length,q,i,o,s,t,l,k,x,y;for(i = 0;i < m;++i) {o = links[i];s = o.source;t = o.target;x = t.x - s.x;y = t.y - s.y;if(l = x * x + y * y){l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;x *= l;y *= l;t.x -= x * (k = s.weight + t.weight?s.weight / (s.weight + t.weight):.5);t.y -= y * k;s.x += x * (k = 1 - k);s.y += y * k;}}if(k = alpha * gravity){x = size[0] / 2;y = size[1] / 2;i = -1;if(k)while(++i < n) {o = nodes[i];o.x += (x - o.x) * k;o.y += (y - o.y) * k;}}if(charge){d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes),alpha,charges);i = -1;while(++i < n) {if(!(o = nodes[i]).fixed){q.visit(repulse(o));}}}i = -1;while(++i < n) {o = nodes[i];if(o.fixed){o.x = o.px;o.y = o.py;}else {o.x -= (o.px - (o.px = o.x)) * friction;o.y -= (o.py - (o.py = o.y)) * friction;}}event.tick({type:"tick",alpha:alpha});};force.nodes = function(x){if(!arguments.length)return nodes;nodes = x;return force;};force.links = function(x){if(!arguments.length)return links;links = x;return force;};force.size = function(x){if(!arguments.length)return size;size = x;return force;};force.linkDistance = function(x){if(!arguments.length)return linkDistance;linkDistance = typeof x === "function"?x:+x;return force;};force.distance = force.linkDistance;force.linkStrength = function(x){if(!arguments.length)return linkStrength;linkStrength = typeof x === "function"?x:+x;return force;};force.friction = function(x){if(!arguments.length)return friction;friction = +x;return force;};force.charge = function(x){if(!arguments.length)return charge;charge = typeof x === "function"?x:+x;return force;};force.chargeDistance = function(x){if(!arguments.length)return Math.sqrt(chargeDistance2);chargeDistance2 = x * x;return force;};force.gravity = function(x){if(!arguments.length)return gravity;gravity = +x;return force;};force.theta = function(x){if(!arguments.length)return Math.sqrt(theta2);theta2 = x * x;return force;};force.alpha = function(x){if(!arguments.length)return alpha;x = +x;if(alpha){if(x > 0){alpha = x;}else {timer.c = null,timer.t = NaN,timer = null;event.start({type:"end",alpha:alpha = 0});}}else if(x > 0){event.start({type:"start",alpha:alpha = x});timer = d3_timer(force.tick);}return force;};force.start = function(){var i,n=nodes.length,m=links.length,w=size[0],h=size[1],neighbors,o;for(i = 0;i < n;++i) {(o = nodes[i]).index = i;o.weight = 0;}for(i = 0;i < m;++i) {o = links[i];if(typeof o.source == "number")o.source = nodes[o.source];if(typeof o.target == "number")o.target = nodes[o.target];++o.source.weight;++o.target.weight;}for(i = 0;i < n;++i) {o = nodes[i];if(isNaN(o.x))o.x = position("x",w);if(isNaN(o.y))o.y = position("y",h);if(isNaN(o.px))o.px = o.x;if(isNaN(o.py))o.py = o.y;}distances = [];if(typeof linkDistance === "function")for(i = 0;i < m;++i) distances[i] = +linkDistance.call(this,links[i],i);else for(i = 0;i < m;++i) distances[i] = linkDistance;strengths = [];if(typeof linkStrength === "function")for(i = 0;i < m;++i) strengths[i] = +linkStrength.call(this,links[i],i);else for(i = 0;i < m;++i) strengths[i] = linkStrength;charges = [];if(typeof charge === "function")for(i = 0;i < n;++i) charges[i] = +charge.call(this,nodes[i],i);else for(i = 0;i < n;++i) charges[i] = charge;function position(dimension,size){if(!neighbors){neighbors = new Array(n);for(j = 0;j < n;++j) {neighbors[j] = [];}for(j = 0;j < m;++j) {var o=links[j];neighbors[o.source.index].push(o.target);neighbors[o.target.index].push(o.source);}}var candidates=neighbors[i],j=-1,l=candidates.length,x;while(++j < l) if(!isNaN(x = candidates[j][dimension]))return x;return Math.random() * size;}return force.resume();};force.resume = function(){return force.alpha(.1);};force.stop = function(){return force.alpha(0);};force.drag = function(){if(!drag)drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force",d3_layout_forceDragstart).on("drag.force",dragmove).on("dragend.force",d3_layout_forceDragend);if(!arguments.length)return drag;this.on("mouseover.force",d3_layout_forceMouseover).on("mouseout.force",d3_layout_forceMouseout).call(drag);};function dragmove(d){d.px = d3.event.x,d.py = d3.event.y;force.resume();}return d3.rebind(force,event,"on");};function d3_layout_forceDragstart(d){d.fixed |= 2;}function d3_layout_forceDragend(d){d.fixed &= ~6;}function d3_layout_forceMouseover(d){d.fixed |= 4;d.px = d.x,d.py = d.y;}function d3_layout_forceMouseout(d){d.fixed &= ~4;}function d3_layout_forceAccumulate(quad,alpha,charges){var cx=0,cy=0;quad.charge = 0;if(!quad.leaf){var nodes=quad.nodes,n=nodes.length,i=-1,c;while(++i < n) {c = nodes[i];if(c == null)continue;d3_layout_forceAccumulate(c,alpha,charges);quad.charge += c.charge;cx += c.charge * c.cx;cy += c.charge * c.cy;}}if(quad.point){if(!quad.leaf){quad.point.x += Math.random() - .5;quad.point.y += Math.random() - .5;}var k=alpha * charges[quad.point.index];quad.charge += quad.pointCharge = k;cx += k * quad.point.x;cy += k * quad.point.y;}quad.cx = cx / quad.charge;quad.cy = cy / quad.charge;}var d3_layout_forceLinkDistance=20,d3_layout_forceLinkStrength=1,d3_layout_forceChargeDistance2=Infinity;d3.layout.hierarchy = function(){var sort=d3_layout_hierarchySort,children=d3_layout_hierarchyChildren,value=d3_layout_hierarchyValue;function hierarchy(root){var stack=[root],nodes=[],node;root.depth = 0;while((node = stack.pop()) != null) {nodes.push(node);if((childs = children.call(hierarchy,node,node.depth)) && (n = childs.length)){var n,childs,child;while(--n >= 0) {stack.push(child = childs[n]);child.parent = node;child.depth = node.depth + 1;}if(value)node.value = 0;node.children = childs;}else {if(value)node.value = +value.call(hierarchy,node,node.depth) || 0;delete node.children;}}d3_layout_hierarchyVisitAfter(root,function(node){var childs,parent;if(sort && (childs = node.children))childs.sort(sort);if(value && (parent = node.parent))parent.value += node.value;});return nodes;}hierarchy.sort = function(x){if(!arguments.length)return sort;sort = x;return hierarchy;};hierarchy.children = function(x){if(!arguments.length)return children;children = x;return hierarchy;};hierarchy.value = function(x){if(!arguments.length)return value;value = x;return hierarchy;};hierarchy.revalue = function(root){if(value){d3_layout_hierarchyVisitBefore(root,function(node){if(node.children)node.value = 0;});d3_layout_hierarchyVisitAfter(root,function(node){var parent;if(!node.children)node.value = +value.call(hierarchy,node,node.depth) || 0;if(parent = node.parent)parent.value += node.value;});}return root;};return hierarchy;};function d3_layout_hierarchyRebind(object,hierarchy){d3.rebind(object,hierarchy,"sort","children","value");object.nodes = object;object.links = d3_layout_hierarchyLinks;return object;}function d3_layout_hierarchyVisitBefore(node,callback){var nodes=[node];while((node = nodes.pop()) != null) {callback(node);if((children = node.children) && (n = children.length)){var n,children;while(--n >= 0) nodes.push(children[n]);}}}function d3_layout_hierarchyVisitAfter(node,callback){var nodes=[node],nodes2=[];while((node = nodes.pop()) != null) {nodes2.push(node);if((children = node.children) && (n = children.length)){var i=-1,n,children;while(++i < n) nodes.push(children[i]);}}while((node = nodes2.pop()) != null) {callback(node);}}function d3_layout_hierarchyChildren(d){return d.children;}function d3_layout_hierarchyValue(d){return d.value;}function d3_layout_hierarchySort(a,b){return b.value - a.value;}function d3_layout_hierarchyLinks(nodes){return d3.merge(nodes.map(function(parent){return (parent.children || []).map(function(child){return {source:parent,target:child};});}));}d3.layout.partition = function(){var hierarchy=d3.layout.hierarchy(),size=[1,1];function position(node,x,dx,dy){var children=node.children;node.x = x;node.y = node.depth * dy;node.dx = dx;node.dy = dy;if(children && (n = children.length)){var i=-1,n,c,d;dx = node.value?dx / node.value:0;while(++i < n) {position(c = children[i],x,d = c.value * dx,dy);x += d;}}}function depth(node){var children=node.children,d=0;if(children && (n = children.length)){var i=-1,n;while(++i < n) d = Math.max(d,depth(children[i]));}return 1 + d;}function partition(d,i){var nodes=hierarchy.call(this,d,i);position(nodes[0],0,size[0],size[1] / depth(nodes[0]));return nodes;}partition.size = function(x){if(!arguments.length)return size;size = x;return partition;};return d3_layout_hierarchyRebind(partition,hierarchy);};d3.layout.pie = function(){var value=Number,sort=d3_layout_pieSortByValue,startAngle=0,endAngle=τ,padAngle=0;function pie(data){var n=data.length,values=data.map(function(d,i){return +value.call(pie,d,i);}),a=+(typeof startAngle === "function"?startAngle.apply(this,arguments):startAngle),da=(typeof endAngle === "function"?endAngle.apply(this,arguments):endAngle) - a,p=Math.min(Math.abs(da) / n,+(typeof padAngle === "function"?padAngle.apply(this,arguments):padAngle)),pa=p * (da < 0?-1:1),sum=d3.sum(values),k=sum?(da - n * pa) / sum:0,index=d3.range(n),arcs=[],v;if(sort != null)index.sort(sort === d3_layout_pieSortByValue?function(i,j){return values[j] - values[i];}:function(i,j){return sort(data[i],data[j]);});index.forEach(function(i){arcs[i] = {data:data[i],value:v = values[i],startAngle:a,endAngle:a += v * k + pa,padAngle:p};});return arcs;}pie.value = function(_){if(!arguments.length)return value;value = _;return pie;};pie.sort = function(_){if(!arguments.length)return sort;sort = _;return pie;};pie.startAngle = function(_){if(!arguments.length)return startAngle;startAngle = _;return pie;};pie.endAngle = function(_){if(!arguments.length)return endAngle;endAngle = _;return pie;};pie.padAngle = function(_){if(!arguments.length)return padAngle;padAngle = _;return pie;};return pie;};var d3_layout_pieSortByValue={};d3.layout.stack = function(){var values=d3_identity,order=d3_layout_stackOrderDefault,offset=d3_layout_stackOffsetZero,out=d3_layout_stackOut,x=d3_layout_stackX,y=d3_layout_stackY;function stack(data,index){if(!(n = data.length))return data;var series=data.map(function(d,i){return values.call(stack,d,i);});var points=series.map(function(d){return d.map(function(v,i){return [x.call(stack,v,i),y.call(stack,v,i)];});});var orders=order.call(stack,points,index);series = d3.permute(series,orders);points = d3.permute(points,orders);var offsets=offset.call(stack,points,index);var m=series[0].length,n,i,j,o;for(j = 0;j < m;++j) {out.call(stack,series[0][j],o = offsets[j],points[0][j][1]);for(i = 1;i < n;++i) {out.call(stack,series[i][j],o += points[i - 1][j][1],points[i][j][1]);}}return data;}stack.values = function(x){if(!arguments.length)return values;values = x;return stack;};stack.order = function(x){if(!arguments.length)return order;order = typeof x === "function"?x:d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;return stack;};stack.offset = function(x){if(!arguments.length)return offset;offset = typeof x === "function"?x:d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;return stack;};stack.x = function(z){if(!arguments.length)return x;x = z;return stack;};stack.y = function(z){if(!arguments.length)return y;y = z;return stack;};stack.out = function(z){if(!arguments.length)return out;out = z;return stack;};return stack;};function d3_layout_stackX(d){return d.x;}function d3_layout_stackY(d){return d.y;}function d3_layout_stackOut(d,y0,y){d.y0 = y0;d.y = y;}var d3_layout_stackOrders=d3.map({"inside-out":function insideOut(data){var n=data.length,i,j,max=data.map(d3_layout_stackMaxIndex),sums=data.map(d3_layout_stackReduceSum),index=d3.range(n).sort(function(a,b){return max[a] - max[b];}),top=0,bottom=0,tops=[],bottoms=[];for(i = 0;i < n;++i) {j = index[i];if(top < bottom){top += sums[j];tops.push(j);}else {bottom += sums[j];bottoms.push(j);}}return bottoms.reverse().concat(tops);},reverse:function reverse(data){return d3.range(data.length).reverse();},"default":d3_layout_stackOrderDefault});var d3_layout_stackOffsets=d3.map({silhouette:function silhouette(data){var n=data.length,m=data[0].length,sums=[],max=0,i,j,o,y0=[];for(j = 0;j < m;++j) {for(i = 0,o = 0;i < n;i++) o += data[i][j][1];if(o > max)max = o;sums.push(o);}for(j = 0;j < m;++j) {y0[j] = (max - sums[j]) / 2;}return y0;},wiggle:function wiggle(data){var n=data.length,x=data[0],m=x.length,i,j,k,s1,s2,s3,dx,o,o0,y0=[];y0[0] = o = o0 = 0;for(j = 1;j < m;++j) {for(i = 0,s1 = 0;i < n;++i) s1 += data[i][j][1];for(i = 0,s2 = 0,dx = x[j][0] - x[j - 1][0];i < n;++i) {for(k = 0,s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx);k < i;++k) {s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;}s2 += s3 * data[i][j][1];}y0[j] = o -= s1?s2 / s1 * dx:0;if(o < o0)o0 = o;}for(j = 0;j < m;++j) y0[j] -= o0;return y0;},expand:function expand(data){var n=data.length,m=data[0].length,k=1 / n,i,j,o,y0=[];for(j = 0;j < m;++j) {for(i = 0,o = 0;i < n;i++) o += data[i][j][1];if(o)for(i = 0;i < n;i++) data[i][j][1] /= o;else for(i = 0;i < n;i++) data[i][j][1] = k;}for(j = 0;j < m;++j) y0[j] = 0;return y0;},zero:d3_layout_stackOffsetZero});function d3_layout_stackOrderDefault(data){return d3.range(data.length);}function d3_layout_stackOffsetZero(data){var j=-1,m=data[0].length,y0=[];while(++j < m) y0[j] = 0;return y0;}function d3_layout_stackMaxIndex(array){var i=1,j=0,v=array[0][1],k,n=array.length;for(;i < n;++i) {if((k = array[i][1]) > v){j = i;v = k;}}return j;}function d3_layout_stackReduceSum(d){return d.reduce(d3_layout_stackSum,0);}function d3_layout_stackSum(p,d){return p + d[1];}d3.layout.histogram = function(){var frequency=true,valuer=Number,ranger=d3_layout_histogramRange,binner=d3_layout_histogramBinSturges;function histogram(data,i){var bins=[],values=data.map(valuer,this),range=ranger.call(this,values,i),thresholds=binner.call(this,range,values,i),bin,i=-1,n=values.length,m=thresholds.length - 1,k=frequency?1:1 / n,x;while(++i < m) {bin = bins[i] = [];bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);bin.y = 0;}if(m > 0){i = -1;while(++i < n) {x = values[i];if(x >= range[0] && x <= range[1]){bin = bins[d3.bisect(thresholds,x,1,m) - 1];bin.y += k;bin.push(data[i]);}}}return bins;}histogram.value = function(x){if(!arguments.length)return valuer;valuer = x;return histogram;};histogram.range = function(x){if(!arguments.length)return ranger;ranger = d3_functor(x);return histogram;};histogram.bins = function(x){if(!arguments.length)return binner;binner = typeof x === "number"?function(range){return d3_layout_histogramBinFixed(range,x);}:d3_functor(x);return histogram;};histogram.frequency = function(x){if(!arguments.length)return frequency;frequency = !!x;return histogram;};return histogram;};function d3_layout_histogramBinSturges(range,values){return d3_layout_histogramBinFixed(range,Math.ceil(Math.log(values.length) / Math.LN2 + 1));}function d3_layout_histogramBinFixed(range,n){var x=-1,b=+range[0],m=(range[1] - b) / n,f=[];while(++x <= n) f[x] = m * x + b;return f;}function d3_layout_histogramRange(values){return [d3.min(values),d3.max(values)];}d3.layout.pack = function(){var hierarchy=d3.layout.hierarchy().sort(d3_layout_packSort),padding=0,size=[1,1],radius;function pack(d,i){var nodes=hierarchy.call(this,d,i),root=nodes[0],w=size[0],h=size[1],r=radius == null?Math.sqrt:typeof radius === "function"?radius:function(){return radius;};root.x = root.y = 0;d3_layout_hierarchyVisitAfter(root,function(d){d.r = +r(d.value);});d3_layout_hierarchyVisitAfter(root,d3_layout_packSiblings);if(padding){var dr=padding * (radius?1:Math.max(2 * root.r / w,2 * root.r / h)) / 2;d3_layout_hierarchyVisitAfter(root,function(d){d.r += dr;});d3_layout_hierarchyVisitAfter(root,d3_layout_packSiblings);d3_layout_hierarchyVisitAfter(root,function(d){d.r -= dr;});}d3_layout_packTransform(root,w / 2,h / 2,radius?1:1 / Math.max(2 * root.r / w,2 * root.r / h));return nodes;}pack.size = function(_){if(!arguments.length)return size;size = _;return pack;};pack.radius = function(_){if(!arguments.length)return radius;radius = _ == null || typeof _ === "function"?_:+_;return pack;};pack.padding = function(_){if(!arguments.length)return padding;padding = +_;return pack;};return d3_layout_hierarchyRebind(pack,hierarchy);};function d3_layout_packSort(a,b){return a.value - b.value;}function d3_layout_packInsert(a,b){var c=a._pack_next;a._pack_next = b;b._pack_prev = a;b._pack_next = c;c._pack_prev = b;}function d3_layout_packSplice(a,b){a._pack_next = b;b._pack_prev = a;}function d3_layout_packIntersects(a,b){var dx=b.x - a.x,dy=b.y - a.y,dr=a.r + b.r;return .999 * dr * dr > dx * dx + dy * dy;}function d3_layout_packSiblings(node){if(!(nodes = node.children) || !(n = nodes.length))return;var nodes,xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity,a,b,c,i,j,k,n;function bound(node){xMin = Math.min(node.x - node.r,xMin);xMax = Math.max(node.x + node.r,xMax);yMin = Math.min(node.y - node.r,yMin);yMax = Math.max(node.y + node.r,yMax);}nodes.forEach(d3_layout_packLink);a = nodes[0];a.x = -a.r;a.y = 0;bound(a);if(n > 1){b = nodes[1];b.x = b.r;b.y = 0;bound(b);if(n > 2){c = nodes[2];d3_layout_packPlace(a,b,c);bound(c);d3_layout_packInsert(a,c);a._pack_prev = c;d3_layout_packInsert(c,b);b = a._pack_next;for(i = 3;i < n;i++) {d3_layout_packPlace(a,b,c = nodes[i]);var isect=0,s1=1,s2=1;for(j = b._pack_next;j !== b;j = j._pack_next,s1++) {if(d3_layout_packIntersects(j,c)){isect = 1;break;}}if(isect == 1){for(k = a._pack_prev;k !== j._pack_prev;k = k._pack_prev,s2++) {if(d3_layout_packIntersects(k,c)){break;}}}if(isect){if(s1 < s2 || s1 == s2 && b.r < a.r)d3_layout_packSplice(a,b = j);else d3_layout_packSplice(a = k,b);i--;}else {d3_layout_packInsert(a,c);b = c;bound(c);}}}}var cx=(xMin + xMax) / 2,cy=(yMin + yMax) / 2,cr=0;for(i = 0;i < n;i++) {c = nodes[i];c.x -= cx;c.y -= cy;cr = Math.max(cr,c.r + Math.sqrt(c.x * c.x + c.y * c.y));}node.r = cr;nodes.forEach(d3_layout_packUnlink);}function d3_layout_packLink(node){node._pack_next = node._pack_prev = node;}function d3_layout_packUnlink(node){delete node._pack_next;delete node._pack_prev;}function d3_layout_packTransform(node,x,y,k){var children=node.children;node.x = x += k * node.x;node.y = y += k * node.y;node.r *= k;if(children){var i=-1,n=children.length;while(++i < n) d3_layout_packTransform(children[i],x,y,k);}}function d3_layout_packPlace(a,b,c){var db=a.r + c.r,dx=b.x - a.x,dy=b.y - a.y;if(db && (dx || dy)){var da=b.r + c.r,dc=dx * dx + dy * dy;da *= da;db *= db;var x=.5 + (db - da) / (2 * dc),y=Math.sqrt(Math.max(0,2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);c.x = a.x + x * dx + y * dy;c.y = a.y + x * dy - y * dx;}else {c.x = a.x + db;c.y = a.y;}}d3.layout.tree = function(){var hierarchy=d3.layout.hierarchy().sort(null).value(null),separation=d3_layout_treeSeparation,size=[1,1],nodeSize=null;function tree(d,i){var nodes=hierarchy.call(this,d,i),root0=nodes[0],root1=wrapTree(root0);d3_layout_hierarchyVisitAfter(root1,firstWalk),root1.parent.m = -root1.z;d3_layout_hierarchyVisitBefore(root1,secondWalk);if(nodeSize)d3_layout_hierarchyVisitBefore(root0,sizeNode);else {var left=root0,right=root0,bottom=root0;d3_layout_hierarchyVisitBefore(root0,function(node){if(node.x < left.x)left = node;if(node.x > right.x)right = node;if(node.depth > bottom.depth)bottom = node;});var tx=separation(left,right) / 2 - left.x,kx=size[0] / (right.x + separation(right,left) / 2 + tx),ky=size[1] / (bottom.depth || 1);d3_layout_hierarchyVisitBefore(root0,function(node){node.x = (node.x + tx) * kx;node.y = node.depth * ky;});}return nodes;}function wrapTree(root0){var root1={A:null,children:[root0]},queue=[root1],node1;while((node1 = queue.pop()) != null) {for(var children=node1.children,child,i=0,n=children.length;i < n;++i) {queue.push((children[i] = child = {_:children[i],parent:node1,children:(child = children[i].children) && child.slice() || [],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:i}).a = child);}}return root1.children[0];}function firstWalk(v){var children=v.children,siblings=v.parent.children,w=v.i?siblings[v.i - 1]:null;if(children.length){d3_layout_treeShift(v);var midpoint=(children[0].z + children[children.length - 1].z) / 2;if(w){v.z = w.z + separation(v._,w._);v.m = v.z - midpoint;}else {v.z = midpoint;}}else if(w){v.z = w.z + separation(v._,w._);}v.parent.A = apportion(v,w,v.parent.A || siblings[0]);}function secondWalk(v){v._.x = v.z + v.parent.m;v.m += v.parent.m;}function apportion(v,w,ancestor){if(w){var vip=v,vop=v,vim=w,vom=vip.parent.children[0],sip=vip.m,sop=vop.m,sim=vim.m,som=vom.m,shift;while((vim = d3_layout_treeRight(vim),vip = d3_layout_treeLeft(vip),vim && vip)) {vom = d3_layout_treeLeft(vom);vop = d3_layout_treeRight(vop);vop.a = v;shift = vim.z + sim - vip.z - sip + separation(vim._,vip._);if(shift > 0){d3_layout_treeMove(d3_layout_treeAncestor(vim,v,ancestor),v,shift);sip += shift;sop += shift;}sim += vim.m;sip += vip.m;som += vom.m;sop += vop.m;}if(vim && !d3_layout_treeRight(vop)){vop.t = vim;vop.m += sim - sop;}if(vip && !d3_layout_treeLeft(vom)){vom.t = vip;vom.m += sip - som;ancestor = v;}}return ancestor;}function sizeNode(node){node.x *= size[0];node.y = node.depth * size[1];}tree.separation = function(x){if(!arguments.length)return separation;separation = x;return tree;};tree.size = function(x){if(!arguments.length)return nodeSize?null:size;nodeSize = (size = x) == null?sizeNode:null;return tree;};tree.nodeSize = function(x){if(!arguments.length)return nodeSize?size:null;nodeSize = (size = x) == null?null:sizeNode;return tree;};return d3_layout_hierarchyRebind(tree,hierarchy);};function d3_layout_treeSeparation(a,b){return a.parent == b.parent?1:2;}function d3_layout_treeLeft(v){var children=v.children;return children.length?children[0]:v.t;}function d3_layout_treeRight(v){var children=v.children,n;return (n = children.length)?children[n - 1]:v.t;}function d3_layout_treeMove(wm,wp,shift){var change=shift / (wp.i - wm.i);wp.c -= change;wp.s += shift;wm.c += change;wp.z += shift;wp.m += shift;}function d3_layout_treeShift(v){var shift=0,change=0,children=v.children,i=children.length,w;while(--i >= 0) {w = children[i];w.z += shift;w.m += shift;shift += w.s + (change += w.c);}}function d3_layout_treeAncestor(vim,v,ancestor){return vim.a.parent === v.parent?vim.a:ancestor;}d3.layout.cluster = function(){var hierarchy=d3.layout.hierarchy().sort(null).value(null),separation=d3_layout_treeSeparation,size=[1,1],nodeSize=false;function cluster(d,i){var nodes=hierarchy.call(this,d,i),root=nodes[0],previousNode,x=0;d3_layout_hierarchyVisitAfter(root,function(node){var children=node.children;if(children && children.length){node.x = d3_layout_clusterX(children);node.y = d3_layout_clusterY(children);}else {node.x = previousNode?x += separation(node,previousNode):0;node.y = 0;previousNode = node;}});var left=d3_layout_clusterLeft(root),right=d3_layout_clusterRight(root),x0=left.x - separation(left,right) / 2,x1=right.x + separation(right,left) / 2;d3_layout_hierarchyVisitAfter(root,nodeSize?function(node){node.x = (node.x - root.x) * size[0];node.y = (root.y - node.y) * size[1];}:function(node){node.x = (node.x - x0) / (x1 - x0) * size[0];node.y = (1 - (root.y?node.y / root.y:1)) * size[1];});return nodes;}cluster.separation = function(x){if(!arguments.length)return separation;separation = x;return cluster;};cluster.size = function(x){if(!arguments.length)return nodeSize?null:size;nodeSize = (size = x) == null;return cluster;};cluster.nodeSize = function(x){if(!arguments.length)return nodeSize?size:null;nodeSize = (size = x) != null;return cluster;};return d3_layout_hierarchyRebind(cluster,hierarchy);};function d3_layout_clusterY(children){return 1 + d3.max(children,function(child){return child.y;});}function d3_layout_clusterX(children){return children.reduce(function(x,child){return x + child.x;},0) / children.length;}function d3_layout_clusterLeft(_x2){var _again=true;_function: while(_again) {var node=_x2;_again = false;var children=node.children;if(children && children.length){_x2 = children[0];_again = true;children = undefined;continue _function;}else {return node;}}}function d3_layout_clusterRight(_x3){var _again2=true;_function2: while(_again2) {var node=_x3;_again2 = false;var children=node.children,n;if(children && (n = children.length)){_x3 = children[n - 1];_again2 = true;children = n = undefined;continue _function2;}else {return node;}}}d3.layout.treemap = function(){var hierarchy=d3.layout.hierarchy(),round=Math.round,size=[1,1],padding=null,pad=d3_layout_treemapPadNull,sticky=false,stickies,mode="squarify",ratio=.5 * (1 + Math.sqrt(5));function scale(children,k){var i=-1,n=children.length,child,area;while(++i < n) {area = (child = children[i]).value * (k < 0?0:k);child.area = isNaN(area) || area <= 0?0:area;}}function squarify(node){var children=node.children;if(children && children.length){var rect=pad(node),row=[],remaining=children.slice(),child,best=Infinity,score,u=mode === "slice"?rect.dx:mode === "dice"?rect.dy:mode === "slice-dice"?node.depth & 1?rect.dy:rect.dx:Math.min(rect.dx,rect.dy),n;scale(remaining,rect.dx * rect.dy / node.value);row.area = 0;while((n = remaining.length) > 0) {row.push(child = remaining[n - 1]);row.area += child.area;if(mode !== "squarify" || (score = worst(row,u)) <= best){remaining.pop();best = score;}else {row.area -= row.pop().area;position(row,u,rect,false);u = Math.min(rect.dx,rect.dy);row.length = row.area = 0;best = Infinity;}}if(row.length){position(row,u,rect,true);row.length = row.area = 0;}children.forEach(squarify);}}function stickify(node){var children=node.children;if(children && children.length){var rect=pad(node),remaining=children.slice(),child,row=[];scale(remaining,rect.dx * rect.dy / node.value);row.area = 0;while(child = remaining.pop()) {row.push(child);row.area += child.area;if(child.z != null){position(row,child.z?rect.dx:rect.dy,rect,!remaining.length);row.length = row.area = 0;}}children.forEach(stickify);}}function worst(row,u){var s=row.area,r,rmax=0,rmin=Infinity,i=-1,n=row.length;while(++i < n) {if(!(r = row[i].area))continue;if(r < rmin)rmin = r;if(r > rmax)rmax = r;}s *= s;u *= u;return s?Math.max(u * rmax * ratio / s,s / (u * rmin * ratio)):Infinity;}function position(row,u,rect,flush){var i=-1,n=row.length,x=rect.x,y=rect.y,v=u?round(row.area / u):0,o;if(u == rect.dx){if(flush || v > rect.dy)v = rect.dy;while(++i < n) {o = row[i];o.x = x;o.y = y;o.dy = v;x += o.dx = Math.min(rect.x + rect.dx - x,v?round(o.area / v):0);}o.z = true;o.dx += rect.x + rect.dx - x;rect.y += v;rect.dy -= v;}else {if(flush || v > rect.dx)v = rect.dx;while(++i < n) {o = row[i];o.x = x;o.y = y;o.dx = v;y += o.dy = Math.min(rect.y + rect.dy - y,v?round(o.area / v):0);}o.z = false;o.dy += rect.y + rect.dy - y;rect.x += v;rect.dx -= v;}}function treemap(d){var nodes=stickies || hierarchy(d),root=nodes[0];root.x = root.y = 0;if(root.value)root.dx = size[0],root.dy = size[1];else root.dx = root.dy = 0;if(stickies)hierarchy.revalue(root);scale([root],root.dx * root.dy / root.value);(stickies?stickify:squarify)(root);if(sticky)stickies = nodes;return nodes;}treemap.size = function(x){if(!arguments.length)return size;size = x;return treemap;};treemap.padding = function(x){if(!arguments.length)return padding;function padFunction(node){var p=x.call(treemap,node,node.depth);return p == null?d3_layout_treemapPadNull(node):d3_layout_treemapPad(node,typeof p === "number"?[p,p,p,p]:p);}function padConstant(node){return d3_layout_treemapPad(node,x);}var type;pad = (padding = x) == null?d3_layout_treemapPadNull:(type = typeof x) === "function"?padFunction:type === "number"?(x = [x,x,x,x],padConstant):padConstant;return treemap;};treemap.round = function(x){if(!arguments.length)return round != Number;round = x?Math.round:Number;return treemap;};treemap.sticky = function(x){if(!arguments.length)return sticky;sticky = x;stickies = null;return treemap;};treemap.ratio = function(x){if(!arguments.length)return ratio;ratio = x;return treemap;};treemap.mode = function(x){if(!arguments.length)return mode;mode = x + "";return treemap;};return d3_layout_hierarchyRebind(treemap,hierarchy);};function d3_layout_treemapPadNull(node){return {x:node.x,y:node.y,dx:node.dx,dy:node.dy};}function d3_layout_treemapPad(node,padding){var x=node.x + padding[3],y=node.y + padding[0],dx=node.dx - padding[1] - padding[3],dy=node.dy - padding[0] - padding[2];if(dx < 0){x += dx / 2;dx = 0;}if(dy < 0){y += dy / 2;dy = 0;}return {x:x,y:y,dx:dx,dy:dy};}d3.random = {normal:function normal(µ,σ){var n=arguments.length;if(n < 2)σ = 1;if(n < 1)µ = 0;return function(){var x,y,r;do {x = Math.random() * 2 - 1;y = Math.random() * 2 - 1;r = x * x + y * y;}while(!r || r > 1);return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);};},logNormal:function logNormal(){var random=d3.random.normal.apply(d3,arguments);return function(){return Math.exp(random());};},bates:function bates(m){var random=d3.random.irwinHall(m);return function(){return random() / m;};},irwinHall:function irwinHall(m){return function(){for(var s=0,j=0;j < m;j++) s += Math.random();return s;};}};d3.scale = {};function d3_scaleExtent(domain){var start=domain[0],stop=domain[domain.length - 1];return start < stop?[start,stop]:[stop,start];}function d3_scaleRange(scale){return scale.rangeExtent?scale.rangeExtent():d3_scaleExtent(scale.range());}function d3_scale_bilinear(domain,range,uninterpolate,interpolate){var u=uninterpolate(domain[0],domain[1]),i=interpolate(range[0],range[1]);return function(x){return i(u(x));};}function d3_scale_nice(domain,nice){var i0=0,i1=domain.length - 1,x0=domain[i0],x1=domain[i1],dx;if(x1 < x0){dx = i0,i0 = i1,i1 = dx;dx = x0,x0 = x1,x1 = dx;}domain[i0] = nice.floor(x0);domain[i1] = nice.ceil(x1);return domain;}function d3_scale_niceStep(step){return step?{floor:function floor(x){return Math.floor(x / step) * step;},ceil:function ceil(x){return Math.ceil(x / step) * step;}}:d3_scale_niceIdentity;}var d3_scale_niceIdentity={floor:d3_identity,ceil:d3_identity};function d3_scale_polylinear(domain,range,uninterpolate,interpolate){var u=[],i=[],j=0,k=Math.min(domain.length,range.length) - 1;if(domain[k] < domain[0]){domain = domain.slice().reverse();range = range.slice().reverse();}while(++j <= k) {u.push(uninterpolate(domain[j - 1],domain[j]));i.push(interpolate(range[j - 1],range[j]));}return function(x){var j=d3.bisect(domain,x,1,k) - 1;return i[j](u[j](x));};}d3.scale.linear = function(){return d3_scale_linear([0,1],[0,1],d3_interpolate,false);};function d3_scale_linear(domain,range,interpolate,clamp){var output,input;function rescale(){var linear=Math.min(domain.length,range.length) > 2?d3_scale_polylinear:d3_scale_bilinear,uninterpolate=clamp?d3_uninterpolateClamp:d3_uninterpolateNumber;output = linear(domain,range,uninterpolate,interpolate);input = linear(range,domain,uninterpolate,d3_interpolate);return scale;}function scale(x){return output(x);}scale.invert = function(y){return input(y);};scale.domain = function(x){if(!arguments.length)return domain;domain = x.map(Number);return rescale();};scale.range = function(x){if(!arguments.length)return range;range = x;return rescale();};scale.rangeRound = function(x){return scale.range(x).interpolate(d3_interpolateRound);};scale.clamp = function(x){if(!arguments.length)return clamp;clamp = x;return rescale();};scale.interpolate = function(x){if(!arguments.length)return interpolate;interpolate = x;return rescale();};scale.ticks = function(m){return d3_scale_linearTicks(domain,m);};scale.tickFormat = function(m,format){return d3_scale_linearTickFormat(domain,m,format);};scale.nice = function(m){d3_scale_linearNice(domain,m);return rescale();};scale.copy = function(){return d3_scale_linear(domain,range,interpolate,clamp);};return rescale();}function d3_scale_linearRebind(scale,linear){return d3.rebind(scale,linear,"range","rangeRound","interpolate","clamp");}function d3_scale_linearNice(domain,m){return d3_scale_nice(domain,d3_scale_niceStep(d3_scale_linearTickRange(domain,m)[2]));}function d3_scale_linearTickRange(domain,m){if(m == null)m = 10;var extent=d3_scaleExtent(domain),span=extent[1] - extent[0],step=Math.pow(10,Math.floor(Math.log(span / m) / Math.LN10)),err=m / span * step;if(err <= .15)step *= 10;else if(err <= .35)step *= 5;else if(err <= .75)step *= 2;extent[0] = Math.ceil(extent[0] / step) * step;extent[1] = Math.floor(extent[1] / step) * step + step * .5;extent[2] = step;return extent;}function d3_scale_linearTicks(domain,m){return d3.range.apply(d3,d3_scale_linearTickRange(domain,m));}function d3_scale_linearTickFormat(domain,m,format){var range=d3_scale_linearTickRange(domain,m);if(format){var match=d3_format_re.exec(format);match.shift();if(match[8] === "s"){var prefix=d3.formatPrefix(Math.max(abs(range[0]),abs(range[1])));if(!match[7])match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));match[8] = "f";format = d3.format(match.join(""));return function(d){return format(prefix.scale(d)) + prefix.symbol;};}if(!match[7])match[7] = "." + d3_scale_linearFormatPrecision(match[8],range);format = match.join("");}else {format = ",." + d3_scale_linearPrecision(range[2]) + "f";}return d3.format(format);}var d3_scale_linearFormatSignificant={s:1,g:1,p:1,r:1,e:1};function d3_scale_linearPrecision(value){return -Math.floor(Math.log(value) / Math.LN10 + .01);}function d3_scale_linearFormatPrecision(type,range){var p=d3_scale_linearPrecision(range[2]);return type in d3_scale_linearFormatSignificant?Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]),abs(range[1])))) + +(type !== "e"):p - (type === "%") * 2;}d3.scale.log = function(){return d3_scale_log(d3.scale.linear().domain([0,1]),10,true,[1,10]);};function d3_scale_log(linear,base,positive,domain){function log(x){return (positive?Math.log(x < 0?0:x):-Math.log(x > 0?0:-x)) / Math.log(base);}function pow(x){return positive?Math.pow(base,x):-Math.pow(base,-x);}function scale(x){return linear(log(x));}scale.invert = function(x){return pow(linear.invert(x));};scale.domain = function(x){if(!arguments.length)return domain;positive = x[0] >= 0;linear.domain((domain = x.map(Number)).map(log));return scale;};scale.base = function(_){if(!arguments.length)return base;base = +_;linear.domain(domain.map(log));return scale;};scale.nice = function(){var niced=d3_scale_nice(domain.map(log),positive?Math:d3_scale_logNiceNegative);linear.domain(niced);domain = niced.map(pow);return scale;};scale.ticks = function(){var extent=d3_scaleExtent(domain),ticks=[],u=extent[0],v=extent[1],i=Math.floor(log(u)),j=Math.ceil(log(v)),n=base % 1?2:base;if(isFinite(j - i)){if(positive){for(;i < j;i++) for(var k=1;k < n;k++) ticks.push(pow(i) * k);ticks.push(pow(i));}else {ticks.push(pow(i));for(;i++ < j;) for(var k=n - 1;k > 0;k--) ticks.push(pow(i) * k);}for(i = 0;ticks[i] < u;i++) {}for(j = ticks.length;ticks[j - 1] > v;j--) {}ticks = ticks.slice(i,j);}return ticks;};scale.tickFormat = function(n,format){if(!arguments.length)return d3_scale_logFormat;if(arguments.length < 2)format = d3_scale_logFormat;else if(typeof format !== "function")format = d3.format(format);var k=Math.max(.1,n / scale.ticks().length),f=positive?(e = 1e-12,Math.ceil):(e = -1e-12,Math.floor),e;return function(d){return d / pow(f(log(d) + e)) <= k?format(d):"";};};scale.copy = function(){return d3_scale_log(linear.copy(),base,positive,domain);};return d3_scale_linearRebind(scale,linear);}var d3_scale_logFormat=d3.format(".0e"),d3_scale_logNiceNegative={floor:function floor(x){return -Math.ceil(-x);},ceil:function ceil(x){return -Math.floor(-x);}};d3.scale.pow = function(){return d3_scale_pow(d3.scale.linear(),1,[0,1]);};function d3_scale_pow(linear,exponent,domain){var powp=d3_scale_powPow(exponent),powb=d3_scale_powPow(1 / exponent);function scale(x){return linear(powp(x));}scale.invert = function(x){return powb(linear.invert(x));};scale.domain = function(x){if(!arguments.length)return domain;linear.domain((domain = x.map(Number)).map(powp));return scale;};scale.ticks = function(m){return d3_scale_linearTicks(domain,m);};scale.tickFormat = function(m,format){return d3_scale_linearTickFormat(domain,m,format);};scale.nice = function(m){return scale.domain(d3_scale_linearNice(domain,m));};scale.exponent = function(x){if(!arguments.length)return exponent;powp = d3_scale_powPow(exponent = x);powb = d3_scale_powPow(1 / exponent);linear.domain(domain.map(powp));return scale;};scale.copy = function(){return d3_scale_pow(linear.copy(),exponent,domain);};return d3_scale_linearRebind(scale,linear);}function d3_scale_powPow(e){return function(x){return x < 0?-Math.pow(-x,e):Math.pow(x,e);};}d3.scale.sqrt = function(){return d3.scale.pow().exponent(.5);};d3.scale.ordinal = function(){return d3_scale_ordinal([],{t:"range",a:[[]]});};function d3_scale_ordinal(domain,ranger){var index,range,rangeBand;function scale(x){return range[((index.get(x) || (ranger.t === "range"?index.set(x,domain.push(x)):NaN)) - 1) % range.length];}function steps(start,step){return d3.range(domain.length).map(function(i){return start + step * i;});}scale.domain = function(x){if(!arguments.length)return domain;domain = [];index = new d3_Map();var i=-1,n=x.length,xi;while(++i < n) if(!index.has(xi = x[i]))index.set(xi,domain.push(xi));return scale[ranger.t].apply(scale,ranger.a);};scale.range = function(x){if(!arguments.length)return range;range = x;rangeBand = 0;ranger = {t:"range",a:arguments};return scale;};scale.rangePoints = function(x,padding){if(arguments.length < 2)padding = 0;var start=x[0],stop=x[1],step=domain.length < 2?(start = (start + stop) / 2,0):(stop - start) / (domain.length - 1 + padding);range = steps(start + step * padding / 2,step);rangeBand = 0;ranger = {t:"rangePoints",a:arguments};return scale;};scale.rangeRoundPoints = function(x,padding){if(arguments.length < 2)padding = 0;var start=x[0],stop=x[1],step=domain.length < 2?(start = stop = Math.round((start + stop) / 2),0):(stop - start) / (domain.length - 1 + padding) | 0;range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2),step);rangeBand = 0;ranger = {t:"rangeRoundPoints",a:arguments};return scale;};scale.rangeBands = function(x,padding,outerPadding){if(arguments.length < 2)padding = 0;if(arguments.length < 3)outerPadding = padding;var reverse=x[1] < x[0],start=x[reverse - 0],stop=x[1 - reverse],step=(stop - start) / (domain.length - padding + 2 * outerPadding);range = steps(start + step * outerPadding,step);if(reverse)range.reverse();rangeBand = step * (1 - padding);ranger = {t:"rangeBands",a:arguments};return scale;};scale.rangeRoundBands = function(x,padding,outerPadding){if(arguments.length < 2)padding = 0;if(arguments.length < 3)outerPadding = padding;var reverse=x[1] < x[0],start=x[reverse - 0],stop=x[1 - reverse],step=Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2),step);if(reverse)range.reverse();rangeBand = Math.round(step * (1 - padding));ranger = {t:"rangeRoundBands",a:arguments};return scale;};scale.rangeBand = function(){return rangeBand;};scale.rangeExtent = function(){return d3_scaleExtent(ranger.a[0]);};scale.copy = function(){return d3_scale_ordinal(domain,ranger);};return scale.domain(domain);}d3.scale.category10 = function(){return d3.scale.ordinal().range(d3_category10);};d3.scale.category20 = function(){return d3.scale.ordinal().range(d3_category20);};d3.scale.category20b = function(){return d3.scale.ordinal().range(d3_category20b);};d3.scale.category20c = function(){return d3.scale.ordinal().range(d3_category20c);};var d3_category10=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(d3_rgbString);var d3_category20=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(d3_rgbString);var d3_category20b=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(d3_rgbString);var d3_category20c=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(d3_rgbString);d3.scale.quantile = function(){return d3_scale_quantile([],[]);};function d3_scale_quantile(domain,range){var thresholds;function rescale(){var k=0,q=range.length;thresholds = [];while(++k < q) thresholds[k - 1] = d3.quantile(domain,k / q);return scale;}function scale(x){if(!isNaN(x = +x))return range[d3.bisect(thresholds,x)];}scale.domain = function(x){if(!arguments.length)return domain;domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);return rescale();};scale.range = function(x){if(!arguments.length)return range;range = x;return rescale();};scale.quantiles = function(){return thresholds;};scale.invertExtent = function(y){y = range.indexOf(y);return y < 0?[NaN,NaN]:[y > 0?thresholds[y - 1]:domain[0],y < thresholds.length?thresholds[y]:domain[domain.length - 1]];};scale.copy = function(){return d3_scale_quantile(domain,range);};return rescale();}d3.scale.quantize = function(){return d3_scale_quantize(0,1,[0,1]);};function d3_scale_quantize(x0,x1,range){var kx,i;function scale(x){return range[Math.max(0,Math.min(i,Math.floor(kx * (x - x0))))];}function rescale(){kx = range.length / (x1 - x0);i = range.length - 1;return scale;}scale.domain = function(x){if(!arguments.length)return [x0,x1];x0 = +x[0];x1 = +x[x.length - 1];return rescale();};scale.range = function(x){if(!arguments.length)return range;range = x;return rescale();};scale.invertExtent = function(y){y = range.indexOf(y);y = y < 0?NaN:y / kx + x0;return [y,y + 1 / kx];};scale.copy = function(){return d3_scale_quantize(x0,x1,range);};return rescale();}d3.scale.threshold = function(){return d3_scale_threshold([.5],[0,1]);};function d3_scale_threshold(domain,range){function scale(x){if(x <= x)return range[d3.bisect(domain,x)];}scale.domain = function(_){if(!arguments.length)return domain;domain = _;return scale;};scale.range = function(_){if(!arguments.length)return range;range = _;return scale;};scale.invertExtent = function(y){y = range.indexOf(y);return [domain[y - 1],domain[y]];};scale.copy = function(){return d3_scale_threshold(domain,range);};return scale;}d3.scale.identity = function(){return d3_scale_identity([0,1]);};function d3_scale_identity(domain){function identity(x){return +x;}identity.invert = identity;identity.domain = identity.range = function(x){if(!arguments.length)return domain;domain = x.map(identity);return identity;};identity.ticks = function(m){return d3_scale_linearTicks(domain,m);};identity.tickFormat = function(m,format){return d3_scale_linearTickFormat(domain,m,format);};identity.copy = function(){return d3_scale_identity(domain);};return identity;}d3.svg = {};function d3_zero(){return 0;}d3.svg.arc = function(){var innerRadius=d3_svg_arcInnerRadius,outerRadius=d3_svg_arcOuterRadius,cornerRadius=d3_zero,padRadius=d3_svg_arcAuto,startAngle=d3_svg_arcStartAngle,endAngle=d3_svg_arcEndAngle,padAngle=d3_svg_arcPadAngle;function arc(){var r0=Math.max(0,+innerRadius.apply(this,arguments)),r1=Math.max(0,+outerRadius.apply(this,arguments)),a0=startAngle.apply(this,arguments) - halfπ,a1=endAngle.apply(this,arguments) - halfπ,da=Math.abs(a1 - a0),cw=a0 > a1?0:1;if(r1 < r0)rc = r1,r1 = r0,r0 = rc;if(da >= τε)return circleSegment(r1,cw) + (r0?circleSegment(r0,1 - cw):"") + "Z";var rc,cr,rp,ap,p0=0,p1=0,x0,y0,x1,y1,x2,y2,x3,y3,path=[];if(ap = (+padAngle.apply(this,arguments) || 0) / 2){rp = padRadius === d3_svg_arcAuto?Math.sqrt(r0 * r0 + r1 * r1):+padRadius.apply(this,arguments);if(!cw)p1 *= -1;if(r1)p1 = d3_asin(rp / r1 * Math.sin(ap));if(r0)p0 = d3_asin(rp / r0 * Math.sin(ap));}if(r1){x0 = r1 * Math.cos(a0 + p1);y0 = r1 * Math.sin(a0 + p1);x1 = r1 * Math.cos(a1 - p1);y1 = r1 * Math.sin(a1 - p1);var l1=Math.abs(a1 - a0 - 2 * p1) <= π?0:1;if(p1 && d3_svg_arcSweep(x0,y0,x1,y1) === cw ^ l1){var h1=(a0 + a1) / 2;x0 = r1 * Math.cos(h1);y0 = r1 * Math.sin(h1);x1 = y1 = null;}}else {x0 = y0 = 0;}if(r0){x2 = r0 * Math.cos(a1 - p0);y2 = r0 * Math.sin(a1 - p0);x3 = r0 * Math.cos(a0 + p0);y3 = r0 * Math.sin(a0 + p0);var l0=Math.abs(a0 - a1 + 2 * p0) <= π?0:1;if(p0 && d3_svg_arcSweep(x2,y2,x3,y3) === 1 - cw ^ l0){var h0=(a0 + a1) / 2;x2 = r0 * Math.cos(h0);y2 = r0 * Math.sin(h0);x3 = y3 = null;}}else {x2 = y2 = 0;}if(da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2,+cornerRadius.apply(this,arguments))) > .001){cr = r0 < r1 ^ cw?0:1;var rc1=rc,rc0=rc;if(da < π){var oc=x3 == null?[x2,y2]:x1 == null?[x0,y0]:d3_geom_polygonIntersect([x0,y0],[x3,y3],[x1,y1],[x2,y2]),ax=x0 - oc[0],ay=y0 - oc[1],bx=x1 - oc[0],by=y1 - oc[1],kc=1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),lc=Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);rc0 = Math.min(rc,(r0 - lc) / (kc - 1));rc1 = Math.min(rc,(r1 - lc) / (kc + 1));}if(x1 != null){var t30=d3_svg_arcCornerTangents(x3 == null?[x2,y2]:[x3,y3],[x0,y0],r1,rc1,cw),t12=d3_svg_arcCornerTangents([x1,y1],[x2,y2],r1,rc1,cw);if(rc === rc1){path.push("M",t30[0],"A",rc1,",",rc1," 0 0,",cr," ",t30[1],"A",r1,",",r1," 0 ",1 - cw ^ d3_svg_arcSweep(t30[1][0],t30[1][1],t12[1][0],t12[1][1]),",",cw," ",t12[1],"A",rc1,",",rc1," 0 0,",cr," ",t12[0]);}else {path.push("M",t30[0],"A",rc1,",",rc1," 0 1,",cr," ",t12[0]);}}else {path.push("M",x0,",",y0);}if(x3 != null){var t03=d3_svg_arcCornerTangents([x0,y0],[x3,y3],r0,-rc0,cw),t21=d3_svg_arcCornerTangents([x2,y2],x1 == null?[x0,y0]:[x1,y1],r0,-rc0,cw);if(rc === rc0){path.push("L",t21[0],"A",rc0,",",rc0," 0 0,",cr," ",t21[1],"A",r0,",",r0," 0 ",cw ^ d3_svg_arcSweep(t21[1][0],t21[1][1],t03[1][0],t03[1][1]),",",1 - cw," ",t03[1],"A",rc0,",",rc0," 0 0,",cr," ",t03[0]);}else {path.push("L",t21[0],"A",rc0,",",rc0," 0 0,",cr," ",t03[0]);}}else {path.push("L",x2,",",y2);}}else {path.push("M",x0,",",y0);if(x1 != null)path.push("A",r1,",",r1," 0 ",l1,",",cw," ",x1,",",y1);path.push("L",x2,",",y2);if(x3 != null)path.push("A",r0,",",r0," 0 ",l0,",",1 - cw," ",x3,",",y3);}path.push("Z");return path.join("");}function circleSegment(r1,cw){return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;}arc.innerRadius = function(v){if(!arguments.length)return innerRadius;innerRadius = d3_functor(v);return arc;};arc.outerRadius = function(v){if(!arguments.length)return outerRadius;outerRadius = d3_functor(v);return arc;};arc.cornerRadius = function(v){if(!arguments.length)return cornerRadius;cornerRadius = d3_functor(v);return arc;};arc.padRadius = function(v){if(!arguments.length)return padRadius;padRadius = v == d3_svg_arcAuto?d3_svg_arcAuto:d3_functor(v);return arc;};arc.startAngle = function(v){if(!arguments.length)return startAngle;startAngle = d3_functor(v);return arc;};arc.endAngle = function(v){if(!arguments.length)return endAngle;endAngle = d3_functor(v);return arc;};arc.padAngle = function(v){if(!arguments.length)return padAngle;padAngle = d3_functor(v);return arc;};arc.centroid = function(){var r=(+innerRadius.apply(this,arguments) + +outerRadius.apply(this,arguments)) / 2,a=(+startAngle.apply(this,arguments) + +endAngle.apply(this,arguments)) / 2 - halfπ;return [Math.cos(a) * r,Math.sin(a) * r];};return arc;};var d3_svg_arcAuto="auto";function d3_svg_arcInnerRadius(d){return d.innerRadius;}function d3_svg_arcOuterRadius(d){return d.outerRadius;}function d3_svg_arcStartAngle(d){return d.startAngle;}function d3_svg_arcEndAngle(d){return d.endAngle;}function d3_svg_arcPadAngle(d){return d && d.padAngle;}function d3_svg_arcSweep(x0,y0,x1,y1){return (x0 - x1) * y0 - (y0 - y1) * x0 > 0?0:1;}function d3_svg_arcCornerTangents(p0,p1,r1,rc,cw){var x01=p0[0] - p1[0],y01=p0[1] - p1[1],lo=(cw?rc:-rc) / Math.sqrt(x01 * x01 + y01 * y01),ox=lo * y01,oy=-lo * x01,x1=p0[0] + ox,y1=p0[1] + oy,x2=p1[0] + ox,y2=p1[1] + oy,x3=(x1 + x2) / 2,y3=(y1 + y2) / 2,dx=x2 - x1,dy=y2 - y1,d2=dx * dx + dy * dy,r=r1 - rc,D=x1 * y2 - x2 * y1,d=(dy < 0?-1:1) * Math.sqrt(Math.max(0,r * r * d2 - D * D)),cx0=(D * dy - dx * d) / d2,cy0=(-D * dx - dy * d) / d2,cx1=(D * dy + dx * d) / d2,cy1=(-D * dx + dy * d) / d2,dx0=cx0 - x3,dy0=cy0 - y3,dx1=cx1 - x3,dy1=cy1 - y3;if(dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1)cx0 = cx1,cy0 = cy1;return [[cx0 - ox,cy0 - oy],[cx0 * r1 / r,cy0 * r1 / r]];}function d3_svg_line(projection){var x=d3_geom_pointX,y=d3_geom_pointY,defined=d3_true,interpolate=d3_svg_lineLinear,interpolateKey=interpolate.key,tension=.7;function line(data){var segments=[],points=[],i=-1,n=data.length,d,fx=d3_functor(x),fy=d3_functor(y);function segment(){segments.push("M",interpolate(projection(points),tension));}while(++i < n) {if(defined.call(this,d = data[i],i)){points.push([+fx.call(this,d,i),+fy.call(this,d,i)]);}else if(points.length){segment();points = [];}}if(points.length)segment();return segments.length?segments.join(""):null;}line.x = function(_){if(!arguments.length)return x;x = _;return line;};line.y = function(_){if(!arguments.length)return y;y = _;return line;};line.defined = function(_){if(!arguments.length)return defined;defined = _;return line;};line.interpolate = function(_){if(!arguments.length)return interpolateKey;if(typeof _ === "function")interpolateKey = interpolate = _;else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;return line;};line.tension = function(_){if(!arguments.length)return tension;tension = _;return line;};return line;}d3.svg.line = function(){return d3_svg_line(d3_identity);};var d3_svg_lineInterpolators=d3.map({linear:d3_svg_lineLinear,"linear-closed":d3_svg_lineLinearClosed,step:d3_svg_lineStep,"step-before":d3_svg_lineStepBefore,"step-after":d3_svg_lineStepAfter,basis:d3_svg_lineBasis,"basis-open":d3_svg_lineBasisOpen,"basis-closed":d3_svg_lineBasisClosed,bundle:d3_svg_lineBundle,cardinal:d3_svg_lineCardinal,"cardinal-open":d3_svg_lineCardinalOpen,"cardinal-closed":d3_svg_lineCardinalClosed,monotone:d3_svg_lineMonotone});d3_svg_lineInterpolators.forEach(function(key,value){value.key = key;value.closed = /-closed$/.test(key);});function d3_svg_lineLinear(points){return points.length > 1?points.join("L"):points + "Z";}function d3_svg_lineLinearClosed(points){return points.join("L") + "Z";}function d3_svg_lineStep(points){var i=0,n=points.length,p=points[0],path=[p[0],",",p[1]];while(++i < n) path.push("H",(p[0] + (p = points[i])[0]) / 2,"V",p[1]);if(n > 1)path.push("H",p[0]);return path.join("");}function d3_svg_lineStepBefore(points){var i=0,n=points.length,p=points[0],path=[p[0],",",p[1]];while(++i < n) path.push("V",(p = points[i])[1],"H",p[0]);return path.join("");}function d3_svg_lineStepAfter(points){var i=0,n=points.length,p=points[0],path=[p[0],",",p[1]];while(++i < n) path.push("H",(p = points[i])[0],"V",p[1]);return path.join("");}function d3_svg_lineCardinalOpen(points,tension){return points.length < 4?d3_svg_lineLinear(points):points[1] + d3_svg_lineHermite(points.slice(1,-1),d3_svg_lineCardinalTangents(points,tension));}function d3_svg_lineCardinalClosed(points,tension){return points.length < 3?d3_svg_lineLinearClosed(points):points[0] + d3_svg_lineHermite((points.push(points[0]),points),d3_svg_lineCardinalTangents([points[points.length - 2]].concat(points,[points[1]]),tension));}function d3_svg_lineCardinal(points,tension){return points.length < 3?d3_svg_lineLinear(points):points[0] + d3_svg_lineHermite(points,d3_svg_lineCardinalTangents(points,tension));}function d3_svg_lineHermite(points,tangents){if(tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2){return d3_svg_lineLinear(points);}var quad=points.length != tangents.length,path="",p0=points[0],p=points[1],t0=tangents[0],t=t0,pi=1;if(quad){path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];p0 = points[1];pi = 2;}if(tangents.length > 1){t = tangents[1];p = points[pi];pi++;path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];for(var i=2;i < tangents.length;i++,pi++) {p = points[pi];t = tangents[i];path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];}}if(quad){var lp=points[pi];path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];}return path;}function d3_svg_lineCardinalTangents(points,tension){var tangents=[],a=(1 - tension) / 2,p0,p1=points[0],p2=points[1],i=1,n=points.length;while(++i < n) {p0 = p1;p1 = p2;p2 = points[i];tangents.push([a * (p2[0] - p0[0]),a * (p2[1] - p0[1])]);}return tangents;}function d3_svg_lineBasis(points){if(points.length < 3)return d3_svg_lineLinear(points);var i=1,n=points.length,pi=points[0],x0=pi[0],y0=pi[1],px=[x0,x0,x0,(pi = points[1])[0]],py=[y0,y0,y0,pi[1]],path=[x0,",",y0,"L",d3_svg_lineDot4(d3_svg_lineBasisBezier3,px),",",d3_svg_lineDot4(d3_svg_lineBasisBezier3,py)];points.push(points[n - 1]);while(++i <= n) {pi = points[i];px.shift();px.push(pi[0]);py.shift();py.push(pi[1]);d3_svg_lineBasisBezier(path,px,py);}points.pop();path.push("L",pi);return path.join("");}function d3_svg_lineBasisOpen(points){if(points.length < 4)return d3_svg_lineLinear(points);var path=[],i=-1,n=points.length,pi,px=[0],py=[0];while(++i < 3) {pi = points[i];px.push(pi[0]);py.push(pi[1]);}path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3,px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3,py));--i;while(++i < n) {pi = points[i];px.shift();px.push(pi[0]);py.shift();py.push(pi[1]);d3_svg_lineBasisBezier(path,px,py);}return path.join("");}function d3_svg_lineBasisClosed(points){var path,i=-1,n=points.length,m=n + 4,pi,px=[],py=[];while(++i < 4) {pi = points[i % n];px.push(pi[0]);py.push(pi[1]);}path = [d3_svg_lineDot4(d3_svg_lineBasisBezier3,px),",",d3_svg_lineDot4(d3_svg_lineBasisBezier3,py)];--i;while(++i < m) {pi = points[i % n];px.shift();px.push(pi[0]);py.shift();py.push(pi[1]);d3_svg_lineBasisBezier(path,px,py);}return path.join("");}function d3_svg_lineBundle(points,tension){var n=points.length - 1;if(n){var x0=points[0][0],y0=points[0][1],dx=points[n][0] - x0,dy=points[n][1] - y0,i=-1,p,t;while(++i <= n) {p = points[i];t = i / n;p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);}}return d3_svg_lineBasis(points);}function d3_svg_lineDot4(a,b){return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];}var d3_svg_lineBasisBezier1=[0,2 / 3,1 / 3,0],d3_svg_lineBasisBezier2=[0,1 / 3,2 / 3,0],d3_svg_lineBasisBezier3=[0,1 / 6,2 / 3,1 / 6];function d3_svg_lineBasisBezier(path,x,y){path.push("C",d3_svg_lineDot4(d3_svg_lineBasisBezier1,x),",",d3_svg_lineDot4(d3_svg_lineBasisBezier1,y),",",d3_svg_lineDot4(d3_svg_lineBasisBezier2,x),",",d3_svg_lineDot4(d3_svg_lineBasisBezier2,y),",",d3_svg_lineDot4(d3_svg_lineBasisBezier3,x),",",d3_svg_lineDot4(d3_svg_lineBasisBezier3,y));}function d3_svg_lineSlope(p0,p1){return (p1[1] - p0[1]) / (p1[0] - p0[0]);}function d3_svg_lineFiniteDifferences(points){var i=0,j=points.length - 1,m=[],p0=points[0],p1=points[1],d=m[0] = d3_svg_lineSlope(p0,p1);while(++i < j) {m[i] = (d + (d = d3_svg_lineSlope(p0 = p1,p1 = points[i + 1]))) / 2;}m[i] = d;return m;}function d3_svg_lineMonotoneTangents(points){var tangents=[],d,a,b,s,m=d3_svg_lineFiniteDifferences(points),i=-1,j=points.length - 1;while(++i < j) {d = d3_svg_lineSlope(points[i],points[i + 1]);if(abs(d) < ε){m[i] = m[i + 1] = 0;}else {a = m[i] / d;b = m[i + 1] / d;s = a * a + b * b;if(s > 9){s = d * 3 / Math.sqrt(s);m[i] = s * a;m[i + 1] = s * b;}}}i = -1;while(++i <= j) {s = (points[Math.min(j,i + 1)][0] - points[Math.max(0,i - 1)][0]) / (6 * (1 + m[i] * m[i]));tangents.push([s || 0,m[i] * s || 0]);}return tangents;}function d3_svg_lineMonotone(points){return points.length < 3?d3_svg_lineLinear(points):points[0] + d3_svg_lineHermite(points,d3_svg_lineMonotoneTangents(points));}d3.svg.line.radial = function(){var line=d3_svg_line(d3_svg_lineRadial);line.radius = line.x,delete line.x;line.angle = line.y,delete line.y;return line;};function d3_svg_lineRadial(points){var point,i=-1,n=points.length,r,a;while(++i < n) {point = points[i];r = point[0];a = point[1] - halfπ;point[0] = r * Math.cos(a);point[1] = r * Math.sin(a);}return points;}function d3_svg_area(projection){var x0=d3_geom_pointX,x1=d3_geom_pointX,y0=0,y1=d3_geom_pointY,defined=d3_true,interpolate=d3_svg_lineLinear,interpolateKey=interpolate.key,interpolateReverse=interpolate,L="L",tension=.7;function area(data){var segments=[],points0=[],points1=[],i=-1,n=data.length,d,fx0=d3_functor(x0),fy0=d3_functor(y0),fx1=x0 === x1?function(){return x;}:d3_functor(x1),fy1=y0 === y1?function(){return y;}:d3_functor(y1),x,y;function segment(){segments.push("M",interpolate(projection(points1),tension),L,interpolateReverse(projection(points0.reverse()),tension),"Z");}while(++i < n) {if(defined.call(this,d = data[i],i)){points0.push([x = +fx0.call(this,d,i),y = +fy0.call(this,d,i)]);points1.push([+fx1.call(this,d,i),+fy1.call(this,d,i)]);}else if(points0.length){segment();points0 = [];points1 = [];}}if(points0.length)segment();return segments.length?segments.join(""):null;}area.x = function(_){if(!arguments.length)return x1;x0 = x1 = _;return area;};area.x0 = function(_){if(!arguments.length)return x0;x0 = _;return area;};area.x1 = function(_){if(!arguments.length)return x1;x1 = _;return area;};area.y = function(_){if(!arguments.length)return y1;y0 = y1 = _;return area;};area.y0 = function(_){if(!arguments.length)return y0;y0 = _;return area;};area.y1 = function(_){if(!arguments.length)return y1;y1 = _;return area;};area.defined = function(_){if(!arguments.length)return defined;defined = _;return area;};area.interpolate = function(_){if(!arguments.length)return interpolateKey;if(typeof _ === "function")interpolateKey = interpolate = _;else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;interpolateReverse = interpolate.reverse || interpolate;L = interpolate.closed?"M":"L";return area;};area.tension = function(_){if(!arguments.length)return tension;tension = _;return area;};return area;}d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;d3.svg.area = function(){return d3_svg_area(d3_identity);};d3.svg.area.radial = function(){var area=d3_svg_area(d3_svg_lineRadial);area.radius = area.x,delete area.x;area.innerRadius = area.x0,delete area.x0;area.outerRadius = area.x1,delete area.x1;area.angle = area.y,delete area.y;area.startAngle = area.y0,delete area.y0;area.endAngle = area.y1,delete area.y1;return area;};d3.svg.chord = function(){var source=d3_source,target=d3_target,radius=d3_svg_chordRadius,startAngle=d3_svg_arcStartAngle,endAngle=d3_svg_arcEndAngle;function chord(d,i){var s=subgroup(this,source,d,i),t=subgroup(this,target,d,i);return "M" + s.p0 + arc(s.r,s.p1,s.a1 - s.a0) + (equals(s,t)?curve(s.r,s.p1,s.r,s.p0):curve(s.r,s.p1,t.r,t.p0) + arc(t.r,t.p1,t.a1 - t.a0) + curve(t.r,t.p1,s.r,s.p0)) + "Z";}function subgroup(self,f,d,i){var subgroup=f.call(self,d,i),r=radius.call(self,subgroup,i),a0=startAngle.call(self,subgroup,i) - halfπ,a1=endAngle.call(self,subgroup,i) - halfπ;return {r:r,a0:a0,a1:a1,p0:[r * Math.cos(a0),r * Math.sin(a0)],p1:[r * Math.cos(a1),r * Math.sin(a1)]};}function equals(a,b){return a.a0 == b.a0 && a.a1 == b.a1;}function arc(r,p,a){return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;}function curve(r0,p0,r1,p1){return "Q 0,0 " + p1;}chord.radius = function(v){if(!arguments.length)return radius;radius = d3_functor(v);return chord;};chord.source = function(v){if(!arguments.length)return source;source = d3_functor(v);return chord;};chord.target = function(v){if(!arguments.length)return target;target = d3_functor(v);return chord;};chord.startAngle = function(v){if(!arguments.length)return startAngle;startAngle = d3_functor(v);return chord;};chord.endAngle = function(v){if(!arguments.length)return endAngle;endAngle = d3_functor(v);return chord;};return chord;};function d3_svg_chordRadius(d){return d.radius;}d3.svg.diagonal = function(){var source=d3_source,target=d3_target,projection=d3_svg_diagonalProjection;function diagonal(d,i){var p0=source.call(this,d,i),p3=target.call(this,d,i),m=(p0.y + p3.y) / 2,p=[p0,{x:p0.x,y:m},{x:p3.x,y:m},p3];p = p.map(projection);return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];}diagonal.source = function(x){if(!arguments.length)return source;source = d3_functor(x);return diagonal;};diagonal.target = function(x){if(!arguments.length)return target;target = d3_functor(x);return diagonal;};diagonal.projection = function(x){if(!arguments.length)return projection;projection = x;return diagonal;};return diagonal;};function d3_svg_diagonalProjection(d){return [d.x,d.y];}d3.svg.diagonal.radial = function(){var diagonal=d3.svg.diagonal(),projection=d3_svg_diagonalProjection,projection_=diagonal.projection;diagonal.projection = function(x){return arguments.length?projection_(d3_svg_diagonalRadialProjection(projection = x)):projection;};return diagonal;};function d3_svg_diagonalRadialProjection(projection){return function(){var d=projection.apply(this,arguments),r=d[0],a=d[1] - halfπ;return [r * Math.cos(a),r * Math.sin(a)];};}d3.svg.symbol = function(){var type=d3_svg_symbolType,size=d3_svg_symbolSize;function symbol(d,i){return (d3_svg_symbols.get(type.call(this,d,i)) || d3_svg_symbolCircle)(size.call(this,d,i));}symbol.type = function(x){if(!arguments.length)return type;type = d3_functor(x);return symbol;};symbol.size = function(x){if(!arguments.length)return size;size = d3_functor(x);return symbol;};return symbol;};function d3_svg_symbolSize(){return 64;}function d3_svg_symbolType(){return "circle";}function d3_svg_symbolCircle(size){var r=Math.sqrt(size / π);return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";}var d3_svg_symbols=d3.map({circle:d3_svg_symbolCircle,cross:function cross(size){var r=Math.sqrt(size / 5) / 2;return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";},diamond:function diamond(size){var ry=Math.sqrt(size / (2 * d3_svg_symbolTan30)),rx=ry * d3_svg_symbolTan30;return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";},square:function square(size){var r=Math.sqrt(size) / 2;return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";},"triangle-down":function triangleDown(size){var rx=Math.sqrt(size / d3_svg_symbolSqrt3),ry=rx * d3_svg_symbolSqrt3 / 2;return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";},"triangle-up":function triangleUp(size){var rx=Math.sqrt(size / d3_svg_symbolSqrt3),ry=rx * d3_svg_symbolSqrt3 / 2;return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";}});d3.svg.symbolTypes = d3_svg_symbols.keys();var d3_svg_symbolSqrt3=Math.sqrt(3),d3_svg_symbolTan30=Math.tan(30 * d3_radians);d3_selectionPrototype.transition = function(name){var id=d3_transitionInheritId || ++d3_transitionId,ns=d3_transitionNamespace(name),subgroups=[],subgroup,node,transition=d3_transitionInherit || {time:Date.now(),ease:d3_ease_cubicInOut,delay:0,duration:250};for(var j=-1,m=this.length;++j < m;) {subgroups.push(subgroup = []);for(var group=this[j],i=-1,n=group.length;++i < n;) {if(node = group[i])d3_transitionNode(node,i,ns,id,transition);subgroup.push(node);}}return d3_transition(subgroups,ns,id);};d3_selectionPrototype.interrupt = function(name){return this.each(name == null?d3_selection_interrupt:d3_selection_interruptNS(d3_transitionNamespace(name)));};var d3_selection_interrupt=d3_selection_interruptNS(d3_transitionNamespace());function d3_selection_interruptNS(ns){return function(){var lock,activeId,active;if((lock = this[ns]) && (active = lock[activeId = lock.active])){active.timer.c = null;active.timer.t = NaN;if(--lock.count)delete lock[activeId];else delete this[ns];lock.active += .5;active.event && active.event.interrupt.call(this,this.__data__,active.index);}};}function d3_transition(groups,ns,id){d3_subclass(groups,d3_transitionPrototype);groups.namespace = ns;groups.id = id;return groups;}var d3_transitionPrototype=[],d3_transitionId=0,d3_transitionInheritId,d3_transitionInherit;d3_transitionPrototype.call = d3_selectionPrototype.call;d3_transitionPrototype.empty = d3_selectionPrototype.empty;d3_transitionPrototype.node = d3_selectionPrototype.node;d3_transitionPrototype.size = d3_selectionPrototype.size;d3.transition = function(selection,name){return selection && selection.transition?d3_transitionInheritId?selection.transition(name):selection:d3.selection().transition(selection);};d3.transition.prototype = d3_transitionPrototype;d3_transitionPrototype.select = function(selector){var id=this.id,ns=this.namespace,subgroups=[],subgroup,subnode,node;selector = d3_selection_selector(selector);for(var j=-1,m=this.length;++j < m;) {subgroups.push(subgroup = []);for(var group=this[j],i=-1,n=group.length;++i < n;) {if((node = group[i]) && (subnode = selector.call(node,node.__data__,i,j))){if("__data__" in node)subnode.__data__ = node.__data__;d3_transitionNode(subnode,i,ns,id,node[ns][id]);subgroup.push(subnode);}else {subgroup.push(null);}}}return d3_transition(subgroups,ns,id);};d3_transitionPrototype.selectAll = function(selector){var id=this.id,ns=this.namespace,subgroups=[],subgroup,subnodes,node,subnode,transition;selector = d3_selection_selectorAll(selector);for(var j=-1,m=this.length;++j < m;) {for(var group=this[j],i=-1,n=group.length;++i < n;) {if(node = group[i]){transition = node[ns][id];subnodes = selector.call(node,node.__data__,i,j);subgroups.push(subgroup = []);for(var k=-1,o=subnodes.length;++k < o;) {if(subnode = subnodes[k])d3_transitionNode(subnode,k,ns,id,transition);subgroup.push(subnode);}}}}return d3_transition(subgroups,ns,id);};d3_transitionPrototype.filter = function(filter){var subgroups=[],subgroup,group,node;if(typeof filter !== "function")filter = d3_selection_filter(filter);for(var j=0,m=this.length;j < m;j++) {subgroups.push(subgroup = []);for(var group=this[j],i=0,n=group.length;i < n;i++) {if((node = group[i]) && filter.call(node,node.__data__,i,j)){subgroup.push(node);}}}return d3_transition(subgroups,this.namespace,this.id);};d3_transitionPrototype.tween = function(name,tween){var id=this.id,ns=this.namespace;if(arguments.length < 2)return this.node()[ns][id].tween.get(name);return d3_selection_each(this,tween == null?function(node){node[ns][id].tween.remove(name);}:function(node){node[ns][id].tween.set(name,tween);});};function d3_transition_tween(groups,name,value,tween){var id=groups.id,ns=groups.namespace;return d3_selection_each(groups,typeof value === "function"?function(node,i,j){node[ns][id].tween.set(name,tween(value.call(node,node.__data__,i,j)));}:(value = tween(value),function(node){node[ns][id].tween.set(name,value);}));}d3_transitionPrototype.attr = function(nameNS,value){if(arguments.length < 2){for(value in nameNS) this.attr(value,nameNS[value]);return this;}var interpolate=nameNS == "transform"?d3_interpolateTransform:d3_interpolate,name=d3.ns.qualify(nameNS);function attrNull(){this.removeAttribute(name);}function attrNullNS(){this.removeAttributeNS(name.space,name.local);}function attrTween(b){return b == null?attrNull:(b += "",function(){var a=this.getAttribute(name),i;return a !== b && (i = interpolate(a,b),function(t){this.setAttribute(name,i(t));});});}function attrTweenNS(b){return b == null?attrNullNS:(b += "",function(){var a=this.getAttributeNS(name.space,name.local),i;return a !== b && (i = interpolate(a,b),function(t){this.setAttributeNS(name.space,name.local,i(t));});});}return d3_transition_tween(this,"attr." + nameNS,value,name.local?attrTweenNS:attrTween);};d3_transitionPrototype.attrTween = function(nameNS,tween){var name=d3.ns.qualify(nameNS);function attrTween(d,i){var f=tween.call(this,d,i,this.getAttribute(name));return f && function(t){this.setAttribute(name,f(t));};}function attrTweenNS(d,i){var f=tween.call(this,d,i,this.getAttributeNS(name.space,name.local));return f && function(t){this.setAttributeNS(name.space,name.local,f(t));};}return this.tween("attr." + nameNS,name.local?attrTweenNS:attrTween);};d3_transitionPrototype.style = function(name,value,priority){var n=arguments.length;if(n < 3){if(typeof name !== "string"){if(n < 2)value = "";for(priority in name) this.style(priority,name[priority],value);return this;}priority = "";}function styleNull(){this.style.removeProperty(name);}function styleString(b){return b == null?styleNull:(b += "",function(){var a=d3_window(this).getComputedStyle(this,null).getPropertyValue(name),i;return a !== b && (i = d3_interpolate(a,b),function(t){this.style.setProperty(name,i(t),priority);});});}return d3_transition_tween(this,"style." + name,value,styleString);};d3_transitionPrototype.styleTween = function(name,tween,priority){if(arguments.length < 3)priority = "";function styleTween(d,i){var f=tween.call(this,d,i,d3_window(this).getComputedStyle(this,null).getPropertyValue(name));return f && function(t){this.style.setProperty(name,f(t),priority);};}return this.tween("style." + name,styleTween);};d3_transitionPrototype.text = function(value){return d3_transition_tween(this,"text",value,d3_transition_text);};function d3_transition_text(b){if(b == null)b = "";return function(){this.textContent = b;};}d3_transitionPrototype.remove = function(){var ns=this.namespace;return this.each("end.transition",function(){var p;if(this[ns].count < 2 && (p = this.parentNode))p.removeChild(this);});};d3_transitionPrototype.ease = function(value){var id=this.id,ns=this.namespace;if(arguments.length < 1)return this.node()[ns][id].ease;if(typeof value !== "function")value = d3.ease.apply(d3,arguments);return d3_selection_each(this,function(node){node[ns][id].ease = value;});};d3_transitionPrototype.delay = function(value){var id=this.id,ns=this.namespace;if(arguments.length < 1)return this.node()[ns][id].delay;return d3_selection_each(this,typeof value === "function"?function(node,i,j){node[ns][id].delay = +value.call(node,node.__data__,i,j);}:(value = +value,function(node){node[ns][id].delay = value;}));};d3_transitionPrototype.duration = function(value){var id=this.id,ns=this.namespace;if(arguments.length < 1)return this.node()[ns][id].duration;return d3_selection_each(this,typeof value === "function"?function(node,i,j){node[ns][id].duration = Math.max(1,value.call(node,node.__data__,i,j));}:(value = Math.max(1,value),function(node){node[ns][id].duration = value;}));};d3_transitionPrototype.each = function(type,listener){var id=this.id,ns=this.namespace;if(arguments.length < 2){var inherit=d3_transitionInherit,inheritId=d3_transitionInheritId;try{d3_transitionInheritId = id;d3_selection_each(this,function(node,i,j){d3_transitionInherit = node[ns][id];type.call(node,node.__data__,i,j);});}finally {d3_transitionInherit = inherit;d3_transitionInheritId = inheritId;}}else {d3_selection_each(this,function(node){var transition=node[ns][id];(transition.event || (transition.event = d3.dispatch("start","end","interrupt"))).on(type,listener);});}return this;};d3_transitionPrototype.transition = function(){var id0=this.id,id1=++d3_transitionId,ns=this.namespace,subgroups=[],subgroup,group,node,transition;for(var j=0,m=this.length;j < m;j++) {subgroups.push(subgroup = []);for(var group=this[j],i=0,n=group.length;i < n;i++) {if(node = group[i]){transition = node[ns][id0];d3_transitionNode(node,i,ns,id1,{time:transition.time,ease:transition.ease,delay:transition.delay + transition.duration,duration:transition.duration});}subgroup.push(node);}}return d3_transition(subgroups,ns,id1);};function d3_transitionNamespace(name){return name == null?"__transition__":"__transition_" + name + "__";}function d3_transitionNode(node,i,ns,id,inherit){var lock=node[ns] || (node[ns] = {active:0,count:0}),transition=lock[id],time,timer,duration,ease,tweens;function schedule(elapsed){var delay=transition.delay;timer.t = delay + time;if(delay <= elapsed)return start(elapsed - delay);timer.c = start;}function start(elapsed){var activeId=lock.active,active=lock[activeId];if(active){active.timer.c = null;active.timer.t = NaN;--lock.count;delete lock[activeId];active.event && active.event.interrupt.call(node,node.__data__,active.index);}for(var cancelId in lock) {if(+cancelId < id){var cancel=lock[cancelId];cancel.timer.c = null;cancel.timer.t = NaN;--lock.count;delete lock[cancelId];}}lock.active = id;transition.event && transition.event.start.call(node,node.__data__,i);tweens = [];transition.tween.forEach(function(key,value){if(value = value.call(node,node.__data__,i)){tweens.push(value);}});ease = transition.ease;duration = transition.duration;timer.c = tick;d3_timer(function(){if(timer.c && tick(elapsed || 1)){timer.c = null;timer.t = NaN;}return 1;},0,time);}function tick(elapsed){var t=elapsed / duration,e=ease(t),n=tweens.length;while(n > 0) {tweens[--n].call(node,e);}if(t >= 1){transition.event && transition.event.end.call(node,node.__data__,i);if(--lock.count)delete lock[id];else delete node[ns];return 1;}}if(!transition){time = inherit.time;timer = d3_timer(schedule,0,time);transition = lock[id] = {tween:new d3_Map(),time:time,timer:timer,delay:inherit.delay,duration:inherit.duration,ease:inherit.ease,index:i};inherit = null;++lock.count;}}d3.svg.axis = function(){var scale=d3.scale.linear(),orient=d3_svg_axisDefaultOrient,innerTickSize=6,outerTickSize=6,tickPadding=3,tickArguments_=[10],tickValues=null,tickFormat_;function axis(g){g.each(function(){var g=d3.select(this);var scale0=this.__chart__ || scale,scale1=this.__chart__ = scale.copy();var ticks=tickValues == null?scale1.ticks?scale1.ticks.apply(scale1,tickArguments_):scale1.domain():tickValues,tickFormat=tickFormat_ == null?scale1.tickFormat?scale1.tickFormat.apply(scale1,tickArguments_):d3_identity:tickFormat_,tick=g.selectAll(".tick").data(ticks,scale1),tickEnter=tick.enter().insert("g",".domain").attr("class","tick").style("opacity",ε),tickExit=d3.transition(tick.exit()).style("opacity",ε).remove(),tickUpdate=d3.transition(tick.order()).style("opacity",1),tickSpacing=Math.max(innerTickSize,0) + tickPadding,tickTransform;var range=d3_scaleRange(scale1),path=g.selectAll(".domain").data([0]),pathUpdate=(path.enter().append("path").attr("class","domain"),d3.transition(path));tickEnter.append("line");tickEnter.append("text");var lineEnter=tickEnter.select("line"),lineUpdate=tickUpdate.select("line"),text=tick.select("text").text(tickFormat),textEnter=tickEnter.select("text"),textUpdate=tickUpdate.select("text"),sign=orient === "top" || orient === "left"?-1:1,x1,x2,y1,y2;if(orient === "bottom" || orient === "top"){tickTransform = d3_svg_axisX,x1 = "x",y1 = "y",x2 = "x2",y2 = "y2";text.attr("dy",sign < 0?"0em":".71em").style("text-anchor","middle");pathUpdate.attr("d","M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);}else {tickTransform = d3_svg_axisY,x1 = "y",y1 = "x",x2 = "y2",y2 = "x2";text.attr("dy",".32em").style("text-anchor",sign < 0?"end":"start");pathUpdate.attr("d","M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);}lineEnter.attr(y2,sign * innerTickSize);textEnter.attr(y1,sign * tickSpacing);lineUpdate.attr(x2,0).attr(y2,sign * innerTickSize);textUpdate.attr(x1,0).attr(y1,sign * tickSpacing);if(scale1.rangeBand){var x=scale1,dx=x.rangeBand() / 2;scale0 = scale1 = function(d){return x(d) + dx;};}else if(scale0.rangeBand){scale0 = scale1;}else {tickExit.call(tickTransform,scale1,scale0);}tickEnter.call(tickTransform,scale0,scale1);tickUpdate.call(tickTransform,scale1,scale1);});}axis.scale = function(x){if(!arguments.length)return scale;scale = x;return axis;};axis.orient = function(x){if(!arguments.length)return orient;orient = x in d3_svg_axisOrients?x + "":d3_svg_axisDefaultOrient;return axis;};axis.ticks = function(){if(!arguments.length)return tickArguments_;tickArguments_ = d3_array(arguments);return axis;};axis.tickValues = function(x){if(!arguments.length)return tickValues;tickValues = x;return axis;};axis.tickFormat = function(x){if(!arguments.length)return tickFormat_;tickFormat_ = x;return axis;};axis.tickSize = function(x){var n=arguments.length;if(!n)return innerTickSize;innerTickSize = +x;outerTickSize = +arguments[n - 1];return axis;};axis.innerTickSize = function(x){if(!arguments.length)return innerTickSize;innerTickSize = +x;return axis;};axis.outerTickSize = function(x){if(!arguments.length)return outerTickSize;outerTickSize = +x;return axis;};axis.tickPadding = function(x){if(!arguments.length)return tickPadding;tickPadding = +x;return axis;};axis.tickSubdivide = function(){return arguments.length && axis;};return axis;};var d3_svg_axisDefaultOrient="bottom",d3_svg_axisOrients={top:1,right:1,bottom:1,left:1};function d3_svg_axisX(selection,x0,x1){selection.attr("transform",function(d){var v0=x0(d);return "translate(" + (isFinite(v0)?v0:x1(d)) + ",0)";});}function d3_svg_axisY(selection,y0,y1){selection.attr("transform",function(d){var v0=y0(d);return "translate(0," + (isFinite(v0)?v0:y1(d)) + ")";});}d3.svg.brush = function(){var event=d3_eventDispatch(brush,"brushstart","brush","brushend"),x=null,y=null,xExtent=[0,0],yExtent=[0,0],xExtentDomain,yExtentDomain,xClamp=true,yClamp=true,resizes=d3_svg_brushResizes[0];function brush(g){g.each(function(){var g=d3.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",brushstart).on("touchstart.brush",brushstart);var background=g.selectAll(".background").data([0]);background.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair");g.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var resize=g.selectAll(".resize").data(resizes,d3_identity);resize.exit().remove();resize.enter().append("g").attr("class",function(d){return "resize " + d;}).style("cursor",function(d){return d3_svg_brushCursor[d];}).append("rect").attr("x",function(d){return (/[ew]$/.test(d)?-3:null);}).attr("y",function(d){return (/^[ns]/.test(d)?-3:null);}).attr("width",6).attr("height",6).style("visibility","hidden");resize.style("display",brush.empty()?"none":null);var gUpdate=d3.transition(g),backgroundUpdate=d3.transition(background),range;if(x){range = d3_scaleRange(x);backgroundUpdate.attr("x",range[0]).attr("width",range[1] - range[0]);redrawX(gUpdate);}if(y){range = d3_scaleRange(y);backgroundUpdate.attr("y",range[0]).attr("height",range[1] - range[0]);redrawY(gUpdate);}redraw(gUpdate);});}brush.event = function(g){g.each(function(){var event_=event.of(this,arguments),extent1={x:xExtent,y:yExtent,i:xExtentDomain,j:yExtentDomain},extent0=this.__chart__ || extent1;this.__chart__ = extent1;if(d3_transitionInheritId){d3.select(this).transition().each("start.brush",function(){xExtentDomain = extent0.i;yExtentDomain = extent0.j;xExtent = extent0.x;yExtent = extent0.y;event_({type:"brushstart"});}).tween("brush:brush",function(){var xi=d3_interpolateArray(xExtent,extent1.x),yi=d3_interpolateArray(yExtent,extent1.y);xExtentDomain = yExtentDomain = null;return function(t){xExtent = extent1.x = xi(t);yExtent = extent1.y = yi(t);event_({type:"brush",mode:"resize"});};}).each("end.brush",function(){xExtentDomain = extent1.i;yExtentDomain = extent1.j;event_({type:"brush",mode:"resize"});event_({type:"brushend"});});}else {event_({type:"brushstart"});event_({type:"brush",mode:"resize"});event_({type:"brushend"});}});};function redraw(g){g.selectAll(".resize").attr("transform",function(d){return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";});}function redrawX(g){g.select(".extent").attr("x",xExtent[0]);g.selectAll(".extent,.n>rect,.s>rect").attr("width",xExtent[1] - xExtent[0]);}function redrawY(g){g.select(".extent").attr("y",yExtent[0]);g.selectAll(".extent,.e>rect,.w>rect").attr("height",yExtent[1] - yExtent[0]);}function brushstart(){var target=this,eventTarget=d3.select(d3.event.target),event_=event.of(target,arguments),g=d3.select(target),resizing=eventTarget.datum(),resizingX=!/^(n|s)$/.test(resizing) && x,resizingY=!/^(e|w)$/.test(resizing) && y,dragging=eventTarget.classed("extent"),dragRestore=d3_event_dragSuppress(target),center,origin=d3.mouse(target),offset;var w=d3.select(d3_window(target)).on("keydown.brush",keydown).on("keyup.brush",keyup);if(d3.event.changedTouches){w.on("touchmove.brush",brushmove).on("touchend.brush",brushend);}else {w.on("mousemove.brush",brushmove).on("mouseup.brush",brushend);}g.interrupt().selectAll("*").interrupt();if(dragging){origin[0] = xExtent[0] - origin[0];origin[1] = yExtent[0] - origin[1];}else if(resizing){var ex=+/w$/.test(resizing),ey=+/^n/.test(resizing);offset = [xExtent[1 - ex] - origin[0],yExtent[1 - ey] - origin[1]];origin[0] = xExtent[ex];origin[1] = yExtent[ey];}else if(d3.event.altKey)center = origin.slice();g.style("pointer-events","none").selectAll(".resize").style("display",null);d3.select("body").style("cursor",eventTarget.style("cursor"));event_({type:"brushstart"});brushmove();function keydown(){if(d3.event.keyCode == 32){if(!dragging){center = null;origin[0] -= xExtent[1];origin[1] -= yExtent[1];dragging = 2;}d3_eventPreventDefault();}}function keyup(){if(d3.event.keyCode == 32 && dragging == 2){origin[0] += xExtent[1];origin[1] += yExtent[1];dragging = 0;d3_eventPreventDefault();}}function brushmove(){var point=d3.mouse(target),moved=false;if(offset){point[0] += offset[0];point[1] += offset[1];}if(!dragging){if(d3.event.altKey){if(!center)center = [(xExtent[0] + xExtent[1]) / 2,(yExtent[0] + yExtent[1]) / 2];origin[0] = xExtent[+(point[0] < center[0])];origin[1] = yExtent[+(point[1] < center[1])];}else center = null;}if(resizingX && move1(point,x,0)){redrawX(g);moved = true;}if(resizingY && move1(point,y,1)){redrawY(g);moved = true;}if(moved){redraw(g);event_({type:"brush",mode:dragging?"move":"resize"});}}function move1(point,scale,i){var range=d3_scaleRange(scale),r0=range[0],r1=range[1],position=origin[i],extent=i?yExtent:xExtent,size=extent[1] - extent[0],min,max;if(dragging){r0 -= position;r1 -= size + position;}min = (i?yClamp:xClamp)?Math.max(r0,Math.min(r1,point[i])):point[i];if(dragging){max = (min += position) + size;}else {if(center)position = Math.max(r0,Math.min(r1,2 * center[i] - min));if(position < min){max = min;min = position;}else {max = position;}}if(extent[0] != min || extent[1] != max){if(i)yExtentDomain = null;else xExtentDomain = null;extent[0] = min;extent[1] = max;return true;}}function brushend(){brushmove();g.style("pointer-events","all").selectAll(".resize").style("display",brush.empty()?"none":null);d3.select("body").style("cursor",null);w.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null);dragRestore();event_({type:"brushend"});}}brush.x = function(z){if(!arguments.length)return x;x = z;resizes = d3_svg_brushResizes[!x << 1 | !y];return brush;};brush.y = function(z){if(!arguments.length)return y;y = z;resizes = d3_svg_brushResizes[!x << 1 | !y];return brush;};brush.clamp = function(z){if(!arguments.length)return x && y?[xClamp,yClamp]:x?xClamp:y?yClamp:null;if(x && y)xClamp = !!z[0],yClamp = !!z[1];else if(x)xClamp = !!z;else if(y)yClamp = !!z;return brush;};brush.extent = function(z){var x0,x1,y0,y1,t;if(!arguments.length){if(x){if(xExtentDomain){x0 = xExtentDomain[0],x1 = xExtentDomain[1];}else {x0 = xExtent[0],x1 = xExtent[1];if(x.invert)x0 = x.invert(x0),x1 = x.invert(x1);if(x1 < x0)t = x0,x0 = x1,x1 = t;}}if(y){if(yExtentDomain){y0 = yExtentDomain[0],y1 = yExtentDomain[1];}else {y0 = yExtent[0],y1 = yExtent[1];if(y.invert)y0 = y.invert(y0),y1 = y.invert(y1);if(y1 < y0)t = y0,y0 = y1,y1 = t;}}return x && y?[[x0,y0],[x1,y1]]:x?[x0,x1]:y && [y0,y1];}if(x){x0 = z[0],x1 = z[1];if(y)x0 = x0[0],x1 = x1[0];xExtentDomain = [x0,x1];if(x.invert)x0 = x(x0),x1 = x(x1);if(x1 < x0)t = x0,x0 = x1,x1 = t;if(x0 != xExtent[0] || x1 != xExtent[1])xExtent = [x0,x1];}if(y){y0 = z[0],y1 = z[1];if(x)y0 = y0[1],y1 = y1[1];yExtentDomain = [y0,y1];if(y.invert)y0 = y(y0),y1 = y(y1);if(y1 < y0)t = y0,y0 = y1,y1 = t;if(y0 != yExtent[0] || y1 != yExtent[1])yExtent = [y0,y1];}return brush;};brush.clear = function(){if(!brush.empty()){xExtent = [0,0],yExtent = [0,0];xExtentDomain = yExtentDomain = null;}return brush;};brush.empty = function(){return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];};return d3.rebind(brush,event,"on");};var d3_svg_brushCursor={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"};var d3_svg_brushResizes=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]];var d3_time_format=d3_time.format = d3_locale_enUS.timeFormat;var d3_time_formatUtc=d3_time_format.utc;var d3_time_formatIso=d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")?d3_time_formatIsoNative:d3_time_formatIso;function d3_time_formatIsoNative(date){return date.toISOString();}d3_time_formatIsoNative.parse = function(string){var date=new Date(string);return isNaN(date)?null:date;};d3_time_formatIsoNative.toString = d3_time_formatIso.toString;d3_time.second = d3_time_interval(function(date){return new d3_date(Math.floor(date / 1e3) * 1e3);},function(date,offset){date.setTime(date.getTime() + Math.floor(offset) * 1e3);},function(date){return date.getSeconds();});d3_time.seconds = d3_time.second.range;d3_time.seconds.utc = d3_time.second.utc.range;d3_time.minute = d3_time_interval(function(date){return new d3_date(Math.floor(date / 6e4) * 6e4);},function(date,offset){date.setTime(date.getTime() + Math.floor(offset) * 6e4);},function(date){return date.getMinutes();});d3_time.minutes = d3_time.minute.range;d3_time.minutes.utc = d3_time.minute.utc.range;d3_time.hour = d3_time_interval(function(date){var timezone=date.getTimezoneOffset() / 60;return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);},function(date,offset){date.setTime(date.getTime() + Math.floor(offset) * 36e5);},function(date){return date.getHours();});d3_time.hours = d3_time.hour.range;d3_time.hours.utc = d3_time.hour.utc.range;d3_time.month = d3_time_interval(function(date){date = d3_time.day(date);date.setDate(1);return date;},function(date,offset){date.setMonth(date.getMonth() + offset);},function(date){return date.getMonth();});d3_time.months = d3_time.month.range;d3_time.months.utc = d3_time.month.utc.range;function d3_time_scale(linear,methods,format){function scale(x){return linear(x);}scale.invert = function(x){return d3_time_scaleDate(linear.invert(x));};scale.domain = function(x){if(!arguments.length)return linear.domain().map(d3_time_scaleDate);linear.domain(x);return scale;};function tickMethod(extent,count){var span=extent[1] - extent[0],target=span / count,i=d3.bisect(d3_time_scaleSteps,target);return i == d3_time_scaleSteps.length?[methods.year,d3_scale_linearTickRange(extent.map(function(d){return d / 31536e6;}),count)[2]]:!i?[d3_time_scaleMilliseconds,d3_scale_linearTickRange(extent,count)[2]]:methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target?i - 1:i];}scale.nice = function(interval,skip){var domain=scale.domain(),extent=d3_scaleExtent(domain),method=interval == null?tickMethod(extent,10):typeof interval === "number" && tickMethod(extent,interval);if(method)interval = method[0],skip = method[1];function skipped(date){return !isNaN(date) && !interval.range(date,d3_time_scaleDate(+date + 1),skip).length;}return scale.domain(d3_scale_nice(domain,skip > 1?{floor:function floor(date){while(skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);return date;},ceil:function ceil(date){while(skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);return date;}}:interval));};scale.ticks = function(interval,skip){var extent=d3_scaleExtent(scale.domain()),method=interval == null?tickMethod(extent,10):typeof interval === "number"?tickMethod(extent,interval):!interval.range && [{range:interval},skip];if(method)interval = method[0],skip = method[1];return interval.range(extent[0],d3_time_scaleDate(+extent[1] + 1),skip < 1?1:skip);};scale.tickFormat = function(){return format;};scale.copy = function(){return d3_time_scale(linear.copy(),methods,format);};return d3_scale_linearRebind(scale,linear);}function d3_time_scaleDate(t){return new Date(t);}var d3_time_scaleSteps=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6];var d3_time_scaleLocalMethods=[[d3_time.second,1],[d3_time.second,5],[d3_time.second,15],[d3_time.second,30],[d3_time.minute,1],[d3_time.minute,5],[d3_time.minute,15],[d3_time.minute,30],[d3_time.hour,1],[d3_time.hour,3],[d3_time.hour,6],[d3_time.hour,12],[d3_time.day,1],[d3_time.day,2],[d3_time.week,1],[d3_time.month,1],[d3_time.month,3],[d3_time.year,1]];var d3_time_scaleLocalFormat=d3_time_format.multi([[".%L",function(d){return d.getMilliseconds();}],[":%S",function(d){return d.getSeconds();}],["%I:%M",function(d){return d.getMinutes();}],["%I %p",function(d){return d.getHours();}],["%a %d",function(d){return d.getDay() && d.getDate() != 1;}],["%b %d",function(d){return d.getDate() != 1;}],["%B",function(d){return d.getMonth();}],["%Y",d3_true]]);var d3_time_scaleMilliseconds={range:function range(start,stop,step){return d3.range(Math.ceil(start / step) * step,+stop,step).map(d3_time_scaleDate);},floor:d3_identity,ceil:d3_identity};d3_time_scaleLocalMethods.year = d3_time.year;d3_time.scale = function(){return d3_time_scale(d3.scale.linear(),d3_time_scaleLocalMethods,d3_time_scaleLocalFormat);};var d3_time_scaleUtcMethods=d3_time_scaleLocalMethods.map(function(m){return [m[0].utc,m[1]];});var d3_time_scaleUtcFormat=d3_time_formatUtc.multi([[".%L",function(d){return d.getUTCMilliseconds();}],[":%S",function(d){return d.getUTCSeconds();}],["%I:%M",function(d){return d.getUTCMinutes();}],["%I %p",function(d){return d.getUTCHours();}],["%a %d",function(d){return d.getUTCDay() && d.getUTCDate() != 1;}],["%b %d",function(d){return d.getUTCDate() != 1;}],["%B",function(d){return d.getUTCMonth();}],["%Y",d3_true]]);d3_time_scaleUtcMethods.year = d3_time.year.utc;d3_time.scale.utc = function(){return d3_time_scale(d3.scale.linear(),d3_time_scaleUtcMethods,d3_time_scaleUtcFormat);};d3.text = d3_xhrType(function(request){return request.responseText;});d3.json = function(url,callback){return d3_xhr(url,"application/json",d3_json,callback);};function d3_json(request){return JSON.parse(request.responseText);}d3.html = function(url,callback){return d3_xhr(url,"text/html",d3_html,callback);};function d3_html(request){var range=d3_document.createRange();range.selectNode(d3_document.body);return range.createContextualFragment(request.responseText);}d3.xml = d3_xhrType(function(request){return request.responseXML;});if(true)!(__WEBPACK_AMD_DEFINE_FACTORY__ = (this.d3 = d3), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if(typeof module === "object" && module.exports)module.exports = d3;else this.d3 = d3;})();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(6);
	module.exports = function defineProperty(it, key, desc) {
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var $Object = Object;
	module.exports = {
	  create: $Object.create,
	  getProto: $Object.getPrototypeOf,
	  isEnum: ({}).propertyIsEnumerable,
	  getDesc: $Object.getOwnPropertyDescriptor,
	  setDesc: $Object.defineProperty,
	  setDescs: $Object.defineProperties,
	  getKeys: $Object.keys,
	  getNames: $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each: [].forEach
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(6);
	module.exports = function create(P, D) {
	  return $.create(P, D);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	'use strict';

	exports = module.exports = __webpack_require__(10);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return 'WebkitAppearance' in document.documentElement.style ||
	  // is firebug? http://stackoverflow.com/a/398120/376773
	  window.console && (console.firebug || console.exception && console.table) ||
	  // is firefox >= v31?
	  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function (v) {
	  return JSON.stringify(v);
	};

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function (match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch (e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch (e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	'use strict';

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(11);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {}
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	'use strict';

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long ? long(val) : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	'use strict';

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function (event, fn) {
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function (event) {
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1),
	      callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function (event) {
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function (event) {
	  return !!this.listeners(event).length;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var each = __webpack_require__(14);
	var debug = __webpack_require__(9)('transitive:network');
	var Emitter = __webpack_require__(12);

	var NetworkPath = __webpack_require__(18);
	var Route = __webpack_require__(21);
	var RoutePattern = __webpack_require__(22);
	var Journey = __webpack_require__(26);

	var Stop = __webpack_require__(34);
	var Place = __webpack_require__(47);
	var PointClusterMap = __webpack_require__(48);
	var RenderedEdge = __webpack_require__(51);
	var RenderedSegment = __webpack_require__(52);

	var Graph = __webpack_require__(53);

	var Polyline = __webpack_require__(33);
	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	/**
	 * Expose `Network`
	 */

	module.exports = Network;

	/**
	 *
	 */

	function Network(transitive, data) {
	  this.transitive = transitive;

	  this.routes = {};
	  this.stops = {};
	  this.patterns = {};
	  this.places = {};
	  this.journeys = {};
	  this.paths = [];
	  this.baseVertexPoints = [];
	  this.graph = new Graph(this, []);

	  if (data) this.load(data);
	}

	/**
	 * Mixin `Emitter`
	 */

	Emitter(Network.prototype);

	/**
	 * Load
	 *
	 * @param {Object} data
	 */

	Network.prototype.load = function (data) {
	  debug('loading', data);
	  var self = this;

	  // check data
	  if (!data) data = {};

	  // Store data
	  this.data = data;

	  // A list of points (stops & places) that will always become vertices in the network
	  // graph (regardless of zoom scale). This includes all points that serve as a segment
	  // endpoint and/or a convergence/divergence point between segments
	  this.baseVertexPoints = [];

	  // object maps stop ids to arrays of unique stop_ids reachable from that stop
	  this.adjacentStops = {};

	  // maps lat_lon key to unique TurnPoint object
	  this.turnPoints = {};

	  // Copy/decode the streetEdge objects
	  this.streetEdges = {};
	  each(data.streetEdges, function (data) {
	    var latLons = Polyline.decode(data.geometry.points);
	    var coords = [];
	    each(latLons, function (latLon) {
	      coords.push(sm.forward([latLon[1], latLon[0]]));
	    });
	    this.streetEdges[data.edge_id] = {
	      latLons: latLons,
	      worldCoords: coords,
	      length: data.geometry.length
	    };
	  }, this);

	  // Generate the route objects
	  this.routes = {};
	  each(data.routes, function (data) {
	    this.routes[data.route_id] = new Route(data);
	  }, this);

	  // Generate the stop objects
	  this.stops = {};
	  each(data.stops, function (data) {
	    this.stops[data.stop_id] = new Stop(data);
	  }, this);

	  // Generate the pattern objects
	  this.patterns = {};
	  each(data.patterns, function (data) {
	    var pattern = new RoutePattern(data, this);
	    this.patterns[data.pattern_id] = pattern;
	    var route = this.routes[data.route_id];
	    if (route) {
	      route.addPattern(pattern);
	      pattern.route = route;
	    } else {
	      debug('Error: pattern ' + data.pattern_id + ' refers to route that was not found: ' + data.route_id);
	    }
	    if (pattern.render) this.paths.push(pattern.createPath());
	  }, this);

	  // Generate the place objects
	  this.places = {};
	  each(data.places, function (data) {
	    var place = this.places[data.place_id] = new Place(data, this);
	    this.addVertexPoint(place);
	  }, this);

	  // Generate the internal Journey objects
	  this.journeys = {};
	  each(data.journeys, function (journeyData) {
	    var journey = new Journey(journeyData, this);
	    this.journeys[journeyData.journey_id] = journey;
	    this.paths.push(journey.path);
	  }, this);

	  // process the path segments
	  for (var p = 0; p < this.paths.length; p++) {
	    var path = this.paths[p];
	    for (var s = 0; s < path.segments.length; s++) {
	      this.processSegment(path.segments[s]);
	    }
	  }

	  // when rendering pattern paths only, determine convergence/divergence vertex
	  // stops by looking for stops w/ >2 adjacent stops
	  if (!data.journeys || data.journeys.length === 0) {
	    for (var stopId in this.adjacentStops) {
	      if (this.adjacentStops[stopId].length > 2) {
	        this.addVertexPoint(this.stops[stopId]);
	      }
	    }
	  }

	  // determine which TurnPoints should be base vertices
	  var turnLookup = {};
	  var addTurn = function addTurn(turn1, turn2) {
	    if (!(turn1.getId() in turnLookup)) turnLookup[turn1.getId()] = [];
	    if (turnLookup[turn1.getId()].indexOf(turn2) === -1) turnLookup[turn1.getId()].push(turn2);
	  };
	  each(this.streetEdges, function (streetEdgeId) {
	    var streetEdge = self.streetEdges[streetEdgeId];
	    if (streetEdge.fromTurnPoint && streetEdge.toTurnPoint) {
	      addTurn(streetEdge.toTurnPoint, streetEdge.fromTurnPoint);
	      addTurn(streetEdge.fromTurnPoint, streetEdge.toTurnPoint);
	    }
	  });
	  each(turnLookup, function (turnPointId) {
	    var count = turnLookup[turnPointId].length;
	    if (count > 2) self.addVertexPoint(self.turnPoints[turnPointId]);
	  });

	  this.createGraph();

	  this.loaded = true;
	  this.emit('load', this);
	  return this;
	};

	/** Graph Creation/Processing Methods **/

	Network.prototype.clearGraphData = function () {
	  each(this.paths, function (path) {
	    path.clearGraphData();
	  });
	};

	Network.prototype.createGraph = function () {
	  this.applyZoomFactors(this.transitive.display.activeZoomFactors);

	  // clear previous graph-specific data
	  if (this.pointClusterMap) this.pointClusterMap.clearMultiPoints();
	  each(this.stops, function (stopId) {
	    this.stops[stopId].setFocused(true);
	  }, this);

	  // create the list of vertex points
	  var vertexPoints;
	  if (this.mergeVertexThreshold && this.mergeVertexThreshold > 0) {
	    this.pointClusterMap = new PointClusterMap(this, this.mergeVertexThreshold);
	    vertexPoints = this.pointClusterMap.getVertexPoints(this.baseVertexPoints);
	  } else vertexPoints = this.baseVertexPoints;

	  // core graph creation steps
	  this.graph = new Graph(this, vertexPoints);
	  this.populateGraphEdges();
	  this.graph.pruneVertices();
	  this.createInternalVertexPoints();
	  if (this.isSnapping()) this.graph.snapToGrid(this.gridCellSize);
	  this.graph.sortVertices();

	  // other post-processing actions
	  this.annotateTransitPoints();
	  //this.initPlaceAdjacency();
	  this.createRenderedSegments();
	  this.transitive.labeler.updateLabelList(this.graph);
	  this.updateGeometry(true);
	};

	Network.prototype.isSnapping = function () {
	  return this.gridCellSize && this.gridCellSize !== 0;
	};

	/*
	 * identify and populate the 'internal' vertex points, which is zoom-level specfic
	 */

	Network.prototype.createInternalVertexPoints = function () {

	  this.internalVertexPoints = [];

	  for (var i in this.graph.edgeGroups) {
	    var edgeGroup = this.graph.edgeGroups[i];

	    var wlen = edgeGroup.getWorldLength();

	    var splitPoints = [];

	    // compute the maximum number of internal points for this edge to add as graph vertices
	    if (edgeGroup.hasTransit()) {
	      var vertexFactor = this.internalVertexFactor; //!edgeGroup.hasTransit() ? 1 : this.internalVertexFactor;
	      var newVertexCount = Math.floor(wlen / vertexFactor);

	      // get the priority queue of the edge's internal points
	      var pq = edgeGroup.getInternalVertexPQ();

	      // pull the 'best' points from the queue until we reach the maximum
	      while (splitPoints.length < newVertexCount && pq.size() > 0) {
	        var el = pq.deq();
	        splitPoints.push(el.point);
	      }
	    }

	    // perform the split operation (if needed)
	    if (splitPoints.length > 0) {
	      for (var e = 0; e < edgeGroup.edges.length; e++) {
	        var edge = edgeGroup.edges[e];
	        this.graph.splitEdgeAtInternalPoints(edge, splitPoints);
	      }
	    }
	  }
	};

	Network.prototype.updateGeometry = function () {

	  // clear the stop render data
	  //for (var key in this.stops) this.stops[key].renderData = [];

	  this.graph.vertices.forEach(function (vertex) {
	    //vertex.snapped = false;
	    vertex.point.clearRenderData();
	  });

	  // refresh the edge-based points
	  this.graph.edges.forEach(function (edge) {
	    edge.pointArray.forEach(function (point) {
	      point.clearRenderData();
	    });
	  });

	  this.renderedEdges.forEach(function (rEdge) {
	    rEdge.clearOffsets();
	  });

	  //if (snapGrid)
	  //if(this.gridCellSize && this.gridCellSize !== 0) this.graph.snapToGrid(this.gridCellSize);

	  //this.fixPointOverlaps();

	  this.graph.calculateGeometry(this.gridCellSize, this.angleConstraint);

	  this.graph.apply2DOffsets(this);
	};

	Network.prototype.applyZoomFactors = function (factors) {
	  this.gridCellSize = factors.gridCellSize;
	  this.internalVertexFactor = factors.internalVertexFactor;
	  this.angleConstraint = factors.angleConstraint;
	  this.mergeVertexThreshold = factors.mergeVertexThreshold;
	};

	/**
	 *
	 */

	Network.prototype.processSegment = function (segment) {

	  // iterate through this pattern's stops, associating stops/patterns with
	  // each other and initializing the adjacentStops table
	  var previousStop = null;
	  for (var i = 0; i < segment.points.length; i++) {
	    var point = segment.points[i];
	    point.used = true;

	    // called for each pair of adjacent stops in sequence
	    if (previousStop && point.getType() === 'STOP') {
	      this.addStopAdjacency(point.getId(), previousStop.getId());
	      this.addStopAdjacency(previousStop.getId(), point.getId());
	    }

	    previousStop = point.getType() === 'STOP' ? point : null;

	    // add the start and end points to the vertexStops collection
	    var startPoint = segment.points[0];
	    this.addVertexPoint(startPoint);
	    startPoint.isSegmentEndPoint = true;

	    var endPoint = segment.points[segment.points.length - 1];
	    this.addVertexPoint(endPoint);
	    endPoint.isSegmentEndPoint = true;
	  }
	};

	/**
	 * Helper function for stopAjacency table
	 *
	 * @param {Stop} adjacent stops list
	 * @param {Stop} stopA
	 * @param {Stop} stopB
	 */

	Network.prototype.addStopAdjacency = function (stopIdA, stopIdB) {
	  if (!this.adjacentStops[stopIdA]) this.adjacentStops[stopIdA] = [];
	  if (this.adjacentStops[stopIdA].indexOf(stopIdB) === -1) this.adjacentStops[stopIdA].push(stopIdB);
	};

	/**
	 * Populate the graph edges
	 */

	Network.prototype.populateGraphEdges = function () {
	  var self = this;
	  // vertex associated with the last vertex point we passed in this sequence
	  var lastVertex = null;

	  // collection of 'internal' (i.e. non-vertex) points passed
	  // since the last vertex point
	  var internalPoints = [];

	  var streetEdges = {};

	  each(this.paths, function (path) {
	    each(path.segments, function (segment) {

	      lastVertex = null;

	      var streetEdgeIndex = 0;
	      var geomCoords = []; // the geographic coordinates for the graph edge currently being constructed
	      each(segment.points, function (point, index) {

	        if (segment.streetEdges) {
	          for (var i = streetEdgeIndex; i < segment.streetEdges.length; i++) {
	            if (index === 0) break;

	            geomCoords = geomCoords.concat(geomCoords.length > 0 ? segment.streetEdges[i].worldCoords.slice(1) : segment.streetEdges[i].worldCoords);
	            if (segment.streetEdges[i].toTurnPoint === point) {
	              streetEdgeIndex = i + 1;
	              break;
	            }
	          }
	        }

	        if (point.multipoint) point = point.multipoint;

	        if (point.graphVertex) {
	          // this is a vertex point
	          if (lastVertex !== null) {
	            if (lastVertex.point === point) return;

	            // see if an equivalent graph edge already exists
	            var fromVertex = lastVertex,
	                toVertex = point.graphVertex;
	            var edge = this.graph.getEquivalentEdge(internalPoints, fromVertex, toVertex);

	            // create a new graph edge if necessary
	            if (!edge) {
	              edge = this.graph.addEdge(internalPoints, fromVertex, toVertex, segment.getType());
	              if (geomCoords && geomCoords.length > 0) edge.geomCoords = geomCoords;
	            }

	            // associate the graph edge and path segment with each other
	            segment.addEdge(edge, fromVertex);
	            edge.addPathSegment(segment);

	            geomCoords = []; // reset the geom coords array for the next edge
	          }

	          lastVertex = point.graphVertex;
	          internalPoints = [];
	        } else {
	          // this is an internal point
	          internalPoints.push(point);
	        }
	      }, this);
	      //}
	    }, this);
	  }, this);
	};

	Network.prototype.createGraphEdge = function (segment, fromVertex, toVertex, internalPoints, geomCoords) {

	  var edge = this.graph.getEquivalentEdge(internalPoints, fromVertex, toVertex);

	  if (!edge) {
	    edge = this.graph.addEdge(internalPoints, fromVertex, toVertex, segment.getType());

	    // calculate the angle and apply to edge stops
	    /*var dx = fromVertex.x - toVertex.x;
	    var dy = fromVertex.y - toVertex.y;
	    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
	    point.angle = lastVertex.point.angle = angle;
	    for (var is = 0; is < internalPoints.length; is++) {
	      internalPoints[is].angle = angle;
	    }*/

	    if (geomCoords) edge.geomCoords = geomCoords;

	    debug("--- created edge " + edge.toString());
	    debug(edge);
	    each(edge.geomCoords, function (c) {
	      debug(c);
	    });
	  }

	  segment.addEdge(edge, fromVertex);
	  edge.addPathSegment(segment);
	};

	Network.prototype.annotateTransitPoints = function () {
	  var lookup = {};

	  this.paths.forEach(function (path) {

	    var transitSegments = [];
	    path.segments.forEach(function (pathSegment) {
	      if (pathSegment.type === 'TRANSIT') transitSegments.push(pathSegment);
	    });

	    path.segments.forEach(function (pathSegment) {
	      if (pathSegment.type === 'TRANSIT') {

	        // if first transit segment in path, mark 'from' endpoint as board point
	        if (transitSegments.indexOf(pathSegment) === 0) {
	          pathSegment.points[0].isBoardPoint = true;

	          // if there are additional transit segments, mark the 'to' endpoint as a transfer point
	          if (transitSegments.length > 1) pathSegment.points[pathSegment.points.length - 1].isTransferPoint = true;
	        }

	        // if last transit segment in path, mark 'to' endpoint as alight point
	        else if (transitSegments.indexOf(pathSegment) === transitSegments.length - 1) {
	            pathSegment.points[pathSegment.points.length - 1].isAlightPoint = true;

	            // if there are additional transit segments, mark the 'from' endpoint as a transfer point
	            if (transitSegments.length > 1) pathSegment.points[0].isTransferPoint = true;
	          }

	          // if this is an 'internal' transit segment, mark both endpoints as transfer points
	          else if (transitSegments.length > 2) {
	              pathSegment.points[0].isTransferPoint = true;
	              pathSegment.points[pathSegment.points.length - 1].isTransferPoint = true;
	            }
	      }
	    });
	  });
	};

	Network.prototype.initPlaceAdjacency = function () {
	  each(this.places, function (placeId) {
	    var place = this.places[placeId];
	    if (!place.graphVertex) return;
	    each(place.graphVertex.incidentEdges(), function (edge) {
	      var oppVertex = edge.oppositeVertex(place.graphVertex);
	      if (oppVertex.point) {
	        oppVertex.point.adjacentPlace = place;
	      }
	    });
	  }, this);
	};

	Network.prototype.createRenderedSegments = function () {
	  this.reLookup = {};
	  this.renderedEdges = [];
	  this.renderedSegments = [];

	  for (var patternId in this.patterns) {
	    this.patterns[patternId].renderedEdges = [];
	  }

	  each(this.paths, function (path) {

	    each(path.segments, function (pathSegment) {
	      pathSegment.renderedSegments = [];

	      if (pathSegment.type === 'TRANSIT') {

	        // create a RenderedSegment for each pattern, except for buses which are collapsed to a single segment
	        var busPatterns = [];
	        each(pathSegment.getPatterns(), function (pattern) {
	          if (pattern.route.route_type === 3) busPatterns.push(pattern);else this.createRenderedSegment(pathSegment, [pattern]);
	        }, this);
	        if (busPatterns.length > 0) {
	          this.createRenderedSegment(pathSegment, busPatterns);
	        }
	      } else {
	        // non-transit segments
	        this.createRenderedSegment(pathSegment);
	      }
	    }, this);
	  }, this);

	  this.renderedEdges.sort(function (a, b) {
	    // process render transit segments before walk
	    if (a.getType() === 'WALK') return 1;
	    if (b.getType() === 'WALK') return -1;
	  });
	};

	Network.prototype.createRenderedSegment = function (pathSegment, patterns) {

	  var rSegment = new RenderedSegment(pathSegment);

	  each(pathSegment.edges, function (edge) {
	    var rEdge = this.createRenderedEdge(pathSegment, edge.graphEdge, edge.forward, patterns);
	    rSegment.addRenderedEdge(rEdge);
	  }, this);
	  if (patterns) {
	    rSegment.patterns = patterns;
	    rSegment.mode = patterns[0].route.route_type;
	  }

	  pathSegment.addRenderedSegment(rSegment);
	};

	Network.prototype.createRenderedEdge = function (pathSegment, gEdge, forward, patterns) {
	  var rEdge;

	  // construct the edge key, disregarding mode qualifiers (e.g. "_RENT")
	  var type = pathSegment.getType().split('_')[0];
	  var key = gEdge.id + (forward ? 'F' : 'R') + '_' + type;

	  // for non-bus transit edges, append an exemplar pattern ID to the key
	  if (patterns && patterns[0].route.route_type !== 3) {
	    key += '_' + patterns[0].getId();
	  }

	  // see if this r-edge already exists
	  if (key in this.reLookup) {
	    rEdge = this.reLookup[key];
	  } else {
	    // if not, create it
	    rEdge = new RenderedEdge(gEdge, forward, type);
	    if (patterns) {
	      each(patterns, function (pattern) {
	        pattern.addRenderedEdge(rEdge);
	        rEdge.addPattern(pattern);
	      });
	      rEdge.mode = patterns[0].route.route_type;
	    }
	    rEdge.points.push(gEdge.fromVertex.point);
	    rEdge.points.push(gEdge.toVertex.point);
	    gEdge.addRenderedEdge(rEdge);
	    rEdge.addPathSegment(pathSegment);

	    this.renderedEdges.push(rEdge);
	    this.reLookup[key] = rEdge;
	  }
	  return rEdge;
	};

	Network.prototype.addVertexPoint = function (point) {
	  if (this.baseVertexPoints.indexOf(point) !== -1) return;
	  this.baseVertexPoints.push(point);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	'use strict';

	try {
	  var type = __webpack_require__(15);
	} catch (err) {
	  var type = __webpack_require__(15);
	}

	var toFunction = __webpack_require__(16);

	/**
	 * HOP reference.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Iterate the given `obj` and invoke `fn(val, i)`
	 * in optional context `ctx`.
	 *
	 * @param {String|Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} [ctx]
	 * @api public
	 */

	module.exports = function (obj, fn, ctx) {
	  fn = toFunction(fn);
	  ctx = ctx || this;
	  switch (type(obj)) {
	    case 'array':
	      return array(obj, fn, ctx);
	    case 'object':
	      if ('number' == typeof obj.length) return array(obj, fn, ctx);
	      return object(obj, fn, ctx);
	    case 'string':
	      return string(obj, fn, ctx);
	  }
	};

	/**
	 * Iterate string chars.
	 *
	 * @param {String} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function string(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj.charAt(i), i);
	  }
	}

	/**
	 * Iterate object keys.
	 *
	 * @param {Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function object(obj, fn, ctx) {
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      fn.call(ctx, key, obj[key]);
	    }
	  }
	}

	/**
	 * Iterate array-ish.
	 *
	 * @param {Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function array(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj[i], i);
	  }
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	
	/**
	 * toString ref.
	 */

	'use strict';

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function (val) {
	  switch (toString.call(val)) {
	    case '[object Function]':
	      return 'function';
	    case '[object Date]':
	      return 'date';
	    case '[object RegExp]':
	      return 'regexp';
	    case '[object Arguments]':
	      return 'arguments';
	    case '[object Array]':
	      return 'array';
	    case '[object String]':
	      return 'string';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val && val.nodeType === 1) return 'element';
	  if (val === Object(val)) return 'object';

	  return typeof val;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module Dependencies
	 */

	'use strict';

	var expr;
	try {
	  expr = __webpack_require__(17);
	} catch (e) {
	  expr = __webpack_require__(17);
	}

	/**
	 * Expose `toFunction()`.
	 */

	module.exports = toFunction;

	/**
	 * Convert `obj` to a `Function`.
	 *
	 * @param {Mixed} obj
	 * @return {Function}
	 * @api private
	 */

	function toFunction(obj) {
	  switch (({}).toString.call(obj)) {
	    case '[object Object]':
	      return objectToFunction(obj);
	    case '[object Function]':
	      return obj;
	    case '[object String]':
	      return stringToFunction(obj);
	    case '[object RegExp]':
	      return regexpToFunction(obj);
	    default:
	      return defaultToFunction(obj);
	  }
	}

	/**
	 * Default to strict equality.
	 *
	 * @param {Mixed} val
	 * @return {Function}
	 * @api private
	 */

	function defaultToFunction(val) {
	  return function (obj) {
	    return val === obj;
	  };
	}

	/**
	 * Convert `re` to a function.
	 *
	 * @param {RegExp} re
	 * @return {Function}
	 * @api private
	 */

	function regexpToFunction(re) {
	  return function (obj) {
	    return re.test(obj);
	  };
	}

	/**
	 * Convert property `str` to a function.
	 *
	 * @param {String} str
	 * @return {Function}
	 * @api private
	 */

	function stringToFunction(str) {
	  // immediate such as "> 20"
	  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

	  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
	  return new Function('_', 'return ' + get(str));
	}

	/**
	 * Convert `object` to a function.
	 *
	 * @param {Object} object
	 * @return {Function}
	 * @api private
	 */

	function objectToFunction(obj) {
	  var match = {};
	  for (var key in obj) {
	    match[key] = typeof obj[key] === 'string' ? defaultToFunction(obj[key]) : toFunction(obj[key]);
	  }
	  return function (val) {
	    if (typeof val !== 'object') return false;
	    for (var key in match) {
	      if (!(key in val)) return false;
	      if (!match[key](val[key])) return false;
	    }
	    return true;
	  };
	}

	/**
	 * Built the getter function. Supports getter style functions
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function get(str) {
	  var props = expr(str);
	  if (!props.length) return '_.' + str;

	  var val, i, prop;
	  for (i = 0; i < props.length; i++) {
	    prop = props[i];
	    val = '_.' + prop;
	    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

	    // mimic negative lookbehind to avoid problems with nested properties
	    str = stripNested(prop, str, val);
	  }

	  return str;
	}

	/**
	 * Mimic negative lookbehind to avoid problems with nested properties.
	 *
	 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
	 *
	 * @param {String} prop
	 * @param {String} str
	 * @param {String} val
	 * @return {String}
	 * @api private
	 */

	function stripNested(prop, str, val) {
	  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function ($0, $1) {
	    return $1 ? $0 : val;
	  });
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Global Names
	 */

	'use strict';

	var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

	/**
	 * Return immediate identifiers parsed from `str`.
	 *
	 * @param {String} str
	 * @param {String|Function} map function or prefix
	 * @return {Array}
	 * @api public
	 */

	module.exports = function (str, fn) {
	  var p = unique(props(str));
	  if (fn && 'string' == typeof fn) fn = prefixed(fn);
	  if (fn) return map(str, p, fn);
	  return p;
	};

	/**
	 * Return immediate identifiers in `str`.
	 *
	 * @param {String} str
	 * @return {Array}
	 * @api private
	 */

	function props(str) {
	  return str.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '').replace(globals, '').match(/[a-zA-Z_]\w*/g) || [];
	}

	/**
	 * Return `str` with `props` mapped with `fn`.
	 *
	 * @param {String} str
	 * @param {Array} props
	 * @param {Function} fn
	 * @return {String}
	 * @api private
	 */

	function map(str, props, fn) {
	  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
	  return str.replace(re, function (_) {
	    if ('(' == _[_.length - 1]) return fn(_);
	    if (! ~props.indexOf(_)) return _;
	    return fn(_);
	  });
	}

	/**
	 * Return unique array.
	 *
	 * @param {Array} arr
	 * @return {Array}
	 * @api private
	 */

	function unique(arr) {
	  var ret = [];

	  for (var i = 0; i < arr.length; i++) {
	    if (~ret.indexOf(arr[i])) continue;
	    ret.push(arr[i]);
	  }

	  return ret;
	}

	/**
	 * Map with prefix `str`.
	 */

	function prefixed(str) {
	  return function (_) {
	    return str + _;
	  };
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);

	var interpolateLine = __webpack_require__(19);

	/**
	 * Expose `NetworkPath`
	 */

	module.exports = NetworkPath;

	/**
	 * NetworkPath -- a path through the network graph. Composed of PathSegments (which
	 * are in turn composed of a sequence of graph edges)
	 *
	 * @param {Object} the parent onject (a RoutePattern or Journey)
	 */

	function NetworkPath(parent) {
	  this.parent = parent;
	  this.segments = [];
	}

	NetworkPath.prototype.clearGraphData = function (segment) {
	  this.segments.forEach(function (segment) {
	    segment.clearGraphData();
	  });
	};

	/**
	 * addSegment: add a new segment to the end of this NetworkPath
	 */

	NetworkPath.prototype.addSegment = function (segment) {
	  this.segments.push(segment);
	  segment.points.forEach(function (point) {
	    point.paths.push(this);
	  }, this);
	};

	/** highlight **/

	NetworkPath.prototype.drawHighlight = function (display, capExtension) {

	  this.line = d3.svg.line() // the line translation function
	  .x(function (pointInfo, i) {
	    return display.xScale(pointInfo.x) + (pointInfo.offsetX || 0);
	  }).y(function (pointInfo, i) {
	    return display.yScale(pointInfo.y) - (pointInfo.offsetY || 0);
	  }).interpolate(interpolateLine.bind(this));

	  this.lineGraph = display.svg.append('path').attr('id', 'transitive-path-highlight-' + this.parent.getElementId()).attr('class', 'transitive-path-highlight').style('stroke-width', 24).style('stroke', '#ff4').style('fill', 'none').style('visibility', 'hidden').data([this]);
	};

	NetworkPath.prototype.getRenderedSegments = function () {
	  var renderedSegments = [];
	  this.segments.forEach(function (pathSegment) {
	    renderedSegments = renderedSegments.concat(pathSegment.renderedSegments);
	  });
	  return renderedSegments;
	};

	/**
	 * getPointArray
	 */

	NetworkPath.prototype.getPointArray = function () {
	  var points = [];
	  for (var i = 0; i < this.segments.length; i++) {
	    var segment = this.segments[i];
	    if (i > 0 && segment.points[0] === this.segments[i - 1].points[this.segments[i - 1].points.length - 1]) {
	      points.concat(segment.points.slice(1));
	    } else {
	      points.concat(segment.points);
	    }
	  }
	  return points;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Line interpolation utility function
	 *
	 * @param {Array} points
	 */

	'use strict';

	var Util = __webpack_require__(20);

	module.exports = function (points) {
	  var newPoints, i, r;

	  // determine if we need to resample the path (i.e. place new points at a regular
	  // interval for marker-based styling) based on styler settings
	  var resampleSpacing = this.display.styler.compute(this.display.styler.segments['marker-spacing'], this.display, this.segment);

	  // handle the case of a simple straight line
	  if (points.length === 2) {
	    if (resampleSpacing) {
	      newPoints = [points[0]];
	      newPoints = newPoints.concat(resampleLine(points[0], points[1], resampleSpacing));
	      return newPoints.join(' ');
	    }
	    return points.join(' ');
	  }

	  // otherwise, assume a curved segment

	  if (resampleSpacing) {
	    newPoints = [points[0]];
	    for (i = 1; i < points.length; i++) {
	      if (this.segment.renderData[i].arc) {
	        //debug(this.renderData[i]);
	        //var r = this.renderData[i].radius;
	        //var sweep = (this.renderData[i].arc > 0) ? 0 : 1;
	        //str += 'A ' + r + ',' + r + ' 0 0 ' + sweep + ' ' + points[i];
	        r = this.segment.renderData[i].radius;
	        var theta = this.segment.renderData[i].arc * Math.PI / 180;
	        newPoints = newPoints.concat(resampleArc(points[i - 1], points[i], r, theta, -this.segment.renderData[i].arc, resampleSpacing));
	      } else {
	        newPoints = newPoints.concat(resampleLine(points[i - 1], points[i], resampleSpacing));
	      }
	    }
	    return newPoints.join(' ');
	  } else {
	    var str = points[0];
	    for (i = 1; i < points.length; i++) {
	      if (this.segment.renderData[i].arc) {
	        r = this.segment.renderData[i].radius;
	        var sweep = this.segment.renderData[i].arc > 0 ? 0 : 1;
	        str += 'A ' + r + ',' + r + ' 0 0 ' + sweep + ' ' + points[i];
	      } else {
	        str += 'L' + points[i];
	      }
	    }
	    return str;
	  }
	};

	function resampleLine(startPt, endPt, spacing) {
	  var dx = endPt[0] - startPt[0];
	  var dy = endPt[1] - startPt[1];
	  var len = Math.sqrt(dx * dx + dy * dy);

	  var sampledPts = [startPt];
	  for (var l = spacing; l < len; l += spacing) {
	    var t = l / len;
	    sampledPts.push([startPt[0] + t * dx, startPt[1] + t * dy]);
	  }

	  sampledPts.push(endPt);

	  return sampledPts;
	}

	function resampleArc(startPt, endPt, r, theta, ccw, spacing) {
	  var len = r * Math.abs(theta);

	  var sampledPts = [];
	  for (var l = spacing; l < len; l += spacing) {
	    var t = l / len;
	    var pt = Util.pointAlongArc(startPt[0], startPt[1], endPt[0], endPt[1], r, Math.abs(theta), ccw, t);
	    sampledPts.push([pt.x, pt.y]);
	  }

	  return sampledPts;
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * General Transitive utilities library
	 */

	'use strict';

	var d3 = __webpack_require__(3);

	var tolerance = 0.000001;

	module.exports.fuzzyEquals = function (a, b, tol) {
	  tol = tol || tolerance;
	  return Math.abs(a - b) < tol;
	};

	module.exports.distance = function (x1, y1, x2, y2) {
	  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	};

	module.exports.getRadiusFromAngleChord = function (angleR, chordLen) {
	  return chordLen / 2 / Math.sin(angleR / 2);
	};

	/*
	 * CCW utility function. Accepts 3 coord pairs; result is positive if points
	 * have counterclockwise orientation, negative if clockwise, 0 if collinear.
	 */

	module.exports.ccw = function (ax, ay, bx, by, cx, cy) {
	  var raw = module.exports.ccwRaw(ax, ay, bx, by, cx, cy);
	  return raw === 0 ? 0 : raw / Math.abs(raw);
	};

	module.exports.ccwRaw = function (ax, ay, bx, by, cx, cy) {
	  return (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
	};

	/*
	 * Compute angle formed by three points in cartesian plane using law of cosines
	 */

	module.exports.angleFromThreePoints = function (ax, ay, bx, by, cx, cy) {
	  var c = module.exports.distance(ax, ay, bx, by);
	  var a = module.exports.distance(bx, by, cx, cy);
	  var b = module.exports.distance(ax, ay, cx, cy);
	  return Math.acos((a * a + c * c - b * b) / (2 * a * c));
	};

	module.exports.pointAlongArc = function (x1, y1, x2, y2, r, theta, ccw, t) {
	  ccw = Math.abs(ccw) / ccw; // convert to 1 or -1

	  var rot = Math.PI / 2 - Math.abs(theta) / 2;
	  var vectToCenter = module.exports.normalizeVector(module.exports.rotateVector({
	    x: x2 - x1,
	    y: y2 - y1
	  }, ccw * rot));

	  // calculate the center of the arc circle
	  var cx = x1 + r * vectToCenter.x;
	  var cy = y1 + r * vectToCenter.y;

	  var vectFromCenter = module.exports.negateVector(vectToCenter);
	  rot = Math.abs(theta) * t * ccw;
	  vectFromCenter = module.exports.normalizeVector(module.exports.rotateVector(vectFromCenter, rot));

	  return {
	    x: cx + r * vectFromCenter.x,
	    y: cy + r * vectFromCenter.y
	  };
	};

	module.exports.getVectorAngle = function (x, y) {
	  var t = Math.atan(y / x);

	  if (x < 0 && t <= 0) t += Math.PI;else if (x < 0 && t >= 0) t -= Math.PI;

	  return t;
	};

	module.exports.rayIntersection = function (ax, ay, avx, avy, bx, by, bvx, bvy) {
	  var u = ((by - ay) * bvx - (bx - ax) * bvy) / (bvx * avy - bvy * avx);
	  var v = ((by - ay) * avx - (bx - ax) * avy) / (bvx * avy - bvy * avx);

	  return {
	    u: u,
	    v: v,
	    intersect: u > -tolerance && v > -tolerance
	  };
	};

	module.exports.lineIntersection = function (x1, y1, x2, y2, x3, y3, x4, y4) {

	  var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

	  if (d === 0) {
	    // lines are parallel
	    return {
	      intersect: false
	    };
	  }

	  return {
	    x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d,
	    y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d,
	    intersect: true
	  };
	};

	/**
	 * Parse a pixel-based style descriptor, returning an number.
	 *
	 * @param {String/Number}
	 */

	module.exports.parsePixelStyle = function (descriptor) {
	  if (typeof descriptor === 'number') return descriptor;
	  return parseFloat(descriptor.substring(0, descriptor.length - 2), 10);
	};

	module.exports.isOutwardVector = function (vector) {
	  if (!module.exports.fuzzyEquals(vector.x, 0)) return vector.x > 0;
	  return vector.y > 0;
	};

	module.exports.getTextBBox = function (text, attrs) {
	  var container = d3.select('body').append('svg');
	  container.append('text').attr({
	    x: -1000,
	    y: -1000
	  }).attr(attrs).text(text);
	  var bbox = container.node().getBBox();
	  container.remove();

	  return {
	    height: bbox.height,
	    width: bbox.width
	  };
	};

	/**
	 * Convert lat/lon coords to spherical mercator meter x/y coords
	 */

	module.exports.latLonToSphericalMercator = function (lat, lon) {
	  var r = 6378137;
	  var x = r * lon * Math.PI / 180;
	  var y = r * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
	  return [x, y];
	};

	/**
	 * vector utilities
	 */

	module.exports.normalizeVector = function (v) {
	  var d = Math.sqrt(v.x * v.x + v.y * v.y);
	  return {
	    x: v.x / d,
	    y: v.y / d
	  };
	};

	module.exports.rotateVector = function (v, theta) {
	  return {
	    x: v.x * Math.cos(theta) - v.y * Math.sin(theta),
	    y: v.x * Math.sin(theta) + v.y * Math.cos(theta)
	  };
	};

	module.exports.negateVector = function (v) {
	  return {
	    x: -v.x,
	    y: -v.y
	  };
	};

	module.exports.addVectors = function (v1, v2) {
	  return {
	    x: v1.x + v2.x,
	    y: v1.y + v2.y
	  };
	};

	/**
	 * GTFS utilities
	 */

	module.exports.otpModeToGtfsType = function (otpMode) {
	  switch (otpMode) {
	    case "TRAM":
	      return 0;
	    case "SUBWAY":
	      return 1;
	    case "RAIL":
	      return 2;
	    case "BUS":
	      return 3;
	    case "FERRY":
	      return 4;
	    case "CABLE_CAR":
	      return 5;
	    case "GONDOLA":
	      return 6;
	    case "FUNICULAR":
	      return 7;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Expose `Route`
	 */

	'use strict';

	module.exports = Route;

	/**
	 * A transit Route, as defined in the input data.
	 * Routes contain one or more Patterns.
	 *
	 * @param {Object}
	 */

	function Route(data) {
	  for (var key in data) {
	    if (key === 'patterns') continue;
	    this[key] = data[key];
	  }

	  this.patterns = [];
	}

	/**
	 * Add Pattern
	 *
	 * @param {Pattern}
	 */

	Route.prototype.addPattern = function (pattern) {
	  this.patterns.push(pattern);
	  pattern.route = this;
	};

	Route.prototype.getColor = function () {
	  if (this.route_color) {
	    if (this.route_color.charAt(0) === '#') return this.route_color;
	    return '#' + this.route_color;
	  }

	  // assign a random shade of gray
	  /*var c = 128 + Math.floor(64 * Math.random());
	  var hex = c.toString(16);
	  hex = (hex.length === 1) ? '0' + hex : hex;
	   this.route_color = '#' + hex + hex + hex;
	   return this.route_color;*/
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var each = __webpack_require__(14);

	var NetworkPath = __webpack_require__(18);
	var PathSegment = __webpack_require__(23);

	/**
	 * Expose `RoutePattern`
	 */

	module.exports = RoutePattern;

	/**
	 * A RoutePattern
	 *
	 * @param {Object} RoutePattern data object from the transitive.js input
	 */

	function RoutePattern(data, transitive) {
	  for (var key in data) {
	    if (key === 'stops') continue;
	    this[key] = data[key];
	  }

	  this.stops = [];
	  if (transitive) {
	    each(data.stops, function (stop) {
	      this.stops.push(transitive.stops[stop.stop_id]);
	    }, this);
	  }

	  this.renderedEdges = [];
	}

	RoutePattern.prototype.getId = function () {
	  return this.pattern_id;
	};

	RoutePattern.prototype.getElementId = function () {
	  return 'pattern-' + this.pattern_id;
	};

	RoutePattern.prototype.getName = function () {
	  return this.pattern_name;
	};

	RoutePattern.prototype.addRenderedEdge = function (rEdge) {
	  if (this.renderedEdges.indexOf(rEdge) === -1) this.renderedEdges.push(rEdge);
	};

	RoutePattern.prototype.offsetAlignment = function (alignmentId, offset) {
	  each(this.renderedEdges, function (rEdge) {
	    rEdge.offsetAlignment(alignmentId, offset);
	  });
	};

	RoutePattern.prototype.createPath = function () {
	  var path = new NetworkPath(this);
	  var pathSegment = new PathSegment('TRANSIT', path);
	  pathSegment.addPattern(this, 0, this.stops.length - 1);
	  path.addSegment(pathSegment);
	  return path;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var each = __webpack_require__(14);

	var PatternGroup = __webpack_require__(24);
	var LabelEdgeGroup = __webpack_require__(25);

	var segmentId = 0;

	/**
	 * Expose `PathSegment`
	 */

	module.exports = PathSegment;

	/**
	 *
	 */

	function PathSegment(type, path) {
	  this.id = segmentId++;
	  this.type = type;
	  this.path = path;
	  this.points = [];
	  this.edges = [];
	  this.renderedSegments = [];
	  this.patternGroup = new PatternGroup();
	}

	PathSegment.prototype.clearGraphData = function () {
	  this.edges = [];
	  this.points.forEach(function (point) {
	    point.graphVertex = null;
	  });
	  this.renderLength = null;
	};

	PathSegment.prototype.getId = function () {
	  return this.id;
	};

	PathSegment.prototype.getType = function () {
	  return this.type;
	};

	PathSegment.prototype.addRenderedSegment = function (rSegment) {
	  this.renderedSegments.push(rSegment);
	};

	PathSegment.prototype.addEdge = function (graphEdge, originVertex) {
	  this.edges.push({
	    graphEdge: graphEdge,
	    forward: originVertex === graphEdge.fromVertex
	  });
	};

	PathSegment.prototype.insertEdgeAt = function (index, graphEdge, originVertex) {
	  var edgeInfo = {
	    graphEdge: graphEdge,
	    forward: originVertex === graphEdge.fromVertex
	  };
	  this.edges.splice(index, 0, edgeInfo);
	};

	PathSegment.prototype.removeEdge = function (graphEdge) {
	  var index = null;
	  for (var i = 0; i < this.edges.length; i++) {
	    if (this.edges[i].graphEdge === graphEdge) {
	      index = i;
	      break;
	    }
	  }
	  if (index !== null) this.edges.splice(index, 1);
	};

	PathSegment.prototype.getEdgeIndex = function (graphEdge) {
	  for (var i = 0; i < this.edges.length; i++) {
	    if (this.edges[i].graphEdge === graphEdge) return i;
	  }
	  return -1;
	};

	/**
	 * Get graph vertices
	 */

	PathSegment.prototype.getGraphVertices = function () {
	  var vertices = [];
	  this.edges.forEach(function (edge, i) {
	    if (i === 0) {
	      vertices.push(edge.graphEdge.fromVertex);
	    }
	    vertices.push(edge.graphEdge.toVertex);
	  });
	  return vertices;
	};

	PathSegment.prototype.vertexArray = function () {

	  var vertex = this.startVertex();
	  var array = [vertex];

	  this.edges.forEach(function (edgeInfo) {
	    vertex = edgeInfo.graphEdge.oppositeVertex(vertex);
	    array.push(vertex);
	  });

	  return array;
	};

	PathSegment.prototype.startVertex = function () {
	  if (this.points[0].multipoint) return this.points[0].multipoint.graphVertex;
	  if (!this.edges || this.edges.length === 0) return null;

	  var firstGraphEdge = this.edges[0].graphEdge;
	  return this.edges[0].forward ? firstGraphEdge.fromVertex : firstGraphEdge.toVertex;

	  /*if (this.graphEdges.length === 1) return this.graphEdges[0].fromVertex;
	  var first = this.graphEdges[0],
	    next = this.graphEdges[1];
	  if (first.toVertex == next.toVertex || first.toVertex == next.fromVertex)
	    return first.fromVertex;
	  if (first.fromVertex == next.toVertex || first.fromVertex == next.fromVertex)
	    return first.toVertex;
	  return null;*/
	};

	PathSegment.prototype.endVertex = function () {
	  if (this.points[this.points.length - 1].multipoint) return this.points[this.points.length - 1].multipoint.graphVertex;
	  if (!this.edges || this.edges.length === 0) return null;

	  var lastGraphEdge = this.edges[this.edges.length - 1].graphEdge;
	  return this.edges[this.edges.length - 1].forward ? lastGraphEdge.toVertex : lastGraphEdge.fromVertex;

	  /*if (this.graphEdges.length === 1) return this.graphEdges[0].toVertex;
	  var last = this.graphEdges[this.graphEdges.length - 1],
	    prev = this.graphEdges[this.graphEdges.length - 2];
	  if (last.toVertex == prev.toVertex || last.toVertex == prev.fromVertex)
	    return last.fromVertex;
	  if (last.fromVertex == prev.toVertex || last.fromVertex == prev.fromVertex)
	    return last.toVertex;
	  return null;*/
	};

	PathSegment.prototype.addPattern = function (pattern, fromIndex, toIndex) {
	  if (toIndex - fromIndex + 1 > this.points.length) {
	    this.points = [];
	    var lastStop = null;
	    for (var i = fromIndex; i <= toIndex; i++) {
	      var stop = pattern.stops[i];
	      if (lastStop !== stop) this.points.push(stop);
	      lastStop = stop;
	    }
	  }
	  this.patternGroup.addPattern(pattern);
	  //this.pattern = pattern;
	};

	PathSegment.prototype.getPattern = function () {
	  return this.patternGroup.patterns[0];
	};

	PathSegment.prototype.getPatterns = function () {
	  return this.patternGroup.patterns;
	};

	PathSegment.prototype.getMode = function () {
	  return this.patternGroup.patterns[0].route.route_type;
	};

	PathSegment.prototype.toString = function () {
	  var startVertex = this.startVertex(),
	      endVertex = this.endVertex();
	  return 'PathSegment id=' + this.id + ' type=' + this.type + ' from ' + (startVertex ? startVertex.toString() : '(unknown)') + ' to ' + (endVertex ? endVertex.toString() : '(unknown)');
	};

	PathSegment.prototype.getLabelEdgeGroups = function () {
	  var edgeGroups = [];
	  each(this.renderedSegments, function (rSegment) {
	    if (!rSegment.isFocused()) return;
	    var currentGroup = new LabelEdgeGroup(rSegment);
	    each(rSegment.renderedEdges, function (rEdge) {
	      currentGroup.addEdge(rEdge);
	      if (rEdge.graphEdge.toVertex.point.containsSegmentEndPoint()) {
	        edgeGroups.push(currentGroup);
	        currentGroup = new LabelEdgeGroup(rSegment);
	      }
	    }, this);
	  }, this);

	  return edgeGroups;
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * Expose `PatternGroup`
	 */

	"use strict";

	module.exports = PatternGroup;

	/**
	 * A PatternGroup
	 *
	 * @param {Object} RoutePattern data object from the transitive.js input
	 */

	function PatternGroup() {
	  this.patterns = [];
	}

	PatternGroup.prototype.addPattern = function (pattern) {
	  if (this.patterns.indexOf(pattern) === -1) this.patterns.push(pattern);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var each = __webpack_require__(14);

	/**
	 * Expose `LabelEdgeGroup`
	 */

	module.exports = LabelEdgeGroup;

	/**
	 *
	 */

	function LabelEdgeGroup(renderedSegment) {
	  this.renderedSegment = renderedSegment;
	  this.renderedEdges = [];
	}

	LabelEdgeGroup.prototype.addEdge = function (rEdge) {
	  this.renderedEdges.push(rEdge);
	  this.edgeIds = !this.edgeIds ? rEdge.getId() : this.edgeIds + ',' + rEdge.getId();
	};

	LabelEdgeGroup.prototype.getLabelTextArray = function () {
	  var textArray = [];
	  each(this.renderedSegment.pathSegment.getPatterns(), function (pattern) {
	    var shortName = pattern.route.route_short_name;
	    if (textArray.indexOf(shortName) === -1) textArray.push(shortName);
	  });
	  return textArray;
	};

	LabelEdgeGroup.prototype.getLabelAnchors = function (display, spacing) {

	  var labelAnchors = [];
	  var renderLen = this.getRenderLength(display);
	  var anchorCount = Math.floor(renderLen / spacing);
	  var pctSpacing = spacing / renderLen;

	  for (var i = 0; i < anchorCount; i++) {
	    var t = i % 2 === 0 ? 0.5 + i / 2 * pctSpacing : 0.5 - (i + 1) / 2 * pctSpacing;
	    var coord = this.coordAlongRenderedPath(t, display);
	    if (coord) labelAnchors.push(coord);
	  }

	  return labelAnchors;
	};

	LabelEdgeGroup.prototype.coordAlongRenderedPath = function (t, display) {
	  var renderLen = this.getRenderLength(display);
	  var loc = t * renderLen;

	  var cur = 0;
	  for (var i = 0; i < this.renderedEdges.length; i++) {
	    var rEdge = this.renderedEdges[i];
	    var edgeRenderLen = rEdge.graphEdge.getRenderLength(display);
	    if (loc <= cur + edgeRenderLen) {
	      var t2 = (loc - cur) / edgeRenderLen;
	      return rEdge.graphEdge.coordAlongEdge(t2, rEdge.renderData, display);
	    }
	    cur += edgeRenderLen;
	  }
	};

	LabelEdgeGroup.prototype.getRenderLength = function (display) {
	  if (!this.renderLength) {
	    this.renderLength = 0;
	    each(this.renderedEdges, function (rEdge) {
	      this.renderLength += rEdge.graphEdge.getRenderLength(display);
	    }, this);
	  }
	  return this.renderLength;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var PathSegment = __webpack_require__(23);
	var NetworkPath = __webpack_require__(18);
	var TurnPoint = __webpack_require__(27);
	var Util = __webpack_require__(20);
	var Polyline = __webpack_require__(33);
	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	var each = __webpack_require__(14);
	/**
	 * Expose `Journey`
	 */

	module.exports = Journey;

	/**
	 *
	 */

	function Journey(data, network) {

	  this.network = network;

	  for (var key in data) {
	    this[key] = data[key];
	  }

	  this.path = new NetworkPath(this);

	  each(this.segments, function (segmentInfo) {
	    var pathSegment = new PathSegment(segmentInfo.type, this.path);
	    pathSegment.journeySegment = segmentInfo;

	    if (segmentInfo.type === 'TRANSIT') {
	      if (segmentInfo.patterns) {
	        each(segmentInfo.patterns, function (patternInfo) {
	          pathSegment.addPattern(network.patterns[patternInfo.pattern_id], patternInfo.from_stop_index, patternInfo.to_stop_index);
	        });
	      } else if (segmentInfo.pattern_id) {
	        // legacy support for single-pattern journey segments
	        pathSegment.addPattern(network.patterns[segmentInfo.pattern_id], segmentInfo.from_stop_index, segmentInfo.to_stop_index);
	      }
	    } else {
	      // non-transit segment

	      var streetEdges = [];
	      // screen out degenerate transfer segments
	      if (segmentInfo.from.type === 'STOP' && segmentInfo.to.type === 'STOP' && segmentInfo.from.stop_id === segmentInfo.to.stop_id) return;

	      pathSegment.points.push(getEndPoint(segmentInfo.from, network));
	      if (segmentInfo.streetEdges && segmentInfo.streetEdges.length > 0) {
	        var lastTurnPoint = null;

	        for (var i = 0; i < segmentInfo.streetEdges.length; i++) {
	          var streetEdgeId = segmentInfo.streetEdges[i];
	          var streetEdge = network.streetEdges[streetEdgeId];
	          streetEdge.id = streetEdgeId;
	          streetEdges.push(streetEdge);
	          if (i >= segmentInfo.streetEdges.length - 1) continue;

	          var nextEdge = network.streetEdges[segmentInfo.streetEdges[i + 1]];
	          if (lastTurnPoint) streetEdge.fromTurnPoint = lastTurnPoint;
	          var lastIndex = streetEdge.length - 1;

	          // screen out degenerate edges
	          if (streetEdge.latLons[0][0] === streetEdge.latLons[lastIndex][0] && streetEdge.latLons[0][1] === streetEdge.latLons[lastIndex][1]) {
	            continue;
	          }

	          // create a TurnPoint for the 'from' point of this edge
	          var turnPoint = getTurnPoint({
	            lat: streetEdge.latLons[lastIndex][0],
	            lon: streetEdge.latLons[lastIndex][1],
	            worldX: streetEdge.worldCoords[lastIndex][0],
	            worldY: streetEdge.worldCoords[lastIndex][1]
	          }, network);

	          // compute the angle represented by this turn point
	          /*turnPoint.turnAngle = Util.angleFromThreePoints(
	            streetEdge.worldCoords[0][0],
	            streetEdge.worldCoords[0][1],
	            streetEdge.worldCoords[lastIndex][0],
	            streetEdge.worldCoords[lastIndex][1],
	            nextEdge.worldCoords[nextEdge.length-1][0],
	            nextEdge.worldCoords[nextEdge.length-1][1]
	          );*/

	          pathSegment.points.push(turnPoint);
	          lastTurnPoint = streetEdge.toTurnPoint = turnPoint;
	        }
	        pathSegment.streetEdges = streetEdges;
	      }
	      pathSegment.points.push(getEndPoint(segmentInfo.to, network));
	    }
	    this.path.addSegment(pathSegment);
	  }, this);
	}

	function getEndPoint(pointInfo, network) {
	  if (pointInfo.type === 'PLACE') {
	    return network.places[pointInfo.place_id];
	  } else if (pointInfo.type === 'STOP') {
	    return network.stops[pointInfo.stop_id];
	  }
	}

	Journey.prototype.getElementId = function () {
	  return 'journey-' + this.journey_id;
	};

	/* utility function for creating non-duplicative TurnPoints */

	function getTurnPoint(turnPointInfo, network) {
	  var key = turnPointInfo.lat + '_' + turnPointInfo.lon;
	  if (key in network.turnPoints) return network.turnPoints[key];
	  var turnPoint = new TurnPoint(turnPointInfo, key);
	  network.turnPoints[key] = turnPoint;
	  //network.addVertexPoint(turnPoint);
	  return turnPoint;
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);
	var each = __webpack_require__(14);

	var Point = __webpack_require__(29);
	var Util = __webpack_require__(20);

	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	var debug = __webpack_require__(9)('transitive:point');

	/**
	 *
	 */

	var TurnPoint = augment(Point, function (base) {

	  this.constructor = function (data, id) {
	    base.constructor.call(this, data);
	    this.name = 'Turn @ ' + data.lat + ', ' + data.lon;
	    if (!this.worldX || !this.worldY) {
	      var smCoords = sm.forward([data.lon, data.lat]);
	      this.worldX = smCoords[0];
	      this.worldY = smCoords[1];
	      this.isSegmentEndPoint = false;
	    }
	    this.id = id;
	  };

	  this.getId = function () {
	    return this.id;
	  };

	  this.getType = function () {
	    return 'TURN';
	  };

	  this.getName = function () {
	    return this.name;
	  };

	  this.containsSegmentEndPoint = function () {
	    return this.isSegmentEndPoint;
	  };
	});

	/**
	 * Expose `TurnPoint`
	 */

	module.exports = TurnPoint;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	(function (global, factory) {
	    if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if (typeof module === "object") module.exports = factory();else global.augment = factory();
	})(undefined, function () {
	    "use strict";

	    var Factory = function Factory() {};
	    var slice = Array.prototype.slice;

	    var augment = function augment(base, body) {
	        var uber = Factory.prototype = typeof base === "function" ? base.prototype : base;
	        var prototype = new Factory(),
	            properties = body.apply(prototype, slice.call(arguments, 2).concat(uber));
	        if (typeof properties === "object") for (var key in properties) prototype[key] = properties[key];
	        if (!prototype.hasOwnProperty("constructor")) return prototype;
	        var constructor = prototype.constructor;
	        constructor.prototype = prototype;
	        return constructor;
	    };

	    augment.defclass = function (prototype) {
	        var constructor = prototype.constructor;
	        constructor.prototype = prototype;
	        return constructor;
	    };

	    augment.extend = function (base, body) {
	        return augment(base, function (uber) {
	            this.uber = uber;
	            return body;
	        });
	    };

	    return augment;
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var augment = __webpack_require__(28);
	var each = __webpack_require__(14);

	var PointLabel = __webpack_require__(30);

	var debug = __webpack_require__(9)('transitive:point');

	var Point = augment(Object, function () {

	  this.constructor = function (data) {
	    for (var key in data) {
	      this[key] = data[key];
	    }

	    this.paths = [];
	    this.renderData = [];

	    this.label = new PointLabel(this);
	    this.renderLabel = true;

	    this.focused = true;
	    this.sortableType = 'POINT';

	    this.placeOffsets = {
	      x: 0,
	      y: 0
	    };

	    this.zIndex = 10000;
	  };

	  /**
	   * Get unique ID for point -- must be defined by subclass
	   */

	  this.getId = function () {};

	  this.getElementId = function () {
	    return this.getType().toLowerCase() + '-' + this.getId();
	  };

	  /**
	   * Get Point type -- must be defined by subclass
	   */

	  this.getType = function () {};

	  /**
	   * Get Point name
	   */

	  this.getName = function () {
	    return this.getType() + ' point (ID=' + this.getId() + ')';
	  };

	  /**
	   * Get latitude
	   */

	  this.getLat = function () {
	    return 0;
	  };

	  /**
	   * Get longitude
	   */

	  this.getLon = function () {
	    return 0;
	  };

	  this.containsSegmentEndPoint = function () {
	    return false;
	  };

	  this.containsBoardPoint = function () {
	    return false;
	  };

	  this.containsAlightPoint = function () {
	    return false;
	  };

	  this.containsTransferPoint = function () {
	    return false;
	  };

	  this.getPatterns = function () {
	    return [];
	  };

	  /**
	   * Draw the point
	   *
	   * @param {Display} display
	   */

	  this.render = function (display) {
	    this.label.svgGroup = null;
	  };

	  /**
	   * Refresh a previously drawn point
	   *
	   * @param {Display} display
	   */

	  this.refresh = function (display) {};

	  this.addRenderData = function () {};

	  this.clearRenderData = function () {};

	  this.containsFromPoint = function () {
	    return false;
	  };

	  this.containsToPoint = function () {
	    return false;
	  };

	  this.initSvg = function (display) {
	    // set up the main svg group for this stop
	    this.svgGroup = display.svg.append('g').attr('id', 'transitive-' + this.getType().toLowerCase() + '-' + this.getId())
	    //.attr('class', 'transitive-sortable')
	    .datum(this);

	    this.markerSvg = this.svgGroup.append('g');
	    this.labelSvg = this.svgGroup.append('g');
	  };

	  //** Shared geom utility functions **//

	  this.constructMergedMarker = function (display) {

	    var dataArray = this.getRenderDataArray();
	    var xValues = [],
	        yValues = [];
	    dataArray.forEach(function (data) {
	      var x = data.x; //display.xScale(data.x) + data.offsetX;
	      var y = data.y; //display.yScale(data.y) - data.offsetY;
	      xValues.push(x);
	      yValues.push(y);
	    });
	    var minX = Math.min.apply(Math, xValues),
	        minY = Math.min.apply(Math, yValues);
	    var maxX = Math.max.apply(Math, xValues),
	        maxY = Math.max.apply(Math, yValues);

	    // retrieve marker type and radius from the styler
	    var markerType = display.styler.compute(display.styler.stops_merged['marker-type'], display, {
	      owner: this
	    });
	    var stylerRadius = display.styler.compute(display.styler.stops_merged.r, display, {
	      owner: this
	    });

	    var width, height, r;

	    // if this is a circle marker w/ a styler-defined fixed radius, use that
	    if (markerType === 'circle' && stylerRadius) {
	      width = height = stylerRadius * 2;
	      r = stylerRadius;
	    }

	    // otherwise, this is a dynamically-sized marker
	    else {

	        var dx = maxX - minX,
	            dy = maxY - minY;

	        var markerPadding = display.styler.compute(display.styler.stops_merged['marker-padding'], display, {
	          owner: this
	        }) || 0;

	        var patternRadius = display.styler.compute(display.styler[this.patternStylerKey].r, display, {
	          owner: this
	        });
	        r = parseFloat(patternRadius) + markerPadding;

	        if (markerType === 'circle') {
	          width = height = Math.max(dx, dy) + 2 * r;
	          r = width / 2;
	        } else {
	          width = dx + 2 * r;
	          height = dy + 2 * r;
	          if (markerType === 'rectangle') r = 0;
	        }
	      }

	    return {
	      x: (minX + maxX) / 2 - width / 2,
	      y: (minY + maxY) / 2 - height / 2,
	      width: width,
	      height: height,
	      rx: r,
	      ry: r
	    };
	  };

	  this.initMarkerData = function (display) {

	    if (this.getType() !== 'STOP' && this.getType() !== 'MULTI') return;

	    this.mergedMarkerData = this.constructMergedMarker(display);

	    this.placeOffsets = {
	      x: 0,
	      y: 0
	    };
	    if (this.adjacentPlace) {
	      var placeBBox = this.adjacentPlace.getMarkerBBox();

	      var placeR = display.styler.compute(display.styler.places.r, display, {
	        owner: this.adjacentPlace
	      });

	      var placeX = display.xScale(this.adjacentPlace.worldX);
	      var placeY = display.yScale(this.adjacentPlace.worldY);

	      var thisR = this.mergedMarkerData.width / 2;
	      var thisX = this.mergedMarkerData.x + thisR,
	          thisY = this.mergedMarkerData.y + thisR;

	      var dx = thisX - placeX,
	          dy = thisY - placeY;
	      var dist = Math.sqrt(dx * dx + dy * dy);

	      if (placeR + thisR > dist) {
	        var f = (placeR + thisR) / dist;
	        this.placeOffsets = {
	          x: dx * f - dx,
	          y: dy * f - dy
	        };

	        this.mergedMarkerData.x += this.placeOffsets.x;
	        this.mergedMarkerData.y += this.placeOffsets.y;

	        each(this.graphVertex.incidentEdges(), function (edge) {
	          each(edge.renderSegments, function (segment) {
	            segment.refreshRenderData(display);
	          });
	        });
	      }
	    }
	  };

	  this.refreshLabel = function (display) {
	    if (!this.renderLabel) return;
	    this.label.refresh(display);
	  };

	  this.getMarkerBBox = function () {
	    return this.markerSvg.node().getBBox();
	  };

	  this.setFocused = function (focused) {
	    this.focused = focused;
	  };

	  this.isFocused = function () {
	    return this.focused === true;
	  };

	  this.runFocusTransition = function (display, callback) {};

	  this.setAllPatternsFocused = function () {};

	  this.getZIndex = function () {
	    return this.zIndex;
	  };

	  this.getAverageCoord = function () {
	    var dataArray = this.getRenderDataArray();

	    var xTotal = 0,
	        yTotal = 0;
	    each(dataArray, function (data) {
	      xTotal += data.x;
	      yTotal += data.y;
	    });

	    return {
	      x: xTotal / dataArray.length,
	      y: yTotal / dataArray.length
	    };
	  };

	  this.hasRenderData = function () {
	    var dataArray = this.getRenderDataArray();
	    return dataArray && dataArray.length > 0;
	  };

	  this.makeDraggable = function (transitive) {};

	  this.toString = function () {
	    return this.getType() + ' point: ' + this.getId() + ' (' + this.getName() + ')';
	  };
	});

	/**
	 * Expose `Point`
	 */

	module.exports = Point;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);

	var Label = __webpack_require__(31);

	/**
	 * Label object
	 */

	var PointLabel = augment(Label, function (base) {

	  this.constructor = function (parent) {

	    base.constructor.call(this, parent);

	    this.labelAngle = 0;
	    this.labelPosition = 1;
	  };

	  this.initText = function () {
	    return this.parent.getName();
	  };

	  this.render = function (display) {
	    this.svgGroup = display.svg.append('g'); //this.parent.labelSvg;
	    this.svgGroup.attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'POINT_LABEL'
	    });

	    var typeStr = this.parent.getType().toLowerCase();

	    this.mainLabel = this.svgGroup.append('text').datum({
	      owner: this
	    }).attr('id', 'transitive-' + typeStr + '-label-' + this.parent.getId()).text(this.getText()).attr('font-size', this.fontSize).attr('font-family', this.fontFamily).attr('class', 'transitive-' + typeStr + '-label');
	  };

	  this.refresh = function (display) {
	    if (!this.labelAnchor) return;

	    if (!this.svgGroup) this.render(display);

	    this.svgGroup.attr('text-anchor', this.labelPosition > 0 ? 'start' : 'end').attr('transform', (function (d, i) {
	      return 'translate(' + this.labelAnchor.x + ',' + this.labelAnchor.y + ')';
	    }).bind(this));

	    this.mainLabel.attr('transform', (function (d, i) {
	      return 'rotate(' + this.labelAngle + ', 0, 0)';
	    }).bind(this));
	  };

	  this.setOrientation = function (orientation) {
	    this.orientation = orientation;

	    var markerBBox = this.parent.getMarkerBBox();
	    if (!markerBBox) return;

	    var x, y;
	    var offset = 5;

	    if (orientation === 'E') {
	      x = markerBBox.x + markerBBox.width + offset;
	      y = markerBBox.y + markerBBox.height / 2;
	      this.labelPosition = 1;
	      this.labelAngle = 0;
	    } else if (orientation === 'W') {
	      x = markerBBox.x - offset;
	      y = markerBBox.y + markerBBox.height / 2;
	      this.labelPosition = -1;
	      this.labelAngle = 0;
	    } else if (orientation === 'NE') {
	      x = markerBBox.x + markerBBox.width + offset;
	      y = markerBBox.y - offset;
	      this.labelPosition = 1;
	      this.labelAngle = -45;
	    } else if (orientation === 'SE') {
	      x = markerBBox.x + markerBBox.width + offset;
	      y = markerBBox.y + markerBBox.height + offset;
	      this.labelPosition = 1;
	      this.labelAngle = 45;
	    } else if (orientation === 'NW') {
	      x = markerBBox.x - offset;
	      y = markerBBox.y - offset;
	      this.labelPosition = -1;
	      this.labelAngle = 45;
	    } else if (orientation === 'SW') {
	      x = markerBBox.x - offset;
	      y = markerBBox.y + markerBBox.height + offset;
	      this.labelPosition = -1;
	      this.labelAngle = -45;
	    } else if (orientation === 'N') {
	      x = markerBBox.x + markerBBox.width / 2;
	      y = markerBBox.y - offset;
	      this.labelPosition = 1;
	      this.labelAngle = -90;
	    } else if (orientation === 'S') {
	      x = markerBBox.x + markerBBox.width / 2;
	      y = markerBBox.y + markerBBox.height + offset;
	      this.labelPosition = -1;
	      this.labelAngle = -90;
	    }

	    this.labelAnchor = {
	      x: x,
	      y: y
	    };
	  };

	  this.getBBox = function () {

	    if (this.orientation === 'E') {
	      return {
	        x: this.labelAnchor.x,
	        y: this.labelAnchor.y - this.textHeight,
	        width: this.textWidth,
	        height: this.textHeight
	      };
	    }

	    if (this.orientation === 'W') {
	      return {
	        x: this.labelAnchor.x - this.textWidth,
	        y: this.labelAnchor.y - this.textHeight,
	        width: this.textWidth,
	        height: this.textHeight
	      };
	    }

	    if (this.orientation === 'N') {
	      return {
	        x: this.labelAnchor.x - this.textHeight,
	        y: this.labelAnchor.y - this.textWidth,
	        width: this.textHeight,
	        height: this.textWidth
	      };
	    }

	    if (this.orientation === 'S') {
	      return {
	        x: this.labelAnchor.x - this.textHeight,
	        y: this.labelAnchor.y,
	        width: this.textHeight,
	        height: this.textWidth
	      };
	    }

	    var bboxSide = this.textWidth * Math.sqrt(2) / 2;

	    if (this.orientation === 'NE') {
	      return {
	        x: this.labelAnchor.x,
	        y: this.labelAnchor.y - bboxSide,
	        width: bboxSide,
	        height: bboxSide
	      };
	    }

	    if (this.orientation === 'SE') {
	      return {
	        x: this.labelAnchor.x,
	        y: this.labelAnchor.y,
	        width: bboxSide,
	        height: bboxSide
	      };
	    }

	    if (this.orientation === 'NW') {
	      return {
	        x: this.labelAnchor.x - bboxSide,
	        y: this.labelAnchor.y - bboxSide,
	        width: bboxSide,
	        height: bboxSide
	      };
	    }

	    if (this.orientation === 'SW') {
	      return {
	        x: this.labelAnchor.x - bboxSide,
	        y: this.labelAnchor.y,
	        width: bboxSide,
	        height: bboxSide
	      };
	    }
	  };

	  this.intersects = function (obj) {
	    if (obj instanceof Label) {
	      // todo: handle label-label intersection for diagonally placed labels separately
	      return this.intersectsBBox(obj.getBBox());
	    } else if (obj.x && obj.y && obj.width && obj.height) {
	      return this.intersectsBBox(obj);
	    }

	    return false;
	  };

	  this.runFocusTransition = function (display, callback) {
	    if (this.mainLabel) {
	      if (this.parent.isFocused()) this.setVisibility(true);
	      this.mainLabel.transition().style('opacity', this.parent.isFocused() ? 1 : 0).call(callback);
	    }
	  };
	});

	/**
	 * Expose `PointLabel`
	 */

	module.exports = PointLabel;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);

	/**
	 * Label object
	 */

	var Label = augment(Object, function () {

	  this.constructor = function (parent) {
	    this.parent = parent;
	    this.sortableType = 'LABEL';
	  };

	  this.getText = function () {
	    if (!this.labelText) this.labelText = this.initText();
	    return this.labelText;
	  };

	  this.initText = function () {
	    return this.parent.getName();
	  };

	  this.render = function (display) {};

	  this.refresh = function (display) {};

	  this.setVisibility = function (visibility) {
	    if (this.svgGroup) this.svgGroup.attr('visibility', visibility ? 'visible' : 'hidden');
	  };

	  this.getBBox = function () {
	    return null;
	  };

	  this.intersects = function (obj) {
	    return null;
	  };

	  this.intersectsBBox = function (bbox) {
	    var thisBBox = this.getBBox(this.orientation);
	    var r = thisBBox.x <= bbox.x + bbox.width && bbox.x <= thisBBox.x + thisBBox.width && thisBBox.y <= bbox.y + bbox.height && bbox.y <= thisBBox.y + thisBBox.height;
	    return r;
	  };

	  this.isFocused = function () {
	    return this.parent.isFocused();
	  };

	  this.getZIndex = function () {
	    return 1000000;
	  };
	});

	/**
	 * Expose `Label`
	 */

	module.exports = Label;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SphericalMercator = (function () {

	  // Closures including constants and other precalculated values.
	  var cache = {},
	      EPSLN = 1.0e-10,
	      D2R = Math.PI / 180,
	      R2D = 180 / Math.PI,

	  // 900913 properties.
	  A = 6378137,
	      MAXEXTENT = 20037508.34;

	  // SphericalMercator constructor: precaches calculations
	  // for fast tile lookups.
	  function SphericalMercator(options) {
	    options = options || {};
	    this.size = options.size || 256;
	    if (!cache[this.size]) {
	      var size = this.size;
	      var c = cache[this.size] = {};
	      c.Bc = [];
	      c.Cc = [];
	      c.zc = [];
	      c.Ac = [];
	      for (var d = 0; d < 30; d++) {
	        c.Bc.push(size / 360);
	        c.Cc.push(size / (2 * Math.PI));
	        c.zc.push(size / 2);
	        c.Ac.push(size);
	        size *= 2;
	      }
	    }
	    this.Bc = cache[this.size].Bc;
	    this.Cc = cache[this.size].Cc;
	    this.zc = cache[this.size].zc;
	    this.Ac = cache[this.size].Ac;
	  }

	  // Convert lon lat to screen pixel value
	  //
	  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.
	  // - `zoom` {Number} zoom level.
	  SphericalMercator.prototype.px = function (ll, zoom) {
	    var d = this.zc[zoom];
	    var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
	    var x = Math.round(d + ll[0] * this.Bc[zoom]);
	    var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * -this.Cc[zoom]);
	    if (x > this.Ac[zoom]) x = this.Ac[zoom];
	    if (y > this.Ac[zoom]) y = this.Ac[zoom];
	    //(x < 0) && (x = 0);
	    //(y < 0) && (y = 0);
	    return [x, y];
	  };

	  // Convert screen pixel value to lon lat
	  //
	  // - `px` {Array} `[x, y]` array of geographic coordinates.
	  // - `zoom` {Number} zoom level.
	  SphericalMercator.prototype.ll = function (px, zoom) {
	    var g = (px[1] - this.zc[zoom]) / -this.Cc[zoom];
	    var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
	    var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
	    return [lon, lat];
	  };

	  // Convert tile xyz value to bbox of the form `[w, s, e, n]`
	  //
	  // - `x` {Number} x (longitude) number.
	  // - `y` {Number} y (latitude) number.
	  // - `zoom` {Number} zoom.
	  // - `tms_style` {Boolean} whether to compute using tms-style.
	  // - `srs` {String} projection for resulting bbox (WGS84|900913).
	  // - `return` {Array} bbox array of values in form `[w, s, e, n]`.
	  SphericalMercator.prototype.bbox = function (x, y, zoom, tms_style, srs) {
	    // Convert xyz into bbox with srs WGS84
	    if (tms_style) {
	      y = Math.pow(2, zoom) - 1 - y;
	    }
	    // Use +y to make sure it's a number to avoid inadvertent concatenation.
	    var ll = [x * this.size, (+y + 1) * this.size]; // lower left
	    // Use +x to make sure it's a number to avoid inadvertent concatenation.
	    var ur = [(+x + 1) * this.size, y * this.size]; // upper right
	    var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));

	    // If web mercator requested reproject to 900913.
	    if (srs === '900913') {
	      return this.convert(bbox, '900913');
	    } else {
	      return bbox;
	    }
	  };

	  // Convert bbox to xyx bounds
	  //
	  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
	  // - `zoom` {Number} zoom.
	  // - `tms_style` {Boolean} whether to compute using tms-style.
	  // - `srs` {String} projection of input bbox (WGS84|900913).
	  // - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.
	  SphericalMercator.prototype.xyz = function (bbox, zoom, tms_style, srs) {
	    // If web mercator provided reproject to WGS84.
	    if (srs === '900913') {
	      bbox = this.convert(bbox, 'WGS84');
	    }

	    var ll = [bbox[0], bbox[1]]; // lower left
	    var ur = [bbox[2], bbox[3]]; // upper right
	    var px_ll = this.px(ll, zoom);
	    var px_ur = this.px(ur, zoom);
	    // Y = 0 for XYZ is the top hence minY uses px_ur[1].
	    var bounds = {
	      minX: Math.floor(px_ll[0] / this.size),
	      minY: Math.floor(px_ur[1] / this.size),
	      maxX: Math.floor((px_ur[0] - 1) / this.size),
	      maxY: Math.floor((px_ll[1] - 1) / this.size)
	    };
	    if (tms_style) {
	      var tms = {
	        minY: Math.pow(2, zoom) - 1 - bounds.maxY,
	        maxY: Math.pow(2, zoom) - 1 - bounds.minY
	      };
	      bounds.minY = tms.minY;
	      bounds.maxY = tms.maxY;
	    }
	    return bounds;
	  };

	  // Convert projection of given bbox.
	  //
	  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
	  // - `to` {String} projection of output bbox (WGS84|900913). Input bbox
	  //   assumed to be the "other" projection.
	  // - `@return` {Object} bbox with reprojected coordinates.
	  SphericalMercator.prototype.convert = function (bbox, to) {
	    if (to === '900913') {
	      return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2, 4)));
	    } else {
	      return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2, 4)));
	    }
	  };

	  // Convert lon/lat values to 900913 x/y.
	  SphericalMercator.prototype.forward = function (ll) {
	    var xy = [A * ll[0] * D2R, A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * ll[1] * D2R))];
	    // if xy value is beyond maxextent (e.g. poles), return maxextent.
	    if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT;
	    if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT;
	    if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;
	    if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;
	    return xy;
	  };

	  // Convert 900913 x/y values to lon/lat.
	  SphericalMercator.prototype.inverse = function (xy) {
	    return [xy[0] * R2D / A, (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D];
	  };

	  return SphericalMercator;
	})();

	if (true) {
	  module.exports = exports = SphericalMercator;
	}

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	module.exports.decode = function (polyline) {

	  var currentPosition = 0;

	  var currentLat = 0;
	  var currentLng = 0;

	  var dataLength = polyline.length;

	  var polylineLatLngs = [];

	  while (currentPosition < dataLength) {

	    var shift = 0;
	    var result = 0;

	    var byte;

	    do {
	      byte = polyline.charCodeAt(currentPosition++) - 63;
	      result |= (byte & 0x1f) << shift;
	      shift += 5;
	    } while (byte >= 0x20);

	    var deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
	    currentLat += deltaLat;

	    shift = 0;
	    result = 0;

	    do {
	      byte = polyline.charCodeAt(currentPosition++) - 63;
	      result |= (byte & 0x1f) << shift;
	      shift += 5;
	    } while (byte >= 0x20);

	    var deltLng = result & 1 ? ~(result >> 1) : result >> 1;

	    currentLng += deltLng;

	    polylineLatLngs.push([currentLat * 0.00001, currentLng * 0.00001]);
	  }
	  return polylineLatLngs;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var _Object$keys = __webpack_require__(35)['default'];

	var augment = __webpack_require__(28);
	var each = __webpack_require__(14);

	var Point = __webpack_require__(29);
	var Util = __webpack_require__(20);

	var debug = __webpack_require__(9)('transitive:stop');

	/**
	 *  Place: a Point subclass representing a 'place' that can be rendered on the
	 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work
	 *  location, a point of interest, etc.
	 */

	var Stop = augment(Point, function (base) {

	  this.constructor = function (data) {
	    base.constructor.call(this, data);

	    if (data && data.stop_lat && data.stop_lon) {
	      var xy = Util.latLonToSphericalMercator(data.stop_lat, data.stop_lon);
	      this.worldX = xy[0];
	      this.worldY = xy[1];
	    }

	    this.patterns = [];

	    this.patternRenderData = {};
	    this.patternFocused = {};
	    this.patternCount = 0;

	    this.patternStylerKey = 'stops_pattern';

	    this.isSegmentEndPoint = false;
	  };

	  /**
	   * Get id
	   */

	  this.getId = function () {
	    return this.stop_id;
	  };

	  /**
	   * Get type
	   */

	  this.getType = function () {
	    return 'STOP';
	  };

	  /**
	   * Get name
	   */

	  this.getName = function () {
	    if (!this.stop_name) return 'Unnamed Stop (ID=' + this.getId() + ')';
	    return this.stop_name;
	  };

	  /**
	   * Get lat
	   */

	  this.getLat = function () {
	    return this.stop_lat;
	  };

	  /**
	   * Get lon
	   */

	  this.getLon = function () {
	    return this.stop_lon;
	  };

	  this.containsSegmentEndPoint = function () {
	    return this.isSegmentEndPoint;
	  };

	  this.containsBoardPoint = function () {
	    return this.isBoardPoint;
	  };

	  this.containsAlightPoint = function () {
	    return this.isAlightPoint;
	  };

	  this.containsTransferPoint = function () {
	    return this.isTransferPoint;
	  };

	  this.getPatterns = function () {
	    return this.patterns;
	  };

	  this.addPattern = function (pattern) {
	    if (this.patterns.indexOf(pattern) === -1) this.patterns.push(pattern);
	  };

	  /**
	   * Add render data
	   *
	   * @param {Object} stopInfo
	   */

	  this.addRenderData = function (stopInfo) {
	    if (stopInfo.rEdge.getType() === 'TRANSIT') {

	      var s = {
	        sortableType: 'POINT_STOP_PATTERN',
	        owner: this,
	        getZIndex: function getZIndex() {
	          if (this.owner.graphVertex) {
	            return this.owner.getZIndex();
	          }
	          return this.rEdge.getZIndex() + 1;
	        }
	      };

	      for (var key in stopInfo) s[key] = stopInfo[key];

	      var patternId = stopInfo.rEdge.patternIds;
	      this.patternRenderData[patternId] = s; //.push(s);

	      each(stopInfo.rEdge.patterns, function (pattern) {
	        this.addPattern(pattern);
	      }, this);
	    }
	    this.patternCount = _Object$keys(this.patternRenderData).length;
	  };

	  this.isPatternFocused = function (patternId) {
	    if (!(patternId in this.patternFocused)) return true;
	    return this.patternFocused[patternId];
	  };

	  this.setPatternFocused = function (patternId, focused) {
	    this.patternFocused[patternId] = focused;
	  };

	  this.setAllPatternsFocused = function (focused) {
	    for (var key in this.patternRenderData) {
	      this.patternFocused[key] = focused;
	    }
	  };

	  /**
	   * Draw a stop
	   *
	   * @param {Display} display
	   */

	  this.render = function (display) {
	    base.render.call(this, display);
	    if (_Object$keys(this.patternRenderData).length === 0) return;

	    var renderDataArray = this.getRenderDataArray();

	    this.initSvg(display);

	    // set up the merged marker
	    this.mergedMarker = this.markerSvg.append('g').append('rect').attr('class', 'transitive-sortable transitive-stop-marker-merged').datum(this.getMergedRenderData());

	    // set up the pattern-specific markers
	    this.patternMarkers = this.markerSvg.append('g').selectAll('circle').data(renderDataArray).enter().append('circle').attr('class', 'transitive-sortable transitive-stop-marker-pattern');
	  };

	  /**
	   * Refresh the stop
	   *
	   * @param {Display} display
	   */

	  this.refresh = function (display) {

	    if (this.patternCount === 0) return;

	    if (!this.mergedMarkerData) this.initMarkerData(display);

	    // refresh the pattern-level markers
	    this.patternMarkers.data(this.getRenderDataArray());

	    this.patternMarkers.attr('transform', (function (d, i) {
	      if (!isNaN(d.x) && !isNaN(d.y)) {
	        var x = d.x + this.placeOffsets.x;
	        var y = d.y + this.placeOffsets.y;
	        return 'translate(' + x + ', ' + y + ')';
	      }
	    }).bind(this));

	    // refresh the merged marker
	    if (this.mergedMarker) {
	      var a = this.constructMergedMarker(display, 'stops_pattern');
	      this.mergedMarker.datum(this.getMergedRenderData());
	      if (!isNaN(this.mergedMarkerData.x) && !isNaN(this.mergedMarkerData.y)) this.mergedMarker.attr(this.mergedMarkerData);
	    }
	  };

	  this.getMergedRenderData = function () {
	    return {
	      owner: this,
	      sortableType: 'POINT_STOP_MERGED'
	    };
	  };

	  this.getRenderDataArray = function () {
	    var dataArray = [];
	    for (var patternId in this.patternRenderData) {
	      dataArray.push(this.patternRenderData[patternId]);
	    }
	    return dataArray;
	  };

	  this.getMarkerBBox = function () {
	    if (this.mergedMarker) return this.mergedMarkerData;
	  };

	  this.isFocused = function () {
	    if (this.mergedMarker || !this.patternRenderData) {
	      return this.focused === true;
	    }

	    var focused = true;
	    for (var patternId in this.patternRenderData) {
	      focused = this && this.isPatternFocused(patternId);
	    }
	    return focused;
	  };

	  this.runFocusTransition = function (display, callback) {
	    if (this.mergedMarker) {
	      var newStrokeColor = display.styler.compute(display.styler.stops_merged.stroke, display, {
	        owner: this
	      });
	      this.mergedMarker.transition().style('stroke', newStrokeColor).call(callback);
	    }
	    if (this.label) this.label.runFocusTransition(display, callback);
	  };

	  this.clearRenderData = function () {
	    this.patternRenderData = {};
	    this.mergedMarkerData = null;
	    this.placeOffsets = {
	      x: 0,
	      y: 0
	    };
	  };
	});

	/**
	 * Expose `Stop`
	 */

	module.exports = Stop;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(36), __esModule: true };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(37);
	module.exports = __webpack_require__(43).Object.keys;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	'use strict';

	var toObject = __webpack_require__(38);

	__webpack_require__(40)('keys', function ($keys) {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	'use strict';

	var defined = __webpack_require__(39);
	module.exports = function (it) {
	  return Object(defined(it));
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	"use strict";

	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	'use strict';

	var $export = __webpack_require__(41),
	    core = __webpack_require__(43),
	    fails = __webpack_require__(46);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY],
	      exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(42),
	    core = __webpack_require__(43),
	    ctx = __webpack_require__(44),
	    PROTOTYPE = 'prototype';

	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      IS_WRAP = type & $export.W,
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
	      key,
	      own,
	      out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function F(param) {
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	      // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 42 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	'use strict';

	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	var core = module.exports = { version: '1.2.6' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	'use strict';

	var aFunction = __webpack_require__(45);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);
	var d3 = __webpack_require__(3);

	var Point = __webpack_require__(29);
	var Util = __webpack_require__(20);

	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	/**
	 *  Place: a Point subclass representing a 'place' that can be rendered on the
	 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work
	 *  location, a point of interest, etc.
	 */

	var Place = augment(Point, function (base) {

	  /**
	   *  the constructor
	   */

	  this.constructor = function (data) {
	    base.constructor.call(this, data);

	    if (data && data.place_lat && data.place_lon) {
	      var xy = Util.latLonToSphericalMercator(data.place_lat, data.place_lon);
	      this.worldX = xy[0];
	      this.worldY = xy[1];
	    }

	    this.zIndex = 100000;
	  };

	  /**
	   * Get Type
	   */

	  this.getType = function () {
	    return 'PLACE';
	  };

	  /**
	   * Get ID
	   */

	  this.getId = function () {
	    return this.place_id;
	  };

	  /**
	   * Get Name
	   */

	  this.getName = function () {
	    return this.place_name;
	  };

	  /**
	   * Get lat
	   */

	  this.getLat = function () {
	    return this.place_lat;
	  };

	  /**
	   * Get lon
	   */

	  this.getLon = function () {
	    return this.place_lon;
	  };

	  this.containsSegmentEndPoint = function () {
	    return true;
	  };

	  this.containsFromPoint = function () {
	    return this.getId() === 'from';
	  };

	  this.containsToPoint = function () {
	    return this.getId() === 'to';
	  };

	  this.addRenderData = function (pointInfo) {
	    this.renderData.push(pointInfo);
	  };

	  this.getRenderDataArray = function () {
	    return this.renderData;
	  };

	  this.clearRenderData = function () {
	    this.renderData = [];
	  };

	  /**
	   * Draw a place
	   *
	   * @param {Display} display
	   */

	  this.render = function (display) {
	    base.render.call(this, display);
	    if (!this.renderData) return;

	    this.initSvg(display);
	    this.svgGroup.attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'POINT_PLACE'
	    });

	    // set up the markers
	    this.marker = this.markerSvg.append('circle').datum({
	      owner: this
	    }).attr('class', 'transitive-place-circle');

	    var iconUrl = display.styler.compute(display.styler.places_icon['xlink:href'], display, {
	      owner: this
	    });
	    if (iconUrl) {
	      this.icon = this.markerSvg.append('image').datum({
	        owner: this
	      }).attr('class', 'transitive-place-icon').attr('xlink:href', iconUrl);
	    }
	  };

	  /**
	   * Refresh the place
	   *
	   * @param {Display} display
	   */

	  this.refresh = function (display) {
	    if (!this.renderData) return;

	    // refresh the marker/icon
	    var x = display.xScale(this.worldX);
	    var y = display.yScale(this.worldY);
	    var translate = 'translate(' + x + ', ' + y + ')';
	    this.marker.attr('transform', translate);
	    if (this.icon) this.icon.attr('transform', translate);
	  };

	  this.makeDraggable = function (transitive) {
	    var place = this,
	        display = transitive.display;
	    var drag = d3.behavior.drag().on('dragstart', function () {
	      d3.event.sourceEvent.stopPropagation(); // silence other listeners
	    }).on('drag', function () {
	      if (place.graphVertex) {
	        var x = display.xScale.invert(d3.event.sourceEvent.pageX - display.el.offsetLeft);
	        var y = display.yScale.invert(d3.event.sourceEvent.pageY - display.el.offsetTop);

	        place.worldX = x;
	        place.worldY = y;
	        var ll = sm.inverse([x, y]);
	        place.place_lon = ll[0];
	        place.place_lat = ll[1];

	        place.refresh(display);
	      }
	    }).on('dragend', function () {
	      transitive.emit('place.' + place.getId() + '.dragend', place);
	    });
	    this.markerSvg.call(drag);
	  };
	});

	/**
	 * Expose `Place`
	 */

	module.exports = Place;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var d3 = __webpack_require__(3);
	var each = __webpack_require__(14);

	var PointCluster = __webpack_require__(49);
	var MultiPoint = __webpack_require__(50);
	var Util = __webpack_require__(20);

	/**
	 * Expose `PointClusterMap`
	 */

	module.exports = PointClusterMap;

	/**
	 *
	 */

	function PointClusterMap(transitive) {
	  this.transitive = transitive;

	  this.clusters = [];
	  this.clusterLookup = {}; // maps Point object to its containing cluster

	  var pointArr = [];
	  each(transitive.stops, function (key) {
	    var point = transitive.stops[key];
	    if (point.used) pointArr.push(point);
	  }, this);
	  each(transitive.turnPoints, function (key) {
	    pointArr.push(transitive.turnPoints[key]);
	  }, this);

	  var links = d3.geom.voronoi().x(function (d) {
	    return d.worldX;
	  }).y(function (d) {
	    return d.worldY;
	  }).links(pointArr);

	  each(links, function (link) {
	    var dist = Util.distance(link.source.worldX, link.source.worldY, link.target.worldX, link.target.worldY);
	    if (dist < 100 && (link.source.getType() !== 'TURN' || link.target.getType() !== 'TURN')) {
	      var sourceInCluster = (link.source in this.clusterLookup);
	      var targetInCluster = (link.target in this.clusterLookup);
	      if (sourceInCluster && !targetInCluster) {
	        this.addPointToCluster(link.target, this.clusterLookup[link.source]);
	      } else if (!sourceInCluster && targetInCluster) {
	        this.addPointToCluster(link.source, this.clusterLookup[link.target]);
	      } else if (!sourceInCluster && !targetInCluster) {
	        var cluster = new PointCluster();
	        this.clusters.push(cluster);
	        this.addPointToCluster(link.source, cluster);
	        this.addPointToCluster(link.target, cluster);
	      }
	    }
	  }, this);

	  this.vertexPoints = [];
	  each(this.clusters, function (cluster) {
	    var multipoint = new MultiPoint(cluster.points);
	    this.vertexPoints.push(multipoint);
	    each(cluster.points, function (point) {
	      point.multipoint = multipoint;
	    }, this);
	  }, this);
	}

	PointClusterMap.prototype.addPointToCluster = function (point, cluster) {
	  cluster.addPoint(point);
	  this.clusterLookup[point] = cluster;
	};

	PointClusterMap.prototype.clearMultiPoints = function () {
	  each(this.clusters, function (cluster) {
	    each(cluster.points, function (point) {
	      point.multipoint = null;
	    }, this);
	  }, this);
	};

	PointClusterMap.prototype.getVertexPoints = function (baseVertexPoints) {
	  if (!baseVertexPoints) return this.vertexPoints;
	  var vertexPoints = this.vertexPoints.concat();
	  each(baseVertexPoints, function (point) {
	    if (!point.multipoint) vertexPoints.push(point);
	  });
	  return vertexPoints;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var each = __webpack_require__(14);

	/**
	 * Expose `PointCluster`
	 */

	module.exports = PointCluster;

	/**
	 *
	 */

	function PointCluster() {
	  this.points = [];
	}

	PointCluster.prototype.addPoint = function (point) {
	  if (this.points.indexOf(point) === -1) this.points.push(point);
	};

	PointCluster.prototype.mergeVertices = function (graph) {
	  var vertices = [];
	  each(this.points, function (point) {
	    vertices.push(point.graphVertex);
	  });
	  graph.mergeVertices(vertices);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);
	var each = __webpack_require__(14);

	var Point = __webpack_require__(29);

	/**
	 *  MultiPoint: a Point subclass representing a collection of multiple points
	 *  that have been merged into one for display purposes.
	 */

	var MultiPoint = augment(Point, function (base) {

	  this.constructor = function (pointArray) {
	    base.constructor.call(this);
	    this.points = [];
	    if (pointArray) {
	      pointArray.forEach(function (point) {
	        this.addPoint(point);
	      }, this);
	    }
	    this.renderData = [];
	    this.id = 'multi';
	    this.toPoint = this.fromPoint = null;

	    this.patternStylerKey = 'multipoints_pattern';
	  };

	  /**
	   * Get id
	   */

	  this.getId = function () {
	    return this.id;
	  };

	  /**
	   * Get type
	   */

	  this.getType = function () {
	    return 'MULTI';
	  };

	  this.getName = function () {
	    if (this.fromPoint) return this.fromPoint.getName();
	    if (this.toPoint) return this.toPoint.getName();
	    var shortest = null;
	    var nonTurnPointCount = 0;
	    this.points.forEach(function (point) {
	      if (point.getType() === 'TURN') return;
	      if (!shortest || point.getName().length < shortest.length) shortest = point.getName();
	      nonTurnPointCount++;
	    });

	    return shortest;
	  };

	  this.containsSegmentEndPoint = function () {
	    for (var i = 0; i < this.points.length; i++) {
	      if (this.points[i].containsSegmentEndPoint()) return true;
	    }
	    return false;
	  };

	  this.containsBoardPoint = function () {
	    for (var i = 0; i < this.points.length; i++) {
	      if (this.points[i].containsBoardPoint()) return true;
	    }
	    return false;
	  };

	  this.containsAlightPoint = function () {
	    for (var i = 0; i < this.points.length; i++) {
	      if (this.points[i].containsAlightPoint()) return true;
	    }
	    return false;
	  };

	  this.containsTransferPoint = function () {
	    for (var i = 0; i < this.points.length; i++) {
	      if (this.points[i].containsTransferPoint()) return true;
	    }
	    return false;
	  };

	  this.containsFromPoint = function () {
	    return this.fromPoint !== null;
	  };

	  this.containsToPoint = function () {
	    return this.toPoint !== null;
	  };

	  this.getPatterns = function () {
	    var patterns = [];

	    this.points.forEach(function (point) {
	      if (!point.patterns) return;
	      point.patterns.forEach(function (pattern) {
	        if (patterns.indexOf(pattern) === -1) patterns.push(pattern);
	      });
	    });

	    return patterns;
	  };

	  this.addPoint = function (point) {
	    if (this.points.indexOf(point) !== -1) return;
	    this.points.push(point);
	    this.id += '-' + point.getId();
	    if (point.containsFromPoint()) {
	      // getType() === 'PLACE' && point.getId() === 'from') {
	      this.fromPoint = point;
	    }
	    if (point.containsToPoint()) {
	      // getType() === 'PLACE' && point.getId() === 'to') {
	      this.toPoint = point;
	    }
	    this.calcWorldCoords();
	  };

	  this.calcWorldCoords = function () {
	    var tx = 0,
	        ty = 0;
	    each(this.points, function (point) {
	      tx += point.worldX;
	      ty += point.worldY;
	    });

	    this.worldX = tx / this.points.length;
	    this.worldY = ty / this.points.length;
	  };

	  /**
	   * Add render data
	   *
	   * @param {Object} stopInfo
	   */

	  this.addRenderData = function (pointInfo) {
	    if (pointInfo.offsetX !== 0 || pointInfo.offsetY !== 0) this.hasOffsetPoints = true;
	    this.renderData.push(pointInfo);
	  };

	  this.clearRenderData = function () {
	    this.hasOffsetPoints = false;
	    this.renderData = [];
	  };

	  /**
	   * Draw a multipoint
	   *
	   * @param {Display} display
	   */

	  this.render = function (display) {
	    base.render.call(this, display);

	    if (!this.renderData) return;

	    // set up the main svg group for this stop
	    this.initSvg(display);
	    this.svgGroup.attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'POINT_MULTI'
	    });

	    if (this.containsSegmentEndPoint()) this.initMergedMarker(display);

	    // set up the pattern markers
	    /*this.marker = this.markerSvg.selectAll('circle')
	      .data(this.renderData)
	      .enter()
	      .append('circle')
	      .attr('class', 'transitive-multipoint-marker-pattern');*/
	  };

	  this.initMergedMarker = function (display) {
	    // set up the merged marker
	    if (this.fromPoint || this.toPoint) {
	      this.mergedMarker = this.markerSvg.append('g').append('circle').datum({
	        owner: this
	      }).attr('class', 'transitive-multipoint-marker-merged');
	    } else if (this.hasOffsetPoints || this.renderData.length > 1) {

	      this.mergedMarker = this.markerSvg.append('g').append('rect').datum({
	        owner: this
	      }).attr('class', 'transitive-multipoint-marker-merged');
	    }
	  };

	  /**
	   * Refresh the point
	   *
	   * @param {Display} display
	   */

	  this.refresh = function (display) {
	    if (!this.renderData) return;

	    // refresh the merged marker
	    if (this.mergedMarker) {
	      if (!this.mergedMarkerData) this.initMarkerData(display);

	      this.mergedMarker.datum({
	        owner: this
	      });
	      this.mergedMarker.attr(this.mergedMarkerData);
	    }

	    /*var cx, cy;
	    // refresh the pattern-level markers
	    this.marker.data(this.renderData);
	    this.marker.attr('transform', function (d, i) {
	      cx = d.x;
	      cy = d.y;
	      var x = display.xScale(d.x) + d.offsetX;
	      var y = display.yScale(d.y) - d.offsetY;
	      return 'translate(' + x +', ' + y +')';
	    });*/
	  };

	  this.getRenderDataArray = function () {
	    return this.renderData;
	  };

	  this.setFocused = function (focused) {
	    this.focused = focused;
	    each(this.points, function (point) {
	      point.setFocused(focused);
	    });
	  };

	  this.runFocusTransition = function (display, callback) {
	    if (this.mergedMarker) {
	      var newStrokeColor = display.styler.compute(display.styler.multipoints_merged.stroke, display, {
	        owner: this
	      });
	      this.mergedMarker.transition().style('stroke', newStrokeColor).call(callback);
	    }
	    if (this.label) this.label.runFocusTransition(display, callback);
	  };
	});

	/**
	 * Expose `MultiPoint`
	 */

	module.exports = MultiPoint;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var each = __webpack_require__(14);

	var interpolateLine = __webpack_require__(19);
	var Util = __webpack_require__(20);

	var rEdgeId = 0;

	/**
	 * Expose `RenderedEdge`
	 */

	module.exports = RenderedEdge;

	/**
	 *
	 */

	function RenderedEdge(graphEdge, forward, type) {
	  this.id = rEdgeId++;
	  this.graphEdge = graphEdge;
	  this.forward = forward;
	  this.type = type;
	  this.points = [];
	  this.clearOffsets();
	  this.focused = true;
	  this.sortableType = 'SEGMENT';
	}

	RenderedEdge.prototype.clearGraphData = function () {
	  this.graphEdge = null;
	  this.edgeFromOffset = 0;
	  this.edgeToOffset = 0;
	};

	RenderedEdge.prototype.addPattern = function (pattern) {
	  if (!this.patterns) this.patterns = [];
	  if (this.patterns.indexOf(pattern) !== -1) return;
	  this.patterns.push(pattern);

	  // generate the patternIds field
	  this.patternIds = constuctIdListString(this.patterns);
	};

	RenderedEdge.prototype.addPathSegment = function (pathSegment) {
	  if (!this.pathSegments) this.pathSegments = [];
	  if (this.pathSegments.indexOf(pathSegment) !== -1) return;
	  this.pathSegments.push(pathSegment);

	  // generate the pathSegmentIds field
	  this.pathSegmentIds = constuctIdListString(this.pathSegments);
	};

	function constuctIdListString(items) {
	  var idArr = [];
	  each(items, function (item) {
	    idArr.push(item.getId());
	  });
	  idArr.sort();
	  return idArr.join(',');
	}

	RenderedEdge.prototype.getId = function () {
	  return this.id;
	};

	RenderedEdge.prototype.getType = function () {
	  return this.type;
	};

	RenderedEdge.prototype.setFromOffset = function (offset) {
	  this.fromOffset = offset;
	};

	RenderedEdge.prototype.setToOffset = function (offset) {
	  this.toOffset = offset;
	};

	RenderedEdge.prototype.clearOffsets = function () {
	  this.fromOffset = 0;
	  this.toOffset = 0;
	};

	RenderedEdge.prototype.getAlignmentVector = function (alignmentId) {
	  if (this.graphEdge.getFromAlignmentId() === alignmentId) {
	    return this.graphEdge.fromVector;
	  }
	  if (this.graphEdge.getToAlignmentId() === alignmentId) {
	    return this.graphEdge.toVector;
	  }
	  return null;
	};

	RenderedEdge.prototype.offsetAlignment = function (alignmentId, offset) {

	  if (this.graphEdge.getFromAlignmentId() === alignmentId) {
	    this.setFromOffset(Util.isOutwardVector(this.graphEdge.fromVector) ? offset : -offset);
	  }
	  if (this.graphEdge.getToAlignmentId() === alignmentId) {
	    this.setToOffset(Util.isOutwardVector(this.graphEdge.toVector) ? offset : -offset);
	  }
	};

	RenderedEdge.prototype.setFocused = function (focused) {
	  this.focused = focused;
	};

	RenderedEdge.prototype.refreshRenderData = function (display) {
	  if (this.graphEdge.fromVertex.x === this.graphEdge.toVertex.x && this.graphEdge.fromVertex.y === this.graphEdge.toVertex.y) {
	    this.renderData = [];
	    return;
	  }

	  this.lineWidth = this.computeLineWidth(display, true);

	  var fromOffsetPx = this.fromOffset * this.lineWidth;
	  var toOffsetPx = this.toOffset * this.lineWidth;

	  if (this.graphEdge.geomCoords) {
	    this.renderData = this.graphEdge.getGeometricCoords(fromOffsetPx, toOffsetPx, display, this.forward);
	  } else {
	    this.renderData = this.graphEdge.getRenderCoords(fromOffsetPx, toOffsetPx, display, this.forward);
	  }

	  var firstRenderPoint = this.renderData[0];
	  var lastRenderPoint = this.renderData[this.renderData.length - 1];

	  if (!this.graphEdge.fromVertex.isInternal) {
	    this.graphEdge.fromVertex.point.addRenderData({
	      x: this.forward ? firstRenderPoint.x : lastRenderPoint.x,
	      y: this.forward ? firstRenderPoint.y : lastRenderPoint.y,
	      rEdge: this
	    });
	  }

	  this.graphEdge.toVertex.point.addRenderData({
	    x: this.forward ? lastRenderPoint.x : firstRenderPoint.x,
	    y: this.forward ? lastRenderPoint.y : firstRenderPoint.y,
	    rEdge: this
	  });

	  each(this.graphEdge.pointArray, function (point, i) {
	    if (point.getType() === 'TURN') return;
	    var t = (i + 1) / (this.graphEdge.pointArray.length + 1);
	    var coord = this.graphEdge.coordAlongEdge(this.forward ? t : 1 - t, this.renderData, display);
	    if (coord) {
	      point.addRenderData({
	        x: coord.x,
	        y: coord.y,
	        rEdge: this
	      });
	    }
	  }, this);
	};

	RenderedEdge.prototype.computeLineWidth = function (display, includeEnvelope) {
	  var styler = display.styler;
	  if (styler && display) {
	    // compute the line width
	    var env = styler.compute(styler.segments.envelope, display, this);
	    if (env && includeEnvelope) {
	      return parseFloat(env.substring(0, env.length - 2), 10) - 2;
	    } else {
	      var lw = styler.compute(styler.segments['stroke-width'], display, this);
	      return parseFloat(lw.substring(0, lw.length - 2), 10) - 2;
	    }
	  }
	};

	RenderedEdge.prototype.isFocused = function () {
	  return this.focused === true;
	};

	RenderedEdge.prototype.getZIndex = function () {
	  return 10000;
	};

	/**
	 *  Computes the point of intersection between two adjacent, offset RenderedEdges (the
	 *  edge the function is called on and a second egde passed as a parameter)
	 *  by "extending" the adjacent edges and finding the point of intersection. If
	 *  such a point exists, the existing renderData arrays for the edges are
	 *  adjusted accordingly, as are any associated stops.
	 */

	RenderedEdge.prototype.intersect = function (rEdge) {

	  // do no intersect adjacent edges of unequal bundle size
	  if (this.graphEdge.renderedEdges.length !== rEdge.graphEdge.renderedEdges.length) return;

	  var commonVertex = this.graphEdge.commonVertex(rEdge.graphEdge);
	  if (!commonVertex || commonVertex.point.isSegmentEndPoint) return;

	  var thisCheck = commonVertex === this.graphEdge.fromVertex && this.forward || commonVertex === this.graphEdge.toVertex && !this.forward;
	  var otherCheck = commonVertex === rEdge.graphEdge.fromVertex && rEdge.forward || commonVertex === rEdge.graphEdge.toVertex && !rEdge.forward;

	  var p1 = thisCheck ? this.renderData[0] : this.renderData[this.renderData.length - 1];
	  var v1 = this.graphEdge.getVector(commonVertex);

	  var p2 = otherCheck ? rEdge.renderData[0] : rEdge.renderData[rEdge.renderData.length - 1];
	  var v2 = rEdge.graphEdge.getVector(commonVertex);

	  if (p1.x === p2.x && p1.y === p2.y) return;

	  var isect = Util.lineIntersection(p1.x, p1.y, p1.x + v1.x, p1.y - v1.y, p2.x, p2.y, p2.x + v2.x, p2.y - v2.y);

	  if (!isect.intersect) return;

	  // adjust the endpoint of the first edge
	  if (thisCheck) {
	    this.renderData[0].x = isect.x;
	    this.renderData[0].y = isect.y;
	  } else {
	    this.renderData[this.renderData.length - 1].x = isect.x;
	    this.renderData[this.renderData.length - 1].y = isect.y;
	  }

	  // adjust the endpoint of the second edge
	  if (otherCheck) {
	    rEdge.renderData[0].x = isect.x;
	    rEdge.renderData[0].y = isect.y;
	  } else {
	    rEdge.renderData[rEdge.renderData.length - 1].x = isect.x;
	    rEdge.renderData[rEdge.renderData.length - 1].y = isect.y;
	  }

	  // update the point renderData
	  commonVertex.point.addRenderData({
	    x: isect.x,
	    y: isect.y,
	    rEdge: this
	  });
	};

	RenderedEdge.prototype.findExtension = function (vertex) {
	  var incidentEdges = vertex.incidentEdges(this.graphEdge);
	  var bundlerId = this.patternIds || this.pathSegmentIds;
	  for (var e = 0; e < incidentEdges.length; e++) {
	    var edgeSegments = incidentEdges[e].renderedEdges;
	    for (var s = 0; s < edgeSegments.length; s++) {
	      var segment = edgeSegments[s];
	      var otherId = segment.patternIds || segment.pathSegmentIds;
	      if (bundlerId === otherId) {
	        return segment;
	      }
	    }
	  }
	};

	RenderedEdge.prototype.toString = function () {
	  return 'RenderedEdge ' + this.id + ' type=' + this.type + ' on ' + this.graphEdge.toString() + ' w/ patterns ' + this.patternIds + ' fwd=' + this.forward;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var d3 = __webpack_require__(3);
	var each = __webpack_require__(14);

	var interpolateLine = __webpack_require__(19);

	/**
	 * Expose `RenderedSegment`
	 */

	module.exports = RenderedSegment;

	var rSegmentId = 0;

	/**
	 *
	 */

	function RenderedSegment(pathSegment) {
	  this.id = rSegmentId++;
	  this.renderedEdges = [];
	  this.pathSegment = pathSegment;
	  if (pathSegment) this.type = pathSegment.type;
	  this.focused = true;
	}

	RenderedSegment.prototype.getId = function () {
	  return this.id;
	};

	RenderedSegment.prototype.getType = function () {
	  return this.type;
	};

	RenderedSegment.prototype.addRenderedEdge = function (rEdge) {
	  this.renderedEdges.push(rEdge);
	};

	RenderedSegment.prototype.render = function (display) {

	  this.line = d3.svg.line() // the line translation function
	  .x(function (data, i) {
	    return data.x;
	  }).y(function (data, i) {
	    return data.y;
	  }).interpolate(interpolateLine.bind({
	    segment: this,
	    display: display
	  }));

	  this.svgGroup = display.svg.append('g');

	  this.lineSvg = this.svgGroup.append('g').attr('class', 'transitive-sortable').datum({
	    owner: this,
	    sortableType: 'SEGMENT'
	  });

	  this.labelSvg = this.svgGroup.append('g');

	  this.lineGraph = this.lineSvg.append('path');

	  this.lineGraph.attr('class', 'transitive-line').data([this]);

	  this.lineGraphFront = this.lineSvg.append('path');

	  this.lineGraphFront.attr('class', 'transitive-line-front').data([this]);

	  if (display.haloLayer) {
	    this.lineGraphHalo = display.haloLayer.append('path');

	    this.lineGraphHalo.attr('class', 'transitive-line-halo').data([this]);
	  }
	};

	RenderedSegment.prototype.refresh = function (display, renderData) {

	  if (renderData) {
	    this.renderData = renderData;
	  } else {
	    this.renderData = [];
	    each(this.renderedEdges, function (rEdge) {
	      this.renderData = this.renderData.concat(rEdge.renderData);
	    }, this);
	  }

	  var lineData = this.line(this.renderData);
	  this.lineGraph.attr('d', lineData);
	  this.lineGraphFront.attr('d', lineData);
	  if (this.lineGraphHalo) this.lineGraphHalo.attr('d', lineData);
	  display.styler.styleSegment(display, this);
	};

	RenderedSegment.prototype.setFocused = function (focused) {
	  this.focused = focused;
	};

	RenderedSegment.prototype.isFocused = function () {
	  return this.focused;
	};

	RenderedSegment.prototype.runFocusTransition = function (display, callback) {
	  var newColor = display.styler.compute(display.styler.segments.stroke, display, this);
	  this.lineGraph.transition().style('stroke', newColor).call(callback);
	};

	RenderedSegment.prototype.getZIndex = function () {
	  return this.zIndex;
	};

	RenderedSegment.prototype.computeLineWidth = function (display, includeEnvelope) {
	  var styler = display.styler;
	  if (styler && display) {
	    // compute the line width
	    var env = styler.compute(styler.segments.envelope, display, this);
	    if (env && includeEnvelope) {
	      return parseFloat(env.substring(0, env.length - 2), 10) - 2;
	    } else {
	      var lw = styler.compute(styler.segments['stroke-width'], display, this);
	      return parseFloat(lw.substring(0, lw.length - 2), 10) - 2;
	    }
	  }
	};

	RenderedSegment.prototype.compareTo = function (other) {

	  // show transit segments in front of other types
	  if (this.type === 'TRANSIT' && other.type !== 'TRANSIT') return -1;
	  if (other.type === 'TRANSIT' && this.type !== 'TRANSIT') return 1;

	  if (this.type === 'TRANSIT' && other.type === 'TRANSIT') {

	    // for two transit segments, try sorting transit mode first
	    if (this.mode && other.mode && this.mode !== other.mode) {
	      return this.mode > other.mode;
	    }

	    // for two transit segments of the same mode, sort by id (for display consistency)
	    return this.getId() < other.getId();
	  }
	};

	RenderedSegment.prototype.getLabelTextArray = function () {
	  var textArray = [];
	  each(this.patterns, function (pattern) {
	    var shortName = pattern.route.route_short_name;
	    if (textArray.indexOf(shortName) === -1) textArray.push(shortName);
	  });
	  return textArray;
	};

	RenderedSegment.prototype.getLabelAnchors = function (display, spacing) {

	  var labelAnchors = [];
	  this.computeRenderLength(display);
	  var anchorCount = Math.floor(this.renderLength / spacing);
	  var pctSpacing = spacing / this.renderLength;

	  for (var i = 0; i < anchorCount; i++) {
	    var t = i % 2 === 0 ? 0.5 + i / 2 * pctSpacing : 0.5 - (i + 1) / 2 * pctSpacing;
	    var coord = this.coordAlongRenderedPath(t, display);
	    if (coord) labelAnchors.push(coord);
	  }

	  return labelAnchors;
	};

	RenderedSegment.prototype.coordAlongRenderedPath = function (t, display) {
	  var loc = t * this.renderLength;

	  var cur = 0;
	  for (var i = 0; i < this.renderedEdges.length; i++) {
	    var rEdge = this.renderedEdges[i];
	    var edgeRenderLen = rEdge.graphEdge.getRenderLength(display);
	    if (loc <= cur + edgeRenderLen) {
	      var t2 = (loc - cur) / edgeRenderLen;
	      return rEdge.graphEdge.coordAlongEdge(t2, rEdge.renderData, display);
	    }
	    cur += edgeRenderLen;
	  }
	};

	RenderedSegment.prototype.computeRenderLength = function (display) {
	  this.renderLength = 0;
	  each(this.renderedEdges, function (rEdge) {
	    this.renderLength += rEdge.graphEdge.getRenderLength(display);
	  }, this);
	};

	RenderedSegment.prototype.getLegendType = function () {
	  if (this.type === 'TRANSIT') {
	    return this.type + '_' + this.mode;
	  }
	  return this.type;
	};

	RenderedSegment.prototype.toString = function () {
	  return 'RenderedSegment ' + this.id + ' on ' + (this.pathSegment ? this.pathSegment.toString() : ' (null segment)');
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var debug = __webpack_require__(9)('transitive:graph');
	var each = __webpack_require__(14);
	var PriorityQueue = __webpack_require__(54);

	var Edge = __webpack_require__(55);
	var EdgeGroup = __webpack_require__(56);
	var Vertex = __webpack_require__(57);
	var MultiPoint = __webpack_require__(50);
	var Util = __webpack_require__(20);

	/**
	 * Expose `NetworkGraph`
	 */

	module.exports = NetworkGraph;

	/**
	 *  An graph representing the underlying 'wireframe' network
	 */

	function NetworkGraph(network, vertices) {
	  this.network = network;
	  this.edges = [];
	  this.vertices = [];

	  /**
	   *  Object mapping groups of edges that share the same two vertices.
	   *  - Key is string of format A_B, where A and B are vertex IDs and A < B
	   *  - Value is array of edges
	   */
	  this.edgeGroups = {};

	  // Add all base vertices
	  for (var i in vertices) this.addVertex(vertices[i], vertices[i].worldX, vertices[i].worldY);
	}

	/**
	 * Get the bounds of the graph in the graph's internal x/y coordinate space
	 *
	 * @return [[left, top], [right, bottom]]
	 */

	NetworkGraph.prototype.bounds = function () {
	  var xmax = null,
	      xmin = null;
	  var ymax = null,
	      ymin = null;

	  for (var i in this.vertices) {
	    var vertex = this.vertices[i];
	    xmin = xmin ? Math.min(xmin, vertex.x) : vertex.x;
	    xmax = xmax ? Math.max(xmax, vertex.x) : vertex.x;
	    ymin = ymin ? Math.min(ymin, vertex.y) : vertex.y;
	    ymax = ymax ? Math.max(ymax, vertex.y) : vertex.y;
	  }

	  var maxExtent = 20037508.34;
	  return [[xmin || -maxExtent, ymin || -maxExtent], [xmax || maxExtent, ymax || maxExtent]];
	};

	/**
	 * Add Vertex
	 */

	NetworkGraph.prototype.addVertex = function (point, x, y) {
	  if (x === undefined || y === undefined) {
	    var xy = Util.latLonToSphericalMercator(point.getLat(), point.getLon());
	    x = xy[0];
	    y = xy[1];
	  }
	  var vertex = new Vertex(point, x, y);
	  this.vertices.push(vertex);
	  return vertex;
	};

	/**
	 * Add Edge
	 */

	NetworkGraph.prototype.addEdge = function (stops, from, to, segmentType) {
	  if (this.vertices.indexOf(from) === -1 || this.vertices.indexOf(to) === -1) {
	    debug('Error: Cannot add edge. Graph does not contain vertices.');
	    return;
	  }

	  var edge = new Edge(stops, from, to);
	  this.edges.push(edge);
	  from.edges.push(edge);
	  to.edges.push(edge);

	  var groupKey = this.network.transitive.options.groupEdges ? this.getEdgeGroupKey(edge, segmentType) : edge.getId();

	  if (!(groupKey in this.edgeGroups)) {
	    this.edgeGroups[groupKey] = new EdgeGroup(edge.fromVertex, edge.toVertex, segmentType);
	  }
	  this.edgeGroups[groupKey].addEdge(edge);

	  return edge;
	};

	NetworkGraph.prototype.removeEdge = function (edge) {

	  // remove from the graph's edge collection
	  var edgeIndex = this.edges.indexOf(edge);
	  if (edgeIndex !== -1) this.edges.splice(edgeIndex, 1);

	  // remove from any associated path segment edge lists
	  edge.pathSegments.forEach(function (segment) {
	    segment.removeEdge(edge);
	  });

	  // remove from the endpoint vertex incidentEdge collections
	  edge.fromVertex.removeEdge(edge);
	  edge.toVertex.removeEdge(edge);
	};

	NetworkGraph.prototype.getEdgeGroup = function (edge) {
	  return this.edgeGroups[this.getEdgeGroupKey(edge)];
	};

	NetworkGraph.prototype.getEdgeGroupKey = function (edge, segmentType) {
	  return edge.fromVertex.getId() < edge.toVertex.getId() ? segmentType + '_' + edge.fromVertex.getId() + '_' + edge.toVertex.getId() : segmentType + '_' + edge.toVertex.getId() + '_' + edge.fromVertex.getId();
	};

	NetworkGraph.prototype.mergeVertices = function (vertexArray) {
	  var xTotal = 0,
	      yTotal = 0;

	  var vertexGroups = {
	    'STOP': [],
	    'PLACE': [],
	    'TURN': [],
	    'MULTI': []
	  };
	  vertexArray.forEach(function (vertex) {
	    if (vertex.point.getType() in vertexGroups) vertexGroups[vertex.point.getType()].push(vertex);
	  });

	  var mergePoint;

	  // don't merge stops and places, or multiple places:
	  if (vertexGroups.STOP.length > 0 && vertexGroups.PLACE.length > 0 || vertexGroups.PLACE.length > 1 || vertexGroups.MULTI.length > 0) return;

	  // if merging turns with a place, create a new merged vertex around the place
	  if (vertexGroups.PLACE.length === 1 && vertexGroups.TURN.length > 0) {
	    mergePoint = vertexGroups.PLACE[0].point;
	  }

	  // if merging turns with a single place, create a new merged vertex around the stop
	  else if (vertexGroups.STOP.length === 1 && vertexGroups.TURN.length > 0) {
	      mergePoint = vertexGroups.STOP[0].point;
	    }

	    // if merging multiple stops, create a new MultiPoint vertex
	    else if (vertexGroups.STOP.length > 1) {
	        mergePoint = new MultiPoint();
	        each(vertexGroups.STOP, function (stopVertex) {
	          mergePoint.addPoint(stopVertex.point);
	        });
	      }

	      // if merging multiple turns
	      else if (vertexGroups.TURN.length > 1) {
	          mergePoint = vertexGroups.TURN[0].point;
	        }

	  if (!mergePoint) return;
	  var mergedVertex = new Vertex(mergePoint, 0, 0);

	  var origPoints = [];
	  vertexArray.forEach(function (vertex) {
	    xTotal += vertex.x;
	    yTotal += vertex.y;

	    var edges = [];
	    each(vertex.edges, function (edge) {
	      edges.push(edge);
	    });

	    each(edges, function (edge) {
	      if (vertexArray.indexOf(edge.fromVertex) !== -1 && vertexArray.indexOf(edge.toVertex) !== -1) {
	        this.removeEdge(edge);
	        return;
	      }
	      edge.replaceVertex(vertex, mergedVertex);
	      mergedVertex.addEdge(edge);
	    }, this);
	    var index = this.vertices.indexOf(vertex);
	    if (index !== -1) this.vertices.splice(index, 1);
	  }, this);

	  mergedVertex.x = xTotal / vertexArray.length;
	  mergedVertex.y = yTotal / vertexArray.length;
	  mergedVertex.oldVertices = vertexArray;

	  this.vertices.push(mergedVertex);
	};

	NetworkGraph.prototype.sortVertices = function () {
	  this.vertices.sort(function (a, b) {
	    if (a.point && a.point.getType() === 'PLACE') return -1;
	    if (b.point && b.point.getType() === 'PLACE') return 1;

	    if (a.point && a.point.getType() === 'MULTI') return -1;
	    if (b.point && b.point.getType() === 'MULTI') return 1;

	    if (a.point && a.point.getType() === 'STOP') return -1;
	    if (b.point && b.point.getType() === 'STOP') return 1;
	  });
	};

	/**
	 * Get the equivalent edge
	 */

	NetworkGraph.prototype.getEquivalentEdge = function (pointArray, from, to) {
	  for (var e = 0; e < this.edges.length; e++) {
	    var edge = this.edges[e];
	    if (edge.fromVertex === from && edge.toVertex === to && pointArray.length === edge.pointArray.length && equal(pointArray, edge.pointArray)) {
	      return edge;
	    }
	    if (edge.fromVertex === to && edge.toVertex === from && pointArray.length === edge.pointArray.length && equal(pointArray.slice(0).reverse(), edge.pointArray)) {
	      return edge;
	    }
	  }
	};

	NetworkGraph.prototype.splitEdgeAtInternalPoints = function (edge, points) {
	  var subEdgePoints = [],
	      newEdge,
	      newEdgeInfoArr = [];
	  var fromVertex = edge.fromVertex;
	  each(edge.pointArray, function (point) {
	    if (points.indexOf(point) !== -1) {
	      var x = point.worldX;
	      var y = point.worldY;
	      var newVertex = point.graphVertex || this.addVertex(point, x, y);
	      newVertex.isInternal = true;
	      newEdge = this.addEdge(subEdgePoints, fromVertex, newVertex, edge.edgeGroup.type);
	      newEdge.isInternal = true;
	      newEdge.copyPathSegments(edge);
	      newEdgeInfoArr.push({
	        graphEdge: newEdge,
	        fromVertex: fromVertex
	      });
	      subEdgePoints = [];
	      fromVertex = newVertex;
	    } else {
	      subEdgePoints.push(point);
	    }
	  }, this);

	  // create the last sub-edge
	  newEdge = this.addEdge(subEdgePoints, fromVertex, edge.toVertex, edge.edgeGroup.type);
	  newEdge.isInternal = true;
	  newEdge.copyPathSegments(edge);
	  newEdgeInfoArr.push({
	    graphEdge: newEdge,
	    fromVertex: fromVertex
	  });

	  // insert the new edge sequence into the affected segments
	  each(edge.pathSegments, function (pathSegment) {
	    var indexInSegment = pathSegment.getEdgeIndex(edge);
	    var forward = pathSegment.edges[indexInSegment].forward;
	    var index = pathSegment.getEdgeIndex(edge);
	    each(forward ? newEdgeInfoArr : newEdgeInfoArr.reverse(), function (edgeInfo) {
	      pathSegment.insertEdgeAt(index, edgeInfo.graphEdge, forward ? edgeInfo.fromVertex : edgeInfo.toVertex);
	      index++;
	    });
	  });

	  // remove the original edge from the graph
	  this.removeEdge(edge);
	};

	/*NetworkGraph.prototype.collapseTransfers = function(threshold) {
	  if(!threshold) return;
	  this.edges.forEach(function(edge) {
	    if (edge.getLength() > threshold ||
	      edge.fromVertex.point.containsFromPoint() ||
	      edge.fromVertex.point.containsToPoint() ||
	      edge.toVertex.point.containsFromPoint() ||
	      edge.toVertex.point.containsToPoint()) return;
	    //if(edge.fromVertex.point.getType() === 'PLACE' || edge.toVertex.point.getType() === 'PLACE') return;
	    var notTransit = true;
	    edge.pathSegments.forEach(function(segment) {
	      notTransit = notTransit && segment.type !== 'TRANSIT';
	    });
	    if (notTransit) {
	      this.mergeVertices([edge.fromVertex, edge.toVertex]);
	    }
	  }, this);
	};*/

	NetworkGraph.prototype.pruneVertices = function () {
	  each(this.vertices, function (vertex) {
	    if (vertex.point.containsSegmentEndPoint()) return;

	    var opposites = [];
	    var pathSegmentBundles = {}; // maps pathSegment id list (string) to collection of edges (array)

	    each(vertex.edges, function (edge) {
	      var pathSegmentIds = edge.getPathSegmentIds();
	      if (!(pathSegmentIds in pathSegmentBundles)) pathSegmentBundles[pathSegmentIds] = [];
	      pathSegmentBundles[pathSegmentIds].push(edge);
	      var opp = edge.oppositeVertex(vertex);
	      if (opposites.indexOf(opp) === -1) opposites.push(opp);
	    });

	    if (opposites.length !== 2) return;

	    each(pathSegmentBundles, function (ids) {
	      var edgeArr = pathSegmentBundles[ids];
	      if (edgeArr.length === 2) this.mergeEdges(edgeArr[0], edgeArr[1]);
	    }, this);
	  }, this);
	};

	NetworkGraph.prototype.mergeEdges = function (edge1, edge2) {

	  // reverse edges if necessary
	  if (edge1.fromVertex === edge2.toVertex) {
	    this.mergeEdges(edge2, edge1);
	    return;
	  }

	  if (edge1.toVertex !== edge2.fromVertex) return; // edges cannot be merged

	  var internalPoints = edge1.pointArray.concat(edge2.pointArray);

	  var newEdge = this.addEdge(internalPoints, edge1.fromVertex, edge2.toVertex, edge1.edgeGroup.type);
	  newEdge.pathSegments = edge1.pathSegments;
	  each(newEdge.pathSegments, function (segment) {
	    //var i = segment.graphEdges.indexOf(edge1);
	    //segment.graphEdges.splice(i, 0, newEdge);
	    var i = segment.getEdgeIndex(edge1);
	    segment.insertEdgeAt(i, newEdge, newEdge.fromVertex);
	  });

	  // if both input edges are have coordinate geometry, merge the coords arrays in the new edge
	  if (edge1.geomCoords && edge2.geomCoords) {
	    newEdge.geomCoords = edge1.geomCoords.concat(edge2.geomCoords.length > 0 ? edge2.geomCoords.slice(1) : []);
	  }

	  debug('merging:');
	  debug(edge1);
	  debug(edge2);
	  this.removeEdge(edge1);
	  this.removeEdge(edge2);
	};

	NetworkGraph.prototype.snapToGrid = function (cellSize) {
	  var coincidenceMap = {};
	  this.vertices.forEach(function (vertex) {
	    var nx = Math.round(vertex.x / cellSize) * cellSize;
	    var ny = Math.round(vertex.y / cellSize) * cellSize;
	    vertex.x = nx;
	    vertex.y = ny;

	    var key = nx + '_' + ny;
	    if (!(key in coincidenceMap)) coincidenceMap[key] = [vertex];else coincidenceMap[key].push(vertex);
	  });

	  each(coincidenceMap, function (key) {
	    var vertexArr = coincidenceMap[key];
	    if (vertexArr.length > 1) {
	      this.mergeVertices(vertexArr);
	    }
	  }, this);
	};

	NetworkGraph.prototype.calculateGeometry = function (cellSize, angleConstraint) {
	  this.edges.forEach(function (edge) {
	    edge.calculateGeometry(cellSize, angleConstraint);
	  });
	};

	NetworkGraph.prototype.resetCoordinates = function () {
	  this.vertices.forEach(function (vertex) {
	    vertex.x = vertex.origX;
	    vertex.y = vertex.origY;
	  });
	};

	NetworkGraph.prototype.recenter = function () {

	  var xCoords = [],
	      yCoords = [];
	  this.vertices.forEach(function (v) {
	    xCoords.push(v.x);
	    yCoords.push(v.y);
	  });

	  var mx = d3.median(xCoords),
	      my = d3.median(yCoords);

	  this.vertices.forEach(function (v) {
	    v.x = v.x - mx;
	    v.y = v.y - my;
	  });
	};

	NetworkGraph.prototype.clone = function () {
	  var vertices = [];
	  this.vertices.forEach(function (vertex) {
	    vertices.push(vertex.clone());
	  });

	  var edges = [];
	  this.edges.forEach(function (edge) {
	    edge.push(edge.clone());
	  });
	};

	/** 2D line bundling & offsetting **/

	NetworkGraph.prototype.apply2DOffsets = function () {

	  this.initComparisons();

	  var alignmentBundles = {}; // maps alignment ID to array of range-bounded bundles on that alignment

	  var addToBundle = function addToBundle(rEdge, alignmentId) {
	    var bundle;

	    // compute the alignment range of the edge being bundled
	    var range = rEdge.graphEdge.getAlignmentRange(alignmentId);

	    // check if bundles already exist for this alignment
	    if (!(alignmentId in alignmentBundles)) {
	      // if not, create new and add to collection
	      bundle = new AlignmentBundle();
	      bundle.addEdge(rEdge, range.min, range.max);
	      alignmentBundles[alignmentId] = [bundle]; // new AlignmentBundle();
	    } else {
	        // 1 or more bundles currently exist for this alignmentId
	        var bundleArr = alignmentBundles[alignmentId];

	        // see if the segment range overlaps with that of an existing bundle
	        for (var i = 0; i < bundleArr.length; i++) {
	          if (bundleArr[i].rangeOverlaps(range.min, range.max)) {
	            bundleArr[i].addEdge(rEdge, range.min, range.max);
	            return;
	          }
	        }

	        // ..if not, create a new bundle
	        bundle = new AlignmentBundle();
	        bundle.addEdge(rEdge, range.min, range.max);
	        bundleArr.push(bundle);
	      }
	  };

	  each(this.edges, function (edge) {

	    var fromAlignmentId = edge.getFromAlignmentId();
	    var toAlignmentId = edge.getToAlignmentId();

	    each(edge.renderedEdges, function (rEdge) {
	      addToBundle(rEdge, fromAlignmentId);
	      addToBundle(rEdge, toAlignmentId);
	    });
	  });

	  var bundleSorter = (function (a, b) {

	    var aId = a.patternIds || a.pathSegmentIds;
	    var bId = b.patternIds || b.pathSegmentIds;

	    var aVector = a.getAlignmentVector(this.currentAlignmentId);
	    var bVector = b.getAlignmentVector(this.currentAlignmentId);
	    var isOutward = Util.isOutwardVector(aVector) && Util.isOutwardVector(bVector) ? 1 : -1;

	    var abCompId = aId + '_' + bId;
	    if (abCompId in this.bundleComparisons) {
	      return isOutward * this.bundleComparisons[abCompId];
	    }

	    var baCompId = bId + '_' + aId;
	    if (baCompId in this.bundleComparisons) {
	      return isOutward * this.bundleComparisons[baCompId];
	    }

	    if (a.route && b.route && a.route.route_type !== b.route.route_type) {
	      return a.route.route_type > b.route.route_type ? 1 : -1;
	    }

	    var isForward = a.forward && b.forward ? 1 : -1;
	    return isForward * isOutward * (aId < bId ? -1 : 1);
	  }).bind(this);

	  each(alignmentBundles, function (alignmentId) {
	    var bundleArr = alignmentBundles[alignmentId];
	    each(bundleArr, function (bundle) {
	      if (bundle.items.length <= 1) return;
	      var lw = 1.2;
	      var bundleWidth = lw * (bundle.items.length - 1);

	      this.currentAlignmentId = alignmentId;
	      bundle.items.sort(bundleSorter);
	      each(bundle.items, function (rEdge, i) {
	        var offset = -bundleWidth / 2 + i * lw;
	        if (rEdge.getType() === 'TRANSIT') {
	          each(rEdge.patterns, function (pattern) {
	            pattern.offsetAlignment(alignmentId, offset);
	          });
	        } else rEdge.offsetAlignment(alignmentId, offset);
	      });
	    }, this);
	  }, this);
	};

	/**
	 * Traverses the graph vertex-by-vertex, creating comparisons between all pairs of
	 * edges for which a topological relationship can be established.
	 */

	NetworkGraph.prototype.initComparisons = function () {

	  this.bundleComparisons = {};

	  each(this.vertices, function (vertex) {
	    var incidentGraphEdges = vertex.incidentEdges();

	    var angleREdges = {};
	    each(incidentGraphEdges, function (incidentGraphEdge) {
	      var angle = incidentGraphEdge.fromVertex === vertex ? incidentGraphEdge.fromAngle : incidentGraphEdge.toAngle;
	      var angleDeg = 180 * angle / Math.PI;
	      if (!(angleDeg in angleREdges)) angleREdges[angleDeg] = [];
	      angleREdges[angleDeg] = angleREdges[angleDeg].concat(incidentGraphEdge.renderedEdges);
	    });

	    each(angleREdges, function (angle) {
	      var rEdges = angleREdges[angle];
	      if (rEdges.length < 2) return;
	      for (var i = 0; i < rEdges.length - 1; i++) {
	        for (var j = i + 1; j < rEdges.length; j++) {
	          var re1 = rEdges[i],
	              re2 = rEdges[j];

	          var opp1 = re1.graphEdge.oppositeVertex(vertex);
	          var opp2 = re2.graphEdge.oppositeVertex(vertex);

	          var ccw = Util.ccw(opp1.x, opp1.y, vertex.x, vertex.y, opp2.x, opp2.y);

	          if (ccw === 0) {
	            var s1Ext = re1.findExtension(opp1);
	            var s2Ext = re2.findExtension(opp2);
	            if (s1Ext) opp1 = s1Ext.graphEdge.oppositeVertex(opp1);
	            if (s2Ext) opp2 = s2Ext.graphEdge.oppositeVertex(opp2);
	            ccw = Util.ccw(opp1.x, opp1.y, vertex.x, vertex.y, opp2.x, opp2.y);
	          }

	          ccw = getInverse(re1, re2, vertex) * ccw;

	          if (ccw > 0) {
	            // e1 patterns are 'less' than e2 patterns
	            this.storeComparison(re1, re2);
	          }

	          if (ccw < 0) {
	            // e2 patterns are 'less' than e2 patterns
	            this.storeComparison(re2, re1);
	          }
	        }
	      }
	    }, this);
	  }, this);
	};

	function getInverse(s1, s2, vertex) {
	  return s1.graphEdge.toVertex === vertex && s2.graphEdge.toVertex === vertex || s1.graphEdge.toVertex === vertex && s2.graphEdge.fromVertex === vertex ? -1 : 1;
	}

	NetworkGraph.prototype.storeComparison = function (s1, s2) {
	  var s1Id = s1.patternIds || s1.pathSegmentIds;
	  var s2Id = s2.patternIds || s2.pathSegmentIds;
	  debug('storing comparison: ' + s1Id + ' < ' + s2Id);
	  this.bundleComparisons[s1Id + '_' + s2Id] = -1;
	  this.bundleComparisons[s2Id + '_' + s1Id] = 1;
	};

	/**
	 *  AlignmentBundle class
	 */

	function AlignmentBundle() {
	  this.items = []; // RenderedEdges
	  this.min = Number.MAX_VALUE;
	  this.max = -Number.MAX_VALUE;
	}

	AlignmentBundle.prototype.addEdge = function (rEdge, min, max) {

	  if (this.items.indexOf(rEdge) === -1) {
	    this.items.push(rEdge);
	  }

	  this.min = Math.min(this.min, min);
	  this.max = Math.max(this.max, max);
	};

	AlignmentBundle.prototype.rangeOverlaps = function (min, max) {
	  return this.min < max && min < this.max;
	};

	/** other helper functions **/

	function getAlignmentVector(alignmentId) {
	  if (alignmentId.charAt(0) === 'x') return {
	    x: 0,
	    y: 1
	  };
	  if (alignmentId.charAt(0) === 'y') return {
	    x: 1,
	    y: 0
	  };
	}

	function getOutVector(edge, vertex) {

	  if (edge.fromVertex === vertex) {
	    return edge.fromVector;
	  }
	  if (edge.toVertex === vertex) {
	    var v = {
	      x: -edge.toVector.x,
	      y: -edge.toVector.y
	    };
	    return v;
	  }

	  debug('Warning: getOutVector() called on invalid edge / vertex pair');
	  debug(' - Edge: ' + edge.toString());
	  debug(' - Vertex: ' + vertex.toString());
	}

	/**
	 * Check if arrays are equal
	 */

	function equal(a, b) {
	  if (a.length !== b.length) {
	    return false;
	  }

	  for (var i in a) {
	    if (a[i] !== b[i]) {
	      return false;
	    }
	  }

	  return true;
	}

/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * Expose `PriorityQueue`.
	 */
	'use strict';

	module.exports = PriorityQueue;

	/**
	 * Initializes a new empty `PriorityQueue` with the given `comparator(a, b)`
	 * function, uses `.DEFAULT_COMPARATOR()` when no function is provided.
	 *
	 * The comparator function must return a positive number when `a > b`, 0 when
	 * `a == b` and a negative number when `a < b`.
	 *
	 * @param {Function}
	 * @return {PriorityQueue}
	 * @api public
	 */
	function PriorityQueue(comparator) {
	  this._comparator = comparator || PriorityQueue.DEFAULT_COMPARATOR;
	  this._elements = [];
	}

	/**
	 * Compares `a` and `b`, when `a > b` it returns a positive number, when
	 * it returns 0 and when `a < b` it returns a negative number.
	 *
	 * @param {String|Number} a
	 * @param {String|Number} b
	 * @return {Number}
	 * @api public
	 */
	PriorityQueue.DEFAULT_COMPARATOR = function (a, b) {
	  if (typeof a === 'number' && typeof b === 'number') {
	    return a - b;
	  } else {
	    a = a.toString();
	    b = b.toString();

	    if (a == b) return 0;

	    return a > b ? 1 : -1;
	  }
	};

	/**
	 * Returns whether the priority queue is empty or not.
	 *
	 * @return {Boolean}
	 * @api public
	 */
	PriorityQueue.prototype.isEmpty = function () {
	  return this.size() === 0;
	};

	/**
	 * Peeks at the top element of the priority queue.
	 *
	 * @return {Object}
	 * @throws {Error} when the queue is empty.
	 * @api public
	 */
	PriorityQueue.prototype.peek = function () {
	  if (this.isEmpty()) throw new Error('PriorityQueue is empty');

	  return this._elements[0];
	};

	/**
	 * Dequeues the top element of the priority queue.
	 *
	 * @return {Object}
	 * @throws {Error} when the queue is empty.
	 * @api public
	 */
	PriorityQueue.prototype.deq = function () {
	  var first = this.peek();
	  var last = this._elements.pop();
	  var size = this.size();

	  if (size === 0) return first;

	  this._elements[0] = last;
	  var current = 0;

	  while (current < size) {
	    var largest = current;
	    var left = 2 * current + 1;
	    var right = 2 * current + 2;

	    if (left < size && this._compare(left, largest) >= 0) {
	      largest = left;
	    }

	    if (right < size && this._compare(right, largest) >= 0) {
	      largest = right;
	    }

	    if (largest === current) break;

	    this._swap(largest, current);
	    current = largest;
	  }

	  return first;
	};

	/**
	 * Enqueues the `element` at the priority queue and returns its new size.
	 *
	 * @param {Object} element
	 * @return {Number}
	 * @api public
	 */
	PriorityQueue.prototype.enq = function (element) {
	  var size = this._elements.push(element);
	  var current = size - 1;

	  while (current > 0) {
	    var parent = Math.floor((current - 1) / 2);

	    if (this._compare(current, parent) <= 0) break;

	    this._swap(parent, current);
	    current = parent;
	  }

	  return size;
	};

	/**
	 * Returns the size of the priority queue.
	 *
	 * @return {Number}
	 * @api public
	 */
	PriorityQueue.prototype.size = function () {
	  return this._elements.length;
	};

	/**
	 *  Iterates over queue elements
	 *
	 *  @param {Function} fn
	 */
	PriorityQueue.prototype.forEach = function (fn) {
	  return this._elements.forEach(fn);
	};

	/**
	 * Compares the values at position `a` and `b` in the priority queue using its
	 * comparator function.
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 * @api private
	 */
	PriorityQueue.prototype._compare = function (a, b) {
	  return this._comparator(this._elements[a], this._elements[b]);
	};

	/**
	 * Swaps the values at position `a` and `b` in the priority queue.
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @api private
	 */
	PriorityQueue.prototype._swap = function (a, b) {
	  var aux = this._elements[a];
	  this._elements[a] = this._elements[b];
	  this._elements[b] = aux;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var each = __webpack_require__(14);
	var PriorityQueue = __webpack_require__(54);

	var Util = __webpack_require__(20);

	var debug = __webpack_require__(9)('transitive:edge');

	/**
	 * Expose `Edge`
	 */

	module.exports = Edge;

	/**
	 * Initialize a new edge
	 *
	 * @param {Array}
	 * @param {Vertex}
	 * @param {Vertex}
	 */

	var edgeId = 0;

	function Edge(pointArray, fromVertex, toVertex) {
	  this.id = edgeId++;
	  this.pointArray = pointArray;
	  this.fromVertex = fromVertex;
	  this.toVertex = toVertex;
	  this.pathSegments = [];
	  this.renderedEdges = [];
	}

	Edge.prototype.getId = function () {
	  return this.id;
	};

	/**
	 *
	 */

	Edge.prototype.getLength = function () {
	  var dx = this.toVertex.x - this.fromVertex.x,
	      dy = this.toVertex.y - this.fromVertex.y;
	  return Math.sqrt(dx * dx + dy * dy);
	};

	Edge.prototype.getWorldLength = function () {
	  if (!this.worldLength) this.calculateWorldLengthAndMidpoint();
	  return this.worldLength;
	};

	Edge.prototype.getWorldMidpoint = function () {
	  if (!this.worldMidpoint) this.calculateWorldLengthAndMidpoint();
	  return this.worldMidpoint;
	};

	Edge.prototype.calculateWorldLengthAndMidpoint = function () {
	  var allPoints = [this.fromVertex.point].concat(this.pointArray, [this.toVertex.point]);
	  this.worldLength = 0;
	  for (var i = 0; i < allPoints.length - 1; i++) {
	    this.worldLength += Util.distance(allPoints[i].worldX, allPoints[i].worldY, allPoints[i + 1].worldX, allPoints[i + 1].worldY);
	  }

	  if (this.worldLength === 0) {
	    this.worldMidpoint = {
	      x: this.fromVertex.point.worldX,
	      y: this.fromVertex.point.worldY
	    };
	  } else {
	    var distTraversed = 0;
	    for (i = 0; i < allPoints.length - 1; i++) {
	      var dist = Util.distance(allPoints[i].worldX, allPoints[i].worldY, allPoints[i + 1].worldX, allPoints[i + 1].worldY);
	      if ((distTraversed + dist) / this.worldLength >= 0.5) {
	        // find the position along this segment (0 <= t <= 1) where the edge midpoint lies
	        var t = (0.5 - distTraversed / this.worldLength) / (dist / this.worldLength);
	        this.worldMidpoint = {
	          x: allPoints[i].worldX + t * (allPoints[i + 1].worldX - allPoints[i].worldX),
	          y: allPoints[i].worldY + t * (allPoints[i + 1].worldY - allPoints[i].worldY)
	        };
	        this.pointsBeforeMidpoint = i;
	        this.pointsAfterMidpoint = this.pointArray.length - i;
	        break;
	      }
	      distTraversed += dist;
	    }
	  }
	};

	/**
	 *
	 */

	Edge.prototype.isAxial = function () {
	  return this.toVertex.x === this.fromVertex.x || this.toVertex.y === this.fromVertex.y;
	};

	/**
	 *
	 */

	Edge.prototype.hasCurvature = function () {
	  return this.elbow !== null;
	};

	/**
	 *
	 */

	Edge.prototype.replaceVertex = function (oldVertex, newVertex) {
	  if (oldVertex === this.fromVertex) this.fromVertex = newVertex;
	  if (oldVertex === this.toVertex) this.toVertex = newVertex;
	};

	/**
	 *  Add a path segment that traverses this edge
	 */

	Edge.prototype.addPathSegment = function (segment) {
	  this.pathSegments.push(segment);
	};

	Edge.prototype.copyPathSegments = function (baseEdge) {
	  each(baseEdge.pathSegments, function (pathSegment) {
	    this.addPathSegment(pathSegment);
	  }, this);
	};

	Edge.prototype.getPathSegmentIds = function (baseEdge) {
	  var pathSegIds = [];
	  each(this.pathSegments, function (segment) {
	    pathSegIds.push(segment.id);
	  });
	  pathSegIds.sort();
	  return pathSegIds.join(',');
	};

	/**
	 *
	 */

	Edge.prototype.addRenderedEdge = function (rEdge) {
	  if (this.renderedEdges.indexOf(rEdge) !== -1) return;
	  this.renderedEdges.push(rEdge);
	};

	/** internal geometry functions **/

	Edge.prototype.calculateGeometry = function (cellSize, angleConstraint) {
	  //if(!this.hasTransit()) angleConstraint = 5;
	  angleConstraint = angleConstraint || 45;

	  this.angleConstraintR = angleConstraint * Math.PI / 180;

	  this.fx = this.fromVertex.point.worldX;
	  this.fy = this.fromVertex.point.worldY;
	  this.tx = this.toVertex.point.worldX;
	  this.ty = this.toVertex.point.worldY;

	  var midpoint = this.getWorldMidpoint();

	  var targetFromAngle = Util.getVectorAngle(midpoint.x - this.fx, midpoint.y - this.fy);
	  this.constrainedFromAngle = Math.round(targetFromAngle / this.angleConstraintR) * this.angleConstraintR;

	  var fromAngleDelta = Math.abs(this.constrainedFromAngle - targetFromAngle);
	  this.fvx = Math.cos(this.constrainedFromAngle);
	  this.fvy = Math.sin(this.constrainedFromAngle);

	  var targetToAngle = Util.getVectorAngle(midpoint.x - this.tx, midpoint.y - this.ty);

	  this.constrainedToAngle = Math.round(targetToAngle / this.angleConstraintR) * this.angleConstraintR;

	  var toAngleDelta = Math.abs(this.constrainedToAngle - targetToAngle);
	  this.tvx = Math.cos(this.constrainedToAngle);
	  this.tvy = Math.sin(this.constrainedToAngle);

	  var tol = 0.01;
	  var v = Util.normalizeVector({
	    x: this.toVertex.x - this.fromVertex.x,
	    y: this.toVertex.y - this.fromVertex.y
	  });

	  // check if we need to add curvature
	  if (!equalVectors(this.fvx, this.fvy, -this.tvx, -this.tvy, tol) || !equalVectors(this.fvx, this.fvy, v.x, v.y, tol)) {

	    // see if the default endpoint angles produce a valid intersection
	    var isect = this.computeEndpointIntersection();

	    if (isect.intersect) {
	      // if so, compute the elbow and we're done
	      this.elbow = {
	        x: this.fx + isect.u * this.fvx,
	        y: this.fy + isect.u * this.fvy
	      };
	    } else {
	      // if not, adjust the two endpoint angles until they properly intersect

	      // default test: compare angle adjustments (if significant difference)
	      if (Math.abs(fromAngleDelta - toAngleDelta) > 0.087) {
	        if (fromAngleDelta < toAngleDelta) {
	          this.adjustToAngle();
	        } else {
	          this.adjustFromAngle();
	        }
	      } else {
	        // secondary test: look at distribution of shapepoints
	        if (this.pointsAfterMidpoint < this.pointsBeforeMidpoint) {
	          this.adjustToAngle();
	        } else {
	          this.adjustFromAngle();
	        }
	      }
	    }
	  }

	  this.fromAngle = this.constrainedFromAngle;
	  this.toAngle = this.constrainedToAngle;

	  this.calculateVectors();
	  this.calculateAlignmentIds();
	};

	/**
	 *  Adjust the 'to' endpoint angle by rotating it increments of angleConstraintR
	 *  until a valid intersection between the from and to endpoint rays is achieved.
	 */

	Edge.prototype.adjustToAngle = function () {
	  var ccw = Util.ccw(this.fx, this.fy, this.fx + this.fvx, this.fy + this.fvy, this.tx, this.ty);
	  var delta = ccw > 0 ? this.angleConstraintR : -this.angleConstraintR;
	  var i = 0,
	      isect;
	  while (i++ < 100) {
	    this.constrainedToAngle += delta;
	    this.tvx = Math.cos(this.constrainedToAngle);
	    this.tvy = Math.sin(this.constrainedToAngle);
	    isect = this.computeEndpointIntersection();
	    if (isect.intersect) break;
	  }
	  this.elbow = {
	    x: this.fx + isect.u * this.fvx,
	    y: this.fy + isect.u * this.fvy
	  };
	};

	/**
	 *  Adjust the 'from' endpoint angle by rotating it increments of angleConstraintR
	 *  until a valid intersection between the from and to endpoint rays is achieved.
	 */

	Edge.prototype.adjustFromAngle = function () {
	  var ccw = Util.ccw(this.tx, this.ty, this.tx + this.tvx, this.ty + this.tvy, this.fx, this.fy);
	  var delta = ccw > 0 ? this.angleConstraintR : -this.angleConstraintR;
	  var i = 0,
	      isect;
	  while (i++ < 100) {
	    this.constrainedFromAngle += delta;
	    this.fvx = Math.cos(this.constrainedFromAngle);
	    this.fvy = Math.sin(this.constrainedFromAngle);
	    isect = this.computeEndpointIntersection();
	    if (isect.intersect) break;
	  }
	  this.elbow = {
	    x: this.fx + isect.u * this.fvx,
	    y: this.fy + isect.u * this.fvy
	  };
	};

	Edge.prototype.computeEndpointIntersection = function () {
	  return Util.rayIntersection(this.fx, this.fy, this.fvx, this.fvy, this.tx, this.ty, this.tvx, this.tvy);
	};

	function equalVectors(x1, y1, x2, y2, tol) {
	  tol = tol || 0;
	  return Math.abs(x1 - x2) < tol && Math.abs(y1 - y2) < tol;
	}

	Edge.prototype.calculateVectors = function (fromAngle, toAngle) {

	  this.fromVector = {
	    x: Math.cos(this.fromAngle),
	    y: Math.sin(this.fromAngle)
	  };

	  this.fromleftVector = {
	    x: -this.fromVector.y,
	    y: this.fromVector.x
	  };

	  this.fromRightVector = {
	    x: this.fromVector.y,
	    y: -this.fromVector.x
	  };

	  this.toVector = {
	    x: Math.cos(this.toAngle + Math.PI),
	    y: Math.sin(this.toAngle + Math.PI)
	  };

	  this.toleftVector = {
	    x: -this.toVector.y,
	    y: this.toVector.x
	  };

	  this.toRightVector = {
	    x: this.toVector.y,
	    y: -this.toVector.x
	  };
	};

	/**
	 *  Compute the 'alignment id', a string that uniquely identifies a line in
	 *  2D space given a point and angle relative to the x-axis.
	 */

	Edge.prototype.calculateAlignmentId = function (x, y, angle) {
	  var angleD = Math.round(angle * 180 / Math.PI);
	  if (angleD > 90) angleD -= 180;
	  if (angleD <= -90) angleD += 180;

	  if (angleD === 90) {
	    return '90_x' + x;
	  }

	  // calculate the y-axis crossing
	  var ya = Math.round(y - x * Math.tan(angle));
	  return angleD + '_y' + ya;
	};

	Edge.prototype.calculateAlignmentIds = function () {
	  this.fromAlignmentId = this.calculateAlignmentId(this.fromVertex.x, this.fromVertex.y, this.fromAngle);
	  this.toAlignmentId = this.calculateAlignmentId(this.toVertex.x, this.toVertex.y, this.toAngle);
	};

	Edge.prototype.hasTransit = function (cellSize) {
	  //debug(this);
	  for (var i = 0; i < this.pathSegments.length; i++) {
	    if (this.pathSegments[i].getType() === 'TRANSIT') {
	      return true;
	    }
	  }
	  return false;
	};

	Edge.prototype.getFromAlignmentId = function () {
	  return this.fromAlignmentId;
	};

	Edge.prototype.getToAlignmentId = function () {
	  return this.toAlignmentId;
	};

	Edge.prototype.getAlignmentRange = function (alignmentId) {

	  var p1, p2;
	  if (alignmentId === this.fromAlignmentId) {
	    p1 = this.fromVertex;
	    p2 = this.elbow || this.toVertex;
	  } else if (alignmentId === this.toAlignmentId) {
	    p1 = this.toVertex;
	    p2 = this.elbow || this.fromVertex;
	  } else {
	    return null;
	  }

	  var min, max;
	  if (alignmentId.substring(0, 2) === '90') {
	    min = Math.min(p1.y, p2.y);
	    max = Math.max(p1.y, p2.y);
	  } else {
	    min = Math.min(p1.x, p2.x);
	    max = Math.max(p1.x, p2.x);
	  }

	  return {
	    min: min,
	    max: max
	  };
	};

	Edge.prototype.align = function (vertex, vector) {
	  if (this.aligned || !this.hasCurvature()) return;
	  var currentVector = this.getVector(vertex);
	  if (Math.abs(currentVector.x) !== Math.abs(vector.x) || Math.abs(currentVector.y) !== Math.abs(vector.y)) {
	    this.curveAngle = -this.curveAngle;
	    this.calculateGeometry();
	  }
	  this.aligned = true;
	};

	Edge.prototype.getGeometricCoords = function (fromOffsetPx, toOffsetPx, display, forward) {
	  var coords = [],
	      lastX = null,
	      lastY = null;

	  // reverse the coords array if needed
	  var geomCoords = forward ? this.geomCoords : this.geomCoords.concat().reverse();

	  each(geomCoords, function (coord, i) {

	    var fromVector = null,
	        toVector = null,
	        rightVector;
	    var xOffset, yOffset;
	    var x1 = display.xScale(coord[0]);
	    var y1 = display.yScale(coord[1]);

	    // calculate the vector leading in to this coordinate
	    if (i > 0) {
	      var prevCoord = geomCoords[i - 1];
	      var x0 = display.xScale(prevCoord[0]);
	      var y0 = display.yScale(prevCoord[1]);
	      if (x1 === x0 && y1 === y0) return;

	      toVector = {
	        x: x1 - x0,
	        y: y1 - y0
	      };
	    }

	    // calculate the vector leading out from this coordinate
	    if (i < geomCoords.length - 1) {
	      var nextCoord = geomCoords[i + 1];
	      var x2 = display.xScale(nextCoord[0]);
	      var y2 = display.yScale(nextCoord[1]);
	      if (x2 === x1 && y2 === y1) return;

	      fromVector = {
	        x: x2 - x1,
	        y: y2 - y1
	      };
	    }

	    if (fromVector && !toVector) {
	      // the first point in the geomCoords sequence
	      rightVector = Util.normalizeVector({
	        x: fromVector.y,
	        y: -fromVector.x
	      });
	      xOffset = fromOffsetPx * rightVector.x;
	      yOffset = fromOffsetPx * rightVector.y;
	    } else if (!fromVector && toVector) {
	      // the last point in the geomCoords sequence
	      rightVector = Util.normalizeVector({
	        x: toVector.y,
	        y: -toVector.x
	      });
	      xOffset = fromOffsetPx * rightVector.x;
	      yOffset = fromOffsetPx * rightVector.y;
	    } else {
	      // an internal point
	      rightVector = Util.normalizeVector({
	        x: fromVector.y,
	        y: -fromVector.x
	      });
	      xOffset = fromOffsetPx * rightVector.x;
	      yOffset = fromOffsetPx * rightVector.y;

	      // TODO: properly compute the offsets based on both vectors
	    }

	    coords.push({
	      x: x1 + xOffset,
	      y: y1 + yOffset
	    });
	  }, this);
	  return coords;
	};

	Edge.prototype.getRenderCoords = function (fromOffsetPx, toOffsetPx, display, forward) {
	  var fromOffsetX, fromOffsetY;
	  var isBase = fromOffsetPx === 0 && toOffsetPx === 0;

	  if (!this.baseRenderCoords && !isBase) {
	    this.calculateBaseRenderCoords(display);
	  }

	  // TODO: This can't be right...
	  try {
	    fromOffsetX = fromOffsetPx * this.fromRightVector.x;
	    fromOffsetY = fromOffsetPx * this.fromRightVector.y;
	  } catch (err) {
	    debug('edge err');
	    debug(this);
	  }
	  var toOffsetX = toOffsetPx * this.toRightVector.x;
	  var toOffsetY = toOffsetPx * this.toRightVector.y;

	  var fx = this.fromVertex.getRenderX(display) + fromOffsetX;
	  var fy = this.fromVertex.getRenderY(display) - fromOffsetY;
	  var fvx = this.fromVector.x,
	      fvy = -this.fromVector.y;

	  var tx = this.toVertex.getRenderX(display) + toOffsetX;
	  var ty = this.toVertex.getRenderY(display) - toOffsetY;
	  var tvx = -this.toVector.x,
	      tvy = this.toVector.y;

	  var coords = [];

	  // append the first ('from') coordinate
	  coords.push({
	    x: forward ? fx : tx,
	    y: forward ? fy : ty
	  });

	  var len = null,
	      x1,
	      y1,
	      x2,
	      y2;

	  // determine if this edge has an elbow, i.e. a bend in the middle
	  if (isBase && !this.isStraight() || !isBase && this.baseRenderCoords.length === 4) {

	    var isect = Util.rayIntersection(fx, fy, fvx, fvy, tx, ty, tvx, tvy);
	    if (isect.intersect) {
	      var u = isect.u;
	      var ex = fx + fvx * u;
	      var ey = fy + fvy * u;

	      this.ccw = Util.ccw(fx, fy, ex, ey, tx, ty);

	      // calculate the angle of the arc
	      var angleR = this.getElbowAngle();

	      // calculate the radius of the arc in pixels, taking offsets into consideration
	      var rPx = this.getBaseRadiusPx() - this.ccw * (fromOffsetPx + toOffsetPx) / 2;

	      // calculate the distance from the elbow to place the arc endpoints in each direction
	      var d = rPx * Math.tan(angleR / 2);

	      // make sure the arc endpoint placement distance is not longer than the either of the
	      // elbow-to-edge-endpoint distances
	      var l1 = Util.distance(fx, fy, ex, ey),
	          l2 = Util.distance(tx, ty, ex, ey);
	      d = Math.min(Math.min(l1, l2), d);

	      x1 = ex - this.fromVector.x * d;
	      y1 = ey + this.fromVector.y * d;

	      x2 = ex + this.toVector.x * d;
	      y2 = ey - this.toVector.y * d;

	      var radius = Util.getRadiusFromAngleChord(angleR, Util.distance(x1, y1, x2, y2));
	      var arc = angleR * (180 / Math.PI) * (this.ccw < 0 ? 1 : -1);

	      if (forward) {
	        coords.push({
	          x: x1,
	          y: y1,
	          len: Util.distance(fx, fy, x1, y1)
	        });

	        coords.push({
	          x: x2,
	          y: y2,
	          len: angleR * radius,
	          arc: arc,
	          radius: radius
	        });

	        len = Util.distance(x2, y2, tx, ty);
	      } else {
	        coords.push({
	          x: x2,
	          y: y2,
	          len: Util.distance(tx, ty, x2, y2)
	        });

	        coords.push({
	          x: x1,
	          y: y1,
	          len: angleR * radius,
	          arc: -arc,
	          radius: radius
	        });

	        len = Util.distance(x1, y1, fx, fy);
	      }
	    } else if (!isBase) {
	      var flen = this.baseRenderCoords[1].len;
	      var tlen = this.baseRenderCoords[3].len;

	      if (flen === 0 || tlen === 0) {
	        x1 = fx + fvx * flen;
	        y1 = fy + fvy * flen;
	        x2 = tx + tvx * tlen;
	        y2 = ty + tvy * tlen;

	        coords.push({
	          x: forward ? x1 : x2,
	          y: forward ? y1 : y2,
	          len: flen
	        });

	        coords.push({
	          x: forward ? x2 : x1,
	          y: forward ? y2 : y1,
	          len: Util.distance(x1, y1, x2, y2)
	        });

	        len = forward ? tlen : flen;
	      }
	    }
	  }

	  // if the length wasn't calculated during elbow-creation, do it now
	  if (len === null) len = Util.distance(fx, fy, tx, ty);

	  // append the final ('to') coordinate
	  coords.push({
	    x: forward ? tx : fx,
	    y: forward ? ty : fy,
	    len: len
	  });

	  return coords;
	};

	Edge.prototype.calculateBaseRenderCoords = function (display, forward) {
	  this.baseRenderCoords = this.getRenderCoords(0, 0, display, forward);
	};

	Edge.prototype.isStraight = function () {
	  var tol = 0.00001;
	  return Math.abs(this.fromVector.x - this.toVector.x) < tol && Math.abs(this.fromVector.y - this.toVector.y) < tol;
	};

	Edge.prototype.getBaseRadiusPx = function () {
	  return 15;
	};

	Edge.prototype.getElbowAngle = function () {
	  var cx = this.fromVector.x - this.toVector.x;
	  var cy = this.fromVector.y - this.toVector.y;

	  var c = Math.sqrt(cx * cx + cy * cy) / 2;

	  var theta = Math.asin(c);

	  return theta * 2;
	};

	Edge.prototype.getRenderLength = function (display) {

	  if (!this.baseRenderCoords) this.calculateBaseRenderCoords(display);

	  if (!this.renderLength) {
	    this.renderLength = 0;
	    for (var i = 1; i < this.baseRenderCoords.length; i++) {
	      this.renderLength += this.baseRenderCoords[i].len;
	    }
	  }
	  return this.renderLength;
	};

	Edge.prototype.coordAlongEdge = function (t, coords, display) {

	  if (!this.baseRenderCoords) this.calculateBaseRenderCoords(display);

	  if (coords.length === 2 && this.baseRenderCoords.length === 4) {
	    return {
	      x: coords[0].x + t * (coords[1].x - coords[0].x),
	      y: coords[0].y + t * (coords[1].y - coords[0].y)
	    };
	  }

	  /*var len = 0;
	  for (var i = 1; i < this.baseRenderCoords.length; i++) {
	    len += this.baseRenderCoords[i].len;
	  }*/
	  var len = this.getRenderLength();

	  var loc = t * len;
	  var cur = 0;
	  for (var i = 1; i < this.baseRenderCoords.length; i++) {
	    if (loc < cur + this.baseRenderCoords[i].len) {
	      var t2 = (loc - cur) / this.baseRenderCoords[i].len;

	      if (coords[i].arc) {

	        var r = coords[i].radius;
	        var theta = Math.PI * coords[i].arc / 180;
	        var ccw = Util.ccw(coords[0].x, coords[0].y, coords[1].x, coords[1].y, coords[2].x, coords[2].y);

	        return Util.pointAlongArc(coords[1].x, coords[1].y, coords[2].x, coords[2].y, r, theta, ccw, t2);
	      } else {
	        var dx = coords[i].x - coords[i - 1].x;
	        var dy = coords[i].y - coords[i - 1].y;

	        return {
	          x: coords[i - 1].x + dx * t2,
	          y: coords[i - 1].y + dy * t2
	        };
	      }
	    }
	    cur += this.baseRenderCoords[i].len;
	  }
	};

	Edge.prototype.clearRenderData = function () {
	  this.baseRenderCoords = null;
	  this.renderLength = null;
	};

	Edge.prototype.getVector = function (vertex) {
	  if (vertex === this.fromVertex) return this.fromVector;
	  if (vertex === this.toVertex) return this.toVector;
	};

	/**
	 *  Gets the vertex opposite another vertex on an edge
	 */

	Edge.prototype.oppositeVertex = function (vertex) {
	  if (vertex === this.toVertex) return this.fromVertex;
	  if (vertex === this.fromVertex) return this.toVertex;
	  return null;
	};

	Edge.prototype.commonVertex = function (edge) {
	  if (this.fromVertex === edge.fromVertex || this.fromVertex === edge.toVertex) return this.fromVertex;
	  if (this.toVertex === edge.fromVertex || this.toVertex === edge.toVertex) return this.toVertex;
	  return null;
	};

	/**
	 *
	 */

	Edge.prototype.setPointLabelPosition = function (pos, skip) {
	  if (this.fromVertex.point !== skip) this.fromVertex.point.labelPosition = pos;
	  if (this.toVertex.point !== skip) this.toVertex.point.labelPosition = pos;

	  this.pointArray.forEach(function (point) {
	    if (point !== skip) point.labelPosition = pos;
	  });
	};

	/**
	 *  Determines if this edge is part of a standalone, non-transit path
	 *  (e.g. a walk/bike/drive-only journey)
	 */

	Edge.prototype.isNonTransitPath = function () {
	  return this.pathSegments.length === 1 && this.pathSegments[0] !== 'TRANSIT' && this.pathSegments[0].path.segments.length === 1;
	};

	/**
	 *
	 */

	Edge.prototype.toString = function () {
	  return 'Edge ' + this.getId() + ' (' + this.fromVertex.toString() + ' to ' + this.toVertex.toString() + ')';
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var debug = __webpack_require__(9)('transitive:edgegroup');
	var each = __webpack_require__(14);
	var PriorityQueue = __webpack_require__(54);

	var Util = __webpack_require__(20);

	/**
	 * Expose `EdgeGroup`
	 */

	module.exports = EdgeGroup;

	/**
	 *  A group of edges that share the same endpoint vertices
	 */

	function EdgeGroup(fromVertex, toVertex, type) {
	  this.fromVertex = fromVertex;
	  this.toVertex = toVertex;
	  this.type = type;
	  this.edges = [];
	  this.commonPoints = null;
	  this.worldLength = 0;
	}

	EdgeGroup.prototype.addEdge = function (edge) {
	  this.edges.push(edge);
	  edge.edgeGroup = this;

	  // update the groups worldLength
	  this.worldLength = Math.max(this.worldLength, edge.getWorldLength());

	  if (this.commonPoints === null) {
	    // if this is first edge added, initialize group's commonPoint array to include all of edge's points
	    this.commonPoints = [];
	    each(edge.pointArray, function (point) {
	      this.commonPoints.push(point);
	    }, this);
	  } else {
	    // otherwise, update commonPoints array to only include those in added edge
	    var newCommonPoints = [];
	    each(edge.pointArray, function (point) {
	      if (this.commonPoints.indexOf(point) !== -1) newCommonPoints.push(point);
	    }, this);
	    this.commonPoints = newCommonPoints;
	  }
	};

	EdgeGroup.prototype.getWorldLength = function () {
	  return this.worldLength;
	};

	EdgeGroup.prototype.getInternalVertexPQ = function () {

	  // create an array of all points on the edge (endpoints and internal)
	  var allPoints = [this.fromVertex.point].concat(this.commonPoints, [this.toVertex.point]);

	  var pq = new PriorityQueue(function (a, b) {
	    return a.weight - b.weight;
	  });

	  for (var i = 1; i < allPoints.length - 1; i++) {
	    var weight = this.getInternalVertexWeight(allPoints, i);
	    pq.enq({
	      weight: weight,
	      point: allPoints[i]
	    });
	  }

	  return pq;
	};

	EdgeGroup.prototype.getInternalVertexWeight = function (pointArray, index) {
	  var x1 = pointArray[index - 1].worldX;
	  var y1 = pointArray[index - 1].worldY;
	  var x2 = pointArray[index].worldX;
	  var y2 = pointArray[index].worldY;
	  var x3 = pointArray[index + 1].worldX;
	  var y3 = pointArray[index + 1].worldY;

	  // the weighting function is a combination of:
	  // - the distances from this internal point to the two adjacent points, normalized for edge length (longer distances are prioritized)
	  // - the angle formed by this point and the two adjacent ones ('sharper' angles are prioritized)
	  var inDist = Util.distance(x1, y1, x2, y2);
	  var outDist = Util.distance(x2, y2, x3, y3);
	  var theta = Util.angleFromThreePoints(x1, y1, x2, y2, x3, y3);
	  var edgeLen = this.getWorldLength();
	  var weight = inDist / edgeLen + outDist / edgeLen + Math.abs(Math.PI - theta) / Math.PI;
	};

	EdgeGroup.prototype.hasTransit = function () {
	  for (var i = 0; i < this.edges.length; i++) {
	    if (this.edges[i].hasTransit()) return true;
	  }
	  return false;
	};

	EdgeGroup.prototype.isNonTransitPath = function () {
	  return this.edges.length === 1 && this.edges[0].isNonTransitPath();
	};

	EdgeGroup.prototype.getTurnPoints = function (maxAngle) {
	  var points = [];
	  maxAngle = maxAngle || 0.75 * Math.PI;
	  each(this.commonPoints, function (point) {
	    if (point.getType() !== 'TURN') return;
	    if (Math.abs(point.turnAngle) < maxAngle) {
	      points.push(point);
	    }
	  });
	  return points;
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	/**
	 * Expose `Vertex`
	 */

	'use strict';

	module.exports = Vertex;

	/**
	 * Initialize new Vertex
	 *
	 * @param {Stop/Place}
	 * @param {Number}
	 * @param {Number}
	 */

	var edgeId = 0;

	function Vertex(point, x, y) {
	  this.id = edgeId++;
	  this.point = point;
	  this.point.graphVertex = this;
	  this.x = this.origX = x;
	  this.y = this.origY = y;
	  this.edges = [];
	}

	Vertex.prototype.getId = function () {
	  return this.id;
	};

	Vertex.prototype.getRenderX = function (display) {
	  return display.xScale(this.x) + this.point.placeOffsets.x;
	};

	Vertex.prototype.getRenderY = function (display) {
	  return display.yScale(this.y) + this.point.placeOffsets.y;
	};

	/**
	 * Move to new coordinate
	 *
	 * @param {Number}
	 * @param {Number}
	 */

	Vertex.prototype.moveTo = function (x, y) {
	  this.x = x;
	  this.y = y;
	  /*this.edges.forEach(function (edge) {
	    edge.calculateVectors();
	  });*/
	};

	/**
	 * Get array of edges incident to vertex. Allows specification of "incoming" edge that will not be included in results
	 *
	 * @param {Edge}
	 */

	Vertex.prototype.incidentEdges = function (inEdge) {
	  var results = [];
	  this.edges.forEach(function (edge) {
	    if (edge !== inEdge) results.push(edge);
	  });
	  return results;
	};

	/**
	 * Add an edge to the vertex's edge list
	 *
	 * @param {Edge}
	 */

	Vertex.prototype.addEdge = function (edge) {
	  var index = this.edges.indexOf(edge);
	  if (index === -1) this.edges.push(edge);
	};

	/**
	 * Remove an edge from the vertex's edge list
	 *
	 * @param {Edge}
	 */

	Vertex.prototype.removeEdge = function (edge) {
	  var index = this.edges.indexOf(edge);
	  if (index !== -1) this.edges.splice(index, 1);
	};

	Vertex.prototype.toString = function () {
	  return 'Vertex ' + this.getId() + ' (' + (this.point ? this.point.toString() : 'no point assigned') + ')';
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var debug = __webpack_require__(9)('transitive:display');
	var each = __webpack_require__(14);

	var Legend = __webpack_require__(59);
	var TileLayer = __webpack_require__(60);

	var SphericalMercator = __webpack_require__(32);
	var sm = new SphericalMercator();

	/**
	 * Expose `Display`
	 */

	module.exports = Display;

	/**
	 * The D3-based SVG display.
	 *
	 * @param {Object} options
	 */

	function Display(transitive) {
	  this.transitive = transitive;
	  var el = this.el = transitive.el;
	  this.width = el.clientWidth;
	  this.height = el.clientHeight;

	  // Set up the pan/zoom behavior
	  var zoom = this.zoom = d3.behavior.zoom().scaleExtent([0.25, 4]);

	  var self = this;

	  var zoomBehavior = function zoomBehavior() {
	    self.computeScale();
	    if (self.scale !== self.lastScale) {
	      // zoom action
	      self.zoomChanged();
	    } else {
	      // pan action
	      setTimeout(transitive.refresh.bind(transitive, true), 0);
	    }

	    var llb = self.llBounds();
	    debug('ll bounds: ' + llb[0][0] + ',' + llb[0][1] + ' to ' + llb[1][0] + ',' + llb[1][1]);
	  };

	  this.zoom.on('zoom.transitive', zoomBehavior);

	  this.zoomFactors = transitive.options.zoomFactors || this.getDefaultZoomFactors();

	  // set up the svg display
	  var div = d3.select(el).attr('class', 'Transitive');

	  if (transitive.options.zoomEnabled) {
	    div.call(zoom);
	  }

	  this.svg = div.append('svg').attr('class', 'schematic-map');

	  // initialize the x/y scale objects
	  this.xScale = d3.scale.linear();
	  this.yScale = d3.scale.linear();

	  // set up the resize event handler
	  if (transitive.options.autoResize) {
	    d3.select(window).on('resize.display', function () {
	      self.resized();
	      transitive.refresh();
	    });
	  }

	  // set the scale
	  var bounds;
	  if (transitive.options.initialBounds) {
	    bounds = [sm.forward(transitive.options.initialBounds[0]), sm.forward(transitive.options.initialBounds[1])];
	  } else if (transitive.network && transitive.network.graph) {
	    bounds = transitive.network.graph.bounds();
	  }

	  if (bounds) {
	    this.setScale(bounds, transitive.options);
	    this.updateActiveZoomFactors(this.scale);
	    this.lastScale = this.scale;
	  } else {
	    this.updateActiveZoomFactors(1);
	  }

	  // set up the map layer
	  if (transitive.options.mapboxId) {
	    this.tileLayer = new TileLayer({
	      el: this.el,
	      display: this,
	      graph: transitive.graph,
	      mapboxId: transitive.options.mapboxId
	    });
	  }

	  // set up the legend
	  if (transitive.options.legendEl) {
	    this.legend = new Legend(transitive.options.legendEl, this, transitive);
	  }

	  transitive.emit('initialize display', transitive, this);
	  return this;
	}

	/**
	 * zoomChanged -- called when the zoom level changes, either by through the native
	 * zoom support or the setBounds() API call. Updates zoom factors as needed and
	 * performs appropriate update action (render or refresh)
	 */

	Display.prototype.zoomChanged = function () {
	  if (this.updateActiveZoomFactors(this.scale)) {
	    this.transitive.network = null;
	    this.transitive.render();
	  } else this.transitive.refresh();
	  this.lastScale = this.scale;
	};

	Display.prototype.updateActiveZoomFactors = function (scale) {
	  var updated = false;
	  for (var i = 0; i < this.zoomFactors.length; i++) {
	    var min = this.zoomFactors[i].minScale;
	    var max = i < this.zoomFactors.length - 1 ? this.zoomFactors[i + 1].minScale : Number.MAX_VALUE;

	    // check if we've crossed into a new zoomFactor partition
	    if ((!this.lastScale || this.lastScale < min || this.lastScale >= max) && scale >= min && scale < max) {
	      this.activeZoomFactors = this.zoomFactors[i];
	      updated = true;
	    }
	  }
	  return updated;
	};

	/**
	 * Return default zoom factors
	 */

	Display.prototype.getDefaultZoomFactors = function (data) {
	  return [{
	    minScale: 0,
	    gridCellSize: 25,
	    internalVertexFactor: 1000000,
	    angleConstraint: 45,
	    mergeVertexThreshold: 200
	  }, {
	    minScale: 1.5,
	    gridCellSize: 0,
	    internalVertexFactor: 0,
	    angleConstraint: 5,
	    mergeVertexThreshold: 0
	  }];
	};

	/**
	 * Empty the display
	 */

	Display.prototype.empty = function () {
	  debug('emptying svg');
	  this.svg.selectAll('*').remove();

	  this.haloLayer = this.svg.insert('g', ':first-child');
	};

	/**
	 * Set the scale
	 */

	Display.prototype.setScale = function (bounds, options) {

	  this.height = this.el.clientHeight;
	  this.width = this.el.clientWidth;

	  var domains = getDomains(this, this.height, this.width, bounds, options);
	  this.xScale.domain(domains[0]);
	  this.yScale.domain(domains[1]);

	  this.xScale.range([0, this.width]);
	  this.yScale.range([this.height, 0]);

	  debug('x scale %j -> %j', this.xScale.domain(), this.xScale.range());
	  debug('y scale %j -> %j', this.yScale.domain(), this.yScale.range());

	  this.zoom.x(this.xScale).y(this.yScale);

	  this.initXRes = (domains[0][1] - domains[0][0]) / this.width;
	  this.scale = 1;

	  this.scaleSet = true;
	};

	Display.prototype.computeScale = function () {
	  var newXRes = (this.xScale.domain()[1] - this.xScale.domain()[0]) / this.width;
	  this.scale = this.initXRes / newXRes;
	};

	/**
	 * updateDomains -- set x/y domains of geographic (spherical mercator) coordinate
	 * system. Does *not* check/adjust aspect ratio.
	 */

	Display.prototype.updateDomains = function (bounds) {
	  this.xScale.domain([bounds[0][0], bounds[1][0]]);
	  this.yScale.domain([bounds[0][1], bounds[1][1]]);

	  this.zoom.x(this.xScale).y(this.yScale);

	  this.computeScale();
	};

	Display.prototype.resized = function () {

	  var newWidth = this.el.clientWidth;
	  var newHeight = this.el.clientHeight;

	  var xDomain = this.xScale.domain();
	  var xFactor = newWidth / this.width;
	  var xDomainAdj = (xDomain[1] - xDomain[0]) * (xFactor - 1) / 2;
	  this.xScale.domain([xDomain[0] - xDomainAdj, xDomain[1] + xDomainAdj]);

	  var yDomain = this.yScale.domain();
	  var yFactor = newHeight / this.height;
	  var yDomainAdj = (yDomain[1] - yDomain[0]) * (yFactor - 1) / 2;
	  this.yScale.domain([yDomain[0] - yDomainAdj, yDomain[1] + yDomainAdj]);

	  this.xScale.range([0, newWidth]);
	  this.yScale.range([newHeight, 0]);

	  this.height = newHeight;
	  this.width = newWidth;

	  this.zoom.x(this.xScale).y(this.yScale);
	};

	Display.prototype.xyBounds = function () {
	  var x = this.xScale.domain();
	  var y = this.yScale.domain();
	  return [[x[0], y[0]], [x[1], y[1]]];
	};

	/**
	 * Lat/lon bounds
	 */

	Display.prototype.llBounds = function () {
	  var x = this.xScale.domain();
	  var y = this.yScale.domain();

	  return [sm.inverse([x[0], y[0]]), sm.inverse([x[1], y[1]])];
	};

	Display.prototype.isInRange = function (x, y) {
	  var xRange = this.xScale.range();
	  var yRange = this.yScale.range();

	  return x >= xRange[0] && x <= xRange[1] && y >= yRange[1] && y <= yRange[0];
	};

	/**
	 * Compute the x/y coordinate space domains to fit the graph.
	 */

	function getDomains(display, height, width, bounds, options) {
	  var xmin = bounds[0][0],
	      xmax = bounds[1][0];
	  var ymin = bounds[0][1],
	      ymax = bounds[1][1];
	  var xRange = xmax - xmin;
	  var yRange = ymax - ymin;

	  var paddingFactor = options && options.paddingFactor ? options.paddingFactor : 0.1;

	  var margins = getMargins(options);

	  var usableHeight = height - margins.top - margins.bottom;
	  var usableWidth = width - margins.left - margins.right;
	  var displayAspect = width / height;
	  var usableDisplayAspect = usableWidth / usableHeight;
	  var graphAspect = xRange / (yRange === 0 ? -Infinity : yRange);

	  var padding;
	  var dispX1, dispX2, dispY1, dispY2;
	  var dispXRange, dispYRange;

	  if (usableDisplayAspect > graphAspect) {
	    // y-axis is limiting
	    padding = paddingFactor * yRange;
	    dispY1 = ymin - padding;
	    dispY2 = ymax + padding;
	    dispYRange = yRange + 2 * padding;
	    var addedYRange = height / usableHeight * dispYRange - dispYRange;
	    if (margins.top > 0 || margins.bottom > 0) {
	      dispY1 -= margins.bottom / (margins.bottom + margins.top) * addedYRange;
	      dispY2 += margins.top / (margins.bottom + margins.top) * addedYRange;
	    }
	    dispXRange = (dispY2 - dispY1) * displayAspect;
	    var xOffset = (margins.left - margins.right) / width;
	    var xMidpoint = (xmax + xmin - dispXRange * xOffset) / 2;
	    dispX1 = xMidpoint - dispXRange / 2;
	    dispX2 = xMidpoint + dispXRange / 2;
	  } else {
	    // x-axis limiting
	    padding = paddingFactor * xRange;
	    dispX1 = xmin - padding;
	    dispX2 = xmax + padding;
	    dispXRange = xRange + 2 * padding;
	    var addedXRange = width / usableWidth * dispXRange - dispXRange;
	    if (margins.left > 0 || margins.right > 0) {
	      dispX1 -= margins.left / (margins.left + margins.right) * addedXRange;
	      dispX2 += margins.right / (margins.left + margins.right) * addedXRange;
	    }

	    dispYRange = (dispX2 - dispX1) / displayAspect;
	    var yOffset = (margins.bottom - margins.top) / height;
	    var yMidpoint = (ymax + ymin - dispYRange * yOffset) / 2;
	    dispY1 = yMidpoint - dispYRange / 2;
	    dispY2 = yMidpoint + dispYRange / 2;
	  }

	  return [[dispX1, dispX2], [dispY1, dispY2]];
	}

	function getMargins(options) {
	  var margins = {
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0
	  };

	  if (options && options.displayMargins) {
	    if (options.displayMargins.top) margins.top = options.displayMargins.top;
	    if (options.displayMargins.bottom) margins.bottom = options.displayMargins.bottom;
	    if (options.displayMargins.left) margins.left = options.displayMargins.left;
	    if (options.displayMargins.right) margins.right = options.displayMargins.right;
	  }

	  return margins;
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);

	var RenderedEdge = __webpack_require__(51);
	var RenderedSegment = __webpack_require__(52);
	var Util = __webpack_require__(20);
	var Stop = __webpack_require__(34);

	/**
	 * Expose `Legend`
	 */

	module.exports = Legend;

	function Legend(el, display, transitive) {
	  this.el = el;
	  this.display = display;
	  this.transitive = transitive;

	  this.height = Util.parsePixelStyle(d3.select(el).style('height'));
	}

	Legend.prototype.render = function (legendSegments) {

	  d3.select(this.el).selectAll(':not(.doNotEmpty)').remove();

	  this.x = this.spacing;
	  this.y = this.height / 2;

	  var segment;

	  // iterate through the representative map segments
	  for (var legendType in legendSegments) {
	    var mapSegment = legendSegments[legendType];

	    // create a segment solely for rendering in the legend
	    segment = new RenderedSegment();
	    segment.type = mapSegment.getType();
	    segment.mode = mapSegment.mode;
	    segment.patterns = mapSegment.patterns;

	    var canvas = this.createCanvas();

	    var renderData = [];
	    renderData.push({
	      x: 0,
	      y: canvas.height / 2
	    });
	    renderData.push({
	      x: canvas.width,
	      y: canvas.height / 2
	    });

	    segment.render(canvas);
	    segment.refresh(canvas, renderData);

	    this.renderText(getDisplayText(legendType));

	    this.x += this.spacing * 2;
	  }

	  // create the 'transfer' marker

	  var rEdge = new RenderedEdge(null, true, 'TRANSIT');
	  rEdge.pattern = {
	    pattern_id: 'ptn',
	    route: {
	      route_type: 1
	    }
	  };

	  var transferStop = new Stop();
	  transferStop.isSegmentEndPoint = true;
	  transferStop.isTransferPoint = true;

	  this.renderPoint(transferStop, rEdge, 'Transfer');
	};

	Legend.prototype.renderPoint = function (point, rEdge, text) {

	  var canvas = this.createCanvas();

	  point.addRenderData({
	    owner: point,
	    rEdge: rEdge,
	    x: canvas.width / 2,
	    y: canvas.height / 2,
	    offsetX: 0,
	    offsetY: 0
	  });

	  point.render(canvas);

	  canvas.styler.stylePoint(canvas, point);
	  point.refresh(canvas);

	  this.renderText(text);
	};

	Legend.prototype.renderText = function (text) {
	  d3.select(this.el).append('div').attr('class', 'legendLabel').html(text);
	};

	Legend.prototype.createCanvas = function () {

	  var container = d3.select(this.el).append('div').attr('class', 'legendSvg');

	  var width = Util.parsePixelStyle(container.style('width'));
	  if (!width || width === 0) width = 30;

	  var height = Util.parsePixelStyle(container.style('height'));
	  if (!height || height === 0) height = this.height;

	  var canvas = {
	    xScale: d3.scale.linear(),
	    yScale: d3.scale.linear(),
	    styler: this.transitive.styler,
	    zoom: this.display.zoom,
	    width: width,
	    height: height,
	    svg: container.append('svg').style("width", width).style("height", height)
	  };

	  return canvas;
	};

	function getDisplayText(type) {
	  switch (type) {
	    case 'WALK':
	      return 'Walk';
	    case 'BICYCLE':
	      return 'Bike';
	    case 'CAR':
	      return 'Drive';
	    case 'TRANSIT_0':
	      return 'Tram';
	    case 'TRANSIT_1':
	      return 'Metro';
	    case 'TRANSIT_2':
	      return 'Rail';
	    case 'TRANSIT_3':
	      return 'Bus';
	    case 'TRANSIT_4':
	      return 'Ferry';
	  }
	  return type;
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var debug = __webpack_require__(9)('transitive:tile-layer');

	var geoTile = __webpack_require__(61);
	var SphericalMercator = __webpack_require__(32);

	var prefix = prefixMatch(['webkit', 'ms', 'Moz', 'O']);

	/**
	 * Tile layer takes a parent element, a zoom behavior, and a Mapbox ID
	 *
	 * @param {Object} opts
	 */

	module.exports = function TileLayer(opts) {
	  debug('creating the tile layer');

	  var el = opts.el;
	  var display = opts.display;
	  var graph = opts.graph;
	  var height = el.clientHeight;
	  var id = opts.mapboxId;
	  var width = el.clientWidth;
	  var zoom = display.zoom;

	  // Set up the projection
	  var projection = d3.geo.mercator().translate([width / 2, height / 2]);

	  // Set up the map tiles
	  var tile = geoTile();

	  // Create the tile layer
	  var tileLayer = d3.select(el).append('div').attr('class', 'tile-layer');

	  // Initial zoom
	  zoomed();

	  this.zoomed = zoomed;

	  // Reload tiles on pan and zoom
	  function zoomed() {
	    // Get the height and width
	    height = el.clientHeight;
	    width = el.clientWidth;

	    // Set the map tile size
	    tile.size([width, height]);

	    // Get the current display bounds
	    var bounds = display.llBounds();

	    // Project the bounds based on the current projection
	    var psw = projection(bounds[0]);
	    var pne = projection(bounds[1]);

	    // Based the new scale and translation vector off the current one
	    var scale = projection.scale() * 2 * Math.PI;
	    var translate = projection.translate();

	    var dx = pne[0] - psw[0];
	    var dy = pne[1] - psw[1];

	    scale = scale * (1 / Math.max(dx / width, dy / height));
	    projection.translate([width / 2, height / 2]).scale(scale / 2 / Math.PI);

	    // Reproject the bounds based on the new scale and translation vector
	    psw = projection(bounds[0]);
	    pne = projection(bounds[1]);
	    var x = (psw[0] + pne[0]) / 2;
	    var y = (psw[1] + pne[1]) / 2;
	    translate = [width - x, height - y];

	    // Update the Geo tiles
	    tile.scale(scale).translate(translate);

	    // Get the new set of tiles and render
	    renderTiles(tile());
	  }

	  // Render tiles
	  function renderTiles(tiles) {
	    var image = tileLayer.style(prefix + 'transform', matrix3d(tiles.scale, tiles.translate)).selectAll('.tile').data(tiles, function (d) {
	      return d;
	    });

	    image.exit().remove();

	    image.enter().append('img').attr('class', 'tile').attr('src', function (d) {
	      return 'http://' + ['a', 'b', 'c', 'd'][Math.random() * 4 | 0] + '.tiles.mapbox.com/v3/' + id + '/' + d[2] + '/' + d[0] + '/' + d[1] + '.png';
	    }).style('left', function (d) {
	      return (d[0] << 8) + 'px';
	    }).style('top', function (d) {
	      return (d[1] << 8) + 'px';
	    });
	  }
	};

	/**
	 * Get the 3D Transform Matrix
	 */

	function matrix3d(scale, translate) {
	  var k = scale / 256,
	      r = scale % 1 ? Number : Math.round;
	  return 'matrix3d(' + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1] + ')';
	}

	/**
	 * Match the transform prefix
	 */

	function prefixMatch(p) {
	  var i = -1,
	      n = p.length,
	      s = document.body.style;
	  while (++i < n) if (p[i] + 'Transform' in s) return '-' + p[i].toLowerCase() + '-';
	  return '';
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);

	module.exports = function () {
	  var size = [960, 500],
	      scale = 256,
	      translate = [size[0] / 2, size[1] / 2],
	      zoomDelta = 0;

	  function tile() {
	    var z = Math.max(Math.log(scale) / Math.LN2 - 8, 0),
	        z0 = Math.round(z + zoomDelta),
	        k = Math.pow(2, z - z0 + 8),
	        origin = [(translate[0] - scale / 2) / k, (translate[1] - scale / 2) / k],
	        tiles = [],
	        cols = d3.range(Math.max(0, Math.floor(-origin[0])), Math.max(0, Math.ceil(size[0] / k - origin[0]))),
	        rows = d3.range(Math.max(0, Math.floor(-origin[1])), Math.max(0, Math.ceil(size[1] / k - origin[1])));

	    rows.forEach(function (y) {
	      cols.forEach(function (x) {
	        tiles.push([x, y, z0]);
	      });
	    });

	    tiles.translate = origin;
	    tiles.scale = k;

	    return tiles;
	  }

	  tile.size = function (_) {
	    if (!arguments.length) return size;
	    size = _;
	    return tile;
	  };

	  tile.scale = function (_) {
	    if (!arguments.length) return scale;
	    scale = _;
	    return tile;
	  };

	  tile.translate = function (_) {
	    if (!arguments.length) return translate;
	    translate = _;
	    return tile;
	  };

	  tile.zoomDelta = function (_) {
	    if (!arguments.length) return zoomDelta;
	    zoomDelta = +_;
	    return tile;
	  };

	  return tile;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var augment = __webpack_require__(28);
	var debug = __webpack_require__(9)('transitive:renderer');
	var each = __webpack_require__(14);

	var Renderer = __webpack_require__(63);

	/**
	 * A Renderer subclass for the default network rendering engine.
	 *
	 * @param {Object} the main Transitive object
	 */

	var DefaultRenderer = augment(Renderer, function (base) {

	  this.constructor = function (transitive) {
	    base.constructor.call(this, transitive);
	  };

	  this.render = function () {
	    base.render.call(this);

	    var self = this;
	    var display = this.transitive.display;
	    var network = this.transitive.network;
	    var options = this.transitive.options;
	    display.styler = this.transitive.styler;

	    var legendSegments = {};

	    each(network.renderedEdges, function (rEdge) {
	      rEdge.refreshRenderData(display);
	    });

	    each(network.paths, function (path) {
	      each(path.segments, function (pathSegment) {
	        each(pathSegment.renderedSegments, function (renderedSegment) {
	          renderedSegment.render(display);
	          var legendType = renderedSegment.getLegendType();
	          if (!(legendType in legendSegments)) {
	            legendSegments[legendType] = renderedSegment;
	          }
	        });
	      });
	    });

	    // draw the vertex-based points

	    each(network.graph.vertices, function (vertex) {
	      vertex.point.render(display);
	      if (self.isDraggable(vertex.point)) {
	        vertex.point.makeDraggable(self.transitive);
	      }
	    });

	    // draw the edge-based points
	    each(network.graph.edges, function (edge) {
	      edge.pointArray.forEach(function (point) {
	        point.render(display);
	      });
	    });

	    if (display.legend) display.legend.render(legendSegments);

	    this.transitive.refresh();
	  };

	  /**
	   * Refresh
	   */

	  this.refresh = function (panning) {
	    base.refresh.call(this, panning);

	    var display = this.transitive.display;
	    var network = this.transitive.network;
	    var options = this.transitive.options;
	    var styler = this.transitive.styler;

	    network.graph.vertices.forEach(function (vertex) {
	      vertex.point.clearRenderData();
	    });
	    network.graph.edges.forEach(function (edge) {
	      edge.clearRenderData();
	    });

	    // refresh the segment and point marker data
	    this.refreshSegmentRenderData();
	    network.graph.vertices.forEach(function (vertex) {
	      vertex.point.initMarkerData(display);
	    });

	    this.renderedSegments = [];
	    each(network.paths, function (path) {
	      each(path.segments, function (pathSegment) {
	        each(pathSegment.renderedSegments, function (rSegment) {
	          rSegment.refresh(display);
	          this.renderedSegments.push(rSegment);
	        }, this);
	      }, this);
	    }, this);

	    network.graph.vertices.forEach(function (vertex) {
	      var point = vertex.point;
	      if (!point.svgGroup) return; // check if this point is not currently rendered
	      styler.stylePoint(display, point);
	      point.refresh(display);
	    });

	    // re-draw the edge-based points
	    network.graph.edges.forEach(function (edge) {
	      edge.pointArray.forEach(function (point) {
	        if (!point.svgGroup) return; // check if this point is not currently rendered
	        styler.styleStop(display, point);
	        point.refresh(display);
	      });
	    });

	    // refresh the label layout
	    var labeledElements = this.transitive.labeler.doLayout();
	    labeledElements.points.forEach(function (point) {
	      point.refreshLabel(display);
	      styler.stylePointLabel(display, point);
	    });
	    each(this.transitive.labeler.segmentLabels, function (label) {
	      label.refresh(display);
	      styler.styleSegmentLabel(display, label);
	    });

	    this.sortElements();
	  };

	  this.refreshSegmentRenderData = function () {
	    each(this.transitive.network.renderedEdges, function (rEdge) {
	      rEdge.refreshRenderData(this.transitive.display);
	    }, this);

	    // try intersecting adjacent rendered edges to create a smooth transition

	    var isectKeys = []; // keep track of edge-edge intersections we've already computed
	    each(this.transitive.network.paths, function (path) {
	      each(path.segments, function (pathSegment) {
	        each(pathSegment.renderedSegments, function (rSegment) {
	          for (var s = 0; s < rSegment.renderedEdges.length - 1; s++) {
	            var rEdge1 = rSegment.renderedEdges[s];
	            var rEdge2 = rSegment.renderedEdges[s + 1];
	            var key = rEdge1.getId() + '_' + rEdge2.getId();
	            if (isectKeys.indexOf(key) !== -1) continue;
	            if (rEdge1.graphEdge.isInternal && rEdge2.graphEdge.isInternal) {
	              rEdge1.intersect(rEdge2);
	            }
	            isectKeys.push(key);
	          }
	        });
	      });
	    });
	  };

	  /**
	   * sortElements
	   */

	  this.sortElements = function () {

	    this.renderedSegments.sort(function (a, b) {
	      return a.compareTo(b);
	    });

	    var focusBaseZIndex = 100000;

	    this.renderedSegments.forEach(function (rSegment, index) {
	      rSegment.zIndex = index * 10 + (rSegment.isFocused() ? focusBaseZIndex : 0);
	    });

	    this.transitive.network.graph.vertices.forEach(function (vertex) {
	      var point = vertex.point;
	      point.zIndex = point.zIndex + (point.isFocused() ? focusBaseZIndex : 0);
	    });

	    this.transitive.display.svg.selectAll('.transitive-sortable').sort(function (a, b) {
	      var aIndex = typeof a.getZIndex === 'function' ? a.getZIndex() : a.owner.getZIndex();
	      var bIndex = typeof b.getZIndex === 'function' ? b.getZIndex() : b.owner.getZIndex();
	      return aIndex - bIndex;
	    });
	  };

	  /**
	   * focusPath
	   */

	  this.focusPath = function (path) {

	    var self = this;
	    var pathRenderedSegments = [];
	    var graph = this.transitive.network.graph;

	    if (path) {
	      // if we're focusing a specific path
	      pathRenderedSegments = path.getRenderedSegments();

	      // un-focus all internal points
	      graph.edges.forEach(function (edge) {
	        edge.pointArray.forEach(function (point, i) {
	          point.setAllPatternsFocused(false);
	        });
	      }, this);
	    } else {
	      // if we're returing to 'all-focused' mode
	      // re-focus all internal points
	      graph.edges.forEach(function (edge) {
	        edge.pointArray.forEach(function (point, i) {
	          point.setAllPatternsFocused(true);
	        });
	      }, this);
	    }

	    var focusChangeSegments = [],
	        focusedVertexPoints = [];
	    each(this.renderedSegments, function (rSegment) {
	      if (path && pathRenderedSegments.indexOf(rSegment) === -1) {
	        if (rSegment.isFocused()) focusChangeSegments.push(rSegment);
	        rSegment.setFocused(false);
	      } else {
	        if (!rSegment.isFocused()) focusChangeSegments.push(rSegment);
	        rSegment.setFocused(true);
	        focusedVertexPoints.push(rSegment.pathSegment.startVertex().point);
	        focusedVertexPoints.push(rSegment.pathSegment.endVertex().point);
	      }
	    });

	    var focusChangePoints = [];
	    graph.vertices.forEach(function (vertex) {
	      var point = vertex.point;
	      if (focusedVertexPoints.indexOf(point) !== -1) {
	        if (!point.isFocused()) focusChangePoints.push(point);
	        point.setFocused(true);
	      } else {
	        if (point.isFocused()) focusChangePoints.push(point);
	        point.setFocused(false);
	      }
	    }, this);

	    // bring the focused elements to the front for the transition
	    //if (path) this.sortElements();

	    // create a transition callback function that invokes refresh() after all transitions complete
	    var n = 0;
	    var refreshOnEnd = function refreshOnEnd(transition, callback) {
	      transition.each(function () {
	        ++n;
	      }).each("end", function () {
	        if (! --n) self.transitive.refresh();
	      });
	    };

	    // run the transtions on the affected elements
	    each(focusChangeSegments, function (segment) {
	      segment.runFocusTransition(this.transitive.display, refreshOnEnd);
	    }, this);

	    each(focusChangePoints, function (point) {
	      point.runFocusTransition(this.transitive.display, refreshOnEnd);
	    }, this);
	  };
	});

	/**
	 * Expose `DefaultRenderer`
	 */

	module.exports = DefaultRenderer;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var augment = __webpack_require__(28);
	var debug = __webpack_require__(9)('transitive:renderer');
	var each = __webpack_require__(14);

	var drawGrid = __webpack_require__(64);

	/**
	 * A superclass for a Transitive network rendering engine.
	 *
	 * @param {Object} the main Transitive object
	 */

	var Renderer = augment(Object, function () {

	  this.constructor = function (transitive) {
	    this.transitive = transitive;
	  };

	  this.render = function () {

	    var display = this.transitive.display;
	    display.styler = this.transitive.styler;

	    // remove all old svg elements
	    display.empty();
	  };

	  /**
	   * Refresh
	   */

	  this.refresh = function (panning) {

	    var display = this.transitive.display;
	    var network = this.transitive.network;

	    if (display.tileLayer) display.tileLayer.zoomed();

	    network.graph.vertices.forEach(function (vertex) {
	      vertex.point.clearRenderData();
	    });
	    network.graph.edges.forEach(function (edge) {
	      edge.clearRenderData();
	    });

	    // draw the grid, if necessary
	    if (this.transitive.options.drawGrid) drawGrid(display, this.gridCellSize);
	  };

	  /**
	   * sortElements
	   */

	  this.sortElements = function () {};

	  /**
	   * focusPath
	   */

	  this.focusPath = function (path) {};

	  this.isDraggable = function (point) {
	    var draggableTypes = this.transitive.options.draggableTypes;
	    if (!draggableTypes) return false;

	    var retval = false;
	    each(draggableTypes, function (type) {
	      if (type === point.getType()) {
	        // Return true in ether of the following cases:
	        // 1. No ID array is provided for this point type (i.e. entire type is draggable)
	        // 2. An ID array is provided and it includes this Point's ID
	        retval = !draggableTypes[type] || draggableTypes[type].indexOf(point.getId()) !== -1;
	      }
	    });
	    return retval;
	  };
	});

	/**
	 * Expose `Renderer`
	 */

	module.exports = Renderer;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);

	/**
	 * Draw the snapping grid
	 *
	 * @param {Display} display object
	 * @param {Number} cell size
	 */

	module.exports = function drawGrid(display, cellSize) {
	  var svg = display.svg;
	  var xScale = display.xScale;
	  var yScale = display.yScale;

	  // Remove all current gridlines
	  svg.selectAll('.gridline').remove();

	  // Add a grid group "behind" everything else
	  var grid = svg.insert('g', ':first-child');

	  var xRange = xScale.range();
	  var yRange = yScale.range();
	  var xDomain = xScale.domain();
	  var yDomain = yScale.domain();

	  var xMin = Math.round(xDomain[0] / cellSize) * cellSize;
	  var xMax = Math.round(xDomain[1] / cellSize) * cellSize;
	  for (var x = xMin; x <= xMax; x += cellSize) appendLine(xScale(x), xScale(x), yRange[0], yRange[1]);

	  var yMin = Math.round(yDomain[0] / cellSize) * cellSize;
	  var yMax = Math.round(yDomain[1] / cellSize) * cellSize;
	  for (var y = yMin; y <= yMax; y += cellSize) appendLine(xRange[0], xRange[1], yScale(y), yScale(y));

	  function appendLine(x1, x2, y1, y2) {
	    grid.append('line').attr({
	      'class': 'gridline',
	      'x1': x1,
	      'x2': x2,
	      'y1': y1,
	      'y2': y2
	    });
	  }
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d3 = __webpack_require__(3);
	var augment = __webpack_require__(28);
	var debug = __webpack_require__(9)('transitive:renderer');
	var each = __webpack_require__(14);

	var Renderer = __webpack_require__(63);
	var RenderedEdge = __webpack_require__(51);
	var PathSegment = __webpack_require__(23);
	var RenderedSegment = __webpack_require__(52);
	var Point = __webpack_require__(29);

	var interpolateLine = __webpack_require__(19);

	/**
	 * A Renderer subclass for drawing a simplified representation of the graph
	 * itself, i.e. just the edges and vertices.
	 *
	 * @param {Object} the main Transitive object
	 */

	var WireframeRenderer = augment(Renderer, function (base) {

	  this.constructor = function (transitive) {
	    base.constructor.call(this, transitive);
	  };

	  this.render = function () {
	    base.render.call(this);

	    var graph = this.transitive.network.graph;

	    var self = this;

	    this.wireframeEdges = [];
	    each(graph.edges, function (edge) {
	      var wfEdge = new WireframeEdge(edge);
	      wfEdge.render(self.transitive.display);
	      self.wireframeEdges.push(wfEdge);
	    });

	    this.wireframeVertices = [];
	    each(graph.vertices, function (vertex) {
	      var wfVertex = new WireframeVertex(vertex);
	      wfVertex.render(self.transitive.display);
	      self.wireframeVertices.push(wfVertex);
	    });

	    this.transitive.refresh();
	  };

	  this.refresh = function (panning) {
	    base.refresh.call(this, panning);
	    var self = this;

	    each(this.wireframeEdges, function (wfEdge) {
	      wfEdge.refresh(self.transitive.display);
	    });

	    each(this.wireframeVertices, function (wfVertex) {
	      wfVertex.refresh(self.transitive.display);
	    });
	  };

	  /**
	   * sortElements
	   */

	  this.sortElements = function () {};
	});

	/**
	 * Expose `WireframeRenderer`
	 */

	module.exports = WireframeRenderer;

	/**
	 * WireframeVertex helper class
	 */

	var WireframeVertex = augment(Point, function (base) {

	  this.constructor = function (vertex) {
	    base.constructor.call(this, {
	      vertex: vertex
	    });
	  };

	  this.getType = function () {
	    return "WIREFRAME_VERTEX";
	  };

	  /**
	   * Draw the vertex
	   *
	   * @param {Display} display
	   */

	  this.render = function (display) {
	    base.render.call(this, display);

	    this.initSvg(display);
	    this.svgGroup.attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'POINT_WIREFRAME_VERTEX'
	    });

	    // set up the marker
	    this.marker = this.markerSvg.append('circle').datum({
	      owner: this
	    }).attr('class', 'transitive-wireframe-vertex-circle');
	  };

	  /**
	   * Refresh the vertex
	   *
	   * @param {Display} display
	   */

	  this.refresh = function (display) {
	    var x = display.xScale(this.vertex.x);
	    var y = display.yScale(this.vertex.y);
	    var translate = 'translate(' + x + ', ' + y + ')';
	    this.marker.attr('transform', translate);
	    display.styler.styleWireframeVertex(display, this);
	  };
	});

	/**
	 * WireframeEdge helper class
	 */

	var WireframeEdge = augment(Object, function () {

	  this.constructor = function (edge) {
	    this.edge = edge;
	  };

	  this.render = function (display) {
	    this.line = d3.svg.line() // the line translation function
	    .x(function (data, i) {
	      return data.x;
	    }).y(function (data, i) {
	      return data.y;
	    }).interpolate(interpolateLine.bind({
	      segment: this,
	      display: display
	    }));

	    this.svgGroup = display.svg.append('g');

	    this.lineSvg = this.svgGroup.append('g').attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'WIREFRAME_EDGE'
	    });

	    this.lineGraph = this.lineSvg.append('path').attr('class', 'transitive-wireframe-edge-line');
	  };

	  this.refresh = function (display) {
	    this.renderData = this.edge.getRenderCoords(0, 0, display, true);
	    var lineData = this.line(this.renderData);
	    this.lineGraph.attr('d', lineData);
	    display.styler.styleWireframeEdge(display, this);
	  };
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$assign = __webpack_require__(67)['default'];

	var each = __webpack_require__(14);

	var Route = __webpack_require__(21);
	var RoutePattern = __webpack_require__(22);
	var Util = __webpack_require__(20);

	var styles = __webpack_require__(97);

	/**
	 * Element Types
	 */

	var types = ['labels', 'segments', 'segments_front', 'segments_halo', 'segment_labels', 'segment_label_containers', 'stops_merged', 'stops_pattern', 'places', 'places_icon', 'multipoints_merged', 'multipoints_pattern', 'wireframe_vertices', 'wireframe_edges'];

	/**
	 * SVG attributes
	 */

	var svgAttributes = ['height', 'target', 'title', 'width', 'y1', 'y2', 'x1', 'x2', 'cx', 'cy', 'dx', 'dy', 'rx', 'ry', 'd', 'r', 'y', 'x', 'transform'];

	/**
	 * Expose `Styler`
	 */

	module.exports = Styler;

	/**
	 * Styler object
	 */

	function Styler(styles) {
	  if (!(this instanceof Styler)) return new Styler(styles);

	  // reset styles
	  this.reset();

	  // load styles
	  if (styles) this.load(styles);
	}

	/**
	 * Clear all current styles
	 */

	Styler.prototype.clear = function () {
	  for (var i in types) {
	    this[types[i]] = {};
	  }
	};

	/**
	 * Reset to the predefined styles
	 */

	Styler.prototype.reset = function () {
	  for (var i in types) {
	    var type = types[i];
	    this[type] = _Object$assign({}, styles[type] || {});
	    for (var key in this[type]) {
	      if (!Array.isArray(this[type][key])) this[type][key] = [this[type][key]];
	    }
	  }
	};

	/**
	 * Load rules
	 *
	 * @param {Object} a set of style rules
	 */

	Styler.prototype.load = function (styles) {
	  var self = this;
	  for (var i in types) {
	    var type = types[i];
	    if (styles[type]) {
	      for (var key in styles[type]) {
	        this[type][key] = (this[type][key] || []).concat(styles[type][key]);
	      }
	    }
	  }
	};

	/**
	 * Style a Segment using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {RenderedSegment} Transitive RenderedSegment object
	 */

	Styler.prototype.styleSegment = function (display, segment) {

	  if (segment.lineGraphHalo) {

	    this.applyAttrAndStyle(display, segment.lineGraphHalo, this.segments_halo);
	  }

	  this.applyAttrAndStyle(display, segment.lineGraph, this.segments);

	  this.applyAttrAndStyle(display, segment.lineGraphFront, this.segments_front);
	};

	/**
	 * Style a WireframeEdge using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {WireframeEdge} Transitive WireframeEdge object
	 */

	Styler.prototype.styleWireframeEdge = function (display, wfEdge) {
	  this.applyAttrAndStyle(display, wfEdge.svgGroup.selectAll('.transitive-wireframe-edge-line'), this.wireframe_edges);
	};

	/**
	 * Style a Point using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {Point} Transitive Point object
	 */

	Styler.prototype.stylePoint = function (display, point) {
	  if (point.getType() === 'STOP') this.styleStop(display, point);
	  if (point.getType() === 'PLACE') this.stylePlace(display, point);
	  if (point.getType() === 'MULTI') this.styleMultiPoint(display, point);
	  if (point.getType() === 'WIREFRAME_VERTEX') this.styleWireframeVertex(display, point);
	};

	/**
	 * Style a Stop using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {Stop} Transitive Stop object
	 */

	Styler.prototype.styleStop = function (display, stop) {
	  this.applyAttrAndStyle(display, stop.patternMarkers, this.stops_pattern);

	  this.applyAttrAndStyle(display, stop.mergedMarker, this.stops_merged);

	  this.applyAttrAndStyle(display, stop.svgGroup.selectAll('.transitive-stop-label'), this.labels);
	};

	/**
	 * Style a Place using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {Place} Transitive Place object
	 */

	Styler.prototype.stylePlace = function (display, place) {
	  this.applyAttrAndStyle(display, place.svgGroup.selectAll('.transitive-place-circle'), this.places);

	  this.applyAttrAndStyle(display, place.svgGroup.selectAll('.transitive-place-icon'), this.places_icon);

	  this.applyAttrAndStyle(display, place.svgGroup.selectAll('.transitive-place-label'), this.labels);
	};

	/**
	 * Style a MultiPoint using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {MultiPoint} Transitive MultiPoint object
	 */

	Styler.prototype.styleMultiPoint = function (display, multipoint) {
	  this.applyAttrAndStyle(display, multipoint.svgGroup.selectAll('.transitive-multipoint-marker-pattern'), this.multipoints_pattern);

	  this.applyAttrAndStyle(display, multipoint.svgGroup.selectAll('.transitive-multipoint-marker-merged'), this.multipoints_merged);

	  this.applyAttrAndStyle(display, multipoint.svgGroup.selectAll('.transitive-multi-label'), this.labels);
	};

	/**
	 * Style a WireframeVertex using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {WireframeVertex} Transitive WireframeVertex object
	 */

	Styler.prototype.styleWireframeVertex = function (display, wfVertex) {
	  this.applyAttrAndStyle(display, wfVertex.svgGroup.selectAll('.transitive-wireframe-vertex-circle'), this.wireframe_vertices);
	};

	/**
	 * Style a Point label using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {Point} Transitive Point object
	 */

	Styler.prototype.stylePointLabel = function (display, point) {
	  var pointType = point.getType().toLowerCase();

	  this.applyAttrAndStyle(display, point.svgGroup.selectAll('.transitive-' + pointType + '-label'), this.labels);
	};

	/**
	 * Style a Segment label using the rules defined in styles.js or the Transitive options
	 *
	 * @param {Display} Transitive Display object
	 * @param {SegmentLabel} Transitive SegmentLabel object
	 */

	Styler.prototype.styleSegmentLabel = function (display, label) {
	  this.applyAttrAndStyle(display, label.svgGroup.selectAll('.transitive-segment-label-container'), this.segment_label_containers);
	  this.applyAttrAndStyle(display, label.svgGroup.selectAll('.transitive-segment-label'), this.segment_labels);
	};

	/**
	 * Check if it's an attribute or a style and apply accordingly
	 *
	 * @param {Display} the Display object
	 * @param {Object} a D3 list of elements
	 * @param {Object} the list of attributes
	 */

	Styler.prototype.applyAttrAndStyle = function (display, elements, attributes) {
	  for (var name in attributes) {
	    var rules = attributes[name];
	    var fn = svgAttributes.indexOf(name) === -1 ? 'style' : 'attr';

	    this.applyRules(display, elements, name, rules, fn);
	  }
	};

	/**
	 * Apply style/attribute rules to a list of elements
	 *
	 * @param {Display} display object
	 * @param {Object} elements
	 * @param {String} rule name
	 * @param {Array} rules
	 * @param {String} style/attr
	 */

	Styler.prototype.applyRules = function (display, elements, name, rules, fn) {
	  var self = this;
	  elements[fn](name, function (data, index) {
	    return self.compute(rules, display, data, index);
	  });
	};

	/**
	 * Compute a style rule based on the current display and data
	 *
	 * @param {Array} array of rules
	 * @param {Object} the Display object
	 * @param {Object} data associated with this object
	 * @param {Number} index of this object
	 */

	Styler.prototype.compute = function (rules, display, data, index) {
	  var computed,
	      self = this;
	  for (var i in rules) {
	    var rule = rules[i];
	    var val = isFunction(rule) ? rule.call(self, display, data, index, styles.utils) : rule;
	    if (val !== undefined && val !== null) computed = val;
	  }
	  return computed;
	};

	/**
	 * Return the collection of default segment styles for a mode.
	 *
	 * @param {String} an OTP mode string
	 */

	Styler.prototype.getModeStyles = function (mode, display) {
	  var modeStyles = {};

	  // simulate a segment w/ the specified style
	  var segment = {
	    focused: true,
	    isFocused: function isFocused() {
	      return true;
	    }
	  };

	  if (mode === "WALK" || mode === "BICYCLE" || mode === "BICYCLE_RENT" || mode === "CAR") {
	    segment.type = mode;
	  } else {
	    // assume a transit mode
	    segment.type = "TRANSIT";
	    segment.mode = Util.otpModeToGtfsType(mode);
	    var route = new Route({
	      route_type: segment.mode,
	      agency_id: "",
	      route_id: "",
	      route_short_name: "",
	      route_long_name: ""
	    });
	    var pattern = new RoutePattern({});
	    route.addPattern(pattern);
	    segment.patterns = [pattern];
	  }

	  for (var attrName in this.segments) {
	    var rules = this.segments[attrName];
	    for (var i in rules) {
	      var rule = rules[i];
	      var val = isFunction(rule) ? rule.call(this, display, segment, 0, styles.utils) : rule;
	      if (val !== undefined && val !== null) {
	        modeStyles[attrName] = val;
	      }
	    }
	  }

	  return modeStyles;
	};

	/**
	 * Is function?
	 */

	function isFunction(val) {
	  return Object.prototype.toString.call(val) === '[object Function]';
	}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(69);
	module.exports = __webpack_require__(43).Object.assign;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	'use strict';

	var $export = __webpack_require__(41);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(70) });

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	'use strict';

	var _Object$assign = __webpack_require__(67)['default'];

	var _Symbol = __webpack_require__(71)['default'];

	var _Object$keys = __webpack_require__(35)['default'];

	var $ = __webpack_require__(6),
	    toObject = __webpack_require__(38),
	    IObject = __webpack_require__(85);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(46)(function () {
	  var a = _Object$assign,
	      A = {},
	      B = {},
	      S = _Symbol(),
	      K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) {
	    B[k] = k;
	  });
	  return a({}, A)[S] != 7 || _Object$keys(a({}, B)).join('') != K;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target),
	      $$ = arguments,
	      $$len = $$.length,
	      index = 1,
	      getKeys = $.getKeys,
	      getSymbols = $.getSymbols,
	      isEnum = $.isEnum;
	  while ($$len > index) {
	    var S = IObject($$[index++]),
	        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
	        length = keys.length,
	        j = 0,
	        key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  }
	  return T;
	} : _Object$assign;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(73);
	__webpack_require__(96);
	module.exports = __webpack_require__(43).Symbol;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $ = __webpack_require__(6),
	    global = __webpack_require__(42),
	    has = __webpack_require__(74),
	    DESCRIPTORS = __webpack_require__(75),
	    $export = __webpack_require__(41),
	    redefine = __webpack_require__(76),
	    $fails = __webpack_require__(46),
	    shared = __webpack_require__(79),
	    setToStringTag = __webpack_require__(80),
	    uid = __webpack_require__(82),
	    wks = __webpack_require__(81),
	    keyOf = __webpack_require__(83),
	    $names = __webpack_require__(87),
	    enumKeys = __webpack_require__(91),
	    isArray = __webpack_require__(92),
	    anObject = __webpack_require__(93),
	    toIObject = __webpack_require__(84),
	    createDesc = __webpack_require__(78),
	    getDesc = $.getDesc,
	    setDesc = $.setDesc,
	    _create = $.create,
	    getNames = $names.get,
	    $Symbol = global.Symbol,
	    $JSON = global.JSON,
	    _stringify = $JSON && $JSON.stringify,
	    setter = false,
	    HIDDEN = wks('_hidden'),
	    isEnum = $.isEnum,
	    SymbolRegistry = shared('symbol-registry'),
	    AllSymbols = shared('symbols'),
	    useNative = typeof $Symbol == 'function',
	    ObjectProto = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(setDesc({}, 'a', {
	    get: function get() {
	      return setDesc(this, 'a', { value: 7 }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = getDesc(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  setDesc(it, key, D);
	  if (protoDesc && it !== ObjectProto) setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function set(value) {
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function isSymbol(it) {
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (D && has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    }return setSymbolDesc(it, key, D);
	  }return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P)),
	      i = 0,
	      l = keys.length,
	      key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  var D = getDesc(it = toIObject(it), key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = getNames(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) if (!has(AllSymbols, key = names[i++]) && key != HIDDEN) result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var names = getNames(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) if (has(AllSymbols, key = names[i++])) result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it) {
	  if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  var args = [it],
	      i = 1,
	      $$ = arguments,
	      replacer,
	      $replacer;
	  while ($$.length > i) args.push($$[i++]);
	  replacer = args[1];
	  if (typeof replacer == 'function') $replacer = replacer;
	  if ($replacer || !isArray(replacer)) replacer = function (key, value) {
	    if ($replacer) value = $replacer.call(this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if (!useNative) {
	  $Symbol = function Symbol() {
	    if (isSymbol(this)) throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString() {
	    return this._k;
	  });

	  isSymbol = function (it) {
	    return it instanceof $Symbol;
	  };

	  $.create = $create;
	  $.isEnum = $propertyIsEnumerable;
	  $.getDesc = $getOwnPropertyDescriptor;
	  $.setDesc = $defineProperty;
	  $.setDescs = $defineProperties;
	  $.getNames = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(95)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call(('hasInstance,isConcatSpreadable,iterator,match,replace,search,' + 'species,split,toPrimitive,toStringTag,unscopables').split(','), function (it) {
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, { Symbol: $Symbol });

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', { stringify: $stringify });

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 74 */
/***/ function(module, exports) {

	"use strict";

	var hasOwnProperty = ({}).hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	'use strict';

	module.exports = !__webpack_require__(46)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(77);

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(6),
	    createDesc = __webpack_require__(78);
	module.exports = __webpack_require__(75) ? function (object, key, value) {
	  return $.setDesc(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(42),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var def = __webpack_require__(6).setDesc,
	    has = __webpack_require__(74),
	    TAG = __webpack_require__(81)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var store = __webpack_require__(79)('wks'),
	    uid = __webpack_require__(82),
	    Symbol = __webpack_require__(42).Symbol;
	module.exports = function (name) {
	  return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(6),
	    toIObject = __webpack_require__(84);
	module.exports = function (object, el) {
	  var O = toIObject(object),
	      keys = $.getKeys(O),
	      length = keys.length,
	      index = 0,
	      key;
	  while (length > index) if (O[key = keys[index++]] === el) return key;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	'use strict';

	var IObject = __webpack_require__(85),
	    defined = __webpack_require__(39);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	'use strict';

	var cof = __webpack_require__(86);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	"use strict";

	var toString = ({}).toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	'use strict';

	var _Object$getOwnPropertyNames = __webpack_require__(88)['default'];

	var toIObject = __webpack_require__(84),
	    getNames = __webpack_require__(6).getNames,
	    toString = ({}).toString;

	var windowNames = typeof window == 'object' && _Object$getOwnPropertyNames ? _Object$getOwnPropertyNames(window) : [];

	var getWindowNames = function getWindowNames(it) {
	  try {
	    return getNames(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it) {
	  if (windowNames && toString.call(it) == '[object Window]') return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(6);
	__webpack_require__(90);
	module.exports = function getOwnPropertyNames(it) {
	  return $.getNames(it);
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	'use strict';

	__webpack_require__(40)('getOwnPropertyNames', function () {
	  return __webpack_require__(87).get;
	});

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	'use strict';

	var $ = __webpack_require__(6);
	module.exports = function (it) {
	  var keys = $.getKeys(it),
	      getSymbols = $.getSymbols;
	  if (getSymbols) {
	    var symbols = getSymbols(it),
	        isEnum = $.isEnum,
	        i = 0,
	        key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	'use strict';

	var cof = __webpack_require__(86);
	module.exports = Array.isArray || function (arg) {
	  return cof(arg) == 'Array';
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(94);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	"use strict";

	module.exports = true;

/***/ },
/* 96 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$assign = __webpack_require__(67)['default'];

	var d3 = __webpack_require__(3);

	/**
	 * Scales for utility functions to use
	 */

	var zoomScale = d3.scale.linear().domain([0.25, 1, 4]);
	var strokeScale = d3.scale.linear().domain([0.25, 1, 4]).range([5, 12, 19]);
	var fontScale = d3.scale.linear().domain([0.25, 1, 4]).range([10, 14, 18]);

	/**
	 * Scales for utility functions to use
	 */

	var notFocusedColor = '#e0e0e0';

	/**
	 * Expose `utils` for the style functions to use
	 */

	exports.utils = {
	  pixels: function pixels(zoom, min, normal, max) {
	    return zoomScale.range([min, normal, max])(zoom);
	  },
	  strokeWidth: function strokeWidth(display) {
	    return strokeScale(display.zoom.scale());
	  },
	  fontSize: function fontSize(display, data) {
	    return Math.floor(fontScale(display.zoom.scale()));
	  },
	  defineSegmentCircleMarker: function defineSegmentCircleMarker(display, segment, radius, fillColor) {
	    var markerId = 'circleMarker-' + segment.getId();
	    display.svg.append('defs').append('svg:marker').attr('id', markerId).attr('refX', radius).attr('refY', radius).attr('markerWidth', radius * 2).attr('markerHeight', radius * 2).attr('markerUnits', 'userSpaceOnUse').append('svg:circle').attr('cx', radius).attr('cy', radius).attr('r', radius).attr('fill', segment.focused ? fillColor : notFocusedColor);

	    return 'url(#' + markerId + ')';
	  }
	};

	/**
	 * Default Wireframe Edge/Vertex Rules
	 */

	exports.wireframe_vertices = {
	  cx: 0,
	  cy: 0,
	  r: 3,
	  fill: '#000'
	};

	exports.wireframe_edges = {
	  stroke: '#444',
	  'stroke-width': 2,
	  'stroke-dasharray': '3px 2px',
	  fill: 'none'
	};

	/**
	 * Default Merged Stops Rules
	 */

	var stops_merged = exports.stops_merged = {
	  fill: function fill(display, data, index, utils) {
	    return '#fff';
	  },
	  r: function r(display, data, index, utils) {
	    return utils.pixels(display.zoom.scale(), 8, 12, 16);
	  },
	  stroke: function stroke(display, data, index, utils) {
	    var point = data.owner;
	    if (!point.isFocused()) return notFocusedColor;
	    return '#000';
	  },
	  'stroke-width': function strokeWidth(display, data, index, utils) {
	    return 2;
	  },

	  /**
	   *  Transitive-specific attribute specifying the shape of the main stop marker.
	   *  Can be 'roundedrect', 'rectangle' or 'circle'
	   */

	  'marker-type': ['circle', function (display, data, index, utils) {
	    var point = data.owner;
	    if ((point.containsBoardPoint() || point.containsAlightPoint()) && !point.containsTransferPoint()) return 'circle';
	  }],

	  /**
	   *  Transitive-specific attribute specifying any additional padding, in pixels,
	   *  to apply to main stop marker. A value of zero (default) results in a that
	   *  marker is flush to the edges of the pattern segment(s) the point is set against.
	   *  A value greater than zero creates a marker that is larger than the width of
	   *  the segments(s).
	   */

	  'marker-padding': 3,

	  visibility: function visibility(display, data) {
	    if (!data.owner.containsSegmentEndPoint()) return 'hidden';
	  }
	};

	/**
	 * Stops Along a Pattern
	 */

	var stops_pattern = exports.stops_pattern = {
	  cx: 0,
	  cy: 0,
	  r: [4, function (display, data, index, utils) {
	    return utils.pixels(display.zoom.scale(), 1, 2, 4);
	  }, function (display, data, index, utils) {
	    var point = data.owner;
	    var busOnly = true;
	    point.getPatterns().forEach(function (pattern) {
	      if (pattern.route && pattern.route.route_type !== 3) busOnly = false;
	    });
	    if (busOnly && !point.containsSegmentEndPoint()) {
	      return 0.5 * utils.pixels(display.zoom.scale(), 2, 4, 6.5);
	    }
	  }],
	  stroke: 'none',
	  visibility: function visibility(display, data) {
	    if (display.zoom.scale() < 1.5) return 'hidden';
	    if (data.owner.containsSegmentEndPoint()) return 'hidden';
	  }
	};

	/**
	 * Default place rules
	 */

	exports.places = {
	  cx: 0,
	  cy: 0,
	  r: 14,
	  stroke: '0px',
	  fill: '#fff'
	};

	/**
	 * Default MultiPoint rules -- based on Stop rules
	 */

	var multipoints_merged = exports.multipoints_merged = _Object$assign({}, stops_merged);

	multipoints_merged.visibility = true;

	/**
	 * Default Multipoint Stops along a pattern
	 */

	exports.multipoints_pattern = _Object$assign({}, stops_pattern);

	/**
	 * Default label rules
	 */

	var labels = exports.labels = {
	  'font-size': function fontSize(display, data, index, utils) {
	    return utils.fontSize(display, data) + 'px';
	  },
	  'font-weight': function fontWeight(display, data, index, utils) {
	    var point = data.owner.parent;
	    if (point.containsBoardPoint() || point.containsAlightPoint()) return 'bold';
	  },

	  /**
	   * 'orientations' is a transitive-specific attribute used to specify allowable
	   * label placement orientations expressed as one of eight compass directions
	   * relative to the point being labeled:
	   *
	   *        'N'
	   *    'NW' |  'NE'
	   *       \ | /
	   *  'W' -- O -- 'E'
	   *       / | \
	   *    'SW' | 'SE'
	   *        'S
	   *
	   * Labels oriented 'E' or 'W' are rendered horizontally, 'N' and 'S' vertically,
	   * and all others at a 45-degree angle.
	   *
	   * Returns an array of allowed orientation codes in the order that they will be
	   * tried by the labeler.
	   */

	  orientations: [['E', 'W']]
	};

	/**
	 * All path segments
	 * TODO: update old route-pattern-specific code below
	 */

	exports.segments = {
	  stroke: ['#008', function (display, data) {
	    var segment = data;
	    if (!segment.focused) return notFocusedColor;
	    if (segment.type === 'TRANSIT') {
	      if (segment.patterns) {
	        if (segment.patterns[0].route.route_short_name.toLowerCase().substring(0, 2) === 'dc') return '#f00';
	        return segment.patterns[0].route.getColor();
	      }
	    } else if (segment.type === 'CAR') {
	      return '#888';
	    }
	  }],
	  'stroke-dasharray': [false, function (display, data) {
	    var segment = data;
	    if (segment.frequency && segment.frequency.average < 12) {
	      if (segment.frequency.average > 6) return '12px, 12px';
	      return '12px, 2px';
	    }
	  }],
	  'stroke-width': ['12px', function (display, data, index, utils) {
	    var segment = data;

	    if (segment.mode === 3) {
	      return utils.pixels(display.zoom.scale(), 2, 4, 8) + 'px';
	    }
	    return utils.pixels(display.zoom.scale(), 4, 8, 12) + 'px';
	  }],
	  envelope: [function (display, data, index, utils) {
	    var segment = data;
	    if (segment.type !== 'TRANSIT') {
	      return '8px';
	    }
	    if (segment.mode === 3) {
	      return utils.pixels(display.zoom.scale(), 4, 6, 10) + 'px';
	    }
	    return utils.pixels(display.zoom.scale(), 6, 10, 14) + 'px';
	  }]
	};

	/**
	 * Segments Front
	 */

	exports.segments_front = {
	  stroke: '#008',
	  'stroke-width': function strokeWidth(display, data, index, utils) {
	    return utils.pixels(display.zoom.scale(), 3, 6, 10) / 2 + 'px';
	  },
	  fill: 'none',
	  display: ['none', function (display, data, index, utils) {
	    if (data.pattern && data.pattern.route && data.pattern.route.route_type === 3 && data.pattern.route.route_short_name.toLowerCase().substring(0, 2) === 'dc') {
	      return 'inline';
	    }
	  }]
	};

	/**
	 * Segments Halo
	 */

	exports.segments_halo = {
	  stroke: '#fff',
	  'stroke-width': function strokeWidth(display, data, index, utils) {
	    return data.computeLineWidth(display) + 8;
	  },
	  'stroke-linecap': 'round',
	  fill: 'none'
	};

	/**
	 * Label Containers
	 */

	exports.segment_label_containers = {
	  fill: function fill(display, data) {
	    if (!data.isFocused()) return notFocusedColor;
	  },
	  'stroke-width': function strokeWidth(display, data) {
	    if (data.parent.pattern && data.parent.pattern.route.route_short_name.toLowerCase().substring(0, 2) === 'dc') return 1;
	    return 0;
	  },
	  rx: 3,
	  ry: 3
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);
	var each = __webpack_require__(14);
	var d3 = __webpack_require__(3);

	var SegmentLabel = __webpack_require__(99);
	var Util = __webpack_require__(20);

	var debug = __webpack_require__(9)('transitive:labeler');

	/**
	 * Labeler object
	 */

	var Labeler = augment(Object, function () {

	  this.constructor = function (transitive) {

	    this.transitive = transitive;
	    this.clear();
	  };

	  this.clear = function (transitive) {

	    this.points = [];
	  };

	  this.updateLabelList = function (graph) {

	    this.points = [];
	    graph.vertices.forEach(function (vertex) {
	      var point = vertex.point;
	      if (point.getType() === 'PLACE' || point.getType() === 'MULTI' || point.getType() === 'STOP' && point.isSegmentEndPoint) {
	        this.points.push(point);
	      }
	    }, this);

	    this.points.sort(function compare(a, b) {
	      if (a.containsFromPoint() || a.containsToPoint()) return -1;
	      if (b.containsFromPoint() || b.containsToPoint()) return 1;
	      return 0;
	    });
	  };

	  this.updateQuadtree = function () {

	    this.quadtree = d3.geom.quadtree().extent([[-this.width, -this.height], [this.width * 2, this.height * 2]])([]);

	    this.addPointsToQuadtree();
	    //this.addSegmentsToQuadtree();
	  };

	  this.addPointsToQuadtree = function () {

	    this.points.forEach(function (point) {
	      var mbbox = point.getMarkerBBox();
	      if (mbbox) this.addBBoxToQuadtree(point.getMarkerBBox());
	    }, this);
	  };

	  this.addSegmentsToQuadtree = function () {

	    var disp = this.transitive.display;
	    this.transitive.renderSegments.forEach(function (segment) {

	      if (segment.getType() !== 'TRANSIT') return;

	      var lw = this.transitive.style.compute(this.transitive.style.segments['stroke-width'], this.transitive.display, segment);
	      lw = parseFloat(lw.substring(0, lw.length - 2), 10) - 2;

	      var x, x1, x2, y, y1, y2;
	      //debug(segment.toString());
	      if (segment.renderData.length === 2) {
	        // basic straight segment
	        if (segment.renderData[0].x === segment.renderData[1].x) {
	          // vertical
	          x = segment.renderData[0].x - lw / 2;
	          y1 = segment.renderData[0].y;
	          y2 = segment.renderData[1].y;
	          this.addBBoxToQuadtree({
	            x: x,
	            y: Math.min(y1, y2),
	            width: lw,
	            height: Math.abs(y1 - y2)
	          });
	        } else if (segment.renderData[0].y === segment.renderData[1].y) {
	          // horizontal
	          x1 = segment.renderData[0].x;
	          x2 = segment.renderData[1].x;
	          y = segment.renderData[0].y - lw / 2;
	          this.addBBoxToQuadtree({
	            x: Math.min(x1, x2),
	            y: y,
	            width: Math.abs(x1 - x2),
	            height: lw
	          });
	        }
	      }

	      if (segment.renderData.length === 4) {
	        // basic curved segment

	        if (segment.renderData[0].x === segment.renderData[1].x) {
	          // vertical first
	          x = segment.renderData[0].x - lw / 2;
	          y1 = segment.renderData[0].y;
	          y2 = segment.renderData[3].y;
	          this.addBBoxToQuadtree({
	            x: x,
	            y: Math.min(y1, y2),
	            width: lw,
	            height: Math.abs(y1 - y2)
	          });

	          x1 = segment.renderData[0].x;
	          x2 = segment.renderData[3].x;
	          y = segment.renderData[3].y - lw / 2;
	          this.addBBoxToQuadtree({
	            x: Math.min(x1, x2),
	            y: y,
	            width: Math.abs(x1 - x2),
	            height: lw
	          });
	        } else if (segment.renderData[0].y === segment.renderData[1].y) {
	          // horiz first
	          x1 = segment.renderData[0].x;
	          x2 = segment.renderData[3].x;
	          y = segment.renderData[0].y - lw / 2;
	          this.addBBoxToQuadtree({
	            x: Math.min(x1, x2),
	            y: y,
	            width: Math.abs(x1 - x2),
	            height: lw
	          });

	          x = segment.renderData[3].x - lw / 2;
	          y1 = segment.renderData[0].y;
	          y2 = segment.renderData[3].y;
	          this.addBBoxToQuadtree({
	            x: x,
	            y: Math.min(y1, y2),
	            width: lw,
	            height: Math.abs(y1 - y2)
	          });
	        }
	      }
	    }, this);
	  };

	  this.addBBoxToQuadtree = function (bbox) {

	    if (bbox.x + bbox.width / 2 < 0 || bbox.x - bbox.width / 2 > this.width || bbox.y + bbox.height / 2 < 0 || bbox.y - bbox.height / 2 > this.height) return;

	    this.quadtree.add([bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, bbox]);

	    this.maxBBoxWidth = Math.max(this.maxBBoxWidth, bbox.width);
	    this.maxBBoxHeight = Math.max(this.maxBBoxHeight, bbox.height);
	  };

	  this.doLayout = function () {

	    this.width = this.transitive.el.clientWidth;
	    this.height = this.transitive.el.clientHeight;

	    this.maxBBoxWidth = 0;
	    this.maxBBoxHeight = 0;

	    this.updateQuadtree();

	    var labeledSegments = this.placeSegmentLabels();
	    var labeledPoints = this.placePointLabels();

	    return {
	      segments: labeledSegments,
	      points: labeledPoints
	    };
	  };

	  this.placeSegmentLabels = function () {

	    each(this.segmentLabels, function (label) {
	      label.clear();
	    });
	    this.segmentLabels = [];
	    this.placedLabelKeys = [];

	    // collect the bus RenderSegments
	    var busRSegments = [];
	    each(this.transitive.network.paths, function (path) {
	      each(path.getRenderedSegments(), function (rSegment) {
	        if (rSegment.type === 'TRANSIT' && rSegment.mode === 3) busRSegments.push(rSegment);
	      });
	    }, this);

	    var edgeGroups = [];
	    each(this.transitive.network.paths, function (path) {
	      each(path.segments, function (segment) {
	        if (segment.type === 'TRANSIT' && segment.getMode() === 3) {
	          edgeGroups = edgeGroups.concat(segment.getLabelEdgeGroups());
	        }
	      });
	    }, this);

	    // iterate through the sequence collection, labeling as necessary
	    //each(busRSegments, function(rSegment) {
	    each(edgeGroups, function (edgeGroup) {

	      this.currentGroup = edgeGroup;
	      // get the array of label strings to be places (typically the unique route short names)
	      this.labelTextArray = edgeGroup.getLabelTextArray();

	      // create the initial label for placement
	      this.labelTextIndex = 0;

	      var label = this.getNextLabel(); //this.constructSegmentLabel(rSegment, labelTextArray[labelTextIndex]);
	      if (!label) return;

	      // iterate through potential anchor locations, attempting placement at each one
	      var labelAnchors = edgeGroup.getLabelAnchors(this.transitive.display, label.textHeight * 1.5);
	      for (var i = 0; i < labelAnchors.length; i++) {
	        label.labelAnchor = labelAnchors[i];

	        // do not consider this anchor if it is out of the display range
	        if (!this.transitive.display.isInRange(label.labelAnchor.x, label.labelAnchor.y)) continue;

	        // check for conflicts with existing placed elements
	        var bbox = label.getBBox();
	        var conflicts = this.findOverlaps(label, bbox);

	        if (conflicts.length === 0) {
	          // if no conflicts

	          // place the current label
	          this.segmentLabels.push(label);
	          this.quadtree.add([label.labelAnchor.x, label.labelAnchor.y, label]);
	          //debug('placing seg label for ' + label.labelText);

	          label = this.getNextLabel();
	          if (!label) break;
	        }
	      } // end of anchor iteration loop
	    }, this); // end of sequence iteration loop
	  };

	  this.getNextLabel = function () {
	    while (this.labelTextIndex < this.labelTextArray.length) {
	      var labelText = this.labelTextArray[this.labelTextIndex];
	      var key = this.currentGroup.edgeIds + '_' + labelText;
	      if (this.placedLabelKeys.indexOf(key) !== -1) {
	        this.labelTextIndex++;
	        continue;
	      }
	      var label = this.constructSegmentLabel(this.currentGroup.renderedSegment, labelText);
	      this.placedLabelKeys.push(key);
	      this.labelTextIndex++;
	      return label;
	    }
	    return null;
	  };

	  this.constructSegmentLabel = function (segment, labelText) {
	    var label = new SegmentLabel(segment, labelText);
	    var styler = this.transitive.styler;
	    label.fontFamily = styler.compute(styler.labels['font-family'], this.transitive.display, {
	      segment: segment
	    });
	    label.fontSize = styler.compute(styler.labels['font-size'], this.transitive.display, {
	      segment: segment
	    });
	    var textBBox = Util.getTextBBox(labelText, {
	      'font-size': label.fontSize,
	      'font-family': label.fontFamily
	    });
	    label.textWidth = textBBox.width;
	    label.textHeight = textBBox.height;
	    label.computeContainerDimensions();

	    return label;
	  };

	  this.placePointLabels = function () {

	    var styler = this.transitive.styler;

	    var labeledPoints = [];

	    this.points.forEach(function (point) {

	      var labelText = point.label.getText();
	      point.label.fontFamily = styler.compute(styler.labels['font-family'], this.transitive.display, {
	        point: point
	      });
	      point.label.fontSize = styler.compute(styler.labels['font-size'], this.transitive.display, {
	        point: point
	      });
	      var textBBox = Util.getTextBBox(labelText, {
	        'font-size': point.label.fontSize,
	        'font-family': point.label.fontFamily
	      });
	      point.label.textWidth = textBBox.width;
	      point.label.textHeight = textBBox.height;

	      var orientations = styler.compute(styler.labels.orientations, this.transitive.display, {
	        point: point
	      });

	      var placedLabel = false;
	      for (var i = 0; i < orientations.length; i++) {

	        point.label.setOrientation(orientations[i]);
	        if (!point.focused) continue;

	        if (!point.label.labelAnchor) continue;

	        var lx = point.label.labelAnchor.x,
	            ly = point.label.labelAnchor.y;

	        // do not place label if out of range
	        if (lx <= 0 || ly <= 0 || lx >= this.width || ly > this.height) continue;

	        var labelBBox = point.label.getBBox();

	        var overlaps = this.findOverlaps(point.label, labelBBox);

	        // do not place label if it overlaps with others
	        if (overlaps.length > 0) continue;

	        // if we reach this point, the label is good to place

	        point.label.setVisibility(true);
	        labeledPoints.push(point);

	        this.quadtree.add([labelBBox.x + labelBBox.width / 2, labelBBox.y + labelBBox.height / 2, point.label]);

	        this.maxBBoxWidth = Math.max(this.maxBBoxWidth, labelBBox.width);
	        this.maxBBoxHeight = Math.max(this.maxBBoxHeight, labelBBox.height);

	        placedLabel = true;
	        break; // do not consider any other orientations after places
	      } // end of orientation loop

	      // if label not placed at all, hide the element
	      if (!placedLabel) {
	        point.label.setVisibility(false);
	      }
	    }, this);
	    return labeledPoints;
	  };

	  this.findOverlaps = function (label, labelBBox) {
	    var minX = labelBBox.x - this.maxBBoxWidth / 2;
	    var minY = labelBBox.y - this.maxBBoxHeight / 2;
	    var maxX = labelBBox.x + labelBBox.width + this.maxBBoxWidth / 2;
	    var maxY = labelBBox.y + labelBBox.height + this.maxBBoxHeight / 2;
	    //debug('findOverlaps %s,%s %s,%s', minX,minY,maxX,maxY);

	    var matchItems = [];
	    this.quadtree.visit(function (node, x1, y1, x2, y2) {
	      var p = node.point;
	      if (p && p[0] >= minX && p[0] < maxX && p[1] >= minY && p[1] < maxY && label.intersects(p[2])) {
	        matchItems.push(p[2]);
	      }
	      return x1 > maxX || y1 > maxY || x2 < minX || y2 < minY;
	    });
	    return matchItems;
	  };

	  this.findNearbySegmentLabels = function (label, x, y, buffer) {
	    var minX = x - buffer;
	    var minY = y - buffer;
	    var maxX = x + buffer;
	    var maxY = y + buffer;
	    //debug('findNearby %s,%s %s,%s', minX,minY,maxX,maxY);

	    var matchItems = [];
	    this.quadtree.visit(function (node, x1, y1, x2, y2) {
	      var p = node.point;
	      if (p && p[0] >= minX && p[0] < maxX && p[1] >= minY && p[1] < maxY && p[2].parent && label.parent.patternIds === p[2].parent.patternIds) {
	        matchItems.push(p[2]);
	      }
	      return x1 > maxX || y1 > maxY || x2 < minX || y2 < minY;
	    });
	    return matchItems;
	  };
	});

	/**
	 * Expose `Labeler`
	 */

	module.exports = Labeler;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */

	'use strict';

	var augment = __webpack_require__(28);

	var Label = __webpack_require__(31);

	/**
	 * SegmentLabel object
	 */

	var SegmentLabel = augment(Label, function (base) {

	  this.constructor = function (parent, text) {

	    base.constructor.call(this, parent);
	    this.labelText = text;
	  };

	  /*this.initText = function() {
	    return this.parent.patterns[0].route.route_short_name;
	  };*/

	  this.render = function (display) {
	    this.svgGroup = this.parent.labelSvg.append('g').attr('class', 'transitive-sortable').datum({
	      owner: this,
	      sortableType: 'LABEL'
	    });

	    var typeStr = this.parent.getType().toLowerCase();

	    var padding = this.getPadding();

	    this.computeContainerDimensions();

	    this.containerSvg = this.svgGroup.append('rect').datum(this) //{ segment: this.parent })
	    .attr({
	      width: this.containerWidth,
	      height: this.containerHeight
	    }).attr('id', 'transitive-segment-label-container-' + this.parent.getId()).text(this.getText()).attr('class', 'transitive-segment-label-container');

	    this.textSvg = this.svgGroup.append('text').datum(this) //{ segment: this.parent })
	    .attr('id', 'transitive-segment-label-' + this.parent.getId()).text(this.getText()).attr('class', 'transitive-segment-label').attr('font-size', this.fontSize).attr('font-family', this.fontFamily).attr('transform', (function (d, i) {
	      return 'translate(' + padding + ', ' + (this.textHeight - padding * 2) + ')';
	    }).bind(this));
	  };

	  this.refresh = function (display) {
	    if (!this.labelAnchor) return;

	    if (!this.svgGroup) this.render(display);

	    this.svgGroup.attr('transform', (function (d, i) {
	      var tx = this.labelAnchor.x - this.containerWidth / 2;
	      var ty = this.labelAnchor.y - this.containerHeight / 2;
	      return 'translate(' + tx + ',' + ty + ')';
	    }).bind(this));
	  };

	  this.getPadding = function () {
	    return this.textHeight * 0.1;
	  };

	  this.computeContainerDimensions = function () {
	    this.containerWidth = this.textWidth + this.getPadding() * 2;
	    this.containerHeight = this.textHeight;
	  };

	  this.getBBox = function () {
	    return {
	      x: this.labelAnchor.x - this.containerWidth / 2,
	      y: this.labelAnchor.y - this.containerHeight / 2,
	      width: this.containerWidth,
	      height: this.containerHeight
	    };
	  };

	  this.intersects = function (obj) {
	    if (obj instanceof Label) {
	      // todo: handle label-label intersection for diagonally placed labels separately
	      return this.intersectsBBox(obj.getBBox());
	    } else if (obj.x && obj.y && obj.width && obj.height) {
	      return this.intersectsBBox(obj);
	    }

	    return false;
	  };

	  this.clear = function () {
	    this.labelAnchor = null;
	    if (this.svgGroup) {
	      this.svgGroup.remove();
	      this.svgGroup = null;
	    }
	  };
	});

	/**
	 * Expose `SegmentLabel`
	 */

	module.exports = SegmentLabel;

/***/ },
/* 100 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var L = __webpack_require__(1);

	L.TransitiveLayer = module.exports = L.Class.extend({

	  initialize: function initialize(transitive, options) {
	    this._transitive = transitive;
	  },

	  onAdd: function onAdd(map) {
	    this._map = map;

	    this._initContainer();

	    map.on("moveend", this._refresh, this);
	    map.on("zoomend", this._refresh, this);
	    map.on("drag", this._refresh, this);
	    map.on("resize", this._resize, this);

	    this._transitive.options.zoomEnabled = false;
	    this._transitive.options.autoResize = false;
	    this._transitive.setElement(this._container);
	    this._transitive.render();

	    var self = this;
	    this._transitive.on('clear data', function () {
	      self._refresh();
	    });

	    this._transitive.on('update data', function () {
	      self._transitive.render();
	      self._refresh();
	    });
	  },

	  onRemove: function onRemove(map) {
	    map.getPanes().overlayPane.removeChild(this._container);
	    map.off("moveend", this._refresh, this);
	    map.off("zoomend", this._refresh, this);
	    map.off("drag", this._refresh, this);
	    map.off("resize", this._resize, this);
	  },

	  getBounds: function getBounds() {
	    var bounds = this._transitive.getNetworkBounds();
	    if (!bounds) return null;
	    return new L.LatLngBounds([bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]);
	  },

	  _initContainer: function _initContainer() {
	    this._container = L.DomUtil.create('div', 'leaflet-transitive-container', this._map.getPanes().overlayPane);
	    this._container.style.position = 'absolute';
	    this._container.style.width = this._map.getSize().x + "px";
	    this._container.style.height = this._map.getSize().y + "px";
	  },

	  _refresh: function _refresh() {
	    var bounds = this._map.getBounds();
	    var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
	    L.DomUtil.setPosition(this._container, topLeft);
	    this._transitive.setDisplayBounds([[bounds.getWest(), bounds.getSouth()], [bounds.getEast(), bounds.getNorth()]]);
	  },

	  _resize: function _resize(data) {
	    this._transitive.resize(data.newSize.x, data.newSize.y);
	    this._refresh();
	  }

	});

	L.transitiveLayer = function (transitive, options) {
	  return new L.TransitiveLayer(transitive, options);
	};

/***/ }
/******/ ]);