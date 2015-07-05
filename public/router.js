var express = require('express');
var router = express.Router();

router.get('/wechata/mentions', function(req,res){
	res.sendfile('./view/mentions.html');
});

router.get('/wechata/followed', function(req,res){
	res.sendfile('./view/tickets.html');
});

router.get('/wechata/assigned', function(req,res){
	res.sendfile('./view/tickets.html');
});

module.exports = router; 