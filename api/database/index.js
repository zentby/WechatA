var logger = require("bole")('database');

var logError = function(trace, err) {
    if (err) logger.error(trace + ':' + err);
};
var models = require('./../../models');

function Database() {
    //User operations
    var user = models.User;
    this.getUser = function(condition, callback) {
        user.findOne(condition, function(err, item) {
            logError('getUser.findOne', err);
            if (item) {
                if (callback) callback(item);
            } else {
                user.create(condition, function(err, result) {
                    logError('getUser.create', err);
                    if (callback) callback(result);
                });
            }
        });
    };

    this.getUserByOpenId = function(openid, callback) {
        logger.debug('Get User By OpenId:' + openid);
        this.getUser({
            OpenId: openid
        }, callback);
    };

    this.updateUserWechatLastReceived = function(openid) {
        logger.debug('Update User Message Last Sent:' + openid);
        this.getUserByOpenId(openid, function(user) {
            user.Wechat.LastReceive = Date.now();
            user.save();
        });
    };

    this.updateUserAssemblaToken = function(openid, token) {
        logger.debug('Update User Assembla Token:');
        this.getUserByOpenId(openid, function(user) {
            user.Assembla = {
                token_type: token.token_type,
                access_token: token.access_token,
                expire_at: Date.now() + (token.expires_in * 1000),
                refresh_token: token.refresh_token,
            };
            logger.debug(user.errors);
            user.save();
        });
    };

    this.updateUserAssemblaSpace = function(openid, spaceid) {
        logger.debug('Update User Assembla Default Space:' + spaceid);
        this.getUserByOpenId(openid, function(user) {
            user.Assembla.DefaultSpace = spaceid;
            logger.debug(user);
            user.save();
        });
    }

    this.updateUser = function(condition, user) {
        logger.debug('Update User:' + (user ? JSON.stringify(user) : 'null'));
        user.update(condition, user, function(err, result) {
            logError('updateUser.update:', err);
        });
    };

    //Message log operations
    var msgLog = models.MsgLog;

    this.logMsg = function(msg, callback) {
        logger.debug('Log Msg:' + (user ? JSON.stringify(msg) : 'null'));
        msgLog.create(msg, function(err, result) {
            logError('logMsg', err);
            if (callback) callback(result);
        });
    };
}

exports = module.exports = new Database();