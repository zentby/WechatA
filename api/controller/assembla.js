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
		res.send('success!');
	});
});

router.get('/mentions/:read', function(req, res) {
	database.getUserByOpenId(req.session.openid, function(user) {
		helper.getMentions(req.params.read, user, function(err, mentions) {
			if (err) res.send(err);
			else if (mentions !== null) {
				mentions = mentions.sort(function(a, b) {
					return Date.parse(b.created_at) - Date.parse(a.created_at);
				});
				res.json(mentions);
			} else {
				res.send('null');
			}
		});
	});
});

router.get('/testmentions/:read', function(req, res) {
	console.log('req.params.read '+req.params.read);
	assembla.mentions.mentions(req.params.read, function(err, mentions) {
		if (err) res.send('');
		else if (mentions !== null) {
			mentions = mentions.sort(function(a, b) {
				return Date.parse(b.created_at) - Date.parse(a.created_at);
			});
			res.json(mentions);
		} else {
			res.send('null');
		}
	});
});


module.exports = router;