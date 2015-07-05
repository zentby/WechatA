var messenger = module.exports;
var util = require('util');
var config = require("./../../config");
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

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

function generateReplyUrl(openid) {
	var domain = config.domain;
	var timestamp = Date.now();
	var signature = wechat.getSignature(timestamp, fromMsg.FromUserName);
	var url = util.format('http://%s/api/wechat/auth?openid=%s&timestamp=%s&signature=%s', domain, openid, timestamp, signature);
	return url;
}

messenger.getReplyMsg = function(fromMsg, callback) {
	var openid = fromMsg.FromUserName;
	if (fromMsg.Event == 'CLICK' && fromMsg.EventKey == 'mapping') {
		return database.getUserByOpenId(openid, function(user) {
			if (!user.Assembla.refresh_token) {
				var url = generateReplyUrl(fromMsg.FromUserName);
				var msg = getXmlMsg(fromMsg, '<a href="' + url + '">Jump to OAuth Process</a>');
				callback( msg);
			}
			callback(getXmlMsg(fromMsg, 'Your account has mapped to Assembla!'))	;
		});
	}

	callback('');
};