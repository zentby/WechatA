var services = module.exports;
var logger = require("bole")('service-helper');
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

function initAssembla(user) {
	var token = user.Assembla;
	assembla.init({
		accessToken: token.access_token,
		refreshToken: token.refresh_token,
		expire_at: token.expire_at
	});
}

services.getMentions = function(user, callback) {
	initAssembla(user);
	assembla.mentions.mentions(callback);
};

services.markMention = function(user, id, callback) {
	initAssembla(user);
	assembla.mentions.mark(id, callback);
};

services.getAllAssigned = function(user, callback) {
	var space = spaceid || user.Assembla.DefaultSpace;
	initAssembla(user);
	assembla.tickets.assigned(space, callback);
};

services.getAllFollowed = function(user, callback) {
	var space = spaceid || user.Assembla.DefaultSpace;
	initAssembla(user);
	assembla.tickets.followed(space, callback);
};

services.getTicket = function(user, ticketid, callback, spaceid) {
	var space = spaceid || user.Assembla.DefaultSpace;
	initAssembla(user);
	assembla.tickets.comments(space, ticketid, callback);
};

services.getAllComments = function(user, ticketid, callback) {
	var space = spaceid || user.Assembla.DefaultSpace;
	initAssembla(user);
	assembla.tickets.comments(space, ticketid, callback);
};