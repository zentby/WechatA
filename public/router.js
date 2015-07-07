var express = require('express');
var router = express.Router();

router.get('/wechata/mentions', function(req,res){
	res.sendFile('view/mentions.html', {root:__dirname});
});

router.get('/wechata/followed', function(req,res){
	res.sendFile('/view/tickets.html');
});

router.get('/wechata/assigned', function(req,res){
	res.sendFile('/view/tickets.html');
});

module.exports = router; 