var knex = require('knex')(require('./db.config'));

var Bookshelf = require('bookshelf')(knex);

module.exports = Bookshelf;
