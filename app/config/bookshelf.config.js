'use strict';

var knex = require('knex')(require('./db.config'));

var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('registry');

module.exports = Bookshelf;
