var express = require('express');
var router = express.Router();
var assembla = require('./index').assembla;

router.use('/wechat', require("./controller/wechat"));
router.use('/assembla', require("./controller/assembla"));

module.exports = router;

router.get('/mentions', function(req, res) {
	assembla.init();
	assembla.mentions.mentions(function(err, mentions) {
		if (mentions != null) {
			res.json(mentions)
		} else {
			res.send('');
		}
	})
})