(function() {

    var _ = require('lodash');

    var Main = function(appId, appSecret) {
        var _services = ['mentions', 'spaces', 'tickets', 'users']
            , Inherits = require('./inherits')
            , self = this;

        // Make some configuration;
        this.options = {
            api_url: "https://api.assembla.com/v1/",
            format: 'json'
        };

        this.auth = require('./auth')(Inherits, {
            appId: appId,
            appSecret: appSecret
        });

        this.init = function(accessToken, options) {
            if (typeof accessToken !== 'string'){
                options = accessToken || {};
                accessToken = null;
                options.isx = true;
            }

            this.options.accessToken = accessToken;

            options = options || {};
            this.options.timeout = options.timeout;
            this.options.isx = options.isx || false;
            if (this.options.isx){
                this.options.xkey = appId;
                this.options.xsecret = appSecret;
            }

            _.forEach(_services, function(service) {
                self[service] = require(__dirname + '/services/' + service)(Inherits, self.options);
            });
            return self;
        }

        return this;
    }.bind(this);

    module.exports = Main;
}).call(this);