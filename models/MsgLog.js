var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var log = Schema({
    ToUserName: String,
    FromUserName: String,
    CreateTime: Date,
    MsgType: String,
    Content: String,
    PicUrl: String,
    Format: String,
    ThumbMediaId: String,
    Location_X: Number,
    Location_Y: Number,
    Scale: Number,
    Label: String,
    Title: String,
    Description: String,
    Url: String,
    MediaId: String,
    MsgId: String
});

module.exports = mongoose.model('MsgLog', log);