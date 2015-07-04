
var models = module.exports;
require('./WeChat.js');
require('./Users.js');
require('./MsgLog.js');

models.WeChat = db.model('WeChat');
models.User = db.model('Users');
models.MsgLog = db.model('MsgLog');