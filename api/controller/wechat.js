var logger = require("bole")('wechat-controller');
var express = require('express');
var router = express.Router();
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

router.all('/auth', function(req, res) {
	wechat.requestOpenId(req.query.code, function(openid) {
		if (!!openid && openid !== '') {
			req.session.openid = openid;

			database.getUserByOpenId(openid, function(user) {
				logger.debug('got user for checking oauth');
				if (!user.Assembla.expire_at || user.hasAssemblaExpired()) {
					assembla.auth.authorize(res);
				} else {
					res.send('Your account has been mapped!');
				}
			});
		}
	});
});

router.post('/', wechat.validateCall);

router.post('/', function(req, res) {
	try {
		var parseString = require('xml2js').parseString;
		logger.debug(req.body);
		var xml = req.body;
		parseString(xml, function(err, result) {
			logger.debug(result);
			database.updateUserWechatLastReceived(result.xml.FromUserName);
			database.logMsg(result.xml);
			res.send('success');
		});

	} catch (e) {
		logger.error(e);
	}
});




module.exports = router;