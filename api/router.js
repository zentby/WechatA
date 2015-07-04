var express = require('express');
var router = express.Router();
var assembla = require('./index').assembla;

function showUser(req,res){
	assembla.init();
	//res.send('assembla[users]:'+ JSON.stringify(assembla.users));
	assembla.users.user(function(err, user){
		console.log('err:'+err);
		console.log('user:'+user);
		if (err!=null){
			res.send('err:' + err);
		}else{
			res.send(user);
		}
	});
};

function showTickets(req, res, next, space_id){
	console.log('showing spaces');
	var spaceid = space_id || 'cXbHnWFGWr44kjacwqjQXA';
	assembla.init();
	assembla.tickets.tickets(spaceid, function(err, tickets){
		console.log('err:'+err);
		if (err!=null){
			res.send('err:' + err);
		}else{
			res.send(tickets);
		}
	});
};

function showSpaces(req,res){
	assembla.init();
	console.log('showing spaces');
	assembla.spaces.spaces(function(err, spaces){
		console.log('err:'+err);
		if (err!=null){
			res.send('err:' + err);
		}else{
			res.send(spaces);
		}
	});
};

router.param('space_id', showTickets);

router.get('/', function(req, res) {
  res.send('hello tester');
});

router.get('/user', showUser);
router.get('/:space_id/tickets', function(){});
router.get('/spaces', showSpaces);

module.exports = router;
