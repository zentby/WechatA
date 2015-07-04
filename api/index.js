var config = require("./../config");
var assembla = require('./node-assembla')(config.assembla.ClientId, config.assembla.SecretId);

var api = module.exports;
api.database = require('./database');
api.assembla = assembla;

var WeChat = require('./node-wechat');
api.wechat = new WeChat(config.wechat);

api.wechat.setup();