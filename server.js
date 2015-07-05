#!/usr/bin/env node

var config = require("./config");
var mongoose = require('mongoose');
var mongo = mongoose.createConnection();
global.db = mongo.open('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database);

var app = require("./index");
var fs = require('fs');

//Use whichever logging system you prefer.
//Doesn't have to be bole, I just wanted something more or less realistic
var bole = require("bole");

bole.output([{
	level: "debug",
	stream: process.stdout
},{
	level: 'debug',
	stream: fs.createWriteStream('./log/server.log')
}]);

var log = bole("server");

log.info("server process starting");
//Note that there's not much logic in this file.
//The server should be mostly "glue" code to set things up and
//then start listening
app.listen(config.express.port, config.express.ip, function(error) {
	if (error) {
		log.error("Unable to listen for connections", error);
		process.exit(10);
	}
	log.info("express is listening on http://" +
		config.express.ip + ":" + config.express.port);
});