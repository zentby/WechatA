var services = module.exports;
var logger = require("bole")('service-helper');
var api = require('./../');

var wechat = api.wechat,
	assembla = api.assembla,
	database = api.database;

function updateToken(openid, token) {
	database.updateUserAssemblaToken(openid, token);
}

function initAssembla(user, callback) {
	var token = user.Assembla;
	assembla.init({
		accessToken: token.access_token,
		refreshToken: token.refresh_token,
		expire_at: token.expire_at
	}, function(err, token) {
		if (token) {
			updateToken(user.OpenId, token);
		}
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			callback(null);
		}
	});
}

services.getSpaces = function(user, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			assembla.spaces.spaces(callback);
		}
	});
};

services.getMentions = function(user, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			assembla.mentions.mentions(callback);
		}
	});
};

services.markMention = function(user, id, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else
			assembla.mentions.mark(id, callback);
	});
};

services.getAllAssigned = function(user, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			var space = spaceid || user.Assembla.DefaultSpace;
			assembla.tickets.assigned(space, callback);
		}
	});
};

services.getAllFollowed = function(user, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			var space = spaceid || user.Assembla.DefaultSpace;
			assembla.tickets.followed(space, callback);
		}
	});
};

services.getTicket = function(user, ticketid, callback, spaceid) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			var space = spaceid || user.Assembla.DefaultSpace;
			assembla.tickets.comments(space, ticketid, callback);
		}
	});
};

services.getAllComments = function(user, ticketid, callback) {
	initAssembla(user, function(err) {
		if (err != null) {
			callback(err, null);
		} else {
			var space = spaceid || user.Assembla.DefaultSpace;
			assembla.tickets.comments(space, ticketid, callback);
		}
	});
};