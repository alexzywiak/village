var db = require('../config/bookshelf.config');
var User = require('../models/user');

var Users = db.Collection.extend({
	model: User
});

module.exports = Users;