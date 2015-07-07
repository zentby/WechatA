var express = require('express');
var router = express.Router();
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

var helper = require('./service-helper');

//definitions


//routers
router.all('/auth', function(req, res) {
	assembla.auth.getAccessToken(req.query.code, function(err, token) {
		var openid = req.session.openid;
		//write token to db
		database.updateUserAssemblaToken(openid, token);
	});
});

router.get('/mentions', function(req, res) {
	database.getUserByOpenId(req.session.openid, function(user) {
		helper.getMentions(user, function(err, mentions) {
			if (err) res.send(err);
			else {
				mentions = mentions.sort(function(a, b) {
					return Date.parse(b.created_at) - Date.parse(a.created_at);
				});
				res.json(mentions);
			}
		});
	});
});

router.get('/testmentions', function(req, res) {
	assembla.mentions.mentions(function(err, mentions) {
		if (err) res.send('');
		else {
			mentions = mentions.sort(function(a, b) {
				return Date.parse(b.created_at) - Date.parse(a.created_at);
			});
			res.json(mentions);
		}
	});
});


module.exports = router;