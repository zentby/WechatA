var logger = require("bole")('database');

var logError = function (trace, err)
{
    if (err)logger.error(trace + ':' + err);
}
var models = require('./../../models');

function Database(){
    //WeChat config operation
    var wechat = models.WeChat;
    this.getWeChatConfig = function (callback)
    {
        var defaultVal = {Id: 'Default', Token: '', ExpireAt: Date.now()-1 }; 
        wechat.find(function (err, items)
        {
            logError('getWeChatConfig.find:', err);
            if (items.length > 0)
            {
                if (callback) callback(items[0]);
            } else
            {
                wechat.create(defaultVal, function (err, result)
                {
                    logError('getWeChatConfig.create:', err);
                    console.log(result);
                    if (callback) callback(result);
                });
            }
        })
    }

    this.updateWeChatToken = function (token)
    {
        wechat.update({Id: 'Default'}, {
            $set: {
                Token: token.access_token,
                ExpireAt: Date.now() + (token.expires_in * 1000)
            }
        }, function (err, result)
        {
            logError('updateWeChatToken.update:', err);
        });
    };

    //User operations
    var user = models.User;
    this.getUser = function (condition, callback)
    {
        user.findOne(condition, function (err, item)
        {
            logError('getUser.findOne', err);
            if (item)
            {
                if (callback) callback(item);
            }
            else
            {
                user.create(condition, function (err, result)
                {
                    logError('getUser.create', err);
                    if (callback) callback(result);
                });
            }
        });
    }

    this.updateUser = function (condition, user)
    {
        user.update(condition, user, function (err, result)
        {
            logError('updateUser.update:', err);
        });
    }

    //Message log operations
    var msgLog = models.MsgLog;

    this.logMsg = function(msg, callback){
        msgLog.create(msg, function(err, result){
            logError('logMsg',err);
            if (callback) callback(result);
        })
    }
};

exports = module.exports = new Database();
