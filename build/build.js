
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("component-props/index.js", Function("exports, require, module",
"/**\n\
 * Global Names\n\
 */\n\
\n\
var globals = /\\b(this|Array|Date|Object|Math|JSON)\\b/g;\n\
\n\
/**\n\
 * Return immediate identifiers parsed from `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {String|Function} map function or prefix\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(str, fn){\n\
  var p = unique(props(str));\n\
  if (fn && 'string' == typeof fn) fn = prefixed(fn);\n\
  if (fn) return map(str, p, fn);\n\
  return p;\n\
};\n\
\n\
/**\n\
 * Return immediate identifiers in `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function props(str) {\n\
  return str\n\
    .replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(globals, '')\n\
    .match(/[$a-zA-Z_]\\w*/g)\n\
    || [];\n\
}\n\
\n\
/**\n\
 * Return `str` with `props` mapped with `fn`.\n\
 *\n\
 * @param {String} str\n\
 * @param {Array} props\n\
 * @param {Function} fn\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function map(str, props, fn) {\n\
  var re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~props.indexOf(_)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
/**\n\
 * Return unique array.\n\
 *\n\
 * @param {Array} arr\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function unique(arr) {\n\
  var ret = [];\n\
\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (~ret.indexOf(arr[i])) continue;\n\
    ret.push(arr[i]);\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Map with prefix `str`.\n\
 */\n\
\n\
function prefixed(str) {\n\
  return function(_){\n\
    return str + _;\n\
  };\n\
}\n\
//@ sourceURL=component-props/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var expr;\n\
try {\n\
  expr = require('props');\n\
} catch(e) {\n\
  expr = require('component-props');\n\
}\n\
\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  };\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  };\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\" or \"age > 18 && age < 36\"\n\
  return new Function('_', 'return ' + get(str));\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {};\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key]);\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  };\n\
}\n\
\n\
/**\n\
 * Built the getter function. Supports getter style functions\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(str) {\n\
  var props = expr(str);\n\
  if (!props.length) return '_.' + str;\n\
\n\
  var val, i, prop;\n\
  for (i = 0; i < props.length; i++) {\n\
    prop = props[i];\n\
    val = '_.' + prop;\n\
    val = \"('function' == typeof \" + val + \" ? \" + val + \"() : \" + val + \")\";\n\
\n\
    // mimic negative lookbehind to avoid problems with nested properties\n\
    str = stripNested(prop, str, val);\n\
  }\n\
\n\
  return str;\n\
}\n\
\n\
/**\n\
 * Mimic negative lookbehind to avoid problems with nested properties.\n\
 *\n\
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript\n\
 *\n\
 * @param {String} prop\n\
 * @param {String} str\n\
 * @param {String} val\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function stripNested (prop, str, val) {\n\
  return str.replace(new RegExp('(\\\\.)?' + prop, 'g'), function($0, $1) {\n\
    return $1 ? $0 : val;\n\
  });\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
try {\n\
  var type = require('type');\n\
} catch (err) {\n\
  var type = require('component-type');\n\
}\n\
\n\
var toFunction = require('to-function');\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`\n\
 * in optional context `ctx`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} [ctx]\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn, ctx){\n\
  fn = toFunction(fn);\n\
  ctx = ctx || this;\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn, ctx);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn, ctx);\n\
      return object(obj, fn, ctx);\n\
    case 'string':\n\
      return string(obj, fn, ctx);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, ctx) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn.call(ctx, key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("component-clone/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var type;\n\
try {\n\
  type = require('component-type');\n\
} catch (_) {\n\
  type = require('type');\n\
}\n\
\n\
/**\n\
 * Module exports.\n\
 */\n\
\n\
module.exports = clone;\n\
\n\
/**\n\
 * Clones objects.\n\
 *\n\
 * @param {Mixed} any object\n\
 * @api public\n\
 */\n\
\n\
function clone(obj){\n\
  switch (type(obj)) {\n\
    case 'object':\n\
      var copy = {};\n\
      for (var key in obj) {\n\
        if (obj.hasOwnProperty(key)) {\n\
          copy[key] = clone(obj[key]);\n\
        }\n\
      }\n\
      return copy;\n\
\n\
    case 'array':\n\
      var copy = new Array(obj.length);\n\
      for (var i = 0, l = obj.length; i < l; i++) {\n\
        copy[i] = clone(obj[i]);\n\
      }\n\
      return copy;\n\
\n\
    case 'regexp':\n\
      // from millermedeiros/amd-utils - MIT\n\
      var flags = '';\n\
      flags += obj.multiline ? 'm' : '';\n\
      flags += obj.global ? 'g' : '';\n\
      flags += obj.ignoreCase ? 'i' : '';\n\
      return new RegExp(obj.source, flags);\n\
\n\
    case 'date':\n\
      return new Date(obj.getTime());\n\
\n\
    default: // string, number, boolean, …\n\
      return obj;\n\
  }\n\
}\n\
//@ sourceURL=component-clone/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("mbostock-d3/d3.js", Function("exports, require, module",
"!function() {\n\
  var d3 = {\n\
    version: \"3.4.11\"\n\
  };\n\
  if (!Date.now) Date.now = function() {\n\
    return +new Date();\n\
  };\n\
  var d3_arraySlice = [].slice, d3_array = function(list) {\n\
    return d3_arraySlice.call(list);\n\
  };\n\
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;\n\
  try {\n\
    d3_array(d3_documentElement.childNodes)[0].nodeType;\n\
  } catch (e) {\n\
    d3_array = function(list) {\n\
      var i = list.length, array = new Array(i);\n\
      while (i--) array[i] = list[i];\n\
      return array;\n\
    };\n\
  }\n\
  try {\n\
    d3_document.createElement(\"div\").style.setProperty(\"opacity\", 0, \"\");\n\
  } catch (error) {\n\
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;\n\
    d3_element_prototype.setAttribute = function(name, value) {\n\
      d3_element_setAttribute.call(this, name, value + \"\");\n\
    };\n\
    d3_element_prototype.setAttributeNS = function(space, local, value) {\n\
      d3_element_setAttributeNS.call(this, space, local, value + \"\");\n\
    };\n\
    d3_style_prototype.setProperty = function(name, value, priority) {\n\
      d3_style_setProperty.call(this, name, value + \"\", priority);\n\
    };\n\
  }\n\
  d3.ascending = d3_ascending;\n\
  function d3_ascending(a, b) {\n\
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;\n\
  }\n\
  d3.descending = function(a, b) {\n\
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;\n\
  };\n\
  d3.min = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.max = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.extent = function(array, f) {\n\
    var i = -1, n = array.length, a, b, c;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = c = array[i]) != null && a <= a)) a = c = undefined;\n\
      while (++i < n) if ((b = array[i]) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    } else {\n\
      while (++i < n && !((a = c = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    }\n\
    return [ a, c ];\n\
  };\n\
  d3.sum = function(array, f) {\n\
    var s = 0, n = array.length, a, i = -1;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (!isNaN(a = +array[i])) s += a;\n\
    } else {\n\
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;\n\
    }\n\
    return s;\n\
  };\n\
  function d3_number(x) {\n\
    return x != null && !isNaN(x);\n\
  }\n\
  d3.mean = function(array, f) {\n\
    var s = 0, n = array.length, a, i = -1, j = n;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (d3_number(a = array[i])) s += a; else --j;\n\
    } else {\n\
      while (++i < n) if (d3_number(a = f.call(array, array[i], i))) s += a; else --j;\n\
    }\n\
    return j ? s / j : undefined;\n\
  };\n\
  d3.quantile = function(values, p) {\n\
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;\n\
    return e ? v + e * (values[h] - v) : v;\n\
  };\n\
  d3.median = function(array, f) {\n\
    if (arguments.length > 1) array = array.map(f);\n\
    array = array.filter(d3_number);\n\
    return array.length ? d3.quantile(array.sort(d3_ascending), .5) : undefined;\n\
  };\n\
  function d3_bisector(compare) {\n\
    return {\n\
      left: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;\n\
        }\n\
        return lo;\n\
      },\n\
      right: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;\n\
        }\n\
        return lo;\n\
      }\n\
    };\n\
  }\n\
  var d3_bisect = d3_bisector(d3_ascending);\n\
  d3.bisectLeft = d3_bisect.left;\n\
  d3.bisect = d3.bisectRight = d3_bisect.right;\n\
  d3.bisector = function(f) {\n\
    return d3_bisector(f.length === 1 ? function(d, x) {\n\
      return d3_ascending(f(d), x);\n\
    } : f);\n\
  };\n\
  d3.shuffle = function(array) {\n\
    var m = array.length, t, i;\n\
    while (m) {\n\
      i = Math.random() * m-- | 0;\n\
      t = array[m], array[m] = array[i], array[i] = t;\n\
    }\n\
    return array;\n\
  };\n\
  d3.permute = function(array, indexes) {\n\
    var i = indexes.length, permutes = new Array(i);\n\
    while (i--) permutes[i] = array[indexes[i]];\n\
    return permutes;\n\
  };\n\
  d3.pairs = function(array) {\n\
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);\n\
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];\n\
    return pairs;\n\
  };\n\
  d3.zip = function() {\n\
    if (!(n = arguments.length)) return [];\n\
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {\n\
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {\n\
        zip[j] = arguments[j][i];\n\
      }\n\
    }\n\
    return zips;\n\
  };\n\
  function d3_zipLength(d) {\n\
    return d.length;\n\
  }\n\
  d3.transpose = function(matrix) {\n\
    return d3.zip.apply(d3, matrix);\n\
  };\n\
  d3.keys = function(map) {\n\
    var keys = [];\n\
    for (var key in map) keys.push(key);\n\
    return keys;\n\
  };\n\
  d3.values = function(map) {\n\
    var values = [];\n\
    for (var key in map) values.push(map[key]);\n\
    return values;\n\
  };\n\
  d3.entries = function(map) {\n\
    var entries = [];\n\
    for (var key in map) entries.push({\n\
      key: key,\n\
      value: map[key]\n\
    });\n\
    return entries;\n\
  };\n\
  d3.merge = function(arrays) {\n\
    var n = arrays.length, m, i = -1, j = 0, merged, array;\n\
    while (++i < n) j += arrays[i].length;\n\
    merged = new Array(j);\n\
    while (--n >= 0) {\n\
      array = arrays[n];\n\
      m = array.length;\n\
      while (--m >= 0) {\n\
        merged[--j] = array[m];\n\
      }\n\
    }\n\
    return merged;\n\
  };\n\
  var abs = Math.abs;\n\
  d3.range = function(start, stop, step) {\n\
    if (arguments.length < 3) {\n\
      step = 1;\n\
      if (arguments.length < 2) {\n\
        stop = start;\n\
        start = 0;\n\
      }\n\
    }\n\
    if ((stop - start) / step === Infinity) throw new Error(\"infinite range\");\n\
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;\n\
    start *= k, stop *= k, step *= k;\n\
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);\n\
    return range;\n\
  };\n\
  function d3_range_integerScale(x) {\n\
    var k = 1;\n\
    while (x * k % 1) k *= 10;\n\
    return k;\n\
  }\n\
  function d3_class(ctor, properties) {\n\
    try {\n\
      for (var key in properties) {\n\
        Object.defineProperty(ctor.prototype, key, {\n\
          value: properties[key],\n\
          enumerable: false\n\
        });\n\
      }\n\
    } catch (e) {\n\
      ctor.prototype = properties;\n\
    }\n\
  }\n\
  d3.map = function(object) {\n\
    var map = new d3_Map();\n\
    if (object instanceof d3_Map) object.forEach(function(key, value) {\n\
      map.set(key, value);\n\
    }); else for (var key in object) map.set(key, object[key]);\n\
    return map;\n\
  };\n\
  function d3_Map() {}\n\
  d3_class(d3_Map, {\n\
    has: d3_map_has,\n\
    get: function(key) {\n\
      return this[d3_map_prefix + key];\n\
    },\n\
    set: function(key, value) {\n\
      return this[d3_map_prefix + key] = value;\n\
    },\n\
    remove: d3_map_remove,\n\
    keys: d3_map_keys,\n\
    values: function() {\n\
      var values = [];\n\
      this.forEach(function(key, value) {\n\
        values.push(value);\n\
      });\n\
      return values;\n\
    },\n\
    entries: function() {\n\
      var entries = [];\n\
      this.forEach(function(key, value) {\n\
        entries.push({\n\
          key: key,\n\
          value: value\n\
        });\n\
      });\n\
      return entries;\n\
    },\n\
    size: d3_map_size,\n\
    empty: d3_map_empty,\n\
    forEach: function(f) {\n\
      for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);\n\
    }\n\
  });\n\
  var d3_map_prefix = \"\\x00\", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);\n\
  function d3_map_has(key) {\n\
    return d3_map_prefix + key in this;\n\
  }\n\
  function d3_map_remove(key) {\n\
    key = d3_map_prefix + key;\n\
    return key in this && delete this[key];\n\
  }\n\
  function d3_map_keys() {\n\
    var keys = [];\n\
    this.forEach(function(key) {\n\
      keys.push(key);\n\
    });\n\
    return keys;\n\
  }\n\
  function d3_map_size() {\n\
    var size = 0;\n\
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;\n\
    return size;\n\
  }\n\
  function d3_map_empty() {\n\
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;\n\
    return true;\n\
  }\n\
  d3.nest = function() {\n\
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;\n\
    function map(mapType, array, depth) {\n\
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;\n\
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;\n\
      while (++i < n) {\n\
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {\n\
          values.push(object);\n\
        } else {\n\
          valuesByKey.set(keyValue, [ object ]);\n\
        }\n\
      }\n\
      if (mapType) {\n\
        object = mapType();\n\
        setter = function(keyValue, values) {\n\
          object.set(keyValue, map(mapType, values, depth));\n\
        };\n\
      } else {\n\
        object = {};\n\
        setter = function(keyValue, values) {\n\
          object[keyValue] = map(mapType, values, depth);\n\
        };\n\
      }\n\
      valuesByKey.forEach(setter);\n\
      return object;\n\
    }\n\
    function entries(map, depth) {\n\
      if (depth >= keys.length) return map;\n\
      var array = [], sortKey = sortKeys[depth++];\n\
      map.forEach(function(key, keyMap) {\n\
        array.push({\n\
          key: key,\n\
          values: entries(keyMap, depth)\n\
        });\n\
      });\n\
      return sortKey ? array.sort(function(a, b) {\n\
        return sortKey(a.key, b.key);\n\
      }) : array;\n\
    }\n\
    nest.map = function(array, mapType) {\n\
      return map(mapType, array, 0);\n\
    };\n\
    nest.entries = function(array) {\n\
      return entries(map(d3.map, array, 0), 0);\n\
    };\n\
    nest.key = function(d) {\n\
      keys.push(d);\n\
      return nest;\n\
    };\n\
    nest.sortKeys = function(order) {\n\
      sortKeys[keys.length - 1] = order;\n\
      return nest;\n\
    };\n\
    nest.sortValues = function(order) {\n\
      sortValues = order;\n\
      return nest;\n\
    };\n\
    nest.rollup = function(f) {\n\
      rollup = f;\n\
      return nest;\n\
    };\n\
    return nest;\n\
  };\n\
  d3.set = function(array) {\n\
    var set = new d3_Set();\n\
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);\n\
    return set;\n\
  };\n\
  function d3_Set() {}\n\
  d3_class(d3_Set, {\n\
    has: d3_map_has,\n\
    add: function(value) {\n\
      this[d3_map_prefix + value] = true;\n\
      return value;\n\
    },\n\
    remove: function(value) {\n\
      value = d3_map_prefix + value;\n\
      return value in this && delete this[value];\n\
    },\n\
    values: d3_map_keys,\n\
    size: d3_map_size,\n\
    empty: d3_map_empty,\n\
    forEach: function(f) {\n\
      for (var value in this) if (value.charCodeAt(0) === d3_map_prefixCode) f.call(this, value.substring(1));\n\
    }\n\
  });\n\
  d3.behavior = {};\n\
  d3.rebind = function(target, source) {\n\
    var i = 1, n = arguments.length, method;\n\
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);\n\
    return target;\n\
  };\n\
  function d3_rebind(target, source, method) {\n\
    return function() {\n\
      var value = method.apply(source, arguments);\n\
      return value === source ? target : value;\n\
    };\n\
  }\n\
  function d3_vendorSymbol(object, name) {\n\
    if (name in object) return name;\n\
    name = name.charAt(0).toUpperCase() + name.substring(1);\n\
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {\n\
      var prefixName = d3_vendorPrefixes[i] + name;\n\
      if (prefixName in object) return prefixName;\n\
    }\n\
  }\n\
  var d3_vendorPrefixes = [ \"webkit\", \"ms\", \"moz\", \"Moz\", \"o\", \"O\" ];\n\
  function d3_noop() {}\n\
  d3.dispatch = function() {\n\
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    return dispatch;\n\
  };\n\
  function d3_dispatch() {}\n\
  d3_dispatch.prototype.on = function(type, listener) {\n\
    var i = type.indexOf(\".\"), name = \"\";\n\
    if (i >= 0) {\n\
      name = type.substring(i + 1);\n\
      type = type.substring(0, i);\n\
    }\n\
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);\n\
    if (arguments.length === 2) {\n\
      if (listener == null) for (type in this) {\n\
        if (this.hasOwnProperty(type)) this[type].on(name, null);\n\
      }\n\
      return this;\n\
    }\n\
  };\n\
  function d3_dispatch_event(dispatch) {\n\
    var listeners = [], listenerByName = new d3_Map();\n\
    function event() {\n\
      var z = listeners, i = -1, n = z.length, l;\n\
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);\n\
      return dispatch;\n\
    }\n\
    event.on = function(name, listener) {\n\
      var l = listenerByName.get(name), i;\n\
      if (arguments.length < 2) return l && l.on;\n\
      if (l) {\n\
        l.on = null;\n\
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));\n\
        listenerByName.remove(name);\n\
      }\n\
      if (listener) listeners.push(listenerByName.set(name, {\n\
        on: listener\n\
      }));\n\
      return dispatch;\n\
    };\n\
    return event;\n\
  }\n\
  d3.event = null;\n\
  function d3_eventPreventDefault() {\n\
    d3.event.preventDefault();\n\
  }\n\
  function d3_eventSource() {\n\
    var e = d3.event, s;\n\
    while (s = e.sourceEvent) e = s;\n\
    return e;\n\
  }\n\
  function d3_eventDispatch(target) {\n\
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    dispatch.of = function(thiz, argumentz) {\n\
      return function(e1) {\n\
        try {\n\
          var e0 = e1.sourceEvent = d3.event;\n\
          e1.target = target;\n\
          d3.event = e1;\n\
          dispatch[e1.type].apply(thiz, argumentz);\n\
        } finally {\n\
          d3.event = e0;\n\
        }\n\
      };\n\
    };\n\
    return dispatch;\n\
  }\n\
  d3.requote = function(s) {\n\
    return s.replace(d3_requote_re, \"\\\\$&\");\n\
  };\n\
  var d3_requote_re = /[\\\\\\^\\$\\*\\+\\?\\|\\[\\]\\(\\)\\.\\{\\}]/g;\n\
  var d3_subclass = {}.__proto__ ? function(object, prototype) {\n\
    object.__proto__ = prototype;\n\
  } : function(object, prototype) {\n\
    for (var property in prototype) object[property] = prototype[property];\n\
  };\n\
  function d3_selection(groups) {\n\
    d3_subclass(groups, d3_selectionPrototype);\n\
    return groups;\n\
  }\n\
  var d3_select = function(s, n) {\n\
    return n.querySelector(s);\n\
  }, d3_selectAll = function(s, n) {\n\
    return n.querySelectorAll(s);\n\
  }, d3_selectMatcher = d3_documentElement.matches || d3_documentElement[d3_vendorSymbol(d3_documentElement, \"matchesSelector\")], d3_selectMatches = function(n, s) {\n\
    return d3_selectMatcher.call(n, s);\n\
  };\n\
  if (typeof Sizzle === \"function\") {\n\
    d3_select = function(s, n) {\n\
      return Sizzle(s, n)[0] || null;\n\
    };\n\
    d3_selectAll = Sizzle;\n\
    d3_selectMatches = Sizzle.matchesSelector;\n\
  }\n\
  d3.selection = function() {\n\
    return d3_selectionRoot;\n\
  };\n\
  var d3_selectionPrototype = d3.selection.prototype = [];\n\
  d3_selectionPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, group, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));\n\
          if (subnode && \"__data__\" in node) subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selector(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_select(selector, this);\n\
    };\n\
  }\n\
  d3_selectionPrototype.selectAll = function(selector) {\n\
    var subgroups = [], subgroup, node;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));\n\
          subgroup.parentNode = node;\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selectorAll(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_selectAll(selector, this);\n\
    };\n\
  }\n\
  var d3_nsPrefix = {\n\
    svg: \"http://www.w3.org/2000/svg\",\n\
    xhtml: \"http://www.w3.org/1999/xhtml\",\n\
    xlink: \"http://www.w3.org/1999/xlink\",\n\
    xml: \"http://www.w3.org/XML/1998/namespace\",\n\
    xmlns: \"http://www.w3.org/2000/xmlns/\"\n\
  };\n\
  d3.ns = {\n\
    prefix: d3_nsPrefix,\n\
    qualify: function(name) {\n\
      var i = name.indexOf(\":\"), prefix = name;\n\
      if (i >= 0) {\n\
        prefix = name.substring(0, i);\n\
        name = name.substring(i + 1);\n\
      }\n\
      return d3_nsPrefix.hasOwnProperty(prefix) ? {\n\
        space: d3_nsPrefix[prefix],\n\
        local: name\n\
      } : name;\n\
    }\n\
  };\n\
  d3_selectionPrototype.attr = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node();\n\
        name = d3.ns.qualify(name);\n\
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);\n\
      }\n\
      for (value in name) this.each(d3_selection_attr(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_attr(name, value));\n\
  };\n\
  function d3_selection_attr(name, value) {\n\
    name = d3.ns.qualify(name);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrConstant() {\n\
      this.setAttribute(name, value);\n\
    }\n\
    function attrConstantNS() {\n\
      this.setAttributeNS(name.space, name.local, value);\n\
    }\n\
    function attrFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);\n\
    }\n\
    function attrFunctionNS() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);\n\
    }\n\
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === \"function\" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;\n\
  }\n\
  function d3_collapse(s) {\n\
    return s.trim().replace(/\\s+/g, \" \");\n\
  }\n\
  d3_selectionPrototype.classed = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;\n\
        if (value = node.classList) {\n\
          while (++i < n) if (!value.contains(name[i])) return false;\n\
        } else {\n\
          value = node.getAttribute(\"class\");\n\
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;\n\
        }\n\
        return true;\n\
      }\n\
      for (value in name) this.each(d3_selection_classed(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_classed(name, value));\n\
  };\n\
  function d3_selection_classedRe(name) {\n\
    return new RegExp(\"(?:^|\\\\s+)\" + d3.requote(name) + \"(?:\\\\s+|$)\", \"g\");\n\
  }\n\
  function d3_selection_classes(name) {\n\
    return (name + \"\").trim().split(/^|\\s+/);\n\
  }\n\
  function d3_selection_classed(name, value) {\n\
    name = d3_selection_classes(name).map(d3_selection_classedName);\n\
    var n = name.length;\n\
    function classedConstant() {\n\
      var i = -1;\n\
      while (++i < n) name[i](this, value);\n\
    }\n\
    function classedFunction() {\n\
      var i = -1, x = value.apply(this, arguments);\n\
      while (++i < n) name[i](this, x);\n\
    }\n\
    return typeof value === \"function\" ? classedFunction : classedConstant;\n\
  }\n\
  function d3_selection_classedName(name) {\n\
    var re = d3_selection_classedRe(name);\n\
    return function(node, value) {\n\
      if (c = node.classList) return value ? c.add(name) : c.remove(name);\n\
      var c = node.getAttribute(\"class\") || \"\";\n\
      if (value) {\n\
        re.lastIndex = 0;\n\
        if (!re.test(c)) node.setAttribute(\"class\", d3_collapse(c + \" \" + name));\n\
      } else {\n\
        node.setAttribute(\"class\", d3_collapse(c.replace(re, \" \")));\n\
      }\n\
    };\n\
  }\n\
  d3_selectionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));\n\
        return this;\n\
      }\n\
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);\n\
      priority = \"\";\n\
    }\n\
    return this.each(d3_selection_style(name, value, priority));\n\
  };\n\
  function d3_selection_style(name, value, priority) {\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleConstant() {\n\
      this.style.setProperty(name, value, priority);\n\
    }\n\
    function styleFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);\n\
    }\n\
    return value == null ? styleNull : typeof value === \"function\" ? styleFunction : styleConstant;\n\
  }\n\
  d3_selectionPrototype.property = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") return this.node()[name];\n\
      for (value in name) this.each(d3_selection_property(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_property(name, value));\n\
  };\n\
  function d3_selection_property(name, value) {\n\
    function propertyNull() {\n\
      delete this[name];\n\
    }\n\
    function propertyConstant() {\n\
      this[name] = value;\n\
    }\n\
    function propertyFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) delete this[name]; else this[name] = x;\n\
    }\n\
    return value == null ? propertyNull : typeof value === \"function\" ? propertyFunction : propertyConstant;\n\
  }\n\
  d3_selectionPrototype.text = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.textContent = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.textContent = \"\";\n\
    } : function() {\n\
      this.textContent = value;\n\
    }) : this.node().textContent;\n\
  };\n\
  d3_selectionPrototype.html = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.innerHTML = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.innerHTML = \"\";\n\
    } : function() {\n\
      this.innerHTML = value;\n\
    }) : this.node().innerHTML;\n\
  };\n\
  d3_selectionPrototype.append = function(name) {\n\
    name = d3_selection_creator(name);\n\
    return this.select(function() {\n\
      return this.appendChild(name.apply(this, arguments));\n\
    });\n\
  };\n\
  function d3_selection_creator(name) {\n\
    return typeof name === \"function\" ? name : (name = d3.ns.qualify(name)).local ? function() {\n\
      return this.ownerDocument.createElementNS(name.space, name.local);\n\
    } : function() {\n\
      return this.ownerDocument.createElementNS(this.namespaceURI, name);\n\
    };\n\
  }\n\
  d3_selectionPrototype.insert = function(name, before) {\n\
    name = d3_selection_creator(name);\n\
    before = d3_selection_selector(before);\n\
    return this.select(function() {\n\
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);\n\
    });\n\
  };\n\
  d3_selectionPrototype.remove = function() {\n\
    return this.each(function() {\n\
      var parent = this.parentNode;\n\
      if (parent) parent.removeChild(this);\n\
    });\n\
  };\n\
  d3_selectionPrototype.data = function(value, key) {\n\
    var i = -1, n = this.length, group, node;\n\
    if (!arguments.length) {\n\
      value = new Array(n = (group = this[0]).length);\n\
      while (++i < n) {\n\
        if (node = group[i]) {\n\
          value[i] = node.__data__;\n\
        }\n\
      }\n\
      return value;\n\
    }\n\
    function bind(group, groupData) {\n\
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;\n\
      if (key) {\n\
        var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;\n\
        for (i = -1; ++i < n; ) {\n\
          keyValue = key.call(node = group[i], node.__data__, i);\n\
          if (nodeByKeyValue.has(keyValue)) {\n\
            exitNodes[i] = node;\n\
          } else {\n\
            nodeByKeyValue.set(keyValue, node);\n\
          }\n\
          keyValues.push(keyValue);\n\
        }\n\
        for (i = -1; ++i < m; ) {\n\
          keyValue = key.call(groupData, nodeData = groupData[i], i);\n\
          if (node = nodeByKeyValue.get(keyValue)) {\n\
            updateNodes[i] = node;\n\
            node.__data__ = nodeData;\n\
          } else if (!dataByKeyValue.has(keyValue)) {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
          dataByKeyValue.set(keyValue, nodeData);\n\
          nodeByKeyValue.remove(keyValue);\n\
        }\n\
        for (i = -1; ++i < n; ) {\n\
          if (nodeByKeyValue.has(keyValues[i])) {\n\
            exitNodes[i] = group[i];\n\
          }\n\
        }\n\
      } else {\n\
        for (i = -1; ++i < n0; ) {\n\
          node = group[i];\n\
          nodeData = groupData[i];\n\
          if (node) {\n\
            node.__data__ = nodeData;\n\
            updateNodes[i] = node;\n\
          } else {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
        }\n\
        for (;i < m; ++i) {\n\
          enterNodes[i] = d3_selection_dataNode(groupData[i]);\n\
        }\n\
        for (;i < n; ++i) {\n\
          exitNodes[i] = group[i];\n\
        }\n\
      }\n\
      enterNodes.update = updateNodes;\n\
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;\n\
      enter.push(enterNodes);\n\
      update.push(updateNodes);\n\
      exit.push(exitNodes);\n\
    }\n\
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);\n\
    if (typeof value === \"function\") {\n\
      while (++i < n) {\n\
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));\n\
      }\n\
    } else {\n\
      while (++i < n) {\n\
        bind(group = this[i], value);\n\
      }\n\
    }\n\
    update.enter = function() {\n\
      return enter;\n\
    };\n\
    update.exit = function() {\n\
      return exit;\n\
    };\n\
    return update;\n\
  };\n\
  function d3_selection_dataNode(data) {\n\
    return {\n\
      __data__: data\n\
    };\n\
  }\n\
  d3_selectionPrototype.datum = function(value) {\n\
    return arguments.length ? this.property(\"__data__\", value) : this.property(\"__data__\");\n\
  };\n\
  d3_selectionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_filter(selector) {\n\
    return function() {\n\
      return d3_selectMatches(this, selector);\n\
    };\n\
  }\n\
  d3_selectionPrototype.order = function() {\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {\n\
        if (node = group[i]) {\n\
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);\n\
          next = node;\n\
        }\n\
      }\n\
    }\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.sort = function(comparator) {\n\
    comparator = d3_selection_sortComparator.apply(this, arguments);\n\
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);\n\
    return this.order();\n\
  };\n\
  function d3_selection_sortComparator(comparator) {\n\
    if (!arguments.length) comparator = d3_ascending;\n\
    return function(a, b) {\n\
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;\n\
    };\n\
  }\n\
  d3_selectionPrototype.each = function(callback) {\n\
    return d3_selection_each(this, function(node, i, j) {\n\
      callback.call(node, node.__data__, i, j);\n\
    });\n\
  };\n\
  function d3_selection_each(groups, callback) {\n\
    for (var j = 0, m = groups.length; j < m; j++) {\n\
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {\n\
        if (node = group[i]) callback(node, i, j);\n\
      }\n\
    }\n\
    return groups;\n\
  }\n\
  d3_selectionPrototype.call = function(callback) {\n\
    var args = d3_array(arguments);\n\
    callback.apply(args[0] = this, args);\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.empty = function() {\n\
    return !this.node();\n\
  };\n\
  d3_selectionPrototype.node = function() {\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        var node = group[i];\n\
        if (node) return node;\n\
      }\n\
    }\n\
    return null;\n\
  };\n\
  d3_selectionPrototype.size = function() {\n\
    var n = 0;\n\
    this.each(function() {\n\
      ++n;\n\
    });\n\
    return n;\n\
  };\n\
  function d3_selection_enter(selection) {\n\
    d3_subclass(selection, d3_selection_enterPrototype);\n\
    return selection;\n\
  }\n\
  var d3_selection_enterPrototype = [];\n\
  d3.selection.enter = d3_selection_enter;\n\
  d3.selection.enter.prototype = d3_selection_enterPrototype;\n\
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;\n\
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;\n\
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;\n\
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;\n\
  d3_selection_enterPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, upgroup, group, node;\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      upgroup = (group = this[j]).update;\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = group.parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));\n\
          subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  d3_selection_enterPrototype.insert = function(name, before) {\n\
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);\n\
    return d3_selectionPrototype.insert.call(this, name, before);\n\
  };\n\
  function d3_selection_enterInsertBefore(enter) {\n\
    var i0, j0;\n\
    return function(d, i, j) {\n\
      var group = enter[j].update, n = group.length, node;\n\
      if (j != j0) j0 = j, i0 = 0;\n\
      if (i >= i0) i0 = i + 1;\n\
      while (!(node = group[i0]) && ++i0 < n) ;\n\
      return node;\n\
    };\n\
  }\n\
  d3_selectionPrototype.transition = function() {\n\
    var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {\n\
      time: Date.now(),\n\
      ease: d3_ease_cubicInOut,\n\
      delay: 0,\n\
      duration: 250\n\
    };\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) d3_transitionNode(node, i, id, transition);\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_selectionPrototype.interrupt = function() {\n\
    return this.each(d3_selection_interrupt);\n\
  };\n\
  function d3_selection_interrupt() {\n\
    var lock = this.__transition__;\n\
    if (lock) ++lock.active;\n\
  }\n\
  d3.select = function(node) {\n\
    var group = [ typeof node === \"string\" ? d3_select(node, d3_document) : node ];\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  d3.selectAll = function(nodes) {\n\
    var group = d3_array(typeof nodes === \"string\" ? d3_selectAll(nodes, d3_document) : nodes);\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  var d3_selectionRoot = d3.select(d3_documentElement);\n\
  d3_selectionPrototype.on = function(type, listener, capture) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof type !== \"string\") {\n\
        if (n < 2) listener = false;\n\
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));\n\
        return this;\n\
      }\n\
      if (n < 2) return (n = this.node()[\"__on\" + type]) && n._;\n\
      capture = false;\n\
    }\n\
    return this.each(d3_selection_on(type, listener, capture));\n\
  };\n\
  function d3_selection_on(type, listener, capture) {\n\
    var name = \"__on\" + type, i = type.indexOf(\".\"), wrap = d3_selection_onListener;\n\
    if (i > 0) type = type.substring(0, i);\n\
    var filter = d3_selection_onFilters.get(type);\n\
    if (filter) type = filter, wrap = d3_selection_onFilter;\n\
    function onRemove() {\n\
      var l = this[name];\n\
      if (l) {\n\
        this.removeEventListener(type, l, l.$);\n\
        delete this[name];\n\
      }\n\
    }\n\
    function onAdd() {\n\
      var l = wrap(listener, d3_array(arguments));\n\
      onRemove.call(this);\n\
      this.addEventListener(type, this[name] = l, l.$ = capture);\n\
      l._ = listener;\n\
    }\n\
    function removeAll() {\n\
      var re = new RegExp(\"^__on([^.]+)\" + d3.requote(type) + \"$\"), match;\n\
      for (var name in this) {\n\
        if (match = name.match(re)) {\n\
          var l = this[name];\n\
          this.removeEventListener(match[1], l, l.$);\n\
          delete this[name];\n\
        }\n\
      }\n\
    }\n\
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;\n\
  }\n\
  var d3_selection_onFilters = d3.map({\n\
    mouseenter: \"mouseover\",\n\
    mouseleave: \"mouseout\"\n\
  });\n\
  d3_selection_onFilters.forEach(function(k) {\n\
    if (\"on\" + k in d3_document) d3_selection_onFilters.remove(k);\n\
  });\n\
  function d3_selection_onListener(listener, argumentz) {\n\
    return function(e) {\n\
      var o = d3.event;\n\
      d3.event = e;\n\
      argumentz[0] = this.__data__;\n\
      try {\n\
        listener.apply(this, argumentz);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
  }\n\
  function d3_selection_onFilter(listener, argumentz) {\n\
    var l = d3_selection_onListener(listener, argumentz);\n\
    return function(e) {\n\
      var target = this, related = e.relatedTarget;\n\
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {\n\
        l.call(target, e);\n\
      }\n\
    };\n\
  }\n\
  var d3_event_dragSelect = \"onselectstart\" in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, \"userSelect\"), d3_event_dragId = 0;\n\
  function d3_event_dragSuppress() {\n\
    var name = \".dragsuppress-\" + ++d3_event_dragId, click = \"click\" + name, w = d3.select(d3_window).on(\"touchmove\" + name, d3_eventPreventDefault).on(\"dragstart\" + name, d3_eventPreventDefault).on(\"selectstart\" + name, d3_eventPreventDefault);\n\
    if (d3_event_dragSelect) {\n\
      var style = d3_documentElement.style, select = style[d3_event_dragSelect];\n\
      style[d3_event_dragSelect] = \"none\";\n\
    }\n\
    return function(suppressClick) {\n\
      w.on(name, null);\n\
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;\n\
      if (suppressClick) {\n\
        function off() {\n\
          w.on(click, null);\n\
        }\n\
        w.on(click, function() {\n\
          d3_eventPreventDefault();\n\
          off();\n\
        }, true);\n\
        setTimeout(off, 0);\n\
      }\n\
    };\n\
  }\n\
  d3.mouse = function(container) {\n\
    return d3_mousePoint(container, d3_eventSource());\n\
  };\n\
  var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;\n\
  function d3_mousePoint(container, e) {\n\
    if (e.changedTouches) e = e.changedTouches[0];\n\
    var svg = container.ownerSVGElement || container;\n\
    if (svg.createSVGPoint) {\n\
      var point = svg.createSVGPoint();\n\
      if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {\n\
        svg = d3.select(\"body\").append(\"svg\").style({\n\
          position: \"absolute\",\n\
          top: 0,\n\
          left: 0,\n\
          margin: 0,\n\
          padding: 0,\n\
          border: \"none\"\n\
        }, \"important\");\n\
        var ctm = svg[0][0].getScreenCTM();\n\
        d3_mouse_bug44083 = !(ctm.f || ctm.e);\n\
        svg.remove();\n\
      }\n\
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, \n\
      point.y = e.clientY;\n\
      point = point.matrixTransform(container.getScreenCTM().inverse());\n\
      return [ point.x, point.y ];\n\
    }\n\
    var rect = container.getBoundingClientRect();\n\
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];\n\
  }\n\
  d3.touches = function(container, touches) {\n\
    if (arguments.length < 2) touches = d3_eventSource().touches;\n\
    return touches ? d3_array(touches).map(function(touch) {\n\
      var point = d3_mousePoint(container, touch);\n\
      point.identifier = touch.identifier;\n\
      return point;\n\
    }) : [];\n\
  };\n\
  d3.behavior.drag = function() {\n\
    var event = d3_eventDispatch(drag, \"drag\", \"dragstart\", \"dragend\"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_behavior_dragMouseSubject, \"mousemove\", \"mouseup\"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_behavior_dragTouchSubject, \"touchmove\", \"touchend\");\n\
    function drag() {\n\
      this.on(\"mousedown.drag\", mousedown).on(\"touchstart.drag\", touchstart);\n\
    }\n\
    function dragstart(id, position, subject, move, end) {\n\
      return function() {\n\
        var that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = \".drag\" + (dragId == null ? \"\" : \"-\" + dragId), dragOffset, dragSubject = d3.select(subject()).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(), position0 = position(parent, dragId);\n\
        if (origin) {\n\
          dragOffset = origin.apply(that, arguments);\n\
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];\n\
        } else {\n\
          dragOffset = [ 0, 0 ];\n\
        }\n\
        dispatch({\n\
          type: \"dragstart\"\n\
        });\n\
        function moved() {\n\
          var position1 = position(parent, dragId), dx, dy;\n\
          if (!position1) return;\n\
          dx = position1[0] - position0[0];\n\
          dy = position1[1] - position0[1];\n\
          dragged |= dx | dy;\n\
          position0 = position1;\n\
          dispatch({\n\
            type: \"drag\",\n\
            x: position1[0] + dragOffset[0],\n\
            y: position1[1] + dragOffset[1],\n\
            dx: dx,\n\
            dy: dy\n\
          });\n\
        }\n\
        function ended() {\n\
          if (!position(parent, dragId)) return;\n\
          dragSubject.on(move + dragName, null).on(end + dragName, null);\n\
          dragRestore(dragged && d3.event.target === target);\n\
          dispatch({\n\
            type: \"dragend\"\n\
          });\n\
        }\n\
      };\n\
    }\n\
    drag.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return drag;\n\
    };\n\
    return d3.rebind(drag, event, \"on\");\n\
  };\n\
  function d3_behavior_dragTouchId() {\n\
    return d3.event.changedTouches[0].identifier;\n\
  }\n\
  function d3_behavior_dragTouchSubject() {\n\
    return d3.event.target;\n\
  }\n\
  function d3_behavior_dragMouseSubject() {\n\
    return d3_window;\n\
  }\n\
  var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;\n\
  function d3_sgn(x) {\n\
    return x > 0 ? 1 : x < 0 ? -1 : 0;\n\
  }\n\
  function d3_cross2d(a, b, c) {\n\
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);\n\
  }\n\
  function d3_acos(x) {\n\
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);\n\
  }\n\
  function d3_asin(x) {\n\
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);\n\
  }\n\
  function d3_sinh(x) {\n\
    return ((x = Math.exp(x)) - 1 / x) / 2;\n\
  }\n\
  function d3_cosh(x) {\n\
    return ((x = Math.exp(x)) + 1 / x) / 2;\n\
  }\n\
  function d3_tanh(x) {\n\
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);\n\
  }\n\
  function d3_haversin(x) {\n\
    return (x = Math.sin(x / 2)) * x;\n\
  }\n\
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;\n\
  d3.interpolateZoom = function(p0, p1) {\n\
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];\n\
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;\n\
    function interpolate(t) {\n\
      var s = t * S;\n\
      if (dr) {\n\
        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));\n\
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];\n\
      }\n\
      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];\n\
    }\n\
    interpolate.duration = S * 1e3;\n\
    return interpolate;\n\
  };\n\
  d3.behavior.zoom = function() {\n\
    var view = {\n\
      x: 0,\n\
      y: 0,\n\
      k: 1\n\
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, mousedown = \"mousedown.zoom\", mousemove = \"mousemove.zoom\", mouseup = \"mouseup.zoom\", mousewheelTimer, touchstart = \"touchstart.zoom\", touchtime, event = d3_eventDispatch(zoom, \"zoomstart\", \"zoom\", \"zoomend\"), x0, x1, y0, y1;\n\
    function zoom(g) {\n\
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + \".zoom\", mousewheeled).on(\"dblclick.zoom\", dblclicked).on(touchstart, touchstarted);\n\
    }\n\
    zoom.event = function(g) {\n\
      g.each(function() {\n\
        var dispatch = event.of(this, arguments), view1 = view;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.zoom\", function() {\n\
            view = this.__chart__ || {\n\
              x: 0,\n\
              y: 0,\n\
              k: 1\n\
            };\n\
            zoomstarted(dispatch);\n\
          }).tween(\"zoom:zoom\", function() {\n\
            var dx = size[0], dy = size[1], cx = dx / 2, cy = dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);\n\
            return function(t) {\n\
              var l = i(t), k = dx / l[2];\n\
              this.__chart__ = view = {\n\
                x: cx - l[0] * k,\n\
                y: cy - l[1] * k,\n\
                k: k\n\
              };\n\
              zoomed(dispatch);\n\
            };\n\
          }).each(\"end.zoom\", function() {\n\
            zoomended(dispatch);\n\
          });\n\
        } else {\n\
          this.__chart__ = view;\n\
          zoomstarted(dispatch);\n\
          zoomed(dispatch);\n\
          zoomended(dispatch);\n\
        }\n\
      });\n\
    };\n\
    zoom.translate = function(_) {\n\
      if (!arguments.length) return [ view.x, view.y ];\n\
      view = {\n\
        x: +_[0],\n\
        y: +_[1],\n\
        k: view.k\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scale = function(_) {\n\
      if (!arguments.length) return view.k;\n\
      view = {\n\
        x: view.x,\n\
        y: view.y,\n\
        k: +_\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scaleExtent = function(_) {\n\
      if (!arguments.length) return scaleExtent;\n\
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.center = function(_) {\n\
      if (!arguments.length) return center;\n\
      center = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.x = function(z) {\n\
      if (!arguments.length) return x1;\n\
      x1 = z;\n\
      x0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    zoom.y = function(z) {\n\
      if (!arguments.length) return y1;\n\
      y1 = z;\n\
      y0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    function location(p) {\n\
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];\n\
    }\n\
    function point(l) {\n\
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];\n\
    }\n\
    function scaleTo(s) {\n\
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));\n\
    }\n\
    function translateTo(p, l) {\n\
      l = point(l);\n\
      view.x += p[0] - l[0];\n\
      view.y += p[1] - l[1];\n\
    }\n\
    function rescale() {\n\
      if (x1) x1.domain(x0.range().map(function(x) {\n\
        return (x - view.x) / view.k;\n\
      }).map(x0.invert));\n\
      if (y1) y1.domain(y0.range().map(function(y) {\n\
        return (y - view.y) / view.k;\n\
      }).map(y0.invert));\n\
    }\n\
    function zoomstarted(dispatch) {\n\
      dispatch({\n\
        type: \"zoomstart\"\n\
      });\n\
    }\n\
    function zoomed(dispatch) {\n\
      rescale();\n\
      dispatch({\n\
        type: \"zoom\",\n\
        scale: view.k,\n\
        translate: [ view.x, view.y ]\n\
      });\n\
    }\n\
    function zoomended(dispatch) {\n\
      dispatch({\n\
        type: \"zoomend\"\n\
      });\n\
    }\n\
    function mousedowned() {\n\
      var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(that);\n\
      zoomstarted(dispatch);\n\
      function moved() {\n\
        dragged = 1;\n\
        translateTo(d3.mouse(that), location0);\n\
        zoomed(dispatch);\n\
      }\n\
      function ended() {\n\
        subject.on(mousemove, null).on(mouseup, null);\n\
        dragRestore(dragged && d3.event.target === target);\n\
        zoomended(dispatch);\n\
      }\n\
    }\n\
    function touchstarted() {\n\
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = \".zoom-\" + d3.event.changedTouches[0].identifier, touchmove = \"touchmove\" + zoomName, touchend = \"touchend\" + zoomName, targets = [], subject = d3.select(that).on(mousedown, null).on(touchstart, started), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(that);\n\
      started();\n\
      zoomstarted(dispatch);\n\
      function relocate() {\n\
        var touches = d3.touches(that);\n\
        scale0 = view.k;\n\
        touches.forEach(function(t) {\n\
          if (t.identifier in locations0) locations0[t.identifier] = location(t);\n\
        });\n\
        return touches;\n\
      }\n\
      function started() {\n\
        var target = d3.event.target;\n\
        d3.select(target).on(touchmove, moved).on(touchend, ended);\n\
        targets.push(target);\n\
        var changed = d3.event.changedTouches;\n\
        for (var i = 0, n = changed.length; i < n; ++i) {\n\
          locations0[changed[i].identifier] = null;\n\
        }\n\
        var touches = relocate(), now = Date.now();\n\
        if (touches.length === 1) {\n\
          if (now - touchtime < 500) {\n\
            var p = touches[0], l = locations0[p.identifier];\n\
            scaleTo(view.k * 2);\n\
            translateTo(p, l);\n\
            d3_eventPreventDefault();\n\
            zoomed(dispatch);\n\
          }\n\
          touchtime = now;\n\
        } else if (touches.length > 1) {\n\
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];\n\
          distance0 = dx * dx + dy * dy;\n\
        }\n\
      }\n\
      function moved() {\n\
        var touches = d3.touches(that), p0, l0, p1, l1;\n\
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {\n\
          p1 = touches[i];\n\
          if (l1 = locations0[p1.identifier]) {\n\
            if (l0) break;\n\
            p0 = p1, l0 = l1;\n\
          }\n\
        }\n\
        if (l1) {\n\
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);\n\
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];\n\
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];\n\
          scaleTo(scale1 * scale0);\n\
        }\n\
        touchtime = null;\n\
        translateTo(p0, l0);\n\
        zoomed(dispatch);\n\
      }\n\
      function ended() {\n\
        if (d3.event.touches.length) {\n\
          var changed = d3.event.changedTouches;\n\
          for (var i = 0, n = changed.length; i < n; ++i) {\n\
            delete locations0[changed[i].identifier];\n\
          }\n\
          for (var identifier in locations0) {\n\
            return void relocate();\n\
          }\n\
        }\n\
        d3.selectAll(targets).on(zoomName, null);\n\
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);\n\
        dragRestore();\n\
        zoomended(dispatch);\n\
      }\n\
    }\n\
    function mousewheeled() {\n\
      var dispatch = event.of(this, arguments);\n\
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else translate0 = location(center0 = center || d3.mouse(this)), \n\
      d3_selection_interrupt.call(this), zoomstarted(dispatch);\n\
      mousewheelTimer = setTimeout(function() {\n\
        mousewheelTimer = null;\n\
        zoomended(dispatch);\n\
      }, 50);\n\
      d3_eventPreventDefault();\n\
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);\n\
      translateTo(center0, translate0);\n\
      zoomed(dispatch);\n\
    }\n\
    function dblclicked() {\n\
      var dispatch = event.of(this, arguments), p = d3.mouse(this), l = location(p), k = Math.log(view.k) / Math.LN2;\n\
      zoomstarted(dispatch);\n\
      scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));\n\
      translateTo(p, l);\n\
      zoomed(dispatch);\n\
      zoomended(dispatch);\n\
    }\n\
    return d3.rebind(zoom, event, \"on\");\n\
  };\n\
  var d3_behavior_zoomInfinity = [ 0, Infinity ];\n\
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = \"onwheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);\n\
  }, \"wheel\") : \"onmousewheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return d3.event.wheelDelta;\n\
  }, \"mousewheel\") : (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.detail;\n\
  }, \"MozMousePixelScroll\");\n\
  d3.color = d3_color;\n\
  function d3_color() {}\n\
  d3_color.prototype.toString = function() {\n\
    return this.rgb() + \"\";\n\
  };\n\
  d3.hsl = d3_hsl;\n\
  function d3_hsl(h, s, l) {\n\
    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse(\"\" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);\n\
  }\n\
  var d3_hslPrototype = d3_hsl.prototype = new d3_color();\n\
  d3_hslPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return new d3_hsl(this.h, this.s, this.l / k);\n\
  };\n\
  d3_hslPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return new d3_hsl(this.h, this.s, k * this.l);\n\
  };\n\
  d3_hslPrototype.rgb = function() {\n\
    return d3_hsl_rgb(this.h, this.s, this.l);\n\
  };\n\
  function d3_hsl_rgb(h, s, l) {\n\
    var m1, m2;\n\
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;\n\
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;\n\
    l = l < 0 ? 0 : l > 1 ? 1 : l;\n\
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;\n\
    m1 = 2 * l - m2;\n\
    function v(h) {\n\
      if (h > 360) h -= 360; else if (h < 0) h += 360;\n\
      if (h < 60) return m1 + (m2 - m1) * h / 60;\n\
      if (h < 180) return m2;\n\
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;\n\
      return m1;\n\
    }\n\
    function vv(h) {\n\
      return Math.round(v(h) * 255);\n\
    }\n\
    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));\n\
  }\n\
  d3.hcl = d3_hcl;\n\
  function d3_hcl(h, c, l) {\n\
    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);\n\
  }\n\
  var d3_hclPrototype = d3_hcl.prototype = new d3_color();\n\
  d3_hclPrototype.brighter = function(k) {\n\
    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.darker = function(k) {\n\
    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.rgb = function() {\n\
    return d3_hcl_lab(this.h, this.c, this.l).rgb();\n\
  };\n\
  function d3_hcl_lab(h, c, l) {\n\
    if (isNaN(h)) h = 0;\n\
    if (isNaN(c)) c = 0;\n\
    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);\n\
  }\n\
  d3.lab = d3_lab;\n\
  function d3_lab(l, a, b) {\n\
    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);\n\
  }\n\
  var d3_lab_K = 18;\n\
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;\n\
  var d3_labPrototype = d3_lab.prototype = new d3_color();\n\
  d3_labPrototype.brighter = function(k) {\n\
    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.darker = function(k) {\n\
    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.rgb = function() {\n\
    return d3_lab_rgb(this.l, this.a, this.b);\n\
  };\n\
  function d3_lab_rgb(l, a, b) {\n\
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;\n\
    x = d3_lab_xyz(x) * d3_lab_X;\n\
    y = d3_lab_xyz(y) * d3_lab_Y;\n\
    z = d3_lab_xyz(z) * d3_lab_Z;\n\
    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));\n\
  }\n\
  function d3_lab_hcl(l, a, b) {\n\
    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);\n\
  }\n\
  function d3_lab_xyz(x) {\n\
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;\n\
  }\n\
  function d3_xyz_lab(x) {\n\
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;\n\
  }\n\
  function d3_xyz_rgb(r) {\n\
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));\n\
  }\n\
  d3.rgb = d3_rgb;\n\
  function d3_rgb(r, g, b) {\n\
    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse(\"\" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);\n\
  }\n\
  function d3_rgbNumber(value) {\n\
    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);\n\
  }\n\
  function d3_rgbString(value) {\n\
    return d3_rgbNumber(value) + \"\";\n\
  }\n\
  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();\n\
  d3_rgbPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    var r = this.r, g = this.g, b = this.b, i = 30;\n\
    if (!r && !g && !b) return new d3_rgb(i, i, i);\n\
    if (r && r < i) r = i;\n\
    if (g && g < i) g = i;\n\
    if (b && b < i) b = i;\n\
    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));\n\
  };\n\
  d3_rgbPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return new d3_rgb(k * this.r, k * this.g, k * this.b);\n\
  };\n\
  d3_rgbPrototype.hsl = function() {\n\
    return d3_rgb_hsl(this.r, this.g, this.b);\n\
  };\n\
  d3_rgbPrototype.toString = function() {\n\
    return \"#\" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);\n\
  };\n\
  function d3_rgb_hex(v) {\n\
    return v < 16 ? \"0\" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);\n\
  }\n\
  function d3_rgb_parse(format, rgb, hsl) {\n\
    var r = 0, g = 0, b = 0, m1, m2, color;\n\
    m1 = /([a-z]+)\\((.*)\\)/i.exec(format);\n\
    if (m1) {\n\
      m2 = m1[2].split(\",\");\n\
      switch (m1[1]) {\n\
       case \"hsl\":\n\
        {\n\
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);\n\
        }\n\
\n\
       case \"rgb\":\n\
        {\n\
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));\n\
        }\n\
      }\n\
    }\n\
    if (color = d3_rgb_names.get(format)) return rgb(color.r, color.g, color.b);\n\
    if (format != null && format.charAt(0) === \"#\" && !isNaN(color = parseInt(format.substring(1), 16))) {\n\
      if (format.length === 4) {\n\
        r = (color & 3840) >> 4;\n\
        r = r >> 4 | r;\n\
        g = color & 240;\n\
        g = g >> 4 | g;\n\
        b = color & 15;\n\
        b = b << 4 | b;\n\
      } else if (format.length === 7) {\n\
        r = (color & 16711680) >> 16;\n\
        g = (color & 65280) >> 8;\n\
        b = color & 255;\n\
      }\n\
    }\n\
    return rgb(r, g, b);\n\
  }\n\
  function d3_rgb_hsl(r, g, b) {\n\
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;\n\
    if (d) {\n\
      s = l < .5 ? d / (max + min) : d / (2 - max - min);\n\
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;\n\
      h *= 60;\n\
    } else {\n\
      h = NaN;\n\
      s = l > 0 && l < 1 ? 0 : h;\n\
    }\n\
    return new d3_hsl(h, s, l);\n\
  }\n\
  function d3_rgb_lab(r, g, b) {\n\
    r = d3_rgb_xyz(r);\n\
    g = d3_rgb_xyz(g);\n\
    b = d3_rgb_xyz(b);\n\
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);\n\
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));\n\
  }\n\
  function d3_rgb_xyz(r) {\n\
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);\n\
  }\n\
  function d3_rgb_parseNumber(c) {\n\
    var f = parseFloat(c);\n\
    return c.charAt(c.length - 1) === \"%\" ? Math.round(f * 2.55) : f;\n\
  }\n\
  var d3_rgb_names = d3.map({\n\
    aliceblue: 15792383,\n\
    antiquewhite: 16444375,\n\
    aqua: 65535,\n\
    aquamarine: 8388564,\n\
    azure: 15794175,\n\
    beige: 16119260,\n\
    bisque: 16770244,\n\
    black: 0,\n\
    blanchedalmond: 16772045,\n\
    blue: 255,\n\
    blueviolet: 9055202,\n\
    brown: 10824234,\n\
    burlywood: 14596231,\n\
    cadetblue: 6266528,\n\
    chartreuse: 8388352,\n\
    chocolate: 13789470,\n\
    coral: 16744272,\n\
    cornflowerblue: 6591981,\n\
    cornsilk: 16775388,\n\
    crimson: 14423100,\n\
    cyan: 65535,\n\
    darkblue: 139,\n\
    darkcyan: 35723,\n\
    darkgoldenrod: 12092939,\n\
    darkgray: 11119017,\n\
    darkgreen: 25600,\n\
    darkgrey: 11119017,\n\
    darkkhaki: 12433259,\n\
    darkmagenta: 9109643,\n\
    darkolivegreen: 5597999,\n\
    darkorange: 16747520,\n\
    darkorchid: 10040012,\n\
    darkred: 9109504,\n\
    darksalmon: 15308410,\n\
    darkseagreen: 9419919,\n\
    darkslateblue: 4734347,\n\
    darkslategray: 3100495,\n\
    darkslategrey: 3100495,\n\
    darkturquoise: 52945,\n\
    darkviolet: 9699539,\n\
    deeppink: 16716947,\n\
    deepskyblue: 49151,\n\
    dimgray: 6908265,\n\
    dimgrey: 6908265,\n\
    dodgerblue: 2003199,\n\
    firebrick: 11674146,\n\
    floralwhite: 16775920,\n\
    forestgreen: 2263842,\n\
    fuchsia: 16711935,\n\
    gainsboro: 14474460,\n\
    ghostwhite: 16316671,\n\
    gold: 16766720,\n\
    goldenrod: 14329120,\n\
    gray: 8421504,\n\
    green: 32768,\n\
    greenyellow: 11403055,\n\
    grey: 8421504,\n\
    honeydew: 15794160,\n\
    hotpink: 16738740,\n\
    indianred: 13458524,\n\
    indigo: 4915330,\n\
    ivory: 16777200,\n\
    khaki: 15787660,\n\
    lavender: 15132410,\n\
    lavenderblush: 16773365,\n\
    lawngreen: 8190976,\n\
    lemonchiffon: 16775885,\n\
    lightblue: 11393254,\n\
    lightcoral: 15761536,\n\
    lightcyan: 14745599,\n\
    lightgoldenrodyellow: 16448210,\n\
    lightgray: 13882323,\n\
    lightgreen: 9498256,\n\
    lightgrey: 13882323,\n\
    lightpink: 16758465,\n\
    lightsalmon: 16752762,\n\
    lightseagreen: 2142890,\n\
    lightskyblue: 8900346,\n\
    lightslategray: 7833753,\n\
    lightslategrey: 7833753,\n\
    lightsteelblue: 11584734,\n\
    lightyellow: 16777184,\n\
    lime: 65280,\n\
    limegreen: 3329330,\n\
    linen: 16445670,\n\
    magenta: 16711935,\n\
    maroon: 8388608,\n\
    mediumaquamarine: 6737322,\n\
    mediumblue: 205,\n\
    mediumorchid: 12211667,\n\
    mediumpurple: 9662683,\n\
    mediumseagreen: 3978097,\n\
    mediumslateblue: 8087790,\n\
    mediumspringgreen: 64154,\n\
    mediumturquoise: 4772300,\n\
    mediumvioletred: 13047173,\n\
    midnightblue: 1644912,\n\
    mintcream: 16121850,\n\
    mistyrose: 16770273,\n\
    moccasin: 16770229,\n\
    navajowhite: 16768685,\n\
    navy: 128,\n\
    oldlace: 16643558,\n\
    olive: 8421376,\n\
    olivedrab: 7048739,\n\
    orange: 16753920,\n\
    orangered: 16729344,\n\
    orchid: 14315734,\n\
    palegoldenrod: 15657130,\n\
    palegreen: 10025880,\n\
    paleturquoise: 11529966,\n\
    palevioletred: 14381203,\n\
    papayawhip: 16773077,\n\
    peachpuff: 16767673,\n\
    peru: 13468991,\n\
    pink: 16761035,\n\
    plum: 14524637,\n\
    powderblue: 11591910,\n\
    purple: 8388736,\n\
    red: 16711680,\n\
    rosybrown: 12357519,\n\
    royalblue: 4286945,\n\
    saddlebrown: 9127187,\n\
    salmon: 16416882,\n\
    sandybrown: 16032864,\n\
    seagreen: 3050327,\n\
    seashell: 16774638,\n\
    sienna: 10506797,\n\
    silver: 12632256,\n\
    skyblue: 8900331,\n\
    slateblue: 6970061,\n\
    slategray: 7372944,\n\
    slategrey: 7372944,\n\
    snow: 16775930,\n\
    springgreen: 65407,\n\
    steelblue: 4620980,\n\
    tan: 13808780,\n\
    teal: 32896,\n\
    thistle: 14204888,\n\
    tomato: 16737095,\n\
    turquoise: 4251856,\n\
    violet: 15631086,\n\
    wheat: 16113331,\n\
    white: 16777215,\n\
    whitesmoke: 16119285,\n\
    yellow: 16776960,\n\
    yellowgreen: 10145074\n\
  });\n\
  d3_rgb_names.forEach(function(key, value) {\n\
    d3_rgb_names.set(key, d3_rgbNumber(value));\n\
  });\n\
  function d3_functor(v) {\n\
    return typeof v === \"function\" ? v : function() {\n\
      return v;\n\
    };\n\
  }\n\
  d3.functor = d3_functor;\n\
  function d3_identity(d) {\n\
    return d;\n\
  }\n\
  d3.xhr = d3_xhrType(d3_identity);\n\
  function d3_xhrType(response) {\n\
    return function(url, mimeType, callback) {\n\
      if (arguments.length === 2 && typeof mimeType === \"function\") callback = mimeType, \n\
      mimeType = null;\n\
      return d3_xhr(url, mimeType, response, callback);\n\
    };\n\
  }\n\
  function d3_xhr(url, mimeType, response, callback) {\n\
    var xhr = {}, dispatch = d3.dispatch(\"beforesend\", \"progress\", \"load\", \"error\"), headers = {}, request = new XMLHttpRequest(), responseType = null;\n\
    if (d3_window.XDomainRequest && !(\"withCredentials\" in request) && /^(http(s)?:)?\\/\\//.test(url)) request = new XDomainRequest();\n\
    \"onload\" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {\n\
      request.readyState > 3 && respond();\n\
    };\n\
    function respond() {\n\
      var status = request.status, result;\n\
      if (!status && request.responseText || status >= 200 && status < 300 || status === 304) {\n\
        try {\n\
          result = response.call(xhr, request);\n\
        } catch (e) {\n\
          dispatch.error.call(xhr, e);\n\
          return;\n\
        }\n\
        dispatch.load.call(xhr, result);\n\
      } else {\n\
        dispatch.error.call(xhr, request);\n\
      }\n\
    }\n\
    request.onprogress = function(event) {\n\
      var o = d3.event;\n\
      d3.event = event;\n\
      try {\n\
        dispatch.progress.call(xhr, request);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
    xhr.header = function(name, value) {\n\
      name = (name + \"\").toLowerCase();\n\
      if (arguments.length < 2) return headers[name];\n\
      if (value == null) delete headers[name]; else headers[name] = value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.mimeType = function(value) {\n\
      if (!arguments.length) return mimeType;\n\
      mimeType = value == null ? null : value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.responseType = function(value) {\n\
      if (!arguments.length) return responseType;\n\
      responseType = value;\n\
      return xhr;\n\
    };\n\
    xhr.response = function(value) {\n\
      response = value;\n\
      return xhr;\n\
    };\n\
    [ \"get\", \"post\" ].forEach(function(method) {\n\
      xhr[method] = function() {\n\
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));\n\
      };\n\
    });\n\
    xhr.send = function(method, data, callback) {\n\
      if (arguments.length === 2 && typeof data === \"function\") callback = data, data = null;\n\
      request.open(method, url, true);\n\
      if (mimeType != null && !(\"accept\" in headers)) headers[\"accept\"] = mimeType + \",*/*\";\n\
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);\n\
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);\n\
      if (responseType != null) request.responseType = responseType;\n\
      if (callback != null) xhr.on(\"error\", callback).on(\"load\", function(request) {\n\
        callback(null, request);\n\
      });\n\
      dispatch.beforesend.call(xhr, request);\n\
      request.send(data == null ? null : data);\n\
      return xhr;\n\
    };\n\
    xhr.abort = function() {\n\
      request.abort();\n\
      return xhr;\n\
    };\n\
    d3.rebind(xhr, dispatch, \"on\");\n\
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));\n\
  }\n\
  function d3_xhr_fixCallback(callback) {\n\
    return callback.length === 1 ? function(error, request) {\n\
      callback(error == null ? request : null);\n\
    } : callback;\n\
  }\n\
  d3.dsv = function(delimiter, mimeType) {\n\
    var reFormat = new RegExp('[\"' + delimiter + \"\\n\
]\"), delimiterCode = delimiter.charCodeAt(0);\n\
    function dsv(url, row, callback) {\n\
      if (arguments.length < 3) callback = row, row = null;\n\
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);\n\
      xhr.row = function(_) {\n\
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;\n\
      };\n\
      return xhr;\n\
    }\n\
    function response(request) {\n\
      return dsv.parse(request.responseText);\n\
    }\n\
    function typedResponse(f) {\n\
      return function(request) {\n\
        return dsv.parse(request.responseText, f);\n\
      };\n\
    }\n\
    dsv.parse = function(text, f) {\n\
      var o;\n\
      return dsv.parseRows(text, function(row, i) {\n\
        if (o) return o(row, i - 1);\n\
        var a = new Function(\"d\", \"return {\" + row.map(function(name, i) {\n\
          return JSON.stringify(name) + \": d[\" + i + \"]\";\n\
        }).join(\",\") + \"}\");\n\
        o = f ? function(row, i) {\n\
          return f(a(row), i);\n\
        } : a;\n\
      });\n\
    };\n\
    dsv.parseRows = function(text, f) {\n\
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;\n\
      function token() {\n\
        if (I >= N) return EOF;\n\
        if (eol) return eol = false, EOL;\n\
        var j = I;\n\
        if (text.charCodeAt(j) === 34) {\n\
          var i = j;\n\
          while (i++ < N) {\n\
            if (text.charCodeAt(i) === 34) {\n\
              if (text.charCodeAt(i + 1) !== 34) break;\n\
              ++i;\n\
            }\n\
          }\n\
          I = i + 2;\n\
          var c = text.charCodeAt(i + 1);\n\
          if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(i + 2) === 10) ++I;\n\
          } else if (c === 10) {\n\
            eol = true;\n\
          }\n\
          return text.substring(j + 1, i).replace(/\"\"/g, '\"');\n\
        }\n\
        while (I < N) {\n\
          var c = text.charCodeAt(I++), k = 1;\n\
          if (c === 10) eol = true; else if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(I) === 10) ++I, ++k;\n\
          } else if (c !== delimiterCode) continue;\n\
          return text.substring(j, I - k);\n\
        }\n\
        return text.substring(j);\n\
      }\n\
      while ((t = token()) !== EOF) {\n\
        var a = [];\n\
        while (t !== EOL && t !== EOF) {\n\
          a.push(t);\n\
          t = token();\n\
        }\n\
        if (f && !(a = f(a, n++))) continue;\n\
        rows.push(a);\n\
      }\n\
      return rows;\n\
    };\n\
    dsv.format = function(rows) {\n\
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);\n\
      var fieldSet = new d3_Set(), fields = [];\n\
      rows.forEach(function(row) {\n\
        for (var field in row) {\n\
          if (!fieldSet.has(field)) {\n\
            fields.push(fieldSet.add(field));\n\
          }\n\
        }\n\
      });\n\
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {\n\
        return fields.map(function(field) {\n\
          return formatValue(row[field]);\n\
        }).join(delimiter);\n\
      })).join(\"\\n\
\");\n\
    };\n\
    dsv.formatRows = function(rows) {\n\
      return rows.map(formatRow).join(\"\\n\
\");\n\
    };\n\
    function formatRow(row) {\n\
      return row.map(formatValue).join(delimiter);\n\
    }\n\
    function formatValue(text) {\n\
      return reFormat.test(text) ? '\"' + text.replace(/\\\"/g, '\"\"') + '\"' : text;\n\
    }\n\
    return dsv;\n\
  };\n\
  d3.csv = d3.dsv(\",\", \"text/csv\");\n\
  d3.tsv = d3.dsv(\"\t\", \"text/tab-separated-values\");\n\
  d3.touch = function(container, touches, identifier) {\n\
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;\n\
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {\n\
      if ((touch = touches[i]).identifier === identifier) {\n\
        return d3_mousePoint(container, touch);\n\
      }\n\
    }\n\
  };\n\
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, \"requestAnimationFrame\")] || function(callback) {\n\
    setTimeout(callback, 17);\n\
  };\n\
  d3.timer = function(callback, delay, then) {\n\
    var n = arguments.length;\n\
    if (n < 2) delay = 0;\n\
    if (n < 3) then = Date.now();\n\
    var time = then + delay, timer = {\n\
      c: callback,\n\
      t: time,\n\
      f: false,\n\
      n: null\n\
    };\n\
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;\n\
    d3_timer_queueTail = timer;\n\
    if (!d3_timer_interval) {\n\
      d3_timer_timeout = clearTimeout(d3_timer_timeout);\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  };\n\
  function d3_timer_step() {\n\
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;\n\
    if (delay > 24) {\n\
      if (isFinite(delay)) {\n\
        clearTimeout(d3_timer_timeout);\n\
        d3_timer_timeout = setTimeout(d3_timer_step, delay);\n\
      }\n\
      d3_timer_interval = 0;\n\
    } else {\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  }\n\
  d3.timer.flush = function() {\n\
    d3_timer_mark();\n\
    d3_timer_sweep();\n\
  };\n\
  function d3_timer_mark() {\n\
    var now = Date.now();\n\
    d3_timer_active = d3_timer_queueHead;\n\
    while (d3_timer_active) {\n\
      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);\n\
      d3_timer_active = d3_timer_active.n;\n\
    }\n\
    return now;\n\
  }\n\
  function d3_timer_sweep() {\n\
    var t0, t1 = d3_timer_queueHead, time = Infinity;\n\
    while (t1) {\n\
      if (t1.f) {\n\
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;\n\
      } else {\n\
        if (t1.t < time) time = t1.t;\n\
        t1 = (t0 = t1).n;\n\
      }\n\
    }\n\
    d3_timer_queueTail = t0;\n\
    return time;\n\
  }\n\
  function d3_format_precision(x, p) {\n\
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);\n\
  }\n\
  d3.round = function(x, n) {\n\
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);\n\
  };\n\
  var d3_formatPrefixes = [ \"y\", \"z\", \"a\", \"f\", \"p\", \"n\", \"µ\", \"m\", \"\", \"k\", \"M\", \"G\", \"T\", \"P\", \"E\", \"Z\", \"Y\" ].map(d3_formatPrefix);\n\
  d3.formatPrefix = function(value, precision) {\n\
    var i = 0;\n\
    if (value) {\n\
      if (value < 0) value *= -1;\n\
      if (precision) value = d3.round(value, d3_format_precision(value, precision));\n\
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);\n\
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));\n\
    }\n\
    return d3_formatPrefixes[8 + i / 3];\n\
  };\n\
  function d3_formatPrefix(d, i) {\n\
    var k = Math.pow(10, abs(8 - i) * 3);\n\
    return {\n\
      scale: i > 8 ? function(d) {\n\
        return d / k;\n\
      } : function(d) {\n\
        return d * k;\n\
      },\n\
      symbol: d\n\
    };\n\
  }\n\
  function d3_locale_numberFormat(locale) {\n\
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping ? function(value) {\n\
      var i = value.length, t = [], j = 0, g = locale_grouping[0];\n\
      while (i > 0 && g > 0) {\n\
        t.push(value.substring(i -= g, i + g));\n\
        g = locale_grouping[j = (j + 1) % locale_grouping.length];\n\
      }\n\
      return t.reverse().join(locale_thousands);\n\
    } : d3_identity;\n\
    return function(specifier) {\n\
      var match = d3_format_re.exec(specifier), fill = match[1] || \" \", align = match[2] || \">\", sign = match[3] || \"\", symbol = match[4] || \"\", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = \"\", suffix = \"\", integer = false;\n\
      if (precision) precision = +precision.substring(1);\n\
      if (zfill || fill === \"0\" && align === \"=\") {\n\
        zfill = fill = \"0\";\n\
        align = \"=\";\n\
        if (comma) width -= Math.floor((width - 1) / 4);\n\
      }\n\
      switch (type) {\n\
       case \"n\":\n\
        comma = true;\n\
        type = \"g\";\n\
        break;\n\
\n\
       case \"%\":\n\
        scale = 100;\n\
        suffix = \"%\";\n\
        type = \"f\";\n\
        break;\n\
\n\
       case \"p\":\n\
        scale = 100;\n\
        suffix = \"%\";\n\
        type = \"r\";\n\
        break;\n\
\n\
       case \"b\":\n\
       case \"o\":\n\
       case \"x\":\n\
       case \"X\":\n\
        if (symbol === \"#\") prefix = \"0\" + type.toLowerCase();\n\
\n\
       case \"c\":\n\
       case \"d\":\n\
        integer = true;\n\
        precision = 0;\n\
        break;\n\
\n\
       case \"s\":\n\
        scale = -1;\n\
        type = \"r\";\n\
        break;\n\
      }\n\
      if (symbol === \"$\") prefix = locale_currency[0], suffix = locale_currency[1];\n\
      if (type == \"r\" && !precision) type = \"g\";\n\
      if (precision != null) {\n\
        if (type == \"g\") precision = Math.max(1, Math.min(21, precision)); else if (type == \"e\" || type == \"f\") precision = Math.max(0, Math.min(20, precision));\n\
      }\n\
      type = d3_format_types.get(type) || d3_format_typeDefault;\n\
      var zcomma = zfill && comma;\n\
      return function(value) {\n\
        var fullSuffix = suffix;\n\
        if (integer && value % 1) return \"\";\n\
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, \"-\") : sign;\n\
        if (scale < 0) {\n\
          var unit = d3.formatPrefix(value, precision);\n\
          value = unit.scale(value);\n\
          fullSuffix = unit.symbol + suffix;\n\
        } else {\n\
          value *= scale;\n\
        }\n\
        value = type(value, precision);\n\
        var i = value.lastIndexOf(\".\"), before = i < 0 ? value : value.substring(0, i), after = i < 0 ? \"\" : locale_decimal + value.substring(i + 1);\n\
        if (!zfill && comma) before = formatGroup(before);\n\
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : \"\";\n\
        if (zcomma) before = formatGroup(padding + before);\n\
        negative += prefix;\n\
        value = before + after;\n\
        return (align === \"<\" ? negative + value + padding : align === \">\" ? padding + negative + value : align === \"^\" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;\n\
      };\n\
    };\n\
  }\n\
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\\- ])?([$#])?(0)?(\\d+)?(,)?(\\.-?\\d+)?([a-z%])?/i;\n\
  var d3_format_types = d3.map({\n\
    b: function(x) {\n\
      return x.toString(2);\n\
    },\n\
    c: function(x) {\n\
      return String.fromCharCode(x);\n\
    },\n\
    o: function(x) {\n\
      return x.toString(8);\n\
    },\n\
    x: function(x) {\n\
      return x.toString(16);\n\
    },\n\
    X: function(x) {\n\
      return x.toString(16).toUpperCase();\n\
    },\n\
    g: function(x, p) {\n\
      return x.toPrecision(p);\n\
    },\n\
    e: function(x, p) {\n\
      return x.toExponential(p);\n\
    },\n\
    f: function(x, p) {\n\
      return x.toFixed(p);\n\
    },\n\
    r: function(x, p) {\n\
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));\n\
    }\n\
  });\n\
  function d3_format_typeDefault(x) {\n\
    return x + \"\";\n\
  }\n\
  var d3_time = d3.time = {}, d3_date = Date;\n\
  function d3_date_utc() {\n\
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);\n\
  }\n\
  d3_date_utc.prototype = {\n\
    getDate: function() {\n\
      return this._.getUTCDate();\n\
    },\n\
    getDay: function() {\n\
      return this._.getUTCDay();\n\
    },\n\
    getFullYear: function() {\n\
      return this._.getUTCFullYear();\n\
    },\n\
    getHours: function() {\n\
      return this._.getUTCHours();\n\
    },\n\
    getMilliseconds: function() {\n\
      return this._.getUTCMilliseconds();\n\
    },\n\
    getMinutes: function() {\n\
      return this._.getUTCMinutes();\n\
    },\n\
    getMonth: function() {\n\
      return this._.getUTCMonth();\n\
    },\n\
    getSeconds: function() {\n\
      return this._.getUTCSeconds();\n\
    },\n\
    getTime: function() {\n\
      return this._.getTime();\n\
    },\n\
    getTimezoneOffset: function() {\n\
      return 0;\n\
    },\n\
    valueOf: function() {\n\
      return this._.valueOf();\n\
    },\n\
    setDate: function() {\n\
      d3_time_prototype.setUTCDate.apply(this._, arguments);\n\
    },\n\
    setDay: function() {\n\
      d3_time_prototype.setUTCDay.apply(this._, arguments);\n\
    },\n\
    setFullYear: function() {\n\
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);\n\
    },\n\
    setHours: function() {\n\
      d3_time_prototype.setUTCHours.apply(this._, arguments);\n\
    },\n\
    setMilliseconds: function() {\n\
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);\n\
    },\n\
    setMinutes: function() {\n\
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);\n\
    },\n\
    setMonth: function() {\n\
      d3_time_prototype.setUTCMonth.apply(this._, arguments);\n\
    },\n\
    setSeconds: function() {\n\
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);\n\
    },\n\
    setTime: function() {\n\
      d3_time_prototype.setTime.apply(this._, arguments);\n\
    }\n\
  };\n\
  var d3_time_prototype = Date.prototype;\n\
  function d3_time_interval(local, step, number) {\n\
    function round(date) {\n\
      var d0 = local(date), d1 = offset(d0, 1);\n\
      return date - d0 < d1 - date ? d0 : d1;\n\
    }\n\
    function ceil(date) {\n\
      step(date = local(new d3_date(date - 1)), 1);\n\
      return date;\n\
    }\n\
    function offset(date, k) {\n\
      step(date = new d3_date(+date), k);\n\
      return date;\n\
    }\n\
    function range(t0, t1, dt) {\n\
      var time = ceil(t0), times = [];\n\
      if (dt > 1) {\n\
        while (time < t1) {\n\
          if (!(number(time) % dt)) times.push(new Date(+time));\n\
          step(time, 1);\n\
        }\n\
      } else {\n\
        while (time < t1) times.push(new Date(+time)), step(time, 1);\n\
      }\n\
      return times;\n\
    }\n\
    function range_utc(t0, t1, dt) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = t0;\n\
        return range(utc, t1, dt);\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    }\n\
    local.floor = local;\n\
    local.round = round;\n\
    local.ceil = ceil;\n\
    local.offset = offset;\n\
    local.range = range;\n\
    var utc = local.utc = d3_time_interval_utc(local);\n\
    utc.floor = utc;\n\
    utc.round = d3_time_interval_utc(round);\n\
    utc.ceil = d3_time_interval_utc(ceil);\n\
    utc.offset = d3_time_interval_utc(offset);\n\
    utc.range = range_utc;\n\
    return local;\n\
  }\n\
  function d3_time_interval_utc(method) {\n\
    return function(date, k) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = date;\n\
        return method(utc, k)._;\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    };\n\
  }\n\
  d3_time.year = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setMonth(0, 1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setFullYear(date.getFullYear() + offset);\n\
  }, function(date) {\n\
    return date.getFullYear();\n\
  });\n\
  d3_time.years = d3_time.year.range;\n\
  d3_time.years.utc = d3_time.year.utc.range;\n\
  d3_time.day = d3_time_interval(function(date) {\n\
    var day = new d3_date(2e3, 0);\n\
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());\n\
    return day;\n\
  }, function(date, offset) {\n\
    date.setDate(date.getDate() + offset);\n\
  }, function(date) {\n\
    return date.getDate() - 1;\n\
  });\n\
  d3_time.days = d3_time.day.range;\n\
  d3_time.days.utc = d3_time.day.utc.range;\n\
  d3_time.dayOfYear = function(date) {\n\
    var year = d3_time.year(date);\n\
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);\n\
  };\n\
  [ \"sunday\", \"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\", \"saturday\" ].forEach(function(day, i) {\n\
    i = 7 - i;\n\
    var interval = d3_time[day] = d3_time_interval(function(date) {\n\
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);\n\
      return date;\n\
    }, function(date, offset) {\n\
      date.setDate(date.getDate() + Math.floor(offset) * 7);\n\
    }, function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);\n\
    });\n\
    d3_time[day + \"s\"] = interval.range;\n\
    d3_time[day + \"s\"].utc = interval.utc.range;\n\
    d3_time[day + \"OfYear\"] = function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);\n\
    };\n\
  });\n\
  d3_time.week = d3_time.sunday;\n\
  d3_time.weeks = d3_time.sunday.range;\n\
  d3_time.weeks.utc = d3_time.sunday.utc.range;\n\
  d3_time.weekOfYear = d3_time.sundayOfYear;\n\
  function d3_locale_timeFormat(locale) {\n\
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;\n\
    function d3_time_format(template) {\n\
      var n = template.length;\n\
      function format(date) {\n\
        var string = [], i = -1, j = 0, c, p, f;\n\
        while (++i < n) {\n\
          if (template.charCodeAt(i) === 37) {\n\
            string.push(template.substring(j, i));\n\
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);\n\
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === \"e\" ? \" \" : \"0\" : p);\n\
            string.push(c);\n\
            j = i + 1;\n\
          }\n\
        }\n\
        string.push(template.substring(j, i));\n\
        return string.join(\"\");\n\
      }\n\
      format.parse = function(string) {\n\
        var d = {\n\
          y: 1900,\n\
          m: 0,\n\
          d: 1,\n\
          H: 0,\n\
          M: 0,\n\
          S: 0,\n\
          L: 0,\n\
          Z: null\n\
        }, i = d3_time_parse(d, template, string, 0);\n\
        if (i != string.length) return null;\n\
        if (\"p\" in d) d.H = d.H % 12 + d.p * 12;\n\
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();\n\
        if (\"j\" in d) date.setFullYear(d.y, 0, d.j); else if (\"w\" in d && (\"W\" in d || \"U\" in d)) {\n\
          date.setFullYear(d.y, 0, 1);\n\
          date.setFullYear(d.y, 0, \"W\" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);\n\
        } else date.setFullYear(d.y, d.m, d.d);\n\
        date.setHours(d.H + Math.floor(d.Z / 100), d.M + d.Z % 100, d.S, d.L);\n\
        return localZ ? date._ : date;\n\
      };\n\
      format.toString = function() {\n\
        return template;\n\
      };\n\
      return format;\n\
    }\n\
    function d3_time_parse(date, template, string, j) {\n\
      var c, p, t, i = 0, n = template.length, m = string.length;\n\
      while (i < n) {\n\
        if (j >= m) return -1;\n\
        c = template.charCodeAt(i++);\n\
        if (c === 37) {\n\
          t = template.charAt(i++);\n\
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];\n\
          if (!p || (j = p(date, string, j)) < 0) return -1;\n\
        } else if (c != string.charCodeAt(j++)) {\n\
          return -1;\n\
        }\n\
      }\n\
      return j;\n\
    }\n\
    d3_time_format.utc = function(template) {\n\
      var local = d3_time_format(template);\n\
      function format(date) {\n\
        try {\n\
          d3_date = d3_date_utc;\n\
          var utc = new d3_date();\n\
          utc._ = date;\n\
          return local(utc);\n\
        } finally {\n\
          d3_date = Date;\n\
        }\n\
      }\n\
      format.parse = function(string) {\n\
        try {\n\
          d3_date = d3_date_utc;\n\
          var date = local.parse(string);\n\
          return date && date._;\n\
        } finally {\n\
          d3_date = Date;\n\
        }\n\
      };\n\
      format.toString = local.toString;\n\
      return format;\n\
    };\n\
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;\n\
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);\n\
    locale_periods.forEach(function(p, i) {\n\
      d3_time_periodLookup.set(p.toLowerCase(), i);\n\
    });\n\
    var d3_time_formats = {\n\
      a: function(d) {\n\
        return locale_shortDays[d.getDay()];\n\
      },\n\
      A: function(d) {\n\
        return locale_days[d.getDay()];\n\
      },\n\
      b: function(d) {\n\
        return locale_shortMonths[d.getMonth()];\n\
      },\n\
      B: function(d) {\n\
        return locale_months[d.getMonth()];\n\
      },\n\
      c: d3_time_format(locale_dateTime),\n\
      d: function(d, p) {\n\
        return d3_time_formatPad(d.getDate(), p, 2);\n\
      },\n\
      e: function(d, p) {\n\
        return d3_time_formatPad(d.getDate(), p, 2);\n\
      },\n\
      H: function(d, p) {\n\
        return d3_time_formatPad(d.getHours(), p, 2);\n\
      },\n\
      I: function(d, p) {\n\
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);\n\
      },\n\
      j: function(d, p) {\n\
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);\n\
      },\n\
      L: function(d, p) {\n\
        return d3_time_formatPad(d.getMilliseconds(), p, 3);\n\
      },\n\
      m: function(d, p) {\n\
        return d3_time_formatPad(d.getMonth() + 1, p, 2);\n\
      },\n\
      M: function(d, p) {\n\
        return d3_time_formatPad(d.getMinutes(), p, 2);\n\
      },\n\
      p: function(d) {\n\
        return locale_periods[+(d.getHours() >= 12)];\n\
      },\n\
      S: function(d, p) {\n\
        return d3_time_formatPad(d.getSeconds(), p, 2);\n\
      },\n\
      U: function(d, p) {\n\
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);\n\
      },\n\
      w: function(d) {\n\
        return d.getDay();\n\
      },\n\
      W: function(d, p) {\n\
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);\n\
      },\n\
      x: d3_time_format(locale_date),\n\
      X: d3_time_format(locale_time),\n\
      y: function(d, p) {\n\
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);\n\
      },\n\
      Y: function(d, p) {\n\
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);\n\
      },\n\
      Z: d3_time_zone,\n\
      \"%\": function() {\n\
        return \"%\";\n\
      }\n\
    };\n\
    var d3_time_parsers = {\n\
      a: d3_time_parseWeekdayAbbrev,\n\
      A: d3_time_parseWeekday,\n\
      b: d3_time_parseMonthAbbrev,\n\
      B: d3_time_parseMonth,\n\
      c: d3_time_parseLocaleFull,\n\
      d: d3_time_parseDay,\n\
      e: d3_time_parseDay,\n\
      H: d3_time_parseHour24,\n\
      I: d3_time_parseHour24,\n\
      j: d3_time_parseDayOfYear,\n\
      L: d3_time_parseMilliseconds,\n\
      m: d3_time_parseMonthNumber,\n\
      M: d3_time_parseMinutes,\n\
      p: d3_time_parseAmPm,\n\
      S: d3_time_parseSeconds,\n\
      U: d3_time_parseWeekNumberSunday,\n\
      w: d3_time_parseWeekdayNumber,\n\
      W: d3_time_parseWeekNumberMonday,\n\
      x: d3_time_parseLocaleDate,\n\
      X: d3_time_parseLocaleTime,\n\
      y: d3_time_parseYear,\n\
      Y: d3_time_parseFullYear,\n\
      Z: d3_time_parseZone,\n\
      \"%\": d3_time_parseLiteralPercent\n\
    };\n\
    function d3_time_parseWeekdayAbbrev(date, string, i) {\n\
      d3_time_dayAbbrevRe.lastIndex = 0;\n\
      var n = d3_time_dayAbbrevRe.exec(string.substring(i));\n\
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseWeekday(date, string, i) {\n\
      d3_time_dayRe.lastIndex = 0;\n\
      var n = d3_time_dayRe.exec(string.substring(i));\n\
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseMonthAbbrev(date, string, i) {\n\
      d3_time_monthAbbrevRe.lastIndex = 0;\n\
      var n = d3_time_monthAbbrevRe.exec(string.substring(i));\n\
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseMonth(date, string, i) {\n\
      d3_time_monthRe.lastIndex = 0;\n\
      var n = d3_time_monthRe.exec(string.substring(i));\n\
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseLocaleFull(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);\n\
    }\n\
    function d3_time_parseLocaleDate(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);\n\
    }\n\
    function d3_time_parseLocaleTime(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);\n\
    }\n\
    function d3_time_parseAmPm(date, string, i) {\n\
      var n = d3_time_periodLookup.get(string.substring(i, i += 2).toLowerCase());\n\
      return n == null ? -1 : (date.p = n, i);\n\
    }\n\
    return d3_time_format;\n\
  }\n\
  var d3_time_formatPads = {\n\
    \"-\": \"\",\n\
    _: \" \",\n\
    \"0\": \"0\"\n\
  }, d3_time_numberRe = /^\\s*\\d+/, d3_time_percentRe = /^%/;\n\
  function d3_time_formatPad(value, fill, width) {\n\
    var sign = value < 0 ? \"-\" : \"\", string = (sign ? -value : value) + \"\", length = string.length;\n\
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);\n\
  }\n\
  function d3_time_formatRe(names) {\n\
    return new RegExp(\"^(?:\" + names.map(d3.requote).join(\"|\") + \")\", \"i\");\n\
  }\n\
  function d3_time_formatLookup(names) {\n\
    var map = new d3_Map(), i = -1, n = names.length;\n\
    while (++i < n) map.set(names[i].toLowerCase(), i);\n\
    return map;\n\
  }\n\
  function d3_time_parseWeekdayNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 1));\n\
    return n ? (date.w = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberSunday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.U = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberMonday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.W = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseFullYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 4));\n\
    return n ? (date.y = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseZone(date, string, i) {\n\
    return /^[+-]\\d{4}$/.test(string = string.substring(i, i + 5)) ? (date.Z = -string, \n\
    i + 5) : -1;\n\
  }\n\
  function d3_time_expandYear(d) {\n\
    return d + (d > 68 ? 1900 : 2e3);\n\
  }\n\
  function d3_time_parseMonthNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDay(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.d = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDayOfYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.j = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseHour24(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.H = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMinutes(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.M = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseSeconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.S = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMilliseconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.L = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_zone(d) {\n\
    var z = d.getTimezoneOffset(), zs = z > 0 ? \"-\" : \"+\", zh = ~~(abs(z) / 60), zm = abs(z) % 60;\n\
    return zs + d3_time_formatPad(zh, \"0\", 2) + d3_time_formatPad(zm, \"0\", 2);\n\
  }\n\
  function d3_time_parseLiteralPercent(date, string, i) {\n\
    d3_time_percentRe.lastIndex = 0;\n\
    var n = d3_time_percentRe.exec(string.substring(i, i + 1));\n\
    return n ? i + n[0].length : -1;\n\
  }\n\
  function d3_time_formatMulti(formats) {\n\
    var n = formats.length, i = -1;\n\
    while (++i < n) formats[i][0] = this(formats[i][0]);\n\
    return function(date) {\n\
      var i = 0, f = formats[i];\n\
      while (!f[1](date)) f = formats[++i];\n\
      return f[0](date);\n\
    };\n\
  }\n\
  d3.locale = function(locale) {\n\
    return {\n\
      numberFormat: d3_locale_numberFormat(locale),\n\
      timeFormat: d3_locale_timeFormat(locale)\n\
    };\n\
  };\n\
  var d3_locale_enUS = d3.locale({\n\
    decimal: \".\",\n\
    thousands: \",\",\n\
    grouping: [ 3 ],\n\
    currency: [ \"$\", \"\" ],\n\
    dateTime: \"%a %b %e %X %Y\",\n\
    date: \"%m/%d/%Y\",\n\
    time: \"%H:%M:%S\",\n\
    periods: [ \"AM\", \"PM\" ],\n\
    days: [ \"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\" ],\n\
    shortDays: [ \"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\" ],\n\
    months: [ \"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\" ],\n\
    shortMonths: [ \"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\" ]\n\
  });\n\
  d3.format = d3_locale_enUS.numberFormat;\n\
  d3.geo = {};\n\
  function d3_adder() {}\n\
  d3_adder.prototype = {\n\
    s: 0,\n\
    t: 0,\n\
    add: function(y) {\n\
      d3_adderSum(y, this.t, d3_adderTemp);\n\
      d3_adderSum(d3_adderTemp.s, this.s, this);\n\
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;\n\
    },\n\
    reset: function() {\n\
      this.s = this.t = 0;\n\
    },\n\
    valueOf: function() {\n\
      return this.s;\n\
    }\n\
  };\n\
  var d3_adderTemp = new d3_adder();\n\
  function d3_adderSum(a, b, o) {\n\
    var x = o.s = a + b, bv = x - a, av = x - bv;\n\
    o.t = a - av + (b - bv);\n\
  }\n\
  d3.geo.stream = function(object, listener) {\n\
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {\n\
      d3_geo_streamObjectType[object.type](object, listener);\n\
    } else {\n\
      d3_geo_streamGeometry(object, listener);\n\
    }\n\
  };\n\
  function d3_geo_streamGeometry(geometry, listener) {\n\
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {\n\
      d3_geo_streamGeometryType[geometry.type](geometry, listener);\n\
    }\n\
  }\n\
  var d3_geo_streamObjectType = {\n\
    Feature: function(feature, listener) {\n\
      d3_geo_streamGeometry(feature.geometry, listener);\n\
    },\n\
    FeatureCollection: function(object, listener) {\n\
      var features = object.features, i = -1, n = features.length;\n\
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);\n\
    }\n\
  };\n\
  var d3_geo_streamGeometryType = {\n\
    Sphere: function(object, listener) {\n\
      listener.sphere();\n\
    },\n\
    Point: function(object, listener) {\n\
      object = object.coordinates;\n\
      listener.point(object[0], object[1], object[2]);\n\
    },\n\
    MultiPoint: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);\n\
    },\n\
    LineString: function(object, listener) {\n\
      d3_geo_streamLine(object.coordinates, listener, 0);\n\
    },\n\
    MultiLineString: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);\n\
    },\n\
    Polygon: function(object, listener) {\n\
      d3_geo_streamPolygon(object.coordinates, listener);\n\
    },\n\
    MultiPolygon: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);\n\
    },\n\
    GeometryCollection: function(object, listener) {\n\
      var geometries = object.geometries, i = -1, n = geometries.length;\n\
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);\n\
    }\n\
  };\n\
  function d3_geo_streamLine(coordinates, listener, closed) {\n\
    var i = -1, n = coordinates.length - closed, coordinate;\n\
    listener.lineStart();\n\
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);\n\
    listener.lineEnd();\n\
  }\n\
  function d3_geo_streamPolygon(coordinates, listener) {\n\
    var i = -1, n = coordinates.length;\n\
    listener.polygonStart();\n\
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);\n\
    listener.polygonEnd();\n\
  }\n\
  d3.geo.area = function(object) {\n\
    d3_geo_areaSum = 0;\n\
    d3.geo.stream(object, d3_geo_area);\n\
    return d3_geo_areaSum;\n\
  };\n\
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();\n\
  var d3_geo_area = {\n\
    sphere: function() {\n\
      d3_geo_areaSum += 4 * π;\n\
    },\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_areaRingSum.reset();\n\
      d3_geo_area.lineStart = d3_geo_areaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      var area = 2 * d3_geo_areaRingSum;\n\
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;\n\
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;\n\
    }\n\
  };\n\
  function d3_geo_areaRingStart() {\n\
    var λ00, φ00, λ0, cosφ0, sinφ0;\n\
    d3_geo_area.point = function(λ, φ) {\n\
      d3_geo_area.point = nextPoint;\n\
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), \n\
      sinφ0 = Math.sin(φ);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      φ = φ * d3_radians / 2 + π / 4;\n\
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);\n\
      d3_geo_areaRingSum.add(Math.atan2(v, u));\n\
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;\n\
    }\n\
    d3_geo_area.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
    };\n\
  }\n\
  function d3_geo_cartesian(spherical) {\n\
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);\n\
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];\n\
  }\n\
  function d3_geo_cartesianDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];\n\
  }\n\
  function d3_geo_cartesianCross(a, b) {\n\
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];\n\
  }\n\
  function d3_geo_cartesianAdd(a, b) {\n\
    a[0] += b[0];\n\
    a[1] += b[1];\n\
    a[2] += b[2];\n\
  }\n\
  function d3_geo_cartesianScale(vector, k) {\n\
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];\n\
  }\n\
  function d3_geo_cartesianNormalize(d) {\n\
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);\n\
    d[0] /= l;\n\
    d[1] /= l;\n\
    d[2] /= l;\n\
  }\n\
  function d3_geo_spherical(cartesian) {\n\
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];\n\
  }\n\
  function d3_geo_sphericalEqual(a, b) {\n\
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;\n\
  }\n\
  d3.geo.bounds = function() {\n\
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;\n\
    var bound = {\n\
      point: point,\n\
      lineStart: lineStart,\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        bound.point = ringPoint;\n\
        bound.lineStart = ringStart;\n\
        bound.lineEnd = ringEnd;\n\
        dλSum = 0;\n\
        d3_geo_area.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        d3_geo_area.polygonEnd();\n\
        bound.point = point;\n\
        bound.lineStart = lineStart;\n\
        bound.lineEnd = lineEnd;\n\
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;\n\
        range[0] = λ0, range[1] = λ1;\n\
      }\n\
    };\n\
    function point(λ, φ) {\n\
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);\n\
      if (φ < φ0) φ0 = φ;\n\
      if (φ > φ1) φ1 = φ;\n\
    }\n\
    function linePoint(λ, φ) {\n\
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);\n\
      if (p0) {\n\
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);\n\
        d3_geo_cartesianNormalize(inflection);\n\
        inflection = d3_geo_spherical(inflection);\n\
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;\n\
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = inflection[1] * d3_degrees;\n\
          if (φi > φ1) φ1 = φi;\n\
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = -inflection[1] * d3_degrees;\n\
          if (φi < φ0) φ0 = φi;\n\
        } else {\n\
          if (φ < φ0) φ0 = φ;\n\
          if (φ > φ1) φ1 = φ;\n\
        }\n\
        if (antimeridian) {\n\
          if (λ < λ_) {\n\
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
          } else {\n\
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
          }\n\
        } else {\n\
          if (λ1 >= λ0) {\n\
            if (λ < λ0) λ0 = λ;\n\
            if (λ > λ1) λ1 = λ;\n\
          } else {\n\
            if (λ > λ_) {\n\
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
            } else {\n\
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
            }\n\
          }\n\
        }\n\
      } else {\n\
        point(λ, φ);\n\
      }\n\
      p0 = p, λ_ = λ;\n\
    }\n\
    function lineStart() {\n\
      bound.point = linePoint;\n\
    }\n\
    function lineEnd() {\n\
      range[0] = λ0, range[1] = λ1;\n\
      bound.point = point;\n\
      p0 = null;\n\
    }\n\
    function ringPoint(λ, φ) {\n\
      if (p0) {\n\
        var dλ = λ - λ_;\n\
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;\n\
      } else λ__ = λ, φ__ = φ;\n\
      d3_geo_area.point(λ, φ);\n\
      linePoint(λ, φ);\n\
    }\n\
    function ringStart() {\n\
      d3_geo_area.lineStart();\n\
    }\n\
    function ringEnd() {\n\
      ringPoint(λ__, φ__);\n\
      d3_geo_area.lineEnd();\n\
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);\n\
      range[0] = λ0, range[1] = λ1;\n\
      p0 = null;\n\
    }\n\
    function angle(λ0, λ1) {\n\
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;\n\
    }\n\
    function compareRanges(a, b) {\n\
      return a[0] - b[0];\n\
    }\n\
    function withinRange(x, range) {\n\
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;\n\
    }\n\
    return function(feature) {\n\
      φ1 = λ1 = -(λ0 = φ0 = Infinity);\n\
      ranges = [];\n\
      d3.geo.stream(feature, bound);\n\
      var n = ranges.length;\n\
      if (n) {\n\
        ranges.sort(compareRanges);\n\
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {\n\
          b = ranges[i];\n\
          if (withinRange(b[0], a) || withinRange(b[1], a)) {\n\
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];\n\
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];\n\
          } else {\n\
            merged.push(a = b);\n\
          }\n\
        }\n\
        var best = -Infinity, dλ;\n\
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {\n\
          b = merged[i];\n\
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];\n\
        }\n\
      }\n\
      ranges = range = null;\n\
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];\n\
    };\n\
  }();\n\
  d3.geo.centroid = function(object) {\n\
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
    d3.geo.stream(object, d3_geo_centroid);\n\
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;\n\
    if (m < ε2) {\n\
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;\n\
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;\n\
      m = x * x + y * y + z * z;\n\
      if (m < ε2) return [ NaN, NaN ];\n\
    }\n\
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];\n\
  };\n\
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;\n\
  var d3_geo_centroid = {\n\
    sphere: d3_noop,\n\
    point: d3_geo_centroidPoint,\n\
    lineStart: d3_geo_centroidLineStart,\n\
    lineEnd: d3_geo_centroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;\n\
    }\n\
  };\n\
  function d3_geo_centroidPoint(λ, φ) {\n\
    λ *= d3_radians;\n\
    var cosφ = Math.cos(φ *= d3_radians);\n\
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));\n\
  }\n\
  function d3_geo_centroidPointXYZ(x, y, z) {\n\
    ++d3_geo_centroidW0;\n\
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;\n\
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;\n\
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;\n\
  }\n\
  function d3_geo_centroidLineStart() {\n\
    var x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroid.point = nextPoint;\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_geo_centroidLineEnd() {\n\
    d3_geo_centroid.point = d3_geo_centroidPoint;\n\
  }\n\
  function d3_geo_centroidRingStart() {\n\
    var λ00, φ00, x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ00 = λ, φ00 = φ;\n\
      d3_geo_centroid.point = nextPoint;\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    d3_geo_centroid.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;\n\
      d3_geo_centroid.point = d3_geo_centroidPoint;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);\n\
      d3_geo_centroidX2 += v * cx;\n\
      d3_geo_centroidY2 += v * cy;\n\
      d3_geo_centroidZ2 += v * cz;\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_true() {\n\
    return true;\n\
  }\n\
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {\n\
    var subject = [], clip = [];\n\
    segments.forEach(function(segment) {\n\
      if ((n = segment.length - 1) <= 0) return;\n\
      var n, p0 = segment[0], p1 = segment[n];\n\
      if (d3_geo_sphericalEqual(p0, p1)) {\n\
        listener.lineStart();\n\
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);\n\
        listener.lineEnd();\n\
        return;\n\
      }\n\
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);\n\
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
    });\n\
    clip.sort(compare);\n\
    d3_geo_clipPolygonLinkCircular(subject);\n\
    d3_geo_clipPolygonLinkCircular(clip);\n\
    if (!subject.length) return;\n\
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {\n\
      clip[i].e = entry = !entry;\n\
    }\n\
    var start = subject[0], points, point;\n\
    while (1) {\n\
      var current = start, isSubject = true;\n\
      while (current.v) if ((current = current.n) === start) return;\n\
      points = current.z;\n\
      listener.lineStart();\n\
      do {\n\
        current.v = current.o.v = true;\n\
        if (current.e) {\n\
          if (isSubject) {\n\
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.n.x, 1, listener);\n\
          }\n\
          current = current.n;\n\
        } else {\n\
          if (isSubject) {\n\
            points = current.p.z;\n\
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.p.x, -1, listener);\n\
          }\n\
          current = current.p;\n\
        }\n\
        current = current.o;\n\
        points = current.z;\n\
        isSubject = !isSubject;\n\
      } while (!current.v);\n\
      listener.lineEnd();\n\
    }\n\
  }\n\
  function d3_geo_clipPolygonLinkCircular(array) {\n\
    if (!(n = array.length)) return;\n\
    var n, i = 0, a = array[0], b;\n\
    while (++i < n) {\n\
      a.n = b = array[i];\n\
      b.p = a;\n\
      a = b;\n\
    }\n\
    a.n = b = array[0];\n\
    b.p = a;\n\
  }\n\
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {\n\
    this.x = point;\n\
    this.z = points;\n\
    this.o = other;\n\
    this.e = entry;\n\
    this.v = false;\n\
    this.n = this.p = null;\n\
  }\n\
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {\n\
    return function(rotate, listener) {\n\
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          clip.point = pointRing;\n\
          clip.lineStart = ringStart;\n\
          clip.lineEnd = ringEnd;\n\
          segments = [];\n\
          polygon = [];\n\
        },\n\
        polygonEnd: function() {\n\
          clip.point = point;\n\
          clip.lineStart = lineStart;\n\
          clip.lineEnd = lineEnd;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);\n\
          if (segments.length) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);\n\
          } else if (clipStartInside) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            listener.lineStart();\n\
            interpolate(null, null, 1, listener);\n\
            listener.lineEnd();\n\
          }\n\
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;\n\
          segments = polygon = null;\n\
        },\n\
        sphere: function() {\n\
          listener.polygonStart();\n\
          listener.lineStart();\n\
          interpolate(null, null, 1, listener);\n\
          listener.lineEnd();\n\
          listener.polygonEnd();\n\
        }\n\
      };\n\
      function point(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);\n\
      }\n\
      function pointLine(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        line.point(point[0], point[1]);\n\
      }\n\
      function lineStart() {\n\
        clip.point = pointLine;\n\
        line.lineStart();\n\
      }\n\
      function lineEnd() {\n\
        clip.point = point;\n\
        line.lineEnd();\n\
      }\n\
      var segments;\n\
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;\n\
      function pointRing(λ, φ) {\n\
        ring.push([ λ, φ ]);\n\
        var point = rotate(λ, φ);\n\
        ringListener.point(point[0], point[1]);\n\
      }\n\
      function ringStart() {\n\
        ringListener.lineStart();\n\
        ring = [];\n\
      }\n\
      function ringEnd() {\n\
        pointRing(ring[0][0], ring[0][1]);\n\
        ringListener.lineEnd();\n\
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;\n\
        ring.pop();\n\
        polygon.push(ring);\n\
        ring = null;\n\
        if (!n) return;\n\
        if (clean & 1) {\n\
          segment = ringSegments[0];\n\
          var n = segment.length - 1, i = -1, point;\n\
          if (n > 0) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            listener.lineStart();\n\
            while (++i < n) listener.point((point = segment[i])[0], point[1]);\n\
            listener.lineEnd();\n\
          }\n\
          return;\n\
        }\n\
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));\n\
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));\n\
      }\n\
      return clip;\n\
    };\n\
  }\n\
  function d3_geo_clipSegmentLength1(segment) {\n\
    return segment.length > 1;\n\
  }\n\
  function d3_geo_clipBufferListener() {\n\
    var lines = [], line;\n\
    return {\n\
      lineStart: function() {\n\
        lines.push(line = []);\n\
      },\n\
      point: function(λ, φ) {\n\
        line.push([ λ, φ ]);\n\
      },\n\
      lineEnd: d3_noop,\n\
      buffer: function() {\n\
        var buffer = lines;\n\
        lines = [];\n\
        line = null;\n\
        return buffer;\n\
      },\n\
      rejoin: function() {\n\
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipSort(a, b) {\n\
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);\n\
  }\n\
  function d3_geo_pointInPolygon(point, polygon) {\n\
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;\n\
    d3_geo_areaRingSum.reset();\n\
    for (var i = 0, n = polygon.length; i < n; ++i) {\n\
      var ring = polygon[i], m = ring.length;\n\
      if (!m) continue;\n\
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;\n\
      while (true) {\n\
        if (j === m) j = 0;\n\
        point = ring[j];\n\
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;\n\
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));\n\
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;\n\
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {\n\
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));\n\
          d3_geo_cartesianNormalize(arc);\n\
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);\n\
          d3_geo_cartesianNormalize(intersection);\n\
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);\n\
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {\n\
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;\n\
          }\n\
        }\n\
        if (!j++) break;\n\
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;\n\
      }\n\
    }\n\
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;\n\
  }\n\
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);\n\
  function d3_geo_clipAntimeridianLine(listener) {\n\
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;\n\
    return {\n\
      lineStart: function() {\n\
        listener.lineStart();\n\
        clean = 1;\n\
      },\n\
      point: function(λ1, φ1) {\n\
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);\n\
        if (abs(dλ - π) < ε) {\n\
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          listener.point(λ1, φ0);\n\
          clean = 0;\n\
        } else if (sλ0 !== sλ1 && dλ >= π) {\n\
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;\n\
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;\n\
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          clean = 0;\n\
        }\n\
        listener.point(λ0 = λ1, φ0 = φ1);\n\
        sλ0 = sλ1;\n\
      },\n\
      lineEnd: function() {\n\
        listener.lineEnd();\n\
        λ0 = φ0 = NaN;\n\
      },\n\
      clean: function() {\n\
        return 2 - clean;\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {\n\
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);\n\
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;\n\
  }\n\
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {\n\
    var φ;\n\
    if (from == null) {\n\
      φ = direction * halfπ;\n\
      listener.point(-π, φ);\n\
      listener.point(0, φ);\n\
      listener.point(π, φ);\n\
      listener.point(π, 0);\n\
      listener.point(π, -φ);\n\
      listener.point(0, -φ);\n\
      listener.point(-π, -φ);\n\
      listener.point(-π, 0);\n\
      listener.point(-π, φ);\n\
    } else if (abs(from[0] - to[0]) > ε) {\n\
      var s = from[0] < to[0] ? π : -π;\n\
      φ = direction * s / 2;\n\
      listener.point(-s, φ);\n\
      listener.point(0, φ);\n\
      listener.point(s, φ);\n\
    } else {\n\
      listener.point(to[0], to[1]);\n\
    }\n\
  }\n\
  function d3_geo_clipCircle(radius) {\n\
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);\n\
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);\n\
    function visible(λ, φ) {\n\
      return Math.cos(λ) * Math.cos(φ) > cr;\n\
    }\n\
    function clipLine(listener) {\n\
      var point0, c0, v0, v00, clean;\n\
      return {\n\
        lineStart: function() {\n\
          v00 = v0 = false;\n\
          clean = 1;\n\
        },\n\
        point: function(λ, φ) {\n\
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;\n\
          if (!point0 && (v00 = v0 = v)) listener.lineStart();\n\
          if (v !== v0) {\n\
            point2 = intersect(point0, point1);\n\
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {\n\
              point1[0] += ε;\n\
              point1[1] += ε;\n\
              v = visible(point1[0], point1[1]);\n\
            }\n\
          }\n\
          if (v !== v0) {\n\
            clean = 0;\n\
            if (v) {\n\
              listener.lineStart();\n\
              point2 = intersect(point1, point0);\n\
              listener.point(point2[0], point2[1]);\n\
            } else {\n\
              point2 = intersect(point0, point1);\n\
              listener.point(point2[0], point2[1]);\n\
              listener.lineEnd();\n\
            }\n\
            point0 = point2;\n\
          } else if (notHemisphere && point0 && smallRadius ^ v) {\n\
            var t;\n\
            if (!(c & c0) && (t = intersect(point1, point0, true))) {\n\
              clean = 0;\n\
              if (smallRadius) {\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
              } else {\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
              }\n\
            }\n\
          }\n\
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {\n\
            listener.point(point1[0], point1[1]);\n\
          }\n\
          point0 = point1, v0 = v, c0 = c;\n\
        },\n\
        lineEnd: function() {\n\
          if (v0) listener.lineEnd();\n\
          point0 = null;\n\
        },\n\
        clean: function() {\n\
          return clean | (v00 && v0) << 1;\n\
        }\n\
      };\n\
    }\n\
    function intersect(a, b, two) {\n\
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);\n\
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;\n\
      if (!determinant) return !two && a;\n\
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);\n\
      d3_geo_cartesianAdd(A, B);\n\
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);\n\
      if (t2 < 0) return;\n\
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);\n\
      d3_geo_cartesianAdd(q, A);\n\
      q = d3_geo_spherical(q);\n\
      if (!two) return q;\n\
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;\n\
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;\n\
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;\n\
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;\n\
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {\n\
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);\n\
        d3_geo_cartesianAdd(q1, A);\n\
        return [ q, d3_geo_spherical(q1) ];\n\
      }\n\
    }\n\
    function code(λ, φ) {\n\
      var r = smallRadius ? radius : π - radius, code = 0;\n\
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;\n\
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;\n\
      return code;\n\
    }\n\
  }\n\
  function d3_geom_clipLine(x0, y0, x1, y1) {\n\
    return function(line) {\n\
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;\n\
      r = x0 - ax;\n\
      if (!dx && r > 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dx > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = x1 - ax;\n\
      if (!dx && r < 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dx > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      r = y0 - ay;\n\
      if (!dy && r > 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dy > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = y1 - ay;\n\
      if (!dy && r < 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dy > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      if (t0 > 0) line.a = {\n\
        x: ax + t0 * dx,\n\
        y: ay + t0 * dy\n\
      };\n\
      if (t1 < 1) line.b = {\n\
        x: ax + t1 * dx,\n\
        y: ay + t1 * dy\n\
      };\n\
      return line;\n\
    };\n\
  }\n\
  var d3_geo_clipExtentMAX = 1e9;\n\
  d3.geo.clipExtent = function() {\n\
    var x0, y0, x1, y1, stream, clip, clipExtent = {\n\
      stream: function(output) {\n\
        if (stream) stream.valid = false;\n\
        stream = clip(output);\n\
        stream.valid = true;\n\
        return stream;\n\
      },\n\
      extent: function(_) {\n\
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);\n\
        if (stream) stream.valid = false, stream = null;\n\
        return clipExtent;\n\
      }\n\
    };\n\
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);\n\
  };\n\
  function d3_geo_clipExtent(x0, y0, x1, y1) {\n\
    return function(listener) {\n\
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          listener = bufferListener;\n\
          segments = [];\n\
          polygon = [];\n\
          clean = true;\n\
        },\n\
        polygonEnd: function() {\n\
          listener = listener_;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;\n\
          if (inside || visible) {\n\
            listener.polygonStart();\n\
            if (inside) {\n\
              listener.lineStart();\n\
              interpolate(null, null, 1, listener);\n\
              listener.lineEnd();\n\
            }\n\
            if (visible) {\n\
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);\n\
            }\n\
            listener.polygonEnd();\n\
          }\n\
          segments = polygon = ring = null;\n\
        }\n\
      };\n\
      function insidePolygon(p) {\n\
        var wn = 0, n = polygon.length, y = p[1];\n\
        for (var i = 0; i < n; ++i) {\n\
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {\n\
            b = v[j];\n\
            if (a[1] <= y) {\n\
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;\n\
            } else {\n\
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;\n\
            }\n\
            a = b;\n\
          }\n\
        }\n\
        return wn !== 0;\n\
      }\n\
      function interpolate(from, to, direction, listener) {\n\
        var a = 0, a1 = 0;\n\
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {\n\
          do {\n\
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);\n\
          } while ((a = (a + direction + 4) % 4) !== a1);\n\
        } else {\n\
          listener.point(to[0], to[1]);\n\
        }\n\
      }\n\
      function pointVisible(x, y) {\n\
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;\n\
      }\n\
      function point(x, y) {\n\
        if (pointVisible(x, y)) listener.point(x, y);\n\
      }\n\
      var x__, y__, v__, x_, y_, v_, first, clean;\n\
      function lineStart() {\n\
        clip.point = linePoint;\n\
        if (polygon) polygon.push(ring = []);\n\
        first = true;\n\
        v_ = false;\n\
        x_ = y_ = NaN;\n\
      }\n\
      function lineEnd() {\n\
        if (segments) {\n\
          linePoint(x__, y__);\n\
          if (v__ && v_) bufferListener.rejoin();\n\
          segments.push(bufferListener.buffer());\n\
        }\n\
        clip.point = point;\n\
        if (v_) listener.lineEnd();\n\
      }\n\
      function linePoint(x, y) {\n\
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));\n\
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));\n\
        var v = pointVisible(x, y);\n\
        if (polygon) ring.push([ x, y ]);\n\
        if (first) {\n\
          x__ = x, y__ = y, v__ = v;\n\
          first = false;\n\
          if (v) {\n\
            listener.lineStart();\n\
            listener.point(x, y);\n\
          }\n\
        } else {\n\
          if (v && v_) listener.point(x, y); else {\n\
            var l = {\n\
              a: {\n\
                x: x_,\n\
                y: y_\n\
              },\n\
              b: {\n\
                x: x,\n\
                y: y\n\
              }\n\
            };\n\
            if (clipLine(l)) {\n\
              if (!v_) {\n\
                listener.lineStart();\n\
                listener.point(l.a.x, l.a.y);\n\
              }\n\
              listener.point(l.b.x, l.b.y);\n\
              if (!v) listener.lineEnd();\n\
              clean = false;\n\
            } else if (v) {\n\
              listener.lineStart();\n\
              listener.point(x, y);\n\
              clean = false;\n\
            }\n\
          }\n\
        }\n\
        x_ = x, y_ = y, v_ = v;\n\
      }\n\
      return clip;\n\
    };\n\
    function corner(p, direction) {\n\
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;\n\
    }\n\
    function compare(a, b) {\n\
      return comparePoints(a.x, b.x);\n\
    }\n\
    function comparePoints(a, b) {\n\
      var ca = corner(a, 1), cb = corner(b, 1);\n\
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];\n\
    }\n\
  }\n\
  function d3_geo_compose(a, b) {\n\
    function compose(x, y) {\n\
      return x = a(x, y), b(x[0], x[1]);\n\
    }\n\
    if (a.invert && b.invert) compose.invert = function(x, y) {\n\
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);\n\
    };\n\
    return compose;\n\
  }\n\
  function d3_geo_conic(projectAt) {\n\
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);\n\
    p.parallels = function(_) {\n\
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];\n\
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);\n\
    };\n\
    return p;\n\
  }\n\
  function d3_geo_conicEqualArea(φ0, φ1) {\n\
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;\n\
    function forward(λ, φ) {\n\
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;\n\
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = ρ0 - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEqualArea = function() {\n\
    return d3_geo_conic(d3_geo_conicEqualArea);\n\
  }).raw = d3_geo_conicEqualArea;\n\
  d3.geo.albers = function() {\n\
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);\n\
  };\n\
  d3.geo.albersUsa = function() {\n\
    var lower48 = d3.geo.albers();\n\
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);\n\
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);\n\
    var point, pointStream = {\n\
      point: function(x, y) {\n\
        point = [ x, y ];\n\
      }\n\
    }, lower48Point, alaskaPoint, hawaiiPoint;\n\
    function albersUsa(coordinates) {\n\
      var x = coordinates[0], y = coordinates[1];\n\
      point = null;\n\
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);\n\
      return point;\n\
    }\n\
    albersUsa.invert = function(coordinates) {\n\
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;\n\
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);\n\
    };\n\
    albersUsa.stream = function(stream) {\n\
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);\n\
      return {\n\
        point: function(x, y) {\n\
          lower48Stream.point(x, y);\n\
          alaskaStream.point(x, y);\n\
          hawaiiStream.point(x, y);\n\
        },\n\
        sphere: function() {\n\
          lower48Stream.sphere();\n\
          alaskaStream.sphere();\n\
          hawaiiStream.sphere();\n\
        },\n\
        lineStart: function() {\n\
          lower48Stream.lineStart();\n\
          alaskaStream.lineStart();\n\
          hawaiiStream.lineStart();\n\
        },\n\
        lineEnd: function() {\n\
          lower48Stream.lineEnd();\n\
          alaskaStream.lineEnd();\n\
          hawaiiStream.lineEnd();\n\
        },\n\
        polygonStart: function() {\n\
          lower48Stream.polygonStart();\n\
          alaskaStream.polygonStart();\n\
          hawaiiStream.polygonStart();\n\
        },\n\
        polygonEnd: function() {\n\
          lower48Stream.polygonEnd();\n\
          alaskaStream.polygonEnd();\n\
          hawaiiStream.polygonEnd();\n\
        }\n\
      };\n\
    };\n\
    albersUsa.precision = function(_) {\n\
      if (!arguments.length) return lower48.precision();\n\
      lower48.precision(_);\n\
      alaska.precision(_);\n\
      hawaii.precision(_);\n\
      return albersUsa;\n\
    };\n\
    albersUsa.scale = function(_) {\n\
      if (!arguments.length) return lower48.scale();\n\
      lower48.scale(_);\n\
      alaska.scale(_ * .35);\n\
      hawaii.scale(_);\n\
      return albersUsa.translate(lower48.translate());\n\
    };\n\
    albersUsa.translate = function(_) {\n\
      if (!arguments.length) return lower48.translate();\n\
      var k = lower48.scale(), x = +_[0], y = +_[1];\n\
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;\n\
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      return albersUsa;\n\
    };\n\
    return albersUsa.scale(1070);\n\
  };\n\
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_pathAreaPolygon = 0;\n\
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;\n\
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);\n\
    }\n\
  };\n\
  function d3_geo_pathAreaRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathArea.point = function(x, y) {\n\
      d3_geo_pathArea.point = nextPoint;\n\
      x00 = x0 = x, y00 = y0 = y;\n\
    };\n\
    function nextPoint(x, y) {\n\
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;\n\
      x0 = x, y0 = y;\n\
    }\n\
    d3_geo_pathArea.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;\n\
  var d3_geo_pathBounds = {\n\
    point: d3_geo_pathBoundsPoint,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_pathBoundsPoint(x, y) {\n\
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;\n\
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;\n\
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;\n\
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;\n\
  }\n\
  function d3_geo_pathBuffer() {\n\
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointCircle = d3_geo_pathBufferCircle(_);\n\
        return stream;\n\
      },\n\
      result: function() {\n\
        if (buffer.length) {\n\
          var result = buffer.join(\"\");\n\
          buffer = [];\n\
          return result;\n\
        }\n\
      }\n\
    };\n\
    function point(x, y) {\n\
      buffer.push(\"M\", x, \",\", y, pointCircle);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      buffer.push(\"M\", x, \",\", y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      buffer.push(\"L\", x, \",\", y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      buffer.push(\"Z\");\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_pathBufferCircle(radius) {\n\
    return \"m0,\" + radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + -2 * radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + 2 * radius + \"z\";\n\
  }\n\
  var d3_geo_pathCentroid = {\n\
    point: d3_geo_pathCentroidPoint,\n\
    lineStart: d3_geo_pathCentroidLineStart,\n\
    lineEnd: d3_geo_pathCentroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;\n\
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;\n\
    }\n\
  };\n\
  function d3_geo_pathCentroidPoint(x, y) {\n\
    d3_geo_centroidX0 += x;\n\
    d3_geo_centroidY0 += y;\n\
    ++d3_geo_centroidZ0;\n\
  }\n\
  function d3_geo_pathCentroidLineStart() {\n\
    var x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
  }\n\
  function d3_geo_pathCentroidLineEnd() {\n\
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
  }\n\
  function d3_geo_pathCentroidRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      z = y0 * x - x0 * y;\n\
      d3_geo_centroidX2 += z * (x0 + x);\n\
      d3_geo_centroidY2 += z * (y0 + y);\n\
      d3_geo_centroidZ2 += z * 3;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
    d3_geo_pathCentroid.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  function d3_geo_pathContext(context) {\n\
    var pointRadius = 4.5;\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointRadius = _;\n\
        return stream;\n\
      },\n\
      result: d3_noop\n\
    };\n\
    function point(x, y) {\n\
      context.moveTo(x, y);\n\
      context.arc(x, y, pointRadius, 0, τ);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      context.moveTo(x, y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      context.lineTo(x, y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      context.closePath();\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_resample(project) {\n\
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;\n\
    function resample(stream) {\n\
      return (maxDepth ? resampleRecursive : resampleNone)(stream);\n\
    }\n\
    function resampleNone(stream) {\n\
      return d3_geo_transformPoint(stream, function(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      });\n\
    }\n\
    function resampleRecursive(stream) {\n\
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;\n\
      var resample = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          stream.polygonStart();\n\
          resample.lineStart = ringStart;\n\
        },\n\
        polygonEnd: function() {\n\
          stream.polygonEnd();\n\
          resample.lineStart = lineStart;\n\
        }\n\
      };\n\
      function point(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      }\n\
      function lineStart() {\n\
        x0 = NaN;\n\
        resample.point = linePoint;\n\
        stream.lineStart();\n\
      }\n\
      function linePoint(λ, φ) {\n\
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);\n\
        stream.point(x0, y0);\n\
      }\n\
      function lineEnd() {\n\
        resample.point = point;\n\
        stream.lineEnd();\n\
      }\n\
      function ringStart() {\n\
        lineStart();\n\
        resample.point = ringPoint;\n\
        resample.lineEnd = ringEnd;\n\
      }\n\
      function ringPoint(λ, φ) {\n\
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;\n\
        resample.point = linePoint;\n\
      }\n\
      function ringEnd() {\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);\n\
        resample.lineEnd = lineEnd;\n\
        lineEnd();\n\
      }\n\
      return resample;\n\
    }\n\
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {\n\
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;\n\
      if (d2 > 4 * δ2 && depth--) {\n\
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;\n\
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {\n\
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);\n\
          stream.point(x2, y2);\n\
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);\n\
        }\n\
      }\n\
    }\n\
    resample.precision = function(_) {\n\
      if (!arguments.length) return Math.sqrt(δ2);\n\
      maxDepth = (δ2 = _ * _) > 0 && 16;\n\
      return resample;\n\
    };\n\
    return resample;\n\
  }\n\
  d3.geo.path = function() {\n\
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;\n\
    function path(object) {\n\
      if (object) {\n\
        if (typeof pointRadius === \"function\") contextStream.pointRadius(+pointRadius.apply(this, arguments));\n\
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);\n\
        d3.geo.stream(object, cacheStream);\n\
      }\n\
      return contextStream.result();\n\
    }\n\
    path.area = function(object) {\n\
      d3_geo_pathAreaSum = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathArea));\n\
      return d3_geo_pathAreaSum;\n\
    };\n\
    path.centroid = function(object) {\n\
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));\n\
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];\n\
    };\n\
    path.bounds = function(object) {\n\
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);\n\
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));\n\
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];\n\
    };\n\
    path.projection = function(_) {\n\
      if (!arguments.length) return projection;\n\
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;\n\
      return reset();\n\
    };\n\
    path.context = function(_) {\n\
      if (!arguments.length) return context;\n\
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);\n\
      if (typeof pointRadius !== \"function\") contextStream.pointRadius(pointRadius);\n\
      return reset();\n\
    };\n\
    path.pointRadius = function(_) {\n\
      if (!arguments.length) return pointRadius;\n\
      pointRadius = typeof _ === \"function\" ? _ : (contextStream.pointRadius(+_), +_);\n\
      return path;\n\
    };\n\
    function reset() {\n\
      cacheStream = null;\n\
      return path;\n\
    }\n\
    return path.projection(d3.geo.albersUsa()).context(null);\n\
  };\n\
  function d3_geo_pathProjectStream(project) {\n\
    var resample = d3_geo_resample(function(x, y) {\n\
      return project([ x * d3_degrees, y * d3_degrees ]);\n\
    });\n\
    return function(stream) {\n\
      return d3_geo_projectionRadians(resample(stream));\n\
    };\n\
  }\n\
  d3.geo.transform = function(methods) {\n\
    return {\n\
      stream: function(stream) {\n\
        var transform = new d3_geo_transform(stream);\n\
        for (var k in methods) transform[k] = methods[k];\n\
        return transform;\n\
      }\n\
    };\n\
  };\n\
  function d3_geo_transform(stream) {\n\
    this.stream = stream;\n\
  }\n\
  d3_geo_transform.prototype = {\n\
    point: function(x, y) {\n\
      this.stream.point(x, y);\n\
    },\n\
    sphere: function() {\n\
      this.stream.sphere();\n\
    },\n\
    lineStart: function() {\n\
      this.stream.lineStart();\n\
    },\n\
    lineEnd: function() {\n\
      this.stream.lineEnd();\n\
    },\n\
    polygonStart: function() {\n\
      this.stream.polygonStart();\n\
    },\n\
    polygonEnd: function() {\n\
      this.stream.polygonEnd();\n\
    }\n\
  };\n\
  function d3_geo_transformPoint(stream, point) {\n\
    return {\n\
      point: point,\n\
      sphere: function() {\n\
        stream.sphere();\n\
      },\n\
      lineStart: function() {\n\
        stream.lineStart();\n\
      },\n\
      lineEnd: function() {\n\
        stream.lineEnd();\n\
      },\n\
      polygonStart: function() {\n\
        stream.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        stream.polygonEnd();\n\
      }\n\
    };\n\
  }\n\
  d3.geo.projection = d3_geo_projection;\n\
  d3.geo.projectionMutator = d3_geo_projectionMutator;\n\
  function d3_geo_projection(project) {\n\
    return d3_geo_projectionMutator(function() {\n\
      return project;\n\
    })();\n\
  }\n\
  function d3_geo_projectionMutator(projectAt) {\n\
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {\n\
      x = project(x, y);\n\
      return [ x[0] * k + δx, δy - x[1] * k ];\n\
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;\n\
    function projection(point) {\n\
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);\n\
      return [ point[0] * k + δx, δy - point[1] * k ];\n\
    }\n\
    function invert(point) {\n\
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);\n\
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];\n\
    }\n\
    projection.stream = function(output) {\n\
      if (stream) stream.valid = false;\n\
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));\n\
      stream.valid = true;\n\
      return stream;\n\
    };\n\
    projection.clipAngle = function(_) {\n\
      if (!arguments.length) return clipAngle;\n\
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);\n\
      return invalidate();\n\
    };\n\
    projection.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent;\n\
      clipExtent = _;\n\
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;\n\
      return invalidate();\n\
    };\n\
    projection.scale = function(_) {\n\
      if (!arguments.length) return k;\n\
      k = +_;\n\
      return reset();\n\
    };\n\
    projection.translate = function(_) {\n\
      if (!arguments.length) return [ x, y ];\n\
      x = +_[0];\n\
      y = +_[1];\n\
      return reset();\n\
    };\n\
    projection.center = function(_) {\n\
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];\n\
      λ = _[0] % 360 * d3_radians;\n\
      φ = _[1] % 360 * d3_radians;\n\
      return reset();\n\
    };\n\
    projection.rotate = function(_) {\n\
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];\n\
      δλ = _[0] % 360 * d3_radians;\n\
      δφ = _[1] % 360 * d3_radians;\n\
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;\n\
      return reset();\n\
    };\n\
    d3.rebind(projection, projectResample, \"precision\");\n\
    function reset() {\n\
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);\n\
      var center = project(λ, φ);\n\
      δx = x - center[0] * k;\n\
      δy = y + center[1] * k;\n\
      return invalidate();\n\
    }\n\
    function invalidate() {\n\
      if (stream) stream.valid = false, stream = null;\n\
      return projection;\n\
    }\n\
    return function() {\n\
      project = projectAt.apply(this, arguments);\n\
      projection.invert = project.invert && invert;\n\
      return reset();\n\
    };\n\
  }\n\
  function d3_geo_projectionRadians(stream) {\n\
    return d3_geo_transformPoint(stream, function(x, y) {\n\
      stream.point(x * d3_radians, y * d3_radians);\n\
    });\n\
  }\n\
  function d3_geo_equirectangular(λ, φ) {\n\
    return [ λ, φ ];\n\
  }\n\
  (d3.geo.equirectangular = function() {\n\
    return d3_geo_projection(d3_geo_equirectangular);\n\
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;\n\
  d3.geo.rotation = function(rotate) {\n\
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);\n\
    function forward(coordinates) {\n\
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    }\n\
    forward.invert = function(coordinates) {\n\
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    };\n\
    return forward;\n\
  };\n\
  function d3_geo_identityRotation(λ, φ) {\n\
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
  }\n\
  d3_geo_identityRotation.invert = d3_geo_equirectangular;\n\
  function d3_geo_rotation(δλ, δφ, δγ) {\n\
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;\n\
  }\n\
  function d3_geo_forwardRotationλ(δλ) {\n\
    return function(λ, φ) {\n\
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
    };\n\
  }\n\
  function d3_geo_rotationλ(δλ) {\n\
    var rotation = d3_geo_forwardRotationλ(δλ);\n\
    rotation.invert = d3_geo_forwardRotationλ(-δλ);\n\
    return rotation;\n\
  }\n\
  function d3_geo_rotationφγ(δφ, δγ) {\n\
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);\n\
    function rotation(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;\n\
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];\n\
    }\n\
    rotation.invert = function(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;\n\
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];\n\
    };\n\
    return rotation;\n\
  }\n\
  d3.geo.circle = function() {\n\
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;\n\
    function circle() {\n\
      var center = typeof origin === \"function\" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];\n\
      interpolate(null, null, 1, {\n\
        point: function(x, y) {\n\
          ring.push(x = rotate(x, y));\n\
          x[0] *= d3_degrees, x[1] *= d3_degrees;\n\
        }\n\
      });\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ ring ]\n\
      };\n\
    }\n\
    circle.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return circle;\n\
    };\n\
    circle.angle = function(x) {\n\
      if (!arguments.length) return angle;\n\
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);\n\
      return circle;\n\
    };\n\
    circle.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);\n\
      return circle;\n\
    };\n\
    return circle.angle(90);\n\
  };\n\
  function d3_geo_circleInterpolate(radius, precision) {\n\
    var cr = Math.cos(radius), sr = Math.sin(radius);\n\
    return function(from, to, direction, listener) {\n\
      var step = direction * precision;\n\
      if (from != null) {\n\
        from = d3_geo_circleAngle(cr, from);\n\
        to = d3_geo_circleAngle(cr, to);\n\
        if (direction > 0 ? from < to : from > to) from += direction * τ;\n\
      } else {\n\
        from = radius + direction * τ;\n\
        to = radius - .5 * step;\n\
      }\n\
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {\n\
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_circleAngle(cr, point) {\n\
    var a = d3_geo_cartesian(point);\n\
    a[0] -= cr;\n\
    d3_geo_cartesianNormalize(a);\n\
    var angle = d3_acos(-a[1]);\n\
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);\n\
  }\n\
  d3.geo.distance = function(a, b) {\n\
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;\n\
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);\n\
  };\n\
  d3.geo.graticule = function() {\n\
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;\n\
    function graticule() {\n\
      return {\n\
        type: \"MultiLineString\",\n\
        coordinates: lines()\n\
      };\n\
    }\n\
    function lines() {\n\
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {\n\
        return abs(x % DX) > ε;\n\
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {\n\
        return abs(y % DY) > ε;\n\
      }).map(y));\n\
    }\n\
    graticule.lines = function() {\n\
      return lines().map(function(coordinates) {\n\
        return {\n\
          type: \"LineString\",\n\
          coordinates: coordinates\n\
        };\n\
      });\n\
    };\n\
    graticule.outline = function() {\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]\n\
      };\n\
    };\n\
    graticule.extent = function(_) {\n\
      if (!arguments.length) return graticule.minorExtent();\n\
      return graticule.majorExtent(_).minorExtent(_);\n\
    };\n\
    graticule.majorExtent = function(_) {\n\
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];\n\
      X0 = +_[0][0], X1 = +_[1][0];\n\
      Y0 = +_[0][1], Y1 = +_[1][1];\n\
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;\n\
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.minorExtent = function(_) {\n\
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
      x0 = +_[0][0], x1 = +_[1][0];\n\
      y0 = +_[0][1], y1 = +_[1][1];\n\
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;\n\
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.step = function(_) {\n\
      if (!arguments.length) return graticule.minorStep();\n\
      return graticule.majorStep(_).minorStep(_);\n\
    };\n\
    graticule.majorStep = function(_) {\n\
      if (!arguments.length) return [ DX, DY ];\n\
      DX = +_[0], DY = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.minorStep = function(_) {\n\
      if (!arguments.length) return [ dx, dy ];\n\
      dx = +_[0], dy = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      precision = +_;\n\
      x = d3_geo_graticuleX(y0, y1, 90);\n\
      y = d3_geo_graticuleY(x0, x1, precision);\n\
      X = d3_geo_graticuleX(Y0, Y1, 90);\n\
      Y = d3_geo_graticuleY(X0, X1, precision);\n\
      return graticule;\n\
    };\n\
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);\n\
  };\n\
  function d3_geo_graticuleX(y0, y1, dy) {\n\
    var y = d3.range(y0, y1 - ε, dy).concat(y1);\n\
    return function(x) {\n\
      return y.map(function(y) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_geo_graticuleY(x0, x1, dx) {\n\
    var x = d3.range(x0, x1 - ε, dx).concat(x1);\n\
    return function(y) {\n\
      return x.map(function(x) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_source(d) {\n\
    return d.source;\n\
  }\n\
  function d3_target(d) {\n\
    return d.target;\n\
  }\n\
  d3.geo.greatArc = function() {\n\
    var source = d3_source, source_, target = d3_target, target_;\n\
    function greatArc() {\n\
      return {\n\
        type: \"LineString\",\n\
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]\n\
      };\n\
    }\n\
    greatArc.distance = function() {\n\
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));\n\
    };\n\
    greatArc.source = function(_) {\n\
      if (!arguments.length) return source;\n\
      source = _, source_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.target = function(_) {\n\
      if (!arguments.length) return target;\n\
      target = _, target_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.precision = function() {\n\
      return arguments.length ? greatArc : 0;\n\
    };\n\
    return greatArc;\n\
  };\n\
  d3.geo.interpolate = function(source, target) {\n\
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);\n\
  };\n\
  function d3_geo_interpolate(x0, y0, x1, y1) {\n\
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);\n\
    var interpolate = d ? function(t) {\n\
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;\n\
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];\n\
    } : function() {\n\
      return [ x0 * d3_degrees, y0 * d3_degrees ];\n\
    };\n\
    interpolate.distance = d;\n\
    return interpolate;\n\
  }\n\
  d3.geo.length = function(object) {\n\
    d3_geo_lengthSum = 0;\n\
    d3.geo.stream(object, d3_geo_length);\n\
    return d3_geo_lengthSum;\n\
  };\n\
  var d3_geo_lengthSum;\n\
  var d3_geo_length = {\n\
    sphere: d3_noop,\n\
    point: d3_noop,\n\
    lineStart: d3_geo_lengthLineStart,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_lengthLineStart() {\n\
    var λ0, sinφ0, cosφ0;\n\
    d3_geo_length.point = function(λ, φ) {\n\
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);\n\
      d3_geo_length.point = nextPoint;\n\
    };\n\
    d3_geo_length.lineEnd = function() {\n\
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);\n\
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);\n\
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;\n\
    }\n\
  }\n\
  function d3_geo_azimuthal(scale, angle) {\n\
    function azimuthal(λ, φ) {\n\
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);\n\
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];\n\
    }\n\
    azimuthal.invert = function(x, y) {\n\
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);\n\
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];\n\
    };\n\
    return azimuthal;\n\
  }\n\
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return Math.sqrt(2 / (1 + cosλcosφ));\n\
  }, function(ρ) {\n\
    return 2 * Math.asin(ρ / 2);\n\
  });\n\
  (d3.geo.azimuthalEqualArea = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEqualArea);\n\
  }).raw = d3_geo_azimuthalEqualArea;\n\
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {\n\
    var c = Math.acos(cosλcosφ);\n\
    return c && c / Math.sin(c);\n\
  }, d3_identity);\n\
  (d3.geo.azimuthalEquidistant = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEquidistant);\n\
  }).raw = d3_geo_azimuthalEquidistant;\n\
  function d3_geo_conicConformal(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), t = function(φ) {\n\
      return Math.tan(π / 4 + φ / 2);\n\
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;\n\
    if (!n) return d3_geo_mercator;\n\
    function forward(λ, φ) {\n\
      if (F > 0) {\n\
        if (φ < -halfπ + ε) φ = -halfπ + ε;\n\
      } else {\n\
        if (φ > halfπ - ε) φ = halfπ - ε;\n\
      }\n\
      var ρ = F / Math.pow(t(φ), n);\n\
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);\n\
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicConformal = function() {\n\
    return d3_geo_conic(d3_geo_conicConformal);\n\
  }).raw = d3_geo_conicConformal;\n\
  function d3_geo_conicEquidistant(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;\n\
    if (abs(n) < ε) return d3_geo_equirectangular;\n\
    function forward(λ, φ) {\n\
      var ρ = G - φ;\n\
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = G - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEquidistant = function() {\n\
    return d3_geo_conic(d3_geo_conicEquidistant);\n\
  }).raw = d3_geo_conicEquidistant;\n\
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / cosλcosφ;\n\
  }, Math.atan);\n\
  (d3.geo.gnomonic = function() {\n\
    return d3_geo_projection(d3_geo_gnomonic);\n\
  }).raw = d3_geo_gnomonic;\n\
  function d3_geo_mercator(λ, φ) {\n\
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];\n\
  }\n\
  d3_geo_mercator.invert = function(x, y) {\n\
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];\n\
  };\n\
  function d3_geo_mercatorProjection(project) {\n\
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;\n\
    m.scale = function() {\n\
      var v = scale.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.translate = function() {\n\
      var v = translate.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.clipExtent = function(_) {\n\
      var v = clipExtent.apply(m, arguments);\n\
      if (v === m) {\n\
        if (clipAuto = _ == null) {\n\
          var k = π * scale(), t = translate();\n\
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);\n\
        }\n\
      } else if (clipAuto) {\n\
        v = null;\n\
      }\n\
      return v;\n\
    };\n\
    return m.clipExtent(null);\n\
  }\n\
  (d3.geo.mercator = function() {\n\
    return d3_geo_mercatorProjection(d3_geo_mercator);\n\
  }).raw = d3_geo_mercator;\n\
  var d3_geo_orthographic = d3_geo_azimuthal(function() {\n\
    return 1;\n\
  }, Math.asin);\n\
  (d3.geo.orthographic = function() {\n\
    return d3_geo_projection(d3_geo_orthographic);\n\
  }).raw = d3_geo_orthographic;\n\
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / (1 + cosλcosφ);\n\
  }, function(ρ) {\n\
    return 2 * Math.atan(ρ);\n\
  });\n\
  (d3.geo.stereographic = function() {\n\
    return d3_geo_projection(d3_geo_stereographic);\n\
  }).raw = d3_geo_stereographic;\n\
  function d3_geo_transverseMercator(λ, φ) {\n\
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];\n\
  }\n\
  d3_geo_transverseMercator.invert = function(x, y) {\n\
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];\n\
  };\n\
  (d3.geo.transverseMercator = function() {\n\
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;\n\
    projection.center = function(_) {\n\
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);\n\
    };\n\
    projection.rotate = function(_) {\n\
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), \n\
      [ _[0], _[1], _[2] - 90 ]);\n\
    };\n\
    return rotate([ 0, 0, 90 ]);\n\
  }).raw = d3_geo_transverseMercator;\n\
  d3.geom = {};\n\
  function d3_geom_pointX(d) {\n\
    return d[0];\n\
  }\n\
  function d3_geom_pointY(d) {\n\
    return d[1];\n\
  }\n\
  d3.geom.hull = function(vertices) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY;\n\
    if (arguments.length) return hull(vertices);\n\
    function hull(data) {\n\
      if (data.length < 3) return [];\n\
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];\n\
      for (i = 0; i < n; i++) {\n\
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);\n\
      }\n\
      points.sort(d3_geom_hullOrder);\n\
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);\n\
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);\n\
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];\n\
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);\n\
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);\n\
      return polygon;\n\
    }\n\
    hull.x = function(_) {\n\
      return arguments.length ? (x = _, hull) : x;\n\
    };\n\
    hull.y = function(_) {\n\
      return arguments.length ? (y = _, hull) : y;\n\
    };\n\
    return hull;\n\
  };\n\
  function d3_geom_hullUpper(points) {\n\
    var n = points.length, hull = [ 0, 1 ], hs = 2;\n\
    for (var i = 2; i < n; i++) {\n\
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;\n\
      hull[hs++] = i;\n\
    }\n\
    return hull.slice(0, hs);\n\
  }\n\
  function d3_geom_hullOrder(a, b) {\n\
    return a[0] - b[0] || a[1] - b[1];\n\
  }\n\
  d3.geom.polygon = function(coordinates) {\n\
    d3_subclass(coordinates, d3_geom_polygonPrototype);\n\
    return coordinates;\n\
  };\n\
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];\n\
  d3_geom_polygonPrototype.area = function() {\n\
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      area += a[1] * b[0] - a[0] * b[1];\n\
    }\n\
    return area * .5;\n\
  };\n\
  d3_geom_polygonPrototype.centroid = function(k) {\n\
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;\n\
    if (!arguments.length) k = -1 / (6 * this.area());\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      c = a[0] * b[1] - b[0] * a[1];\n\
      x += (a[0] + b[0]) * c;\n\
      y += (a[1] + b[1]) * c;\n\
    }\n\
    return [ x * k, y * k ];\n\
  };\n\
  d3_geom_polygonPrototype.clip = function(subject) {\n\
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;\n\
    while (++i < n) {\n\
      input = subject.slice();\n\
      subject.length = 0;\n\
      b = this[i];\n\
      c = input[(m = input.length - closed) - 1];\n\
      j = -1;\n\
      while (++j < m) {\n\
        d = input[j];\n\
        if (d3_geom_polygonInside(d, a, b)) {\n\
          if (!d3_geom_polygonInside(c, a, b)) {\n\
            subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
          }\n\
          subject.push(d);\n\
        } else if (d3_geom_polygonInside(c, a, b)) {\n\
          subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
        }\n\
        c = d;\n\
      }\n\
      if (closed) subject.push(subject[0]);\n\
      a = b;\n\
    }\n\
    return subject;\n\
  };\n\
  function d3_geom_polygonInside(p, a, b) {\n\
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);\n\
  }\n\
  function d3_geom_polygonIntersect(c, d, a, b) {\n\
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);\n\
    return [ x1 + ua * x21, y1 + ua * y21 ];\n\
  }\n\
  function d3_geom_polygonClosed(coordinates) {\n\
    var a = coordinates[0], b = coordinates[coordinates.length - 1];\n\
    return !(a[0] - b[0] || a[1] - b[1]);\n\
  }\n\
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];\n\
  function d3_geom_voronoiBeach() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.edge = this.site = this.circle = null;\n\
  }\n\
  function d3_geom_voronoiCreateBeach(site) {\n\
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();\n\
    beach.site = site;\n\
    return beach;\n\
  }\n\
  function d3_geom_voronoiDetachBeach(beach) {\n\
    d3_geom_voronoiDetachCircle(beach);\n\
    d3_geom_voronoiBeaches.remove(beach);\n\
    d3_geom_voronoiBeachPool.push(beach);\n\
    d3_geom_voronoiRedBlackNode(beach);\n\
  }\n\
  function d3_geom_voronoiRemoveBeach(beach) {\n\
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {\n\
      x: x,\n\
      y: y\n\
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];\n\
    d3_geom_voronoiDetachBeach(beach);\n\
    var lArc = previous;\n\
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {\n\
      previous = lArc.P;\n\
      disappearing.unshift(lArc);\n\
      d3_geom_voronoiDetachBeach(lArc);\n\
      lArc = previous;\n\
    }\n\
    disappearing.unshift(lArc);\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    var rArc = next;\n\
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {\n\
      next = rArc.N;\n\
      disappearing.push(rArc);\n\
      d3_geom_voronoiDetachBeach(rArc);\n\
      rArc = next;\n\
    }\n\
    disappearing.push(rArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var nArcs = disappearing.length, iArc;\n\
    for (iArc = 1; iArc < nArcs; ++iArc) {\n\
      rArc = disappearing[iArc];\n\
      lArc = disappearing[iArc - 1];\n\
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);\n\
    }\n\
    lArc = disappearing[0];\n\
    rArc = disappearing[nArcs - 1];\n\
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiAddBeach(site) {\n\
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;\n\
    while (node) {\n\
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;\n\
      if (dxl > ε) node = node.L; else {\n\
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);\n\
        if (dxr > ε) {\n\
          if (!node.R) {\n\
            lArc = node;\n\
            break;\n\
          }\n\
          node = node.R;\n\
        } else {\n\
          if (dxl > -ε) {\n\
            lArc = node.P;\n\
            rArc = node;\n\
          } else if (dxr > -ε) {\n\
            lArc = node;\n\
            rArc = node.N;\n\
          } else {\n\
            lArc = rArc = node;\n\
          }\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    var newArc = d3_geom_voronoiCreateBeach(site);\n\
    d3_geom_voronoiBeaches.insert(lArc, newArc);\n\
    if (!lArc && !rArc) return;\n\
    if (lArc === rArc) {\n\
      d3_geom_voronoiDetachCircle(lArc);\n\
      rArc = d3_geom_voronoiCreateBeach(lArc.site);\n\
      d3_geom_voronoiBeaches.insert(newArc, rArc);\n\
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      d3_geom_voronoiAttachCircle(lArc);\n\
      d3_geom_voronoiAttachCircle(rArc);\n\
      return;\n\
    }\n\
    if (!rArc) {\n\
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      return;\n\
    }\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {\n\
      x: (cy * hb - by * hc) / d + ax,\n\
      y: (bx * hc - cx * hb) / d + ay\n\
    };\n\
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);\n\
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);\n\
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {\n\
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;\n\
    if (!pby2) return rfocx;\n\
    var lArc = arc.P;\n\
    if (!lArc) return -Infinity;\n\
    site = lArc.site;\n\
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;\n\
    if (!plby2) return lfocx;\n\
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;\n\
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;\n\
    return (rfocx + lfocx) / 2;\n\
  }\n\
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {\n\
    var rArc = arc.N;\n\
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);\n\
    var site = arc.site;\n\
    return site.y === directrix ? site.x : Infinity;\n\
  }\n\
  function d3_geom_voronoiCell(site) {\n\
    this.site = site;\n\
    this.edges = [];\n\
  }\n\
  d3_geom_voronoiCell.prototype.prepare = function() {\n\
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;\n\
    while (iHalfEdge--) {\n\
      edge = halfEdges[iHalfEdge].edge;\n\
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);\n\
    }\n\
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);\n\
    return halfEdges.length;\n\
  };\n\
  function d3_geom_voronoiCloseCells(extent) {\n\
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;\n\
    while (iCell--) {\n\
      cell = cells[iCell];\n\
      if (!cell || !cell.prepare()) continue;\n\
      halfEdges = cell.edges;\n\
      nHalfEdges = halfEdges.length;\n\
      iHalfEdge = 0;\n\
      while (iHalfEdge < nHalfEdges) {\n\
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;\n\
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;\n\
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {\n\
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {\n\
            x: x0,\n\
            y: abs(x2 - x0) < ε ? y2 : y1\n\
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {\n\
            x: abs(y2 - y1) < ε ? x2 : x1,\n\
            y: y1\n\
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {\n\
            x: x1,\n\
            y: abs(x2 - x1) < ε ? y2 : y0\n\
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {\n\
            x: abs(y2 - y0) < ε ? x2 : x0,\n\
            y: y0\n\
          } : null), cell.site, null));\n\
          ++nHalfEdges;\n\
        }\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdgeOrder(a, b) {\n\
    return b.angle - a.angle;\n\
  }\n\
  function d3_geom_voronoiCircle() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.x = this.y = this.arc = this.site = this.cy = null;\n\
  }\n\
  function d3_geom_voronoiAttachCircle(arc) {\n\
    var lArc = arc.P, rArc = arc.N;\n\
    if (!lArc || !rArc) return;\n\
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;\n\
    if (lSite === rSite) return;\n\
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;\n\
    var d = 2 * (ax * cy - ay * cx);\n\
    if (d >= -ε2) return;\n\
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;\n\
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();\n\
    circle.arc = arc;\n\
    circle.site = cSite;\n\
    circle.x = x + bx;\n\
    circle.y = cy + Math.sqrt(x * x + y * y);\n\
    circle.cy = cy;\n\
    arc.circle = circle;\n\
    var before = null, node = d3_geom_voronoiCircles._;\n\
    while (node) {\n\
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {\n\
        if (node.L) node = node.L; else {\n\
          before = node.P;\n\
          break;\n\
        }\n\
      } else {\n\
        if (node.R) node = node.R; else {\n\
          before = node;\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    d3_geom_voronoiCircles.insert(before, circle);\n\
    if (!before) d3_geom_voronoiFirstCircle = circle;\n\
  }\n\
  function d3_geom_voronoiDetachCircle(arc) {\n\
    var circle = arc.circle;\n\
    if (circle) {\n\
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;\n\
      d3_geom_voronoiCircles.remove(circle);\n\
      d3_geom_voronoiCirclePool.push(circle);\n\
      d3_geom_voronoiRedBlackNode(circle);\n\
      arc.circle = null;\n\
    }\n\
  }\n\
  function d3_geom_voronoiClipEdges(extent) {\n\
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;\n\
    while (i--) {\n\
      e = edges[i];\n\
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {\n\
        e.a = e.b = null;\n\
        edges.splice(i, 1);\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiConnectEdge(edge, extent) {\n\
    var vb = edge.b;\n\
    if (vb) return true;\n\
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;\n\
    if (ry === ly) {\n\
      if (fx < x0 || fx >= x1) return;\n\
      if (lx > rx) {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y0\n\
        }; else if (va.y >= y1) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y1\n\
        };\n\
      } else {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y1\n\
        }; else if (va.y < y0) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y0\n\
        };\n\
      }\n\
    } else {\n\
      fm = (lx - rx) / (ry - ly);\n\
      fb = fy - fm * fx;\n\
      if (fm < -1 || fm > 1) {\n\
        if (lx > rx) {\n\
          if (!va) va = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          }; else if (va.y >= y1) return;\n\
          vb = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          }; else if (va.y < y0) return;\n\
          vb = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          };\n\
        }\n\
      } else {\n\
        if (ly < ry) {\n\
          if (!va) va = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          }; else if (va.x >= x1) return;\n\
          vb = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          }; else if (va.x < x0) return;\n\
          vb = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          };\n\
        }\n\
      }\n\
    }\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    return true;\n\
  }\n\
  function d3_geom_voronoiEdge(lSite, rSite) {\n\
    this.l = lSite;\n\
    this.r = rSite;\n\
    this.a = this.b = null;\n\
  }\n\
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, rSite);\n\
    d3_geom_voronoiEdges.push(edge);\n\
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);\n\
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);\n\
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));\n\
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, null);\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    d3_geom_voronoiEdges.push(edge);\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {\n\
    if (!edge.a && !edge.b) {\n\
      edge.a = vertex;\n\
      edge.l = lSite;\n\
      edge.r = rSite;\n\
    } else if (edge.l === rSite) {\n\
      edge.b = vertex;\n\
    } else {\n\
      edge.a = vertex;\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {\n\
    var va = edge.a, vb = edge.b;\n\
    this.edge = edge;\n\
    this.site = lSite;\n\
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);\n\
  }\n\
  d3_geom_voronoiHalfEdge.prototype = {\n\
    start: function() {\n\
      return this.edge.l === this.site ? this.edge.a : this.edge.b;\n\
    },\n\
    end: function() {\n\
      return this.edge.l === this.site ? this.edge.b : this.edge.a;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackTree() {\n\
    this._ = null;\n\
  }\n\
  function d3_geom_voronoiRedBlackNode(node) {\n\
    node.U = node.C = node.L = node.R = node.P = node.N = null;\n\
  }\n\
  d3_geom_voronoiRedBlackTree.prototype = {\n\
    insert: function(after, node) {\n\
      var parent, grandpa, uncle;\n\
      if (after) {\n\
        node.P = after;\n\
        node.N = after.N;\n\
        if (after.N) after.N.P = node;\n\
        after.N = node;\n\
        if (after.R) {\n\
          after = after.R;\n\
          while (after.L) after = after.L;\n\
          after.L = node;\n\
        } else {\n\
          after.R = node;\n\
        }\n\
        parent = after;\n\
      } else if (this._) {\n\
        after = d3_geom_voronoiRedBlackFirst(this._);\n\
        node.P = null;\n\
        node.N = after;\n\
        after.P = after.L = node;\n\
        parent = after;\n\
      } else {\n\
        node.P = node.N = null;\n\
        this._ = node;\n\
        parent = null;\n\
      }\n\
      node.L = node.R = null;\n\
      node.U = parent;\n\
      node.C = true;\n\
      after = node;\n\
      while (parent && parent.C) {\n\
        grandpa = parent.U;\n\
        if (parent === grandpa.L) {\n\
          uncle = grandpa.R;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.R) {\n\
              d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);\n\
          }\n\
        } else {\n\
          uncle = grandpa.L;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.L) {\n\
              d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);\n\
          }\n\
        }\n\
        parent = after.U;\n\
      }\n\
      this._.C = false;\n\
    },\n\
    remove: function(node) {\n\
      if (node.N) node.N.P = node.P;\n\
      if (node.P) node.P.N = node.N;\n\
      node.N = node.P = null;\n\
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;\n\
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);\n\
      if (parent) {\n\
        if (parent.L === node) parent.L = next; else parent.R = next;\n\
      } else {\n\
        this._ = next;\n\
      }\n\
      if (left && right) {\n\
        red = next.C;\n\
        next.C = node.C;\n\
        next.L = left;\n\
        left.U = next;\n\
        if (next !== right) {\n\
          parent = next.U;\n\
          next.U = node.U;\n\
          node = next.R;\n\
          parent.L = node;\n\
          next.R = right;\n\
          right.U = next;\n\
        } else {\n\
          next.U = parent;\n\
          parent = next;\n\
          node = next.R;\n\
        }\n\
      } else {\n\
        red = node.C;\n\
        node = next;\n\
      }\n\
      if (node) node.U = parent;\n\
      if (red) return;\n\
      if (node && node.C) {\n\
        node.C = false;\n\
        return;\n\
      }\n\
      do {\n\
        if (node === this._) break;\n\
        if (node === parent.L) {\n\
          sibling = parent.R;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            sibling = parent.R;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.R || !sibling.R.C) {\n\
              sibling.L.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateRight(this, sibling);\n\
              sibling = parent.R;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.R.C = false;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        } else {\n\
          sibling = parent.L;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            sibling = parent.L;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.L || !sibling.L.C) {\n\
              sibling.R.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);\n\
              sibling = parent.L;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.L.C = false;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        }\n\
        sibling.C = true;\n\
        node = parent;\n\
        parent = parent.U;\n\
      } while (!node.C);\n\
      if (node) node.C = false;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {\n\
    var p = node, q = node.R, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.R = q.L;\n\
    if (p.R) p.R.U = p;\n\
    q.L = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {\n\
    var p = node, q = node.L, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.L = q.R;\n\
    if (p.L) p.L.U = p;\n\
    q.R = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackFirst(node) {\n\
    while (node.L) node = node.L;\n\
    return node;\n\
  }\n\
  function d3_geom_voronoi(sites, bbox) {\n\
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;\n\
    d3_geom_voronoiEdges = [];\n\
    d3_geom_voronoiCells = new Array(sites.length);\n\
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();\n\
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();\n\
    while (true) {\n\
      circle = d3_geom_voronoiFirstCircle;\n\
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {\n\
        if (site.x !== x0 || site.y !== y0) {\n\
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);\n\
          d3_geom_voronoiAddBeach(site);\n\
          x0 = site.x, y0 = site.y;\n\
        }\n\
        site = sites.pop();\n\
      } else if (circle) {\n\
        d3_geom_voronoiRemoveBeach(circle.arc);\n\
      } else {\n\
        break;\n\
      }\n\
    }\n\
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);\n\
    var diagram = {\n\
      cells: d3_geom_voronoiCells,\n\
      edges: d3_geom_voronoiEdges\n\
    };\n\
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;\n\
    return diagram;\n\
  }\n\
  function d3_geom_voronoiVertexOrder(a, b) {\n\
    return b.y - a.y || b.x - a.x;\n\
  }\n\
  d3.geom.voronoi = function(points) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;\n\
    if (points) return voronoi(points);\n\
    function voronoi(data) {\n\
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];\n\
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {\n\
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {\n\
          var s = e.start();\n\
          return [ s.x, s.y ];\n\
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];\n\
        polygon.point = data[i];\n\
      });\n\
      return polygons;\n\
    }\n\
    function sites(data) {\n\
      return data.map(function(d, i) {\n\
        return {\n\
          x: Math.round(fx(d, i) / ε) * ε,\n\
          y: Math.round(fy(d, i) / ε) * ε,\n\
          i: i\n\
        };\n\
      });\n\
    }\n\
    voronoi.links = function(data) {\n\
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {\n\
        return edge.l && edge.r;\n\
      }).map(function(edge) {\n\
        return {\n\
          source: data[edge.l.i],\n\
          target: data[edge.r.i]\n\
        };\n\
      });\n\
    };\n\
    voronoi.triangles = function(data) {\n\
      var triangles = [];\n\
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {\n\
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;\n\
        while (++j < m) {\n\
          e0 = e1;\n\
          s0 = s1;\n\
          e1 = edges[j].edge;\n\
          s1 = e1.l === site ? e1.r : e1.l;\n\
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {\n\
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);\n\
          }\n\
        }\n\
      });\n\
      return triangles;\n\
    };\n\
    voronoi.x = function(_) {\n\
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;\n\
    };\n\
    voronoi.y = function(_) {\n\
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;\n\
    };\n\
    voronoi.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;\n\
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;\n\
      return voronoi;\n\
    };\n\
    voronoi.size = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];\n\
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);\n\
    };\n\
    return voronoi;\n\
  };\n\
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];\n\
  function d3_geom_voronoiTriangleArea(a, b, c) {\n\
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);\n\
  }\n\
  d3.geom.delaunay = function(vertices) {\n\
    return d3.geom.voronoi().triangles(vertices);\n\
  };\n\
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;\n\
    if (compat = arguments.length) {\n\
      x = d3_geom_quadtreeCompatX;\n\
      y = d3_geom_quadtreeCompatY;\n\
      if (compat === 3) {\n\
        y2 = y1;\n\
        x2 = x1;\n\
        y1 = x1 = 0;\n\
      }\n\
      return quadtree(points);\n\
    }\n\
    function quadtree(data) {\n\
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;\n\
      if (x1 != null) {\n\
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;\n\
      } else {\n\
        x2_ = y2_ = -(x1_ = y1_ = Infinity);\n\
        xs = [], ys = [];\n\
        n = data.length;\n\
        if (compat) for (i = 0; i < n; ++i) {\n\
          d = data[i];\n\
          if (d.x < x1_) x1_ = d.x;\n\
          if (d.y < y1_) y1_ = d.y;\n\
          if (d.x > x2_) x2_ = d.x;\n\
          if (d.y > y2_) y2_ = d.y;\n\
          xs.push(d.x);\n\
          ys.push(d.y);\n\
        } else for (i = 0; i < n; ++i) {\n\
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);\n\
          if (x_ < x1_) x1_ = x_;\n\
          if (y_ < y1_) y1_ = y_;\n\
          if (x_ > x2_) x2_ = x_;\n\
          if (y_ > y2_) y2_ = y_;\n\
          xs.push(x_);\n\
          ys.push(y_);\n\
        }\n\
      }\n\
      var dx = x2_ - x1_, dy = y2_ - y1_;\n\
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;\n\
      function insert(n, d, x, y, x1, y1, x2, y2) {\n\
        if (isNaN(x) || isNaN(y)) return;\n\
        if (n.leaf) {\n\
          var nx = n.x, ny = n.y;\n\
          if (nx != null) {\n\
            if (abs(nx - x) + abs(ny - y) < .01) {\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            } else {\n\
              var nPoint = n.point;\n\
              n.x = n.y = n.point = null;\n\
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            }\n\
          } else {\n\
            n.x = x, n.y = y, n.point = d;\n\
          }\n\
        } else {\n\
          insertChild(n, d, x, y, x1, y1, x2, y2);\n\
        }\n\
      }\n\
      function insertChild(n, d, x, y, x1, y1, x2, y2) {\n\
        var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;\n\
        n.leaf = false;\n\
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());\n\
        if (right) x1 = sx; else x2 = sx;\n\
        if (bottom) y1 = sy; else y2 = sy;\n\
        insert(n, d, x, y, x1, y1, x2, y2);\n\
      }\n\
      var root = d3_geom_quadtreeNode();\n\
      root.add = function(d) {\n\
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);\n\
      };\n\
      root.visit = function(f) {\n\
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);\n\
      };\n\
      i = -1;\n\
      if (x1 == null) {\n\
        while (++i < n) {\n\
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);\n\
        }\n\
        --i;\n\
      } else data.forEach(root.add);\n\
      xs = ys = data = d = null;\n\
      return root;\n\
    }\n\
    quadtree.x = function(_) {\n\
      return arguments.length ? (x = _, quadtree) : x;\n\
    };\n\
    quadtree.y = function(_) {\n\
      return arguments.length ? (y = _, quadtree) : y;\n\
    };\n\
    quadtree.extent = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], \n\
      y2 = +_[1][1];\n\
      return quadtree;\n\
    };\n\
    quadtree.size = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];\n\
      return quadtree;\n\
    };\n\
    return quadtree;\n\
  };\n\
  function d3_geom_quadtreeCompatX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_geom_quadtreeCompatY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_geom_quadtreeNode() {\n\
    return {\n\
      leaf: true,\n\
      nodes: [],\n\
      point: null,\n\
      x: null,\n\
      y: null\n\
    };\n\
  }\n\
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {\n\
    if (!f(node, x1, y1, x2, y2)) {\n\
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;\n\
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);\n\
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);\n\
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);\n\
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);\n\
    }\n\
  }\n\
  d3.interpolateRgb = d3_interpolateRgb;\n\
  function d3_interpolateRgb(a, b) {\n\
    a = d3.rgb(a);\n\
    b = d3.rgb(b);\n\
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;\n\
    return function(t) {\n\
      return \"#\" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));\n\
    };\n\
  }\n\
  d3.interpolateObject = d3_interpolateObject;\n\
  function d3_interpolateObject(a, b) {\n\
    var i = {}, c = {}, k;\n\
    for (k in a) {\n\
      if (k in b) {\n\
        i[k] = d3_interpolate(a[k], b[k]);\n\
      } else {\n\
        c[k] = a[k];\n\
      }\n\
    }\n\
    for (k in b) {\n\
      if (!(k in a)) {\n\
        c[k] = b[k];\n\
      }\n\
    }\n\
    return function(t) {\n\
      for (k in i) c[k] = i[k](t);\n\
      return c;\n\
    };\n\
  }\n\
  d3.interpolateNumber = d3_interpolateNumber;\n\
  function d3_interpolateNumber(a, b) {\n\
    b -= a = +a;\n\
    return function(t) {\n\
      return a + b * t;\n\
    };\n\
  }\n\
  d3.interpolateString = d3_interpolateString;\n\
  function d3_interpolateString(a, b) {\n\
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];\n\
    a = a + \"\", b = b + \"\";\n\
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {\n\
      if ((bs = bm.index) > bi) {\n\
        bs = b.substring(bi, bs);\n\
        if (s[i]) s[i] += bs; else s[++i] = bs;\n\
      }\n\
      if ((am = am[0]) === (bm = bm[0])) {\n\
        if (s[i]) s[i] += bm; else s[++i] = bm;\n\
      } else {\n\
        s[++i] = null;\n\
        q.push({\n\
          i: i,\n\
          x: d3_interpolateNumber(am, bm)\n\
        });\n\
      }\n\
      bi = d3_interpolate_numberB.lastIndex;\n\
    }\n\
    if (bi < b.length) {\n\
      bs = b.substring(bi);\n\
      if (s[i]) s[i] += bs; else s[++i] = bs;\n\
    }\n\
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {\n\
      return b(t) + \"\";\n\
    }) : function() {\n\
      return b;\n\
    } : (b = q.length, function(t) {\n\
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    });\n\
  }\n\
  var d3_interpolate_numberA = /[-+]?(?:\\d+\\.?\\d*|\\.?\\d+)(?:[eE][-+]?\\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, \"g\");\n\
  d3.interpolate = d3_interpolate;\n\
  function d3_interpolate(a, b) {\n\
    var i = d3.interpolators.length, f;\n\
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;\n\
    return f;\n\
  }\n\
  d3.interpolators = [ function(a, b) {\n\
    var t = typeof b;\n\
    return (t === \"string\" ? d3_rgb_names.has(b) || /^(#|rgb\\(|hsl\\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === \"object\" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);\n\
  } ];\n\
  d3.interpolateArray = d3_interpolateArray;\n\
  function d3_interpolateArray(a, b) {\n\
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;\n\
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));\n\
    for (;i < na; ++i) c[i] = a[i];\n\
    for (;i < nb; ++i) c[i] = b[i];\n\
    return function(t) {\n\
      for (i = 0; i < n0; ++i) c[i] = x[i](t);\n\
      return c;\n\
    };\n\
  }\n\
  var d3_ease_default = function() {\n\
    return d3_identity;\n\
  };\n\
  var d3_ease = d3.map({\n\
    linear: d3_ease_default,\n\
    poly: d3_ease_poly,\n\
    quad: function() {\n\
      return d3_ease_quad;\n\
    },\n\
    cubic: function() {\n\
      return d3_ease_cubic;\n\
    },\n\
    sin: function() {\n\
      return d3_ease_sin;\n\
    },\n\
    exp: function() {\n\
      return d3_ease_exp;\n\
    },\n\
    circle: function() {\n\
      return d3_ease_circle;\n\
    },\n\
    elastic: d3_ease_elastic,\n\
    back: d3_ease_back,\n\
    bounce: function() {\n\
      return d3_ease_bounce;\n\
    }\n\
  });\n\
  var d3_ease_mode = d3.map({\n\
    \"in\": d3_identity,\n\
    out: d3_ease_reverse,\n\
    \"in-out\": d3_ease_reflect,\n\
    \"out-in\": function(f) {\n\
      return d3_ease_reflect(d3_ease_reverse(f));\n\
    }\n\
  });\n\
  d3.ease = function(name) {\n\
    var i = name.indexOf(\"-\"), t = i >= 0 ? name.substring(0, i) : name, m = i >= 0 ? name.substring(i + 1) : \"in\";\n\
    t = d3_ease.get(t) || d3_ease_default;\n\
    m = d3_ease_mode.get(m) || d3_identity;\n\
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));\n\
  };\n\
  function d3_ease_clamp(f) {\n\
    return function(t) {\n\
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);\n\
    };\n\
  }\n\
  function d3_ease_reverse(f) {\n\
    return function(t) {\n\
      return 1 - f(1 - t);\n\
    };\n\
  }\n\
  function d3_ease_reflect(f) {\n\
    return function(t) {\n\
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));\n\
    };\n\
  }\n\
  function d3_ease_quad(t) {\n\
    return t * t;\n\
  }\n\
  function d3_ease_cubic(t) {\n\
    return t * t * t;\n\
  }\n\
  function d3_ease_cubicInOut(t) {\n\
    if (t <= 0) return 0;\n\
    if (t >= 1) return 1;\n\
    var t2 = t * t, t3 = t2 * t;\n\
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);\n\
  }\n\
  function d3_ease_poly(e) {\n\
    return function(t) {\n\
      return Math.pow(t, e);\n\
    };\n\
  }\n\
  function d3_ease_sin(t) {\n\
    return 1 - Math.cos(t * halfπ);\n\
  }\n\
  function d3_ease_exp(t) {\n\
    return Math.pow(2, 10 * (t - 1));\n\
  }\n\
  function d3_ease_circle(t) {\n\
    return 1 - Math.sqrt(1 - t * t);\n\
  }\n\
  function d3_ease_elastic(a, p) {\n\
    var s;\n\
    if (arguments.length < 2) p = .45;\n\
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;\n\
    return function(t) {\n\
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);\n\
    };\n\
  }\n\
  function d3_ease_back(s) {\n\
    if (!s) s = 1.70158;\n\
    return function(t) {\n\
      return t * t * ((s + 1) * t - s);\n\
    };\n\
  }\n\
  function d3_ease_bounce(t) {\n\
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;\n\
  }\n\
  d3.interpolateHcl = d3_interpolateHcl;\n\
  function d3_interpolateHcl(a, b) {\n\
    a = d3.hcl(a);\n\
    b = d3.hcl(b);\n\
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;\n\
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateHsl = d3_interpolateHsl;\n\
  function d3_interpolateHsl(a, b) {\n\
    a = d3.hsl(a);\n\
    b = d3.hsl(b);\n\
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;\n\
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateLab = d3_interpolateLab;\n\
  function d3_interpolateLab(a, b) {\n\
    a = d3.lab(a);\n\
    b = d3.lab(b);\n\
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;\n\
    return function(t) {\n\
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateRound = d3_interpolateRound;\n\
  function d3_interpolateRound(a, b) {\n\
    b -= a;\n\
    return function(t) {\n\
      return Math.round(a + b * t);\n\
    };\n\
  }\n\
  d3.transform = function(string) {\n\
    var g = d3_document.createElementNS(d3.ns.prefix.svg, \"g\");\n\
    return (d3.transform = function(string) {\n\
      if (string != null) {\n\
        g.setAttribute(\"transform\", string);\n\
        var t = g.transform.baseVal.consolidate();\n\
      }\n\
      return new d3_transform(t ? t.matrix : d3_transformIdentity);\n\
    })(string);\n\
  };\n\
  function d3_transform(m) {\n\
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;\n\
    if (r0[0] * r1[1] < r1[0] * r0[1]) {\n\
      r0[0] *= -1;\n\
      r0[1] *= -1;\n\
      kx *= -1;\n\
      kz *= -1;\n\
    }\n\
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;\n\
    this.translate = [ m.e, m.f ];\n\
    this.scale = [ kx, ky ];\n\
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;\n\
  }\n\
  d3_transform.prototype.toString = function() {\n\
    return \"translate(\" + this.translate + \")rotate(\" + this.rotate + \")skewX(\" + this.skew + \")scale(\" + this.scale + \")\";\n\
  };\n\
  function d3_transformDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1];\n\
  }\n\
  function d3_transformNormalize(a) {\n\
    var k = Math.sqrt(d3_transformDot(a, a));\n\
    if (k) {\n\
      a[0] /= k;\n\
      a[1] /= k;\n\
    }\n\
    return k;\n\
  }\n\
  function d3_transformCombine(a, b, k) {\n\
    a[0] += k * b[0];\n\
    a[1] += k * b[1];\n\
    return a;\n\
  }\n\
  var d3_transformIdentity = {\n\
    a: 1,\n\
    b: 0,\n\
    c: 0,\n\
    d: 1,\n\
    e: 0,\n\
    f: 0\n\
  };\n\
  d3.interpolateTransform = d3_interpolateTransform;\n\
  function d3_interpolateTransform(a, b) {\n\
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;\n\
    if (ta[0] != tb[0] || ta[1] != tb[1]) {\n\
      s.push(\"translate(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: 1,\n\
        x: d3_interpolateNumber(ta[0], tb[0])\n\
      }, {\n\
        i: 3,\n\
        x: d3_interpolateNumber(ta[1], tb[1])\n\
      });\n\
    } else if (tb[0] || tb[1]) {\n\
      s.push(\"translate(\" + tb + \")\");\n\
    } else {\n\
      s.push(\"\");\n\
    }\n\
    if (ra != rb) {\n\
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;\n\
      q.push({\n\
        i: s.push(s.pop() + \"rotate(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(ra, rb)\n\
      });\n\
    } else if (rb) {\n\
      s.push(s.pop() + \"rotate(\" + rb + \")\");\n\
    }\n\
    if (wa != wb) {\n\
      q.push({\n\
        i: s.push(s.pop() + \"skewX(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(wa, wb)\n\
      });\n\
    } else if (wb) {\n\
      s.push(s.pop() + \"skewX(\" + wb + \")\");\n\
    }\n\
    if (ka[0] != kb[0] || ka[1] != kb[1]) {\n\
      n = s.push(s.pop() + \"scale(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: n - 4,\n\
        x: d3_interpolateNumber(ka[0], kb[0])\n\
      }, {\n\
        i: n - 2,\n\
        x: d3_interpolateNumber(ka[1], kb[1])\n\
      });\n\
    } else if (kb[0] != 1 || kb[1] != 1) {\n\
      s.push(s.pop() + \"scale(\" + kb + \")\");\n\
    }\n\
    n = q.length;\n\
    return function(t) {\n\
      var i = -1, o;\n\
      while (++i < n) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    };\n\
  }\n\
  function d3_uninterpolateNumber(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return (x - a) * b;\n\
    };\n\
  }\n\
  function d3_uninterpolateClamp(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return Math.max(0, Math.min(1, (x - a) * b));\n\
    };\n\
  }\n\
  d3.layout = {};\n\
  d3.layout.bundle = function() {\n\
    return function(links) {\n\
      var paths = [], i = -1, n = links.length;\n\
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));\n\
      return paths;\n\
    };\n\
  };\n\
  function d3_layout_bundlePath(link) {\n\
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];\n\
    while (start !== lca) {\n\
      start = start.parent;\n\
      points.push(start);\n\
    }\n\
    var k = points.length;\n\
    while (end !== lca) {\n\
      points.splice(k, 0, end);\n\
      end = end.parent;\n\
    }\n\
    return points;\n\
  }\n\
  function d3_layout_bundleAncestors(node) {\n\
    var ancestors = [], parent = node.parent;\n\
    while (parent != null) {\n\
      ancestors.push(node);\n\
      node = parent;\n\
      parent = parent.parent;\n\
    }\n\
    ancestors.push(node);\n\
    return ancestors;\n\
  }\n\
  function d3_layout_bundleLeastCommonAncestor(a, b) {\n\
    if (a === b) return a;\n\
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;\n\
    while (aNode === bNode) {\n\
      sharedNode = aNode;\n\
      aNode = aNodes.pop();\n\
      bNode = bNodes.pop();\n\
    }\n\
    return sharedNode;\n\
  }\n\
  d3.layout.chord = function() {\n\
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;\n\
    function relayout() {\n\
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;\n\
      chords = [];\n\
      groups = [];\n\
      k = 0, i = -1;\n\
      while (++i < n) {\n\
        x = 0, j = -1;\n\
        while (++j < n) {\n\
          x += matrix[i][j];\n\
        }\n\
        groupSums.push(x);\n\
        subgroupIndex.push(d3.range(n));\n\
        k += x;\n\
      }\n\
      if (sortGroups) {\n\
        groupIndex.sort(function(a, b) {\n\
          return sortGroups(groupSums[a], groupSums[b]);\n\
        });\n\
      }\n\
      if (sortSubgroups) {\n\
        subgroupIndex.forEach(function(d, i) {\n\
          d.sort(function(a, b) {\n\
            return sortSubgroups(matrix[i][a], matrix[i][b]);\n\
          });\n\
        });\n\
      }\n\
      k = (τ - padding * n) / k;\n\
      x = 0, i = -1;\n\
      while (++i < n) {\n\
        x0 = x, j = -1;\n\
        while (++j < n) {\n\
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;\n\
          subgroups[di + \"-\" + dj] = {\n\
            index: di,\n\
            subindex: dj,\n\
            startAngle: a0,\n\
            endAngle: a1,\n\
            value: v\n\
          };\n\
        }\n\
        groups[di] = {\n\
          index: di,\n\
          startAngle: x0,\n\
          endAngle: x,\n\
          value: (x - x0) / k\n\
        };\n\
        x += padding;\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        j = i - 1;\n\
        while (++j < n) {\n\
          var source = subgroups[i + \"-\" + j], target = subgroups[j + \"-\" + i];\n\
          if (source.value || target.value) {\n\
            chords.push(source.value < target.value ? {\n\
              source: target,\n\
              target: source\n\
            } : {\n\
              source: source,\n\
              target: target\n\
            });\n\
          }\n\
        }\n\
      }\n\
      if (sortChords) resort();\n\
    }\n\
    function resort() {\n\
      chords.sort(function(a, b) {\n\
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);\n\
      });\n\
    }\n\
    chord.matrix = function(x) {\n\
      if (!arguments.length) return matrix;\n\
      n = (matrix = x) && matrix.length;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      padding = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortGroups = function(x) {\n\
      if (!arguments.length) return sortGroups;\n\
      sortGroups = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortSubgroups = function(x) {\n\
      if (!arguments.length) return sortSubgroups;\n\
      sortSubgroups = x;\n\
      chords = null;\n\
      return chord;\n\
    };\n\
    chord.sortChords = function(x) {\n\
      if (!arguments.length) return sortChords;\n\
      sortChords = x;\n\
      if (chords) resort();\n\
      return chord;\n\
    };\n\
    chord.chords = function() {\n\
      if (!chords) relayout();\n\
      return chords;\n\
    };\n\
    chord.groups = function() {\n\
      if (!groups) relayout();\n\
      return groups;\n\
    };\n\
    return chord;\n\
  };\n\
  d3.layout.force = function() {\n\
    var force = {}, event = d3.dispatch(\"start\", \"tick\", \"end\"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;\n\
    function repulse(node) {\n\
      return function(quad, x1, _, x2) {\n\
        if (quad.point !== node) {\n\
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;\n\
          if (dw * dw / theta2 < dn) {\n\
            if (dn < chargeDistance2) {\n\
              var k = quad.charge / dn;\n\
              node.px -= dx * k;\n\
              node.py -= dy * k;\n\
            }\n\
            return true;\n\
          }\n\
          if (quad.point && dn && dn < chargeDistance2) {\n\
            var k = quad.pointCharge / dn;\n\
            node.px -= dx * k;\n\
            node.py -= dy * k;\n\
          }\n\
        }\n\
        return !quad.charge;\n\
      };\n\
    }\n\
    force.tick = function() {\n\
      if ((alpha *= .99) < .005) {\n\
        event.end({\n\
          type: \"end\",\n\
          alpha: alpha = 0\n\
        });\n\
        return true;\n\
      }\n\
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        s = o.source;\n\
        t = o.target;\n\
        x = t.x - s.x;\n\
        y = t.y - s.y;\n\
        if (l = x * x + y * y) {\n\
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;\n\
          x *= l;\n\
          y *= l;\n\
          t.x -= x * (k = s.weight / (t.weight + s.weight));\n\
          t.y -= y * k;\n\
          s.x += x * (k = 1 - k);\n\
          s.y += y * k;\n\
        }\n\
      }\n\
      if (k = alpha * gravity) {\n\
        x = size[0] / 2;\n\
        y = size[1] / 2;\n\
        i = -1;\n\
        if (k) while (++i < n) {\n\
          o = nodes[i];\n\
          o.x += (x - o.x) * k;\n\
          o.y += (y - o.y) * k;\n\
        }\n\
      }\n\
      if (charge) {\n\
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);\n\
        i = -1;\n\
        while (++i < n) {\n\
          if (!(o = nodes[i]).fixed) {\n\
            q.visit(repulse(o));\n\
          }\n\
        }\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        o = nodes[i];\n\
        if (o.fixed) {\n\
          o.x = o.px;\n\
          o.y = o.py;\n\
        } else {\n\
          o.x -= (o.px - (o.px = o.x)) * friction;\n\
          o.y -= (o.py - (o.py = o.y)) * friction;\n\
        }\n\
      }\n\
      event.tick({\n\
        type: \"tick\",\n\
        alpha: alpha\n\
      });\n\
    };\n\
    force.nodes = function(x) {\n\
      if (!arguments.length) return nodes;\n\
      nodes = x;\n\
      return force;\n\
    };\n\
    force.links = function(x) {\n\
      if (!arguments.length) return links;\n\
      links = x;\n\
      return force;\n\
    };\n\
    force.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return force;\n\
    };\n\
    force.linkDistance = function(x) {\n\
      if (!arguments.length) return linkDistance;\n\
      linkDistance = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.distance = force.linkDistance;\n\
    force.linkStrength = function(x) {\n\
      if (!arguments.length) return linkStrength;\n\
      linkStrength = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.friction = function(x) {\n\
      if (!arguments.length) return friction;\n\
      friction = +x;\n\
      return force;\n\
    };\n\
    force.charge = function(x) {\n\
      if (!arguments.length) return charge;\n\
      charge = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.chargeDistance = function(x) {\n\
      if (!arguments.length) return Math.sqrt(chargeDistance2);\n\
      chargeDistance2 = x * x;\n\
      return force;\n\
    };\n\
    force.gravity = function(x) {\n\
      if (!arguments.length) return gravity;\n\
      gravity = +x;\n\
      return force;\n\
    };\n\
    force.theta = function(x) {\n\
      if (!arguments.length) return Math.sqrt(theta2);\n\
      theta2 = x * x;\n\
      return force;\n\
    };\n\
    force.alpha = function(x) {\n\
      if (!arguments.length) return alpha;\n\
      x = +x;\n\
      if (alpha) {\n\
        if (x > 0) alpha = x; else alpha = 0;\n\
      } else if (x > 0) {\n\
        event.start({\n\
          type: \"start\",\n\
          alpha: alpha = x\n\
        });\n\
        d3.timer(force.tick);\n\
      }\n\
      return force;\n\
    };\n\
    force.start = function() {\n\
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;\n\
      for (i = 0; i < n; ++i) {\n\
        (o = nodes[i]).index = i;\n\
        o.weight = 0;\n\
      }\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        if (typeof o.source == \"number\") o.source = nodes[o.source];\n\
        if (typeof o.target == \"number\") o.target = nodes[o.target];\n\
        ++o.source.weight;\n\
        ++o.target.weight;\n\
      }\n\
      for (i = 0; i < n; ++i) {\n\
        o = nodes[i];\n\
        if (isNaN(o.x)) o.x = position(\"x\", w);\n\
        if (isNaN(o.y)) o.y = position(\"y\", h);\n\
        if (isNaN(o.px)) o.px = o.x;\n\
        if (isNaN(o.py)) o.py = o.y;\n\
      }\n\
      distances = [];\n\
      if (typeof linkDistance === \"function\") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;\n\
      strengths = [];\n\
      if (typeof linkStrength === \"function\") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;\n\
      charges = [];\n\
      if (typeof charge === \"function\") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;\n\
      function position(dimension, size) {\n\
        if (!neighbors) {\n\
          neighbors = new Array(n);\n\
          for (j = 0; j < n; ++j) {\n\
            neighbors[j] = [];\n\
          }\n\
          for (j = 0; j < m; ++j) {\n\
            var o = links[j];\n\
            neighbors[o.source.index].push(o.target);\n\
            neighbors[o.target.index].push(o.source);\n\
          }\n\
        }\n\
        var candidates = neighbors[i], j = -1, m = candidates.length, x;\n\
        while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;\n\
        return Math.random() * size;\n\
      }\n\
      return force.resume();\n\
    };\n\
    force.resume = function() {\n\
      return force.alpha(.1);\n\
    };\n\
    force.stop = function() {\n\
      return force.alpha(0);\n\
    };\n\
    force.drag = function() {\n\
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on(\"dragstart.force\", d3_layout_forceDragstart).on(\"drag.force\", dragmove).on(\"dragend.force\", d3_layout_forceDragend);\n\
      if (!arguments.length) return drag;\n\
      this.on(\"mouseover.force\", d3_layout_forceMouseover).on(\"mouseout.force\", d3_layout_forceMouseout).call(drag);\n\
    };\n\
    function dragmove(d) {\n\
      d.px = d3.event.x, d.py = d3.event.y;\n\
      force.resume();\n\
    }\n\
    return d3.rebind(force, event, \"on\");\n\
  };\n\
  function d3_layout_forceDragstart(d) {\n\
    d.fixed |= 2;\n\
  }\n\
  function d3_layout_forceDragend(d) {\n\
    d.fixed &= ~6;\n\
  }\n\
  function d3_layout_forceMouseover(d) {\n\
    d.fixed |= 4;\n\
    d.px = d.x, d.py = d.y;\n\
  }\n\
  function d3_layout_forceMouseout(d) {\n\
    d.fixed &= ~4;\n\
  }\n\
  function d3_layout_forceAccumulate(quad, alpha, charges) {\n\
    var cx = 0, cy = 0;\n\
    quad.charge = 0;\n\
    if (!quad.leaf) {\n\
      var nodes = quad.nodes, n = nodes.length, i = -1, c;\n\
      while (++i < n) {\n\
        c = nodes[i];\n\
        if (c == null) continue;\n\
        d3_layout_forceAccumulate(c, alpha, charges);\n\
        quad.charge += c.charge;\n\
        cx += c.charge * c.cx;\n\
        cy += c.charge * c.cy;\n\
      }\n\
    }\n\
    if (quad.point) {\n\
      if (!quad.leaf) {\n\
        quad.point.x += Math.random() - .5;\n\
        quad.point.y += Math.random() - .5;\n\
      }\n\
      var k = alpha * charges[quad.point.index];\n\
      quad.charge += quad.pointCharge = k;\n\
      cx += k * quad.point.x;\n\
      cy += k * quad.point.y;\n\
    }\n\
    quad.cx = cx / quad.charge;\n\
    quad.cy = cy / quad.charge;\n\
  }\n\
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;\n\
  d3.layout.hierarchy = function() {\n\
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;\n\
    function hierarchy(root) {\n\
      var stack = [ root ], nodes = [], node;\n\
      root.depth = 0;\n\
      while ((node = stack.pop()) != null) {\n\
        nodes.push(node);\n\
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {\n\
          var n, childs, child;\n\
          while (--n >= 0) {\n\
            stack.push(child = childs[n]);\n\
            child.parent = node;\n\
            child.depth = node.depth + 1;\n\
          }\n\
          if (value) node.value = 0;\n\
          node.children = childs;\n\
        } else {\n\
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;\n\
          delete node.children;\n\
        }\n\
      }\n\
      d3_layout_hierarchyVisitAfter(root, function(node) {\n\
        var childs, parent;\n\
        if (sort && (childs = node.children)) childs.sort(sort);\n\
        if (value && (parent = node.parent)) parent.value += node.value;\n\
      });\n\
      return nodes;\n\
    }\n\
    hierarchy.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.children = function(x) {\n\
      if (!arguments.length) return children;\n\
      children = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.revalue = function(root) {\n\
      if (value) {\n\
        d3_layout_hierarchyVisitBefore(root, function(node) {\n\
          if (node.children) node.value = 0;\n\
        });\n\
        d3_layout_hierarchyVisitAfter(root, function(node) {\n\
          var parent;\n\
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;\n\
          if (parent = node.parent) parent.value += node.value;\n\
        });\n\
      }\n\
      return root;\n\
    };\n\
    return hierarchy;\n\
  };\n\
  function d3_layout_hierarchyRebind(object, hierarchy) {\n\
    d3.rebind(object, hierarchy, \"sort\", \"children\", \"value\");\n\
    object.nodes = object;\n\
    object.links = d3_layout_hierarchyLinks;\n\
    return object;\n\
  }\n\
  function d3_layout_hierarchyVisitBefore(node, callback) {\n\
    var nodes = [ node ];\n\
    while ((node = nodes.pop()) != null) {\n\
      callback(node);\n\
      if ((children = node.children) && (n = children.length)) {\n\
        var n, children;\n\
        while (--n >= 0) nodes.push(children[n]);\n\
      }\n\
    }\n\
  }\n\
  function d3_layout_hierarchyVisitAfter(node, callback) {\n\
    var nodes = [ node ], nodes2 = [];\n\
    while ((node = nodes.pop()) != null) {\n\
      nodes2.push(node);\n\
      if ((children = node.children) && (n = children.length)) {\n\
        var i = -1, n, children;\n\
        while (++i < n) nodes.push(children[i]);\n\
      }\n\
    }\n\
    while ((node = nodes2.pop()) != null) {\n\
      callback(node);\n\
    }\n\
  }\n\
  function d3_layout_hierarchyChildren(d) {\n\
    return d.children;\n\
  }\n\
  function d3_layout_hierarchyValue(d) {\n\
    return d.value;\n\
  }\n\
  function d3_layout_hierarchySort(a, b) {\n\
    return b.value - a.value;\n\
  }\n\
  function d3_layout_hierarchyLinks(nodes) {\n\
    return d3.merge(nodes.map(function(parent) {\n\
      return (parent.children || []).map(function(child) {\n\
        return {\n\
          source: parent,\n\
          target: child\n\
        };\n\
      });\n\
    }));\n\
  }\n\
  d3.layout.partition = function() {\n\
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];\n\
    function position(node, x, dx, dy) {\n\
      var children = node.children;\n\
      node.x = x;\n\
      node.y = node.depth * dy;\n\
      node.dx = dx;\n\
      node.dy = dy;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n, c, d;\n\
        dx = node.value ? dx / node.value : 0;\n\
        while (++i < n) {\n\
          position(c = children[i], x, d = c.value * dx, dy);\n\
          x += d;\n\
        }\n\
      }\n\
    }\n\
    function depth(node) {\n\
      var children = node.children, d = 0;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n;\n\
        while (++i < n) d = Math.max(d, depth(children[i]));\n\
      }\n\
      return 1 + d;\n\
    }\n\
    function partition(d, i) {\n\
      var nodes = hierarchy.call(this, d, i);\n\
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));\n\
      return nodes;\n\
    }\n\
    partition.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return partition;\n\
    };\n\
    return d3_layout_hierarchyRebind(partition, hierarchy);\n\
  };\n\
  d3.layout.pie = function() {\n\
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ;\n\
    function pie(data) {\n\
      var values = data.map(function(d, i) {\n\
        return +value.call(pie, d, i);\n\
      });\n\
      var a = +(typeof startAngle === \"function\" ? startAngle.apply(this, arguments) : startAngle);\n\
      var k = ((typeof endAngle === \"function\" ? endAngle.apply(this, arguments) : endAngle) - a) / d3.sum(values);\n\
      var index = d3.range(data.length);\n\
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {\n\
        return values[j] - values[i];\n\
      } : function(i, j) {\n\
        return sort(data[i], data[j]);\n\
      });\n\
      var arcs = [];\n\
      index.forEach(function(i) {\n\
        var d;\n\
        arcs[i] = {\n\
          data: data[i],\n\
          value: d = values[i],\n\
          startAngle: a,\n\
          endAngle: a += d * k\n\
        };\n\
      });\n\
      return arcs;\n\
    }\n\
    pie.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return pie;\n\
    };\n\
    pie.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return pie;\n\
    };\n\
    pie.startAngle = function(x) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = x;\n\
      return pie;\n\
    };\n\
    pie.endAngle = function(x) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = x;\n\
      return pie;\n\
    };\n\
    return pie;\n\
  };\n\
  var d3_layout_pieSortByValue = {};\n\
  d3.layout.stack = function() {\n\
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;\n\
    function stack(data, index) {\n\
      var series = data.map(function(d, i) {\n\
        return values.call(stack, d, i);\n\
      });\n\
      var points = series.map(function(d) {\n\
        return d.map(function(v, i) {\n\
          return [ x.call(stack, v, i), y.call(stack, v, i) ];\n\
        });\n\
      });\n\
      var orders = order.call(stack, points, index);\n\
      series = d3.permute(series, orders);\n\
      points = d3.permute(points, orders);\n\
      var offsets = offset.call(stack, points, index);\n\
      var n = series.length, m = series[0].length, i, j, o;\n\
      for (j = 0; j < m; ++j) {\n\
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);\n\
        for (i = 1; i < n; ++i) {\n\
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);\n\
        }\n\
      }\n\
      return data;\n\
    }\n\
    stack.values = function(x) {\n\
      if (!arguments.length) return values;\n\
      values = x;\n\
      return stack;\n\
    };\n\
    stack.order = function(x) {\n\
      if (!arguments.length) return order;\n\
      order = typeof x === \"function\" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;\n\
      return stack;\n\
    };\n\
    stack.offset = function(x) {\n\
      if (!arguments.length) return offset;\n\
      offset = typeof x === \"function\" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;\n\
      return stack;\n\
    };\n\
    stack.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      return stack;\n\
    };\n\
    stack.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      return stack;\n\
    };\n\
    stack.out = function(z) {\n\
      if (!arguments.length) return out;\n\
      out = z;\n\
      return stack;\n\
    };\n\
    return stack;\n\
  };\n\
  function d3_layout_stackX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_layout_stackY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_layout_stackOut(d, y0, y) {\n\
    d.y0 = y0;\n\
    d.y = y;\n\
  }\n\
  var d3_layout_stackOrders = d3.map({\n\
    \"inside-out\": function(data) {\n\
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {\n\
        return max[a] - max[b];\n\
      }), top = 0, bottom = 0, tops = [], bottoms = [];\n\
      for (i = 0; i < n; ++i) {\n\
        j = index[i];\n\
        if (top < bottom) {\n\
          top += sums[j];\n\
          tops.push(j);\n\
        } else {\n\
          bottom += sums[j];\n\
          bottoms.push(j);\n\
        }\n\
      }\n\
      return bottoms.reverse().concat(tops);\n\
    },\n\
    reverse: function(data) {\n\
      return d3.range(data.length).reverse();\n\
    },\n\
    \"default\": d3_layout_stackOrderDefault\n\
  });\n\
  var d3_layout_stackOffsets = d3.map({\n\
    silhouette: function(data) {\n\
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o > max) max = o;\n\
        sums.push(o);\n\
      }\n\
      for (j = 0; j < m; ++j) {\n\
        y0[j] = (max - sums[j]) / 2;\n\
      }\n\
      return y0;\n\
    },\n\
    wiggle: function(data) {\n\
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];\n\
      y0[0] = o = o0 = 0;\n\
      for (j = 1; j < m; ++j) {\n\
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];\n\
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {\n\
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {\n\
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;\n\
          }\n\
          s2 += s3 * data[i][j][1];\n\
        }\n\
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;\n\
        if (o < o0) o0 = o;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] -= o0;\n\
      return y0;\n\
    },\n\
    expand: function(data) {\n\
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] = 0;\n\
      return y0;\n\
    },\n\
    zero: d3_layout_stackOffsetZero\n\
  });\n\
  function d3_layout_stackOrderDefault(data) {\n\
    return d3.range(data.length);\n\
  }\n\
  function d3_layout_stackOffsetZero(data) {\n\
    var j = -1, m = data[0].length, y0 = [];\n\
    while (++j < m) y0[j] = 0;\n\
    return y0;\n\
  }\n\
  function d3_layout_stackMaxIndex(array) {\n\
    var i = 1, j = 0, v = array[0][1], k, n = array.length;\n\
    for (;i < n; ++i) {\n\
      if ((k = array[i][1]) > v) {\n\
        j = i;\n\
        v = k;\n\
      }\n\
    }\n\
    return j;\n\
  }\n\
  function d3_layout_stackReduceSum(d) {\n\
    return d.reduce(d3_layout_stackSum, 0);\n\
  }\n\
  function d3_layout_stackSum(p, d) {\n\
    return p + d[1];\n\
  }\n\
  d3.layout.histogram = function() {\n\
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;\n\
    function histogram(data, i) {\n\
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;\n\
      while (++i < m) {\n\
        bin = bins[i] = [];\n\
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);\n\
        bin.y = 0;\n\
      }\n\
      if (m > 0) {\n\
        i = -1;\n\
        while (++i < n) {\n\
          x = values[i];\n\
          if (x >= range[0] && x <= range[1]) {\n\
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];\n\
            bin.y += k;\n\
            bin.push(data[i]);\n\
          }\n\
        }\n\
      }\n\
      return bins;\n\
    }\n\
    histogram.value = function(x) {\n\
      if (!arguments.length) return valuer;\n\
      valuer = x;\n\
      return histogram;\n\
    };\n\
    histogram.range = function(x) {\n\
      if (!arguments.length) return ranger;\n\
      ranger = d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.bins = function(x) {\n\
      if (!arguments.length) return binner;\n\
      binner = typeof x === \"number\" ? function(range) {\n\
        return d3_layout_histogramBinFixed(range, x);\n\
      } : d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.frequency = function(x) {\n\
      if (!arguments.length) return frequency;\n\
      frequency = !!x;\n\
      return histogram;\n\
    };\n\
    return histogram;\n\
  };\n\
  function d3_layout_histogramBinSturges(range, values) {\n\
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));\n\
  }\n\
  function d3_layout_histogramBinFixed(range, n) {\n\
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];\n\
    while (++x <= n) f[x] = m * x + b;\n\
    return f;\n\
  }\n\
  function d3_layout_histogramRange(values) {\n\
    return [ d3.min(values), d3.max(values) ];\n\
  }\n\
  d3.layout.pack = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;\n\
    function pack(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === \"function\" ? radius : function() {\n\
        return radius;\n\
      };\n\
      root.x = root.y = 0;\n\
      d3_layout_hierarchyVisitAfter(root, function(d) {\n\
        d.r = +r(d.value);\n\
      });\n\
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);\n\
      if (padding) {\n\
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;\n\
        d3_layout_hierarchyVisitAfter(root, function(d) {\n\
          d.r += dr;\n\
        });\n\
        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);\n\
        d3_layout_hierarchyVisitAfter(root, function(d) {\n\
          d.r -= dr;\n\
        });\n\
      }\n\
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));\n\
      return nodes;\n\
    }\n\
    pack.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _;\n\
      return pack;\n\
    };\n\
    pack.radius = function(_) {\n\
      if (!arguments.length) return radius;\n\
      radius = _ == null || typeof _ === \"function\" ? _ : +_;\n\
      return pack;\n\
    };\n\
    pack.padding = function(_) {\n\
      if (!arguments.length) return padding;\n\
      padding = +_;\n\
      return pack;\n\
    };\n\
    return d3_layout_hierarchyRebind(pack, hierarchy);\n\
  };\n\
  function d3_layout_packSort(a, b) {\n\
    return a.value - b.value;\n\
  }\n\
  function d3_layout_packInsert(a, b) {\n\
    var c = a._pack_next;\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
    b._pack_next = c;\n\
    c._pack_prev = b;\n\
  }\n\
  function d3_layout_packSplice(a, b) {\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
  }\n\
  function d3_layout_packIntersects(a, b) {\n\
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;\n\
    return .999 * dr * dr > dx * dx + dy * dy;\n\
  }\n\
  function d3_layout_packSiblings(node) {\n\
    if (!(nodes = node.children) || !(n = nodes.length)) return;\n\
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;\n\
    function bound(node) {\n\
      xMin = Math.min(node.x - node.r, xMin);\n\
      xMax = Math.max(node.x + node.r, xMax);\n\
      yMin = Math.min(node.y - node.r, yMin);\n\
      yMax = Math.max(node.y + node.r, yMax);\n\
    }\n\
    nodes.forEach(d3_layout_packLink);\n\
    a = nodes[0];\n\
    a.x = -a.r;\n\
    a.y = 0;\n\
    bound(a);\n\
    if (n > 1) {\n\
      b = nodes[1];\n\
      b.x = b.r;\n\
      b.y = 0;\n\
      bound(b);\n\
      if (n > 2) {\n\
        c = nodes[2];\n\
        d3_layout_packPlace(a, b, c);\n\
        bound(c);\n\
        d3_layout_packInsert(a, c);\n\
        a._pack_prev = c;\n\
        d3_layout_packInsert(c, b);\n\
        b = a._pack_next;\n\
        for (i = 3; i < n; i++) {\n\
          d3_layout_packPlace(a, b, c = nodes[i]);\n\
          var isect = 0, s1 = 1, s2 = 1;\n\
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {\n\
            if (d3_layout_packIntersects(j, c)) {\n\
              isect = 1;\n\
              break;\n\
            }\n\
          }\n\
          if (isect == 1) {\n\
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {\n\
              if (d3_layout_packIntersects(k, c)) {\n\
                break;\n\
              }\n\
            }\n\
          }\n\
          if (isect) {\n\
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);\n\
            i--;\n\
          } else {\n\
            d3_layout_packInsert(a, c);\n\
            b = c;\n\
            bound(c);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;\n\
    for (i = 0; i < n; i++) {\n\
      c = nodes[i];\n\
      c.x -= cx;\n\
      c.y -= cy;\n\
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));\n\
    }\n\
    node.r = cr;\n\
    nodes.forEach(d3_layout_packUnlink);\n\
  }\n\
  function d3_layout_packLink(node) {\n\
    node._pack_next = node._pack_prev = node;\n\
  }\n\
  function d3_layout_packUnlink(node) {\n\
    delete node._pack_next;\n\
    delete node._pack_prev;\n\
  }\n\
  function d3_layout_packTransform(node, x, y, k) {\n\
    var children = node.children;\n\
    node.x = x += k * node.x;\n\
    node.y = y += k * node.y;\n\
    node.r *= k;\n\
    if (children) {\n\
      var i = -1, n = children.length;\n\
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);\n\
    }\n\
  }\n\
  function d3_layout_packPlace(a, b, c) {\n\
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;\n\
    if (db && (dx || dy)) {\n\
      var da = b.r + c.r, dc = dx * dx + dy * dy;\n\
      da *= da;\n\
      db *= db;\n\
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);\n\
      c.x = a.x + x * dx + y * dy;\n\
      c.y = a.y + x * dy - y * dx;\n\
    } else {\n\
      c.x = a.x + db;\n\
      c.y = a.y;\n\
    }\n\
  }\n\
  d3.layout.tree = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;\n\
    function tree(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);\n\
      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;\n\
      d3_layout_hierarchyVisitBefore(root1, secondWalk);\n\
      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {\n\
        var left = root0, right = root0, bottom = root0;\n\
        d3_layout_hierarchyVisitBefore(root0, function(node) {\n\
          if (node.x < left.x) left = node;\n\
          if (node.x > right.x) right = node;\n\
          if (node.depth > bottom.depth) bottom = node;\n\
        });\n\
        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);\n\
        d3_layout_hierarchyVisitBefore(root0, function(node) {\n\
          node.x = (node.x + tx) * kx;\n\
          node.y = node.depth * ky;\n\
        });\n\
      }\n\
      return nodes;\n\
    }\n\
    function wrapTree(root0) {\n\
      var root1 = {\n\
        A: null,\n\
        children: [ root0 ]\n\
      }, queue = [ root1 ], node1;\n\
      while ((node1 = queue.pop()) != null) {\n\
        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {\n\
          queue.push((children[i] = child = {\n\
            _: children[i],\n\
            parent: node1,\n\
            children: (child = children[i].children) && child.slice() || [],\n\
            A: null,\n\
            a: null,\n\
            z: 0,\n\
            m: 0,\n\
            c: 0,\n\
            s: 0,\n\
            t: null,\n\
            i: i\n\
          }).a = child);\n\
        }\n\
      }\n\
      return root1.children[0];\n\
    }\n\
    function firstWalk(v) {\n\
      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;\n\
      if (children.length) {\n\
        d3_layout_treeShift(v);\n\
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;\n\
        if (w) {\n\
          v.z = w.z + separation(v._, w._);\n\
          v.m = v.z - midpoint;\n\
        } else {\n\
          v.z = midpoint;\n\
        }\n\
      } else if (w) {\n\
        v.z = w.z + separation(v._, w._);\n\
      }\n\
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);\n\
    }\n\
    function secondWalk(v) {\n\
      v._.x = v.z + v.parent.m;\n\
      v.m += v.parent.m;\n\
    }\n\
    function apportion(v, w, ancestor) {\n\
      if (w) {\n\
        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;\n\
        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {\n\
          vom = d3_layout_treeLeft(vom);\n\
          vop = d3_layout_treeRight(vop);\n\
          vop.a = v;\n\
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);\n\
          if (shift > 0) {\n\
            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);\n\
            sip += shift;\n\
            sop += shift;\n\
          }\n\
          sim += vim.m;\n\
          sip += vip.m;\n\
          som += vom.m;\n\
          sop += vop.m;\n\
        }\n\
        if (vim && !d3_layout_treeRight(vop)) {\n\
          vop.t = vim;\n\
          vop.m += sim - sop;\n\
        }\n\
        if (vip && !d3_layout_treeLeft(vom)) {\n\
          vom.t = vip;\n\
          vom.m += sip - som;\n\
          ancestor = v;\n\
        }\n\
      }\n\
      return ancestor;\n\
    }\n\
    function sizeNode(node) {\n\
      node.x *= size[0];\n\
      node.y = node.depth * size[1];\n\
    }\n\
    tree.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return tree;\n\
    };\n\
    tree.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null ? sizeNode : null;\n\
      return tree;\n\
    };\n\
    tree.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) == null ? null : sizeNode;\n\
      return tree;\n\
    };\n\
    return d3_layout_hierarchyRebind(tree, hierarchy);\n\
  };\n\
  function d3_layout_treeSeparation(a, b) {\n\
    return a.parent == b.parent ? 1 : 2;\n\
  }\n\
  function d3_layout_treeLeft(v) {\n\
    var children = v.children;\n\
    return children.length ? children[0] : v.t;\n\
  }\n\
  function d3_layout_treeRight(v) {\n\
    var children = v.children, n;\n\
    return (n = children.length) ? children[n - 1] : v.t;\n\
  }\n\
  function d3_layout_treeMove(wm, wp, shift) {\n\
    var change = shift / (wp.i - wm.i);\n\
    wp.c -= change;\n\
    wp.s += shift;\n\
    wm.c += change;\n\
    wp.z += shift;\n\
    wp.m += shift;\n\
  }\n\
  function d3_layout_treeShift(v) {\n\
    var shift = 0, change = 0, children = v.children, i = children.length, w;\n\
    while (--i >= 0) {\n\
      w = children[i];\n\
      w.z += shift;\n\
      w.m += shift;\n\
      shift += w.s + (change += w.c);\n\
    }\n\
  }\n\
  function d3_layout_treeAncestor(vim, v, ancestor) {\n\
    return vim.a.parent === v.parent ? vim.a : ancestor;\n\
  }\n\
  d3.layout.cluster = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;\n\
    function cluster(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;\n\
      d3_layout_hierarchyVisitAfter(root, function(node) {\n\
        var children = node.children;\n\
        if (children && children.length) {\n\
          node.x = d3_layout_clusterX(children);\n\
          node.y = d3_layout_clusterY(children);\n\
        } else {\n\
          node.x = previousNode ? x += separation(node, previousNode) : 0;\n\
          node.y = 0;\n\
          previousNode = node;\n\
        }\n\
      });\n\
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;\n\
      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {\n\
        node.x = (node.x - root.x) * size[0];\n\
        node.y = (root.y - node.y) * size[1];\n\
      } : function(node) {\n\
        node.x = (node.x - x0) / (x1 - x0) * size[0];\n\
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];\n\
      });\n\
      return nodes;\n\
    }\n\
    cluster.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return cluster;\n\
    };\n\
    cluster.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null;\n\
      return cluster;\n\
    };\n\
    cluster.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) != null;\n\
      return cluster;\n\
    };\n\
    return d3_layout_hierarchyRebind(cluster, hierarchy);\n\
  };\n\
  function d3_layout_clusterY(children) {\n\
    return 1 + d3.max(children, function(child) {\n\
      return child.y;\n\
    });\n\
  }\n\
  function d3_layout_clusterX(children) {\n\
    return children.reduce(function(x, child) {\n\
      return x + child.x;\n\
    }, 0) / children.length;\n\
  }\n\
  function d3_layout_clusterLeft(node) {\n\
    var children = node.children;\n\
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;\n\
  }\n\
  function d3_layout_clusterRight(node) {\n\
    var children = node.children, n;\n\
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;\n\
  }\n\
  d3.layout.treemap = function() {\n\
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = \"squarify\", ratio = .5 * (1 + Math.sqrt(5));\n\
    function scale(children, k) {\n\
      var i = -1, n = children.length, child, area;\n\
      while (++i < n) {\n\
        area = (child = children[i]).value * (k < 0 ? 0 : k);\n\
        child.area = isNaN(area) || area <= 0 ? 0 : area;\n\
      }\n\
    }\n\
    function squarify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === \"slice\" ? rect.dx : mode === \"dice\" ? rect.dy : mode === \"slice-dice\" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while ((n = remaining.length) > 0) {\n\
          row.push(child = remaining[n - 1]);\n\
          row.area += child.area;\n\
          if (mode !== \"squarify\" || (score = worst(row, u)) <= best) {\n\
            remaining.pop();\n\
            best = score;\n\
          } else {\n\
            row.area -= row.pop().area;\n\
            position(row, u, rect, false);\n\
            u = Math.min(rect.dx, rect.dy);\n\
            row.length = row.area = 0;\n\
            best = Infinity;\n\
          }\n\
        }\n\
        if (row.length) {\n\
          position(row, u, rect, true);\n\
          row.length = row.area = 0;\n\
        }\n\
        children.forEach(squarify);\n\
      }\n\
    }\n\
    function stickify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), remaining = children.slice(), child, row = [];\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while (child = remaining.pop()) {\n\
          row.push(child);\n\
          row.area += child.area;\n\
          if (child.z != null) {\n\
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);\n\
            row.length = row.area = 0;\n\
          }\n\
        }\n\
        children.forEach(stickify);\n\
      }\n\
    }\n\
    function worst(row, u) {\n\
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;\n\
      while (++i < n) {\n\
        if (!(r = row[i].area)) continue;\n\
        if (r < rmin) rmin = r;\n\
        if (r > rmax) rmax = r;\n\
      }\n\
      s *= s;\n\
      u *= u;\n\
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;\n\
    }\n\
    function position(row, u, rect, flush) {\n\
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;\n\
      if (u == rect.dx) {\n\
        if (flush || v > rect.dy) v = rect.dy;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dy = v;\n\
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = true;\n\
        o.dx += rect.x + rect.dx - x;\n\
        rect.y += v;\n\
        rect.dy -= v;\n\
      } else {\n\
        if (flush || v > rect.dx) v = rect.dx;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dx = v;\n\
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = false;\n\
        o.dy += rect.y + rect.dy - y;\n\
        rect.x += v;\n\
        rect.dx -= v;\n\
      }\n\
    }\n\
    function treemap(d) {\n\
      var nodes = stickies || hierarchy(d), root = nodes[0];\n\
      root.x = 0;\n\
      root.y = 0;\n\
      root.dx = size[0];\n\
      root.dy = size[1];\n\
      if (stickies) hierarchy.revalue(root);\n\
      scale([ root ], root.dx * root.dy / root.value);\n\
      (stickies ? stickify : squarify)(root);\n\
      if (sticky) stickies = nodes;\n\
      return nodes;\n\
    }\n\
    treemap.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return treemap;\n\
    };\n\
    treemap.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      function padFunction(node) {\n\
        var p = x.call(treemap, node, node.depth);\n\
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === \"number\" ? [ p, p, p, p ] : p);\n\
      }\n\
      function padConstant(node) {\n\
        return d3_layout_treemapPad(node, x);\n\
      }\n\
      var type;\n\
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === \"function\" ? padFunction : type === \"number\" ? (x = [ x, x, x, x ], \n\
      padConstant) : padConstant;\n\
      return treemap;\n\
    };\n\
    treemap.round = function(x) {\n\
      if (!arguments.length) return round != Number;\n\
      round = x ? Math.round : Number;\n\
      return treemap;\n\
    };\n\
    treemap.sticky = function(x) {\n\
      if (!arguments.length) return sticky;\n\
      sticky = x;\n\
      stickies = null;\n\
      return treemap;\n\
    };\n\
    treemap.ratio = function(x) {\n\
      if (!arguments.length) return ratio;\n\
      ratio = x;\n\
      return treemap;\n\
    };\n\
    treemap.mode = function(x) {\n\
      if (!arguments.length) return mode;\n\
      mode = x + \"\";\n\
      return treemap;\n\
    };\n\
    return d3_layout_hierarchyRebind(treemap, hierarchy);\n\
  };\n\
  function d3_layout_treemapPadNull(node) {\n\
    return {\n\
      x: node.x,\n\
      y: node.y,\n\
      dx: node.dx,\n\
      dy: node.dy\n\
    };\n\
  }\n\
  function d3_layout_treemapPad(node, padding) {\n\
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];\n\
    if (dx < 0) {\n\
      x += dx / 2;\n\
      dx = 0;\n\
    }\n\
    if (dy < 0) {\n\
      y += dy / 2;\n\
      dy = 0;\n\
    }\n\
    return {\n\
      x: x,\n\
      y: y,\n\
      dx: dx,\n\
      dy: dy\n\
    };\n\
  }\n\
  d3.random = {\n\
    normal: function(µ, σ) {\n\
      var n = arguments.length;\n\
      if (n < 2) σ = 1;\n\
      if (n < 1) µ = 0;\n\
      return function() {\n\
        var x, y, r;\n\
        do {\n\
          x = Math.random() * 2 - 1;\n\
          y = Math.random() * 2 - 1;\n\
          r = x * x + y * y;\n\
        } while (!r || r > 1);\n\
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);\n\
      };\n\
    },\n\
    logNormal: function() {\n\
      var random = d3.random.normal.apply(d3, arguments);\n\
      return function() {\n\
        return Math.exp(random());\n\
      };\n\
    },\n\
    bates: function(m) {\n\
      var random = d3.random.irwinHall(m);\n\
      return function() {\n\
        return random() / m;\n\
      };\n\
    },\n\
    irwinHall: function(m) {\n\
      return function() {\n\
        for (var s = 0, j = 0; j < m; j++) s += Math.random();\n\
        return s;\n\
      };\n\
    }\n\
  };\n\
  d3.scale = {};\n\
  function d3_scaleExtent(domain) {\n\
    var start = domain[0], stop = domain[domain.length - 1];\n\
    return start < stop ? [ start, stop ] : [ stop, start ];\n\
  }\n\
  function d3_scaleRange(scale) {\n\
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());\n\
  }\n\
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {\n\
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);\n\
    return function(x) {\n\
      return i(u(x));\n\
    };\n\
  }\n\
  function d3_scale_nice(domain, nice) {\n\
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;\n\
    if (x1 < x0) {\n\
      dx = i0, i0 = i1, i1 = dx;\n\
      dx = x0, x0 = x1, x1 = dx;\n\
    }\n\
    domain[i0] = nice.floor(x0);\n\
    domain[i1] = nice.ceil(x1);\n\
    return domain;\n\
  }\n\
  function d3_scale_niceStep(step) {\n\
    return step ? {\n\
      floor: function(x) {\n\
        return Math.floor(x / step) * step;\n\
      },\n\
      ceil: function(x) {\n\
        return Math.ceil(x / step) * step;\n\
      }\n\
    } : d3_scale_niceIdentity;\n\
  }\n\
  var d3_scale_niceIdentity = {\n\
    floor: d3_identity,\n\
    ceil: d3_identity\n\
  };\n\
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {\n\
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;\n\
    if (domain[k] < domain[0]) {\n\
      domain = domain.slice().reverse();\n\
      range = range.slice().reverse();\n\
    }\n\
    while (++j <= k) {\n\
      u.push(uninterpolate(domain[j - 1], domain[j]));\n\
      i.push(interpolate(range[j - 1], range[j]));\n\
    }\n\
    return function(x) {\n\
      var j = d3.bisect(domain, x, 1, k) - 1;\n\
      return i[j](u[j](x));\n\
    };\n\
  }\n\
  d3.scale.linear = function() {\n\
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);\n\
  };\n\
  function d3_scale_linear(domain, range, interpolate, clamp) {\n\
    var output, input;\n\
    function rescale() {\n\
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;\n\
      output = linear(domain, range, uninterpolate, interpolate);\n\
      input = linear(range, domain, uninterpolate, d3_interpolate);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      return output(x);\n\
    }\n\
    scale.invert = function(y) {\n\
      return input(y);\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(Number);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.rangeRound = function(x) {\n\
      return scale.range(x).interpolate(d3_interpolateRound);\n\
    };\n\
    scale.clamp = function(x) {\n\
      if (!arguments.length) return clamp;\n\
      clamp = x;\n\
      return rescale();\n\
    };\n\
    scale.interpolate = function(x) {\n\
      if (!arguments.length) return interpolate;\n\
      interpolate = x;\n\
      return rescale();\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      d3_scale_linearNice(domain, m);\n\
      return rescale();\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_linear(domain, range, interpolate, clamp);\n\
    };\n\
    return rescale();\n\
  }\n\
  function d3_scale_linearRebind(scale, linear) {\n\
    return d3.rebind(scale, linear, \"range\", \"rangeRound\", \"interpolate\", \"clamp\");\n\
  }\n\
  function d3_scale_linearNice(domain, m) {\n\
    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));\n\
  }\n\
  function d3_scale_linearTickRange(domain, m) {\n\
    if (m == null) m = 10;\n\
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;\n\
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;\n\
    extent[0] = Math.ceil(extent[0] / step) * step;\n\
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;\n\
    extent[2] = step;\n\
    return extent;\n\
  }\n\
  function d3_scale_linearTicks(domain, m) {\n\
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));\n\
  }\n\
  function d3_scale_linearTickFormat(domain, m, format) {\n\
    var range = d3_scale_linearTickRange(domain, m);\n\
    if (format) {\n\
      var match = d3_format_re.exec(format);\n\
      match.shift();\n\
      if (match[8] === \"s\") {\n\
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));\n\
        if (!match[7]) match[7] = \".\" + d3_scale_linearPrecision(prefix.scale(range[2]));\n\
        match[8] = \"f\";\n\
        format = d3.format(match.join(\"\"));\n\
        return function(d) {\n\
          return format(prefix.scale(d)) + prefix.symbol;\n\
        };\n\
      }\n\
      if (!match[7]) match[7] = \".\" + d3_scale_linearFormatPrecision(match[8], range);\n\
      format = match.join(\"\");\n\
    } else {\n\
      format = \",.\" + d3_scale_linearPrecision(range[2]) + \"f\";\n\
    }\n\
    return d3.format(format);\n\
  }\n\
  var d3_scale_linearFormatSignificant = {\n\
    s: 1,\n\
    g: 1,\n\
    p: 1,\n\
    r: 1,\n\
    e: 1\n\
  };\n\
  function d3_scale_linearPrecision(value) {\n\
    return -Math.floor(Math.log(value) / Math.LN10 + .01);\n\
  }\n\
  function d3_scale_linearFormatPrecision(type, range) {\n\
    var p = d3_scale_linearPrecision(range[2]);\n\
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== \"e\") : p - (type === \"%\") * 2;\n\
  }\n\
  d3.scale.log = function() {\n\
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);\n\
  };\n\
  function d3_scale_log(linear, base, positive, domain) {\n\
    function log(x) {\n\
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);\n\
    }\n\
    function pow(x) {\n\
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);\n\
    }\n\
    function scale(x) {\n\
      return linear(log(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return pow(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      positive = x[0] >= 0;\n\
      linear.domain((domain = x.map(Number)).map(log));\n\
      return scale;\n\
    };\n\
    scale.base = function(_) {\n\
      if (!arguments.length) return base;\n\
      base = +_;\n\
      linear.domain(domain.map(log));\n\
      return scale;\n\
    };\n\
    scale.nice = function() {\n\
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);\n\
      linear.domain(niced);\n\
      domain = niced.map(pow);\n\
      return scale;\n\
    };\n\
    scale.ticks = function() {\n\
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;\n\
      if (isFinite(j - i)) {\n\
        if (positive) {\n\
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);\n\
          ticks.push(pow(i));\n\
        } else {\n\
          ticks.push(pow(i));\n\
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);\n\
        }\n\
        for (i = 0; ticks[i] < u; i++) {}\n\
        for (j = ticks.length; ticks[j - 1] > v; j--) {}\n\
        ticks = ticks.slice(i, j);\n\
      }\n\
      return ticks;\n\
    };\n\
    scale.tickFormat = function(n, format) {\n\
      if (!arguments.length) return d3_scale_logFormat;\n\
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== \"function\") format = d3.format(format);\n\
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, \n\
      Math.floor), e;\n\
      return function(d) {\n\
        return d / pow(f(log(d) + e)) <= k ? format(d) : \"\";\n\
      };\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_log(linear.copy(), base, positive, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  var d3_scale_logFormat = d3.format(\".0e\"), d3_scale_logNiceNegative = {\n\
    floor: function(x) {\n\
      return -Math.ceil(-x);\n\
    },\n\
    ceil: function(x) {\n\
      return -Math.floor(-x);\n\
    }\n\
  };\n\
  d3.scale.pow = function() {\n\
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_pow(linear, exponent, domain) {\n\
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);\n\
    function scale(x) {\n\
      return linear(powp(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return powb(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      linear.domain((domain = x.map(Number)).map(powp));\n\
      return scale;\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      return scale.domain(d3_scale_linearNice(domain, m));\n\
    };\n\
    scale.exponent = function(x) {\n\
      if (!arguments.length) return exponent;\n\
      powp = d3_scale_powPow(exponent = x);\n\
      powb = d3_scale_powPow(1 / exponent);\n\
      linear.domain(domain.map(powp));\n\
      return scale;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_pow(linear.copy(), exponent, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_scale_powPow(e) {\n\
    return function(x) {\n\
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);\n\
    };\n\
  }\n\
  d3.scale.sqrt = function() {\n\
    return d3.scale.pow().exponent(.5);\n\
  };\n\
  d3.scale.ordinal = function() {\n\
    return d3_scale_ordinal([], {\n\
      t: \"range\",\n\
      a: [ [] ]\n\
    });\n\
  };\n\
  function d3_scale_ordinal(domain, ranger) {\n\
    var index, range, rangeBand;\n\
    function scale(x) {\n\
      return range[((index.get(x) || (ranger.t === \"range\" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];\n\
    }\n\
    function steps(start, step) {\n\
      return d3.range(domain.length).map(function(i) {\n\
        return start + step * i;\n\
      });\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = [];\n\
      index = new d3_Map();\n\
      var i = -1, n = x.length, xi;\n\
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));\n\
      return scale[ranger.t].apply(scale, ranger.a);\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"range\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangePoints = function(x, padding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);\n\
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"rangePoints\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);\n\
      range = steps(start + step * outerPadding, step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = step * (1 - padding);\n\
      ranger = {\n\
        t: \"rangeBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeRoundBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;\n\
      range = steps(start + Math.round(error / 2), step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = Math.round(step * (1 - padding));\n\
      ranger = {\n\
        t: \"rangeRoundBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBand = function() {\n\
      return rangeBand;\n\
    };\n\
    scale.rangeExtent = function() {\n\
      return d3_scaleExtent(ranger.a[0]);\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_ordinal(domain, ranger);\n\
    };\n\
    return scale.domain(domain);\n\
  }\n\
  d3.scale.category10 = function() {\n\
    return d3.scale.ordinal().range(d3_category10);\n\
  };\n\
  d3.scale.category20 = function() {\n\
    return d3.scale.ordinal().range(d3_category20);\n\
  };\n\
  d3.scale.category20b = function() {\n\
    return d3.scale.ordinal().range(d3_category20b);\n\
  };\n\
  d3.scale.category20c = function() {\n\
    return d3.scale.ordinal().range(d3_category20c);\n\
  };\n\
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);\n\
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);\n\
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);\n\
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);\n\
  d3.scale.quantile = function() {\n\
    return d3_scale_quantile([], []);\n\
  };\n\
  function d3_scale_quantile(domain, range) {\n\
    var thresholds;\n\
    function rescale() {\n\
      var k = 0, q = range.length;\n\
      thresholds = [];\n\
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.filter(d3_number).sort(d3_ascending);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.quantiles = function() {\n\
      return thresholds;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantile(domain, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.quantize = function() {\n\
    return d3_scale_quantize(0, 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_quantize(x0, x1, range) {\n\
    var kx, i;\n\
    function scale(x) {\n\
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];\n\
    }\n\
    function rescale() {\n\
      kx = range.length / (x1 - x0);\n\
      i = range.length - 1;\n\
      return scale;\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return [ x0, x1 ];\n\
      x0 = +x[0];\n\
      x1 = +x[x.length - 1];\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      y = y < 0 ? NaN : y / kx + x0;\n\
      return [ y, y + 1 / kx ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantize(x0, x1, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.threshold = function() {\n\
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);\n\
  };\n\
  function d3_scale_threshold(domain, range) {\n\
    function scale(x) {\n\
      if (x <= x) return range[d3.bisect(domain, x)];\n\
    }\n\
    scale.domain = function(_) {\n\
      if (!arguments.length) return domain;\n\
      domain = _;\n\
      return scale;\n\
    };\n\
    scale.range = function(_) {\n\
      if (!arguments.length) return range;\n\
      range = _;\n\
      return scale;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return [ domain[y - 1], domain[y] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_threshold(domain, range);\n\
    };\n\
    return scale;\n\
  }\n\
  d3.scale.identity = function() {\n\
    return d3_scale_identity([ 0, 1 ]);\n\
  };\n\
  function d3_scale_identity(domain) {\n\
    function identity(x) {\n\
      return +x;\n\
    }\n\
    identity.invert = identity;\n\
    identity.domain = identity.range = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(identity);\n\
      return identity;\n\
    };\n\
    identity.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    identity.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    identity.copy = function() {\n\
      return d3_scale_identity(domain);\n\
    };\n\
    return identity;\n\
  }\n\
  d3.svg = {};\n\
  d3.svg.arc = function() {\n\
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function arc() {\n\
      var r0 = innerRadius.apply(this, arguments), r1 = outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset, a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset, da = (a1 < a0 && (da = a0, \n\
      a0 = a1, a1 = da), a1 - a0), df = da < π ? \"0\" : \"1\", c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);\n\
      return da >= d3_svg_arcMax ? r0 ? \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"M0,\" + r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + -r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + r0 + \"Z\" : \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"Z\" : r0 ? \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L\" + r0 * c1 + \",\" + r0 * s1 + \"A\" + r0 + \",\" + r0 + \" 0 \" + df + \",0 \" + r0 * c0 + \",\" + r0 * s0 + \"Z\" : \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L0,0\" + \"Z\";\n\
    }\n\
    arc.innerRadius = function(v) {\n\
      if (!arguments.length) return innerRadius;\n\
      innerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.outerRadius = function(v) {\n\
      if (!arguments.length) return outerRadius;\n\
      outerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.centroid = function() {\n\
      var r = (innerRadius.apply(this, arguments) + outerRadius.apply(this, arguments)) / 2, a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;\n\
      return [ Math.cos(a) * r, Math.sin(a) * r ];\n\
    };\n\
    return arc;\n\
  };\n\
  var d3_svg_arcOffset = -halfπ, d3_svg_arcMax = τ - ε;\n\
  function d3_svg_arcInnerRadius(d) {\n\
    return d.innerRadius;\n\
  }\n\
  function d3_svg_arcOuterRadius(d) {\n\
    return d.outerRadius;\n\
  }\n\
  function d3_svg_arcStartAngle(d) {\n\
    return d.startAngle;\n\
  }\n\
  function d3_svg_arcEndAngle(d) {\n\
    return d.endAngle;\n\
  }\n\
  function d3_svg_line(projection) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;\n\
    function line(data) {\n\
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points), tension));\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);\n\
        } else if (points.length) {\n\
          segment();\n\
          points = [];\n\
        }\n\
      }\n\
      if (points.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    line.x = function(_) {\n\
      if (!arguments.length) return x;\n\
      x = _;\n\
      return line;\n\
    };\n\
    line.y = function(_) {\n\
      if (!arguments.length) return y;\n\
      y = _;\n\
      return line;\n\
    };\n\
    line.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return line;\n\
    };\n\
    line.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      return line;\n\
    };\n\
    line.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return line;\n\
    };\n\
    return line;\n\
  }\n\
  d3.svg.line = function() {\n\
    return d3_svg_line(d3_identity);\n\
  };\n\
  var d3_svg_lineInterpolators = d3.map({\n\
    linear: d3_svg_lineLinear,\n\
    \"linear-closed\": d3_svg_lineLinearClosed,\n\
    step: d3_svg_lineStep,\n\
    \"step-before\": d3_svg_lineStepBefore,\n\
    \"step-after\": d3_svg_lineStepAfter,\n\
    basis: d3_svg_lineBasis,\n\
    \"basis-open\": d3_svg_lineBasisOpen,\n\
    \"basis-closed\": d3_svg_lineBasisClosed,\n\
    bundle: d3_svg_lineBundle,\n\
    cardinal: d3_svg_lineCardinal,\n\
    \"cardinal-open\": d3_svg_lineCardinalOpen,\n\
    \"cardinal-closed\": d3_svg_lineCardinalClosed,\n\
    monotone: d3_svg_lineMonotone\n\
  });\n\
  d3_svg_lineInterpolators.forEach(function(key, value) {\n\
    value.key = key;\n\
    value.closed = /-closed$/.test(key);\n\
  });\n\
  function d3_svg_lineLinear(points) {\n\
    return points.join(\"L\");\n\
  }\n\
  function d3_svg_lineLinearClosed(points) {\n\
    return d3_svg_lineLinear(points) + \"Z\";\n\
  }\n\
  function d3_svg_lineStep(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p[0] + (p = points[i])[0]) / 2, \"V\", p[1]);\n\
    if (n > 1) path.push(\"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepBefore(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"V\", (p = points[i])[1], \"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepAfter(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p = points[i])[0], \"V\", p[1]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineCardinalOpen(points, tension) {\n\
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, points.length - 1), d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineCardinalClosed(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), \n\
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));\n\
  }\n\
  function d3_svg_lineCardinal(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineHermite(points, tangents) {\n\
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {\n\
      return d3_svg_lineLinear(points);\n\
    }\n\
    var quad = points.length != tangents.length, path = \"\", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;\n\
    if (quad) {\n\
      path += \"Q\" + (p[0] - t0[0] * 2 / 3) + \",\" + (p[1] - t0[1] * 2 / 3) + \",\" + p[0] + \",\" + p[1];\n\
      p0 = points[1];\n\
      pi = 2;\n\
    }\n\
    if (tangents.length > 1) {\n\
      t = tangents[1];\n\
      p = points[pi];\n\
      pi++;\n\
      path += \"C\" + (p0[0] + t0[0]) + \",\" + (p0[1] + t0[1]) + \",\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      for (var i = 2; i < tangents.length; i++, pi++) {\n\
        p = points[pi];\n\
        t = tangents[i];\n\
        path += \"S\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      }\n\
    }\n\
    if (quad) {\n\
      var lp = points[pi];\n\
      path += \"Q\" + (p[0] + t[0] * 2 / 3) + \",\" + (p[1] + t[1] * 2 / 3) + \",\" + lp[0] + \",\" + lp[1];\n\
    }\n\
    return path;\n\
  }\n\
  function d3_svg_lineCardinalTangents(points, tension) {\n\
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;\n\
    while (++i < n) {\n\
      p0 = p1;\n\
      p1 = p2;\n\
      p2 = points[i];\n\
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineBasis(points) {\n\
    if (points.length < 3) return d3_svg_lineLinear(points);\n\
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, \",\", y0, \"L\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    points.push(points[n - 1]);\n\
    while (++i <= n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    points.pop();\n\
    path.push(\"L\", pi);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisOpen(points) {\n\
    if (points.length < 4) return d3_svg_lineLinear(points);\n\
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];\n\
    while (++i < 3) {\n\
      pi = points[i];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + \",\" + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));\n\
    --i;\n\
    while (++i < n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisClosed(points) {\n\
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];\n\
    while (++i < 4) {\n\
      pi = points[i % n];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    --i;\n\
    while (++i < m) {\n\
      pi = points[i % n];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBundle(points, tension) {\n\
    var n = points.length - 1;\n\
    if (n) {\n\
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;\n\
      while (++i <= n) {\n\
        p = points[i];\n\
        t = i / n;\n\
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);\n\
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);\n\
      }\n\
    }\n\
    return d3_svg_lineBasis(points);\n\
  }\n\
  function d3_svg_lineDot4(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];\n\
  }\n\
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];\n\
  function d3_svg_lineBasisBezier(path, x, y) {\n\
    path.push(\"C\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));\n\
  }\n\
  function d3_svg_lineSlope(p0, p1) {\n\
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);\n\
  }\n\
  function d3_svg_lineFiniteDifferences(points) {\n\
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);\n\
    while (++i < j) {\n\
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;\n\
    }\n\
    m[i] = d;\n\
    return m;\n\
  }\n\
  function d3_svg_lineMonotoneTangents(points) {\n\
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;\n\
    while (++i < j) {\n\
      d = d3_svg_lineSlope(points[i], points[i + 1]);\n\
      if (abs(d) < ε) {\n\
        m[i] = m[i + 1] = 0;\n\
      } else {\n\
        a = m[i] / d;\n\
        b = m[i + 1] / d;\n\
        s = a * a + b * b;\n\
        if (s > 9) {\n\
          s = d * 3 / Math.sqrt(s);\n\
          m[i] = s * a;\n\
          m[i + 1] = s * b;\n\
        }\n\
      }\n\
    }\n\
    i = -1;\n\
    while (++i <= j) {\n\
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));\n\
      tangents.push([ s || 0, m[i] * s || 0 ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineMonotone(points) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));\n\
  }\n\
  d3.svg.line.radial = function() {\n\
    var line = d3_svg_line(d3_svg_lineRadial);\n\
    line.radius = line.x, delete line.x;\n\
    line.angle = line.y, delete line.y;\n\
    return line;\n\
  };\n\
  function d3_svg_lineRadial(points) {\n\
    var point, i = -1, n = points.length, r, a;\n\
    while (++i < n) {\n\
      point = points[i];\n\
      r = point[0];\n\
      a = point[1] + d3_svg_arcOffset;\n\
      point[0] = r * Math.cos(a);\n\
      point[1] = r * Math.sin(a);\n\
    }\n\
    return points;\n\
  }\n\
  function d3_svg_area(projection) {\n\
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = \"L\", tension = .7;\n\
    function area(data) {\n\
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {\n\
        return x;\n\
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {\n\
        return y;\n\
      } : d3_functor(y1), x, y;\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), \"Z\");\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);\n\
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);\n\
        } else if (points0.length) {\n\
          segment();\n\
          points0 = [];\n\
          points1 = [];\n\
        }\n\
      }\n\
      if (points0.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    area.x = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x0 = x1 = _;\n\
      return area;\n\
    };\n\
    area.x0 = function(_) {\n\
      if (!arguments.length) return x0;\n\
      x0 = _;\n\
      return area;\n\
    };\n\
    area.x1 = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x1 = _;\n\
      return area;\n\
    };\n\
    area.y = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y0 = y1 = _;\n\
      return area;\n\
    };\n\
    area.y0 = function(_) {\n\
      if (!arguments.length) return y0;\n\
      y0 = _;\n\
      return area;\n\
    };\n\
    area.y1 = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y1 = _;\n\
      return area;\n\
    };\n\
    area.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return area;\n\
    };\n\
    area.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      interpolateReverse = interpolate.reverse || interpolate;\n\
      L = interpolate.closed ? \"M\" : \"L\";\n\
      return area;\n\
    };\n\
    area.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return area;\n\
    };\n\
    return area;\n\
  }\n\
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;\n\
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;\n\
  d3.svg.area = function() {\n\
    return d3_svg_area(d3_identity);\n\
  };\n\
  d3.svg.area.radial = function() {\n\
    var area = d3_svg_area(d3_svg_lineRadial);\n\
    area.radius = area.x, delete area.x;\n\
    area.innerRadius = area.x0, delete area.x0;\n\
    area.outerRadius = area.x1, delete area.x1;\n\
    area.angle = area.y, delete area.y;\n\
    area.startAngle = area.y0, delete area.y0;\n\
    area.endAngle = area.y1, delete area.y1;\n\
    return area;\n\
  };\n\
  d3.svg.chord = function() {\n\
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function chord(d, i) {\n\
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);\n\
      return \"M\" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + \"Z\";\n\
    }\n\
    function subgroup(self, f, d, i) {\n\
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) + d3_svg_arcOffset, a1 = endAngle.call(self, subgroup, i) + d3_svg_arcOffset;\n\
      return {\n\
        r: r,\n\
        a0: a0,\n\
        a1: a1,\n\
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],\n\
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]\n\
      };\n\
    }\n\
    function equals(a, b) {\n\
      return a.a0 == b.a0 && a.a1 == b.a1;\n\
    }\n\
    function arc(r, p, a) {\n\
      return \"A\" + r + \",\" + r + \" 0 \" + +(a > π) + \",1 \" + p;\n\
    }\n\
    function curve(r0, p0, r1, p1) {\n\
      return \"Q 0,0 \" + p1;\n\
    }\n\
    chord.radius = function(v) {\n\
      if (!arguments.length) return radius;\n\
      radius = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.source = function(v) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.target = function(v) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    return chord;\n\
  };\n\
  function d3_svg_chordRadius(d) {\n\
    return d.radius;\n\
  }\n\
  d3.svg.diagonal = function() {\n\
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;\n\
    function diagonal(d, i) {\n\
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {\n\
        x: p0.x,\n\
        y: m\n\
      }, {\n\
        x: p3.x,\n\
        y: m\n\
      }, p3 ];\n\
      p = p.map(projection);\n\
      return \"M\" + p[0] + \"C\" + p[1] + \" \" + p[2] + \" \" + p[3];\n\
    }\n\
    diagonal.source = function(x) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.target = function(x) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.projection = function(x) {\n\
      if (!arguments.length) return projection;\n\
      projection = x;\n\
      return diagonal;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalProjection(d) {\n\
    return [ d.x, d.y ];\n\
  }\n\
  d3.svg.diagonal.radial = function() {\n\
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;\n\
    diagonal.projection = function(x) {\n\
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalRadialProjection(projection) {\n\
    return function() {\n\
      var d = projection.apply(this, arguments), r = d[0], a = d[1] + d3_svg_arcOffset;\n\
      return [ r * Math.cos(a), r * Math.sin(a) ];\n\
    };\n\
  }\n\
  d3.svg.symbol = function() {\n\
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;\n\
    function symbol(d, i) {\n\
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));\n\
    }\n\
    symbol.type = function(x) {\n\
      if (!arguments.length) return type;\n\
      type = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    symbol.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    return symbol;\n\
  };\n\
  function d3_svg_symbolSize() {\n\
    return 64;\n\
  }\n\
  function d3_svg_symbolType() {\n\
    return \"circle\";\n\
  }\n\
  function d3_svg_symbolCircle(size) {\n\
    var r = Math.sqrt(size / π);\n\
    return \"M0,\" + r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + -r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + r + \"Z\";\n\
  }\n\
  var d3_svg_symbols = d3.map({\n\
    circle: d3_svg_symbolCircle,\n\
    cross: function(size) {\n\
      var r = Math.sqrt(size / 5) / 2;\n\
      return \"M\" + -3 * r + \",\" + -r + \"H\" + -r + \"V\" + -3 * r + \"H\" + r + \"V\" + -r + \"H\" + 3 * r + \"V\" + r + \"H\" + r + \"V\" + 3 * r + \"H\" + -r + \"V\" + r + \"H\" + -3 * r + \"Z\";\n\
    },\n\
    diamond: function(size) {\n\
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",0\" + \" 0,\" + ry + \" \" + -rx + \",0\" + \"Z\";\n\
    },\n\
    square: function(size) {\n\
      var r = Math.sqrt(size) / 2;\n\
      return \"M\" + -r + \",\" + -r + \"L\" + r + \",\" + -r + \" \" + r + \",\" + r + \" \" + -r + \",\" + r + \"Z\";\n\
    },\n\
    \"triangle-down\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + ry + \"L\" + rx + \",\" + -ry + \" \" + -rx + \",\" + -ry + \"Z\";\n\
    },\n\
    \"triangle-up\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",\" + ry + \" \" + -rx + \",\" + ry + \"Z\";\n\
    }\n\
  });\n\
  d3.svg.symbolTypes = d3_svg_symbols.keys();\n\
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);\n\
  function d3_transition(groups, id) {\n\
    d3_subclass(groups, d3_transitionPrototype);\n\
    groups.id = id;\n\
    return groups;\n\
  }\n\
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;\n\
  d3_transitionPrototype.call = d3_selectionPrototype.call;\n\
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_transitionPrototype.node = d3_selectionPrototype.node;\n\
  d3_transitionPrototype.size = d3_selectionPrototype.size;\n\
  d3.transition = function(selection) {\n\
    return arguments.length ? d3_transitionInheritId ? selection.transition() : selection : d3_selectionRoot.transition();\n\
  };\n\
  d3.transition.prototype = d3_transitionPrototype;\n\
  d3_transitionPrototype.select = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnode, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {\n\
          if (\"__data__\" in node) subnode.__data__ = node.__data__;\n\
          d3_transitionNode(subnode, i, id, node.__transition__[id]);\n\
          subgroup.push(subnode);\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.selectAll = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnodes, node, subnode, transition;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          transition = node.__transition__[id];\n\
          subnodes = selector.call(node, node.__data__, i, j);\n\
          subgroups.push(subgroup = []);\n\
          for (var k = -1, o = subnodes.length; ++k < o; ) {\n\
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, id, transition);\n\
            subgroup.push(subnode);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, this.id);\n\
  };\n\
  d3_transitionPrototype.tween = function(name, tween) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) return this.node().__transition__[id].tween.get(name);\n\
    return d3_selection_each(this, tween == null ? function(node) {\n\
      node.__transition__[id].tween.remove(name);\n\
    } : function(node) {\n\
      node.__transition__[id].tween.set(name, tween);\n\
    });\n\
  };\n\
  function d3_transition_tween(groups, name, value, tween) {\n\
    var id = groups.id;\n\
    return d3_selection_each(groups, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].tween.set(name, tween(value.call(node, node.__data__, i, j)));\n\
    } : (value = tween(value), function(node) {\n\
      node.__transition__[id].tween.set(name, value);\n\
    }));\n\
  }\n\
  d3_transitionPrototype.attr = function(nameNS, value) {\n\
    if (arguments.length < 2) {\n\
      for (value in nameNS) this.attr(value, nameNS[value]);\n\
      return this;\n\
    }\n\
    var interpolate = nameNS == \"transform\" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrTween(b) {\n\
      return b == null ? attrNull : (b += \"\", function() {\n\
        var a = this.getAttribute(name), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttribute(name, i(t));\n\
        });\n\
      });\n\
    }\n\
    function attrTweenNS(b) {\n\
      return b == null ? attrNullNS : (b += \"\", function() {\n\
        var a = this.getAttributeNS(name.space, name.local), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttributeNS(name.space, name.local, i(t));\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"attr.\" + nameNS, value, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.attrTween = function(nameNS, tween) {\n\
    var name = d3.ns.qualify(nameNS);\n\
    function attrTween(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttribute(name));\n\
      return f && function(t) {\n\
        this.setAttribute(name, f(t));\n\
      };\n\
    }\n\
    function attrTweenNS(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));\n\
      return f && function(t) {\n\
        this.setAttributeNS(name.space, name.local, f(t));\n\
      };\n\
    }\n\
    return this.tween(\"attr.\" + nameNS, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.style(priority, name[priority], value);\n\
        return this;\n\
      }\n\
      priority = \"\";\n\
    }\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleString(b) {\n\
      return b == null ? styleNull : (b += \"\", function() {\n\
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;\n\
        return a !== b && (i = d3_interpolate(a, b), function(t) {\n\
          this.style.setProperty(name, i(t), priority);\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"style.\" + name, value, styleString);\n\
  };\n\
  d3_transitionPrototype.styleTween = function(name, tween, priority) {\n\
    if (arguments.length < 3) priority = \"\";\n\
    function styleTween(d, i) {\n\
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));\n\
      return f && function(t) {\n\
        this.style.setProperty(name, f(t), priority);\n\
      };\n\
    }\n\
    return this.tween(\"style.\" + name, styleTween);\n\
  };\n\
  d3_transitionPrototype.text = function(value) {\n\
    return d3_transition_tween(this, \"text\", value, d3_transition_text);\n\
  };\n\
  function d3_transition_text(b) {\n\
    if (b == null) b = \"\";\n\
    return function() {\n\
      this.textContent = b;\n\
    };\n\
  }\n\
  d3_transitionPrototype.remove = function() {\n\
    return this.each(\"end.transition\", function() {\n\
      var p;\n\
      if (this.__transition__.count < 2 && (p = this.parentNode)) p.removeChild(this);\n\
    });\n\
  };\n\
  d3_transitionPrototype.ease = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].ease;\n\
    if (typeof value !== \"function\") value = d3.ease.apply(d3, arguments);\n\
    return d3_selection_each(this, function(node) {\n\
      node.__transition__[id].ease = value;\n\
    });\n\
  };\n\
  d3_transitionPrototype.delay = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].delay;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].delay = +value.call(node, node.__data__, i, j);\n\
    } : (value = +value, function(node) {\n\
      node.__transition__[id].delay = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.duration = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].duration;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j));\n\
    } : (value = Math.max(1, value), function(node) {\n\
      node.__transition__[id].duration = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.each = function(type, listener) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) {\n\
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;\n\
      d3_transitionInheritId = id;\n\
      d3_selection_each(this, function(node, i, j) {\n\
        d3_transitionInherit = node.__transition__[id];\n\
        type.call(node, node.__data__, i, j);\n\
      });\n\
      d3_transitionInherit = inherit;\n\
      d3_transitionInheritId = inheritId;\n\
    } else {\n\
      d3_selection_each(this, function(node) {\n\
        var transition = node.__transition__[id];\n\
        (transition.event || (transition.event = d3.dispatch(\"start\", \"end\"))).on(type, listener);\n\
      });\n\
    }\n\
    return this;\n\
  };\n\
  d3_transitionPrototype.transition = function() {\n\
    var id0 = this.id, id1 = ++d3_transitionId, subgroups = [], subgroup, group, node, transition;\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if (node = group[i]) {\n\
          transition = Object.create(node.__transition__[id0]);\n\
          transition.delay += transition.duration;\n\
          d3_transitionNode(node, i, id1, transition);\n\
        }\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id1);\n\
  };\n\
  function d3_transitionNode(node, i, id, inherit) {\n\
    var lock = node.__transition__ || (node.__transition__ = {\n\
      active: 0,\n\
      count: 0\n\
    }), transition = lock[id];\n\
    if (!transition) {\n\
      var time = inherit.time;\n\
      transition = lock[id] = {\n\
        tween: new d3_Map(),\n\
        time: time,\n\
        ease: inherit.ease,\n\
        delay: inherit.delay,\n\
        duration: inherit.duration\n\
      };\n\
      ++lock.count;\n\
      d3.timer(function(elapsed) {\n\
        var d = node.__data__, ease = transition.ease, delay = transition.delay, duration = transition.duration, timer = d3_timer_active, tweened = [];\n\
        timer.t = delay + time;\n\
        if (delay <= elapsed) return start(elapsed - delay);\n\
        timer.c = start;\n\
        function start(elapsed) {\n\
          if (lock.active > id) return stop();\n\
          lock.active = id;\n\
          transition.event && transition.event.start.call(node, d, i);\n\
          transition.tween.forEach(function(key, value) {\n\
            if (value = value.call(node, d, i)) {\n\
              tweened.push(value);\n\
            }\n\
          });\n\
          d3.timer(function() {\n\
            timer.c = tick(elapsed || 1) ? d3_true : tick;\n\
            return 1;\n\
          }, 0, time);\n\
        }\n\
        function tick(elapsed) {\n\
          if (lock.active !== id) return stop();\n\
          var t = elapsed / duration, e = ease(t), n = tweened.length;\n\
          while (n > 0) {\n\
            tweened[--n].call(node, e);\n\
          }\n\
          if (t >= 1) {\n\
            transition.event && transition.event.end.call(node, d, i);\n\
            return stop();\n\
          }\n\
        }\n\
        function stop() {\n\
          if (--lock.count) delete lock[id]; else delete node.__transition__;\n\
          return 1;\n\
        }\n\
      }, 0, time);\n\
    }\n\
  }\n\
  d3.svg.axis = function() {\n\
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;\n\
    function axis(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this);\n\
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();\n\
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(\".tick\").data(ticks, scale1), tickEnter = tick.enter().insert(\"g\", \".domain\").attr(\"class\", \"tick\").style(\"opacity\", ε), tickExit = d3.transition(tick.exit()).style(\"opacity\", ε).remove(), tickUpdate = d3.transition(tick.order()).style(\"opacity\", 1), tickTransform;\n\
        var range = d3_scaleRange(scale1), path = g.selectAll(\".domain\").data([ 0 ]), pathUpdate = (path.enter().append(\"path\").attr(\"class\", \"domain\"), \n\
        d3.transition(path));\n\
        tickEnter.append(\"line\");\n\
        tickEnter.append(\"text\");\n\
        var lineEnter = tickEnter.select(\"line\"), lineUpdate = tickUpdate.select(\"line\"), text = tick.select(\"text\").text(tickFormat), textEnter = tickEnter.select(\"text\"), textUpdate = tickUpdate.select(\"text\");\n\
        switch (orient) {\n\
         case \"bottom\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", innerTickSize);\n\
            textEnter.attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            text.attr(\"dy\", \".71em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + outerTickSize + \"V0H\" + range[1] + \"V\" + outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"top\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", -innerTickSize);\n\
            textEnter.attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", -innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            text.attr(\"dy\", \"0em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + -outerTickSize + \"V0H\" + range[1] + \"V\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"left\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", -innerTickSize);\n\
            textEnter.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", -innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding)).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"end\");\n\
            pathUpdate.attr(\"d\", \"M\" + -outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"right\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", innerTickSize);\n\
            textEnter.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"start\");\n\
            pathUpdate.attr(\"d\", \"M\" + outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + outerTickSize);\n\
            break;\n\
          }\n\
        }\n\
        if (scale1.rangeBand) {\n\
          var x = scale1, dx = x.rangeBand() / 2;\n\
          scale0 = scale1 = function(d) {\n\
            return x(d) + dx;\n\
          };\n\
        } else if (scale0.rangeBand) {\n\
          scale0 = scale1;\n\
        } else {\n\
          tickExit.call(tickTransform, scale1);\n\
        }\n\
        tickEnter.call(tickTransform, scale0);\n\
        tickUpdate.call(tickTransform, scale1);\n\
      });\n\
    }\n\
    axis.scale = function(x) {\n\
      if (!arguments.length) return scale;\n\
      scale = x;\n\
      return axis;\n\
    };\n\
    axis.orient = function(x) {\n\
      if (!arguments.length) return orient;\n\
      orient = x in d3_svg_axisOrients ? x + \"\" : d3_svg_axisDefaultOrient;\n\
      return axis;\n\
    };\n\
    axis.ticks = function() {\n\
      if (!arguments.length) return tickArguments_;\n\
      tickArguments_ = arguments;\n\
      return axis;\n\
    };\n\
    axis.tickValues = function(x) {\n\
      if (!arguments.length) return tickValues;\n\
      tickValues = x;\n\
      return axis;\n\
    };\n\
    axis.tickFormat = function(x) {\n\
      if (!arguments.length) return tickFormat_;\n\
      tickFormat_ = x;\n\
      return axis;\n\
    };\n\
    axis.tickSize = function(x) {\n\
      var n = arguments.length;\n\
      if (!n) return innerTickSize;\n\
      innerTickSize = +x;\n\
      outerTickSize = +arguments[n - 1];\n\
      return axis;\n\
    };\n\
    axis.innerTickSize = function(x) {\n\
      if (!arguments.length) return innerTickSize;\n\
      innerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.outerTickSize = function(x) {\n\
      if (!arguments.length) return outerTickSize;\n\
      outerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.tickPadding = function(x) {\n\
      if (!arguments.length) return tickPadding;\n\
      tickPadding = +x;\n\
      return axis;\n\
    };\n\
    axis.tickSubdivide = function() {\n\
      return arguments.length && axis;\n\
    };\n\
    return axis;\n\
  };\n\
  var d3_svg_axisDefaultOrient = \"bottom\", d3_svg_axisOrients = {\n\
    top: 1,\n\
    right: 1,\n\
    bottom: 1,\n\
    left: 1\n\
  };\n\
  function d3_svg_axisX(selection, x) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(\" + x(d) + \",0)\";\n\
    });\n\
  }\n\
  function d3_svg_axisY(selection, y) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(0,\" + y(d) + \")\";\n\
    });\n\
  }\n\
  d3.svg.brush = function() {\n\
    var event = d3_eventDispatch(brush, \"brushstart\", \"brush\", \"brushend\"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];\n\
    function brush(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this).style(\"pointer-events\", \"all\").style(\"-webkit-tap-highlight-color\", \"rgba(0,0,0,0)\").on(\"mousedown.brush\", brushstart).on(\"touchstart.brush\", brushstart);\n\
        var background = g.selectAll(\".background\").data([ 0 ]);\n\
        background.enter().append(\"rect\").attr(\"class\", \"background\").style(\"visibility\", \"hidden\").style(\"cursor\", \"crosshair\");\n\
        g.selectAll(\".extent\").data([ 0 ]).enter().append(\"rect\").attr(\"class\", \"extent\").style(\"cursor\", \"move\");\n\
        var resize = g.selectAll(\".resize\").data(resizes, d3_identity);\n\
        resize.exit().remove();\n\
        resize.enter().append(\"g\").attr(\"class\", function(d) {\n\
          return \"resize \" + d;\n\
        }).style(\"cursor\", function(d) {\n\
          return d3_svg_brushCursor[d];\n\
        }).append(\"rect\").attr(\"x\", function(d) {\n\
          return /[ew]$/.test(d) ? -3 : null;\n\
        }).attr(\"y\", function(d) {\n\
          return /^[ns]/.test(d) ? -3 : null;\n\
        }).attr(\"width\", 6).attr(\"height\", 6).style(\"visibility\", \"hidden\");\n\
        resize.style(\"display\", brush.empty() ? \"none\" : null);\n\
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;\n\
        if (x) {\n\
          range = d3_scaleRange(x);\n\
          backgroundUpdate.attr(\"x\", range[0]).attr(\"width\", range[1] - range[0]);\n\
          redrawX(gUpdate);\n\
        }\n\
        if (y) {\n\
          range = d3_scaleRange(y);\n\
          backgroundUpdate.attr(\"y\", range[0]).attr(\"height\", range[1] - range[0]);\n\
          redrawY(gUpdate);\n\
        }\n\
        redraw(gUpdate);\n\
      });\n\
    }\n\
    brush.event = function(g) {\n\
      g.each(function() {\n\
        var event_ = event.of(this, arguments), extent1 = {\n\
          x: xExtent,\n\
          y: yExtent,\n\
          i: xExtentDomain,\n\
          j: yExtentDomain\n\
        }, extent0 = this.__chart__ || extent1;\n\
        this.__chart__ = extent1;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.brush\", function() {\n\
            xExtentDomain = extent0.i;\n\
            yExtentDomain = extent0.j;\n\
            xExtent = extent0.x;\n\
            yExtent = extent0.y;\n\
            event_({\n\
              type: \"brushstart\"\n\
            });\n\
          }).tween(\"brush:brush\", function() {\n\
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);\n\
            xExtentDomain = yExtentDomain = null;\n\
            return function(t) {\n\
              xExtent = extent1.x = xi(t);\n\
              yExtent = extent1.y = yi(t);\n\
              event_({\n\
                type: \"brush\",\n\
                mode: \"resize\"\n\
              });\n\
            };\n\
          }).each(\"end.brush\", function() {\n\
            xExtentDomain = extent1.i;\n\
            yExtentDomain = extent1.j;\n\
            event_({\n\
              type: \"brush\",\n\
              mode: \"resize\"\n\
            });\n\
            event_({\n\
              type: \"brushend\"\n\
            });\n\
          });\n\
        } else {\n\
          event_({\n\
            type: \"brushstart\"\n\
          });\n\
          event_({\n\
            type: \"brush\",\n\
            mode: \"resize\"\n\
          });\n\
          event_({\n\
            type: \"brushend\"\n\
          });\n\
        }\n\
      });\n\
    };\n\
    function redraw(g) {\n\
      g.selectAll(\".resize\").attr(\"transform\", function(d) {\n\
        return \"translate(\" + xExtent[+/e$/.test(d)] + \",\" + yExtent[+/^s/.test(d)] + \")\";\n\
      });\n\
    }\n\
    function redrawX(g) {\n\
      g.select(\".extent\").attr(\"x\", xExtent[0]);\n\
      g.selectAll(\".extent,.n>rect,.s>rect\").attr(\"width\", xExtent[1] - xExtent[0]);\n\
    }\n\
    function redrawY(g) {\n\
      g.select(\".extent\").attr(\"y\", yExtent[0]);\n\
      g.selectAll(\".extent,.e>rect,.w>rect\").attr(\"height\", yExtent[1] - yExtent[0]);\n\
    }\n\
    function brushstart() {\n\
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed(\"extent\"), dragRestore = d3_event_dragSuppress(), center, origin = d3.mouse(target), offset;\n\
      var w = d3.select(d3_window).on(\"keydown.brush\", keydown).on(\"keyup.brush\", keyup);\n\
      if (d3.event.changedTouches) {\n\
        w.on(\"touchmove.brush\", brushmove).on(\"touchend.brush\", brushend);\n\
      } else {\n\
        w.on(\"mousemove.brush\", brushmove).on(\"mouseup.brush\", brushend);\n\
      }\n\
      g.interrupt().selectAll(\"*\").interrupt();\n\
      if (dragging) {\n\
        origin[0] = xExtent[0] - origin[0];\n\
        origin[1] = yExtent[0] - origin[1];\n\
      } else if (resizing) {\n\
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);\n\
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];\n\
        origin[0] = xExtent[ex];\n\
        origin[1] = yExtent[ey];\n\
      } else if (d3.event.altKey) center = origin.slice();\n\
      g.style(\"pointer-events\", \"none\").selectAll(\".resize\").style(\"display\", null);\n\
      d3.select(\"body\").style(\"cursor\", eventTarget.style(\"cursor\"));\n\
      event_({\n\
        type: \"brushstart\"\n\
      });\n\
      brushmove();\n\
      function keydown() {\n\
        if (d3.event.keyCode == 32) {\n\
          if (!dragging) {\n\
            center = null;\n\
            origin[0] -= xExtent[1];\n\
            origin[1] -= yExtent[1];\n\
            dragging = 2;\n\
          }\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function keyup() {\n\
        if (d3.event.keyCode == 32 && dragging == 2) {\n\
          origin[0] += xExtent[1];\n\
          origin[1] += yExtent[1];\n\
          dragging = 0;\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function brushmove() {\n\
        var point = d3.mouse(target), moved = false;\n\
        if (offset) {\n\
          point[0] += offset[0];\n\
          point[1] += offset[1];\n\
        }\n\
        if (!dragging) {\n\
          if (d3.event.altKey) {\n\
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];\n\
            origin[0] = xExtent[+(point[0] < center[0])];\n\
            origin[1] = yExtent[+(point[1] < center[1])];\n\
          } else center = null;\n\
        }\n\
        if (resizingX && move1(point, x, 0)) {\n\
          redrawX(g);\n\
          moved = true;\n\
        }\n\
        if (resizingY && move1(point, y, 1)) {\n\
          redrawY(g);\n\
          moved = true;\n\
        }\n\
        if (moved) {\n\
          redraw(g);\n\
          event_({\n\
            type: \"brush\",\n\
            mode: dragging ? \"move\" : \"resize\"\n\
          });\n\
        }\n\
      }\n\
      function move1(point, scale, i) {\n\
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;\n\
        if (dragging) {\n\
          r0 -= position;\n\
          r1 -= size + position;\n\
        }\n\
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];\n\
        if (dragging) {\n\
          max = (min += position) + size;\n\
        } else {\n\
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));\n\
          if (position < min) {\n\
            max = min;\n\
            min = position;\n\
          } else {\n\
            max = position;\n\
          }\n\
        }\n\
        if (extent[0] != min || extent[1] != max) {\n\
          if (i) yExtentDomain = null; else xExtentDomain = null;\n\
          extent[0] = min;\n\
          extent[1] = max;\n\
          return true;\n\
        }\n\
      }\n\
      function brushend() {\n\
        brushmove();\n\
        g.style(\"pointer-events\", \"all\").selectAll(\".resize\").style(\"display\", brush.empty() ? \"none\" : null);\n\
        d3.select(\"body\").style(\"cursor\", null);\n\
        w.on(\"mousemove.brush\", null).on(\"mouseup.brush\", null).on(\"touchmove.brush\", null).on(\"touchend.brush\", null).on(\"keydown.brush\", null).on(\"keyup.brush\", null);\n\
        dragRestore();\n\
        event_({\n\
          type: \"brushend\"\n\
        });\n\
      }\n\
    }\n\
    brush.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.clamp = function(z) {\n\
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;\n\
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;\n\
      return brush;\n\
    };\n\
    brush.extent = function(z) {\n\
      var x0, x1, y0, y1, t;\n\
      if (!arguments.length) {\n\
        if (x) {\n\
          if (xExtentDomain) {\n\
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];\n\
          } else {\n\
            x0 = xExtent[0], x1 = xExtent[1];\n\
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);\n\
            if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
          }\n\
        }\n\
        if (y) {\n\
          if (yExtentDomain) {\n\
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];\n\
          } else {\n\
            y0 = yExtent[0], y1 = yExtent[1];\n\
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);\n\
            if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
          }\n\
        }\n\
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];\n\
      }\n\
      if (x) {\n\
        x0 = z[0], x1 = z[1];\n\
        if (y) x0 = x0[0], x1 = x1[0];\n\
        xExtentDomain = [ x0, x1 ];\n\
        if (x.invert) x0 = x(x0), x1 = x(x1);\n\
        if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];\n\
      }\n\
      if (y) {\n\
        y0 = z[0], y1 = z[1];\n\
        if (x) y0 = y0[1], y1 = y1[1];\n\
        yExtentDomain = [ y0, y1 ];\n\
        if (y.invert) y0 = y(y0), y1 = y(y1);\n\
        if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];\n\
      }\n\
      return brush;\n\
    };\n\
    brush.clear = function() {\n\
      if (!brush.empty()) {\n\
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];\n\
        xExtentDomain = yExtentDomain = null;\n\
      }\n\
      return brush;\n\
    };\n\
    brush.empty = function() {\n\
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];\n\
    };\n\
    return d3.rebind(brush, event, \"on\");\n\
  };\n\
  var d3_svg_brushCursor = {\n\
    n: \"ns-resize\",\n\
    e: \"ew-resize\",\n\
    s: \"ns-resize\",\n\
    w: \"ew-resize\",\n\
    nw: \"nwse-resize\",\n\
    ne: \"nesw-resize\",\n\
    se: \"nwse-resize\",\n\
    sw: \"nesw-resize\"\n\
  };\n\
  var d3_svg_brushResizes = [ [ \"n\", \"e\", \"s\", \"w\", \"nw\", \"ne\", \"se\", \"sw\" ], [ \"e\", \"w\" ], [ \"n\", \"s\" ], [] ];\n\
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;\n\
  var d3_time_formatUtc = d3_time_format.utc;\n\
  var d3_time_formatIso = d3_time_formatUtc(\"%Y-%m-%dT%H:%M:%S.%LZ\");\n\
  d3_time_format.iso = Date.prototype.toISOString && +new Date(\"2000-01-01T00:00:00.000Z\") ? d3_time_formatIsoNative : d3_time_formatIso;\n\
  function d3_time_formatIsoNative(date) {\n\
    return date.toISOString();\n\
  }\n\
  d3_time_formatIsoNative.parse = function(string) {\n\
    var date = new Date(string);\n\
    return isNaN(date) ? null : date;\n\
  };\n\
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;\n\
  d3_time.second = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 1e3) * 1e3);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);\n\
  }, function(date) {\n\
    return date.getSeconds();\n\
  });\n\
  d3_time.seconds = d3_time.second.range;\n\
  d3_time.seconds.utc = d3_time.second.utc.range;\n\
  d3_time.minute = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 6e4) * 6e4);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);\n\
  }, function(date) {\n\
    return date.getMinutes();\n\
  });\n\
  d3_time.minutes = d3_time.minute.range;\n\
  d3_time.minutes.utc = d3_time.minute.utc.range;\n\
  d3_time.hour = d3_time_interval(function(date) {\n\
    var timezone = date.getTimezoneOffset() / 60;\n\
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);\n\
  }, function(date) {\n\
    return date.getHours();\n\
  });\n\
  d3_time.hours = d3_time.hour.range;\n\
  d3_time.hours.utc = d3_time.hour.utc.range;\n\
  d3_time.month = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setDate(1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setMonth(date.getMonth() + offset);\n\
  }, function(date) {\n\
    return date.getMonth();\n\
  });\n\
  d3_time.months = d3_time.month.range;\n\
  d3_time.months.utc = d3_time.month.utc.range;\n\
  function d3_time_scale(linear, methods, format) {\n\
    function scale(x) {\n\
      return linear(x);\n\
    }\n\
    scale.invert = function(x) {\n\
      return d3_time_scaleDate(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);\n\
      linear.domain(x);\n\
      return scale;\n\
    };\n\
    function tickMethod(extent, count) {\n\
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);\n\
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {\n\
        return d / 31536e6;\n\
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];\n\
    }\n\
    scale.nice = function(interval, skip) {\n\
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" && tickMethod(extent, interval);\n\
      if (method) interval = method[0], skip = method[1];\n\
      function skipped(date) {\n\
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;\n\
      }\n\
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {\n\
        floor: function(date) {\n\
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);\n\
          return date;\n\
        },\n\
        ceil: function(date) {\n\
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);\n\
          return date;\n\
        }\n\
      } : interval));\n\
    };\n\
    scale.ticks = function(interval, skip) {\n\
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" ? tickMethod(extent, interval) : !interval.range && [ {\n\
        range: interval\n\
      }, skip ];\n\
      if (method) interval = method[0], skip = method[1];\n\
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);\n\
    };\n\
    scale.tickFormat = function() {\n\
      return format;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_time_scale(linear.copy(), methods, format);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_time_scaleDate(t) {\n\
    return new Date(t);\n\
  }\n\
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];\n\
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];\n\
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ \".%L\", function(d) {\n\
    return d.getMilliseconds();\n\
  } ], [ \":%S\", function(d) {\n\
    return d.getSeconds();\n\
  } ], [ \"%I:%M\", function(d) {\n\
    return d.getMinutes();\n\
  } ], [ \"%I %p\", function(d) {\n\
    return d.getHours();\n\
  } ], [ \"%a %d\", function(d) {\n\
    return d.getDay() && d.getDate() != 1;\n\
  } ], [ \"%b %d\", function(d) {\n\
    return d.getDate() != 1;\n\
  } ], [ \"%B\", function(d) {\n\
    return d.getMonth();\n\
  } ], [ \"%Y\", d3_true ] ]);\n\
  var d3_time_scaleMilliseconds = {\n\
    range: function(start, stop, step) {\n\
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);\n\
    },\n\
    floor: d3_identity,\n\
    ceil: d3_identity\n\
  };\n\
  d3_time_scaleLocalMethods.year = d3_time.year;\n\
  d3_time.scale = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);\n\
  };\n\
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {\n\
    return [ m[0].utc, m[1] ];\n\
  });\n\
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ \".%L\", function(d) {\n\
    return d.getUTCMilliseconds();\n\
  } ], [ \":%S\", function(d) {\n\
    return d.getUTCSeconds();\n\
  } ], [ \"%I:%M\", function(d) {\n\
    return d.getUTCMinutes();\n\
  } ], [ \"%I %p\", function(d) {\n\
    return d.getUTCHours();\n\
  } ], [ \"%a %d\", function(d) {\n\
    return d.getUTCDay() && d.getUTCDate() != 1;\n\
  } ], [ \"%b %d\", function(d) {\n\
    return d.getUTCDate() != 1;\n\
  } ], [ \"%B\", function(d) {\n\
    return d.getUTCMonth();\n\
  } ], [ \"%Y\", d3_true ] ]);\n\
  d3_time_scaleUtcMethods.year = d3_time.year.utc;\n\
  d3_time.scale.utc = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);\n\
  };\n\
  d3.text = d3_xhrType(function(request) {\n\
    return request.responseText;\n\
  });\n\
  d3.json = function(url, callback) {\n\
    return d3_xhr(url, \"application/json\", d3_json, callback);\n\
  };\n\
  function d3_json(request) {\n\
    return JSON.parse(request.responseText);\n\
  }\n\
  d3.html = function(url, callback) {\n\
    return d3_xhr(url, \"text/html\", d3_html, callback);\n\
  };\n\
  function d3_html(request) {\n\
    var range = d3_document.createRange();\n\
    range.selectNode(d3_document.body);\n\
    return range.createContextualFragment(request.responseText);\n\
  }\n\
  d3.xml = d3_xhrType(function(request) {\n\
    return request.responseXML;\n\
  });\n\
  if (typeof define === \"function\" && define.amd) define(d3); else if (typeof module === \"object\" && module.exports) module.exports = d3;\n\
  this.d3 = d3;\n\
}();//@ sourceURL=mbostock-d3/d3.js"
));
require.register("javascript-augment/augment.js", Function("exports, require, module",
"(function (global, factory) {\n\
    if (typeof define === \"function\" && define.amd) define(factory);\n\
    else if (typeof module === \"object\") module.exports = factory();\n\
    else global.augment = factory();\n\
}(this, function () {\n\
    \"use strict\";\n\
\n\
    var Factory = function () {};\n\
    var slice = Array.prototype.slice;\n\
\n\
    return function (base, body) {\n\
        var uber = Factory.prototype = typeof base === \"function\" ? base.prototype : base;\n\
        var prototype = new Factory;\n\
        body.apply(prototype, slice.call(arguments, 2).concat(uber));\n\
        if (!prototype.hasOwnProperty(\"constructor\")) return prototype;\n\
        var constructor = prototype.constructor;\n\
        constructor.prototype = prototype;\n\
        return constructor;\n\
    }\n\
}));//@ sourceURL=javascript-augment/augment.js"
));
require.register("guille-ms.js/index.js", Function("exports, require, module",
"/**\n\
 * Helpers.\n\
 */\n\
\n\
var s = 1000;\n\
var m = s * 60;\n\
var h = m * 60;\n\
var d = h * 24;\n\
var y = d * 365.25;\n\
\n\
/**\n\
 * Parse or format the given `val`.\n\
 *\n\
 * Options:\n\
 *\n\
 *  - `long` verbose formatting [false]\n\
 *\n\
 * @param {String|Number} val\n\
 * @param {Object} options\n\
 * @return {String|Number}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val, options){\n\
  options = options || {};\n\
  if ('string' == typeof val) return parse(val);\n\
  return options.long\n\
    ? long(val)\n\
    : short(val);\n\
};\n\
\n\
/**\n\
 * Parse the given `str` and return milliseconds.\n\
 *\n\
 * @param {String} str\n\
 * @return {Number}\n\
 * @api private\n\
 */\n\
\n\
function parse(str) {\n\
  var match = /^((?:\\d+)?\\.?\\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);\n\
  if (!match) return;\n\
  var n = parseFloat(match[1]);\n\
  var type = (match[2] || 'ms').toLowerCase();\n\
  switch (type) {\n\
    case 'years':\n\
    case 'year':\n\
    case 'y':\n\
      return n * y;\n\
    case 'days':\n\
    case 'day':\n\
    case 'd':\n\
      return n * d;\n\
    case 'hours':\n\
    case 'hour':\n\
    case 'h':\n\
      return n * h;\n\
    case 'minutes':\n\
    case 'minute':\n\
    case 'm':\n\
      return n * m;\n\
    case 'seconds':\n\
    case 'second':\n\
    case 's':\n\
      return n * s;\n\
    case 'ms':\n\
      return n;\n\
  }\n\
}\n\
\n\
/**\n\
 * Short format for `ms`.\n\
 *\n\
 * @param {Number} ms\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function short(ms) {\n\
  if (ms >= d) return Math.round(ms / d) + 'd';\n\
  if (ms >= h) return Math.round(ms / h) + 'h';\n\
  if (ms >= m) return Math.round(ms / m) + 'm';\n\
  if (ms >= s) return Math.round(ms / s) + 's';\n\
  return ms + 'ms';\n\
}\n\
\n\
/**\n\
 * Long format for `ms`.\n\
 *\n\
 * @param {Number} ms\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function long(ms) {\n\
  return plural(ms, d, 'day')\n\
    || plural(ms, h, 'hour')\n\
    || plural(ms, m, 'minute')\n\
    || plural(ms, s, 'second')\n\
    || ms + ' ms';\n\
}\n\
\n\
/**\n\
 * Pluralization helper.\n\
 */\n\
\n\
function plural(ms, n, name) {\n\
  if (ms < n) return;\n\
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;\n\
  return Math.ceil(ms / n) + ' ' + name + 's';\n\
}\n\
//@ sourceURL=guille-ms.js/index.js"
));
require.register("visionmedia-debug/browser.js", Function("exports, require, module",
"\n\
/**\n\
 * This is the web browser implementation of `debug()`.\n\
 *\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
exports = module.exports = require('./debug');\n\
exports.log = log;\n\
exports.formatArgs = formatArgs;\n\
exports.save = save;\n\
exports.load = load;\n\
exports.useColors = useColors;\n\
\n\
/**\n\
 * Use chrome.storage.local if we are in an app\n\
 */\n\
\n\
var storage;\n\
\n\
if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')\n\
  storage = chrome.storage.local;\n\
else\n\
  storage = localstorage();\n\
\n\
/**\n\
 * Colors.\n\
 */\n\
\n\
exports.colors = [\n\
  'lightseagreen',\n\
  'forestgreen',\n\
  'goldenrod',\n\
  'dodgerblue',\n\
  'darkorchid',\n\
  'crimson'\n\
];\n\
\n\
/**\n\
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n\
 * and the Firebug extension (any Firefox version) are known\n\
 * to support \"%c\" CSS customizations.\n\
 *\n\
 * TODO: add a `localStorage` variable to explicitly enable/disable colors\n\
 */\n\
\n\
function useColors() {\n\
  // is webkit? http://stackoverflow.com/a/16459606/376773\n\
  return ('WebkitAppearance' in document.documentElement.style) ||\n\
    // is firebug? http://stackoverflow.com/a/398120/376773\n\
    (window.console && (console.firebug || (console.exception && console.table))) ||\n\
    // is firefox >= v31?\n\
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n\
    (navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31);\n\
}\n\
\n\
/**\n\
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n\
 */\n\
\n\
exports.formatters.j = function(v) {\n\
  return JSON.stringify(v);\n\
};\n\
\n\
\n\
/**\n\
 * Colorize log arguments if enabled.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function formatArgs() {\n\
  var args = arguments;\n\
  var useColors = this.useColors;\n\
\n\
  args[0] = (useColors ? '%c' : '')\n\
    + this.namespace\n\
    + (useColors ? ' %c' : ' ')\n\
    + args[0]\n\
    + (useColors ? '%c ' : ' ')\n\
    + '+' + exports.humanize(this.diff);\n\
\n\
  if (!useColors) return args;\n\
\n\
  var c = 'color: ' + this.color;\n\
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));\n\
\n\
  // the final \"%c\" is somewhat tricky, because there could be other\n\
  // arguments passed either before or after the %c, so we need to\n\
  // figure out the correct index to insert the CSS into\n\
  var index = 0;\n\
  var lastC = 0;\n\
  args[0].replace(/%[a-z%]/g, function(match) {\n\
    if ('%%' === match) return;\n\
    index++;\n\
    if ('%c' === match) {\n\
      // we only are interested in the *last* %c\n\
      // (the user may have provided their own)\n\
      lastC = index;\n\
    }\n\
  });\n\
\n\
  args.splice(lastC, 0, c);\n\
  return args;\n\
}\n\
\n\
/**\n\
 * Invokes `console.log()` when available.\n\
 * No-op when `console.log` is not a \"function\".\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function log() {\n\
  // this hackery is required for IE8/9, where\n\
  // the `console.log` function doesn't have 'apply'\n\
  return 'object' === typeof console\n\
    && console.log\n\
    && Function.prototype.apply.call(console.log, console, arguments);\n\
}\n\
\n\
/**\n\
 * Save `namespaces`.\n\
 *\n\
 * @param {String} namespaces\n\
 * @api private\n\
 */\n\
\n\
function save(namespaces) {\n\
  try {\n\
    if (null == namespaces) {\n\
      storage.removeItem('debug');\n\
    } else {\n\
      storage.debug = namespaces;\n\
    }\n\
  } catch(e) {}\n\
}\n\
\n\
/**\n\
 * Load `namespaces`.\n\
 *\n\
 * @return {String} returns the previously persisted debug modes\n\
 * @api private\n\
 */\n\
\n\
function load() {\n\
  var r;\n\
  try {\n\
    r = storage.debug;\n\
  } catch(e) {}\n\
  return r;\n\
}\n\
\n\
/**\n\
 * Enable namespaces listed in `localStorage.debug` initially.\n\
 */\n\
\n\
exports.enable(load());\n\
\n\
/**\n\
 * Localstorage attempts to return the localstorage.\n\
 *\n\
 * This is necessary because safari throws\n\
 * when a user disables cookies/localstorage\n\
 * and you attempt to access it.\n\
 *\n\
 * @return {LocalStorage}\n\
 * @api private\n\
 */\n\
\n\
function localstorage(){\n\
  try {\n\
    return window.localStorage;\n\
  } catch (e) {}\n\
}\n\
//@ sourceURL=visionmedia-debug/browser.js"
));
require.register("visionmedia-debug/debug.js", Function("exports, require, module",
"\n\
/**\n\
 * This is the common logic for both the Node.js and web browser\n\
 * implementations of `debug()`.\n\
 *\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
exports = module.exports = debug;\n\
exports.coerce = coerce;\n\
exports.disable = disable;\n\
exports.enable = enable;\n\
exports.enabled = enabled;\n\
exports.humanize = require('ms');\n\
\n\
/**\n\
 * The currently active debug mode names, and names to skip.\n\
 */\n\
\n\
exports.names = [];\n\
exports.skips = [];\n\
\n\
/**\n\
 * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n\
 *\n\
 * Valid key names are a single, lowercased letter, i.e. \"n\".\n\
 */\n\
\n\
exports.formatters = {};\n\
\n\
/**\n\
 * Previously assigned color.\n\
 */\n\
\n\
var prevColor = 0;\n\
\n\
/**\n\
 * Previous log timestamp.\n\
 */\n\
\n\
var prevTime;\n\
\n\
/**\n\
 * Select a color.\n\
 *\n\
 * @return {Number}\n\
 * @api private\n\
 */\n\
\n\
function selectColor() {\n\
  return exports.colors[prevColor++ % exports.colors.length];\n\
}\n\
\n\
/**\n\
 * Create a debugger with the given `namespace`.\n\
 *\n\
 * @param {String} namespace\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
function debug(namespace) {\n\
\n\
  // define the `disabled` version\n\
  function disabled() {\n\
  }\n\
  disabled.enabled = false;\n\
\n\
  // define the `enabled` version\n\
  function enabled() {\n\
\n\
    var self = enabled;\n\
\n\
    // set `diff` timestamp\n\
    var curr = +new Date();\n\
    var ms = curr - (prevTime || curr);\n\
    self.diff = ms;\n\
    self.prev = prevTime;\n\
    self.curr = curr;\n\
    prevTime = curr;\n\
\n\
    // add the `color` if not set\n\
    if (null == self.useColors) self.useColors = exports.useColors();\n\
    if (null == self.color && self.useColors) self.color = selectColor();\n\
\n\
    var args = Array.prototype.slice.call(arguments);\n\
\n\
    args[0] = exports.coerce(args[0]);\n\
\n\
    if ('string' !== typeof args[0]) {\n\
      // anything else let's inspect with %o\n\
      args = ['%o'].concat(args);\n\
    }\n\
\n\
    // apply any `formatters` transformations\n\
    var index = 0;\n\
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {\n\
      // if we encounter an escaped % then don't increase the array index\n\
      if (match === '%%') return match;\n\
      index++;\n\
      var formatter = exports.formatters[format];\n\
      if ('function' === typeof formatter) {\n\
        var val = args[index];\n\
        match = formatter.call(self, val);\n\
\n\
        // now we need to remove `args[index]` since it's inlined in the `format`\n\
        args.splice(index, 1);\n\
        index--;\n\
      }\n\
      return match;\n\
    });\n\
\n\
    if ('function' === typeof exports.formatArgs) {\n\
      args = exports.formatArgs.apply(self, args);\n\
    }\n\
    var logFn = enabled.log || exports.log || console.log.bind(console);\n\
    logFn.apply(self, args);\n\
  }\n\
  enabled.enabled = true;\n\
\n\
  var fn = exports.enabled(namespace) ? enabled : disabled;\n\
\n\
  fn.namespace = namespace;\n\
\n\
  return fn;\n\
}\n\
\n\
/**\n\
 * Enables a debug mode by namespaces. This can include modes\n\
 * separated by a colon and wildcards.\n\
 *\n\
 * @param {String} namespaces\n\
 * @api public\n\
 */\n\
\n\
function enable(namespaces) {\n\
  exports.save(namespaces);\n\
\n\
  var split = (namespaces || '').split(/[\\s,]+/);\n\
  var len = split.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    if (!split[i]) continue; // ignore empty strings\n\
    namespaces = split[i].replace(/\\*/g, '.*?');\n\
    if (namespaces[0] === '-') {\n\
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n\
    } else {\n\
      exports.names.push(new RegExp('^' + namespaces + '$'));\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Disable debug output.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function disable() {\n\
  exports.enable('');\n\
}\n\
\n\
/**\n\
 * Returns true if the given mode name is enabled, false otherwise.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function enabled(name) {\n\
  var i, len;\n\
  for (i = 0, len = exports.skips.length; i < len; i++) {\n\
    if (exports.skips[i].test(name)) {\n\
      return false;\n\
    }\n\
  }\n\
  for (i = 0, len = exports.names.length; i < len; i++) {\n\
    if (exports.names[i].test(name)) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
}\n\
\n\
/**\n\
 * Coerce `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 * @api private\n\
 */\n\
\n\
function coerce(val) {\n\
  if (val instanceof Error) return val.stack || val.message;\n\
  return val;\n\
}\n\
//@ sourceURL=visionmedia-debug/debug.js"
));
require.register("yields-svg-attributes/index.js", Function("exports, require, module",
"\n\
/**\n\
 * SVG Attributes\n\
 *\n\
 * http://www.w3.org/TR/SVG/attindex.html\n\
 */\n\
\n\
module.exports = [\n\
  'height',\n\
  'target',\n\
  'title',\n\
  'width',\n\
  'y1',\n\
  'y2',\n\
  'x1',\n\
  'x2',\n\
  'cx',\n\
  'cy',\n\
  'dx',\n\
  'dy',\n\
  'rx',\n\
  'ry',\n\
  'd',\n\
  'r',\n\
  'y',\n\
  'x'\n\
];\n\
//@ sourceURL=yields-svg-attributes/index.js"
));
require.register("janogonzalez-priorityqueuejs/index.js", Function("exports, require, module",
"/**\n\
 * Expose `PriorityQueue`.\n\
 */\n\
module.exports = PriorityQueue;\n\
\n\
/**\n\
 * Initializes a new empty `PriorityQueue` with the given `comparator(a, b)`\n\
 * function, uses `.DEFAULT_COMPARATOR()` when no function is provided.\n\
 *\n\
 * The comparator function must return a positive number when `a > b`, 0 when\n\
 * `a == b` and a negative number when `a < b`.\n\
 *\n\
 * @param {Function}\n\
 * @return {PriorityQueue}\n\
 * @api public\n\
 */\n\
function PriorityQueue(comparator) {\n\
  this._comparator = comparator || PriorityQueue.DEFAULT_COMPARATOR;\n\
  this._elements = [];\n\
}\n\
\n\
/**\n\
 * Compares `a` and `b`, when `a > b` it returns a positive number, when\n\
 * it returns 0 and when `a < b` it returns a negative number.\n\
 *\n\
 * @param {String|Number} a\n\
 * @param {String|Number} b\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.DEFAULT_COMPARATOR = function(a, b) {\n\
  if (a instanceof Number && b instanceof Number) {\n\
    return a - b;\n\
  } else {\n\
    a = a.toString();\n\
    b = b.toString();\n\
\n\
    if (a == b) return 0;\n\
\n\
    return (a > b) ? 1 : -1;\n\
  }\n\
};\n\
\n\
/**\n\
 * Returns whether the priority queue is empty or not.\n\
 *\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.isEmpty = function() {\n\
  return this.size() === 0;\n\
};\n\
\n\
/**\n\
 * Peeks at the top element of the priority queue.\n\
 *\n\
 * @return {Object}\n\
 * @throws {Error} when the queue is empty.\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.peek = function() {\n\
  if (this.isEmpty()) throw new Error('PriorityQueue is empty');\n\
\n\
  return this._elements[0];\n\
};\n\
\n\
/**\n\
 * Dequeues the top element of the priority queue.\n\
 *\n\
 * @return {Object}\n\
 * @throws {Error} when the queue is empty.\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.deq = function() {\n\
  var first = this.peek();\n\
  var last = this._elements.pop();\n\
  var size = this.size();\n\
\n\
  if (size === 0) return first;\n\
\n\
  this._elements[0] = last;\n\
  var current = 0;\n\
\n\
  while (current < size) {\n\
    var largest = current;\n\
    var left = (2 * current) + 1;\n\
    var right = (2 * current) + 2;\n\
\n\
    if (left < size && this._compare(left, largest) > 0) {\n\
      largest = left;\n\
    }\n\
\n\
    if (right < size && this._compare(right, largest) > 0) {\n\
      largest = right;\n\
    }\n\
\n\
    if (largest === current) break;\n\
\n\
    this._swap(largest, current);\n\
    current = largest;\n\
  }\n\
\n\
  return first;\n\
};\n\
\n\
/**\n\
 * Enqueues the `element` at the priority queue and returns its new size.\n\
 *\n\
 * @param {Object} element\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.enq = function(element) {\n\
  var size = this._elements.push(element);\n\
  var current = size - 1;\n\
\n\
  while (current > 0) {\n\
    var parent = Math.floor((current - 1) / 2);\n\
\n\
    if (this._compare(current, parent) < 0) break;\n\
\n\
    this._swap(parent, current);\n\
    current = parent;\n\
  }\n\
\n\
  return size;\n\
};\n\
\n\
/**\n\
 * Returns the size of the priority queue.\n\
 *\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.size = function() {\n\
  return this._elements.length;\n\
};\n\
\n\
/**\n\
 *  Iterates over queue elements\n\
 *\n\
 *  @param {Function} fn\n\
 */\n\
PriorityQueue.prototype.forEach = function(fn) {\n\
  return this._elements.forEach(fn);\n\
};\n\
\n\
/**\n\
 * Compares the values at position `a` and `b` in the priority queue using its\n\
 * comparator function.\n\
 *\n\
 * @param {Number} a\n\
 * @param {Number} b\n\
 * @return {Number}\n\
 * @api private\n\
 */\n\
PriorityQueue.prototype._compare = function(a, b) {\n\
  return this._comparator(this._elements[a], this._elements[b]);\n\
};\n\
\n\
/**\n\
 * Swaps the values at position `a` and `b` in the priority queue.\n\
 *\n\
 * @param {Number} a\n\
 * @param {Number} b\n\
 * @api private\n\
 */\n\
PriorityQueue.prototype._swap = function(a, b) {\n\
  var aux = this._elements[a];\n\
  this._elements[a] = this._elements[b];\n\
  this._elements[b] = aux;\n\
};\n\
//@ sourceURL=janogonzalez-priorityqueuejs/index.js"
));
require.register("conveyal-transitive.js/lib/graph/index.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var debug = require('debug')('transitive:graph');\n\
var each = require('each');\n\
var clone = require('clone');\n\
var PriorityQueue = require('priorityqueuejs');\n\
\n\
var Edge = require('./edge');\n\
var EdgeGroup = require('./edgegroup');\n\
var Vertex = require('./vertex');\n\
var MultiPoint = require('../point/multipoint');\n\
var Util = require('../util');\n\
\n\
/**\n\
 * Expose `NetworkGraph`\n\
 */\n\
\n\
module.exports = NetworkGraph;\n\
\n\
/**\n\
 *  An graph representing the underlying 'wireframe' network\n\
 */\n\
\n\
function NetworkGraph(network, vertices) {\n\
  this.network = network;\n\
  this.edges = [];\n\
  this.vertices = [];\n\
\n\
  /**\n\
   *  Object mapping groups of edges that share the same two vertices.\n\
   *  - Key is string of format A_B, where A and B are vertex IDs and A < B\n\
   *  - Value is array of edges\n\
   */\n\
  this.edgeGroups = {};\n\
\n\
  // Add all base vertices\n\
  for (var i in vertices) this.addVertex(vertices[i], vertices[i].worldX,\n\
    vertices[i].worldY);\n\
}\n\
\n\
/**\n\
 * Get the bounds of the graph in the graph's internal x/y coordinate space\n\
 *\n\
 * @return [[left, top], [right, bottom]]\n\
 */\n\
\n\
NetworkGraph.prototype.bounds = function() {\n\
  var xmax = null,\n\
    xmin = null;\n\
  var ymax = null,\n\
    ymin = null;\n\
\n\
  for (var i in this.vertices) {\n\
    var vertex = this.vertices[i];\n\
    xmin = xmin ? Math.min(xmin, vertex.x) : vertex.x;\n\
    xmax = xmax ? Math.max(xmax, vertex.x) : vertex.x;\n\
    ymin = ymin ? Math.min(ymin, vertex.y) : vertex.y;\n\
    ymax = ymax ? Math.max(ymax, vertex.y) : vertex.y;\n\
  }\n\
\n\
  var maxExtent = 20037508.34;\n\
  return [\n\
    [xmin || -maxExtent, ymax || maxExtent],\n\
    [xmax || maxExtent, ymin || -maxExtent]\n\
  ];\n\
};\n\
\n\
/**\n\
 * Add Vertex\n\
 */\n\
\n\
NetworkGraph.prototype.addVertex = function(point, x, y) {\n\
  if (x === undefined || y === undefined) {\n\
    var xy = Util.latLonToSphericalMercator(point.getLat(), point.getLon());\n\
    x = xy[0];\n\
    y = xy[1];\n\
  }\n\
  var vertex = new Vertex(point, x, y);\n\
  this.vertices.push(vertex);\n\
  return vertex;\n\
};\n\
\n\
/**\n\
 * Add Edge\n\
 */\n\
\n\
NetworkGraph.prototype.addEdge = function(stops, from, to, segmentType) {\n\
  if (this.vertices.indexOf(from) === -1 || this.vertices.indexOf(to) === -1) {\n\
    debug('Error: Cannot add edge. Graph does not contain vertices.');\n\
    return;\n\
  }\n\
\n\
  var edge = new Edge(stops, from, to);\n\
  this.edges.push(edge);\n\
  from.edges.push(edge);\n\
  to.edges.push(edge);\n\
\n\
  var groupKey = this.getEdgeGroupKey(edge, segmentType);\n\
\n\
  if (!(groupKey in this.edgeGroups)) {\n\
    this.edgeGroups[groupKey] = new EdgeGroup(edge.fromVertex, edge.toVertex,\n\
      segmentType);\n\
  }\n\
  this.edgeGroups[groupKey].addEdge(edge);\n\
\n\
  return edge;\n\
};\n\
\n\
NetworkGraph.prototype.removeEdge = function(edge) {\n\
\n\
  // remove from the graph's edge collection\n\
  var edgeIndex = this.edges.indexOf(edge);\n\
  if (edgeIndex !== -1) this.edges.splice(edgeIndex, 1);\n\
\n\
  // remove from any associated path segment edge lists\n\
  edge.pathSegments.forEach(function(segment) {\n\
    segment.removeEdge(edge);\n\
  });\n\
\n\
  // remove from the endpoint vertex incidentEdge collections\n\
  edge.fromVertex.removeEdge(edge);\n\
  edge.toVertex.removeEdge(edge);\n\
};\n\
\n\
NetworkGraph.prototype.getEdgeGroup = function(edge) {\n\
  return this.edgeGroups[this.getEdgeGroupKey(edge)];\n\
};\n\
\n\
NetworkGraph.prototype.getEdgeGroupKey = function(edge, segmentType) {\n\
  return edge.fromVertex.getId() < edge.toVertex.getId() ?\n\
    segmentType + '_' + edge.fromVertex.getId() + '_' + edge.toVertex.getId() :\n\
    segmentType + '_' + edge.toVertex.getId() + '_' + edge.fromVertex.getId();\n\
};\n\
\n\
NetworkGraph.prototype.mergeVertices = function(vertexArray) {\n\
  var xTotal = 0,\n\
    yTotal = 0;\n\
\n\
  var vertexGroups = {\n\
    'STOP': [],\n\
    'PLACE': [],\n\
    'TURN': [],\n\
    'MULTI': []\n\
  };\n\
  vertexArray.forEach(function(vertex) {\n\
    if (vertex.point.getType() in vertexGroups) vertexGroups[vertex.point.getType()]\n\
      .push(vertex);\n\
  });\n\
\n\
  var mergePoint;\n\
\n\
  // don't merge stops and places, or multiple places:\n\
  if ((vertexGroups.STOP.length > 0 && vertexGroups.PLACE.length > 0) ||\n\
    vertexGroups.PLACE.length > 1 ||\n\
    vertexGroups.MULTI.length > 0) return;\n\
\n\
  // if merging turns with a place, create a new merged vertex around the place\n\
  if (vertexGroups.PLACE.length === 1 && vertexGroups.TURN.length > 0) {\n\
    mergePoint = vertexGroups.PLACE[0].point;\n\
  }\n\
\n\
  // if merging turns with a single place, create a new merged vertex around the stop\n\
  else if (vertexGroups.STOP.length === 1 && vertexGroups.TURN.length > 0) {\n\
    mergePoint = vertexGroups.STOP[0].point;\n\
  }\n\
\n\
  // if merging multiple stops, create a new MultiPoint vertex\n\
  else if (vertexGroups.STOP.length > 1) {\n\
    mergePoint = new MultiPoint();\n\
    each(vertexGroups.STOP, function(stopVertex) {\n\
      mergePoint.addPoint(stopVertex.point);\n\
    });\n\
  }\n\
\n\
  // if merging multiple turns\n\
  else if (vertexGroups.TURN.length > 1) {\n\
    mergePoint = vertexGroups.TURN[0].point;\n\
  }\n\
\n\
  if (!mergePoint) return;\n\
  var mergedVertex = new Vertex(mergePoint, 0, 0);\n\
\n\
  var origPoints = [];\n\
  vertexArray.forEach(function(vertex) {\n\
    xTotal += vertex.x;\n\
    yTotal += vertex.y;\n\
\n\
    var edges = [];\n\
    each(vertex.edges, function(edge) {\n\
      edges.push(edge);\n\
    });\n\
\n\
    each(edges, function(edge) {\n\
      if (vertexArray.indexOf(edge.fromVertex) !== -1 && vertexArray.indexOf(\n\
        edge.toVertex) !== -1) {\n\
        this.removeEdge(edge);\n\
        return;\n\
      }\n\
      edge.replaceVertex(vertex, mergedVertex);\n\
      mergedVertex.addEdge(edge);\n\
    }, this);\n\
    var index = this.vertices.indexOf(vertex);\n\
    if (index !== -1) this.vertices.splice(index, 1);\n\
  }, this);\n\
\n\
  mergedVertex.x = xTotal / vertexArray.length;\n\
  mergedVertex.y = yTotal / vertexArray.length;\n\
  mergedVertex.oldVertices = vertexArray;\n\
\n\
  this.vertices.push(mergedVertex);\n\
};\n\
\n\
NetworkGraph.prototype.sortVertices = function() {\n\
  this.vertices.sort(function(a, b) {\n\
    if (a.point && a.point.getType() === 'PLACE') return -1;\n\
    if (b.point && b.point.getType() === 'PLACE') return 1;\n\
\n\
    if (a.point && a.point.getType() === 'MULTI') return -1;\n\
    if (b.point && b.point.getType() === 'MULTI') return 1;\n\
\n\
    if (a.point && a.point.getType() === 'STOP') return -1;\n\
    if (b.point && b.point.getType() === 'STOP') return 1;\n\
  });\n\
};\n\
\n\
/**\n\
 * Get the equivalent edge\n\
 */\n\
\n\
NetworkGraph.prototype.getEquivalentEdge = function(pointArray, from, to) {\n\
  for (var e = 0; e < this.edges.length; e++) {\n\
    var edge = this.edges[e];\n\
    if (edge.fromVertex === from && edge.toVertex === to && pointArray.length ===\n\
      edge.pointArray.length && equal(pointArray, edge.pointArray)) {\n\
      return edge;\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Convert the graph coordinates to a linear 1-d display. Assumes a branch-based, acyclic graph\n\
 */\n\
\n\
NetworkGraph.prototype.convertTo1D = function(stopArray, from, to) {\n\
  if (this.edges.length === 0) return;\n\
\n\
  // find the \"trunk\" edge; i.e. the one with the most patterns\n\
  var trunkEdge = null;\n\
  var maxPatterns = 0;\n\
\n\
  for (var e = 0; e < this.edges.length; e++) {\n\
    var edge = this.edges[e];\n\
    if (edge.patterns.length > maxPatterns) {\n\
      trunkEdge = edge;\n\
      maxPatterns = edge.patterns.length;\n\
    }\n\
  }\n\
  this.exploredVertices = [trunkEdge.fromVertex, trunkEdge.toVertex];\n\
\n\
  //console.log('trunk edge: ');\n\
  //console.log(trunkEdge);\n\
  trunkEdge.setStopLabelPosition(-1);\n\
\n\
  // determine the direction relative to the trunk edge\n\
  var llDir = trunkEdge.toVertex.x - trunkEdge.fromVertex.x;\n\
  if (llDir === 0) llDir = trunkEdge.toVertex.y - trunkEdge.fromVertex.y;\n\
\n\
  if (llDir > 0) {\n\
    // make the trunk edge from (0,0) to (x,0)\n\
    trunkEdge.fromVertex.moveTo(0, 0);\n\
    trunkEdge.toVertex.moveTo(trunkEdge.stopArray.length + 1, 0);\n\
\n\
    // explore the graph in both directions\n\
    this.extend1D(trunkEdge, trunkEdge.fromVertex, -1, 0);\n\
    this.extend1D(trunkEdge, trunkEdge.toVertex, 1, 0);\n\
  } else {\n\
    // make the trunk edge from (x,0) to (0,0)\n\
    trunkEdge.toVertex.moveTo(0, 0);\n\
    trunkEdge.fromVertex.moveTo(trunkEdge.stopArray.length + 1, 0);\n\
\n\
    // explore the graph in both directions\n\
    this.extend1D(trunkEdge, trunkEdge.fromVertex, 1, 0);\n\
    this.extend1D(trunkEdge, trunkEdge.toVertex, -1, 0);\n\
  }\n\
\n\
  this.apply1DOffsets();\n\
};\n\
\n\
NetworkGraph.prototype.extend1D = function(edge, vertex, direction, y) {\n\
  debug('extend1D');\n\
\n\
  var edges = vertex.incidentEdges(edge);\n\
  if (edges.length === 0) { // no additional edges to explore; we're done\n\
    return;\n\
  } else if (edges.length === 1) { // exactly one other edge to explore\n\
    var extEdge = edges[0];\n\
    var oppVertex = extEdge.oppositeVertex(vertex);\n\
    extEdge.setStopLabelPosition((y > 0) ? 1 : -1, vertex);\n\
\n\
    if (this.exploredVertices.indexOf(oppVertex) !== -1) {\n\
      debug('extend1D: Warning: found cycle in 1d graph');\n\
      return;\n\
    }\n\
    this.exploredVertices.push(oppVertex);\n\
\n\
    oppVertex.moveTo(vertex.x + (extEdge.stopArray.length + 1) * direction, y);\n\
    this.extend1D(extEdge, oppVertex, direction, y);\n\
  } else { // branch case\n\
    //console.log('branch:');\n\
\n\
    // iterate through the branches\n\
    edges.forEach(function(extEdge, i) {\n\
      var oppVertex = extEdge.oppositeVertex(vertex);\n\
\n\
      if (this.exploredVertices.indexOf(oppVertex) !== -1) {\n\
        debug('extend1D: Warning: found cycle in 1d graph (branch)');\n\
        return;\n\
      }\n\
      this.exploredVertices.push(oppVertex);\n\
\n\
      // the first branch encountered is rendered as the straight line\n\
      // TODO: apply logic to this based on trip count, etc.\n\
      if (i === 0) {\n\
        oppVertex.moveTo(vertex.x + (extEdge.stopArray.length + 1) *\n\
          direction, y);\n\
        extEdge.setStopLabelPosition((y > 0) ? 1 : -1, vertex);\n\
        this.extend1D(extEdge, oppVertex, direction, y);\n\
      } else { // subsequent branches\n\
\n\
        //console.log('branch y+'+i);\n\
        var branchY = y + i;\n\
\n\
        if (extEdge.stopArray.length === 0) {\n\
          oppVertex.moveTo(vertex.x + 1 * direction, branchY);\n\
          return;\n\
        }\n\
\n\
        var newVertexStop;\n\
        if (extEdge.fromVertex === vertex) {\n\
          newVertexStop = extEdge.stopArray[0];\n\
          extEdge.stopArray.splice(0, 1);\n\
        } else if (extEdge.toVertex === vertex) {\n\
          newVertexStop = extEdge.stopArray[extEdge.stopArray.length - 1];\n\
          extEdge.stopArray.splice(extEdge.stopArray.length - 1, 1);\n\
        }\n\
\n\
        var newVertex = this.addVertex(newVertexStop, vertex.x + direction,\n\
          branchY);\n\
\n\
        this.splitEdge(extEdge, newVertex, vertex);\n\
        extEdge.setStopLabelPosition((branchY > 0) ? 1 : -1, vertex);\n\
\n\
        oppVertex.moveTo(newVertex.x + (extEdge.stopArray.length + 1) *\n\
          direction, branchY);\n\
        this.extend1D(extEdge, oppVertex, direction, branchY);\n\
      }\n\
      //console.log(extEdge);\n\
    }, this);\n\
  }\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
NetworkGraph.prototype.splitEdge = function(edge, newVertex, adjacentVertex) {\n\
\n\
  var newEdge;\n\
  // attach the existing edge to the inserted vertex\n\
  if (edge.fromVertex === adjacentVertex) {\n\
    newEdge = this.addEdge([], adjacentVertex, newVertex, edge.edgeGroup.type);\n\
    edge.fromVertex = newVertex;\n\
  } else if (edge.toVertex === adjacentVertex) {\n\
    newEdge = this.addEdge([], newVertex, adjacentVertex, edge.edgeGroup.type);\n\
    edge.toVertex = newVertex;\n\
  } else { // invalid params\n\
    console.log('Warning: invalid params to graph.splitEdge');\n\
    return;\n\
  }\n\
\n\
  // de-associate the existing edge from the adjacentVertex\n\
  adjacentVertex.removeEdge(edge);\n\
\n\
  // create new edge and copy the patterns\n\
  //var newEdge = this.addEdge([], adjacentVertex, newVertex);\n\
  edge.patterns.forEach(function(pattern) {\n\
    newEdge.addPattern(pattern);\n\
  });\n\
\n\
  // associate both edges with the new vertex\n\
  newVertex.edges = [newEdge, edge];\n\
\n\
  // update the affected patterns' edge lists\n\
  edge.patterns.forEach(function(pattern) {\n\
    var i = pattern.graphEdges.indexOf(edge);\n\
    pattern.insertEdge(i, newEdge);\n\
  });\n\
\n\
  // copy the pathSegment list\n\
  newEdge.copyPathSegments(edge);\n\
\n\
};\n\
\n\
NetworkGraph.prototype.splitEdgeAtInternalPoints = function(edge, points) {\n\
  var subEdgePoints = [],\n\
    newEdge, newEdges = [];\n\
  var fromVertex = edge.fromVertex;\n\
  each(edge.pointArray, function(point) {\n\
    if (points.indexOf(point) !== -1) {\n\
      var x = point.worldX;\n\
      var y = point.worldY;\n\
      var newVertex = point.graphVertex || this.addVertex(point, x, y);\n\
      newVertex.isInternal = true;\n\
      newEdge = this.addEdge(subEdgePoints, fromVertex, newVertex, edge.edgeGroup\n\
        .type);\n\
      newEdge.isInternal = true;\n\
      newEdge.copyPathSegments(edge);\n\
      newEdges.push(newEdge);\n\
      subEdgePoints = [];\n\
      fromVertex = newVertex;\n\
    } else {\n\
      subEdgePoints.push(point);\n\
    }\n\
  }, this);\n\
\n\
  // create the last sub-edge\n\
  newEdge = this.addEdge(subEdgePoints, fromVertex, edge.toVertex, edge.edgeGroup\n\
    .type);\n\
  newEdge.isInternal = true;\n\
  newEdge.copyPathSegments(edge);\n\
  newEdges.push(newEdge);\n\
\n\
  // remove the original edge from the graph\n\
  each(edge.pathSegments, function(pathSegment) {\n\
    pathSegment.replaceEdge(edge, newEdges);\n\
  });\n\
\n\
  this.removeEdge(edge);\n\
\n\
};\n\
\n\
/*NetworkGraph.prototype.collapseTransfers = function(threshold) {\n\
  if(!threshold) return;\n\
  this.edges.forEach(function(edge) {\n\
    if (edge.getLength() > threshold ||\n\
      edge.fromVertex.point.containsFromPoint() ||\n\
      edge.fromVertex.point.containsToPoint() ||\n\
      edge.toVertex.point.containsFromPoint() ||\n\
      edge.toVertex.point.containsToPoint()) return;\n\
    //if(edge.fromVertex.point.getType() === 'PLACE' || edge.toVertex.point.getType() === 'PLACE') return;\n\
    var notTransit = true;\n\
    edge.pathSegments.forEach(function(segment) {\n\
      notTransit = notTransit && segment.type !== 'TRANSIT';\n\
    });\n\
    if (notTransit) {\n\
      this.mergeVertices([edge.fromVertex, edge.toVertex]);\n\
    }\n\
  }, this);\n\
};*/\n\
\n\
NetworkGraph.prototype.pruneVertices = function() {\n\
  each(this.vertices, function(vertex) {\n\
    if (vertex.point.containsSegmentEndPoint()) return;\n\
\n\
    var opposites = [];\n\
    var pathSegmentBundles = {}; // maps pathSegment id list (string) to collection of edges (array)\n\
\n\
    each(vertex.edges, function(edge) {\n\
      var pathSegmentIds = edge.getPathSegmentIds();\n\
      if (!(pathSegmentIds in pathSegmentBundles)) pathSegmentBundles[\n\
        pathSegmentIds] = [];\n\
      pathSegmentBundles[pathSegmentIds].push(edge);\n\
      var opp = edge.oppositeVertex(vertex);\n\
      if (opposites.indexOf(opp) === -1) opposites.push(opp);\n\
    });\n\
\n\
    if (opposites.length !== 2) return;\n\
\n\
    each(pathSegmentBundles, function(ids) {\n\
      var edgeArr = pathSegmentBundles[ids];\n\
      if (edgeArr.length === 2) this.mergeEdges(edgeArr[0], edgeArr[1]);\n\
    }, this);\n\
\n\
  }, this);\n\
};\n\
\n\
NetworkGraph.prototype.mergeEdges = function(edge1, edge2) {\n\
\n\
  // reverse edges if necessary\n\
  if (edge1.fromVertex === edge2.toVertex) {\n\
    this.mergeEdges(edge2, edge1);\n\
    return;\n\
  }\n\
\n\
  if (edge1.toVertex !== edge2.fromVertex) return; // edges cannot be merged\n\
\n\
  var internalPoints = edge1.pointArray.concat(edge2.pointArray);\n\
\n\
  var newEdge = this.addEdge(internalPoints, edge1.fromVertex, edge2.toVertex,\n\
    edge1.edgeGroup.type);\n\
  newEdge.pathSegments = edge1.pathSegments;\n\
  each(newEdge.pathSegments, function(segment) {\n\
    var i = segment.graphEdges.indexOf(edge1);\n\
    segment.graphEdges.splice(i, 0, newEdge);\n\
  });\n\
  this.removeEdge(edge1);\n\
  this.removeEdge(edge2);\n\
};\n\
\n\
NetworkGraph.prototype.snapToGrid = function(cellSize) {\n\
  var coincidenceMap = {};\n\
  this.vertices.forEach(function(vertex) {\n\
    var nx = Math.round(vertex.x / cellSize) * cellSize;\n\
    var ny = Math.round(vertex.y / cellSize) * cellSize;\n\
    vertex.x = nx;\n\
    vertex.y = ny;\n\
\n\
    var key = nx + '_' + ny;\n\
    if (!(key in coincidenceMap)) coincidenceMap[key] = [vertex];\n\
    else coincidenceMap[key].push(vertex);\n\
  });\n\
\n\
  each(coincidenceMap, function(key) {\n\
    var vertexArr = coincidenceMap[key];\n\
    if (vertexArr.length > 1) {\n\
      this.mergeVertices(vertexArr);\n\
    }\n\
  }, this);\n\
};\n\
\n\
NetworkGraph.prototype.calculateGeometry = function(cellSize, angleConstraint) {\n\
  this.edges.forEach(function(edge) {\n\
    edge.calculateGeometry(cellSize, angleConstraint);\n\
  });\n\
};\n\
\n\
NetworkGraph.prototype.resetCoordinates = function() {\n\
  this.vertices.forEach(function(vertex) {\n\
    //console.log(vertex);\n\
    vertex.x = vertex.origX;\n\
    vertex.y = vertex.origY;\n\
  });\n\
};\n\
\n\
NetworkGraph.prototype.recenter = function() {\n\
\n\
  var xCoords = [],\n\
    yCoords = [];\n\
  this.vertices.forEach(function(v) {\n\
    xCoords.push(v.x);\n\
    yCoords.push(v.y);\n\
  });\n\
\n\
  var mx = d3.median(xCoords),\n\
    my = d3.median(yCoords);\n\
\n\
  this.vertices.forEach(function(v) {\n\
    v.x = v.x - mx;\n\
    v.y = v.y - my;\n\
  });\n\
};\n\
\n\
NetworkGraph.prototype.clone = function() {\n\
  var vertices = [];\n\
  this.vertices.forEach(function(vertex) {\n\
    vertices.push(vertex.clone());\n\
  });\n\
\n\
  var edges = [];\n\
  this.edges.forEach(function(edge) {\n\
    edge.push(edge.clone());\n\
  });\n\
};\n\
\n\
/** 2D line bundling & offsetting **/\n\
\n\
NetworkGraph.prototype.apply2DOffsets = function() {\n\
\n\
  this.initComparisons();\n\
\n\
  var alignmentBundles = {}; // maps alignment ID to array of range-bounded bundles on that alignment\n\
\n\
  var addToBundle = function(segment, alignmentId) {\n\
    var bundle;\n\
\n\
    // compute the alignment range of the segment being bundled\n\
    var range = segment.graphEdge.getAlignmentRange(alignmentId);\n\
\n\
    // check if bundles already exist for this alignment\n\
    if (!(alignmentId in alignmentBundles)) { // if not, create new and add to collection\n\
      bundle = new AlignmentBundle();\n\
      bundle.addSegment(segment, range.min, range.max);\n\
      alignmentBundles[alignmentId] = [bundle]; // new AlignmentBundle();\n\
    } else { // 1 or more bundles currently exist for this alignmentId\n\
      var bundleArr = alignmentBundles[alignmentId];\n\
\n\
      // see if the segment range overlaps with that of an existing bundle\n\
      for (var i = 0; i < bundleArr.length; i++) {\n\
        if (bundleArr[i].rangeOverlaps(range.min, range.max)) {\n\
          bundleArr[i].addSegment(segment, range.min, range.max);\n\
          return;\n\
        }\n\
      }\n\
\n\
      // ..if not, create a new bundle\n\
      bundle = new AlignmentBundle();\n\
      bundle.addSegment(segment, range.min, range.max);\n\
      bundleArr.push(bundle);\n\
    }\n\
  };\n\
\n\
  each(this.edges, function(edge) {\n\
\n\
    var fromAlignmentId = edge.getFromAlignmentId();\n\
    var toAlignmentId = edge.getToAlignmentId();\n\
\n\
    each(edge.renderedEdges, function(rEdge) {\n\
      addToBundle(rEdge, fromAlignmentId);\n\
      addToBundle(rEdge, toAlignmentId);\n\
    });\n\
  });\n\
\n\
  var bundleSorter = (function(a, b) {\n\
    var aId = a.patternIds || a.pathSegmentIds;\n\
    var bId = b.patternIds || b.pathSegmentIds;\n\
\n\
    var aVector = a.getAlignmentVector(this.currentAlignmentId);\n\
    var bVector = b.getAlignmentVector(this.currentAlignmentId);\n\
    var isOutward = (Util.isOutwardVector(aVector) && Util.isOutwardVector(\n\
      bVector)) ? 1 : -1;\n\
\n\
    var abCompId = aId + '_' + bId;\n\
    if (abCompId in this.bundleComparisons) {\n\
      return isOutward * this.bundleComparisons[abCompId];\n\
    }\n\
\n\
    var baCompId = bId + '_' + aId;\n\
    if (baCompId in this.bundleComparisons) {\n\
      return isOutward * this.bundleComparisons[baCompId];\n\
    }\n\
\n\
    if (a.route && b.route && a.route.route_type !== b.route.route_type) {\n\
      return a.route.route_type > b.route.route_type ? 1 : -1;\n\
    }\n\
\n\
    return isOutward * (aId < bId ? -1 : 1);\n\
  }).bind(this);\n\
\n\
  each(alignmentBundles, function(alignmentId) {\n\
    var bundleArr = alignmentBundles[alignmentId];\n\
    each(bundleArr, function(bundle) {\n\
      if (bundle.items.length <= 1) return;\n\
      var lw = 1.2;\n\
      var bundleWidth = lw * (bundle.items.length - 1);\n\
\n\
      this.currentAlignmentId = alignmentId;\n\
      bundle.items.sort(bundleSorter);\n\
      each(bundle.items, function(segment, i) {\n\
        var offset = (-bundleWidth / 2) + i * lw;\n\
        if (segment.getType() === 'TRANSIT') {\n\
          each(segment.patterns, function(pattern) {\n\
            pattern.offsetAlignment(alignmentId, offset);\n\
          });\n\
        } else segment.offsetAlignment(alignmentId, offset);\n\
      });\n\
    }, this);\n\
  }, this);\n\
};\n\
\n\
/**\n\
 * Traverses the graph vertex-by-vertex, creating comparisons between all pairs of\n\
 * edges for which a topological relationship can be established.\n\
 */\n\
\n\
NetworkGraph.prototype.initComparisons = function() {\n\
\n\
  this.bundleComparisons = {};\n\
\n\
  each(this.vertices, function(vertex) {\n\
    var edges = vertex.incidentEdges();\n\
\n\
    var angleSegments = {};\n\
    each(edges, function(edge) {\n\
      var angle = (edge.fromVertex === vertex) ? edge.fromAngle : edge.toAngle;\n\
      var angleDeg = 180 * angle / Math.PI;\n\
      if (!(angleDeg in angleSegments)) angleSegments[angleDeg] = [];\n\
      angleSegments[angleDeg] = angleSegments[angleDeg].concat(edge.renderedEdges);\n\
    });\n\
\n\
    each(angleSegments, function(angle) {\n\
      var segments = angleSegments[angle];\n\
      if (segments.length < 2) return;\n\
      for (var i = 0; i < segments.length - 1; i++) {\n\
        for (var j = i + 1; j < segments.length; j++) {\n\
          var s1 = segments[i],\n\
            s2 = segments[j];\n\
\n\
          var opp1 = s1.graphEdge.oppositeVertex(vertex);\n\
          var opp2 = s2.graphEdge.oppositeVertex(vertex);\n\
\n\
          var ccw = Util.ccw(opp1.x, opp1.y, vertex.x, vertex.y, opp2.x,\n\
            opp2.y);\n\
\n\
          if (ccw === 0) {\n\
            var s1Ext = s1.findExtension(opp1);\n\
            var s2Ext = s2.findExtension(opp2);\n\
            if (s1Ext) opp1 = s1Ext.graphEdge.oppositeVertex(opp1);\n\
            if (s2Ext) opp2 = s2Ext.graphEdge.oppositeVertex(opp2);\n\
            ccw = Util.ccw(opp1.x, opp1.y, vertex.x, vertex.y, opp2.x, opp2\n\
              .y);\n\
          }\n\
\n\
          ccw = getInverse(s1, s2, vertex) * ccw;\n\
\n\
          if (ccw > 0) {\n\
            // e1 patterns are 'less' than e2 patterns\n\
            this.storeComparison(s1, s2);\n\
          }\n\
\n\
          if (ccw < 0) {\n\
            // e2 patterns are 'less' than e2 patterns\n\
            this.storeComparison(s2, s1);\n\
          }\n\
\n\
        }\n\
      }\n\
    }, this);\n\
  }, this);\n\
};\n\
\n\
function getInverse(s1, s2, vertex) {\n\
  return ((s1.graphEdge.toVertex === vertex && s2.graphEdge.toVertex === vertex) ||\n\
      (s1.graphEdge.toVertex === vertex && s2.graphEdge.fromVertex === vertex)) ?\n\
    -1 : 1;\n\
}\n\
\n\
NetworkGraph.prototype.storeComparison = function(s1, s2) {\n\
  var s1Id = s1.patternIds || s1.pathSegmentIds;\n\
  var s2Id = s2.patternIds || s2.pathSegmentIds;\n\
  debug('storing comparison: ' + s1Id + ' < ' + s2Id);\n\
  this.bundleComparisons[s1Id + '_' + s2Id] = -1;\n\
  this.bundleComparisons[s2Id + '_' + s1Id] = 1;\n\
};\n\
\n\
/**\n\
 *  AlignmentBundle class\n\
 */\n\
\n\
function AlignmentBundle() {\n\
  this.items = []; // RenderSegments\n\
  this.min = Number.MAX_VALUE;\n\
  this.max = -Number.MAX_VALUE;\n\
}\n\
\n\
AlignmentBundle.prototype.addSegment = function(segment, min, max) {\n\
\n\
  if (this.items.indexOf(segment) === -1) {\n\
    this.items.push(segment);\n\
  }\n\
\n\
  this.min = Math.min(this.min, min);\n\
  this.max = Math.max(this.max, max);\n\
};\n\
\n\
AlignmentBundle.prototype.rangeOverlaps = function(min, max) {\n\
  return this.min < max && min < this.max;\n\
};\n\
\n\
/** other helper functions **/\n\
\n\
function getAlignmentVector(alignmentId) {\n\
  if (alignmentId.charAt(0) === 'x') return {\n\
    x: 0,\n\
    y: 1\n\
  };\n\
  if (alignmentId.charAt(0) === 'y') return {\n\
    x: 1,\n\
    y: 0\n\
  };\n\
}\n\
\n\
function getOutVector(edge, vertex) {\n\
\n\
  if (edge.fromVertex === vertex) {\n\
    return edge.fromVector;\n\
  }\n\
  if (edge.toVertex === vertex) {\n\
    var v = {\n\
      x: -edge.toVector.x,\n\
      y: -edge.toVector.y,\n\
    };\n\
    return v;\n\
  }\n\
\n\
  console.log('Warning: getOutVector() called on invalid edge / vertex pair');\n\
  console.log(' - Edge: ' + edge.toString());\n\
  console.log(' - Vertex: ' + vertex.toString());\n\
}\n\
\n\
/**\n\
 * Check if arrays are equal\n\
 */\n\
\n\
function equal(a, b) {\n\
  if (a.length !== b.length) {\n\
    return false;\n\
  }\n\
\n\
  for (var i in a) {\n\
    if (a[i] !== b[i]) {\n\
      return false;\n\
    }\n\
  }\n\
\n\
  return true;\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/graph/index.js"
));
require.register("conveyal-transitive.js/lib/graph/edge.js", Function("exports, require, module",
"var each = require('each');\n\
var PriorityQueue = require('priorityqueuejs');\n\
\n\
var Util = require('../util');\n\
\n\
var debug = require('debug')('transitive:edge');\n\
\n\
/**\n\
 * Expose `Edge`\n\
 */\n\
\n\
module.exports = Edge;\n\
\n\
/**\n\
 * Initialize a new edge\n\
 *\n\
 * @param {Array}\n\
 * @param {Vertex}\n\
 * @param {Vertex}\n\
 */\n\
\n\
var edgeId = 0;\n\
\n\
function Edge(pointArray, fromVertex, toVertex) {\n\
  this.id = edgeId++;\n\
  this.pointArray = pointArray;\n\
  this.fromVertex = fromVertex;\n\
  this.toVertex = toVertex;\n\
  this.pathSegments = [];\n\
  this.renderedEdges = [];\n\
}\n\
\n\
Edge.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.getLength = function() {\n\
  var dx = this.toVertex.x - this.fromVertex.x,\n\
    dy = this.toVertex.y - this.fromVertex.y;\n\
  return Math.sqrt(dx * dx + dy * dy);\n\
};\n\
\n\
Edge.prototype.getWorldLength = function() {\n\
  if (!this.worldLength) this.calculateWorldLengthAndMidpoint();\n\
  return this.worldLength;\n\
};\n\
\n\
Edge.prototype.getWorldMidpoint = function() {\n\
  if (!this.worldMidpoint) this.calculateWorldLengthAndMidpoint();\n\
  return this.worldMidpoint;\n\
};\n\
\n\
Edge.prototype.calculateWorldLengthAndMidpoint = function() {\n\
  var allPoints = [this.fromVertex.point].concat(this.pointArray, [this.toVertex\n\
    .point\n\
  ]);\n\
  this.worldLength = 0;\n\
  for (var i = 0; i < allPoints.length - 1; i++) {\n\
    this.worldLength += Util.distance(allPoints[i].worldX, allPoints[i].worldY,\n\
      allPoints[i + 1].worldX, allPoints[i + 1].worldY);\n\
  }\n\
\n\
  if (this.worldLength === 0) {\n\
    this.worldMidpoint = {\n\
      x: this.fromVertex.point.worldX,\n\
      y: this.fromVertex.point.worldY\n\
    };\n\
  } else {\n\
    var distTraversed = 0;\n\
    for (i = 0; i < allPoints.length - 1; i++) {\n\
      var dist = Util.distance(allPoints[i].worldX, allPoints[i].worldY,\n\
        allPoints[i + 1].worldX, allPoints[i + 1].worldY);\n\
      if ((distTraversed + dist) / this.worldLength >= 0.5) {\n\
        // find the position along this segment (0 <= t <= 1) where the edge midpoint lies\n\
        var t = (0.5 - distTraversed / this.worldLength) / (dist / this.worldLength);\n\
        this.worldMidpoint = {\n\
          x: allPoints[i].worldX + t * (allPoints[i + 1].worldX - allPoints[i].worldX),\n\
          y: allPoints[i].worldY + t * (allPoints[i + 1].worldY - allPoints[i].worldY)\n\
        };\n\
        this.pointsBeforeMidpoint = i;\n\
        this.pointsAfterMidpoint = this.pointArray.length - i;\n\
        break;\n\
      }\n\
      distTraversed += dist;\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.isAxial = function() {\n\
  return (this.toVertex.x === this.fromVertex.x) || (this.toVertex.y === this.fromVertex\n\
    .y);\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.hasCurvature = function() {\n\
  return this.elbow !== null;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.replaceVertex = function(oldVertex, newVertex) {\n\
  if (oldVertex === this.fromVertex) this.fromVertex = newVertex;\n\
  if (oldVertex === this.toVertex) this.toVertex = newVertex;\n\
};\n\
\n\
/**\n\
 *  Add a path segment that traverses this edge\n\
 */\n\
\n\
Edge.prototype.addPathSegment = function(segment) {\n\
  this.pathSegments.push(segment);\n\
};\n\
\n\
Edge.prototype.copyPathSegments = function(baseEdge) {\n\
  each(baseEdge.pathSegments, function(pathSegment) {\n\
    this.addPathSegment(pathSegment);\n\
  }, this);\n\
};\n\
\n\
Edge.prototype.getPathSegmentIds = function(baseEdge) {\n\
  var pathSegIds = [];\n\
  each(this.pathSegments, function(segment) {\n\
    pathSegIds.push(segment.id);\n\
  });\n\
  pathSegIds.sort();\n\
  return pathSegIds.join(',');\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.addRenderedEdge = function(rEdge) {\n\
  if (this.renderedEdges.indexOf(rEdge) !== -1) return;\n\
  this.renderedEdges.push(rEdge);\n\
};\n\
\n\
/** internal geometry functions **/\n\
\n\
Edge.prototype.calculateGeometry = function(cellSize, angleConstraint) {\n\
\n\
  //if(!this.hasTransit()) angleConstraint = 5;\n\
  angleConstraint = angleConstraint || 45;\n\
\n\
  this.angleConstraintR = angleConstraint * Math.PI / 180;\n\
\n\
  this.fx = this.fromVertex.point.worldX;\n\
  this.fy = this.fromVertex.point.worldY;\n\
  this.tx = this.toVertex.point.worldX;\n\
  this.ty = this.toVertex.point.worldY;\n\
\n\
  var midpoint = this.getWorldMidpoint();\n\
\n\
  var targetFromAngle = Util.getVectorAngle(midpoint.x - this.fx, midpoint.y -\n\
    this.fy);\n\
  this.constrainedFromAngle = Math.round(targetFromAngle / this.angleConstraintR) *\n\
    this.angleConstraintR;\n\
\n\
  var fromAngleDelta = Math.abs(this.constrainedFromAngle - targetFromAngle);\n\
  this.fvx = Math.cos(this.constrainedFromAngle);\n\
  this.fvy = Math.sin(this.constrainedFromAngle);\n\
\n\
  var targetToAngle = Util.getVectorAngle(midpoint.x - this.tx, midpoint.y -\n\
    this.ty);\n\
\n\
  this.constrainedToAngle = Math.round(targetToAngle / this.angleConstraintR) *\n\
    this.angleConstraintR;\n\
\n\
  var toAngleDelta = Math.abs(this.constrainedToAngle - targetToAngle);\n\
  this.tvx = Math.cos(this.constrainedToAngle);\n\
  this.tvy = Math.sin(this.constrainedToAngle);\n\
\n\
  var tol = 0.01;\n\
  var v = Util.normalizeVector({\n\
    x: (this.toVertex.x - this.fromVertex.x),\n\
    y: (this.toVertex.y - this.fromVertex.y)\n\
  });\n\
\n\
  // check if we need to add curvature\n\
  if (!equalVectors(this.fvx, this.fvy, -this.tvx, -this.tvy, tol) || !\n\
    equalVectors(this.fvx, this.fvy, v.x, v.y, tol)) {\n\
\n\
    // see if the default endpoint angles produce a valid intersection\n\
    var isect = this.computeEndpointIntersection();\n\
\n\
    if (isect.intersect) { // if so, compute the elbow and we're done\n\
      this.elbow = {\n\
        x: this.fx + isect.u * this.fvx,\n\
        y: this.fy + isect.u * this.fvy,\n\
      };\n\
    } else { // if not, adjust the two endpoint angles until they properly intersect\n\
\n\
      // default test: compare angle adjustments (if significant difference)\n\
      if (Math.abs(fromAngleDelta - toAngleDelta) > 0.087) {\n\
        if (fromAngleDelta < toAngleDelta) {\n\
          this.adjustToAngle();\n\
        } else {\n\
          this.adjustFromAngle();\n\
        }\n\
      } else { // secondary test: look at distribution of shapepoints\n\
        if (this.pointsAfterMidpoint < this.pointsBeforeMidpoint) {\n\
          this.adjustToAngle();\n\
        } else {\n\
          this.adjustFromAngle();\n\
        }\n\
      }\n\
    }\n\
  }\n\
\n\
  this.fromAngle = this.constrainedFromAngle;\n\
  this.toAngle = this.constrainedToAngle;\n\
\n\
  this.calculateVectors();\n\
  this.calculateAlignmentIds();\n\
};\n\
\n\
/**\n\
 *  Adjust the 'to' endpoint angle by rotating it increments of angleConstraintR\n\
 *  until a valid intersection between the from and to endpoint rays is achieved.\n\
 */\n\
\n\
Edge.prototype.adjustToAngle = function() {\n\
  var ccw = Util.ccw(this.fx, this.fy, (this.fx + this.fvx), (this.fy + this.fvy),\n\
    this.tx, this.ty);\n\
  var delta = (ccw > 0) ? this.angleConstraintR : -this.angleConstraintR;\n\
  var i = 0,\n\
    isect;\n\
  while (i++ < 100) {\n\
    this.constrainedToAngle += delta;\n\
    this.tvx = Math.cos(this.constrainedToAngle);\n\
    this.tvy = Math.sin(this.constrainedToAngle);\n\
    isect = this.computeEndpointIntersection();\n\
    if (isect.intersect) break;\n\
  }\n\
  this.elbow = {\n\
    x: this.fx + isect.u * this.fvx,\n\
    y: this.fy + isect.u * this.fvy,\n\
  };\n\
};\n\
\n\
/**\n\
 *  Adjust the 'from' endpoint angle by rotating it increments of angleConstraintR\n\
 *  until a valid intersection between the from and to endpoint rays is achieved.\n\
 */\n\
\n\
Edge.prototype.adjustFromAngle = function() {\n\
  var ccw = Util.ccw(this.tx, this.ty, (this.tx + this.tvx), (this.ty + this.tvy),\n\
    this.fx, this.fy);\n\
  var delta = (ccw > 0) ? this.angleConstraintR : -this.angleConstraintR;\n\
  var i = 0,\n\
    isect;\n\
  while (i++ < 100) {\n\
    this.constrainedFromAngle += delta;\n\
    this.fvx = Math.cos(this.constrainedFromAngle);\n\
    this.fvy = Math.sin(this.constrainedFromAngle);\n\
    isect = this.computeEndpointIntersection();\n\
    if (isect.intersect) break;\n\
  }\n\
  this.elbow = {\n\
    x: this.fx + isect.u * this.fvx,\n\
    y: this.fy + isect.u * this.fvy,\n\
  };\n\
};\n\
\n\
Edge.prototype.computeEndpointIntersection = function() {\n\
  return Util.rayIntersection(this.fx, this.fy, this.fvx, this.fvy,\n\
    this.tx, this.ty, this.tvx, this.tvy);\n\
};\n\
\n\
function equalVectors(x1, y1, x2, y2, tol) {\n\
  tol = tol || 0;\n\
  return Math.abs(x1 - x2) < tol && Math.abs(y1 - y2) < tol;\n\
}\n\
\n\
Edge.prototype.calculateVectors = function(fromAngle, toAngle) {\n\
\n\
  this.fromVector = {\n\
    x: Math.cos(this.fromAngle),\n\
    y: Math.sin(this.fromAngle)\n\
  };\n\
\n\
  this.fromleftVector = {\n\
    x: -this.fromVector.y,\n\
    y: this.fromVector.x\n\
  };\n\
\n\
  this.fromRightVector = {\n\
    x: this.fromVector.y,\n\
    y: -this.fromVector.x\n\
  };\n\
\n\
  this.toVector = {\n\
    x: Math.cos(this.toAngle + Math.PI),\n\
    y: Math.sin(this.toAngle + Math.PI)\n\
  };\n\
\n\
  this.toleftVector = {\n\
    x: -this.toVector.y,\n\
    y: this.toVector.x\n\
  };\n\
\n\
  this.toRightVector = {\n\
    x: this.toVector.y,\n\
    y: -this.toVector.x\n\
  };\n\
};\n\
\n\
/**\n\
 *  Compute the 'alignment id', a string that uniquely identifies a line in\n\
 *  2D space given a point and angle relative to the x-axis.\n\
 */\n\
\n\
Edge.prototype.calculateAlignmentId = function(x, y, angle) {\n\
  var angleD = Math.round(angle * 180 / Math.PI);\n\
  if (angleD > 90) angleD -= 180;\n\
  if (angleD <= -90) angleD += 180;\n\
\n\
  if (angleD === 90) {\n\
    return '90_x' + x;\n\
  }\n\
\n\
  // calculate the y-axis crossing\n\
  var ya = Math.round(y - x * Math.tan(angle));\n\
  return angleD + '_y' + ya;\n\
};\n\
\n\
Edge.prototype.calculateAlignmentIds = function() {\n\
  this.fromAlignmentId = this.calculateAlignmentId(this.fromVertex.x, this.fromVertex\n\
    .y, this.fromAngle);\n\
  this.toAlignmentId = this.calculateAlignmentId(this.toVertex.x, this.toVertex\n\
    .y, this.toAngle);\n\
};\n\
\n\
Edge.prototype.hasTransit = function(cellSize) {\n\
  //console.log(this);\n\
  for (var i = 0; i < this.pathSegments.length; i++) {\n\
    if (this.pathSegments[i].getType() === 'TRANSIT') {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
Edge.prototype.getFromAlignmentId = function() {\n\
  return this.fromAlignmentId;\n\
};\n\
\n\
Edge.prototype.getToAlignmentId = function() {\n\
  return this.toAlignmentId;\n\
};\n\
\n\
Edge.prototype.getAlignmentRange = function(alignmentId) {\n\
\n\
  var p1, p2;\n\
  if (alignmentId === this.fromAlignmentId) {\n\
    p1 = this.fromVertex;\n\
    p2 = this.elbow || this.toVertex;\n\
  } else if (alignmentId === this.toAlignmentId) {\n\
    p1 = this.toVertex;\n\
    p2 = this.elbow || this.fromVertex;\n\
  } else {\n\
    return null;\n\
  }\n\
\n\
  var min, max;\n\
  if (alignmentId.substring(0, 2) === '90') {\n\
    min = Math.min(p1.y, p2.y);\n\
    max = Math.max(p1.y, p2.y);\n\
  } else {\n\
    min = Math.min(p1.x, p2.x);\n\
    max = Math.max(p1.x, p2.x);\n\
  }\n\
\n\
  return {\n\
    min: min,\n\
    max: max\n\
  };\n\
\n\
};\n\
\n\
Edge.prototype.align = function(vertex, vector) {\n\
  if (this.aligned || !this.hasCurvature()) return;\n\
  var currentVector = this.getVector(vertex);\n\
  if (Math.abs(currentVector.x) !== Math.abs(vector.x) || Math.abs(\n\
    currentVector.y) !== Math.abs(vector.y)) {\n\
    this.curveAngle = -this.curveAngle;\n\
    this.calculateGeometry();\n\
  }\n\
  this.aligned = true;\n\
};\n\
\n\
Edge.prototype.getGeometricCoords = function(display) {\n\
  var coords = [];\n\
\n\
  coords.push({\n\
    x: display.xScale(this.fromVertex.x),\n\
    y: display.yScale(this.fromVertex.y)\n\
  });\n\
\n\
  each(this.geomCoords, function(coord) {\n\
    coords.push({\n\
      x: display.xScale(coord[0]),\n\
      y: display.yScale(coord[1])\n\
    });\n\
  }, this);\n\
\n\
  coords.push({\n\
    x: display.xScale(this.toVertex.x),\n\
    y: display.yScale(this.toVertex.y)\n\
  });\n\
\n\
  return coords;\n\
};\n\
\n\
Edge.prototype.getRenderCoords = function(fromOffsetPx, toOffsetPx, display) {\n\
\n\
  var isBase = (fromOffsetPx === 0 && toOffsetPx === 0);\n\
\n\
  if (!this.baseRenderCoords && !isBase) {\n\
    this.calculateBaseRenderCoords(display);\n\
  }\n\
\n\
  var fromOffsetX = fromOffsetPx * this.fromRightVector.x;\n\
  var fromOffsetY = fromOffsetPx * this.fromRightVector.y;\n\
\n\
  var toOffsetX = toOffsetPx * this.toRightVector.x;\n\
  var toOffsetY = toOffsetPx * this.toRightVector.y;\n\
\n\
  var fx = this.fromVertex.getRenderX(display) + fromOffsetX;\n\
  var fy = this.fromVertex.getRenderY(display) - fromOffsetY;\n\
  var fvx = this.fromVector.x,\n\
    fvy = -this.fromVector.y;\n\
\n\
  var tx = this.toVertex.getRenderX(display) + toOffsetX;\n\
  var ty = this.toVertex.getRenderY(display) - toOffsetY;\n\
  var tvx = -this.toVector.x,\n\
    tvy = this.toVector.y;\n\
\n\
  var coords = [];\n\
\n\
  coords.push({\n\
    x: fx,\n\
    y: fy\n\
  });\n\
  var len = null,\n\
    x1, y1, x2, y2;\n\
\n\
  if ((isBase && !this.isStraight()) || (!isBase && this.baseRenderCoords.length ===\n\
    4)) {\n\
\n\
    var isect = Util.rayIntersection(fx, fy, fvx, fvy, tx, ty, tvx, tvy);\n\
    if (isect.intersect) {\n\
      var u = isect.u;\n\
      var ex = fx + fvx * u;\n\
      var ey = fy + fvy * u;\n\
\n\
      this.ccw = Util.ccw(fx, fy, ex, ey, tx, ty);\n\
\n\
      // calculate the angle of the arc\n\
      var angleR = this.getElbowAngle();\n\
\n\
      // calculate the radius of the arc in pixels, taking offsets into consideration\n\
      var rPx = this.getBaseRadiusPx() - this.ccw * (fromOffsetPx + toOffsetPx) /\n\
        2;\n\
\n\
      // calculate the distance from the elbow to place the arc endpoints in each direction\n\
      var d = rPx * Math.tan(angleR / 2);\n\
\n\
      // make sure the arc endpoint placement distance is not longer than the either of the\n\
      // elbow-to-edge-endpoint distances\n\
      var l1 = Util.distance(fx, fy, ex, ey),\n\
        l2 = Util.distance(tx, ty, ex, ey);\n\
      d = Math.min(Math.min(l1, l2), d);\n\
\n\
      x1 = ex - this.fromVector.x * d;\n\
      y1 = ey + this.fromVector.y * d;\n\
      coords.push({\n\
        x: x1,\n\
        y: y1,\n\
        len: Util.distance(fx, fy, x1, y1)\n\
      });\n\
\n\
      x2 = ex + this.toVector.x * d;\n\
      y2 = ey - this.toVector.y * d;\n\
\n\
      var radius = Util.getRadiusFromAngleChord(angleR, Util.distance(x1, y1,\n\
        x2, y2));\n\
      var arc = angleR * (180 / Math.PI) * (this.ccw < 0 ? 1 : -1);\n\
      coords.push({\n\
        x: x2,\n\
        y: y2,\n\
        len: angleR * radius,\n\
        arc: arc,\n\
        radius: radius\n\
      });\n\
\n\
      len = Util.distance(x2, y2, tx, ty);\n\
    } else if (!isBase) {\n\
\n\
      var flen = this.baseRenderCoords[1].len;\n\
      var tlen = this.baseRenderCoords[3].len;\n\
\n\
      if (flen === 0 || tlen === 0) {\n\
        x1 = fx + fvx * flen;\n\
        y1 = fy + fvy * flen;\n\
        x2 = tx + tvx * tlen;\n\
        y2 = ty + tvy * tlen;\n\
\n\
        coords.push({\n\
          x: x1,\n\
          y: y1,\n\
          len: flen\n\
        });\n\
\n\
        coords.push({\n\
          x: x2,\n\
          y: y2,\n\
          len: Util.distance(x1, y1, x2, y2)\n\
        });\n\
\n\
        len = tlen;\n\
      }\n\
    }\n\
  }\n\
\n\
  if (len === null) len = Util.distance(fx, fy, tx, ty);\n\
\n\
  coords.push({\n\
    x: tx,\n\
    y: ty,\n\
    len: len\n\
  });\n\
\n\
  return coords;\n\
};\n\
\n\
Edge.prototype.calculateBaseRenderCoords = function(display) {\n\
  this.baseRenderCoords = this.getRenderCoords(0, 0, display);\n\
};\n\
\n\
Edge.prototype.isStraight = function() {\n\
  var tol = 0.00001;\n\
  return (Math.abs(this.fromVector.x - this.toVector.x) < tol &&\n\
    Math.abs(this.fromVector.y - this.toVector.y) < tol);\n\
};\n\
\n\
Edge.prototype.getBaseRadiusPx = function() {\n\
  return 15;\n\
};\n\
\n\
Edge.prototype.getElbowAngle = function() {\n\
  var cx = this.fromVector.x - this.toVector.x;\n\
  var cy = this.fromVector.y - this.toVector.y;\n\
\n\
  var c = Math.sqrt(cx * cx + cy * cy) / 2;\n\
\n\
  var theta = Math.asin(c);\n\
\n\
  return theta * 2;\n\
};\n\
\n\
Edge.prototype.getRenderLength = function(display) {\n\
\n\
  if (!this.baseRenderCoords) this.calculateBaseRenderCoords(display);\n\
\n\
  if (!this.renderLength) {\n\
    this.renderLength = 0;\n\
    for (var i = 1; i < this.baseRenderCoords.length; i++) {\n\
      this.renderLength += this.baseRenderCoords[i].len;\n\
    }\n\
  }\n\
  return this.renderLength;\n\
};\n\
\n\
Edge.prototype.coordAlongEdge = function(t, coords, display) {\n\
\n\
  if (!this.baseRenderCoords) this.calculateBaseRenderCoords(display);\n\
\n\
  if (coords.length === 2 && this.baseRenderCoords.length === 4) {\n\
    return {\n\
      x: coords[0].x + t * (coords[1].x - coords[0].x),\n\
      y: coords[0].y + t * (coords[1].y - coords[0].y)\n\
    };\n\
  }\n\
\n\
  /*var len = 0;\n\
  for (var i = 1; i < this.baseRenderCoords.length; i++) {\n\
    len += this.baseRenderCoords[i].len;\n\
  }*/\n\
  var len = this.getRenderLength();\n\
\n\
  var loc = t * len;\n\
  var cur = 0;\n\
  for (var i = 1; i < this.baseRenderCoords.length; i++) {\n\
    if (loc < cur + this.baseRenderCoords[i].len) {\n\
      var t2 = (loc - cur) / this.baseRenderCoords[i].len;\n\
\n\
      if (coords[i].arc) {\n\
\n\
        var r = coords[i].radius;\n\
        var theta = Math.PI * coords[i].arc / 180;\n\
        var ccw = Util.ccw(coords[0].x, coords[0].y, coords[1].x, coords[1].y,\n\
          coords[2].x, coords[2].y);\n\
\n\
        return Util.pointAlongArc(coords[1].x, coords[1].y, coords[2].x, coords[\n\
          2].y, r, theta, ccw, t2);\n\
\n\
      } else {\n\
        var dx = coords[i].x - coords[i - 1].x;\n\
        var dy = coords[i].y - coords[i - 1].y;\n\
\n\
        return {\n\
          x: coords[i - 1].x + dx * t2,\n\
          y: coords[i - 1].y + dy * t2\n\
        };\n\
      }\n\
    }\n\
    cur += this.baseRenderCoords[i].len;\n\
  }\n\
\n\
};\n\
\n\
Edge.prototype.clearRenderData = function() {\n\
  this.baseRenderCoords = null;\n\
  this.renderLength = null;\n\
};\n\
\n\
Edge.prototype.getVector = function(vertex) {\n\
  if (vertex === this.fromVertex) return this.fromVector;\n\
  if (vertex === this.toVertex) return this.toVector;\n\
};\n\
\n\
/**\n\
 *  Gets the vertex opposite another vertex on an edge\n\
 */\n\
\n\
Edge.prototype.oppositeVertex = function(vertex) {\n\
  if (vertex === this.toVertex) return this.fromVertex;\n\
  if (vertex === this.fromVertex) return this.toVertex;\n\
  return null;\n\
};\n\
\n\
Edge.prototype.commonVertex = function(edge) {\n\
  if (this.fromVertex === edge.fromVertex || this.fromVertex === edge.toVertex)\n\
    return this.fromVertex;\n\
  if (this.toVertex === edge.fromVertex || this.toVertex === edge.toVertex)\n\
    return this.toVertex;\n\
  return null;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.setPointLabelPosition = function(pos, skip) {\n\
  if (this.fromVertex.point !== skip) this.fromVertex.point.labelPosition = pos;\n\
  if (this.toVertex.point !== skip) this.toVertex.point.labelPosition = pos;\n\
\n\
  this.pointArray.forEach(function(point) {\n\
    if (point !== skip) point.labelPosition = pos;\n\
  });\n\
};\n\
\n\
/**\n\
 *  Determines if this edge is part of a standalone, non-transit path\n\
 *  (e.g. a walk/bike/drive-only journey)\n\
 */\n\
\n\
Edge.prototype.isNonTransitPath = function() {\n\
  return this.pathSegments.length === 1 && this.pathSegments[0] !== 'TRANSIT' &&\n\
    this.pathSegments[0].path.segments.length === 1;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.toString = function() {\n\
  return 'Edge ' + this.getId() + ' (' + this.fromVertex.toString() + ' to ' +\n\
    this.toVertex.toString() + ')';\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/graph/edge.js"
));
require.register("conveyal-transitive.js/lib/graph/edgegroup.js", Function("exports, require, module",
"var debug = require('debug')('transitive:edgegroup');\n\
var each = require('each');\n\
var PriorityQueue = require('priorityqueuejs');\n\
\n\
var Util = require('../util');\n\
\n\
/**\n\
 * Expose `EdgeGroup`\n\
 */\n\
\n\
module.exports = EdgeGroup;\n\
\n\
/**\n\
 *  A group of edges that share the same endpoint vertices\n\
 */\n\
\n\
function EdgeGroup(fromVertex, toVertex, type) {\n\
  this.fromVertex = fromVertex;\n\
  this.toVertex = toVertex;\n\
  this.type = type;\n\
  this.edges = [];\n\
  this.commonPoints = null;\n\
  this.worldLength = 0;\n\
}\n\
\n\
EdgeGroup.prototype.addEdge = function(edge) {\n\
  this.edges.push(edge);\n\
  edge.edgeGroup = this;\n\
\n\
  // update the groups worldLength\n\
  this.worldLength = Math.max(this.worldLength, edge.getWorldLength());\n\
\n\
  if (this.commonPoints === null) { // if this is first edge added, initialize group's commonPoint array to include all of edge's points\n\
    this.commonPoints = [];\n\
    each(edge.pointArray, function(point) {\n\
      this.commonPoints.push(point);\n\
    }, this);\n\
  } else { // otherwise, update commonPoints array to only include those in added edge\n\
    var newCommonPoints = [];\n\
    each(edge.pointArray, function(point) {\n\
      if (this.commonPoints.indexOf(point) !== -1) newCommonPoints.push(point);\n\
    }, this);\n\
    this.commonPoints = newCommonPoints;\n\
  }\n\
};\n\
\n\
EdgeGroup.prototype.getWorldLength = function() {\n\
  return this.worldLength;\n\
};\n\
\n\
EdgeGroup.prototype.getInternalVertexPQ = function() {\n\
\n\
  // create an array of all points on the edge (endpoints and internal)\n\
  var allPoints = ([this.fromVertex.point]).concat(this.commonPoints, [this.toVertex\n\
    .point\n\
  ]);\n\
\n\
  var pq = new PriorityQueue(function(a, b) {\n\
    return a.weight - b.weight;\n\
  });\n\
\n\
  for (var i = 1; i < allPoints.length - 1; i++) {\n\
    var weight = this.getInternalVertexWeight(allPoints, i);\n\
    pq.enq({\n\
      weight: weight,\n\
      point: allPoints[i]\n\
    });\n\
  }\n\
\n\
  return pq;\n\
\n\
};\n\
\n\
EdgeGroup.prototype.getInternalVertexWeight = function(pointArray, index) {\n\
  var x1 = pointArray[index - 1].worldX;\n\
  var y1 = pointArray[index - 1].worldY;\n\
  var x2 = pointArray[index].worldX;\n\
  var y2 = pointArray[index].worldY;\n\
  var x3 = pointArray[index + 1].worldX;\n\
  var y3 = pointArray[index + 1].worldY;\n\
\n\
  // the weighting function is a combination of:\n\
  // - the distances from this internal point to the two adjacent points, normalized for edge length (longer distances are prioritized)\n\
  // - the angle formed by this point and the two adjacent ones ('sharper' angles are prioritized)\n\
  var inDist = Util.distance(x1, y1, x2, y2);\n\
  var outDist = Util.distance(x2, y2, x3, y3);\n\
  var theta = Util.angleFromThreePoints(x1, y1, x2, y2, x3, y3);\n\
  var edgeLen = this.getWorldLength();\n\
  var weight = inDist / edgeLen + outDist / edgeLen + Math.abs(Math.PI - theta) /\n\
    Math.PI;\n\
};\n\
\n\
EdgeGroup.prototype.hasTransit = function() {\n\
  for (var i = 0; i < this.edges.length; i++) {\n\
    if (this.edges[i].hasTransit()) return true;\n\
  }\n\
  return false;\n\
};\n\
\n\
EdgeGroup.prototype.isNonTransitPath = function() {\n\
  return (this.edges.length === 1 && this.edges[0].isNonTransitPath());\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/graph/edgegroup.js"
));
require.register("conveyal-transitive.js/lib/graph/vertex.js", Function("exports, require, module",
"/**\n\
 * Expose `Vertex`\n\
 */\n\
\n\
module.exports = Vertex;\n\
\n\
/**\n\
 * Initialize new Vertex\n\
 *\n\
 * @param {Stop/Place}\n\
 * @param {Number}\n\
 * @param {Number}\n\
 */\n\
\n\
var edgeId = 0;\n\
\n\
function Vertex(point, x, y) {\n\
  this.id = edgeId++;\n\
  this.point = point;\n\
  this.point.graphVertex = this;\n\
  this.x = this.origX = x;\n\
  this.y = this.origY = y;\n\
  this.edges = [];\n\
}\n\
\n\
Vertex.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
Vertex.prototype.getRenderX = function(display) {\n\
  return display.xScale(this.x) + this.point.placeOffsets.x;\n\
};\n\
\n\
Vertex.prototype.getRenderY = function(display) {\n\
  return display.yScale(this.y) + this.point.placeOffsets.y;\n\
};\n\
\n\
/**\n\
 * Move to new coordinate\n\
 *\n\
 * @param {Number}\n\
 * @param {Number}\n\
 */\n\
\n\
Vertex.prototype.moveTo = function(x, y) {\n\
  this.x = x;\n\
  this.y = y;\n\
  /*this.edges.forEach(function (edge) {\n\
    edge.calculateVectors();\n\
  });*/\n\
};\n\
\n\
/**\n\
 * Get array of edges incident to vertex. Allows specification of \"incoming\" edge that will not be included in results\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.incidentEdges = function(inEdge) {\n\
  var results = [];\n\
  this.edges.forEach(function(edge) {\n\
    if (edge !== inEdge) results.push(edge);\n\
  });\n\
  return results;\n\
};\n\
\n\
/**\n\
 * Add an edge to the vertex's edge list\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.addEdge = function(edge) {\n\
  var index = this.edges.indexOf(edge);\n\
  if (index === -1) this.edges.push(edge);\n\
};\n\
\n\
/**\n\
 * Remove an edge from the vertex's edge list\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.removeEdge = function(edge) {\n\
  var index = this.edges.indexOf(edge);\n\
  if (index !== -1) this.edges.splice(index, 1);\n\
};\n\
\n\
Vertex.prototype.toString = function() {\n\
  return 'Vertex ' + this.getId() + ' (' + (this.point ? this.point.toString() :\n\
    'no point assigned') + ')';\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/graph/vertex.js"
));
require.register("conveyal-transitive.js/lib/styler/index.js", Function("exports, require, module",
"var clone = require('clone');\n\
var each = require('each');\n\
var svgAttributes = require('svg-attributes');\n\
\n\
var Route = require('../core/route');\n\
var RoutePattern = require('../core/pattern');\n\
var Util = require('../util');\n\
\n\
var styles = require('./styles');\n\
\n\
/**\n\
 * Element Types\n\
 */\n\
\n\
var types = [\n\
  'labels',\n\
  'segments',\n\
  'segments_front',\n\
  'segments_halo',\n\
  'segment_labels',\n\
  'segment_label_containers',\n\
  'stops_merged',\n\
  'stops_pattern',\n\
  'places',\n\
  'places_icon',\n\
  'multipoints_merged',\n\
  'multipoints_pattern'\n\
];\n\
\n\
/**\n\
 * Add transform\n\
 */\n\
\n\
svgAttributes.push('transform');\n\
\n\
/**\n\
 * Expose `Styler`\n\
 */\n\
\n\
module.exports = Styler;\n\
\n\
/**\n\
 * Styler object\n\
 */\n\
\n\
function Styler(styles) {\n\
  if (!(this instanceof Styler)) return new Styler(styles);\n\
\n\
  // reset styles\n\
  this.reset();\n\
\n\
  // load styles\n\
  if (styles) this.load(styles);\n\
}\n\
\n\
/**\n\
 * Clear all current styles\n\
 */\n\
\n\
Styler.prototype.clear = function() {\n\
  for (var i in types) {\n\
    this[types[i]] = {};\n\
  }\n\
};\n\
\n\
/**\n\
 * Reset to the predefined styles\n\
 */\n\
\n\
Styler.prototype.reset = function() {\n\
  for (var i in types) {\n\
    var type = types[i];\n\
    this[type] = clone(styles[type] || {});\n\
    for (var key in this[type]) {\n\
      if (!Array.isArray(this[type][key])) this[type][key] = [this[type][key]];\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Load rules\n\
 *\n\
 * @param {Object} a set of style rules\n\
 */\n\
\n\
Styler.prototype.load = function(styles) {\n\
  var self = this;\n\
  for (var i in types) {\n\
    var type = types[i];\n\
    if (styles[type]) {\n\
      for (var key in styles[type]) {\n\
        this[type][key] = (this[type][key] || []).concat(styles[type][key]);\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Render pattern\n\
 *\n\
 * @param {Display} display\n\
 * @param {Pattern} pattern\n\
 */\n\
\n\
Styler.prototype.renderSegment = function(display, segment) {\n\
\n\
  if (segment.lineGraphHalo) {\n\
\n\
    this.applyAttrAndStyle(\n\
      display,\n\
      segment.lineGraphHalo,\n\
      this.segments_halo\n\
    );\n\
  }\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.lineGraph,\n\
    this.segments\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.lineGraphFront,\n\
    this.segments_front\n\
  );\n\
};\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Point} Transitive Point object\n\
 */\n\
\n\
Styler.prototype.renderPoint = function(display, point) {\n\
  if (point.getType() === 'STOP') this.renderStop(display, point);\n\
  if (point.getType() === 'PLACE') this.renderPlace(display, point);\n\
  if (point.getType() === 'MULTI') this.renderMultiPoint(display, point);\n\
};\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Stop} Transitive Stop object\n\
 */\n\
\n\
Styler.prototype.renderStop = function(display, stop) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.patternMarkers,\n\
    this.stops_pattern\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.mergedMarker,\n\
    this.stops_merged\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.svgGroup.selectAll('.transitive-stop-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Place} Transitive Place object\n\
 */\n\
\n\
Styler.prototype.renderPlace = function(display, place) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-circle'),\n\
    this.places\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-icon'),\n\
    this.places_icon\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {MultiPoint} Transitive MultiPoint object\n\
 */\n\
\n\
Styler.prototype.renderMultiPoint = function(display, multipoint) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multipoint-marker-pattern'),\n\
    this.multipoints_pattern\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multipoint-marker-merged'),\n\
    this.multipoints_merged\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multi-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Point} Transitive Point object\n\
 */\n\
\n\
Styler.prototype.renderPointLabel = function(display, point) {\n\
  var pointType = point.getType().toLowerCase();\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    point.svgGroup.selectAll('.transitive-' + pointType + '-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
Styler.prototype.renderSegmentLabel = function(display, label) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    label.svgGroup.selectAll('.transitive-segment-label-container'),\n\
    this.segment_label_containers\n\
  );\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    label.svgGroup.selectAll('.transitive-segment-label'),\n\
    this.segment_labels\n\
  );\n\
};\n\
\n\
/**\n\
 * Check if it's an attribute or a style and apply accordingly\n\
 *\n\
 * @param {Display} the Display object\n\
 * @param {Object} a D3 list of elements\n\
 * @param {Object} the list of attributes\n\
 */\n\
\n\
Styler.prototype.applyAttrAndStyle = function(display, elements, attributes) {\n\
  for (var name in attributes) {\n\
    var rules = attributes[name];\n\
    var fn = svgAttributes.indexOf(name) === -1 ? 'style' : 'attr';\n\
\n\
    this.applyRules(display, elements, name, rules, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Apply style/attribute rules to a list of elements\n\
 *\n\
 * @param {Display} display object\n\
 * @param {Object} elements\n\
 * @param {String} rule name\n\
 * @param {Array} rules\n\
 * @param {String} style/attr\n\
 */\n\
\n\
Styler.prototype.applyRules = function(display, elements, name, rules, fn) {\n\
  var self = this;\n\
  elements[fn](name, function(data, index) {\n\
    return self.compute(rules, display, data, index);\n\
  });\n\
};\n\
\n\
/**\n\
 * Compute a style rule based on the current display and data\n\
 *\n\
 * @param {Array} array of rules\n\
 * @param {Object} the Display object\n\
 * @param {Object} data associated with this object\n\
 * @param {Number} index of this object\n\
 */\n\
\n\
Styler.prototype.compute = function(rules, display, data, index) {\n\
  var computed, self = this;\n\
  for (var i in rules) {\n\
    var rule = rules[i];\n\
    var val = isFunction(rule) ? rule.call(self, display, data, index, styles.utils) :\n\
      rule;\n\
    if (val !== undefined && val !== null) computed = val;\n\
  }\n\
  return computed;\n\
};\n\
\n\
/**\n\
 * Return the collection of default segment styles for a mode.\n\
 *\n\
 * @param {String} an OTP mode string\n\
 */\n\
\n\
Styler.prototype.getModeStyles = function(mode, display) {\n\
\n\
  var modeStyles = {};\n\
\n\
  // simulate a segment w/ the specified style\n\
  var segment = {\n\
    focused: true,\n\
    isFocused: function() {\n\
      return true;\n\
    }\n\
  };\n\
\n\
  if (mode === \"WALK\" || mode === \"BICYCLE\" || mode === \"CAR\") {\n\
    segment.type = mode;\n\
  } else { // assume a transit mode\n\
    segment.type = \"TRANSIT\";\n\
    segment.mode = Util.otpModeToGtfsType(mode);\n\
    var route = new Route({\n\
      route_type: segment.mode,\n\
      agency_id: \"\",\n\
      route_id: \"\",\n\
      route_short_name: \"\",\n\
      route_long_name: \"\"\n\
    });\n\
    var pattern = new RoutePattern({});\n\
    route.addPattern(pattern);\n\
    segment.patterns = [pattern];\n\
  }\n\
\n\
  for (var attrName in this.segments) {\n\
    var rules = this.segments[attrName];\n\
    for (var i in rules) {\n\
      var rule = rules[i];\n\
      var val = isFunction(rule) ? rule.call(this, display, segment, 0, styles.utils) :\n\
        rule;\n\
      if (val !== undefined && val !== null) {\n\
        modeStyles[attrName] = val;\n\
      }\n\
    }\n\
  }\n\
\n\
  return modeStyles;\n\
};\n\
\n\
/**\n\
 * Is function?\n\
 */\n\
\n\
function isFunction(val) {\n\
  return Object.prototype.toString.call(val) === '[object Function]';\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/styler/index.js"
));
require.register("conveyal-transitive.js/lib/styler/styles.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var clone = require('clone');\n\
\n\
/**\n\
 * Scales for utility functions to use\n\
 */\n\
\n\
var zoomScale = d3.scale.linear().domain([0.25, 1, 4]);\n\
var strokeScale = d3.scale.linear().domain([0.25, 1, 4]).range([5, 12, 19]);\n\
var fontScale = d3.scale.linear().domain([0.25, 1, 4]).range([10, 14, 18]);\n\
\n\
/**\n\
 * Scales for utility functions to use\n\
 */\n\
\n\
var notFocusedColor = '#e0e0e0';\n\
\n\
/**\n\
 * Expose `utils` for the style functions to use\n\
 */\n\
\n\
exports.utils = {\n\
  pixels: function(zoom, min, normal, max) {\n\
    return zoomScale.range([min, normal, max])(zoom);\n\
  },\n\
  strokeWidth: function(display) {\n\
    return strokeScale(display.zoom.scale());\n\
  },\n\
  fontSize: function(display, data) {\n\
    return Math.floor(fontScale(display.zoom.scale()));\n\
  },\n\
  defineSegmentCircleMarker: function(display, segment, radius, fillColor) {\n\
    var markerId = 'circleMarker-' + segment.getId();\n\
    display.svg.append('defs').append('svg:marker')\n\
      .attr('id', markerId)\n\
      .attr('refX', radius)\n\
      .attr('refY', radius)\n\
      .attr('markerWidth', radius * 2)\n\
      .attr('markerHeight', radius * 2)\n\
      .attr('markerUnits', 'userSpaceOnUse')\n\
      .append('svg:circle')\n\
      .attr('cx', radius)\n\
      .attr('cy', radius)\n\
      .attr('r', radius)\n\
      .attr('fill', segment.focused ? fillColor : notFocusedColor);\n\
\n\
    return 'url(#' + markerId + ')';\n\
  }\n\
};\n\
\n\
/**\n\
 * Default Merged Stops Rules\n\
 */\n\
\n\
var stops_merged = exports.stops_merged = {\n\
  fill: function(display, data, index, utils) {\n\
    return '#fff';\n\
  },\n\
  r: function(display, data, index, utils) {\n\
    return utils.pixels(display.zoom.scale(), 8, 12, 16);\n\
  },\n\
  stroke: function(display, data, index, utils) {\n\
    var point = data.owner;\n\
    if (!point.isFocused()) return notFocusedColor;\n\
    return '#000';\n\
  },\n\
  'stroke-width': function(display, data, index, utils) {\n\
    return 2;\n\
  },\n\
\n\
  /**\n\
   *  Transitive-specific attribute specifying the shape of the main stop marker.\n\
   *  Can be 'roundedrect', 'rectangle' or 'circle'\n\
   */\n\
\n\
  'marker-type': [\n\
    'circle',\n\
    function(display, data, index, utils) {\n\
      var point = data.owner;\n\
      if ((point.containsBoardPoint() || point.containsAlightPoint()) && !\n\
        point.containsTransferPoint()) return 'circle';\n\
    }\n\
  ],\n\
\n\
  /**\n\
   *  Transitive-specific attribute specifying any additional padding, in pixels,\n\
   *  to apply to main stop marker. A value of zero (default) results in a that\n\
   *  marker is flush to the edges of the pattern segment(s) the point is set against.\n\
   *  A value greater than zero creates a marker that is larger than the width of\n\
   *  the segments(s).\n\
   */\n\
\n\
  'marker-padding': 3,\n\
\n\
  visibility: function(display, data) {\n\
    if (!data.owner.containsSegmentEndPoint()) return 'hidden';\n\
  }\n\
};\n\
\n\
/**\n\
 * Stops Along a Pattern\n\
 */\n\
\n\
var stops_pattern = exports.stops_pattern = {\n\
  cx: 0,\n\
  cy: 0,\n\
  r: [\n\
    4,\n\
    function(display, data, index, utils) {\n\
      return utils.pixels(display.zoom.scale(), 1, 2, 4);\n\
    },\n\
    function(display, data, index, utils) {\n\
      var point = data.owner;\n\
      var busOnly = true;\n\
      point.getPatterns().forEach(function(pattern) {\n\
        if (pattern.route && pattern.route.route_type !== 3) busOnly =\n\
          false;\n\
      });\n\
      if (busOnly && !point.containsSegmentEndPoint()) {\n\
        return 0.5 * utils.pixels(display.zoom.scale(), 2, 4, 6.5);\n\
      }\n\
    }\n\
  ],\n\
  stroke: 'none',\n\
  visibility: function(display, data) {\n\
    if (display.zoom.scale() < 1.5) return 'hidden';\n\
    if (data.owner.containsSegmentEndPoint()) return 'hidden';\n\
  }\n\
};\n\
\n\
/**\n\
 * Default place rules\n\
 */\n\
\n\
exports.places = {\n\
  cx: 0,\n\
  cy: 0,\n\
  r: 14,\n\
  stroke: '0px',\n\
  fill: '#fff'\n\
};\n\
\n\
/**\n\
 * Default MultiPoint rules -- based on Stop rules\n\
 */\n\
\n\
var multipoints_merged = exports.multipoints_merged = clone(stops_merged);\n\
\n\
multipoints_merged.visibility = true;\n\
\n\
/**\n\
 * Default Multipoint Stops along a pattern\n\
 */\n\
\n\
exports.multipoints_pattern = clone(stops_pattern);\n\
\n\
/**\n\
 * Default label rules\n\
 */\n\
\n\
var labels = exports.labels = {\n\
  'font-size': function(display, data, index, utils) {\n\
    return utils.fontSize(display, data) + 'px';\n\
  },\n\
  'font-weight': function(display, data, index, utils) {\n\
    var point = data.owner.parent;\n\
    if (point.containsBoardPoint() || point.containsAlightPoint())\n\
      return 'bold';\n\
  },\n\
\n\
  /**\n\
   * 'orientations' is a transitive-specific attribute used to specify allowable\n\
   * label placement orientations expressed as one of eight compass directions\n\
   * relative to the point being labeled:\n\
   *\n\
   *        'N'\n\
   *    'NW' |  'NE'\n\
   *       \\ | /\n\
   *  'W' -- O -- 'E'\n\
   *       / | \\\n\
   *    'SW' | 'SE'\n\
   *        'S\n\
   *\n\
   * Labels oriented 'E' or 'W' are rendered horizontally, 'N' and 'S' vertically,\n\
   * and all others at a 45-degree angle.\n\
   *\n\
   * Returns an array of allowed orientation codes in the order that they will be\n\
   * tried by the labeler.\n\
   */\n\
\n\
  orientations: [\n\
    ['E', 'W']\n\
  ]\n\
};\n\
\n\
/**\n\
 * All path segments\n\
 * TODO: update old route-pattern-specific code below\n\
 */\n\
\n\
exports.segments = {\n\
  stroke: [\n\
    '#008',\n\
    function(display, data) {\n\
      var segment = data;\n\
      if (!segment.focused) return notFocusedColor;\n\
      if (segment.type === 'TRANSIT') {\n\
        if (segment.patterns) {\n\
          if (segment.patterns[0].route.route_short_name.toLowerCase().substring(\n\
            0,\n\
            2) === 'dc') return '#f00';\n\
          return segment.patterns[0].route.getColor();\n\
        }\n\
      } else if (segment.type === 'CAR') {\n\
        return '#888';\n\
      }\n\
    }\n\
  ],\n\
  'stroke-dasharray': [\n\
    false,\n\
    function(display, data) {\n\
      var segment = data;\n\
      if (segment.frequency && segment.frequency.average < 12) {\n\
        if (segment.frequency.average > 6) return '12px, 12px';\n\
        return '12px, 2px';\n\
      }\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    '12px',\n\
    function(display, data, index, utils) {\n\
      var segment = data;\n\
\n\
      if (segment.mode === 3) {\n\
        return utils.pixels(display.zoom.scale(), 2, 4, 8) + 'px';\n\
      }\n\
      return utils.pixels(display.zoom.scale(), 4, 8, 12) + 'px';\n\
    }\n\
  ],\n\
  envelope: [\n\
\n\
    function(display, data, index, utils) {\n\
      var segment = data;\n\
      if (segment.type !== 'TRANSIT') {\n\
        return '8px';\n\
      }\n\
      if (segment.mode === 3) {\n\
        return utils.pixels(display.zoom.scale(), 4, 6, 10) + 'px';\n\
      }\n\
      return utils.pixels(display.zoom.scale(), 6, 10, 14) + 'px';\n\
    }\n\
  ]\n\
};\n\
\n\
/**\n\
 * Segments Front\n\
 */\n\
\n\
exports.segments_front = {\n\
  stroke: '#008',\n\
  'stroke-width': function(display, data, index, utils) {\n\
    return utils.pixels(display.zoom.scale(), 3, 6, 10) / 2 + 'px';\n\
  },\n\
  fill: 'none',\n\
  display: [\n\
    'none',\n\
    function(display, data, index, utils) {\n\
      if (data.pattern && data.pattern.route && data.pattern.route.route_type ===\n\
        3 &&\n\
        data.pattern.route.route_short_name.toLowerCase().substring(0, 2) ===\n\
        'dc') {\n\
        return 'inline';\n\
      }\n\
    }\n\
  ]\n\
};\n\
\n\
/**\n\
 * Segments Halo\n\
 */\n\
\n\
exports.segments_halo = {\n\
  stroke: '#fff',\n\
  'stroke-width': function(display, data, index, utils) {\n\
    return data.computeLineWidth(display) + 8;\n\
  },\n\
  'stroke-linecap': 'round',\n\
  fill: 'none'\n\
};\n\
\n\
/**\n\
 * Label Containers\n\
 */\n\
\n\
exports.segment_label_containers = {\n\
  fill: function(display, data) {\n\
    if (!data.isFocused()) return notFocusedColor;\n\
  },\n\
  'stroke-width': function(display, data) {\n\
    if (data.parent.pattern && data.parent.pattern.route.route_short_name.toLowerCase()\n\
      .substring(0, 2) === 'dc') return 1;\n\
    return 0;\n\
  },\n\
  rx: 3,\n\
  ry: 3\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/styler/styles.js"
));
require.register("conveyal-transitive.js/lib/point/index.js", Function("exports, require, module",
"var augment = require('augment');\n\
var each = require('each');\n\
\n\
var PointLabel = require('../labeler/pointlabel');\n\
\n\
var debug = require('debug')('transitive:point');\n\
\n\
var Point = augment(Object, function() {\n\
\n\
  this.constructor = function(data) {\n\
    for (var key in data) {\n\
      this[key] = data[key];\n\
    }\n\
\n\
    this.paths = [];\n\
    this.renderData = [];\n\
\n\
    this.label = new PointLabel(this);\n\
    this.renderLabel = true;\n\
\n\
    this.focused = true;\n\
    this.sortableType = 'POINT';\n\
\n\
    this.placeOffsets = {\n\
      x: 0,\n\
      y: 0\n\
    };\n\
\n\
    this.zIndex = 10000;\n\
  };\n\
\n\
  /**\n\
   * Get unique ID for point -- must be defined by subclass\n\
   */\n\
\n\
  this.getId = function() {};\n\
\n\
  this.getElementId = function() {\n\
    return this.getType().toLowerCase() + '-' + this.getId();\n\
  };\n\
\n\
  /**\n\
   * Get Point type -- must be defined by subclass\n\
   */\n\
\n\
  this.getType = function() {};\n\
\n\
  /**\n\
   * Get Point name\n\
   */\n\
\n\
  this.getName = function() {\n\
    return this.getType() + ' point (ID=' + this.getId() + ')';\n\
  };\n\
\n\
  /**\n\
   * Get latitude\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return 0;\n\
  };\n\
\n\
  /**\n\
   * Get longitude\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return 0;\n\
  };\n\
\n\
  this.containsSegmentEndPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.containsBoardPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.containsAlightPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.containsTransferPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.getPatterns = function() {\n\
    return [];\n\
  };\n\
\n\
  /**\n\
   * Draw the point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.render = function(display) {\n\
    this.label.svgGroup = null;\n\
  };\n\
\n\
  /**\n\
   * Refresh a previously drawn point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {};\n\
\n\
  this.addRenderData = function() {};\n\
\n\
  this.clearRenderData = function() {};\n\
\n\
  this.containsFromPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.containsToPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.initSvg = function(display) {\n\
    // set up the main svg group for this stop\n\
    this.svgGroup = display.svg.append('g')\n\
      .attr('id', 'transitive-' + this.getType().toLowerCase() + '-' + this\n\
        .getId())\n\
    //.attr('class', 'transitive-sortable')\n\
    .datum(this);\n\
\n\
    this.markerSvg = this.svgGroup.append('g');\n\
    this.labelSvg = this.svgGroup.append('g');\n\
  };\n\
\n\
  //** Shared geom utility functions **//\n\
\n\
  this.constructMergedMarker = function(display) {\n\
\n\
    var dataArray = this.getRenderDataArray();\n\
    var xValues = [],\n\
      yValues = [];\n\
    dataArray.forEach(function(data) {\n\
      var x = data.x; //display.xScale(data.x) + data.offsetX;\n\
      var y = data.y; //display.yScale(data.y) - data.offsetY;\n\
      xValues.push(x);\n\
      yValues.push(y);\n\
    });\n\
    var minX = Math.min.apply(Math, xValues),\n\
      minY = Math.min.apply(Math, yValues);\n\
    var maxX = Math.max.apply(Math, xValues),\n\
      maxY = Math.max.apply(Math, yValues);\n\
\n\
    // retrieve marker type and radius from the styler\n\
    var markerType = display.styler.compute(display.styler.stops_merged[\n\
      'marker-type'], display, {\n\
      owner: this\n\
    });\n\
    var stylerRadius = display.styler.compute(display.styler.stops_merged.r,\n\
      display, {\n\
        owner: this\n\
      });\n\
\n\
    var width, height, r;\n\
\n\
    // if this is a circle marker w/ a styler-defined fixed radius, use that\n\
    if (markerType === 'circle' && stylerRadius) {\n\
      width = height = stylerRadius * 2;\n\
      r = stylerRadius;\n\
    }\n\
\n\
    // otherwise, this is a dynamically-sized marker\n\
    else {\n\
\n\
      var dx = maxX - minX,\n\
        dy = maxY - minY;\n\
\n\
      var markerPadding = display.styler.compute(display.styler.stops_merged[\n\
        'marker-padding'], display, {\n\
        owner: this\n\
      }) || 0;\n\
\n\
      var patternRadius = display.styler.compute(display.styler[\n\
        this.patternStylerKey].r, display, {\n\
        owner: this\n\
      });\n\
      r = parseFloat(patternRadius) + markerPadding;\n\
\n\
      if (markerType === 'circle') {\n\
        width = height = Math.max(dx, dy) + 2 * r;\n\
        r = width / 2;\n\
      } else {\n\
        width = dx + 2 * r;\n\
        height = dy + 2 * r;\n\
        if (markerType === 'rectangle') r = 0;\n\
      }\n\
    }\n\
\n\
    return {\n\
      x: (minX + maxX) / 2 - width / 2,\n\
      y: (minY + maxY) / 2 - height / 2,\n\
      width: width,\n\
      height: height,\n\
      rx: r,\n\
      ry: r\n\
    };\n\
\n\
  };\n\
\n\
  this.initMarkerData = function(display) {\n\
\n\
    if (this.getType() !== 'STOP' && this.getType() !== 'MULTI') return;\n\
\n\
    this.mergedMarkerData = this.constructMergedMarker(display);\n\
\n\
    this.placeOffsets = {\n\
      x: 0,\n\
      y: 0\n\
    };\n\
    if (this.adjacentPlace) {\n\
      var placeBBox = this.adjacentPlace.getMarkerBBox();\n\
\n\
      var placeR = display.styler.compute(display.styler.places.r, display, {\n\
        owner: this.adjacentPlace\n\
      });\n\
\n\
      var placeX = display.xScale(this.adjacentPlace.worldX);\n\
      var placeY = display.yScale(this.adjacentPlace.worldY);\n\
\n\
      var thisR = this.mergedMarkerData.width / 2;\n\
      var thisX = this.mergedMarkerData.x + thisR,\n\
        thisY = this.mergedMarkerData.y + thisR;\n\
\n\
      var dx = thisX - placeX,\n\
        dy = thisY - placeY;\n\
      var dist = Math.sqrt(dx * dx + dy * dy);\n\
\n\
      if (placeR + thisR > dist) {\n\
        var f = (placeR + thisR) / dist;\n\
        this.placeOffsets = {\n\
          x: (dx * f) - dx,\n\
          y: (dy * f) - dy\n\
        };\n\
\n\
        this.mergedMarkerData.x += this.placeOffsets.x;\n\
        this.mergedMarkerData.y += this.placeOffsets.y;\n\
\n\
        each(this.graphVertex.incidentEdges(), function(edge) {\n\
          each(edge.renderSegments, function(segment) {\n\
            segment.refreshRenderData(display);\n\
          });\n\
        });\n\
      }\n\
    }\n\
  };\n\
\n\
  this.refreshLabel = function(display) {\n\
    if (!this.renderLabel) return;\n\
    this.label.refresh(display);\n\
  };\n\
\n\
  this.getMarkerBBox = function() {\n\
    return this.markerSvg.node().getBBox();\n\
  };\n\
\n\
  this.setFocused = function(focused) {\n\
    this.focused = focused;\n\
  };\n\
\n\
  this.isFocused = function() {\n\
    return (this.focused === true);\n\
  };\n\
\n\
  this.runFocusTransition = function(display, callback) {};\n\
\n\
  this.setAllPatternsFocused = function() {};\n\
\n\
  this.getZIndex = function() {\n\
    return this.zIndex;\n\
  };\n\
\n\
  this.getAverageCoord = function() {\n\
    var dataArray = this.getRenderDataArray();\n\
\n\
    var xTotal = 0,\n\
      yTotal = 0;\n\
    each(dataArray, function(data) {\n\
      xTotal += data.x;\n\
      yTotal += data.y;\n\
    });\n\
\n\
    return {\n\
      x: xTotal / dataArray.length,\n\
      y: yTotal / dataArray.length\n\
    };\n\
  };\n\
\n\
  this.hasRenderData = function() {\n\
    var dataArray = this.getRenderDataArray();\n\
    return (dataArray && dataArray.length > 0);\n\
  };\n\
\n\
  this.makeDraggable = function(transitive) {};\n\
\n\
  this.toString = function() {\n\
    return this.getType() + ' point: ' + this.getId() + ' (' + this.getName() +\n\
      ')';\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `Point`\n\
 */\n\
\n\
module.exports = Point;\n\
//@ sourceURL=conveyal-transitive.js/lib/point/index.js"
));
require.register("conveyal-transitive.js/lib/point/stop.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
var each = require('each');\n\
\n\
var Point = require('./index');\n\
var Util = require('../util');\n\
\n\
var debug = require('debug')('transitive:stop');\n\
\n\
/**\n\
 *  Place: a Point subclass representing a 'place' that can be rendered on the\n\
 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work\n\
 *  location, a point of interest, etc.\n\
 */\n\
\n\
var Stop = augment(Point, function(base) {\n\
\n\
  this.constructor = function(data) {\n\
    base.constructor.call(this, data);\n\
\n\
    if (data && data.stop_lat && data.stop_lon) {\n\
      var xy = Util.latLonToSphericalMercator(data.stop_lat, data.stop_lon);\n\
      this.worldX = xy[0];\n\
      this.worldY = xy[1];\n\
    }\n\
\n\
    this.patterns = [];\n\
\n\
    this.patternRenderData = {};\n\
    this.patternFocused = {};\n\
    this.patternCount = 0;\n\
\n\
    this.patternStylerKey = 'stops_pattern';\n\
\n\
    this.isSegmentEndPoint = false;\n\
  };\n\
\n\
  /**\n\
   * Get id\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.stop_id;\n\
  };\n\
\n\
  /**\n\
   * Get type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'STOP';\n\
  };\n\
\n\
  /**\n\
   * Get name\n\
   */\n\
\n\
  this.getName = function() {\n\
    if (!this.stop_name) return ('Unnamed Stop (ID=' + this.getId() + ')');\n\
    return this.stop_name;\n\
  };\n\
\n\
  /**\n\
   * Get lat\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return this.stop_lat;\n\
  };\n\
\n\
  /**\n\
   * Get lon\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return this.stop_lon;\n\
  };\n\
\n\
  this.containsSegmentEndPoint = function() {\n\
    return this.isSegmentEndPoint;\n\
  };\n\
\n\
  this.containsBoardPoint = function() {\n\
    return this.isBoardPoint;\n\
  };\n\
\n\
  this.containsAlightPoint = function() {\n\
    return this.isAlightPoint;\n\
  };\n\
\n\
  this.containsTransferPoint = function() {\n\
    return this.isTransferPoint;\n\
  };\n\
\n\
  this.getPatterns = function() {\n\
    return this.patterns;\n\
  };\n\
\n\
  this.addPattern = function(pattern) {\n\
    if (this.patterns.indexOf(pattern) === -1) this.patterns.push(pattern);\n\
  };\n\
\n\
  /**\n\
   * Add render data\n\
   *\n\
   * @param {Object} stopInfo\n\
   */\n\
\n\
  this.addRenderData = function(stopInfo) {\n\
\n\
    if (stopInfo.segment.getType() === 'TRANSIT') {\n\
\n\
      var s = {\n\
        sortableType: 'POINT_STOP_PATTERN',\n\
        owner: this,\n\
        getZIndex: function() {\n\
          if (this.owner.graphVertex) {\n\
            return this.owner.getZIndex();\n\
          }\n\
          return this.segment.getZIndex() + 1;\n\
        }\n\
      };\n\
\n\
      for (var key in stopInfo)\n\
        s[key] = stopInfo[key];\n\
\n\
      var patternId = stopInfo.segment.patternIds;\n\
      if (!(patternId in this.patternRenderData)) this.patternRenderData[\n\
        patternId] = {};\n\
      this.patternRenderData[patternId][stopInfo.segment.getId()] = s; //.push(s);\n\
\n\
      each(stopInfo.segment.patterns, function(pattern) {\n\
        this.addPattern(pattern);\n\
      }, this);\n\
    }\n\
    this.patternCount = Object.keys(this.patternRenderData).length;\n\
  };\n\
\n\
  this.isPatternFocused = function(patternId) {\n\
    if (!(patternId in this.patternFocused)) return true;\n\
    return (this.patternFocused[patternId]);\n\
  };\n\
\n\
  this.setPatternFocused = function(patternId, focused) {\n\
    this.patternFocused[patternId] = focused;\n\
  };\n\
\n\
  this.setAllPatternsFocused = function(focused) {\n\
    for (var key in this.patternRenderData) {\n\
      this.patternFocused[key] = focused;\n\
    }\n\
  };\n\
\n\
  /**\n\
   * Draw a stop\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.render = function(display) {\n\
    base.render.call(this, display);\n\
    if (Object.keys(this.patternRenderData).length === 0) return;\n\
    //if (this.renderData.length === 0) return;\n\
\n\
    var renderDataArray = this.getRenderDataArray();\n\
\n\
    this.initSvg(display);\n\
\n\
    // set up the merged marker\n\
    this.mergedMarker = this.markerSvg.append('g').append('rect')\n\
      .attr('class', 'transitive-sortable transitive-stop-marker-merged')\n\
      .datum(this.getMergedRenderData());\n\
\n\
    // set up the pattern-specific markers\n\
    this.patternMarkers = this.markerSvg.append('g').selectAll('circle')\n\
      .data(renderDataArray)\n\
      .enter()\n\
      .append('circle')\n\
      .attr('class', 'transitive-sortable transitive-stop-marker-pattern');\n\
\n\
  };\n\
\n\
  /**\n\
   * Refresh the stop\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
\n\
    if (this.patternCount === 0) return;\n\
\n\
    if (!this.mergedMarkerData) this.initMarkerData(display);\n\
\n\
    // refresh the pattern-level markers\n\
    this.patternMarkers.data(this.getRenderDataArray());\n\
    this.patternMarkers.attr('transform', (function(d, i) {\n\
      if (!isNaN(d.x) && !isNaN(d.y)) {\n\
        var x = d.x + this.placeOffsets.x;\n\
        var y = d.y + this.placeOffsets.y;\n\
        return 'translate(' + x + ', ' + y + ')';\n\
      }\n\
    }).bind(this));\n\
\n\
    // refresh the merged marker\n\
    if (this.mergedMarker) {\n\
      var a = this.constructMergedMarker(display, 'stops_pattern');\n\
      this.mergedMarker.datum(this.getMergedRenderData());\n\
      if (!isNaN(this.mergedMarkerData.x) && !isNaN(this.mergedMarkerData.y))\n\
        this.mergedMarker.attr(this.mergedMarkerData);\n\
    }\n\
\n\
  };\n\
\n\
  this.getMergedRenderData = function() {\n\
    return {\n\
      owner: this,\n\
      sortableType: 'POINT_STOP_MERGED'\n\
    };\n\
  };\n\
\n\
  this.getRenderDataArray = function() {\n\
    var dataArray = [];\n\
    for (var patternId in this.patternRenderData) {\n\
      var segmentData = this.patternRenderData[patternId];\n\
      for (var segmentId in segmentData) {\n\
        dataArray.push(segmentData[segmentId]);\n\
      }\n\
    }\n\
    return dataArray;\n\
  };\n\
\n\
  this.getMarkerBBox = function() {\n\
    if (this.mergedMarker) return this.mergedMarkerData;\n\
  };\n\
\n\
  this.isFocused = function() {\n\
    if (this.mergedMarker || !this.patternRenderData) {\n\
      return (this.focused === true);\n\
    }\n\
\n\
    var focused = true;\n\
    for (var patternId in this.patternRenderData) {\n\
      focused = this && this.isPatternFocused(patternId);\n\
    }\n\
    return focused;\n\
  };\n\
\n\
  this.runFocusTransition = function(display, callback) {\n\
    if (this.mergedMarker) {\n\
      var newStrokeColor = display.styler.compute(display.styler.stops_merged\n\
        .stroke, display, {\n\
          owner: this\n\
        });\n\
      this.mergedMarker.transition().style('stroke', newStrokeColor).call(\n\
        callback);\n\
    }\n\
    if (this.label) this.label.runFocusTransition(display, callback);\n\
  };\n\
\n\
  this.clearRenderData = function() {\n\
    this.patternRenderData = {};\n\
    this.mergedMarkerData = null;\n\
    this.placeOffsets = {\n\
      x: 0,\n\
      y: 0\n\
    };\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `Stop`\n\
 */\n\
\n\
module.exports = Stop;\n\
//@ sourceURL=conveyal-transitive.js/lib/point/stop.js"
));
require.register("conveyal-transitive.js/lib/point/place.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
var d3 = require('d3');\n\
\n\
var Point = require('./index');\n\
var Util = require('../util');\n\
\n\
var SphericalMercator = require('../util/spherical-mercator');\n\
var sm = new SphericalMercator();\n\
\n\
/**\n\
 *  Place: a Point subclass representing a 'place' that can be rendered on the\n\
 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work\n\
 *  location, a point of interest, etc.\n\
 */\n\
\n\
var Place = augment(Point, function(base) {\n\
\n\
  /**\n\
   *  the constructor\n\
   */\n\
\n\
  this.constructor = function(data) {\n\
    base.constructor.call(this, data);\n\
\n\
    if (data && data.place_lat && data.place_lon) {\n\
      var xy = Util.latLonToSphericalMercator(data.place_lat, data.place_lon);\n\
      this.worldX = xy[0];\n\
      this.worldY = xy[1];\n\
    }\n\
\n\
    this.zIndex = 100000;\n\
  };\n\
\n\
  /**\n\
   * Get Type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'PLACE';\n\
  };\n\
\n\
  /**\n\
   * Get ID\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.place_id;\n\
  };\n\
\n\
  /**\n\
   * Get Name\n\
   */\n\
\n\
  this.getName = function() {\n\
    return this.place_name;\n\
  };\n\
\n\
  /**\n\
   * Get lat\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return this.place_lat;\n\
  };\n\
\n\
  /**\n\
   * Get lon\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return this.place_lon;\n\
  };\n\
\n\
  this.containsSegmentEndPoint = function() {\n\
    return true;\n\
  };\n\
\n\
  this.containsFromPoint = function() {\n\
    return (this.getId() === 'from');\n\
  };\n\
\n\
  this.containsToPoint = function() {\n\
    return (this.getId() === 'to');\n\
  };\n\
\n\
  this.addRenderData = function(pointInfo) {\n\
    this.renderData.push(pointInfo);\n\
  };\n\
\n\
  this.getRenderDataArray = function() {\n\
    return this.renderData;\n\
  };\n\
\n\
  this.clearRenderData = function() {\n\
    this.renderData = [];\n\
  };\n\
\n\
  /**\n\
   * Draw a place\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.render = function(display) {\n\
    base.render.call(this, display);\n\
    if (!this.renderData) return;\n\
\n\
    this.initSvg(display);\n\
    this.svgGroup\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'POINT_PLACE'\n\
      });\n\
\n\
    // set up the markers\n\
    this.marker = this.markerSvg.append('circle')\n\
      .datum({\n\
        owner: this\n\
      })\n\
      .attr('class', 'transitive-place-circle');\n\
\n\
    var iconUrl = display.styler.compute(display.styler.places_icon[\n\
      'xlink:href'], display, {\n\
      owner: this\n\
    });\n\
    if (iconUrl) {\n\
      this.icon = this.markerSvg.append('image')\n\
        .datum({\n\
          owner: this\n\
        })\n\
        .attr('class', 'transitive-place-icon')\n\
        .attr('xlink:href', iconUrl);\n\
    }\n\
  };\n\
\n\
  /**\n\
   * Refresh the place\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.renderData) return;\n\
\n\
    // refresh the marker/icon\n\
    var x = display.xScale(this.worldX);\n\
    var y = display.yScale(this.worldY);\n\
    var translate = 'translate(' + x + ', ' + y + ')';\n\
    this.marker.attr('transform', translate);\n\
    if (this.icon) this.icon.attr('transform', translate);\n\
\n\
  };\n\
\n\
  this.makeDraggable = function(transitive) {\n\
    var place = this,\n\
      display = transitive.display;\n\
    var drag = d3.behavior.drag()\n\
      .on('dragstart', function() {\n\
        d3.event.sourceEvent.stopPropagation(); // silence other listeners\n\
      })\n\
      .on('drag', function() {\n\
        if (place.graphVertex) {\n\
          var x = display.xScale.invert(d3.event.sourceEvent.pageX -\n\
            display.el.offsetLeft);\n\
          var y = display.yScale.invert(d3.event.sourceEvent.pageY -\n\
            display.el.offsetTop);\n\
\n\
          place.worldX = x;\n\
          place.worldY = y;\n\
          var ll = sm.inverse([x, y]);\n\
          place.place_lon = ll[0];\n\
          place.place_lat = ll[1];\n\
\n\
          place.refresh(display);\n\
        }\n\
      })\n\
      .on('dragend', function() {\n\
        transitive.emit('place.' + place.getId() + '.dragend', place);\n\
      });\n\
    this.markerSvg.call(drag);\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `Place`\n\
 */\n\
\n\
module.exports = Place;\n\
//@ sourceURL=conveyal-transitive.js/lib/point/place.js"
));
require.register("conveyal-transitive.js/lib/point/multipoint.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
var each = require('each');\n\
\n\
var Point = require('./index');\n\
\n\
/**\n\
 *  MultiPoint: a Point subclass representing a collection of multiple points\n\
 *  that have been merged into one for display purposes.\n\
 */\n\
\n\
var MultiPoint = augment(Point, function(base) {\n\
\n\
  this.constructor = function(pointArray) {\n\
    base.constructor.call(this);\n\
    this.points = [];\n\
    if (pointArray) {\n\
      pointArray.forEach(function(point) {\n\
        this.addPoint(point);\n\
      }, this);\n\
    }\n\
    this.renderData = [];\n\
    this.id = 'multi';\n\
    this.toPoint = this.fromPoint = null;\n\
\n\
    this.patternStylerKey = 'multipoints_pattern';\n\
  };\n\
\n\
  /**\n\
   * Get id\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.id;\n\
  };\n\
\n\
  /**\n\
   * Get type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'MULTI';\n\
  };\n\
\n\
  this.getName = function() {\n\
    if (this.fromPoint) return this.fromPoint.getName();\n\
    if (this.toPoint) return this.toPoint.getName();\n\
    var shortest = null;\n\
    var nonTurnPointCount = 0;\n\
    this.points.forEach(function(point) {\n\
      if (point.getType() === 'TURN') return;\n\
      if (!shortest || point.getName().length < shortest.length) shortest =\n\
        point.getName();\n\
      nonTurnPointCount++;\n\
    });\n\
\n\
    return shortest;\n\
  };\n\
\n\
  this.containsSegmentEndPoint = function() {\n\
    for (var i = 0; i < this.points.length; i++) {\n\
      if (this.points[i].containsSegmentEndPoint()) return true;\n\
    }\n\
    return false;\n\
  };\n\
\n\
  this.containsBoardPoint = function() {\n\
    for (var i = 0; i < this.points.length; i++) {\n\
      if (this.points[i].containsBoardPoint()) return true;\n\
    }\n\
    return false;\n\
  };\n\
\n\
  this.containsAlightPoint = function() {\n\
    for (var i = 0; i < this.points.length; i++) {\n\
      if (this.points[i].containsAlightPoint()) return true;\n\
    }\n\
    return false;\n\
  };\n\
\n\
  this.containsTransferPoint = function() {\n\
    for (var i = 0; i < this.points.length; i++) {\n\
      if (this.points[i].containsTransferPoint()) return true;\n\
    }\n\
    return false;\n\
  };\n\
\n\
  this.containsFromPoint = function() {\n\
    return (this.fromPoint !== null);\n\
  };\n\
\n\
  this.containsToPoint = function() {\n\
    return (this.toPoint !== null);\n\
  };\n\
\n\
  this.getPatterns = function() {\n\
    var patterns = [];\n\
\n\
    this.points.forEach(function(point) {\n\
      if (!point.patterns) return;\n\
      point.patterns.forEach(function(pattern) {\n\
        if (patterns.indexOf(pattern) === -1) patterns.push(pattern);\n\
      });\n\
    });\n\
\n\
    return patterns;\n\
  };\n\
\n\
  this.addPoint = function(point) {\n\
    if (this.points.indexOf(point) !== -1) return;\n\
    this.points.push(point);\n\
    this.id += '-' + point.getId();\n\
    if (point.containsFromPoint()) { // getType() === 'PLACE' && point.getId() === 'from') {\n\
      this.fromPoint = point;\n\
    }\n\
    if (point.containsToPoint()) { // getType() === 'PLACE' && point.getId() === 'to') {\n\
      this.toPoint = point;\n\
    }\n\
    this.calcWorldCoords();\n\
  };\n\
\n\
  this.calcWorldCoords = function() {\n\
    var tx = 0,\n\
      ty = 0;\n\
    each(this.points, function(point) {\n\
      tx += point.worldX;\n\
      ty += point.worldY;\n\
    });\n\
\n\
    this.worldX = tx / this.points.length;\n\
    this.worldY = ty / this.points.length;\n\
  };\n\
\n\
  /**\n\
   * Add render data\n\
   *\n\
   * @param {Object} stopInfo\n\
   */\n\
\n\
  this.addRenderData = function(pointInfo) {\n\
    if (pointInfo.offsetX !== 0 || pointInfo.offsetY !== 0) this.hasOffsetPoints =\n\
      true;\n\
    this.renderData.push(pointInfo);\n\
  };\n\
\n\
  this.clearRenderData = function() {\n\
    this.hasOffsetPoints = false;\n\
    this.renderData = [];\n\
  };\n\
\n\
  /**\n\
   * Draw a multipoint\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.render = function(display) {\n\
    base.render.call(this, display);\n\
\n\
    if (!this.renderData) return;\n\
\n\
    // set up the main svg group for this stop\n\
    this.initSvg(display);\n\
    this.svgGroup\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'POINT_MULTI'\n\
      });\n\
\n\
    if (this.containsSegmentEndPoint()) this.initMergedMarker(display);\n\
\n\
    // set up the pattern markers\n\
    /*this.marker = this.markerSvg.selectAll('circle')\n\
      .data(this.renderData)\n\
      .enter()\n\
      .append('circle')\n\
      .attr('class', 'transitive-multipoint-marker-pattern');*/\n\
  };\n\
\n\
  this.initMergedMarker = function(display) {\n\
    // set up the merged marker\n\
    if (this.fromPoint || this.toPoint) {\n\
      this.mergedMarker = this.markerSvg.append('g').append('circle')\n\
        .datum({\n\
          owner: this\n\
        })\n\
        .attr('class', 'transitive-multipoint-marker-merged');\n\
    } else if (this.hasOffsetPoints || this.renderData.length > 1) {\n\
\n\
      this.mergedMarker = this.markerSvg.append('g').append('rect')\n\
        .datum({\n\
          owner: this\n\
        })\n\
        .attr('class', 'transitive-multipoint-marker-merged');\n\
    }\n\
  };\n\
\n\
  /**\n\
   * Refresh the point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.renderData) return;\n\
\n\
    // refresh the merged marker\n\
    if (this.mergedMarker) {\n\
      if (!this.mergedMarkerData) this.initMarkerData(display);\n\
\n\
      this.mergedMarker.datum({\n\
        owner: this\n\
      });\n\
      this.mergedMarker.attr(this.mergedMarkerData);\n\
    }\n\
\n\
    /*var cx, cy;\n\
    // refresh the pattern-level markers\n\
    this.marker.data(this.renderData);\n\
    this.marker.attr('transform', function (d, i) {\n\
      cx = d.x;\n\
      cy = d.y;\n\
      var x = display.xScale(d.x) + d.offsetX;\n\
      var y = display.yScale(d.y) - d.offsetY;\n\
      return 'translate(' + x +', ' + y +')';\n\
    });*/\n\
\n\
  };\n\
\n\
  this.getRenderDataArray = function() {\n\
    return this.renderData;\n\
  };\n\
\n\
  this.setFocused = function(focused) {\n\
    this.focused = focused;\n\
    each(this.points, function(point) {\n\
      point.setFocused(focused);\n\
    });\n\
  };\n\
\n\
  this.runFocusTransition = function(display, callback) {\n\
    if (this.mergedMarker) {\n\
      var newStrokeColor = display.styler.compute(display.styler.multipoints_merged\n\
        .stroke, display, {\n\
          owner: this\n\
        });\n\
      this.mergedMarker.transition().style('stroke', newStrokeColor).call(\n\
        callback);\n\
    }\n\
    if (this.label) this.label.runFocusTransition(display, callback);\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `MultiPoint`\n\
 */\n\
\n\
module.exports = MultiPoint;\n\
//@ sourceURL=conveyal-transitive.js/lib/point/multipoint.js"
));
require.register("conveyal-transitive.js/lib/point/turn.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
var each = require('each');\n\
\n\
var Point = require('./index');\n\
var Util = require('../util');\n\
\n\
var SphericalMercator = require('../util/spherical-mercator');\n\
var sm = new SphericalMercator();\n\
\n\
var debug = require('debug')('transitive:point');\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
var TurnPoint = augment(Point, function(base) {\n\
\n\
  this.constructor = function(data) {\n\
    base.constructor.call(this, data);\n\
    this.name = 'Turn @ ' + data.lat + ', ' + data.lon;\n\
    var smCoords = sm.forward([data.lon, data.lat]);\n\
    this.worldX = smCoords[0];\n\
    this.worldY = smCoords[1];\n\
    this.isSegmentEndPoint = false;\n\
  };\n\
\n\
  this.getType = function() {\n\
    return 'TURN';\n\
  };\n\
\n\
  this.getName = function() {\n\
    return this.name;\n\
  };\n\
\n\
  this.containsSegmentEndPoint = function() {\n\
    return this.isSegmentEndPoint;\n\
  };\n\
});\n\
\n\
/**\n\
 * Expose `TurnPoint`\n\
 */\n\
\n\
module.exports = TurnPoint;\n\
//@ sourceURL=conveyal-transitive.js/lib/point/turn.js"
));
require.register("conveyal-transitive.js/lib/point/pointcluster.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var each = require('each');\n\
\n\
/**\n\
 * Expose `PointCluster`\n\
 */\n\
\n\
module.exports = PointCluster;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function PointCluster() {\n\
  this.points = [];\n\
}\n\
\n\
PointCluster.prototype.addPoint = function(point) {\n\
  if (this.points.indexOf(point) === -1) this.points.push(point);\n\
};\n\
\n\
PointCluster.prototype.mergeVertices = function(graph) {\n\
  var vertices = [];\n\
  each(this.points, function(point) {\n\
    vertices.push(point.graphVertex);\n\
  });\n\
  graph.mergeVertices(vertices);\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/point/pointcluster.js"
));
require.register("conveyal-transitive.js/lib/point/pointclustermap.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require('d3');\n\
var each = require('each');\n\
\n\
var PointCluster = require('./pointcluster');\n\
var MultiPoint = require('./multipoint');\n\
var Util = require('../util');\n\
\n\
/**\n\
 * Expose `PointClusterMap`\n\
 */\n\
\n\
module.exports = PointClusterMap;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function PointClusterMap(transitive) {\n\
  this.transitive = transitive;\n\
\n\
  this.clusters = [];\n\
  this.clusterLookup = {}; // maps Point object to its containing cluster\n\
\n\
  var pointArr = [];\n\
  each(transitive.stops, function(key) {\n\
    var point = transitive.stops[key];\n\
    if (point.used) pointArr.push(point);\n\
  }, this);\n\
  each(transitive.turnPoints, function(key) {\n\
    pointArr.push(transitive.turnPoints[key]);\n\
  }, this);\n\
\n\
  var links = d3.geom.voronoi()\n\
    .x(function(d) {\n\
      return d.worldX;\n\
    })\n\
    .y(function(d) {\n\
      return d.worldY;\n\
    })\n\
    .links(pointArr);\n\
\n\
  each(links, function(link) {\n\
    var dist = Util.distance(link.source.worldX, link.source.worldY, link.target\n\
      .worldX, link.target.worldY);\n\
    if (dist < 100 && (link.source.getType() !== 'TURN' || link.target.getType() !==\n\
      'TURN')) {\n\
      var sourceInCluster = (link.source in this.clusterLookup);\n\
      var targetInCluster = (link.target in this.clusterLookup);\n\
      if (sourceInCluster && !targetInCluster) {\n\
        this.addPointToCluster(link.target, this.clusterLookup[link.source]);\n\
      } else if (!sourceInCluster && targetInCluster) {\n\
        this.addPointToCluster(link.source, this.clusterLookup[link.target]);\n\
      } else if (!sourceInCluster && !targetInCluster) {\n\
        var cluster = new PointCluster();\n\
        this.clusters.push(cluster);\n\
        this.addPointToCluster(link.source, cluster);\n\
        this.addPointToCluster(link.target, cluster);\n\
      }\n\
    }\n\
  }, this);\n\
\n\
  this.vertexPoints = [];\n\
  each(this.clusters, function(cluster) {\n\
    var multipoint = new MultiPoint(cluster.points);\n\
    this.vertexPoints.push(multipoint);\n\
    each(cluster.points, function(point) {\n\
      point.multipoint = multipoint;\n\
    }, this);\n\
  }, this);\n\
}\n\
\n\
PointClusterMap.prototype.addPointToCluster = function(point, cluster) {\n\
  cluster.addPoint(point);\n\
  this.clusterLookup[point] = cluster;\n\
};\n\
\n\
PointClusterMap.prototype.clearMultiPoints = function() {\n\
  each(this.clusters, function(cluster) {\n\
    each(cluster.points, function(point) {\n\
      point.multipoint = null;\n\
    }, this);\n\
  }, this);\n\
};\n\
\n\
PointClusterMap.prototype.getVertexPoints = function(baseVertexPoints) {\n\
  if (!baseVertexPoints) return this.vertexPoints;\n\
  var vertexPoints = this.vertexPoints.concat();\n\
  each(baseVertexPoints, function(point) {\n\
    if (!point.multipoint) vertexPoints.push(point);\n\
  });\n\
  return vertexPoints;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/point/pointclustermap.js"
));
require.register("conveyal-transitive.js/lib/labeler/index.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
var each = require('each');\n\
var d3 = require('d3');\n\
\n\
var SegmentLabel = require('./segmentlabel');\n\
var Util = require('../util');\n\
\n\
var debug = require('debug')('transitive:labeler');\n\
\n\
/**\n\
 * Labeler object\n\
 */\n\
\n\
var Labeler = augment(Object, function() {\n\
\n\
  this.constructor = function(transitive) {\n\
\n\
    this.transitive = transitive;\n\
    this.clear();\n\
  };\n\
\n\
  this.clear = function(transitive) {\n\
\n\
    this.points = [];\n\
  };\n\
\n\
  this.updateLabelList = function(graph) {\n\
\n\
    this.points = [];\n\
    graph.vertices.forEach(function(vertex) {\n\
      var point = vertex.point;\n\
      if (point.getType() === 'PLACE' || point.getType() === 'MULTI' || (\n\
        point.getType() === 'STOP' && point.isSegmentEndPoint)) {\n\
        this.points.push(point);\n\
      }\n\
    }, this);\n\
\n\
    this.points.sort(function compare(a, b) {\n\
      if (a.containsFromPoint() || a.containsToPoint()) return -1;\n\
      if (b.containsFromPoint() || b.containsToPoint()) return 1;\n\
      return 0;\n\
    });\n\
  };\n\
\n\
  this.updateQuadtree = function() {\n\
\n\
    this.quadtree = d3.geom.quadtree().extent([\n\
      [-this.width, -this.height],\n\
      [this.width * 2, this.height * 2]\n\
    ])([]);\n\
\n\
    this.addPointsToQuadtree();\n\
    //this.addSegmentsToQuadtree();\n\
  };\n\
\n\
  this.addPointsToQuadtree = function() {\n\
\n\
    this.points.forEach(function(point) {\n\
      var mbbox = point.getMarkerBBox();\n\
      if (mbbox) this.addBBoxToQuadtree(point.getMarkerBBox());\n\
    }, this);\n\
  };\n\
\n\
  this.addSegmentsToQuadtree = function() {\n\
\n\
    var disp = this.transitive.display;\n\
    this.transitive.renderSegments.forEach(function(segment) {\n\
\n\
      if (segment.getType() !== 'TRANSIT') return;\n\
\n\
      var lw = this.transitive.style.compute(this.transitive.style.segments[\n\
        'stroke-width'], this.transitive.display, segment);\n\
      lw = parseFloat(lw.substring(0, lw.length - 2), 10) - 2;\n\
\n\
      var x, x1, x2, y, y1, y2;\n\
      //console.log(segment.toString());\n\
      if (segment.renderData.length === 2) { // basic straight segment\n\
        if (segment.renderData[0].x === segment.renderData[1].x) { // vertical\n\
          x = segment.renderData[0].x - lw / 2;\n\
          y1 = segment.renderData[0].y;\n\
          y2 = segment.renderData[1].y;\n\
          this.addBBoxToQuadtree({\n\
            x: x,\n\
            y: Math.min(y1, y2),\n\
            width: lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
        } else if (segment.renderData[0].y === segment.renderData[1].y) { // horizontal\n\
          x1 = segment.renderData[0].x;\n\
          x2 = segment.renderData[1].x;\n\
          y = segment.renderData[0].y - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x: Math.min(x1, x2),\n\
            y: y,\n\
            width: Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
        }\n\
      }\n\
\n\
      if (segment.renderData.length === 4) { // basic curved segment\n\
\n\
        if (segment.renderData[0].x === segment.renderData[1].x) { // vertical first\n\
          x = segment.renderData[0].x - lw / 2;\n\
          y1 = segment.renderData[0].y;\n\
          y2 = segment.renderData[3].y;\n\
          this.addBBoxToQuadtree({\n\
            x: x,\n\
            y: Math.min(y1, y2),\n\
            width: lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
\n\
          x1 = segment.renderData[0].x;\n\
          x2 = segment.renderData[3].x;\n\
          y = segment.renderData[3].y - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x: Math.min(x1, x2),\n\
            y: y,\n\
            width: Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
\n\
        } else if (segment.renderData[0].y === segment.renderData[1].y) { // horiz first\n\
          x1 = segment.renderData[0].x;\n\
          x2 = segment.renderData[3].x;\n\
          y = segment.renderData[0].y - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x: Math.min(x1, x2),\n\
            y: y,\n\
            width: Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
\n\
          x = segment.renderData[3].x - lw / 2;\n\
          y1 = segment.renderData[0].y;\n\
          y2 = segment.renderData[3].y;\n\
          this.addBBoxToQuadtree({\n\
            x: x,\n\
            y: Math.min(y1, y2),\n\
            width: lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
        }\n\
      }\n\
\n\
    }, this);\n\
  };\n\
\n\
  this.addBBoxToQuadtree = function(bbox) {\n\
\n\
    if (bbox.x + bbox.width / 2 < 0 || bbox.x - bbox.width / 2 > this.width ||\n\
      bbox.y + bbox.height / 2 < 0 || bbox.y - bbox.height / 2 > this.height\n\
    ) return;\n\
\n\
    this.quadtree.add([bbox.x + bbox.width / 2, bbox.y + bbox.height / 2,\n\
      bbox\n\
    ]);\n\
\n\
    this.maxBBoxWidth = Math.max(this.maxBBoxWidth, bbox.width);\n\
    this.maxBBoxHeight = Math.max(this.maxBBoxHeight, bbox.height);\n\
  };\n\
\n\
  this.doLayout = function() {\n\
\n\
    this.width = this.transitive.el.clientWidth;\n\
    this.height = this.transitive.el.clientHeight;\n\
\n\
    this.maxBBoxWidth = 0;\n\
    this.maxBBoxHeight = 0;\n\
\n\
    this.updateQuadtree();\n\
\n\
    var labeledSegments = this.placeSegmentLabels();\n\
    var labeledPoints = this.placePointLabels();\n\
\n\
    return {\n\
      segments: labeledSegments,\n\
      points: labeledPoints\n\
    };\n\
  };\n\
\n\
  this.placeSegmentLabels = function() {\n\
\n\
    each(this.segmentLabels, function(label) {\n\
      label.clear();\n\
    });\n\
    this.segmentLabels = [];\n\
    this.placedLabelKeys = [];\n\
\n\
    // collect the bus RenderSegments\n\
    var busRSegments = [];\n\
    each(this.transitive.paths, function(path) {\n\
      each(path.getRenderedSegments(), function(rSegment) {\n\
        if (rSegment.type === 'TRANSIT' && rSegment.mode === 3)\n\
          busRSegments.push(rSegment);\n\
      });\n\
    }, this);\n\
\n\
    var edgeGroups = [];\n\
    each(this.transitive.paths, function(path) {\n\
      each(path.segments, function(segment) {\n\
        if (segment.type === 'TRANSIT' && segment.getMode() === 3) {\n\
          edgeGroups = edgeGroups.concat(segment.getLabelEdgeGroups());\n\
        }\n\
      });\n\
    }, this);\n\
\n\
    // iterate through the sequence collection, labeling as necessary\n\
    //each(busRSegments, function(rSegment) {\n\
    each(edgeGroups, function(edgeGroup) {\n\
\n\
      this.currentGroup = edgeGroup;\n\
      // get the array of label strings to be places (typically the unique route short names)\n\
      this.labelTextArray = edgeGroup.getLabelTextArray();\n\
\n\
      // create the initial label for placement\n\
      this.labelTextIndex = 0;\n\
\n\
      var label = this.getNextLabel(); //this.constructSegmentLabel(rSegment, labelTextArray[labelTextIndex]);\n\
      if (!label) return;\n\
\n\
      // iterate through potential anchor locations, attempting placement at each one\n\
      var labelAnchors = edgeGroup.getLabelAnchors(this.transitive.display,\n\
        label.textHeight * 1.5);\n\
      for (var i = 0; i < labelAnchors.length; i++) {\n\
        label.labelAnchor = labelAnchors[i];\n\
\n\
        // do not consider this anchor if it is out of the display range\n\
        if (!this.transitive.display.isInRange(label.labelAnchor.x,\n\
          label.labelAnchor.y)) continue;\n\
\n\
        // check for conflicts with existing placed elements\n\
        var bbox = label.getBBox();\n\
        var conflicts = this.findOverlaps(label, bbox);\n\
\n\
        if (conflicts.length === 0) { // if no conflicts\n\
\n\
          // place the current label\n\
          this.segmentLabels.push(label);\n\
          this.quadtree.add([label.labelAnchor.x, label.labelAnchor.y,\n\
            label\n\
          ]);\n\
          //debug('placing seg label for ' + label.labelText);\n\
\n\
          label = this.getNextLabel();\n\
          if (!label) break;\n\
\n\
        }\n\
      } // end of anchor iteration loop\n\
    }, this); // end of sequence iteration loop\n\
  };\n\
\n\
  this.getNextLabel = function() {\n\
    while (this.labelTextIndex < this.labelTextArray.length) {\n\
      var labelText = this.labelTextArray[this.labelTextIndex];\n\
      var key = this.currentGroup.edgeIds + '_' + labelText;\n\
      if (this.placedLabelKeys.indexOf(key) !== -1) {\n\
        this.labelTextIndex++;\n\
        continue;\n\
      }\n\
      var label = this.constructSegmentLabel(this.currentGroup.renderedSegment,\n\
        labelText);\n\
      this.placedLabelKeys.push(key);\n\
      this.labelTextIndex++;\n\
      return label;\n\
    }\n\
    return null;\n\
  };\n\
\n\
  this.constructSegmentLabel = function(segment, labelText) {\n\
    var label = new SegmentLabel(segment, labelText);\n\
    var styler = this.transitive.style;\n\
    label.fontFamily = styler.compute(styler.labels[\n\
      'font-family'], this.transitive.display, {\n\
      segment: segment\n\
    });\n\
    label.fontSize = styler.compute(styler.labels['font-size'],\n\
      this.transitive.display, {\n\
        segment: segment\n\
      });\n\
    var textBBox = Util.getTextBBox(labelText, {\n\
      'font-size': label.fontSize,\n\
      'font-family': label.fontFamily,\n\
    });\n\
    label.textWidth = textBBox.width;\n\
    label.textHeight = textBBox.height;\n\
    label.computeContainerDimensions();\n\
\n\
    return label;\n\
  };\n\
\n\
  this.placePointLabels = function() {\n\
\n\
    var styler = this.transitive.styler;\n\
\n\
    var labeledPoints = [];\n\
\n\
    this.points.forEach(function(point) {\n\
\n\
      var labelText = point.label.getText();\n\
      point.label.fontFamily = styler.compute(styler.labels['font-family'],\n\
        this.transitive\n\
        .display, {\n\
          point: point\n\
        });\n\
      point.label.fontSize = styler.compute(styler.labels['font-size'],\n\
        this.transitive\n\
        .display, {\n\
          point: point\n\
        });\n\
      var textBBox = Util.getTextBBox(labelText, {\n\
        'font-size': point.label.fontSize,\n\
        'font-family': point.label.fontFamily,\n\
      });\n\
      point.label.textWidth = textBBox.width;\n\
      point.label.textHeight = textBBox.height;\n\
\n\
      var orientations = styler.compute(styler.labels.orientations, this.transitive\n\
        .display, {\n\
          point: point\n\
        });\n\
\n\
      var placedLabel = false;\n\
      for (var i = 0; i < orientations.length; i++) {\n\
\n\
        point.label.setOrientation(orientations[i]);\n\
        if (!point.focused) continue;\n\
\n\
        if (!point.label.labelAnchor) continue;\n\
\n\
        var lx = point.label.labelAnchor.x,\n\
          ly = point.label.labelAnchor.y;\n\
\n\
        // do not place label if out of range\n\
        if (lx <= 0 || ly <= 0 || lx >= this.width || ly > this.height)\n\
          continue;\n\
\n\
        var labelBBox = point.label.getBBox();\n\
\n\
        var overlaps = this.findOverlaps(point.label, labelBBox);\n\
\n\
        // do not place label if it overlaps with others\n\
        if (overlaps.length > 0) continue;\n\
\n\
        // if we reach this point, the label is good to place\n\
\n\
        point.label.setVisibility(true);\n\
        labeledPoints.push(point);\n\
\n\
        this.quadtree.add([labelBBox.x + labelBBox.width / 2, labelBBox.y +\n\
          labelBBox.height / 2, point.label\n\
        ]);\n\
\n\
        this.maxBBoxWidth = Math.max(this.maxBBoxWidth, labelBBox.width);\n\
        this.maxBBoxHeight = Math.max(this.maxBBoxHeight, labelBBox.height);\n\
\n\
        placedLabel = true;\n\
        break; // do not consider any other orientations after places\n\
\n\
      } // end of orientation loop\n\
\n\
      // if label not placed at all, hide the element\n\
      if (!placedLabel) {\n\
        point.label.setVisibility(false);\n\
      }\n\
\n\
    }, this);\n\
    return labeledPoints;\n\
  };\n\
\n\
  this.findOverlaps = function(label, labelBBox) {\n\
    var minX = labelBBox.x - this.maxBBoxWidth / 2;\n\
    var minY = labelBBox.y - this.maxBBoxHeight / 2;\n\
    var maxX = labelBBox.x + labelBBox.width + this.maxBBoxWidth / 2;\n\
    var maxY = labelBBox.y + labelBBox.height + this.maxBBoxHeight / 2;\n\
    //debug('findOverlaps %s,%s %s,%s', minX,minY,maxX,maxY);\n\
\n\
    var matchItems = [];\n\
    this.quadtree.visit(function(node, x1, y1, x2, y2) {\n\
      var p = node.point;\n\
      if ((p) && (p[0] >= minX) && (p[0] < maxX) && (p[1] >= minY) && (p[\n\
        1] < maxY) && label.intersects(p[2])) {\n\
        matchItems.push(p[2]);\n\
      }\n\
      return x1 > maxX || y1 > maxY || x2 < minX || y2 < minY;\n\
    });\n\
    return matchItems;\n\
  };\n\
\n\
  this.findNearbySegmentLabels = function(label, x, y, buffer) {\n\
    var minX = x - buffer;\n\
    var minY = y - buffer;\n\
    var maxX = x + buffer;\n\
    var maxY = y + buffer;\n\
    //debug('findNearby %s,%s %s,%s', minX,minY,maxX,maxY);\n\
\n\
    var matchItems = [];\n\
    this.quadtree.visit(function(node, x1, y1, x2, y2) {\n\
      var p = node.point;\n\
      if ((p) && (p[0] >= minX) && (p[0] < maxX) && (p[1] >= minY) && (p[\n\
        1] < maxY) && (p[2].parent) && (label.parent.patternIds === p[2]\n\
        .parent.patternIds)) {\n\
        matchItems.push(p[2]);\n\
      }\n\
      return x1 > maxX || y1 > maxY || x2 < minX || y2 < minY;\n\
    });\n\
    return matchItems;\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `Labeler`\n\
 */\n\
\n\
module.exports = Labeler;\n\
//@ sourceURL=conveyal-transitive.js/lib/labeler/index.js"
));
require.register("conveyal-transitive.js/lib/labeler/label.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
\n\
/**\n\
 * Label object\n\
 */\n\
\n\
var Label = augment(Object, function() {\n\
\n\
  this.constructor = function(parent) {\n\
    this.parent = parent;\n\
    this.sortableType = 'LABEL';\n\
  };\n\
\n\
  this.getText = function() {\n\
    if (!this.labelText) this.labelText = this.initText();\n\
    return this.labelText;\n\
  };\n\
\n\
  this.initText = function() {\n\
    return this.parent.getName();\n\
  };\n\
\n\
  this.render = function(display) {};\n\
\n\
  this.refresh = function(display) {};\n\
\n\
  this.setVisibility = function(visibility) {\n\
    if (this.svgGroup) this.svgGroup.attr('visibility', visibility ?\n\
      'visible' : 'hidden');\n\
  };\n\
\n\
  this.getBBox = function() {\n\
    return null;\n\
  };\n\
\n\
  this.intersects = function(obj) {\n\
    return null;\n\
  };\n\
\n\
  this.intersectsBBox = function(bbox) {\n\
    var thisBBox = this.getBBox(this.orientation);\n\
    var r = (thisBBox.x <= bbox.x + bbox.width &&\n\
      bbox.x <= thisBBox.x + thisBBox.width &&\n\
      thisBBox.y <= bbox.y + bbox.height &&\n\
      bbox.y <= thisBBox.y + thisBBox.height);\n\
    return r;\n\
  };\n\
\n\
  this.isFocused = function() {\n\
    return this.parent.isFocused();\n\
  };\n\
\n\
  this.getZIndex = function() {\n\
    return 1000000;\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `Label`\n\
 */\n\
\n\
module.exports = Label;\n\
//@ sourceURL=conveyal-transitive.js/lib/labeler/label.js"
));
require.register("conveyal-transitive.js/lib/labeler/pointlabel.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
\n\
var Label = require('./label');\n\
\n\
/**\n\
 * Label object\n\
 */\n\
\n\
var PointLabel = augment(Label, function(base) {\n\
\n\
  this.constructor = function(parent) {\n\
\n\
    base.constructor.call(this, parent);\n\
\n\
    this.labelAngle = 0;\n\
    this.labelPosition = 1;\n\
  };\n\
\n\
  this.initText = function() {\n\
    return this.parent.getName();\n\
  };\n\
\n\
  this.render = function(display) {\n\
    this.svgGroup = display.svg.append('g'); //this.parent.labelSvg;\n\
    this.svgGroup\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'POINT_LABEL'\n\
      });\n\
\n\
    var typeStr = this.parent.getType().toLowerCase();\n\
\n\
    this.mainLabel = this.svgGroup.append('text')\n\
      .datum({\n\
        owner: this\n\
      })\n\
      .attr('id', 'transitive-' + typeStr + '-label-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('font-size', this.fontSize)\n\
      .attr('font-family', this.fontFamily)\n\
      .attr('class', 'transitive-' + typeStr + '-label');\n\
\n\
  };\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.labelAnchor) return;\n\
\n\
    if (!this.svgGroup) this.render(display);\n\
\n\
    this.svgGroup\n\
      .attr('text-anchor', this.labelPosition > 0 ? 'start' : 'end')\n\
      .attr('transform', (function(d, i) {\n\
        return 'translate(' + this.labelAnchor.x + ',' + this.labelAnchor\n\
          .y + ')';\n\
      }).bind(this));\n\
\n\
    this.mainLabel\n\
      .attr('transform', (function(d, i) {\n\
        return 'rotate(' + this.labelAngle + ', 0, 0)';\n\
      }).bind(this));\n\
  };\n\
\n\
  this.setOrientation = function(orientation) {\n\
    this.orientation = orientation;\n\
\n\
    var markerBBox = this.parent.getMarkerBBox();\n\
    if (!markerBBox) return;\n\
\n\
    var x, y;\n\
    var offset = 5;\n\
\n\
    if (orientation === 'E') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y + markerBBox.height / 2;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = 0;\n\
    } else if (orientation === 'W') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y + markerBBox.height / 2;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = 0;\n\
    } else if (orientation === 'NE') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = -45;\n\
    } else if (orientation === 'SE') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = 45;\n\
    } else if (orientation === 'NW') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = 45;\n\
    } else if (orientation === 'SW') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = -45;\n\
    } else if (orientation === 'N') {\n\
      x = markerBBox.x + markerBBox.width / 2;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = -90;\n\
    } else if (orientation === 'S') {\n\
      x = markerBBox.x + markerBBox.width / 2;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = -90;\n\
    }\n\
\n\
    this.labelAnchor = {\n\
      x: x,\n\
      y: y\n\
    };\n\
  };\n\
\n\
  this.getBBox = function() {\n\
\n\
    if (this.orientation === 'E') {\n\
      return {\n\
        x: this.labelAnchor.x,\n\
        y: this.labelAnchor.y - this.textHeight,\n\
        width: this.textWidth,\n\
        height: this.textHeight\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'W') {\n\
      return {\n\
        x: this.labelAnchor.x - this.textWidth,\n\
        y: this.labelAnchor.y - this.textHeight,\n\
        width: this.textWidth,\n\
        height: this.textHeight\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'N') {\n\
      return {\n\
        x: this.labelAnchor.x - this.textHeight,\n\
        y: this.labelAnchor.y - this.textWidth,\n\
        width: this.textHeight,\n\
        height: this.textWidth\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'S') {\n\
      return {\n\
        x: this.labelAnchor.x - this.textHeight,\n\
        y: this.labelAnchor.y,\n\
        width: this.textHeight,\n\
        height: this.textWidth\n\
      };\n\
    }\n\
\n\
    var bboxSide = this.textWidth * Math.sqrt(2) / 2;\n\
\n\
    if (this.orientation === 'NE') {\n\
      return {\n\
        x: this.labelAnchor.x,\n\
        y: this.labelAnchor.y - bboxSide,\n\
        width: bboxSide,\n\
        height: bboxSide\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'SE') {\n\
      return {\n\
        x: this.labelAnchor.x,\n\
        y: this.labelAnchor.y,\n\
        width: bboxSide,\n\
        height: bboxSide\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'NW') {\n\
      return {\n\
        x: this.labelAnchor.x - bboxSide,\n\
        y: this.labelAnchor.y - bboxSide,\n\
        width: bboxSide,\n\
        height: bboxSide\n\
      };\n\
    }\n\
\n\
    if (this.orientation === 'SW') {\n\
      return {\n\
        x: this.labelAnchor.x - bboxSide,\n\
        y: this.labelAnchor.y,\n\
        width: bboxSide,\n\
        height: bboxSide\n\
      };\n\
    }\n\
\n\
  };\n\
\n\
  this.intersects = function(obj) {\n\
    if (obj instanceof Label) {\n\
      // todo: handle label-label intersection for diagonally placed labels separately\n\
      return this.intersectsBBox(obj.getBBox());\n\
    } else if (obj.x && obj.y && obj.width && obj.height) {\n\
      return this.intersectsBBox(obj);\n\
    }\n\
\n\
    return false;\n\
  };\n\
\n\
  this.runFocusTransition = function(display, callback) {\n\
    if (this.mainLabel) {\n\
      if (this.parent.isFocused()) this.setVisibility(true);\n\
      this.mainLabel.transition()\n\
        .style('opacity', this.parent.isFocused() ? 1 : 0)\n\
        .call(callback);\n\
    }\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `PointLabel`\n\
 */\n\
\n\
module.exports = PointLabel;\n\
//@ sourceURL=conveyal-transitive.js/lib/labeler/pointlabel.js"
));
require.register("conveyal-transitive.js/lib/labeler/segmentlabel.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require('augment');\n\
\n\
var Label = require('./label');\n\
\n\
/**\n\
 * SegmentLabel object\n\
 */\n\
\n\
var SegmentLabel = augment(Label, function(base) {\n\
\n\
  this.constructor = function(parent, text) {\n\
\n\
    base.constructor.call(this, parent);\n\
    this.labelText = text;\n\
\n\
  };\n\
\n\
  /*this.initText = function() {\n\
    return this.parent.patterns[0].route.route_short_name;\n\
  };*/\n\
\n\
  this.render = function(display) {\n\
    this.svgGroup = this.parent.labelSvg.append('g')\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'LABEL'\n\
      });\n\
\n\
    var typeStr = this.parent.getType().toLowerCase();\n\
\n\
    var padding = this.getPadding();\n\
\n\
    this.computeContainerDimensions();\n\
\n\
    this.containerSvg = this.svgGroup.append('rect')\n\
      .datum(this) //{ segment: this.parent })\n\
    .attr({\n\
      width: this.containerWidth,\n\
      height: this.containerHeight\n\
    })\n\
      .attr('id', 'transitive-segment-label-container-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('class', 'transitive-segment-label-container');\n\
\n\
    this.textSvg = this.svgGroup.append('text')\n\
      .datum(this) //{ segment: this.parent })\n\
    .attr('id', 'transitive-segment-label-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('class', 'transitive-segment-label')\n\
      .attr('font-size', this.fontSize)\n\
      .attr('font-family', this.fontFamily)\n\
      .attr('transform', (function(d, i) {\n\
        return 'translate(' + padding + ', ' + (this.textHeight -\n\
          padding * 2) + ')';\n\
      }).bind(this));\n\
\n\
  };\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.labelAnchor) return;\n\
\n\
    if (!this.svgGroup) this.render(display);\n\
\n\
    this.svgGroup\n\
      .attr('transform', (function(d, i) {\n\
        var tx = (this.labelAnchor.x - this.containerWidth / 2);\n\
        var ty = (this.labelAnchor.y - this.containerHeight / 2);\n\
        return 'translate(' + tx + ',' + ty + ')';\n\
      }).bind(this));\n\
  };\n\
\n\
  this.getPadding = function() {\n\
    return this.textHeight * 0.1;\n\
  };\n\
\n\
  this.computeContainerDimensions = function() {\n\
    this.containerWidth = this.textWidth + this.getPadding() * 2;\n\
    this.containerHeight = this.textHeight;\n\
  };\n\
\n\
  this.getBBox = function() {\n\
    return {\n\
      x: this.labelAnchor.x - this.containerWidth / 2,\n\
      y: this.labelAnchor.y - this.containerHeight / 2,\n\
      width: this.containerWidth,\n\
      height: this.containerHeight\n\
    };\n\
  };\n\
\n\
  this.intersects = function(obj) {\n\
    if (obj instanceof Label) {\n\
      // todo: handle label-label intersection for diagonally placed labels separately\n\
      return this.intersectsBBox(obj.getBBox());\n\
    } else if (obj.x && obj.y && obj.width && obj.height) {\n\
      return this.intersectsBBox(obj);\n\
    }\n\
\n\
    return false;\n\
  };\n\
\n\
  this.clear = function() {\n\
    this.labelAnchor = null;\n\
    if (this.svgGroup) {\n\
      this.svgGroup.remove();\n\
      this.svgGroup = null;\n\
    }\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Expose `SegmentLabel`\n\
 */\n\
\n\
module.exports = SegmentLabel;\n\
//@ sourceURL=conveyal-transitive.js/lib/labeler/segmentlabel.js"
));
require.register("conveyal-transitive.js/lib/labeler/labeledgegroup.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var each = require('each');\n\
\n\
/**\n\
 * Expose `LabelEdgeGroup`\n\
 */\n\
\n\
module.exports = LabelEdgeGroup;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function LabelEdgeGroup(renderedSegment) {\n\
  this.renderedSegment = renderedSegment;\n\
  this.renderedEdges = [];\n\
}\n\
\n\
LabelEdgeGroup.prototype.addEdge = function(rEdge) {\n\
  this.renderedEdges.push(rEdge);\n\
  this.edgeIds = !this.edgeIds ? rEdge.getId() : this.edgeIds + ',' + rEdge.getId();\n\
};\n\
\n\
LabelEdgeGroup.prototype.getLabelTextArray = function() {\n\
  var textArray = [];\n\
  each(this.renderedSegment.pathSegment.getPatterns(), function(pattern) {\n\
    var shortName = pattern.route.route_short_name;\n\
    if (textArray.indexOf(shortName) === -1) textArray.push(shortName);\n\
  });\n\
  return textArray;\n\
};\n\
\n\
LabelEdgeGroup.prototype.getLabelAnchors = function(display, spacing) {\n\
\n\
  var labelAnchors = [];\n\
  var renderLen = this.getRenderLength(display);\n\
  var anchorCount = Math.floor(renderLen / spacing);\n\
  var pctSpacing = spacing / renderLen;\n\
\n\
  for (var i = 0; i < anchorCount; i++) {\n\
    var t = (i % 2 === 0) ?\n\
      0.5 + (i / 2) * pctSpacing :\n\
      0.5 - ((i + 1) / 2) * pctSpacing;\n\
    var coord = this.coordAlongRenderedPath(t, display);\n\
    if (coord) labelAnchors.push(coord);\n\
  }\n\
\n\
  return labelAnchors;\n\
};\n\
\n\
LabelEdgeGroup.prototype.coordAlongRenderedPath = function(t, display) {\n\
  var renderLen = this.getRenderLength(display);\n\
  var loc = t * renderLen;\n\
\n\
  var cur = 0;\n\
  for (var i = 0; i < this.renderedEdges.length; i++) {\n\
    var rEdge = this.renderedEdges[i];\n\
    var edgeRenderLen = rEdge.graphEdge.getRenderLength(display);\n\
    if (loc <= cur + edgeRenderLen) {\n\
      var t2 = (loc - cur) / edgeRenderLen;\n\
      return rEdge.graphEdge.coordAlongEdge(t2, rEdge.renderData, display);\n\
    }\n\
    cur += edgeRenderLen;\n\
  }\n\
\n\
};\n\
\n\
LabelEdgeGroup.prototype.getRenderLength = function(display) {\n\
  if (!this.renderLength) {\n\
    this.renderLength = 0;\n\
    each(this.renderedEdges, function(rEdge) {\n\
      this.renderLength += rEdge.graphEdge.getRenderLength(display);\n\
    }, this);\n\
  }\n\
  return this.renderLength;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/labeler/labeledgegroup.js"
));
require.register("conveyal-transitive.js/lib/display/index.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var debug = require('debug')('transitive:display');\n\
var each = require('each');\n\
\n\
var TileLayer = require('./tile-layer');\n\
\n\
var SphericalMercator = require('../util/spherical-mercator');\n\
var sm = new SphericalMercator();\n\
\n\
/**\n\
 * Expose `Display`\n\
 */\n\
\n\
module.exports = Display;\n\
\n\
/**\n\
 * The D3-based SVG display.\n\
 *\n\
 * @param {Object} options\n\
 */\n\
\n\
function Display(transitive) {\n\
  this.transitive = transitive;\n\
  var el = this.el = transitive.el;\n\
  this.width = el.clientWidth;\n\
  this.height = el.clientHeight;\n\
\n\
  // Set up the pan/zoom behavior\n\
  var zoom = this.zoom = d3.behavior.zoom()\n\
    .scaleExtent([0.25, 4]);\n\
\n\
  var self = this;\n\
\n\
  var zoomBehavior = function() {\n\
    self.computeScale();\n\
    if (self.scale !== self.lastScale) { // zoom action\n\
      self.zoomChanged();\n\
    } else { // pan action\n\
      setTimeout(transitive.refresh.bind(transitive, true), 0);\n\
    }\n\
\n\
    var llb = self.llBounds();\n\
    debug('ll bounds: ' + llb[0][0] + ',' + llb[0][1] + ' to ' + llb[1][0] +\n\
      ',' + llb[1][1]);\n\
  };\n\
\n\
  this.zoom.on('zoom.transitive', zoomBehavior);\n\
\n\
  this.zoomFactors = transitive.options.zoomFactors || this.getDefaultZoomFactors();\n\
\n\
  // set up the svg display\n\
  var div = d3.select(el)\n\
    .attr('class', 'Transitive');\n\
\n\
  if(transitive.options.zoomEnabled) {\n\
    div.call(zoom);\n\
  }\n\
\n\
  this.svg = div\n\
    .append('svg')\n\
    .attr('class', 'schematic-map');\n\
\n\
  // initialize the x/y scale objects\n\
  this.xScale = d3.scale.linear();\n\
  this.yScale = d3.scale.linear();\n\
\n\
  // set up the resize event handler\n\
  if(transitive.options.autoResize) {\n\
    d3.select(window).on('resize.display', function() {\n\
      self.resized();\n\
      transitive.refresh();\n\
    });\n\
  }\n\
\n\
  // set the scale\n\
  var bounds;\n\
  if (transitive.options.initialBounds) {\n\
    bounds = [sm.forward(transitive.options.initialBounds[0]),\n\
      sm.forward(transitive.options.initialBounds[1])\n\
    ];\n\
  } else if (transitive.network && transitive.network.graph) {\n\
    bounds = transitive.network.graph.bounds();\n\
  }\n\
\n\
  if (bounds) {\n\
    this.setScale(bounds, transitive.options);\n\
    this.updateActiveZoomFactors(this.scale);\n\
    this.lastScale = this.scale;\n\
  } else {\n\
    this.updateActiveZoomFactors(1);\n\
  }\n\
\n\
  // set up the map layer\n\
  if (transitive.options.mapboxId) {\n\
    this.tileLayer = new TileLayer({\n\
      el: this.el,\n\
      display: this,\n\
      graph: transitive.graph,\n\
      mapboxId: transitive.options.mapboxId\n\
    });\n\
  }\n\
\n\
  transitive.emit('initialize display', transitive, this);\n\
  return this;\n\
}\n\
\n\
/**\n\
 * zoomChanged -- called when the zoom level changes, either by through the native\n\
 * zoom support or the setBounds() API call. Updates zoom factors as needed and \n\
 * performs appropriate update action (render or refresh)\n\
 */\n\
\n\
Display.prototype.zoomChanged = function() {\n\
  if (this.updateActiveZoomFactors(this.scale)) {\n\
    this.transitive.network = null;\n\
    this.transitive.render();\n\
  } else this.transitive.refresh();\n\
  this.lastScale = this.scale;\n\
};\n\
\n\
\n\
Display.prototype.updateActiveZoomFactors = function(scale) {\n\
  var updated = false;\n\
  for (var i = 0; i < this.zoomFactors.length; i++) {\n\
    var min = this.zoomFactors[i].minScale;\n\
    var max = (i < this.zoomFactors.length - 1) ?\n\
      this.zoomFactors[i + 1].minScale : Number.MAX_VALUE;\n\
\n\
    // check if we've crossed into a new zoomFactor partition\n\
    if ((!this.lastScale || this.lastScale < min || this.lastScale >= max) &&\n\
      scale >= min && scale < max) {\n\
      this.activeZoomFactors = this.zoomFactors[i];\n\
      updated = true;\n\
    }\n\
  }\n\
  return updated;\n\
};\n\
\n\
\n\
/**\n\
 * Return default zoom factors\n\
 */\n\
\n\
Display.prototype.getDefaultZoomFactors = function(data) {\n\
  return [{\n\
    minScale: 0,\n\
    gridCellSize: 100,\n\
    internalVertexFactor: 100000,\n\
    angleConstraint: 45,\n\
    mergeVertexThreshold: 200\n\
  }, {\n\
    minScale: 1.5,\n\
    gridCellSize: 0,\n\
    internalVertexFactor: 0,\n\
    angleConstraint: 5,\n\
    mergeVertexThreshold: 0\n\
  }];\n\
};\n\
\n\
/**\n\
 * Empty the display\n\
 */\n\
\n\
Display.prototype.empty = function() {\n\
  debug('emptying svg');\n\
  this.svg.selectAll('*').remove();\n\
\n\
  this.haloLayer = this.svg.insert('g', ':first-child');\n\
};\n\
\n\
/**\n\
 * Set the scale\n\
 */\n\
\n\
Display.prototype.setScale = function(bounds, options) {\n\
\n\
  this.height = this.el.clientHeight;\n\
  this.width = this.el.clientWidth;\n\
\n\
  var domains = getDomains(this, this.height, this.width, bounds, options);\n\
  this.xScale.domain(domains[0]);\n\
  this.yScale.domain(domains[1]);\n\
\n\
  this.xScale.range([0, this.width]);\n\
  this.yScale.range([this.height, 0]);\n\
\n\
  debug('x scale %j -> %j', this.xScale.domain(), this.xScale.range());\n\
  debug('y scale %j -> %j', this.yScale.domain(), this.yScale.range());\n\
\n\
  this.zoom\n\
    .x(this.xScale)\n\
    .y(this.yScale);\n\
\n\
  this.initXRes = (domains[0][1] - domains[0][0])/this.width;\n\
  this.scale = 1;\n\
\n\
  this.scaleSet = true;\n\
};\n\
\n\
\n\
Display.prototype.computeScale = function() {\n\
  var newXRes = (this.xScale.domain()[1] - this.xScale.domain()[0]) / this.width;\n\
  this.scale =  this.initXRes / newXRes;\n\
};\n\
\n\
/**\n\
 * updateDomains -- set x/y domains of geographic (spherical mercator) coordinate\n\
 * system. Does *not* check/adjust aspect ratio.\n\
 */\n\
\n\
Display.prototype.updateDomains = function(bounds) {\n\
  this.xScale.domain([bounds[0][0], bounds[1][0]]);\n\
  this.yScale.domain([bounds[0][1], bounds[1][1]]);\n\
\n\
  this.zoom\n\
    .x(this.xScale)\n\
    .y(this.yScale);\n\
\n\
  this.computeScale();\n\
};\n\
\n\
Display.prototype.resized = function() {\n\
\n\
  var newWidth = this.el.clientWidth;\n\
  var newHeight = this.el.clientHeight;\n\
\n\
  var xDomain = this.xScale.domain();\n\
  var xFactor = newWidth / this.width;\n\
  var xDomainAdj = (xDomain[1] - xDomain[0]) * (xFactor - 1) / 2;\n\
  this.xScale.domain([xDomain[0] - xDomainAdj, xDomain[1] + xDomainAdj]);\n\
\n\
  var yDomain = this.yScale.domain();\n\
  var yFactor = newHeight / this.height;\n\
  var yDomainAdj = (yDomain[1] - yDomain[0]) * (yFactor - 1) / 2;\n\
  this.yScale.domain([yDomain[0] - yDomainAdj, yDomain[1] + yDomainAdj]);\n\
\n\
  this.xScale.range([0, newWidth]);\n\
  this.yScale.range([newHeight, 0]);\n\
\n\
  this.height = newHeight;\n\
  this.width = newWidth;\n\
\n\
  this.zoom\n\
    .x(this.xScale)\n\
    .y(this.yScale);\n\
};\n\
\n\
Display.prototype.xyBounds = function() {\n\
  var x = this.xScale.domain();\n\
  var y = this.yScale.domain();\n\
  return [\n\
    [x[0], y[1]],\n\
    [x[1], y[0]]\n\
  ];\n\
};\n\
\n\
/**\n\
 * Lat/lon bounds\n\
 */\n\
\n\
Display.prototype.llBounds = function() {\n\
  var x = this.xScale.domain();\n\
  var y = this.yScale.domain();\n\
\n\
  return [\n\
    sm.inverse([x[0], y[1]]),\n\
    sm.inverse([x[1], y[0]])\n\
  ];\n\
};\n\
\n\
Display.prototype.isInRange = function(x, y) {\n\
  var xRange = this.xScale.range();\n\
  var yRange = this.yScale.range();\n\
\n\
  return x >= xRange[0] && x <= xRange[1] && y >= yRange[1] && y <= yRange[0];\n\
};\n\
\n\
/**\n\
 * Compute the x/y coordinate space domains to fit the graph.\n\
 */\n\
\n\
function getDomains(display, height, width, bounds, options) {\n\
  var xmin = bounds[0][0],\n\
    xmax = bounds[1][0];\n\
  var ymin = bounds[1][1],\n\
    ymax = bounds[0][1];\n\
  var xRange = xmax - xmin;\n\
  var yRange = ymax - ymin;\n\
\n\
  var paddingFactor = (options && options.paddingFactor) ?\n\
    options.paddingFactor : 0.1;\n\
\n\
  var margins = getMargins(options);\n\
\n\
  var usableHeight = height - margins.top - margins.bottom;\n\
  var usableWidth = width - margins.left - margins.right;\n\
  var displayAspect = width / height;\n\
  var usableDisplayAspect = usableWidth / usableHeight;\n\
  var graphAspect = xRange / (yRange === 0 ? -Infinity : yRange);\n\
\n\
  var padding;\n\
  var dispX1, dispX2, dispY1, dispY2;\n\
  var dispXRange, dispYRange;\n\
\n\
  if (usableDisplayAspect > graphAspect) { // y-axis is limiting\n\
    padding = paddingFactor * yRange;\n\
    dispY1 = ymin - padding;\n\
    dispY2 = ymax + padding;\n\
    dispYRange = yRange + 2 * padding;\n\
    var addedYRange = (height / usableHeight * dispYRange) - dispYRange;\n\
    if (margins.top > 0 || margins.bottom > 0) {\n\
      dispY1 -= margins.bottom / (margins.bottom + margins.top) * addedYRange;\n\
      dispY2 += margins.top / (margins.bottom + margins.top) * addedYRange;\n\
    }\n\
    dispXRange = (dispY2 - dispY1) * displayAspect;\n\
    var xOffset = (margins.left - margins.right) / width;\n\
    var xMidpoint = (xmax + xmin - dispXRange * xOffset) / 2;\n\
    dispX1 = xMidpoint - dispXRange / 2;\n\
    dispX2 = xMidpoint + dispXRange / 2;\n\
  } else { // x-axis limiting\n\
    padding = paddingFactor * xRange;\n\
    dispX1 = xmin - padding;\n\
    dispX2 = xmax + padding;\n\
    dispXRange = xRange + 2 * padding;\n\
    var addedXRange = (width / usableWidth * dispXRange) - dispXRange;\n\
    if (margins.left > 0 || margins.right > 0) {\n\
      dispX1 -= margins.left / (margins.left + margins.right) * addedXRange;\n\
      dispX2 += margins.right / (margins.left + margins.right) * addedXRange;\n\
    }\n\
\n\
    dispYRange = (dispX2 - dispX1) / displayAspect;\n\
    var yOffset = (margins.bottom - margins.top) / height;\n\
    var yMidpoint = (ymax + ymin - dispYRange * yOffset) / 2;\n\
    dispY1 = yMidpoint - dispYRange / 2;\n\
    dispY2 = yMidpoint + dispYRange / 2;\n\
  }\n\
\n\
  return [\n\
    [dispX1, dispX2],\n\
    [dispY1, dispY2]\n\
  ];\n\
}\n\
\n\
function getMargins(options) {\n\
  var margins = {\n\
    left: 0,\n\
    right: 0,\n\
    top: 0,\n\
    bottom: 0\n\
  };\n\
\n\
  if (options && options.displayMargins) {\n\
    if (options.displayMargins.top) margins.top = options.displayMargins.top;\n\
    if (options.displayMargins.bottom) margins.bottom = options.displayMargins.bottom;\n\
    if (options.displayMargins.left) margins.left = options.displayMargins.left;\n\
    if (options.displayMargins.right) margins.right = options.displayMargins.right;\n\
  }\n\
\n\
  return margins;\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/display/index.js"
));
require.register("conveyal-transitive.js/lib/display/legend.js", Function("exports, require, module",
"var d3 = require('d3');\n\
\n\
var RenderedEdge = require('../renderer/renderededge');\n\
var RenderedSegment = require('../renderer/renderedsegment');\n\
var Util = require('../util');\n\
var Stop = require('../point/stop');\n\
\n\
/**\n\
 * Expose `Legend`\n\
 */\n\
\n\
module.exports = Legend;\n\
\n\
function Legend(el, transitive) {\n\
  this.el = el;\n\
  this.transitive = transitive;\n\
\n\
  this.height = Util.parsePixelStyle(d3.select(el).style('height'));\n\
}\n\
\n\
Legend.prototype.render = function(legendSegments) {\n\
\n\
  d3.select(this.el).selectAll(':not(.doNotEmpty)').remove();\n\
\n\
  this.x = this.spacing;\n\
  this.y = this.height / 2;\n\
\n\
  var segment;\n\
\n\
  // iterate through the representative map segments\n\
  for (var legendType in legendSegments) {\n\
    var mapSegment = legendSegments[legendType];\n\
\n\
    // create a segment solely for rendering in the legend\n\
    segment = new RenderedSegment();\n\
    segment.type = mapSegment.getType();\n\
    segment.mode = mapSegment.mode;\n\
    segment.patterns = mapSegment.patterns;\n\
\n\
    var canvas = this.createCanvas();\n\
\n\
    var renderData = [];\n\
    renderData.push({\n\
      x: 0,\n\
      y: canvas.height / 2\n\
    });\n\
    renderData.push({\n\
      x: canvas.width,\n\
      y: canvas.height / 2\n\
    });\n\
\n\
    segment.render(canvas);\n\
    segment.refresh(canvas, renderData);\n\
\n\
    this.renderText(getDisplayText(legendType));\n\
\n\
    this.x += this.spacing * 2;\n\
  }\n\
\n\
  // create the 'transfer' marker\n\
\n\
  segment = new RenderedEdge(null, 'TRANSIT');\n\
  segment.pattern = {\n\
    pattern_id: 'ptn',\n\
    route: {\n\
      route_type: 1\n\
    }\n\
  };\n\
\n\
  var transferStop = new Stop();\n\
  transferStop.isSegmentEndPoint = true;\n\
  transferStop.isTransferPoint = true;\n\
\n\
  this.renderPoint(transferStop, segment, 'Transfer');\n\
};\n\
\n\
Legend.prototype.renderPoint = function(point, segment, text) {\n\
\n\
  var canvas = this.createCanvas();\n\
\n\
  point.addRenderData({\n\
    owner: point,\n\
    segment: segment,\n\
    x: canvas.width / 2,\n\
    y: canvas.height / 2,\n\
    offsetX: 0,\n\
    offsetY: 0\n\
  });\n\
\n\
  point.render(canvas);\n\
\n\
  canvas.styler.renderPoint(canvas, point);\n\
  point.refresh(canvas);\n\
\n\
  this.renderText(text);\n\
};\n\
\n\
Legend.prototype.renderText = function(text) {\n\
  d3.select(this.el).append('div')\n\
    .attr('class', 'legendLabel')\n\
    .html(text);\n\
};\n\
\n\
Legend.prototype.createCanvas = function() {\n\
\n\
  var container = d3.select(this.el).append('div')\n\
    .attr('class', 'legendSvg');\n\
\n\
  var width = Util.parsePixelStyle(container.style('width'));\n\
  if (!width || width === 0) width = 30;\n\
\n\
  var height = Util.parsePixelStyle(container.style('height'));\n\
  if (!height || height === 0) height = this.height;\n\
\n\
  var canvas = {\n\
    xScale: d3.scale.linear(),\n\
    yScale: d3.scale.linear(),\n\
    styler: this.transitive.styler,\n\
    zoom: this.transitive.display.zoom,\n\
    width: width,\n\
    height: height,\n\
    svg: container.append('svg')\n\
      .style(\"width\", width)\n\
      .style(\"height\", height)\n\
  };\n\
\n\
  return canvas;\n\
};\n\
\n\
function getDisplayText(type) {\n\
  switch (type) {\n\
    case 'WALK':\n\
      return 'Walk';\n\
    case 'BICYCLE':\n\
      return 'Bike';\n\
    case 'CAR':\n\
      return 'Drive';\n\
    case 'TRANSIT_0':\n\
      return 'Tram';\n\
    case 'TRANSIT_1':\n\
      return 'Metro';\n\
    case 'TRANSIT_2':\n\
      return 'Rail';\n\
    case 'TRANSIT_3':\n\
      return 'Bus';\n\
    case 'TRANSIT_4':\n\
      return 'Ferry';\n\
  }\n\
  return type;\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/display/legend.js"
));
require.register("conveyal-transitive.js/lib/display/draw-grid.js", Function("exports, require, module",
"var d3 = require('d3');\n\
\n\
/**\n\
 * Draw the snapping grid\n\
 *\n\
 * @param {Display} display object\n\
 * @param {Number} cell size\n\
 */\n\
\n\
module.exports = function drawGrid(display, cellSize) {\n\
  var svg = display.svg;\n\
  var xScale = display.xScale;\n\
  var yScale = display.yScale;\n\
\n\
  // Remove all current gridlines\n\
  svg.selectAll('.gridline').remove();\n\
\n\
  // Add a grid group \"behind\" everything else\n\
  var grid = svg.insert('g', ':first-child');\n\
\n\
  var xRange = xScale.range();\n\
  var yRange = yScale.range();\n\
  var xDomain = xScale.domain();\n\
  var yDomain = yScale.domain();\n\
\n\
  var xMin = Math.round(xDomain[0] / cellSize) * cellSize;\n\
  var xMax = Math.round(xDomain[1] / cellSize) * cellSize;\n\
  for (var x = xMin; x <= xMax; x += cellSize)\n\
    appendLine(xScale(x), xScale(x), yRange[0], yRange[1]);\n\
\n\
  var yMin = Math.round(yDomain[0] / cellSize) * cellSize;\n\
  var yMax = Math.round(yDomain[1] / cellSize) * cellSize;\n\
  for (var y = yMin; y <= yMax; y += cellSize)\n\
    appendLine(xRange[0], xRange[1], yScale(y), yScale(y));\n\
\n\
  function appendLine(x1, x2, y1, y2) {\n\
    grid.append('line')\n\
      .attr({\n\
        'class': 'gridline',\n\
        'x1': x1,\n\
        'x2': x2,\n\
        'y1': y1,\n\
        'y2': y2\n\
      });\n\
  }\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/display/draw-grid.js"
));
require.register("conveyal-transitive.js/lib/display/tile-layer.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var debug = require('debug')('transitive:tile-layer');\n\
\n\
var geoTile = require('./d3.geo.tile');\n\
var SphericalMercator = require('../util/spherical-mercator');\n\
\n\
var prefix = prefixMatch(['webkit', 'ms', 'Moz', 'O']);\n\
\n\
/**\n\
 * Tile layer takes a parent element, a zoom behavior, and a Mapbox ID\n\
 *\n\
 * @param {Object} opts\n\
 */\n\
\n\
module.exports = function TileLayer(opts) {\n\
  debug('creating the tile layer');\n\
\n\
  var el = opts.el;\n\
  var display = opts.display;\n\
  var graph = opts.graph;\n\
  var height = el.clientHeight;\n\
  var id = opts.mapboxId;\n\
  var width = el.clientWidth;\n\
  var zoom = display.zoom;\n\
\n\
  // Set up the projection\n\
  var projection = d3.geo.mercator()\n\
    .translate([width / 2, height / 2]);\n\
\n\
  // Set up the map tiles\n\
  var tile = geoTile();\n\
\n\
  // Create the tile layer\n\
  var tileLayer = d3.select(el)\n\
    .append('div')\n\
    .attr('class', 'tile-layer');\n\
\n\
  // Initial zoom\n\
  zoomed();\n\
\n\
  this.zoomed = zoomed;\n\
\n\
  // Reload tiles on pan and zoom\n\
  function zoomed() {\n\
    // Get the height and width\n\
    height = el.clientHeight;\n\
    width = el.clientWidth;\n\
\n\
    // Set the map tile size\n\
    tile.size([width, height]);\n\
\n\
    // Get the current display bounds\n\
    var bounds = display.llBounds();\n\
\n\
    // Project the bounds based on the current projection\n\
    var pnw = projection(bounds[0]);\n\
    var pse = projection(bounds[1]);\n\
\n\
    // Based the new scale and translation vector off the current one\n\
    var scale = projection.scale() * 2 * Math.PI;\n\
    var translate = projection.translate();\n\
\n\
    var dx = pse[0] - pnw[0];\n\
    var dy = pse[1] - pnw[1];\n\
\n\
    scale = scale * (1 / Math.max(dx / width, dy / height));\n\
    projection\n\
      .translate([width / 2, height / 2])\n\
      .scale(scale / 2 / Math.PI);\n\
\n\
    // Reproject the bounds based on the new scale and translation vector\n\
    pnw = projection(bounds[0]);\n\
    pse = projection(bounds[1]);\n\
    var x = (pnw[0] + pse[0]) / 2;\n\
    var y = (pnw[1] + pse[1]) / 2;\n\
    translate = [width - x, height - y];\n\
\n\
    // Update the Geo tiles\n\
    tile\n\
      .scale(scale)\n\
      .translate(translate);\n\
\n\
    // Get the new set of tiles and render\n\
    renderTiles(tile());\n\
  }\n\
\n\
  // Render tiles\n\
  function renderTiles(tiles) {\n\
    var image = tileLayer\n\
      .style(prefix + 'transform', matrix3d(tiles.scale, tiles.translate))\n\
      .selectAll('.tile')\n\
      .data(tiles, function(d) {\n\
        return d;\n\
      });\n\
\n\
    image.exit()\n\
      .remove();\n\
\n\
    image.enter().append('img')\n\
      .attr('class', 'tile')\n\
      .attr('src', function(d) {\n\
        return 'http://' + ['a', 'b', 'c', 'd'][Math.random() * 4 | 0] +\n\
          '.tiles.mapbox.com/v3/' + id + '/' + d[2] + '/' + d[0] +\n\
          '/' + d[1] + '.png';\n\
      })\n\
      .style('left', function(d) {\n\
        return (d[0] << 8) + 'px';\n\
      })\n\
      .style('top', function(d) {\n\
        return (d[1] << 8) + 'px';\n\
      });\n\
  }\n\
};\n\
\n\
/**\n\
 * Get the 3D Transform Matrix\n\
 */\n\
\n\
function matrix3d(scale, translate) {\n\
  var k = scale / 256,\n\
    r = scale % 1 ? Number : Math.round;\n\
  return 'matrix3d(' + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] *\n\
    scale), r(translate[1] * scale), 0, 1] + ')';\n\
}\n\
\n\
/**\n\
 * Match the transform prefix\n\
 */\n\
\n\
function prefixMatch(p) {\n\
  var i = -1,\n\
    n = p.length,\n\
    s = document.body.style;\n\
  while (++i < n)\n\
    if (p[i] + 'Transform' in s) return '-' + p[i].toLowerCase() + '-';\n\
  return '';\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/display/tile-layer.js"
));
require.register("conveyal-transitive.js/lib/display/d3.geo.tile.js", Function("exports, require, module",
"var d3 = require('d3');\n\
\n\
module.exports = function() {\n\
  var size = [960, 500],\n\
    scale = 256,\n\
    translate = [size[0] / 2, size[1] / 2],\n\
    zoomDelta = 0;\n\
\n\
  function tile() {\n\
    var z = Math.max(Math.log(scale) / Math.LN2 - 8, 0),\n\
      z0 = Math.round(z + zoomDelta),\n\
      k = Math.pow(2, z - z0 + 8),\n\
      origin = [(translate[0] - scale / 2) / k, (translate[1] - scale / 2) / k],\n\
      tiles = [],\n\
      cols = d3.range(Math.max(0, Math.floor(-origin[0])), Math.max(0, Math.ceil(\n\
        size[0] / k - origin[0]))),\n\
      rows = d3.range(Math.max(0, Math.floor(-origin[1])), Math.max(0, Math.ceil(\n\
        size[1] / k - origin[1])));\n\
\n\
    rows.forEach(function(y) {\n\
      cols.forEach(function(x) {\n\
        tiles.push([x, y, z0]);\n\
      });\n\
    });\n\
\n\
    tiles.translate = origin;\n\
    tiles.scale = k;\n\
\n\
    return tiles;\n\
  }\n\
\n\
  tile.size = function(_) {\n\
    if (!arguments.length) return size;\n\
    size = _;\n\
    return tile;\n\
  };\n\
\n\
  tile.scale = function(_) {\n\
    if (!arguments.length) return scale;\n\
    scale = _;\n\
    return tile;\n\
  };\n\
\n\
  tile.translate = function(_) {\n\
    if (!arguments.length) return translate;\n\
    translate = _;\n\
    return tile;\n\
  };\n\
\n\
  tile.zoomDelta = function(_) {\n\
    if (!arguments.length) return zoomDelta;\n\
    zoomDelta = +_;\n\
    return tile;\n\
  };\n\
\n\
  return tile;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/display/d3.geo.tile.js"
));
require.register("conveyal-transitive.js/lib/core/path.js", Function("exports, require, module",
"var d3 = require('d3');\n\
\n\
var interpolateLine = require('../util/interpolate-line');\n\
\n\
/**\n\
 * Expose `NetworkPath`\n\
 */\n\
\n\
module.exports = NetworkPath;\n\
\n\
/**\n\
 * NetworkPath -- a path through the network graph. Composed of PathSegments (which\n\
 * are in turn composed of a sequence of graph edges)\n\
 *\n\
 * @param {Object} the parent onject (a RoutePattern or Journey)\n\
 */\n\
\n\
function NetworkPath(parent) {\n\
  this.parent = parent;\n\
  this.segments = [];\n\
}\n\
\n\
NetworkPath.prototype.clearGraphData = function(segment) {\n\
  this.graphEdges = [];\n\
  this.segments.forEach(function(segment) {\n\
    segment.clearGraphData();\n\
  });\n\
};\n\
\n\
/**\n\
 * addSegment: add a new segment to the end of this NetworkPath\n\
 */\n\
\n\
NetworkPath.prototype.addSegment = function(segment) {\n\
  this.segments.push(segment);\n\
  segment.points.forEach(function(point) {\n\
    point.paths.push(this);\n\
  }, this);\n\
};\n\
\n\
/** highlight **/\n\
\n\
NetworkPath.prototype.drawHighlight = function(display, capExtension) {\n\
\n\
  this.line = d3.svg.line() // the line translation function\n\
  .x(function(pointInfo, i) {\n\
    return display.xScale(pointInfo.x) + (pointInfo.offsetX || 0);\n\
  })\n\
    .y(function(pointInfo, i) {\n\
      return display.yScale(pointInfo.y) - (pointInfo.offsetY || 0);\n\
    })\n\
    .interpolate(interpolateLine.bind(this));\n\
\n\
  this.lineGraph = display.svg.append('path')\n\
    .attr('id', 'transitive-path-highlight-' + this.parent.getElementId())\n\
    .attr('class', 'transitive-path-highlight')\n\
    .style('stroke-width', 24).style('stroke', '#ff4')\n\
    .style('fill', 'none')\n\
    .style('visibility', 'hidden')\n\
    .data([this]);\n\
};\n\
\n\
NetworkPath.prototype.getRenderedSegments = function() {\n\
  var renderedSegments = [];\n\
  this.segments.forEach(function(pathSegment) {\n\
    renderedSegments = renderedSegments.concat(pathSegment.renderedSegments);\n\
  });\n\
  return renderedSegments;\n\
};\n\
\n\
/**\n\
 * getPointArray\n\
 */\n\
\n\
NetworkPath.prototype.getPointArray = function() {\n\
  var points = [];\n\
  for (var i = 0; i < this.segments.length; i++) {\n\
    var segment = this.segments[i];\n\
    if (i > 0 && segment.points[0] === this.segments[i - 1].points[this.segments[\n\
      i - 1].points.length - 1]) {\n\
      points.concat(segment.points.slice(1));\n\
    } else {\n\
      points.concat(segment.points);\n\
    }\n\
  }\n\
  return points;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/core/path.js"
));
require.register("conveyal-transitive.js/lib/core/pathsegment.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var each = require('each');\n\
\n\
var PatternGroup = require('./patterngroup');\n\
var LabelEdgeGroup = require('../labeler/labeledgegroup.js');\n\
\n\
var segmentId = 0;\n\
\n\
/**\n\
 * Expose `PathSegment`\n\
 */\n\
\n\
module.exports = PathSegment;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function PathSegment(type, path) {\n\
  this.id = segmentId++;\n\
  this.type = type;\n\
  this.path = path;\n\
  this.points = [];\n\
  this.graphEdges = [];\n\
  this.renderedSegments = [];\n\
  this.patternGroup = new PatternGroup();\n\
}\n\
\n\
PathSegment.prototype.clearGraphData = function() {\n\
  this.graphEdges = [];\n\
  this.points.forEach(function(point) {\n\
    point.graphVertex = null;\n\
  });\n\
  this.renderLength = null;\n\
};\n\
\n\
PathSegment.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
PathSegment.prototype.getType = function() {\n\
  return this.type;\n\
};\n\
\n\
PathSegment.prototype.addRenderedSegment = function(rSegment) {\n\
  this.renderedSegments.push(rSegment);\n\
};\n\
\n\
PathSegment.prototype.addEdge = function(edge) {\n\
  this.graphEdges.push(edge);\n\
};\n\
\n\
PathSegment.prototype.removeEdge = function(edge) {\n\
  while (this.graphEdges.indexOf(edge) !== -1) {\n\
    this.graphEdges.splice(this.graphEdges.indexOf(edge), 1);\n\
  }\n\
};\n\
\n\
PathSegment.prototype.replaceEdge = function(edge, newEdges) {\n\
\n\
  var i = this.graphEdges.indexOf(edge);\n\
  if (i === -1) return;\n\
\n\
  // remove the old edge\n\
  this.graphEdges.splice(i, 1);\n\
\n\
  // insert the new edges\n\
  this.graphEdges.splice.apply(this.graphEdges, [i, 0].concat(newEdges));\n\
\n\
};\n\
\n\
PathSegment.prototype.getEdgeIndex = function(edge) {\n\
  for (var i = 0; i < this.graphEdges.length; i++) {\n\
    if (this.graphEdges[i].edge === edge) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
PathSegment.prototype.getAdjacentEdge = function(edge, vertex) {\n\
\n\
  // ensure that edge/vertex pair is valid\n\
  if (edge.toVertex !== vertex && edge.fromVertex !== vertex) return null;\n\
\n\
  var index = this.getEdgeIndex(edge);\n\
  if (index === -1) return null;\n\
\n\
  // check previous edge\n\
  if (index > 0) {\n\
    var prevEdge = this.graphEdges[index - 1].edge;\n\
    if (prevEdge.toVertex === vertex || prevEdge.fromVertex === vertex)\n\
      return prevEdge;\n\
  }\n\
\n\
  // check next edge\n\
  if (index < this.graphEdges.length - 1) {\n\
    var nextEdge = this.graphEdges[index + 1].edge;\n\
    if (nextEdge.toVertex === vertex || nextEdge.fromVertex === vertex)\n\
      return nextEdge;\n\
  }\n\
\n\
  return null;\n\
};\n\
\n\
/**\n\
 * Get graph vertices\n\
 */\n\
\n\
PathSegment.prototype.getGraphVertices = function() {\n\
  var vertices = [];\n\
  this.graphEdges.forEach(function(edge, i) {\n\
    if (i === 0) {\n\
      vertices.push(edge.fromVertex);\n\
    }\n\
    vertices.push(edge.toVertex);\n\
  });\n\
  return vertices;\n\
};\n\
\n\
PathSegment.prototype.getEdgeIndex = function(edge) {\n\
  for (var i = 0; i < this.graphEdges.length; i++) {\n\
    if (this.graphEdges[i].edge === edge) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
PathSegment.prototype.vertexArray = function() {\n\
\n\
  var vertex = this.startVertex();\n\
  var array = [vertex];\n\
\n\
  this.graphEdges.forEach(function(edgeInfo) {\n\
    vertex = edgeInfo.edge.oppositeVertex(vertex);\n\
    array.push(vertex);\n\
  });\n\
\n\
  return array;\n\
};\n\
\n\
PathSegment.prototype.startVertex = function() {\n\
  if (this.points[0].multipoint) return this.points[0].multipoint.graphVertex;\n\
  if (!this.graphEdges || this.graphEdges.length === 0) return null;\n\
  if (this.graphEdges.length === 1) return this.graphEdges[0].fromVertex;\n\
  var first = this.graphEdges[0],\n\
    next = this.graphEdges[1];\n\
  if (first.toVertex == next.toVertex || first.toVertex == next.fromVertex)\n\
    return first.fromVertex;\n\
  if (first.fromVertex == next.toVertex || first.fromVertex == next.fromVertex)\n\
    return first.toVertex;\n\
  return null;\n\
};\n\
\n\
PathSegment.prototype.endVertex = function() {\n\
  if (this.points[this.points.length - 1].multipoint) return this.points[this.points\n\
    .length - 1].multipoint.graphVertex;\n\
  if (!this.graphEdges || this.graphEdges.length === 0) return null;\n\
  if (this.graphEdges.length === 1) return this.graphEdges[0].toVertex;\n\
  var last = this.graphEdges[this.graphEdges.length - 1],\n\
    prev = this.graphEdges[this.graphEdges.length - 2];\n\
  if (last.toVertex == prev.toVertex || last.toVertex == prev.fromVertex)\n\
    return last.fromVertex;\n\
  if (last.fromVertex == prev.toVertex || last.fromVertex == prev.fromVertex)\n\
    return last.toVertex;\n\
  return null;\n\
};\n\
\n\
PathSegment.prototype.addPattern = function(pattern, fromIndex, toIndex) {\n\
  if ((toIndex - fromIndex + 1) > this.points.length) {\n\
    this.points = [];\n\
    var lastStop = null;\n\
    for (var i = fromIndex; i <= toIndex; i++) {\n\
      var stop = pattern.stops[i];\n\
      if (lastStop !== stop) this.points.push(stop);\n\
      lastStop = stop;\n\
    }\n\
  }\n\
  this.patternGroup.addPattern(pattern);\n\
  //this.pattern = pattern;\n\
};\n\
\n\
PathSegment.prototype.getPattern = function() {\n\
  return this.patternGroup.patterns[0];\n\
};\n\
\n\
PathSegment.prototype.getPatterns = function() {\n\
  return this.patternGroup.patterns;\n\
};\n\
\n\
PathSegment.prototype.getMode = function() {\n\
  return this.patternGroup.patterns[0].route.route_type;\n\
};\n\
\n\
PathSegment.prototype.toString = function() {\n\
  var startVertex = this.startVertex(),\n\
    endVertex = this.endVertex();\n\
  return 'PathSegment type=' + this.type + ' from ' +\n\
    (startVertex ? startVertex.toString() : '(unknown)') + ' to ' +\n\
    (endVertex ? endVertex.toString() : '(unknown)');\n\
};\n\
\n\
PathSegment.prototype.getLabelEdgeGroups = function() {\n\
  var edgeGroups = [];\n\
  each(this.renderedSegments, function(rSegment) {\n\
    if (!rSegment.isFocused()) return;\n\
    var currentGroup = new LabelEdgeGroup(rSegment);\n\
    each(rSegment.renderedEdges, function(rEdge) {\n\
      currentGroup.addEdge(rEdge);\n\
      if (rEdge.graphEdge.toVertex.point.containsSegmentEndPoint()) {\n\
        edgeGroups.push(currentGroup);\n\
        currentGroup = new LabelEdgeGroup(rSegment);\n\
      }\n\
    }, this);\n\
  }, this);\n\
\n\
  return edgeGroups;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/core/pathsegment.js"
));
require.register("conveyal-transitive.js/lib/core/pattern.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var each = require('each');\n\
\n\
/**\n\
 * Expose `RoutePattern`\n\
 */\n\
\n\
module.exports = RoutePattern;\n\
\n\
/**\n\
 * A RoutePattern\n\
 *\n\
 * @param {Object} RoutePattern data object from the transitive.js input\n\
 */\n\
\n\
function RoutePattern(data, transitive) {\n\
  for (var key in data) {\n\
    if (key === 'stops') continue;\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.stops = [];\n\
  if (transitive) {\n\
    each(data.stops, function(stop) {\n\
      this.stops.push(transitive.stops[stop.stop_id]);\n\
    }, this);\n\
  }\n\
\n\
  this.renderedEdges = [];\n\
}\n\
\n\
RoutePattern.prototype.getId = function() {\n\
  return this.pattern_id;\n\
};\n\
\n\
RoutePattern.prototype.getElementId = function() {\n\
  return 'pattern-' + this.pattern_id;\n\
};\n\
\n\
RoutePattern.prototype.getName = function() {\n\
  return this.pattern_name;\n\
};\n\
\n\
RoutePattern.prototype.addRenderedEdge = function(rEdge) {\n\
  if (this.renderedEdges.indexOf(rEdge) === -1) this.renderedEdges.push(\n\
    rEdge);\n\
};\n\
\n\
RoutePattern.prototype.offsetAlignment = function(alignmentId, offset) {\n\
  each(this.renderedEdges, function(rEdge) {\n\
    rEdge.offsetAlignment(alignmentId, offset);\n\
  });\n\
};\n\
\n\
/*RoutePattern.prototype.addRenderSegment = function(segment) {\n\
  if (this.renderSegments.indexOf(segment) === -1) this.renderSegments.push(\n\
    segment);\n\
};\n\
\n\
RoutePattern.prototype.offsetAlignment = function(alignmentId, offset) {\n\
  each(this.renderSegments, function(segment) {\n\
    segment.offsetAlignment(alignmentId, offset);\n\
  });\n\
};\n\
\n\
RoutePattern.prototype.getAlignmentVector = function(alignmentId) {\n\
  for (var i = 0; i < this.renderSegments.length; i++) {\n\
    var segmentVector = this.renderSegments[i].getAlignmentVector(alignmentId);\n\
    if(segmentVector) return segmentVector;\n\
  }\n\
  return null;\n\
};*/\n\
//@ sourceURL=conveyal-transitive.js/lib/core/pattern.js"
));
require.register("conveyal-transitive.js/lib/core/patterngroup.js", Function("exports, require, module",
"/**\n\
 * Expose `PatternGroup`\n\
 */\n\
\n\
module.exports = PatternGroup;\n\
\n\
/**\n\
 * A PatternGroup\n\
 *\n\
 * @param {Object} RoutePattern data object from the transitive.js input\n\
 */\n\
\n\
function PatternGroup() {\n\
  this.patterns = [];\n\
}\n\
\n\
PatternGroup.prototype.addPattern = function(pattern) {\n\
  if (this.patterns.indexOf(pattern) === -1) this.patterns.push(pattern);\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/core/patterngroup.js"
));
require.register("conveyal-transitive.js/lib/core/route.js", Function("exports, require, module",
"/**\n\
 * Expose `Route`\n\
 */\n\
\n\
module.exports = Route;\n\
\n\
/**\n\
 * A transit Route, as defined in the input data.\n\
 * Routes contain one or more Patterns.\n\
 *\n\
 * @param {Object}\n\
 */\n\
\n\
function Route(data) {\n\
  for (var key in data) {\n\
    if (key === 'patterns') continue;\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.patterns = [];\n\
}\n\
\n\
/**\n\
 * Add Pattern\n\
 *\n\
 * @param {Pattern}\n\
 */\n\
\n\
Route.prototype.addPattern = function(pattern) {\n\
  this.patterns.push(pattern);\n\
  pattern.route = this;\n\
};\n\
\n\
Route.prototype.getColor = function() {\n\
  if (this.route_color) {\n\
    if (this.route_color.charAt(0) === '#') return this.route_color;\n\
    return '#' + this.route_color;\n\
  }\n\
\n\
  // assign a random shade of gray\n\
  /*var c = 128 + Math.floor(64 * Math.random());\n\
  var hex = c.toString(16);\n\
  hex = (hex.length === 1) ? '0' + hex : hex;\n\
\n\
  this.route_color = '#' + hex + hex + hex;\n\
\n\
  return this.route_color;*/\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/core/route.js"
));
require.register("conveyal-transitive.js/lib/core/journey.js", Function("exports, require, module",
"var PathSegment = require('./pathsegment');\n\
var NetworkPath = require('./path');\n\
var TurnPoint = require('../point/turn');\n\
var Polyline = require('../util/polyline.js');\n\
var SphericalMercator = require('../util/spherical-mercator');\n\
var sm = new SphericalMercator();\n\
\n\
var each = require('each');\n\
/**\n\
 * Expose `Journey`\n\
 */\n\
\n\
module.exports = Journey;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function Journey(data, transitive) {\n\
\n\
  this.transitive = transitive;\n\
\n\
  for (var key in data) {\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.path = new NetworkPath(this);\n\
\n\
  each(this.segments, function(segmentInfo) {\n\
\n\
    var pathSegment = new PathSegment(segmentInfo.type, this.path);\n\
    pathSegment.journeySegment = segmentInfo;\n\
\n\
    // decode and store the leg geometry, if provided\n\
    if (segmentInfo.geometry) {\n\
      var latLons = Polyline.decode(segmentInfo.geometry.points);\n\
      var coords = [];\n\
      each(latLons, function(latLon) {\n\
        coords.push(sm.forward([latLon[1], latLon[0]]));\n\
      });\n\
      pathSegment.geomCoords = coords;\n\
    }\n\
\n\
    if (segmentInfo.type === 'TRANSIT') {\n\
      if (segmentInfo.patterns) {\n\
        each(segmentInfo.patterns, function(patternInfo) {\n\
          pathSegment.addPattern(transitive.patterns[patternInfo.pattern_id],\n\
            patternInfo.from_stop_index, patternInfo.to_stop_index);\n\
        });\n\
      } else if (segmentInfo.pattern_id) { // legacy support for single-pattern journey segments\n\
        pathSegment.addPattern(transitive.patterns[segmentInfo.pattern_id],\n\
          segmentInfo.from_stop_index, segmentInfo.to_stop_index);\n\
      }\n\
    } else {\n\
      // screen out degenerate transfer segments\n\
      if (segmentInfo.from.type === 'STOP' && segmentInfo.to.type === 'STOP' &&\n\
        segmentInfo.from.stop_id === segmentInfo.to.stop_id) return;\n\
\n\
      pathSegment.points.push(getEndPoint(segmentInfo.from, transitive));\n\
      each(segmentInfo.turnPoints, function(turnPointInfo) {\n\
        pathSegment.points.push(getTurnPoint(turnPointInfo, transitive));\n\
      }, this);\n\
      pathSegment.points.push(getEndPoint(segmentInfo.to, transitive));\n\
    }\n\
    this.path.addSegment(pathSegment);\n\
  }, this);\n\
}\n\
\n\
function getEndPoint(pointInfo, transitive) {\n\
  if (pointInfo.type === 'PLACE') {\n\
    return transitive.places[pointInfo.place_id];\n\
  } else if (pointInfo.type === 'STOP') {\n\
    return transitive.stops[pointInfo.stop_id];\n\
  }\n\
}\n\
\n\
Journey.prototype.getElementId = function() {\n\
  return 'journey-' + this.journey_id;\n\
};\n\
\n\
/* utility function for creating non-duplicative TurnPoints */\n\
\n\
function getTurnPoint(turnPointInfo, transitive) {\n\
  var key = turnPointInfo.lat + '_' + turnPointInfo.lon;\n\
  if (key in transitive.turnPoints) return transitive.turnPoints[key];\n\
  var turnPoint = new TurnPoint(turnPointInfo);\n\
  transitive.turnPoints[key] = turnPoint;\n\
  return turnPoint;\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/core/journey.js"
));
require.register("conveyal-transitive.js/lib/core/network.js", Function("exports, require, module",
"var each = require('each');\n\
var debug = require('debug')('transitive:network');\n\
var Emitter = require('emitter');\n\
\n\
var NetworkPath = require('./path');\n\
var Route = require('./route');\n\
var RoutePattern = require('./pattern');\n\
var Journey = require('./journey');\n\
\n\
var Stop = require('../point/stop');\n\
var Place = require('../point/place');\n\
var PointClusterMap = require('../point/pointclustermap');\n\
var RenderedEdge = require('../renderer/renderededge');\n\
var RenderedSegment = require('../renderer/renderedsegment');\n\
\n\
var Graph = require('../graph');\n\
\n\
/**\n\
 * Expose `Network`\n\
 */\n\
\n\
module.exports = Network;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function Network(transitive, data) {\n\
  this.transitive = transitive;\n\
\n\
  this.routes = {};\n\
  this.stops = {};\n\
  this.patterns = {};\n\
  this.places = {};\n\
  this.journeys = {};\n\
  this.paths = [];\n\
  this.baseVertexPoints = [];\n\
  this.graph = new Graph(this, []);\n\
\n\
  if (data) this.load(data);\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`\n\
 */\n\
\n\
Emitter(Network.prototype);\n\
\n\
/**\n\
 * Load\n\
 *\n\
 * @param {Object} data\n\
 */\n\
\n\
Network.prototype.load = function(data) {\n\
  debug('loading', data);\n\
\n\
  // check data\n\
  if (!data) data = {};\n\
\n\
  // Store data\n\
  this.data = data;\n\
\n\
  // A list of points (stops & places) that will always become vertices in the network\n\
  // graph (regardless of zoom scale). This includes all points that serve as a segment\n\
  // endpoint and/or a convergence/divergence point between segments\n\
  this.baseVertexPoints = [];\n\
\n\
  // object maps stop ids to arrays of unique stop_ids reachable from that stop\n\
  this.adjacentStops = {};\n\
\n\
  // maps lat_lon key to unique TurnPoint object\n\
  this.turnPoints = {};\n\
\n\
  // Generate the route objects\n\
  this.routes = {};\n\
  each(data.routes, function(data) {\n\
    this.routes[data.route_id] = new Route(data);\n\
  }, this);\n\
\n\
  // Generate the stop objects\n\
  this.stops = {};\n\
  each(data.stops, function(data) {\n\
    this.stops[data.stop_id] = new Stop(data);\n\
  }, this);\n\
\n\
  // Generate the pattern objects\n\
  this.patterns = {};\n\
  each(data.patterns, function(data) {\n\
    var pattern = new RoutePattern(data, this);\n\
    this.patterns[data.pattern_id] = pattern;\n\
    var route = this.routes[data.route_id];\n\
    if (route) {\n\
      route.addPattern(pattern);\n\
      pattern.route = route;\n\
    } else {\n\
      console.log('Error: pattern ' + data.pattern_id +\n\
        ' refers to route that was not found: ' + data.route_id);\n\
    }\n\
  }, this);\n\
\n\
  // Generate the place objects\n\
  this.places = {};\n\
  each(data.places, function(data) {\n\
    var place = this.places[data.place_id] = new Place(data, this);\n\
    this.addVertexPoint(place);\n\
  }, this);\n\
\n\
  // Generate the internal Journey objects\n\
  this.journeys = {};\n\
  each(data.journeys, function(journeyData) {\n\
    var journey = new Journey(journeyData, this);\n\
    this.journeys[journeyData.journey_id] = journey;\n\
    this.paths.push(journey.path);\n\
  }, this);\n\
\n\
  // process the path segments\n\
  for (var p = 0; p < this.paths.length; p++) {\n\
    var path = this.paths[p];\n\
    for (var s = 0; s < path.segments.length; s++) {\n\
      this.processSegment(path.segments[s]);\n\
    }\n\
  }\n\
\n\
  // determine the convergence/divergence vertex stops by looking for stops w/ >2 adjacent stops\n\
  /*for (var stopId in this.adjacentStops) {\n\
    if (this.adjacentStops[stopId].length > 2) {\n\
      this.addVertexPoint(this.stops[stopId]);\n\
    }\n\
  }*/\n\
\n\
  this.createGraph();\n\
\n\
  this.loaded = true;\n\
  this.emit('load', this);\n\
  return this;\n\
};\n\
\n\
/** Graph Creation/Processing Methods **/\n\
\n\
Network.prototype.clearGraphData = function() {\n\
  each(this.paths, function(path) {\n\
    path.clearGraphData();\n\
  });\n\
};\n\
\n\
Network.prototype.createGraph = function() {\n\
  this.applyZoomFactors(this.transitive.display.activeZoomFactors);\n\
\n\
  // clear previous graph-specific data\n\
  if (this.pointClusterMap) this.pointClusterMap.clearMultiPoints();\n\
  each(this.stops, function(stopId) {\n\
    this.stops[stopId].setFocused(true);\n\
  }, this);\n\
\n\
  // create the list of vertex points\n\
  var vertexPoints; // = this.baseVertexPoints.concat();\n\
  if (this.mergeVertexThreshold && this.mergeVertexThreshold > 0) {\n\
    this.pointClusterMap = new PointClusterMap(this, this.mergeVertexThreshold);\n\
    vertexPoints = this.pointClusterMap.getVertexPoints(this.baseVertexPoints);\n\
    /*each(this.pointClusterMap.vertexPoints, function(point) {\n\
      if(vertexPoints.indexOf(point) === -1) vertexPoints.push(point);\n\
    });*/\n\
  } else vertexPoints = this.baseVertexPoints;\n\
\n\
  // core graph creation steps\n\
  this.graph = new Graph(this, vertexPoints);\n\
  this.populateGraphEdges();\n\
  this.graph.pruneVertices();\n\
  this.createInternalVertexPoints();\n\
  if (this.isSnapping()) this.graph.snapToGrid(this.gridCellSize);\n\
  this.graph.sortVertices();\n\
\n\
  // other post-processing actions\n\
  this.annotateTransitPoints();\n\
  //this.initPlaceAdjacency();\n\
  this.createRenderedSegments();\n\
  this.transitive.labeler.updateLabelList(this.graph);\n\
  this.updateGeometry(true);\n\
};\n\
\n\
Network.prototype.isSnapping = function() {\n\
  return this.gridCellSize && this.gridCellSize !== 0;\n\
};\n\
\n\
/*\n\
 * identify and populate the 'internal' vertex points, which is zoom-level specfic\n\
 */\n\
\n\
Network.prototype.createInternalVertexPoints = function() {\n\
\n\
  this.internalVertexPoints = [];\n\
\n\
  // create a shallow-cloned copy\n\
  var edges = [];\n\
  each(this.graph.edges, function(e) {\n\
    //if(this.graph.getEdgeGroup(e) && this.graph.getEdgeGroup(e).length === 1) edges.push(e);\n\
    edges.push(e);\n\
  }, this);\n\
\n\
  //each(edges, function(edge) {\n\
  for (var i in this.graph.edgeGroups) {\n\
    var edgeGroup = this.graph.edgeGroups[i];\n\
\n\
    var wlen = edgeGroup.getWorldLength();\n\
    //var wlen = edge.getWorldLength();\n\
\n\
    // compute the maximum number of internal points for this edge to add as graph vertices\n\
    var vertexFactor = !edgeGroup.hasTransit() ? 1 : this.internalVertexFactor;\n\
    var newVertexCount = Math.floor(wlen / vertexFactor);\n\
\n\
    // get the priority queue of the edge's internal points\n\
    var pq = edgeGroup.getInternalVertexPQ();\n\
\n\
    // pull the 'best' points from the queue until we reach the maximum\n\
    var splitPoints = [];\n\
    while (splitPoints.length < newVertexCount && pq.size() > 0) {\n\
      var el = pq.deq();\n\
      splitPoints.push(el.point);\n\
    }\n\
\n\
    // perform the split operation (if needed)\n\
    if (splitPoints.length > 0) {\n\
      for (var e = 0; e < edgeGroup.edges.length; e++) {\n\
        var edge = edgeGroup.edges[e];\n\
        this.graph.splitEdgeAtInternalPoints(edge, splitPoints);\n\
      }\n\
    }\n\
\n\
  }\n\
  //}, this);\n\
};\n\
\n\
Network.prototype.updateGeometry = function() {\n\
\n\
  // clear the stop render data\n\
  //for (var key in this.stops) this.stops[key].renderData = [];\n\
\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    //vertex.snapped = false;\n\
    vertex.point.clearRenderData();\n\
  });\n\
\n\
  // refresh the edge-based points\n\
  this.graph.edges.forEach(function(edge) {\n\
    edge.pointArray.forEach(function(point) {\n\
      point.clearRenderData();\n\
    });\n\
  });\n\
\n\
  this.renderedEdges.forEach(function(rEdge) {\n\
    rEdge.clearOffsets();\n\
  });\n\
\n\
  //if (snapGrid)\n\
  //if(this.gridCellSize && this.gridCellSize !== 0) this.graph.snapToGrid(this.gridCellSize);\n\
\n\
  //this.fixPointOverlaps();\n\
\n\
  this.graph.calculateGeometry(this.gridCellSize, this.angleConstraint);\n\
\n\
  this.graph.apply2DOffsets(this);\n\
};\n\
\n\
Network.prototype.applyZoomFactors = function(factors) {\n\
  this.gridCellSize = factors.gridCellSize;\n\
  this.internalVertexFactor = factors.internalVertexFactor;\n\
  this.angleConstraint = factors.angleConstraint;\n\
  this.mergeVertexThreshold = factors.mergeVertexThreshold;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Network.prototype.processSegment = function(segment) {\n\
\n\
  // iterate through this pattern's stops, associating stops/patterns with\n\
  // each other and initializing the adjacentStops table\n\
  var previousStop = null;\n\
  for (var i = 0; i < segment.points.length; i++) {\n\
    var point = segment.points[i];\n\
    point.used = true;\n\
\n\
    // called for each pair of adjacent stops in sequence\n\
    if (previousStop && point.getType() === 'STOP') {\n\
      this.addStopAdjacency(point.getId(), previousStop.getId());\n\
      this.addStopAdjacency(previousStop.getId(), point.getId());\n\
    }\n\
\n\
    previousStop = (point.getType() === 'STOP') ? point : null;\n\
\n\
    // add the start and end points to the vertexStops collection\n\
    var startPoint = segment.points[0];\n\
    this.addVertexPoint(startPoint);\n\
    startPoint.isSegmentEndPoint = true;\n\
\n\
    var endPoint = segment.points[segment.points.length - 1];\n\
    this.addVertexPoint(endPoint);\n\
    endPoint.isSegmentEndPoint = true;\n\
\n\
  }\n\
};\n\
\n\
/**\n\
 * Helper function for stopAjacency table\n\
 *\n\
 * @param {Stop} adjacent stops list\n\
 * @param {Stop} stopA\n\
 * @param {Stop} stopB\n\
 */\n\
\n\
Network.prototype.addStopAdjacency = function(stopIdA, stopIdB) {\n\
  if (!this.adjacentStops[stopIdA]) this.adjacentStops[stopIdA] = [];\n\
  if (this.adjacentStops[stopIdA].indexOf(stopIdB) === -1) this.adjacentStops[\n\
    stopIdA].push(stopIdB);\n\
};\n\
\n\
/**\n\
 * Populate the graph edges\n\
 */\n\
\n\
Network.prototype.populateGraphEdges = function() {\n\
  // vertex associated with the last vertex point we passed in this sequence\n\
  var lastVertex = null;\n\
\n\
  // collection of 'internal' (i.e. non-vertex) points passed\n\
  // since the last vertex point\n\
  var internalPoints = [];\n\
\n\
  each(this.paths, function(path) {\n\
    each(path.segments, function(segment) {\n\
\n\
      if (segment.geomCoords && this.internalVertexFactor <= 1) {\n\
        var edge = this.graph.addEdge(internalPoints, segment.points[0].graphVertex,\n\
          segment.points[segment.points.length - 1].graphVertex, segment.getType()\n\
        );\n\
        edge.geomCoords = segment.geomCoords;\n\
        segment.graphEdges.push(edge);\n\
        edge.addPathSegment(segment);\n\
        return;\n\
      }\n\
\n\
      lastVertex = null;\n\
      var lastVertexIndex = 0;\n\
\n\
      each(segment.points, function(point, index) {\n\
\n\
        if (point.multipoint) point = point.multipoint;\n\
        if (point.graphVertex) { // this is a vertex point\n\
          if (lastVertex !== null) {\n\
            if (lastVertex.point === point) return;\n\
            var edge = this.graph.getEquivalentEdge(internalPoints,\n\
              lastVertex,\n\
              point.graphVertex);\n\
\n\
            if (!edge) {\n\
              edge = this.graph.addEdge(internalPoints, lastVertex, point\n\
                .graphVertex, segment.getType());\n\
\n\
              // calculate the angle and apply to edge stops\n\
              var dx = point.graphVertex.x - lastVertex.x;\n\
              var dy = point.graphVertex.y - lastVertex.y;\n\
              var angle = Math.atan2(dy, dx) * 180 / Math.PI;\n\
              point.angle = lastVertex.point.angle = angle;\n\
              for (var is = 0; is < internalPoints.length; is++) {\n\
                internalPoints[is].angle = angle;\n\
              }\n\
            }\n\
\n\
            segment.addEdge(edge);\n\
            edge.addPathSegment(segment);\n\
          }\n\
\n\
          lastVertex = point.graphVertex;\n\
          lastVertexIndex = index;\n\
          internalPoints = [];\n\
        } else { // this is an internal point\n\
          internalPoints.push(point);\n\
        }\n\
      }, this);\n\
    }, this);\n\
  }, this);\n\
};\n\
\n\
Network.prototype.annotateTransitPoints = function() {\n\
  var lookup = {};\n\
\n\
  this.paths.forEach(function(path) {\n\
\n\
    var transitSegments = [];\n\
    path.segments.forEach(function(pathSegment) {\n\
      if (pathSegment.type === 'TRANSIT') transitSegments.push(pathSegment);\n\
    });\n\
\n\
    path.segments.forEach(function(pathSegment) {\n\
      if (pathSegment.type === 'TRANSIT') {\n\
\n\
        // if first transit segment in path, mark 'from' endpoint as board point\n\
        if (transitSegments.indexOf(pathSegment) === 0) {\n\
          pathSegment.points[0].isBoardPoint = true;\n\
\n\
          // if there are additional transit segments, mark the 'to' endpoint as a transfer point\n\
          if (transitSegments.length > 1) pathSegment.points[pathSegment.points\n\
            .length - 1].isTransferPoint = true;\n\
        }\n\
\n\
        // if last transit segment in path, mark 'to' endpoint as alight point\n\
        else if (transitSegments.indexOf(pathSegment) === transitSegments.length -\n\
          1) {\n\
          pathSegment.points[pathSegment.points.length - 1].isAlightPoint =\n\
            true;\n\
\n\
          // if there are additional transit segments, mark the 'from' endpoint as a transfer point\n\
          if (transitSegments.length > 1) pathSegment.points[0].isTransferPoint =\n\
            true;\n\
        }\n\
\n\
        // if this is an 'internal' transit segment, mark both endpoints as transfer points\n\
        else if (transitSegments.length > 2) {\n\
          pathSegment.points[0].isTransferPoint = true;\n\
          pathSegment.points[pathSegment.points.length - 1].isTransferPoint =\n\
            true;\n\
        }\n\
\n\
      }\n\
    });\n\
  });\n\
};\n\
\n\
Network.prototype.initPlaceAdjacency = function() {\n\
  each(this.places, function(placeId) {\n\
    var place = this.places[placeId];\n\
    if (!place.graphVertex) return;\n\
    each(place.graphVertex.incidentEdges(), function(edge) {\n\
      var oppVertex = edge.oppositeVertex(place.graphVertex);\n\
      if (oppVertex.point) {\n\
        oppVertex.point.adjacentPlace = place;\n\
      }\n\
    });\n\
  }, this);\n\
};\n\
\n\
Network.prototype.createRenderedSegments = function() {\n\
  this.reLookup = {};\n\
  this.renderedEdges = [];\n\
  this.renderedSegments = [];\n\
\n\
  for (var patternId in this.patterns) {\n\
    this.patterns[patternId].renderedEdges = [];\n\
  }\n\
\n\
  each(this.paths, function(path) {\n\
\n\
    each(path.segments, function(pathSegment) {\n\
      pathSegment.renderedSegments = [];\n\
\n\
      if (pathSegment.type === 'TRANSIT') {\n\
\n\
        // create a RenderedSegment for each pattern, except for buses which are collapsed to a single segment\n\
        var busPatterns = [];\n\
        each(pathSegment.getPatterns(), function(pattern) {\n\
          if (pattern.route.route_type === 3) busPatterns.push(pattern);\n\
          else this.createRenderedSegment(pathSegment, [pattern]);\n\
        }, this);\n\
        if (busPatterns.length > 0) {\n\
          this.createRenderedSegment(pathSegment, busPatterns);\n\
        }\n\
      } else { // non-transit segments\n\
        this.createRenderedSegment(pathSegment);\n\
      }\n\
    }, this);\n\
  }, this);\n\
\n\
  this.renderedEdges.sort(function(a, b) { // process render transit segments before walk\n\
    if (a.getType() === 'WALK') return 1;\n\
    if (b.getType() === 'WALK') return -1;\n\
  });\n\
};\n\
\n\
Network.prototype.createRenderedSegment = function(pathSegment, patterns) {\n\
\n\
  var rSegment = new RenderedSegment(pathSegment);\n\
\n\
  each(pathSegment.graphEdges, function(gEdge) {\n\
    var rEdge = this.createRenderedEdge(pathSegment, gEdge, patterns);\n\
    rSegment.addRenderedEdge(rEdge);\n\
  }, this);\n\
  if (patterns) {\n\
    rSegment.patterns = patterns;\n\
    rSegment.mode = patterns[0].route.route_type;\n\
  }\n\
\n\
  pathSegment.addRenderedSegment(rSegment);\n\
};\n\
\n\
Network.prototype.createRenderedEdge = function(pathSegment, gEdge, patterns) {\n\
  var rEdge;\n\
  var key = gEdge.id + '_' + pathSegment.getType();\n\
\n\
  if (patterns && patterns[0].route.route_type !== 3) {\n\
    key += '_' + patterns[0].getId();\n\
  }\n\
\n\
  if (key in this.reLookup) {\n\
    rEdge = this.reLookup[key];\n\
  } else {\n\
    rEdge = new RenderedEdge(gEdge, pathSegment.type);\n\
    if (patterns) {\n\
      each(patterns, function(pattern) {\n\
        pattern.addRenderedEdge(rEdge);\n\
        rEdge.addPattern(pattern);\n\
      });\n\
      rEdge.mode = patterns[0].route.route_type;\n\
    }\n\
    rEdge.points.push(gEdge.fromVertex.point);\n\
    rEdge.points.push(gEdge.toVertex.point);\n\
    gEdge.addRenderedEdge(rEdge);\n\
    rEdge.addPathSegment(pathSegment);\n\
\n\
    this.renderedEdges.push(rEdge);\n\
    this.reLookup[key] = rEdge;\n\
  }\n\
  //pathSegment.renderedEdges.push(rEdge);\n\
  return rEdge;\n\
};\n\
\n\
Network.prototype.addVertexPoint = function(point) {\n\
  if (this.baseVertexPoints.indexOf(point) !== -1) return;\n\
  this.baseVertexPoints.push(point);\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/core/network.js"
));
require.register("conveyal-transitive.js/lib/transitive.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var debug = require('debug')('transitive');\n\
var Emitter = require('emitter');\n\
var each = require('each');\n\
\n\
var Network = require('./core/network');\n\
\n\
var Display = require('./display');\n\
var Legend = require('./display/legend');\n\
\n\
var Renderer = require('./renderer');\n\
var Styler = require('./styler');\n\
var Labeler = require('./labeler');\n\
\n\
var SphericalMercator = require('./util/spherical-mercator');\n\
var sm = new SphericalMercator();\n\
\n\
/**\n\
 * Expose `Transitive`\n\
 */\n\
\n\
module.exports = Transitive;\n\
\n\
/**\n\
 * Expose `version`\n\
 */\n\
\n\
module.exports.version = '0.7.0';\n\
\n\
/**\n\
 * Create a new instance of `Transitive`\n\
 *\n\
 * @param {Object} options object\n\
 *   - data {Object} data to render\n\
 *   - drawGrid {Boolean} defaults to false\n\
 *   - el {Element} element to render to\n\
 *   - gridCellSize {Number} size of the grid\n\
 *   - style {Object} styles to apply\n\
 */\n\
\n\
function Transitive(options) {\n\
\n\
  if (!(this instanceof Transitive)) return new Transitive(options);\n\
\n\
  this.options = options;\n\
  if (this.options.useDynamicRendering === undefined) this.options.useDynamicRendering =\n\
    true;\n\
  if (this.options.zoomEnabled === undefined) this.options.zoomEnabled = true;\n\
  if (this.options.autoResize === undefined) this.options.autoResize = true;\n\
\n\
  if (options.el) this.setElement(options.el);\n\
\n\
  this.data = options.data;\n\
\n\
  this.renderer = new Renderer(this);\n\
  this.labeler = new Labeler(this);\n\
  this.styler = new Styler(options.styles);\n\
\n\
  this.paths = [];\n\
  if (options.legendEl) this.legend = new Legend(options.legendEl, this);\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`\n\
 */\n\
\n\
Emitter(Transitive.prototype);\n\
\n\
/**\n\
 * Clear the Network data and redraw the (empty) map\n\
 */\n\
\n\
Transitive.prototype.clearData = function() {\n\
  this.network = this.data = null;\n\
  this.labeler.clear();\n\
  this.emit('clear data', this);\n\
};\n\
\n\
/**\n\
 * Update the Network data and redraw the map\n\
 */\n\
\n\
Transitive.prototype.updateData = function(data) {\n\
  this.network = null;\n\
  this.data = data;\n\
  if (this.display) this.display.scaleSet = false;\n\
  this.labeler.clear();\n\
  this.emit('update data', this);\n\
};\n\
\n\
/**\n\
 * Return the collection of default segment styles for a mode.\n\
 *\n\
 * @param {String} an OTP mode string\n\
 */\n\
\n\
Transitive.prototype.getModeStyles = function(mode) {\n\
  return this.styler.getModeStyles(mode, this.display || new Display(this));\n\
};\n\
\n\
/** Display/Render Methods **/\n\
\n\
/**\n\
 * Set the DOM element that serves as the main map canvas\n\
 */\n\
\n\
Transitive.prototype.setElement = function(el, legendEl) {\n\
  if (this.el) d3.select(this.el).selectAll('*').remove();\n\
\n\
  this.el = el;\n\
  this.display = new Display(this);\n\
\n\
  // Emit click events\n\
  var self = this;\n\
  this.display.svg.on('click', function() {\n\
    var x = d3.event.x;\n\
    var y = d3.event.y;\n\
    var geographic = sm.inverse([x, y]);\n\
    self.emit('click', {\n\
      x: x,\n\
      y: y,\n\
      lng: geographic[0],\n\
      lat: geographic[1]\n\
    });\n\
  });\n\
\n\
  this.emit('set element', this, this.el);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Render\n\
 */\n\
\n\
Transitive.prototype.render = function() {\n\
\n\
  if (!this.network) {\n\
    this.network = new Network(this, this.data);\n\
  }\n\
\n\
  if (!this.display.scaleSet) {\n\
    this.display.setScale(this.network.graph.bounds(), this.options);\n\
  }\n\
\n\
  this.renderer.render();\n\
\n\
  this.emit('render', this);\n\
};\n\
\n\
/**\n\
 * Render to\n\
 *\n\
 * @param {Element} el\n\
 */\n\
\n\
Transitive.prototype.renderTo = function(el) {\n\
  this.setElement(el);\n\
  this.render();\n\
\n\
  this.emit('render to', this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Refresh\n\
 */\n\
\n\
Transitive.prototype.refresh = function(panning) {\n\
  if (!this.network) {\n\
    this.render();\n\
  }\n\
\n\
  this.renderer.refresh();\n\
};\n\
\n\
/**\n\
 * focusJourney\n\
 */\n\
\n\
Transitive.prototype.focusJourney = function(journeyId) {\n\
  var path = journeyId ? this.network.journeys[journeyId].path : null;\n\
  this.renderer.focusPath(path);\n\
};\n\
\n\
\n\
/**\n\
 * Sets the Display bounds\n\
 * @param {Array} lon/lat bounds expressed as [[west, south], [east, north]]\n\
 */\n\
\n\
Transitive.prototype.setDisplayBounds = function(llBounds) {\n\
  this.display.updateDomains([sm.forward(llBounds[0]), sm.forward(llBounds[1])]);\n\
  this.display.zoomChanged();\n\
};\n\
\n\
/**\n\
 * Gets the Network bounds\n\
 * @returns {Array} lon/lat bounds expressed as [[west, south], [east, north]]\n\
 */\n\
\n\
Transitive.prototype.getNetworkBounds = function(llBounds) {\n\
  if(!this.network || !this.network.graph) return null;\n\
  var graphBounds = this.network.graph.bounds();\n\
  var ll1 = sm.inverse(graphBounds[0]), ll2 = sm.inverse(graphBounds[1]);\n\
  return [[Math.min(ll1[0], ll2[0]), Math.min(ll1[1], ll2[1])],\n\
          [Math.max(ll1[0], ll2[0]), Math.max(ll1[1], ll2[1])]];\n\
};\n\
\n\
/**\n\
 * resize\n\
 */\n\
\n\
Transitive.prototype.resize = function(width, height) {\n\
  if(!this.display) return;\n\
  d3.select(this.display.el)\n\
    .style(\"width\", width + 'px')\n\
    .style(\"height\", height + 'px');\n\
  this.display.resized();\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/transitive.js"
));
require.register("conveyal-transitive.js/lib/renderer/index.js", Function("exports, require, module",
"var debug = require('debug')('transitive:renderer');\n\
var each = require('each');\n\
\n\
var drawGrid = require('../display/draw-grid');\n\
\n\
/**\n\
 * Expose `Renderer`\n\
 */\n\
\n\
module.exports = Renderer;\n\
\n\
/**\n\
 * The network rendering engine.\n\
 *\n\
 * @param {Object} the main Transitive object\n\
 */\n\
\n\
function Renderer(transitive) {\n\
  this.transitive = transitive;\n\
}\n\
\n\
Renderer.prototype.render = function() {\n\
\n\
  var self = this;\n\
  var display = this.transitive.display;\n\
  var network = this.transitive.network;\n\
  var options = this.transitive.options;\n\
  display.styler = this.transitive.styler;\n\
\n\
  // remove all old svg elements\n\
  display.empty();\n\
\n\
  // draw the path highlights\n\
  /*for (var p = 0; p < this.paths.length; p++) {\n\
    this.paths[p].drawHighlight(this.display);\n\
  }*/\n\
\n\
  var legendSegments = {};\n\
\n\
  each(network.renderedEdges, function(rEdge) {\n\
    rEdge.refreshRenderData(display);\n\
  });\n\
\n\
  each(network.paths, function(path) {\n\
    each(path.segments, function(pathSegment) {\n\
      each(pathSegment.renderedSegments, function(renderedSegment) {\n\
        renderedSegment.render(display);\n\
        var legendType = renderedSegment.getLegendType();\n\
        if (!(legendType in legendSegments)) {\n\
          legendSegments[legendType] = renderedSegment;\n\
        }\n\
      });\n\
    });\n\
  });\n\
\n\
  // draw the vertex-based points\n\
  each(network.graph.vertices, function(vertex) {\n\
    vertex.point.render(display);\n\
    if (options.draggableTypes && options.draggableTypes.indexOf(\n\
      vertex.point.getType()) !== -1) {\n\
      vertex.point.makeDraggable(self.transitive);\n\
    }\n\
  });\n\
\n\
  // draw the edge-based points\n\
  each(network.graph.edges, function(edge) {\n\
    edge.pointArray.forEach(function(point) {\n\
      point.render(display);\n\
    });\n\
  });\n\
\n\
  if (display.legend) display.legend.render(legendSegments);\n\
\n\
  this.transitive.refresh();\n\
};\n\
\n\
/**\n\
 * Refresh\n\
 */\n\
\n\
Renderer.prototype.refresh = function(panning) {\n\
\n\
  var display = this.transitive.display;\n\
  var network = this.transitive.network;\n\
  var options = this.transitive.options;\n\
  var styler = this.transitive.styler;\n\
\n\
  if (display.tileLayer) display.tileLayer.zoomed();\n\
\n\
  network.graph.vertices.forEach(function(vertex) {\n\
    vertex.point.clearRenderData();\n\
  });\n\
  network.graph.edges.forEach(function(edge) {\n\
    edge.clearRenderData();\n\
  });\n\
\n\
  // draw the grid, if necessary\n\
  if (options.drawGrid) drawGrid(display, this.gridCellSize);\n\
\n\
  // refresh the segment and point marker data\n\
  this.refreshSegmentRenderData();\n\
  network.graph.vertices.forEach(function(vertex) {\n\
    vertex.point.initMarkerData(display);\n\
  });\n\
\n\
  this.renderedSegments = [];\n\
  each(network.paths, function(path) {\n\
    each(path.segments, function(pathSegment) {\n\
      each(pathSegment.renderedSegments, function(rSegment) {\n\
        rSegment.refresh(display);\n\
        this.renderedSegments.push(rSegment);\n\
      }, this);\n\
    }, this);\n\
  }, this);\n\
\n\
  network.graph.vertices.forEach(function(vertex) {\n\
    var point = vertex.point;\n\
    if (!point.svgGroup) return; // check if this point is not currently rendered\n\
    styler.renderPoint(display, point);\n\
    point.refresh(display);\n\
  });\n\
\n\
  // re-draw the edge-based points\n\
  network.graph.edges.forEach(function(edge) {\n\
    edge.pointArray.forEach(function(point) {\n\
      if (!point.svgGroup) return; // check if this point is not currently rendered\n\
      styler.renderStop(display, point);\n\
      point.refresh(display);\n\
    });\n\
  });\n\
\n\
  // refresh the label layout\n\
  var labeledElements = this.transitive.labeler.doLayout();\n\
  labeledElements.points.forEach(function(point) {\n\
    point.refreshLabel(display);\n\
    styler.renderPointLabel(display, point);\n\
  });\n\
  each(this.transitive.labeler.segmentLabels, function(label) {\n\
    label.refresh(display);\n\
    styler.renderSegmentLabel(display, label);\n\
  });\n\
\n\
  this.sortElements();\n\
\n\
};\n\
\n\
Renderer.prototype.refreshSegmentRenderData = function() {\n\
  each(this.transitive.network.renderedEdges, function(rEdge) {\n\
    rEdge.refreshRenderData(this.transitive.display);\n\
  }, this);\n\
\n\
  // try intersecting adjacent rendered edges to create a smooth transition\n\
\n\
  var isectKeys = []; // keep track of edge-edge intersections we've already computed\n\
  each(this.transitive.network.paths, function(path) {\n\
    each(path.segments, function(pathSegment) {\n\
      each(pathSegment.renderedSegments, function(rSegment) {\n\
        for (var s = 0; s < rSegment.renderedEdges.length - 1; s++) {\n\
          var rEdge1 = rSegment.renderedEdges[s];\n\
          var rEdge2 = rSegment.renderedEdges[s + 1];\n\
          var key = rEdge1.getId() + '_' + rEdge2.getId();\n\
          if (isectKeys.indexOf(key) !== -1) continue;\n\
          if (rEdge1.graphEdge.isInternal && rEdge2.graphEdge.isInternal) {\n\
            rEdge1.intersect(rEdge2);\n\
          }\n\
          isectKeys.push(key);\n\
        }\n\
      });\n\
    });\n\
  });\n\
};\n\
\n\
/**\n\
 * sortElements\n\
 */\n\
\n\
Renderer.prototype.sortElements = function() {\n\
\n\
  this.renderedSegments.sort(function(a, b) {\n\
    return (a.compareTo(b));\n\
  });\n\
\n\
  var focusBaseZIndex = 100000;\n\
\n\
  this.renderedSegments.forEach(function(rSegment, index) {\n\
    rSegment.zIndex = index * 10 + (rSegment.isFocused() ? focusBaseZIndex :\n\
      0);\n\
  });\n\
\n\
  this.transitive.network.graph.vertices.forEach(function(vertex) {\n\
    var point = vertex.point;\n\
    point.zIndex = point.zIndex + (point.isFocused() ? focusBaseZIndex : 0);\n\
  });\n\
\n\
  this.transitive.display.svg.selectAll('.transitive-sortable').sort(function(a, b) {\n\
    var aIndex = (typeof a.getZIndex === 'function') ? a.getZIndex() : a.owner\n\
      .getZIndex();\n\
    var bIndex = (typeof b.getZIndex === 'function') ? b.getZIndex() : b.owner\n\
      .getZIndex();\n\
    return aIndex - bIndex;\n\
  });\n\
};\n\
\n\
/**\n\
 * focusPath\n\
 */\n\
\n\
Renderer.prototype.focusPath = function(path) {\n\
\n\
  var self = this;\n\
  var pathRenderedSegments = [];\n\
  var graph = this.transitive.network.graph;\n\
\n\
  if (path) { // if we're focusing a specific path\n\
    pathRenderedSegments = path.getRenderedSegments();\n\
\n\
    // un-focus all internal points\n\
    graph.edges.forEach(function(edge) {\n\
      edge.pointArray.forEach(function(point, i) {\n\
        point.setAllPatternsFocused(false);\n\
      });\n\
    }, this);\n\
  } else { // if we're returing to 'all-focused' mode\n\
    // re-focus all internal points\n\
    graph.edges.forEach(function(edge) {\n\
      edge.pointArray.forEach(function(point, i) {\n\
        point.setAllPatternsFocused(true);\n\
      });\n\
    }, this);\n\
  }\n\
\n\
  var focusChangeSegments = [],\n\
    focusedVertexPoints = [];\n\
  each(this.renderedSegments, function(rSegment) {\n\
    if (path && pathRenderedSegments.indexOf(rSegment) === -1) {\n\
      if (rSegment.isFocused()) focusChangeSegments.push(rSegment);\n\
      rSegment.setFocused(false);\n\
    } else {\n\
      if (!rSegment.isFocused()) focusChangeSegments.push(rSegment);\n\
      rSegment.setFocused(true);\n\
      focusedVertexPoints.push(rSegment.pathSegment.startVertex().point);\n\
      focusedVertexPoints.push(rSegment.pathSegment.endVertex().point);\n\
    }\n\
  });\n\
\n\
  var focusChangePoints = [];\n\
  graph.vertices.forEach(function(vertex) {\n\
    var point = vertex.point;\n\
    if (focusedVertexPoints.indexOf(point) !== -1) {\n\
      if (!point.isFocused()) focusChangePoints.push(point);\n\
      point.setFocused(true);\n\
    } else {\n\
      if (point.isFocused()) focusChangePoints.push(point);\n\
      point.setFocused(false);\n\
    }\n\
  }, this);\n\
\n\
  // bring the focused elements to the front for the transition\n\
  //if (path) this.sortElements();\n\
\n\
  // create a transition callback function that invokes refresh() after all transitions complete\n\
  var n = 0;\n\
  var refreshOnEnd = function(transition, callback) {\n\
    transition\n\
      .each(function() {\n\
        ++n;\n\
      })\n\
      .each(\"end\", function() {\n\
        if (!--n) self.transitive.refresh();\n\
      });\n\
  };\n\
\n\
  // run the transtions on the affected elements\n\
  each(focusChangeSegments, function(segment) {\n\
    segment.runFocusTransition(this.transitive.display, refreshOnEnd);\n\
  }, this);\n\
\n\
  each(focusChangePoints, function(point) {\n\
    point.runFocusTransition(this.transitive.display, refreshOnEnd);\n\
  }, this);\n\
\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/renderer/index.js"
));
require.register("conveyal-transitive.js/lib/renderer/renderededge.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var each = require('each');\n\
\n\
var interpolateLine = require('../util/interpolate-line');\n\
//var SegmentLabel = require('./labeler/segmentlabel');\n\
var Util = require('../util');\n\
\n\
var rEdgeId = 0;\n\
\n\
/**\n\
 * Expose `RenderedEdge`\n\
 */\n\
\n\
module.exports = RenderedEdge;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function RenderedEdge(edge, type) {\n\
  this.id = rEdgeId++;\n\
  this.graphEdge = edge;\n\
  this.type = type;\n\
  this.points = [];\n\
  this.clearOffsets();\n\
  this.focused = true;\n\
\n\
  //this.label = new SegmentLabel(this);\n\
  //this.renderLabel = true;\n\
\n\
  this.sortableType = 'SEGMENT';\n\
\n\
}\n\
\n\
RenderedEdge.prototype.clearGraphData = function() {\n\
  this.graphEdge = null;\n\
  this.edgeFromOffset = 0;\n\
  this.edgeToOffset = 0;\n\
};\n\
\n\
RenderedEdge.prototype.addPattern = function(pattern) {\n\
  if (!this.patterns) this.patterns = [];\n\
  if (this.patterns.indexOf(pattern) !== -1) return;\n\
  this.patterns.push(pattern);\n\
\n\
  // generate the patternIds field\n\
  /*var patternIdArr = [];\n\
  each(this.patterns, function(pattern) { patternIdArr.push(pattern.getId()); });\n\
  patternIdArr.sort();\n\
  this.patternIds = patternIdArr.join(',');*/\n\
  this.patternIds = constuctIdListString(this.patterns);\n\
};\n\
\n\
RenderedEdge.prototype.addPathSegment = function(pathSegment) {\n\
  if (!this.pathSegments) this.pathSegments = [];\n\
  if (this.pathSegments.indexOf(pathSegment) !== -1) return;\n\
  this.pathSegments.push(pathSegment);\n\
\n\
  // generate the patternIds field\n\
  this.pathSegmentIds = constuctIdListString(this.pathSegments);\n\
};\n\
\n\
function constuctIdListString(items) {\n\
  var idArr = [];\n\
  each(items, function(item) {\n\
    idArr.push(item.getId());\n\
  });\n\
  idArr.sort();\n\
  return idArr.join(',');\n\
}\n\
\n\
RenderedEdge.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
RenderedEdge.prototype.getType = function() {\n\
  return this.type;\n\
};\n\
\n\
RenderedEdge.prototype.setFromOffset = function(offset) {\n\
  this.fromOffset = offset;\n\
};\n\
\n\
RenderedEdge.prototype.setToOffset = function(offset) {\n\
  this.toOffset = offset;\n\
};\n\
\n\
RenderedEdge.prototype.clearOffsets = function() {\n\
  this.fromOffset = 0;\n\
  this.toOffset = 0;\n\
};\n\
\n\
RenderedEdge.prototype.getAlignmentVector = function(alignmentId) {\n\
  if (this.graphEdge.getFromAlignmentId() === alignmentId) {\n\
    return this.graphEdge.fromVector;\n\
  }\n\
  if (this.graphEdge.getToAlignmentId() === alignmentId) {\n\
    return this.graphEdge.toVector;\n\
  }\n\
  return null;\n\
};\n\
\n\
RenderedEdge.prototype.offsetAlignment = function(alignmentId, offset) {\n\
\n\
  if (this.graphEdge.getFromAlignmentId() === alignmentId) {\n\
    this.setFromOffset(Util.isOutwardVector(this.graphEdge.fromVector) ? offset :\n\
      -offset);\n\
  }\n\
  if (this.graphEdge.getToAlignmentId() === alignmentId) {\n\
    this.setToOffset(Util.isOutwardVector(this.graphEdge.toVector) ? offset : -\n\
      offset);\n\
  }\n\
};\n\
\n\
/**\n\
 * Render\n\
 */\n\
\n\
/*RenderedEdge.prototype.render = function(display, capExtension) {\n\
\n\
  // add the line to the NetworkPath\n\
\n\
  this.line = d3.svg.line() // the line translation function\n\
  .x(function(data, i) {\n\
    return data.x;\n\
  })\n\
    .y(function(data, i) {\n\
      return data.y;\n\
    })\n\
    .interpolate(interpolateLine.bind({\n\
      segment: this,\n\
      display: display\n\
    }));\n\
\n\
  this.svgGroup = display.svg.append('g');\n\
\n\
  this.lineSvg = this.svgGroup.append('g')\n\
    .attr('class', 'transitive-sortable')\n\
    .datum({\n\
      owner: this,\n\
      sortableType: 'SEGMENT'\n\
    });\n\
\n\
  this.labelSvg = this.svgGroup.append('g');\n\
\n\
  this.lineGraph = this.lineSvg.append('path');\n\
\n\
  this.lineGraph\n\
    .attr('class', 'transitive-line')\n\
    .data([this]);\n\
\n\
  this.lineGraphFront = this.lineSvg.append('path');\n\
\n\
  this.lineGraphFront\n\
    .attr('class', 'transitive-line-front')\n\
    .data([this]);\n\
\n\
\n\
  if(display.haloLayer) {\n\
    this.lineGraphHalo = display.haloLayer.append('path');\n\
\n\
    this.lineGraphHalo\n\
      .attr('class', 'transitive-line-halo')\n\
      .data([this]);\n\
  }\n\
};*/\n\
\n\
RenderedEdge.prototype.setFocused = function(focused) {\n\
  this.focused = focused;\n\
};\n\
\n\
/**\n\
 * Refresh\n\
 */\n\
\n\
/*RenderedEdge.prototype.refresh = function(display) {\n\
  var lineData = this.line(this.renderData);\n\
  this.lineGraph.attr('d', lineData);\n\
  this.lineGraphFront.attr('d', lineData);\n\
  if(this.lineGraphHalo) this.lineGraphHalo.attr('d', lineData);\n\
  display.styler.renderSegment(display, this);\n\
};*/\n\
\n\
RenderedEdge.prototype.refreshRenderData = function(display) {\n\
  this.lineWidth = this.computeLineWidth(display, true);\n\
\n\
  var fromOffsetPx = this.fromOffset * this.lineWidth;\n\
  var toOffsetPx = this.toOffset * this.lineWidth;\n\
\n\
  if (this.graphEdge.geomCoords) {\n\
    this.renderData = this.graphEdge.getGeometricCoords(display);\n\
  } else {\n\
    this.renderData = this.graphEdge.getRenderCoords(fromOffsetPx, toOffsetPx,\n\
      display);\n\
  }\n\
\n\
  if (!this.graphEdge.fromVertex.isInternal) {\n\
    this.graphEdge.fromVertex.point.addRenderData({\n\
      x: this.renderData[0].x,\n\
      y: this.renderData[0].y,\n\
      segment: this\n\
    });\n\
  }\n\
\n\
  this.graphEdge.toVertex.point.addRenderData({\n\
    x: this.renderData[this.renderData.length - 1].x,\n\
    y: this.renderData[this.renderData.length - 1].y,\n\
    segment: this\n\
  });\n\
\n\
  each(this.graphEdge.pointArray, function(point, i) {\n\
    var t = (i + 1) / (this.graphEdge.pointArray.length + 1);\n\
    var coord = this.graphEdge.coordAlongEdge(t, this.renderData, display);\n\
    if (coord) {\n\
      point.addRenderData({\n\
        x: coord.x,\n\
        y: coord.y,\n\
        segment: this\n\
      });\n\
    }\n\
  }, this);\n\
\n\
};\n\
\n\
RenderedEdge.prototype.computeLineWidth = function(display, includeEnvelope) {\n\
  var styler = display.styler;\n\
  if (styler && display) {\n\
    // compute the line width\n\
    var env = styler.compute(styler.segments.envelope, display, this);\n\
    if (env && includeEnvelope) {\n\
      return parseFloat(env.substring(0, env.length - 2), 10) - 2;\n\
    } else {\n\
      var lw = styler.compute(styler.segments['stroke-width'], display, this);\n\
      return parseFloat(lw.substring(0, lw.length - 2), 10) - 2;\n\
    }\n\
  }\n\
};\n\
\n\
/*RenderedEdge.prototype.refreshLabel = function(display) {\n\
  if (!this.renderLabel) return;\n\
  this.label.refresh(display);\n\
};*/\n\
\n\
/*RenderedEdge.prototype.compareTo = function(other) {\n\
\n\
  // show transit segments in front of other types\n\
  if (this.type === 'TRANSIT' && other.type !== 'TRANSIT') return -1;\n\
  if (other.type === 'TRANSIT' && this.type !== 'TRANSIT') return 1;\n\
\n\
  if (this.type === 'TRANSIT' && other.type === 'TRANSIT') {\n\
\n\
    // for two transit segments, try sorting transit mode first\n\
    if (this.mode && other.mode && this.mode !== other.mode) {\n\
      return (this.mode > other.mode);\n\
    }\n\
\n\
    // for two transit segments of the same mode, sort by id (for display consistency)\n\
    return (this.getId() < other.getId());\n\
  }\n\
};*/\n\
\n\
RenderedEdge.prototype.isFocused = function() {\n\
  return (this.focused === true);\n\
};\n\
\n\
RenderedEdge.prototype.getZIndex = function() {\n\
  return 10000;\n\
};\n\
\n\
/**\n\
 *  Computes the point of intersection between two adjacent, offset segments (the\n\
 *  segment the function is called on and a second segment passed as a parameter)\n\
 *  by \"extending\" the adjacent segments and finding the point of intersection. If\n\
 *  such a point exists, the existing renderData arrays for the segments are\n\
 *  adjusted accordingly, as are any associated stops.\n\
 */\n\
\n\
RenderedEdge.prototype.intersect = function(segment) {\n\
\n\
  var commonVertex = this.graphEdge.commonVertex(segment.graphEdge);\n\
  if (!commonVertex || commonVertex.point.isSegmentEndPoint) return;\n\
\n\
  var p1 = (commonVertex === this.graphEdge.fromVertex) ? this.renderData[0] :\n\
    this.renderData[this.renderData.length - 1];\n\
  var v1 = this.graphEdge.getVector(commonVertex);\n\
\n\
  var p2 = (commonVertex === segment.graphEdge.fromVertex) ? segment.renderData[\n\
    0] : segment.renderData[segment.renderData.length - 1];\n\
  var v2 = segment.graphEdge.getVector(commonVertex);\n\
\n\
  if (p1.x === p2.x && p1.y === p2.y) return;\n\
\n\
  var isect = Util.lineIntersection(p1.x, p1.y, p1.x + v1.x, p1.y - v1.y, p2.x,\n\
    p2.y, p2.x + v2.x, p2.y - v2.y);\n\
\n\
  if (!isect.intersect) return;\n\
\n\
  // adjust the endpoint of the first edge\n\
  if (commonVertex === this.graphEdge.fromVertex) {\n\
    this.renderData[0].x = isect.x;\n\
    this.renderData[0].y = isect.y;\n\
  } else {\n\
    this.renderData[this.renderData.length - 1].x = isect.x;\n\
    this.renderData[this.renderData.length - 1].y = isect.y;\n\
  }\n\
\n\
  // adjust the endpoint of the second edge\n\
  if (commonVertex === segment.graphEdge.fromVertex) {\n\
    segment.renderData[0].x = isect.x;\n\
    segment.renderData[0].y = isect.y;\n\
  } else {\n\
    segment.renderData[segment.renderData.length - 1].x = isect.x;\n\
    segment.renderData[segment.renderData.length - 1].y = isect.y;\n\
  }\n\
\n\
  // update the point renderData\n\
  commonVertex.point.addRenderData({\n\
    x: isect.x,\n\
    y: isect.y,\n\
    segment: this\n\
  });\n\
\n\
};\n\
\n\
RenderedEdge.prototype.findExtension = function(vertex) {\n\
  var incidentEdges = vertex.incidentEdges(this.graphEdge);\n\
  var bundlerId = this.patternIds || this.pathSegmentIds;\n\
  for (var e = 0; e < incidentEdges.length; e++) {\n\
    var edgeSegments = incidentEdges[e].renderedEdges;\n\
    for (var s = 0; s < edgeSegments.length; s++) {\n\
      var segment = edgeSegments[s];\n\
      var otherId = segment.patternIds || segment.pathSegmentIds;\n\
      if (bundlerId === otherId) {\n\
        return segment;\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
/*\n\
RenderedEdge.prototype.getLabelAnchors = function(display, spacing) {\n\
\n\
  var labelAnchors = [];\n\
\n\
  var renderLen = this.graphEdge.getRenderLength(display);\n\
  var anchorCount = Math.floor(renderLen/spacing);\n\
  var pctSpacing = spacing/renderLen;\n\
\n\
  for(var i = 0; i < anchorCount; i++) {\n\
    var t = (i % 2 === 0) ?\n\
      0.5 + (i/2)* pctSpacing :\n\
      0.5 - ((i+1)/2) * pctSpacing;\n\
    labelAnchors.push(this.graphEdge.coordAlongEdge(t, this.renderData, display));\n\
  }\n\
\n\
  return labelAnchors;\n\
\n\
};\n\
\n\
RenderedEdge.prototype.getLabelTextArray = function() {\n\
  var textArray = [];\n\
  each(this.patterns, function(pattern) {\n\
    var shortName = pattern.route.route_short_name;\n\
    if(textArray.indexOf(shortName) === -1) textArray.push(shortName);\n\
  });\n\
  return textArray;\n\
};*/\n\
\n\
RenderedEdge.prototype.toString = function() {\n\
  return 'RenderedEdge ' + this.id + ' type=' + this.type + ' on ' + this.graphEdge\n\
    .toString();\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/renderer/renderededge.js"
));
require.register("conveyal-transitive.js/lib/renderer/renderedsegment.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require('d3');\n\
var each = require('each');\n\
\n\
var interpolateLine = require('../util/interpolate-line');\n\
\n\
/**\n\
 * Expose `RenderedSegment`\n\
 */\n\
\n\
module.exports = RenderedSegment;\n\
\n\
var rSegmentId = 0;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function RenderedSegment(pathSegment) {\n\
  this.id = rSegmentId++;\n\
  this.renderedEdges = [];\n\
  this.pathSegment = pathSegment;\n\
  if (pathSegment) this.type = pathSegment.type;\n\
  this.focused = true;\n\
}\n\
\n\
RenderedSegment.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
RenderedSegment.prototype.getType = function() {\n\
  return this.type;\n\
};\n\
\n\
RenderedSegment.prototype.addRenderedEdge = function(rEdge) {\n\
  this.renderedEdges.push(rEdge);\n\
};\n\
\n\
RenderedSegment.prototype.render = function(display) {\n\
\n\
  this.line = d3.svg.line() // the line translation function\n\
  .x(function(data, i) {\n\
    return data.x;\n\
  })\n\
    .y(function(data, i) {\n\
      return data.y;\n\
    })\n\
    .interpolate(interpolateLine.bind({\n\
      segment: this,\n\
      display: display\n\
    }));\n\
\n\
  this.svgGroup = display.svg.append('g');\n\
\n\
  this.lineSvg = this.svgGroup.append('g')\n\
    .attr('class', 'transitive-sortable')\n\
    .datum({\n\
      owner: this,\n\
      sortableType: 'SEGMENT'\n\
    });\n\
\n\
  this.labelSvg = this.svgGroup.append('g');\n\
\n\
  this.lineGraph = this.lineSvg.append('path');\n\
\n\
  this.lineGraph\n\
    .attr('class', 'transitive-line')\n\
    .data([this]);\n\
\n\
  this.lineGraphFront = this.lineSvg.append('path');\n\
\n\
  this.lineGraphFront\n\
    .attr('class', 'transitive-line-front')\n\
    .data([this]);\n\
\n\
  if (display.haloLayer) {\n\
    this.lineGraphHalo = display.haloLayer.append('path');\n\
\n\
    this.lineGraphHalo\n\
      .attr('class', 'transitive-line-halo')\n\
      .data([this]);\n\
  }\n\
};\n\
\n\
RenderedSegment.prototype.refresh = function(display, renderData) {\n\
\n\
  if (renderData) {\n\
    this.renderData = renderData;\n\
  } else {\n\
    this.renderData = [];\n\
    each(this.renderedEdges, function(rEdge) {\n\
      this.renderData = this.renderData.concat(rEdge.renderData);\n\
    }, this);\n\
  }\n\
\n\
  var lineData = this.line(this.renderData);\n\
  this.lineGraph.attr('d', lineData);\n\
  this.lineGraphFront.attr('d', lineData);\n\
  if (this.lineGraphHalo) this.lineGraphHalo.attr('d', lineData);\n\
  display.styler.renderSegment(display, this);\n\
};\n\
\n\
RenderedSegment.prototype.setFocused = function(focused) {\n\
  this.focused = focused;\n\
};\n\
\n\
RenderedSegment.prototype.isFocused = function() {\n\
  return this.focused;\n\
};\n\
\n\
RenderedSegment.prototype.runFocusTransition = function(display, callback) {\n\
  var newColor = display.styler.compute(display.styler.segments.stroke, display,\n\
    this);\n\
  this.lineGraph.transition().style('stroke', newColor).call(callback);\n\
};\n\
\n\
RenderedSegment.prototype.getZIndex = function() {\n\
  return this.zIndex;\n\
};\n\
\n\
RenderedSegment.prototype.computeLineWidth = function(display, includeEnvelope) {\n\
  var styler = display.styler;\n\
  if (styler && display) {\n\
    // compute the line width\n\
    var env = styler.compute(styler.segments.envelope, display, this);\n\
    if (env && includeEnvelope) {\n\
      return parseFloat(env.substring(0, env.length - 2), 10) - 2;\n\
    } else {\n\
      var lw = styler.compute(styler.segments['stroke-width'], display, this);\n\
      return parseFloat(lw.substring(0, lw.length - 2), 10) - 2;\n\
    }\n\
  }\n\
};\n\
\n\
RenderedSegment.prototype.compareTo = function(other) {\n\
\n\
  // show transit segments in front of other types\n\
  if (this.type === 'TRANSIT' && other.type !== 'TRANSIT') return -1;\n\
  if (other.type === 'TRANSIT' && this.type !== 'TRANSIT') return 1;\n\
\n\
  if (this.type === 'TRANSIT' && other.type === 'TRANSIT') {\n\
\n\
    // for two transit segments, try sorting transit mode first\n\
    if (this.mode && other.mode && this.mode !== other.mode) {\n\
      return (this.mode > other.mode);\n\
    }\n\
\n\
    // for two transit segments of the same mode, sort by id (for display consistency)\n\
    return (this.getId() < other.getId());\n\
  }\n\
};\n\
\n\
RenderedSegment.prototype.getLabelTextArray = function() {\n\
  var textArray = [];\n\
  each(this.patterns, function(pattern) {\n\
    var shortName = pattern.route.route_short_name;\n\
    if (textArray.indexOf(shortName) === -1) textArray.push(shortName);\n\
  });\n\
  return textArray;\n\
};\n\
\n\
RenderedSegment.prototype.getLabelAnchors = function(display, spacing) {\n\
\n\
  var labelAnchors = [];\n\
  this.computeRenderLength(display);\n\
  var anchorCount = Math.floor(this.renderLength / spacing);\n\
  var pctSpacing = spacing / this.renderLength;\n\
\n\
  for (var i = 0; i < anchorCount; i++) {\n\
    var t = (i % 2 === 0) ?\n\
      0.5 + (i / 2) * pctSpacing :\n\
      0.5 - ((i + 1) / 2) * pctSpacing;\n\
    var coord = this.coordAlongRenderedPath(t, display);\n\
    if (coord) labelAnchors.push(coord);\n\
  }\n\
\n\
  return labelAnchors;\n\
};\n\
\n\
RenderedSegment.prototype.coordAlongRenderedPath = function(t, display) {\n\
  var loc = t * this.renderLength;\n\
\n\
  var cur = 0;\n\
  for (var i = 0; i < this.renderedEdges.length; i++) {\n\
    var rEdge = this.renderedEdges[i];\n\
    var edgeRenderLen = rEdge.graphEdge.getRenderLength(display);\n\
    if (loc <= cur + edgeRenderLen) {\n\
      var t2 = (loc - cur) / edgeRenderLen;\n\
      return rEdge.graphEdge.coordAlongEdge(t2, rEdge.renderData, display);\n\
    }\n\
    cur += edgeRenderLen;\n\
  }\n\
\n\
};\n\
\n\
RenderedSegment.prototype.computeRenderLength = function(display) {\n\
  this.renderLength = 0;\n\
  each(this.renderedEdges, function(rEdge) {\n\
    this.renderLength += rEdge.graphEdge.getRenderLength(display);\n\
  }, this);\n\
};\n\
\n\
RenderedSegment.prototype.getLegendType = function() {\n\
  if (this.type === 'TRANSIT') {\n\
    return this.type + '_' + this.mode;\n\
  }\n\
  return this.type;\n\
};\n\
\n\
RenderedSegment.prototype.toString = function() {\n\
  return 'RenderedSegment ' + this.id + ' on ' + this.pathSegment.toString();\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/renderer/renderedsegment.js"
));
require.register("conveyal-transitive.js/lib/util/index.js", Function("exports, require, module",
"/**\n\
 * General Transitive utilities library\n\
 */\n\
\n\
var d3 = require('d3');\n\
\n\
var tolerance = 0.000001;\n\
\n\
module.exports.fuzzyEquals = function(a, b, tol) {\n\
  tol = tol || tolerance;\n\
  return Math.abs(a - b) < tol;\n\
};\n\
\n\
module.exports.distance = function(x1, y1, x2, y2) {\n\
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));\n\
};\n\
\n\
module.exports.getRadiusFromAngleChord = function(angleR, chordLen) {\n\
  return (chordLen / 2) / Math.sin(angleR / 2);\n\
};\n\
\n\
/*\n\
 * CCW utility function. Accepts 3 coord pairs; result is positive if points\n\
 * have counterclockwise orientation, negative if clockwise, 0 if collinear.\n\
 */\n\
\n\
module.exports.ccw = function(ax, ay, bx, by, cx, cy) {\n\
  var raw = module.exports.ccwRaw(ax, ay, bx, by, cx, cy);\n\
  return (raw === 0) ? 0 : raw / Math.abs(raw);\n\
};\n\
\n\
module.exports.ccwRaw = function(ax, ay, bx, by, cx, cy) {\n\
  return (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);\n\
};\n\
\n\
/*\n\
 * Compute angle formed by three points in cartesian plane using law of cosines\n\
 */\n\
\n\
module.exports.angleFromThreePoints = function(ax, ay, bx, by, cx, cy) {\n\
  var c = module.exports.distance(ax, ay, bx, by);\n\
  var a = module.exports.distance(bx, by, cx, cy);\n\
  var b = module.exports.distance(ax, ay, cx, cy);\n\
  return Math.acos((a * a + c * c - b * b) / (2 * a * c));\n\
};\n\
\n\
module.exports.pointAlongArc = function(x1, y1, x2, y2, r, theta, ccw, t) {\n\
  ccw = Math.abs(ccw) / ccw; // convert to 1 or -1\n\
\n\
  var rot = Math.PI / 2 - Math.abs(theta) / 2;\n\
  var vectToCenter = module.exports.normalizeVector(module.exports.rotateVector({\n\
    x: x2 - x1,\n\
    y: y2 - y1\n\
  }, ccw * rot));\n\
\n\
  // calculate the center of the arc circle\n\
  var cx = x1 + r * vectToCenter.x;\n\
  var cy = y1 + r * vectToCenter.y;\n\
\n\
  var vectFromCenter = module.exports.negateVector(vectToCenter);\n\
  rot = Math.abs(theta) * t * ccw;\n\
  vectFromCenter = module.exports.normalizeVector(module.exports.rotateVector(\n\
    vectFromCenter, rot));\n\
\n\
  return {\n\
    x: cx + r * vectFromCenter.x,\n\
    y: cy + r * vectFromCenter.y\n\
  };\n\
\n\
};\n\
\n\
module.exports.getVectorAngle = function(x, y) {\n\
  var t = Math.atan(y / x);\n\
\n\
  if (x < 0 && t <= 0) t += Math.PI;\n\
  else if (x < 0 && t >= 0) t -= Math.PI;\n\
\n\
  return t;\n\
};\n\
\n\
module.exports.rayIntersection = function(ax, ay, avx, avy, bx, by, bvx, bvy) {\n\
  var u = ((by - ay) * bvx - (bx - ax) * bvy) / (bvx * avy - bvy * avx);\n\
  var v = ((by - ay) * avx - (bx - ax) * avy) / (bvx * avy - bvy * avx);\n\
\n\
  return {\n\
    u: u,\n\
    v: v,\n\
    intersect: (u > -tolerance && v > -tolerance)\n\
  };\n\
};\n\
\n\
module.exports.lineIntersection = function(x1, y1, x2, y2, x3, y3, x4, y4) {\n\
\n\
  var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);\n\
\n\
  if (d === 0) { // lines are parallel\n\
    return {\n\
      intersect: false\n\
    };\n\
  }\n\
\n\
  return {\n\
    x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d,\n\
    y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d,\n\
    intersect: true\n\
  };\n\
};\n\
\n\
/**\n\
 * Parse a pixel-based style descriptor, returning an number.\n\
 *\n\
 * @param {String/Number}\n\
 */\n\
\n\
module.exports.parsePixelStyle = function(descriptor) {\n\
  if (typeof descriptor === 'number') return descriptor;\n\
  return parseFloat(descriptor.substring(0, descriptor.length - 2), 10);\n\
};\n\
\n\
module.exports.isOutwardVector = function(vector) {\n\
  if (!module.exports.fuzzyEquals(vector.x, 0)) return (vector.x > 0);\n\
  return (vector.y > 0);\n\
};\n\
\n\
module.exports.getTextBBox = function(text, attrs) {\n\
  var container = d3.select('body').append('svg');\n\
  container.append('text')\n\
    .attr({\n\
      x: -1000,\n\
      y: -1000\n\
    })\n\
    .attr(attrs)\n\
    .text(text);\n\
  var bbox = container.node().getBBox();\n\
  container.remove();\n\
\n\
  return {\n\
    height: bbox.height,\n\
    width: bbox.width\n\
  };\n\
};\n\
\n\
/**\n\
 * Convert lat/lon coords to spherical mercator meter x/y coords\n\
 */\n\
\n\
module.exports.latLonToSphericalMercator = function(lat, lon) {\n\
  var r = 6378137;\n\
  var x = r * lon * Math.PI / 180;\n\
  var y = r * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));\n\
  return [x, y];\n\
};\n\
\n\
/**\n\
 * vector utilities\n\
 */\n\
\n\
module.exports.normalizeVector = function(v) {\n\
  var d = Math.sqrt(v.x * v.x + v.y * v.y);\n\
  return {\n\
    x: v.x / d,\n\
    y: v.y / d\n\
  };\n\
};\n\
\n\
module.exports.rotateVector = function(v, theta) {\n\
  return {\n\
    x: v.x * Math.cos(theta) - v.y * Math.sin(theta),\n\
    y: v.x * Math.sin(theta) + v.y * Math.cos(theta)\n\
  };\n\
};\n\
\n\
module.exports.negateVector = function(v) {\n\
  return {\n\
    x: -v.x,\n\
    y: -v.y\n\
  };\n\
};\n\
\n\
module.exports.addVectors = function(v1, v2) {\n\
  return {\n\
    x: v1.x + v2.x,\n\
    y: v1.y + v2.y\n\
  };\n\
};\n\
\n\
/**\n\
 * GTFS utilities\n\
 */\n\
\n\
module.exports.otpModeToGtfsType = function(otpMode) {\n\
  switch (otpMode) {\n\
    case \"TRAM\":\n\
      return 0;\n\
    case \"SUBWAY\":\n\
      return 1;\n\
    case \"RAIL\":\n\
      return 2;\n\
    case \"BUS\":\n\
      return 3;\n\
    case \"FERRY\":\n\
      return 4;\n\
    case \"CABLE_CAR\":\n\
      return 5;\n\
    case \"GONDOLA\":\n\
      return 6;\n\
    case \"FUNICULAR\":\n\
      return 7;\n\
  }\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/util/index.js"
));
require.register("conveyal-transitive.js/lib/util/spherical-mercator.js", Function("exports, require, module",
"var SphericalMercator = (function() {\n\
\n\
  // Closures including constants and other precalculated values.\n\
  var cache = {},\n\
    EPSLN = 1.0e-10,\n\
    D2R = Math.PI / 180,\n\
    R2D = 180 / Math.PI,\n\
    // 900913 properties.\n\
    A = 6378137,\n\
    MAXEXTENT = 20037508.34;\n\
\n\
  // SphericalMercator constructor: precaches calculations\n\
  // for fast tile lookups.\n\
  function SphericalMercator(options) {\n\
    options = options || {};\n\
    this.size = options.size || 256;\n\
    if (!cache[this.size]) {\n\
      var size = this.size;\n\
      var c = cache[this.size] = {};\n\
      c.Bc = [];\n\
      c.Cc = [];\n\
      c.zc = [];\n\
      c.Ac = [];\n\
      for (var d = 0; d < 30; d++) {\n\
        c.Bc.push(size / 360);\n\
        c.Cc.push(size / (2 * Math.PI));\n\
        c.zc.push(size / 2);\n\
        c.Ac.push(size);\n\
        size *= 2;\n\
      }\n\
    }\n\
    this.Bc = cache[this.size].Bc;\n\
    this.Cc = cache[this.size].Cc;\n\
    this.zc = cache[this.size].zc;\n\
    this.Ac = cache[this.size].Ac;\n\
  }\n\
\n\
  // Convert lon lat to screen pixel value\n\
  //\n\
  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.\n\
  // - `zoom` {Number} zoom level.\n\
  SphericalMercator.prototype.px = function(ll, zoom) {\n\
    var d = this.zc[zoom];\n\
    var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);\n\
    var x = Math.round(d + ll[0] * this.Bc[zoom]);\n\
    var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * (-this.Cc[\n\
      zoom]));\n\
    if (x > this.Ac[zoom]) x = this.Ac[zoom];\n\
    if (y > this.Ac[zoom]) y = this.Ac[zoom];\n\
    //(x < 0) && (x = 0);\n\
    //(y < 0) && (y = 0);\n\
    return [x, y];\n\
  };\n\
\n\
  // Convert screen pixel value to lon lat\n\
  //\n\
  // - `px` {Array} `[x, y]` array of geographic coordinates.\n\
  // - `zoom` {Number} zoom level.\n\
  SphericalMercator.prototype.ll = function(px, zoom) {\n\
    var g = (px[1] - this.zc[zoom]) / (-this.Cc[zoom]);\n\
    var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];\n\
    var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);\n\
    return [lon, lat];\n\
  };\n\
\n\
  // Convert tile xyz value to bbox of the form `[w, s, e, n]`\n\
  //\n\
  // - `x` {Number} x (longitude) number.\n\
  // - `y` {Number} y (latitude) number.\n\
  // - `zoom` {Number} zoom.\n\
  // - `tms_style` {Boolean} whether to compute using tms-style.\n\
  // - `srs` {String} projection for resulting bbox (WGS84|900913).\n\
  // - `return` {Array} bbox array of values in form `[w, s, e, n]`.\n\
  SphericalMercator.prototype.bbox = function(x, y, zoom, tms_style, srs) {\n\
    // Convert xyz into bbox with srs WGS84\n\
    if (tms_style) {\n\
      y = (Math.pow(2, zoom) - 1) - y;\n\
    }\n\
    // Use +y to make sure it's a number to avoid inadvertent concatenation.\n\
    var ll = [x * this.size, (+y + 1) * this.size]; // lower left\n\
    // Use +x to make sure it's a number to avoid inadvertent concatenation.\n\
    var ur = [(+x + 1) * this.size, y * this.size]; // upper right\n\
    var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));\n\
\n\
    // If web mercator requested reproject to 900913.\n\
    if (srs === '900913') {\n\
      return this.convert(bbox, '900913');\n\
    } else {\n\
      return bbox;\n\
    }\n\
  };\n\
\n\
  // Convert bbox to xyx bounds\n\
  //\n\
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.\n\
  // - `zoom` {Number} zoom.\n\
  // - `tms_style` {Boolean} whether to compute using tms-style.\n\
  // - `srs` {String} projection of input bbox (WGS84|900913).\n\
  // - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.\n\
  SphericalMercator.prototype.xyz = function(bbox, zoom, tms_style, srs) {\n\
    // If web mercator provided reproject to WGS84.\n\
    if (srs === '900913') {\n\
      bbox = this.convert(bbox, 'WGS84');\n\
    }\n\
\n\
    var ll = [bbox[0], bbox[1]]; // lower left\n\
    var ur = [bbox[2], bbox[3]]; // upper right\n\
    var px_ll = this.px(ll, zoom);\n\
    var px_ur = this.px(ur, zoom);\n\
    // Y = 0 for XYZ is the top hence minY uses px_ur[1].\n\
    var bounds = {\n\
      minX: Math.floor(px_ll[0] / this.size),\n\
      minY: Math.floor(px_ur[1] / this.size),\n\
      maxX: Math.floor((px_ur[0] - 1) / this.size),\n\
      maxY: Math.floor((px_ll[1] - 1) / this.size)\n\
    };\n\
    if (tms_style) {\n\
      var tms = {\n\
        minY: (Math.pow(2, zoom) - 1) - bounds.maxY,\n\
        maxY: (Math.pow(2, zoom) - 1) - bounds.minY\n\
      };\n\
      bounds.minY = tms.minY;\n\
      bounds.maxY = tms.maxY;\n\
    }\n\
    return bounds;\n\
  };\n\
\n\
  // Convert projection of given bbox.\n\
  //\n\
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.\n\
  // - `to` {String} projection of output bbox (WGS84|900913). Input bbox\n\
  //   assumed to be the \"other\" projection.\n\
  // - `@return` {Object} bbox with reprojected coordinates.\n\
  SphericalMercator.prototype.convert = function(bbox, to) {\n\
    if (to === '900913') {\n\
      return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(\n\
        2,\n\
        4)));\n\
    } else {\n\
      return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(\n\
        2,\n\
        4)));\n\
    }\n\
  };\n\
\n\
  // Convert lon/lat values to 900913 x/y.\n\
  SphericalMercator.prototype.forward = function(ll) {\n\
    var xy = [\n\
      A * ll[0] * D2R,\n\
      A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * ll[1] * D2R)))\n\
    ];\n\
    // if xy value is beyond maxextent (e.g. poles), return maxextent.\n\
    if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT;\n\
    if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT;\n\
    if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;\n\
    if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;\n\
    return xy;\n\
  };\n\
\n\
  // Convert 900913 x/y values to lon/lat.\n\
  SphericalMercator.prototype.inverse = function(xy) {\n\
    return [\n\
      (xy[0] * R2D / A), ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-xy[\n\
          1] /\n\
        A))) * R2D\n\
    ];\n\
  };\n\
\n\
  return SphericalMercator;\n\
\n\
})();\n\
\n\
if (typeof module !== 'undefined' && typeof exports !== 'undefined') {\n\
  module.exports = exports = SphericalMercator;\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/util/spherical-mercator.js"
));
require.register("conveyal-transitive.js/lib/util/interpolate-line.js", Function("exports, require, module",
"/**\n\
 * Line interpolation utility function\n\
 *\n\
 * @param {Array} points\n\
 */\n\
\n\
var Util = require('./index');\n\
\n\
module.exports = function(points) {\n\
  var newPoints, i, r;\n\
\n\
  // determine if we need to resample the path (i.e. place new points at a regular\n\
  // interval for marker-based styling) based on styler settings\n\
  var resampleSpacing = this.display.styler.compute(this.display.styler.segments[\n\
    'marker-spacing'], this.display, this.segment);\n\
\n\
  // handle the case of a simple straight line\n\
  if (points.length === 2) {\n\
    if (resampleSpacing) {\n\
      newPoints = [points[0]];\n\
      newPoints = newPoints.concat(resampleLine(points[0], points[1],\n\
        resampleSpacing));\n\
      return newPoints.join(' ');\n\
    }\n\
    return points.join(' ');\n\
  }\n\
\n\
  // otherwise, assume a curved segment\n\
\n\
  if (resampleSpacing) {\n\
    newPoints = [points[0]];\n\
    for (i = 1; i < points.length; i++) {\n\
      if (this.segment.renderData[i].arc) {\n\
        //console.log(this.renderData[i]);\n\
        //var r = this.renderData[i].radius;\n\
        //var sweep = (this.renderData[i].arc > 0) ? 0 : 1;\n\
        //str += 'A ' + r + ',' + r + ' 0 0 ' + sweep + ' ' + points[i];\n\
        r = this.segment.renderData[i].radius;\n\
        var theta = this.segment.renderData[i].arc * Math.PI / 180;\n\
        newPoints = newPoints.concat(resampleArc(points[i - 1], points[i], r,\n\
          theta, -this.segment.renderData[i].arc, resampleSpacing));\n\
\n\
      } else {\n\
        newPoints = newPoints.concat(resampleLine(points[i - 1], points[i],\n\
          resampleSpacing));\n\
      }\n\
    }\n\
    return newPoints.join(' ');\n\
  } else {\n\
    var str = points[0];\n\
    for (i = 1; i < points.length; i++) {\n\
      if (this.segment.renderData[i].arc) {\n\
        r = this.segment.renderData[i].radius;\n\
        var sweep = (this.segment.renderData[i].arc > 0) ? 0 : 1;\n\
        str += 'A ' + r + ',' + r + ' 0 0 ' + sweep + ' ' + points[i];\n\
      } else {\n\
        str += 'L' + points[i];\n\
      }\n\
    }\n\
    return str;\n\
  }\n\
};\n\
\n\
function resampleLine(startPt, endPt, spacing) {\n\
  var dx = endPt[0] - startPt[0];\n\
  var dy = endPt[1] - startPt[1];\n\
  var len = Math.sqrt(dx * dx + dy * dy);\n\
\n\
  var sampledPts = [startPt];\n\
  for (var l = spacing; l < len; l += spacing) {\n\
    var t = l / len;\n\
    sampledPts.push([startPt[0] + t * dx, startPt[1] + t * dy]);\n\
  }\n\
\n\
  sampledPts.push(endPt);\n\
\n\
  return sampledPts;\n\
}\n\
\n\
function resampleArc(startPt, endPt, r, theta, ccw, spacing) {\n\
  var len = r * Math.abs(theta);\n\
\n\
  var sampledPts = [];\n\
  for (var l = spacing; l < len; l += spacing) {\n\
    var t = l / len;\n\
    var pt = Util.pointAlongArc(startPt[0], startPt[1], endPt[0], endPt[1], r,\n\
      Math.abs(theta), ccw, t);\n\
    sampledPts.push([pt.x, pt.y]);\n\
  }\n\
\n\
  return sampledPts;\n\
\n\
}\n\
//@ sourceURL=conveyal-transitive.js/lib/util/interpolate-line.js"
));
require.register("conveyal-transitive.js/lib/util/polyline.js", Function("exports, require, module",
"module.exports.decode = function(polyline) {\n\
\n\
  var currentPosition = 0;\n\
\n\
  var currentLat = 0;\n\
  var currentLng = 0;\n\
\n\
  var dataLength = polyline.length;\n\
\n\
  var polylineLatLngs = [];\n\
\n\
  while (currentPosition < dataLength) {\n\
\n\
    var shift = 0;\n\
    var result = 0;\n\
\n\
    var byte;\n\
\n\
    do {\n\
      byte = polyline.charCodeAt(currentPosition++) - 63;\n\
      result |= (byte & 0x1f) << shift;\n\
      shift += 5;\n\
    } while (byte >= 0x20);\n\
\n\
    var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));\n\
    currentLat += deltaLat;\n\
\n\
    shift = 0;\n\
    result = 0;\n\
\n\
    do {\n\
      byte = polyline.charCodeAt(currentPosition++) - 63;\n\
      result |= (byte & 0x1f) << shift;\n\
      shift += 5;\n\
    } while (byte >= 0x20);\n\
\n\
    var deltLng = ((result & 1) ? ~(result >> 1) : (result >> 1));\n\
\n\
    currentLng += deltLng;\n\
\n\
    polylineLatLngs.push([currentLat * 0.00001, currentLng * 0.00001]);\n\
  }\n\
  return polylineLatLngs;\n\
};\n\
//@ sourceURL=conveyal-transitive.js/lib/util/polyline.js"
));
require.register("conveyal-leaflet.transitivelayer/TransitiveLayer.js", Function("exports, require, module",
"L.TransitiveLayer = module.exports = L.Class.extend({\n\
\n\
  initialize: function(transitive, options) {\n\
    this._transitive = transitive;\n\
  },\n\
\n\
  onAdd: function(map) {\n\
    this._map = map;\n\
\n\
    this._initContainer();\n\
\n\
    map.on(\"moveend\", this._refresh, this);\n\
    map.on(\"zoomend\", this._refresh, this);\n\
    map.on(\"drag\", this._refresh, this);\n\
    map.on(\"resize\", this._resize, this);\n\
\n\
    this._transitive.options.zoomEnabled = false;\n\
    this._transitive.options.autoResize = false;\n\
    this._transitive.setElement(this._container);\n\
    this._transitive.render();\n\
\n\
    var self = this;\n\
    this._transitive.on('clear data', function() {\n\
      self._refresh();\n\
    });\n\
\n\
    this._transitive.on('update data', function() {\n\
      self._transitive.render();\n\
      self._refresh();\n\
    });\n\
  },\n\
\n\
  onRemove: function(map) {\n\
    map.getPanes().overlayPane.removeChild(this._container);\n\
    map.off(\"moveend\", this._refresh, this);\n\
    map.off(\"zoomend\", this._refresh, this);\n\
    map.off(\"drag\", this._refresh, this);\n\
    map.off(\"resize\", this._resize, this);\n\
  },\n\
\n\
  getBounds: function() {\n\
    var bounds = this._transitive.getNetworkBounds();\n\
    if(!bounds) return null;\n\
    return new L.LatLngBounds([bounds[0][1], bounds[0][0]],[bounds[1][1], bounds[1][0]]);\n\
  },\n\
\n\
  _initContainer: function() {\n\
    this._container = L.DomUtil.create('div', 'leaflet-transitive-container', this._map.getPanes().overlayPane);\n\
    this._container.style.position = 'absolute';\n\
    this._container.style.width = this._map.getSize().x + \"px\";\n\
    this._container.style.height = this._map.getSize().y + \"px\";\n\
  },\n\
\n\
  _refresh: function() {\n\
    var bounds = this._map.getBounds();\n\
    var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());\n\
    L.DomUtil.setPosition(this._container, topLeft);\n\
    this._transitive.setDisplayBounds([\n\
      [bounds.getWest(), bounds.getSouth()],\n\
      [bounds.getEast(), bounds.getNorth()]\n\
    ]);\n\
  },\n\
\n\
  _resize: function(data) {\n\
    this._transitive.resize(data.newSize.x, data.newSize.y);\n\
    this._refresh();\n\
  }\n\
\n\
});\n\
\n\
L.transitiveLayer = function(transitive, options) {\n\
  return new L.TransitiveLayer(transitive, options);\n\
};//@ sourceURL=conveyal-leaflet.transitivelayer/TransitiveLayer.js"
));
require.register("leaflet-transitivelayer-example/index.js", Function("exports, require, module",
"var Transitive = require('transitive');\n\
L.TransitiveLayer = require('Leaflet.TransitiveLayer');\n\
\n\
// set some Leaflet map configuration properties\n\
var config = {\n\
    tileUrl : 'http://{s}.tiles.mapbox.com/v3/conveyal.ie3o67m0/{z}/{x}/{y}.png',\n\
    initLatLng : new L.LatLng(38.903324,-77.04448), // DC\n\
    initZoom : 13\n\
};\n\
\n\
// set up the leaflet map, disabling inertia and zoom animation\n\
var map = L.map('map', {\n\
  inertia: false,\n\
  zoomAnimation: false\n\
});\n\
\n\
// add the base TileLayer\n\
map.addLayer(new L.TileLayer(config.tileUrl));\n\
\n\
// create the Transitive instance\n\
var transitive = new Transitive({\n\
  data: DATA,\n\
  useDynamicRendering: true,\n\
  draggableTypes: ['PLACE']\n\
});\n\
\n\
// create and add the Transitive layer to the map\n\
var transitiveLayer = new L.TransitiveLayer(transitive);\n\
map.addLayer(transitiveLayer);\n\
\n\
// set the initial map view\n\
map.setView(config.initLatLng, config.initZoom);\n\
\n\
// set up the demo clear/load controls\n\
document.getElementById(\"clear\").onclick = function(event) {\n\
  transitive.clearData();\n\
};\n\
\n\
document.getElementById(\"load\").onclick = function(event) {\n\
  transitive.updateData(DATA);\n\
  map.fitBounds(transitiveLayer.getBounds());\n\
};\n\
//@ sourceURL=leaflet-transitivelayer-example/index.js"
));




















require.alias("conveyal-transitive.js/lib/graph/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/graph/index.js");
require.alias("conveyal-transitive.js/lib/graph/edge.js", "leaflet-transitivelayer-example/deps/transitive/lib/graph/edge.js");
require.alias("conveyal-transitive.js/lib/graph/edgegroup.js", "leaflet-transitivelayer-example/deps/transitive/lib/graph/edgegroup.js");
require.alias("conveyal-transitive.js/lib/graph/vertex.js", "leaflet-transitivelayer-example/deps/transitive/lib/graph/vertex.js");
require.alias("conveyal-transitive.js/lib/styler/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/styler/index.js");
require.alias("conveyal-transitive.js/lib/styler/styles.js", "leaflet-transitivelayer-example/deps/transitive/lib/styler/styles.js");
require.alias("conveyal-transitive.js/lib/point/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/index.js");
require.alias("conveyal-transitive.js/lib/point/stop.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/stop.js");
require.alias("conveyal-transitive.js/lib/point/place.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/place.js");
require.alias("conveyal-transitive.js/lib/point/multipoint.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/multipoint.js");
require.alias("conveyal-transitive.js/lib/point/turn.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/turn.js");
require.alias("conveyal-transitive.js/lib/point/pointcluster.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/pointcluster.js");
require.alias("conveyal-transitive.js/lib/point/pointclustermap.js", "leaflet-transitivelayer-example/deps/transitive/lib/point/pointclustermap.js");
require.alias("conveyal-transitive.js/lib/labeler/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/labeler/index.js");
require.alias("conveyal-transitive.js/lib/labeler/label.js", "leaflet-transitivelayer-example/deps/transitive/lib/labeler/label.js");
require.alias("conveyal-transitive.js/lib/labeler/pointlabel.js", "leaflet-transitivelayer-example/deps/transitive/lib/labeler/pointlabel.js");
require.alias("conveyal-transitive.js/lib/labeler/segmentlabel.js", "leaflet-transitivelayer-example/deps/transitive/lib/labeler/segmentlabel.js");
require.alias("conveyal-transitive.js/lib/labeler/labeledgegroup.js", "leaflet-transitivelayer-example/deps/transitive/lib/labeler/labeledgegroup.js");
require.alias("conveyal-transitive.js/lib/display/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/display/index.js");
require.alias("conveyal-transitive.js/lib/display/legend.js", "leaflet-transitivelayer-example/deps/transitive/lib/display/legend.js");
require.alias("conveyal-transitive.js/lib/display/draw-grid.js", "leaflet-transitivelayer-example/deps/transitive/lib/display/draw-grid.js");
require.alias("conveyal-transitive.js/lib/display/tile-layer.js", "leaflet-transitivelayer-example/deps/transitive/lib/display/tile-layer.js");
require.alias("conveyal-transitive.js/lib/display/d3.geo.tile.js", "leaflet-transitivelayer-example/deps/transitive/lib/display/d3.geo.tile.js");
require.alias("conveyal-transitive.js/lib/core/path.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/path.js");
require.alias("conveyal-transitive.js/lib/core/pathsegment.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/pathsegment.js");
require.alias("conveyal-transitive.js/lib/core/pattern.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/pattern.js");
require.alias("conveyal-transitive.js/lib/core/patterngroup.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/patterngroup.js");
require.alias("conveyal-transitive.js/lib/core/route.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/route.js");
require.alias("conveyal-transitive.js/lib/core/journey.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/journey.js");
require.alias("conveyal-transitive.js/lib/core/network.js", "leaflet-transitivelayer-example/deps/transitive/lib/core/network.js");
require.alias("conveyal-transitive.js/lib/transitive.js", "leaflet-transitivelayer-example/deps/transitive/lib/transitive.js");
require.alias("conveyal-transitive.js/lib/renderer/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/renderer/index.js");
require.alias("conveyal-transitive.js/lib/renderer/renderededge.js", "leaflet-transitivelayer-example/deps/transitive/lib/renderer/renderededge.js");
require.alias("conveyal-transitive.js/lib/renderer/renderedsegment.js", "leaflet-transitivelayer-example/deps/transitive/lib/renderer/renderedsegment.js");
require.alias("conveyal-transitive.js/lib/util/index.js", "leaflet-transitivelayer-example/deps/transitive/lib/util/index.js");
require.alias("conveyal-transitive.js/lib/util/spherical-mercator.js", "leaflet-transitivelayer-example/deps/transitive/lib/util/spherical-mercator.js");
require.alias("conveyal-transitive.js/lib/util/interpolate-line.js", "leaflet-transitivelayer-example/deps/transitive/lib/util/interpolate-line.js");
require.alias("conveyal-transitive.js/lib/util/polyline.js", "leaflet-transitivelayer-example/deps/transitive/lib/util/polyline.js");
require.alias("conveyal-transitive.js/lib/transitive.js", "leaflet-transitivelayer-example/deps/transitive/index.js");
require.alias("conveyal-transitive.js/lib/transitive.js", "transitive/index.js");
require.alias("component-each/index.js", "conveyal-transitive.js/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

require.alias("component-clone/index.js", "conveyal-transitive.js/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-emitter/index.js", "conveyal-transitive.js/deps/emitter/index.js");

require.alias("mbostock-d3/d3.js", "conveyal-transitive.js/deps/d3/d3.js");
require.alias("mbostock-d3/d3.js", "conveyal-transitive.js/deps/d3/index.js");
require.alias("mbostock-d3/d3.js", "mbostock-d3/index.js");
require.alias("javascript-augment/augment.js", "conveyal-transitive.js/deps/augment/augment.js");
require.alias("javascript-augment/augment.js", "conveyal-transitive.js/deps/augment/index.js");
require.alias("javascript-augment/augment.js", "javascript-augment/index.js");
require.alias("visionmedia-debug/browser.js", "conveyal-transitive.js/deps/debug/browser.js");
require.alias("visionmedia-debug/debug.js", "conveyal-transitive.js/deps/debug/debug.js");
require.alias("visionmedia-debug/browser.js", "conveyal-transitive.js/deps/debug/index.js");
require.alias("guille-ms.js/index.js", "visionmedia-debug/deps/ms/index.js");

require.alias("visionmedia-debug/browser.js", "visionmedia-debug/index.js");
require.alias("yields-svg-attributes/index.js", "conveyal-transitive.js/deps/svg-attributes/index.js");
require.alias("yields-svg-attributes/index.js", "conveyal-transitive.js/deps/svg-attributes/index.js");
require.alias("yields-svg-attributes/index.js", "yields-svg-attributes/index.js");
require.alias("janogonzalez-priorityqueuejs/index.js", "conveyal-transitive.js/deps/priorityqueuejs/index.js");

require.alias("conveyal-transitive.js/lib/transitive.js", "conveyal-transitive.js/index.js");
require.alias("conveyal-leaflet.transitivelayer/TransitiveLayer.js", "leaflet-transitivelayer-example/deps/Leaflet.TransitiveLayer/TransitiveLayer.js");
require.alias("conveyal-leaflet.transitivelayer/TransitiveLayer.js", "leaflet-transitivelayer-example/deps/Leaflet.TransitiveLayer/index.js");
require.alias("conveyal-leaflet.transitivelayer/TransitiveLayer.js", "Leaflet.TransitiveLayer/index.js");
require.alias("conveyal-leaflet.transitivelayer/TransitiveLayer.js", "conveyal-leaflet.transitivelayer/index.js");
require.alias("leaflet-transitivelayer-example/index.js", "leaflet-transitivelayer-example/index.js");