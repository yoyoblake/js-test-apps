
/*
  Nconf based configuration
 */

(function() {
    var Provider, _, _parseTypes, env, exports, isPlainObject, nconf, noBrowserifyRequire, ref, ref1, ref2, samlEnv;

    _ = require('underscore');

    isPlainObject = require('lodash/isPlainObject');

    noBrowserifyRequire = require;

    _parseTypes = function(_obj) {
      var _err;
      if (!isPlainObject(_obj)) {
        try {
          return JSON.parse(_obj);
        } catch (error) {
          _err = error;
          return _obj;
        }
      }
      return _.mapObject(_obj, function(_val) {
        return _parseTypes(_val);
      });
    };

    if (process.title.indexOf('node') < 0 && process.title.indexOf('gulp') < 0) {
      if (window.conf == null) {
        window.conf = {};
      }
      window.conf.get = function(key) {
        var getValue, keys;
        keys = key.split(':');
        getValue = function(obj, keys) {
          key = _.first(keys);
          keys = _.rest(keys);
          if (key == null) {
            return obj;
          } else if (obj == null) {
            console.log("Object not defined");
            return null;
          } else {
            return getValue(obj[key], keys);
          }
        };
        return getValue(this, keys);
      };
      window.conf.getBoolean = function(key) {
        var bVal;
        bVal = window.conf.get(key);
        if (_.isBoolean(bVal)) {
          return bVal;
        }
        return bVal === 'true';
      };
      module.exports = exports = window.conf;
    } else {
      Provider = noBrowserifyRequire('nconf').Provider;
      nconf = new Provider;

      nconf.env('__').argv().file({
        file: __dirname + '/Config.json'
      }).defaults({
        PORT: 3000
      });

      // nconf.set('log', nconf.get("log"));

      nconf.getInt = function(key) {
        var intVal;
        intVal = parseInt(nconf.get(key));
        if (_.isFinite(intVal)) {
          return intVal;
        } else {
          return null;
        }
      };
      nconf.getFloat = function(key) {
        var fVal;
        fVal = parseFloat(nconf.get(key));
        if (_.isFinite(fVal)) {
          return fVal;
        } else {
          return null;
        }
      };
      nconf.getBoolean = function(key) {
        var bVal;
        bVal = nconf.get(key);
        if (_.isBoolean(bVal)) {
          return bVal;
        }
        return bVal === 'true';
      };
      nconf.parseTypes = function(key) {
        var oVal;
        oVal = nconf.get(key);
        return _parseTypes(oVal);
      };
      module.exports = exports = nconf;
    }

  }).call(this);
