var config = require("./config");
var express = require("express")
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require("bole")('entry');

app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: config.session.secret
}));

app.use(bodyParser.json({
	type: '*/*+json'
}));
app.use(bodyParser.text({
	type: '*/*'
}));

app.all('*', function(req, res, next) {
	logger.debug(req);
	next();
});
app.use('/api', require("./api/router"));

app.use('/', require('./public/router'));

//FINALLY, use any error handlers
app.use(require("./api/errors/notFound"));

// Export the app instance for unit testing via supertest
module.exports = app;