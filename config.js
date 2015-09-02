var config = module.exports;
var PRODUCTION = process.env.NODE_ENV === "production";

config.session = {
  secret:'session_secret'
};

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: "0.0.0.0"
};

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || "localhost",
  database: 'WechatA'
};

config.assembla = {
	IsX : true,
	ClientId: 'assembla_dev_app_id',
	SecretId: 'assembla_dev_secretid'
}

config.wechat = {
  appId: 'wechat_app_id',
  appSecret: 'wechat_secret_id',
  local_token: 'private_token',
  access_token: { Token: '', ExpireAt: Date.now()},
  init: true
}

if (PRODUCTION) {
  //for example
  config.domain = 'your.domain.com';
  config.express.ip = "0.0.0.0";
  config.express.port = 80;
  config.assembla = {
  	IsX : false,
  	ClientId: 'assembla_app_id',
  	SecretId: 'assembla_secret_id'
  }
}
//config.db same deal
//config.email etc
//config.log
