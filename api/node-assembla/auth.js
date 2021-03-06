var logger = require("bole")('assembla-auth');
(function() {

    var _ = require('lodash'), 
    util = require('util'),
        request = require('request'),
    request = require('request');

    var Auth = function(Inherits, args) {
        Inherits(this);

        this.options = {};

        this.authorize = function(res) {
            var url = util.format("https://api.assembla.com/authorization?response_type=code" +
                "&client_id=%s" , args.appId
            );

            return res ? res.redirect(url) : url;
        };

        this.getAccessToken = function(code, callback) {

        //https://_client_id:_client_secret@api.assembla.com/token?grant_type=authorization_code&code=_authorization_code
            var url  = util.format('https://api.assembla.com/token?grant_type=authorization_code&code=%s', code);

            request.post({url: url}, function(err, response, body) {

                if (err){
                    logger.error(err);
                    return callback(err, null);
                }

                var result = JSON.parse(body);

                if (typeof result.error !== 'undefined') {
                    logger.error(result.error);
                    err = new Error(result.error);
                    err.name = result.error;
                    return callback(err, null);
                }

                return callback(null, result);

            }).auth(args.appId, args.appSecret);
        };

        this.setAccessToken = function(accessToken) {
            this.options.accessToken = accessToken;
        };

        this.getOptions = function() {
            return this.options;
        };

        return this;
    }.bind(this);
    module.exports = Auth;
}).call(this);
