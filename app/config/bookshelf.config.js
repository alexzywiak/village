var knex = require('knex')(require('./db.config'));

var Bookshelf = require('bookshelf')(knex);

console.log(Bookshelf.knex.schema);

module.exports = Bookshelf;
