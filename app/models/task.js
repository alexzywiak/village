var db = require('../config/bookshelf.config');
var User = require('./user');

var Task = db.Model.extend({
	tableName: 'tasks',
	hasTimestamps: true,
	user: function(){
		return this.belongsTo(User, 'user_id');
	}
});

module.exports = Task;