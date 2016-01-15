var User = require('./models/user');
var Users = require('./collections/users');
var Task = require('./models/task');
var Tasks = require('./collections/tasks');
var BbPromise = require('bluebird');

var users = ['paul', 'george', 'ringo', 'john'];
var tasks = ['lucy', 'in', 'the', 'sky', 'with', 'diamonds'];

BbPromise.map(users, function(user){
	return new User({name: user}).save();
})
.then(function(){
	return BbPromise.map(tasks, function(task){
		return new Task({name: task, user_id: Math.floor(Math.random() * users.length)}).save();
	});
})
.then(function(){
	console.log('done');
	process.exit();
});