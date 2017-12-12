
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
        file: __dirname + '/../config/appConfig.json'
      }).defaults({
        PORT: 3000
      });
      env = (ref = nconf.get('NODE_ENV')) != null ? ref : 'development';
      nconf.set('db:connection', nconf.get("db:" + env));
      nconf.set('db:connection:redshift', (ref1 = nconf.get("db:connection:redshift:" + (nconf.get('portal_behavior')))) != null ? ref1 : {});
      nconf.set('recaptcha:public_key', nconf.get("recaptcha:" + env + ":public_key"));
      nconf.set('recaptcha:private_key', nconf.get("recaptcha:" + env + ":private_key"));

      nconf.set('app:session_secret', nconf.get("app:" + env + ":session_secret"));
      nconf.set('app:cookie_secret', nconf.get("app:" + env + ":cookie_secret"));
      nconf.set('sessions:dynamo_table', nconf.get("sessions:" + env + ":dynamo_table"));
      nconf.set('emails', _.extend(nconf.get('emails'), nconf.get("emails:" + env)));
      nconf.set('dec_builder', _.extend(nconf.get('dec_builder'), nconf.get("dec_builder:" + env)));
      nconf.set('yvolver_api', _.extend(nconf.get('yvolver_api'), nconf.get("yvolver_api:" + env)));
      nconf.set('reporting_api', _.extend(nconf.get('reporting_api'), nconf.get("reporting_api:" + env)));
      nconf.set('sales_force', _.extend(nconf.get('sales_force'), nconf.get("sales_force:" + env), {
        accounts: _.extend(nconf.get('sales_force:accounts'), nconf.get("sales_force:" + env + ":accounts"))
      }));
      nconf.set('metrics_reporting', _.extend(nconf.get('metrics_reporting'), nconf.get("metrics_reporting:" + env)));
      nconf.set('status', _.extend(nconf.get('status'), nconf.get("status:" + env)));
      samlEnv = (ref2 = nconf.get("saml:env")) != null ? ref2 : env;
      nconf.set('saml', _.extend(nconf.get('saml'), nconf.get("saml:" + samlEnv)));
      if (process.platform === 'darwin') {
        nconf.set('saml:enabled', 'false');
      }

      nconf.set('features', _.extend(nconf.get('features'), nconf.get("features:" + env)));
      if (process.platform === 'darwin') {
        nconf.set('db:redis:host', 'localhost');
        nconf.set('db:redis:port', 6379);
      }
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
      nconf.loadConfigForClient = function(user) {
        var config, ref3;
        if (user == null) {
          user = {};
        }
        config = {
          'env': nconf.get('NODE_ENV'),
          'S3': nconf.get('S3'),
          'v': pjson.version,
          'behavior': ((ref3 = nconf.get('portal_behavior')) != null ? ref3 : 'default').toUpperCase(),
          'rollbarConfig': _.defaults({}, nconf.parseTypes('rollbar:client_side'), {
            scrubFields: ['password', 'confirm_password'],
            captureUncaught: false,
            captureUnhandledRejected: false,
            payload: {
              environment: nconf.get('NODE_ENV'),
              portal_behavior: nconf.get('portal_behavior'),
              client: {
                javascript: {
                  source_map_enabled: true,
                  code_version: nconf.get('APP_VERSION')
                }
              },
              person: {
                id: user.id,
                email: user.email,
                authed: user.id != null
              }
            }
          }),
          'rollbar': nconf.parseTypes('rollbar:custom_client_side'),
          saml: {
            enabled: nconf.get('saml:enabled')
          },
          features: nconf.get('features'),
          options: nconf.get('client_options')
        };
        return config;
      };
      module.exports = exports = nconf;
    }

  }).call(this);
