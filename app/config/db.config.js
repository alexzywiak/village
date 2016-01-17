'use strict';

var db = (process.env.NODE_ENV === 'test') ? 'village_test' : 'village';

module.exports = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: db,
    charset: 'utf8'
  }
};
