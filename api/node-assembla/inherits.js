var logger = require("bole")('assembla-service');
(function() {
    var _ = require('lodash')
        , request = require('request')
        , util = require('util')
        , url = require('url');

    var Handler = function(subClass) {
        this.createCall = function(method, path, options, callback) {
            return function(config) {
                if (_.isFunction(options)) {
                    callback = options;
                    options = {};
                }
                path = config.api_url + path + '.json';

                var parameters = {
                    url: path,
                    method: method,
                    qs: options.qs,
                    timeout: config.timeout || 60 * 1000 /* Default to 60sec */
                };
                
                if (options.json) parameters.json = options.json;
                if (config.isx){
                    parameters.headers =  { 'X-Api-Key': config.xkey, 'X-Api-Secret': config.xsecret} ;
                    logger.info('api called:' + JSON.stringify(parameters));
                    request(parameters, function(err, res, body){
                        if (!err && res.statusCode == 200) {
                            return callback(null, JSON.parse(body));
                        } else {
                            logger.error('Code:' + res.statusCode + 'Error:' + err);
                            return callback(err, null);
                        }
                    });
                }else{
                    request(parameters, function(err, res, body) {
                        if (!err && res.statusCode == 200) {
                            return callback(null, JSON.parse(body));
                        } else {
                            logger.error('Code:' + res.statusCode + 'Error:' + err);
                            return callback(err, null);
                        }
                    }).auth(null, null, true, config.accessToken);
                }
            }
        };

        _.merge(subClass, this);
        return this;
    }.bind(this);

    module.exports = Handler;
}).call(this);