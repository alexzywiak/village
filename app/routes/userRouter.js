var Users = require('../collections/users');
var User = require('../models/user');
var Task = require('../models/task');

module.exports = function(app){

	app.get('/', function(req, res){
		Users.reset().fetch().then(function(users){
			res.status(200).send(users.models);
		});
	});

	app.get('/:name', function(req, res){
		new User({name: req.params.name}).fetch().then(function(user){
			new Task({user_id: user.id}).fetchAll().then(function(tasks){
				if(tasks){
					res.status(200).send({user: user.attributes, tasks:tasks.models});
				} else {
					res.status(200).send({user: user.attributes});
				}
			});
		});
	});
};