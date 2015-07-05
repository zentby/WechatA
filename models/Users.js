/**
 * Created by daniel on 6/11/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = Schema({
    OpenId: String,
    Name: String,
    Wechat: {
        Token: String,
        Expire_At: Date,
        Refresh_Token: String,
        LastReceive: {type:Date, default: Date.now}
    },
    AId: String,
    Assembla:{
        token_type: String,
        access_token: String,
        expire_at: Date,
        refresh_token: String,
        DefaultSpace: String
    }
});

user.methods.hasAssemblaExpired = function () {
  return this.Assembla.expire_at && this.Assembla.expire_at < Date.now();
}

module.exports = mongoose.model('Users', user);