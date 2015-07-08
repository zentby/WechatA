(function() {

    var _ = require('lodash');
    var util = require('util')
        , request = require('request');

    var Main = function(appId, appSecret) {
        var _services = ['mentions', 'spaces', 'tickets', 'users'],
            Inherits = require('./inherits'),
            self = this;

        // Make some configuration;
        this.options = {
            api_url: "https://api.assembla.com/v1/",
            format: 'json'
        };

        this.auth = require('./auth')(Inherits, {
            appId: appId,
            appSecret: appSecret
        });

        this.init = function(config, callback) {
            if (!config) return;
            self.options.accessToken = config.accessToken;
            self.options.refreshToken = config.refreshToken;
            self.options.expire_at = config.expire_at;

            if (self.options.expire_at && Date.parse(self.options.expire_at) < Date.now() - 60 * 1000) {
                self.refreshToken(callback);
            }else{
                callback(null,null);
            }
        };

        this.setup = function(options) {
            options = options || {};
            this.options.timeout = options.timeout;
            this.options.isx = options.IsX || false;
            if (this.options.isx) {
                this.options.xkey = appId;
                this.options.xsecret = appSecret;
            }

            _.forEach(_services, function(service) {
                self[service] = require(__dirname + '/services/' + service)(Inherits, self.options);
            });
            return self;
        };


        this.refreshToken = function(callback) {
            if (!self.options.refreshToken) callback(new Error('No Refresh Token'));
            var url = util.format('https://api.assembla.com/token?grant_type=refresh_token&refresh_token=%s', self.options.refreshToken);

            request.post({
                url: url
            }, function(err, response, body) {

                if (err) {
                    self.options.accessToken = '';
                    self.options.refreshToken = '';
                    logger.error(err);
                    return callback(err, null);
                }

                var result = JSON.parse(body);

                self.options.accessToken = result.accessToken;
                self.options.expire_at = Date.now() + (result.expires_in * 1000);
                callback(null, result);
            }).auth(appId, appSecret);
        };

        return this;
    }.bind(this);

    module.exports = Main;
}).call(this);