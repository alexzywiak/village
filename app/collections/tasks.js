var db = require('../config/bookshelf.config');
var Task = require('../models/task');

var Tasks = new db.Collection();

Tasks.model = Task;

module.exports = Tasks;