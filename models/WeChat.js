/**
 * Created by daniel on 6/11/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var weChat = Schema({
    Id: String,
    Token: String,
    ExpireAt: Date
});

module.exports = mongoose.model('WeChat', weChat);