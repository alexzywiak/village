process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var requets = require('supertest');
var express = require('express');
var BbPromise = require('bluebird');
var _ = require('lodash');

var app = require('../../index');
var db = require('../../app/config/bookshelf.config.js');
var migrate = require('../../app/config/migrate');

var User = require('../../app/models/user');
var Users = require('../../app/collections/users');
var Task = require('../../app/models/task');
var Tasks = require('../../app/collections/tasks');

var tables = ['users', 'tasks', 'users_friends'];

var seedUsers = [{
  name: 'billy the kid',
  password: 'makemyday'
}, {
  name: 'supertramp',
  password: 'makemyday'
}];

var seedTasks = [{
  name: 'take names',
}, {
  name: 'check bubblegum',
}];

var savedUserIds;
var savedTaskIds;

describe('Task Model', function() {

  before(function(done) {
    // Creates tables for DB
    migrate().then(function() {
      done();
    });
  });

  beforeEach(function(done) {
    // Seeds user data
    return BbPromise.map(seedUsers, function(user) {
      return new User(user).save();
    }).then(function(users) {
      savedUserIds = _.map(users, function(user) {
        return user.get('id');
      });
      return BbPromise.map(seedTasks, function(task) {
        task.user_id = savedUserIds[0];
        return new Task(task).save();
      })
    }).then(function(tasks) {
      savedTaskIds = _.map(tasks, function(task) {
        return task.get('id');
      });
      done();
    })
  });

  afterEach(function(done) {
    // Clears entries from the db
    BbPromise.each(tables, function(table) {
      return db.knex(table).del();
    }).then(function() {
      done();
    });
  });

  after(function(done) {
    // Drops tables from DB
    BbPromise.each(tables, function(table) {
      return db.knex.schema.dropTable(table);
    }).then(function() {
      done();
    });
  });

  it('should have a user saved on the db', function(done) {
    Users.forge().fetch().then(function(users) {
      expect(users.length).to.equal(2);
      done();
    });
  });

  it('should have access to a tasks collection', function(done) {
    Tasks.forge().fetch().then(function(tasks) {
      expect(tasks.length).to.equal(2);
      done();
    });
  });

  describe('Users', function() {
    it('should associate a user with her tasks', function(done) {
      User.forge({
          id: savedUserIds[0]
        })
        .fetch({
          withRelated: ['tasks']
        })
        .then(function(user) {
          expect(user.related('tasks').models.length).to.equal(2);
          done();
        });
    });
  }); // end describe

  describe('Users', function() {
    it('should associate a user with her tasks', function(done) {
      User.forge({
          id: savedUserIds[0]
        })
        .fetch({
          withRelated: ['tasks']
        })
        .then(function(user) {
          expect(user.related('tasks').models.length).to.equal(2);
          done();
        });
    });
  }); // end describe
}); // end describe
