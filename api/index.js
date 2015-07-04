
var config = require("./../config");
var assembla = require('./node-assembla')(config.assembla.ClientId, config.assembla.SecretId);

var api = exports = module.exports;
api.database = require('./database');
api.assembla = assembla;

api.database.getWeChatConfig(function(wechat_token){
	config.wechat.access_token = wechat_token;
    var WeChat = require('./node-wechat');
	api.wechat = new WeChat(config.wechat);

	setInterval(function ()
	{
	    api.wechat.refreshToken(function(err, newToken){
    	    console.log('Refresh token service runs');
            if (config.wechat.init){
                api.wechat.createClientButtons();
                config.wechat.init=false;
            }
	    });

	}, 20 * 60 * 1000);


});
