var db = require('../config/bookshelf.config');
var User = require('./user');

var Task = db.Model.extend({
	tableName: 'tasks',
	hasTimestamps: true,
	monitors: function(){
		return this.belongsToMany(User);
	},
	user: function(){
		return this.belongsTo(User, 'user_id');
	}
});

module.exports = Task;