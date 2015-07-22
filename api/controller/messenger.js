var messenger = module.exports;
var util = require('util');
var config = require("./../../config");
var logger = require("bole")('messenger');
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

var ahelper = require('./service-helper');

function getXmlMsg(fromMsg, content) {
	var textTemplate = '<xml>' +
		'<ToUserName><![CDATA[%s]]></ToUserName>' +
		'<FromUserName><![CDATA[%s]]></FromUserName>' +
		'<CreateTime>%s</CreateTime>' +
		'<MsgType><![CDATA[text]]></MsgType>' +
		'<Content><![CDATA[%s]]></Content>' +
		'</xml>';
	return util.format(textTemplate, fromMsg.FromUserName, fromMsg.ToUserName, Date.now(), content);
}

function generateReplyUrl(openid, path) {
	var domain = config.domain;
	var timestamp = Date.now();
	var signature = wechat.getSignature(timestamp, openid);
	var url = util.format('http://%s' + path + '?openid=%s&timestamp=%s&signature=%s', domain, openid, timestamp, signature);
	return url;
}

messenger.getReplyMsg = function(fromMsg, callback) {
	var openid = fromMsg.FromUserName;
	var ev = fromMsg.Event,
		evkey = fromMsg.EventKey;
	if (ev == 'CLICK') {
		var goOAuth = function (err) {
			if (err !== null) {
				logger.error('Error, goto A OAuth...');
				logger.error(err);
			}
			var url = generateReplyUrl(openid, '/api/wechat/auth');
			var content = 'To start Assembla OAuth process, <a href="' + url + '">Click Here</a> ';
			var msg = getXmlMsg(fromMsg, content);
			return callback(msg);
		};

		return database.getUserByOpenId(openid, function(user) {
			if (!user.Assembla.refresh_token) {
				return goOAuth(null);
			}

			if (evkey == 'mapping') {
				callback(getXmlMsg(fromMsg, 'Your account has mapped to Assembla!'));
			} else if (evkey == 'spaces') {
				ahelper.getSpaces(user, function(err, spaces) {
					if (err !== null) return goOAuth(err);
					var content = 'Please click below to set default space:';
					for (var i = 0; i < spaces.length; i++) {
						var url = generateReplyUrl(openid, '/api/assembla/space/' + spaces[i].id + '/set');
						content += '\n' + i + '. <a href="' + url + '">' + spaces[i].name + '</a> ';
					}
					var msg = getXmlMsg(fromMsg, content);
					return callback(msg);
				});
			} else if (evkey == 'mentions') {
				ahelper.getMentions('unread', user, function(err, mentions) {
					if (err !== null) return goOAuth(err);
					logger.debug(err);
					var msg;
					if (mentions && mentions.length > 0) {
						var url = generateReplyUrl(openid, '/api/wechat/mentions#?msg=unread');
						var content = 'You have ' + mentions.length + ' mentions, <a href="' + url + '">Click Here</a> to view detail';
						msg = getXmlMsg(fromMsg, content);
					} else {
						var url1 = generateReplyUrl(openid, '/api/wechat/mentions#?msg=all');
						var content1 = 'You don\'t have unread mentions, <a href="' + url1 + '">Click Here</a> to view all mentions';
						msg = getXmlMsg(fromMsg, content1);
					}
					return callback(msg);
				});
			}
		});
	}

	callback('');
};