var db = require('../config/bookshelf.config');
var Task = require('./task');
var Users = require('../collections/users');

var User = db.Model.extend({
	tableName: 'users',
	task: function(){
		return this.hasMany(Task);
	}
});

module.exports = User;