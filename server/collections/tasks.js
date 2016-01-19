var db = require('../config/bookshelf.config');
var Task = require('../models/task');

var Tasks = db.Collection.extend({
	model: Task
});

module.exports = Tasks;