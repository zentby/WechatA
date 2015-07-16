var logger = require("bole")('wechat-controller');
var express = require('express');
var router = express.Router();
var api = require('./../');
var messenger = require('./messenger');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;
var helper = require('./service-helper');

function validateUrl(req) {
	if (!req.query.timestamp || req.query.timestamp < Date.now() - 20 * 60 * 1000) return false;
	var signature = req.query.signature;
	return wechat.getSignature(req.query.timestamp, req.query.openid) == signature;
}

router.all('/auth', function(req, res) {
	if (validateUrl(req)) {
		req.session.openid = req.query.openid;
		database.getUserByOpenId(req.query.openid, function(user) {
			logger.debug('got user for checking oauth');
			if (!user.Assembla.expire_at || user.hasAssemblaExpired()) {
				assembla.auth.authorize(res);
			} else {
				res.send('Your account has been mapped!');
			}
		});
	} else {
		res.send('Your link has expired or is not valid!');
	}
});

router.get('/space/:space_id/set', function(req, res) {
	if (validateUrl(req)) {
		req.session.openid = req.query.openid;
		database.updateUserAssemblaSpace(req.query.openid, req.params.space_id);
		res.send('Default space has been set successfully');
	} else {
		res.send('Your link has expired or is not valid!');
	}
});

router.get('/mentions', function(req, res) {
	if (validateUrl(req)) {
		req.session.openid = req.query.openid;
		res.redirect('/wechata/mentions');
	} else {
		res.send('Your link has expired or is not valid!');
	}
});


router.all('/message', wechat.validateCall);

router.all('/message', function(req, res) {
	try {
		var parseString = require('xml2js').parseString;
		logger.debug(req.body);
		var xml = req.body;
		parseString(xml, function(err, result) {
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


module.exports = router;