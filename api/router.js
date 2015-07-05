var express = require('express');
var router = express.Router();
var assembla = require('./index').assembla;

router.use('/wechat',require("./controller/wechat"));
router.use('/assembla',require("./controller/assembla"));

module.exports = router;
