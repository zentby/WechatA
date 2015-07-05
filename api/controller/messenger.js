var messenger = module.exports;
var util = require('util');

var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

function getIpAddr() {
	var os = require('os');

	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
		for (var k2 in interfaces[k]) {
			var address = interfaces[k][k2];
			if (address.family === 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
	}
	return addresses;
}

function getXmlMsg(fromMsg, content) {
	var textTemplate = '<xml>'+
	                '<ToUserName><![CDATA[%s]]></ToUserName>'+
	                '<FromUserName><![CDATA[%s]]></FromUserName>'+
	                '<CreateTime>%s</CreateTime>'+
	                '<MsgType><![CDATA[text]]></MsgType>'+
	                '<Content><![CDATA[%s]]></Content>'+
	                '</xml>';
	return util.format(textTemplate, fromMsg.FromUserName, fromMsg.ToUserName, Date.now(), content);
}

messenger.getReplyMsg = function(fromMsg) {
	if (fromMsg.Event == 'CLICK' && fromMsg.EventKey == 'mapping') {
		//return a url contains open_id, timestamp, signature
		var ip =  getIpAddr()[0];
		var timestamp = Date.now();
		var signature = wechat.getSignature(timestamp, fromMsg.FromUserName);
		var url = util.format('http://%s/api/wechat/auth?openid=%s&timestamp=%s&signature=%s',ip,fromMsg.FromUserName, timestamp, signature);
		var msg = getXmlMsg(fromMsg,'<a href="'+url+'">Jump to OAuth Process</a>');
		return msg;
	}

	return '';
};