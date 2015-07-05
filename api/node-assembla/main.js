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

        this.init = function(options) {
            /*
            options = {
                accessToken: '',
                expire_at: date,
                refreshToken: '';
                timeout: 0,
                isx: false
            }
            */


            options = options || {};
            this.options.accessToken = options.accessToken;
            this.options.refreshToken = options.refreshToken;
            this.options.expire_at = options.expire_at;
            this.options.timeout = options.timeout;
            this.options.isx = options.isx || false;
            if (this.options.isx){
                this.options.xkey = appId;
                this.options.xsecret = appSecret;
            }else{
                if (this.options.expire_at && this.options.expire_at>Date.now()-60*1000){
                    this.refreshToken();
                }
            }

            _.forEach(_services, function(service) {
                self[service] = require(__dirname + '/services/' + service)(Inherits, self.options);
            });
            return self;
        }


        this.refreshToken = function (callback) {
            if (!self.options.refreshToken) callback(new Error('No Refresh Token'));
            var url  = util.format('https://api.assembla.com/token?grant_type=refresh_token&refresh_token=%s', self.options.refreshToken);

            request.post({url: url}, function(err, response, body) {

                if (err){
                    self.options.accessToken = '';
                    self.options.refreshToken = '';
                    logger.error(err);
                    return  callback(err);
                }

                var result = body;

                self.options.accessToken = result.accessToken;
                self.options.expire_at = Date.now() + (result.expire_in * 1000);

            }).auth(args.appId, args.appSecret);        
        };

        return this;
    }.bind(this);

    module.exports = Main;
}).call(this);