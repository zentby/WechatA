var express = require('express');
var router = express.Router();
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

router.all('/auth', function(req, res){
	assembla.auth.getAccessToken(req.query.code, function(err, token){
		var openid = req.session.openid;
		//write token to db
		database.updateUserAssemblaToken(openid, token);
	});
});

module.exports = router;