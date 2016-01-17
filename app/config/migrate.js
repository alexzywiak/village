'use strict';

/*
  Creates tables and fields based on schemas in schema.js
  ** Warning ** WILL DROP EXISTING TABLES
  
  All due credit should be given to Qawelesizwe Mlilo 
  Taken from his awesome blog series @:  
  http://blog.ragingflame.co.za/2014/7/21/using-nodejs-with-mysql
*/

var knex = require('knex')(require('./db.config'));

var Schema = require('./schema');
var sequence = require('when/sequence');
var _ = require('lodash');

function createTable(tableName) {
  return knex.schema.dropTableIfExists(tableName)
    .then(function() {
     return knex.schema.createTable(tableName, function(table) {
        var column;
        var columnKeys = _.keys(Schema[tableName]);
        _.each(columnKeys, function(key) {
          if (Schema[tableName][key].type === 'text' && Schema[tableName][key].hasOwnProperty('fieldtype')) {
            column = table[Schema[tableName][key].type](key, Schema[tableName][key].fieldtype);
          } else if (Schema[tableName][key].type === 'string' && Schema[tableName][key].hasOwnProperty('maxlength')) {
            column = table[Schema[tableName][key].type](key, Schema[tableName][key].maxlength);
          } else {
            column = table[Schema[tableName][key].type](key);
          }
          if (Schema[tableName][key].hasOwnProperty('nullable') && Schema[tableName][key].nullable === true) {
            column.nullable();
          } else {
            column.notNullable();
          }
          if (Schema[tableName][key].hasOwnProperty('primary') && Schema[tableName][key].primary === true) {
            column.primary();
          }
          if (Schema[tableName][key].hasOwnProperty('unique') && Schema[tableName][key].unique) {
            column.unique();
          }
          if (Schema[tableName][key].hasOwnProperty('unsigned') && Schema[tableName][key].unsigned) {
            column.unsigned();
          }
          if (Schema[tableName][key].hasOwnProperty('references')) {
            column.references(Schema[tableName][key].references);
          }
          if (Schema[tableName][key].hasOwnProperty('defaultTo')) {
            column.defaultTo(Schema[tableName][key].defaultTo);
          }
        });
      });
    });
}

function createTables() {
  var tables = [];
  var tableNames = _.keys(Schema);
  tables = _.map(tableNames, function(tableName) {
    return function() {
      return createTable(tableName);
    };
  });
  return sequence(tables);
}

module.exports = function(){
  return createTables()
    .then(function() {
      console.log('Tables created!!');
    })
    .catch(function(error) {
      throw error;
    });
};
