(function() {

    var _ = require('lodash')
        , util = require('util')
        , request = require('request');

    var Auth = function(Inherits, args) {
        Inherits(this);

        this.options = {};

        this.authorize = function(res) {
            var url = util.format("https://api.assembla.com/authorization?response_type=code" +
                "&client_id=%s" , args.appId
            );

            return res ? res.redirect(url) : url;
        };

        this.getAccessToken = function(res, code, cb) {

            if (typeof res == 'string'){
                cb = code;
                code = res;
                res = null;
            }
        //https://_client_id:_client_secret@api.assembla.com/token?grant_type=authorization_code&code=_authorization_code
            var url  = util.format('https://api.assembla.com/token?grant_type=authorization_code&code=%s', code);

            request.post({url: url}, function(err, response, body) {

                if (err)
                    return cb(err, null);

                var res = JSON.body;

                if (typeof res.error !== 'undefined') {
                    err = new Error(res.error_description);
                    err.name = res.error;
                    return cb(err, null);
                }

                return cb(null, res);

            }).auth(args.appId, args.appSecret);
        };


        this.setAccessToken = function(accessToken) {
            this.options['accessToken'] = accessToken;
        };

        this.getOptions = function() {
            return this.options;
        }

        return this;
    }.bind(this);
    module.exports = Auth;
}).call(this);
