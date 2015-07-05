var logger = require("bole")('wechat-controller');
var express = require('express');
var router = express.Router();
var api = require('./../');
var messenger = require('./messenger');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;
var helper = require('./service-helper');

router.all('/auth', function(req, res) {
	var signature = req.query.signature;
	if (wechat.getSignature(req.query.timestamp, req.query.openid) == signature) {
		req.session.openid = req.query.openid;
		database.getUserByOpenId(req.query.openid, function(user) {
			logger.debug('got user for checking oauth');
			if (!user.Assembla.expire_at || user.hasAssemblaExpired()) {
				assembla.auth.authorize(res);
			} else {
				res.send('Your account has been mapped!');
			}
		});
	}
});

router.all('/message', wechat.validateCall);

router.all('/message', function(req, res) {
	try {
		var parseString = require('xml2js').parseString;
		logger.debug(req.body);
		var xml = req.body;
		parseString(xml, function(err, result) {
			logger.debug(result);
			req.session.openid = result.xml.FromUserName;
			database.updateUserWechatLastReceived(result.xml.FromUserName);
			database.logMsg(result.xml);
			messenger.getReplyMsg(result.xml, function(msg) {
				res.header('Content-Type', 'text/xml');
				res.send(msg);
			});
		});

	} catch (e) {
		logger.error(e);
	}
});

router.get('/mentions', function(req, res) {
	database.getUserByOpenId(req.session.openid, function(user) {
		helper.getMentions(user, function(err, mentions) {
			if (err) res.send(err);
			else res.json(mentions);
		});
	});
});


module.exports = router;