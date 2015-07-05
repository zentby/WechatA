var logger = require("bole")('wechat-api');
var request = require('request');
var sha1 = require('sha1');

function WeChatApi(setting) {

	var me = this;
	var _appId = setting.appId || '';
	var _appSecret = setting.appSecret || '';

	var _local_token = setting.local_token || 'we chat with assembla';
	var _access_token = setting.access_token || {
		Token: '',
		ExpireAt: Date.now()
	};
	var _base_url = 'https://api.weixin.qq.com/cgi-bin/';

	this.validateCall = function(req, res, next) {
		if (!req.query.timestamp || !req.query.nonce) {
			next();
			return;
		}
		var para = me.getSignature(req.query.timestamp, req.query.nonce);
		var isValid = para == req.query.signature;
		if (!isValid) {
			logger.error('invalid message ');
			res.send('invalid message ');
		} else if (req.query.echostr) {
			res.send(req.query.echostr);
			logger.info('echostr: ' + req.query.echostr);
		} else {
			next();
		}
	};

	this.getSignature = function(timestamp, id) {
		timestamp = timestamp || '';
		id = id || '';
		var para = [_local_token, timestamp, id].sort().join('');
		return sha1(para);
	};

	this.createCall = function(method, path, options, callback) {
		return function() {
			if (Object.prototype.toString.call(options) == '[object Function]') {
				callback = options;
				options = {};
			}
			path = _base_url + path;

			var parameters = {
				url: path,
				method: method,
				qs: options.qs,
				timeout: 60 * 1000 /* Default to 60sec */
			};

			if (options.json) parameters.json = options.json;
			logger.debug('Wechat pi is called: ' + JSON.stringify(parameters));
			request(parameters, function(err, res, body) {
				logger.debug('Wechat api is returned: err: %s body: %s', JSON.stringify(err), JSON.stringify(body));
				if (!err && res.statusCode == 200) {
					//if (result.errcode) TODO: validataion
					if (Object.prototype.toString.call(body) != '[object Object]')
                    {
                        body = JSON.parse(body);
                    }
					return callback(null, body);
				} else {
					logger.error('Code:' + res.statusCode + 'Error:' + err);
					return callback(err, null);
				}
			});

		};
	};

	// this.requestOpenId = function(code, callback) {
	// 	var urlapi = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + _appId + '&secret=' + _appSecret + '&code=' + code + '&grant_type=authorization_code';
	// 	logger.debug('api called:' + urlapi);

	// 	function requestcallback(error, response, body) {
	// 		logger.debug('Requested openId:' + body);
	// 		if (body.errcode && body.errcode != '0') {
	// 			logger.error('Error:' + body.errmsg);
	// 			callback('');
	// 		} else {
	// 			callback(body.openid);
	// 		}
	// 	}
	// 	logger.debug('Requesting OpenId');
	// 	request(urlapi, requestcallback);
	// };

	this.createClientButtons = function() {
		var buttons = require('./ButtonSetting.json');
		this.createCall('POST', 'menu/create', {
			qs: {
				'access_token': _access_token.Token
			},
			json: buttons
		}, function(err, body) {
			if (err) {
				logger.error(err);
				return;
			}
			if (body && body.errcode && body.errcode != '0')
				logger.error('Error:' + body.errmsg);
			else
				logger.info('Set Buttons Success');
		})();
	};

	var running = false;
	this.refreshToken = function(callback) {
		if (running) return;
		running = true;
		if (!_access_token.Token || (_access_token.ExpireAt - Date.now()) < 20 * 60 * 1000) {
			this.createCall('GET', 'token', {
				qs: {
					'grant_type': 'client_credential',
					'appid': _appId,
					'secret': _appSecret
				}
			}, function(err, token) {
				if (err === null) {
					_access_token.Token = token.access_token;
					_access_token.ExpireAt = Date.now() + (token.expires_in * 1000);
				}
				if (callback) callback(err, token);
			})();
		} else {
			running = false;
		}
	};

	this.setup = function() {
		this.refreshToken(function(err, token) {
			if (!err) {
				me.createClientButtons();
				logger.debug('Button created');
			}
			logger.debug('Init token finished');
		});
		setInterval(function() {
			me.refreshToken(function(err, newToken) {
				logger.debug('Refresh token service runs');
			});

		}, 20 * 60 * 1000);
	};

}

module.exports = WeChatApi;