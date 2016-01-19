
process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var requets = require('supertest');
var express = require('express');
var BbPromise = require('bluebird');
var _ = require('lodash');

var app = require('../../index');
var db = require('../../server/config/bookshelf.config.js');
var migrate = require('../../server/config/migrate');

var User = require('../../server/models/user');
var Users = require('../../server/collections/users');
var Task = require('../../server/models/task');
var Tasks = require('../../server/collections/tasks');

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

  'use strict';

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
      });
    }).then(function(tasks) {
      savedTaskIds = _.map(tasks, function(task) {
        return task.get('id');
      });
      done();
    });
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

    describe('Sign Off', function(){

      it('should let a user sign off on a task', function(done){
        Task.forge({name: 'take names'}).fetch()
          .then(function(task){
            return task.signOff(savedUserIds[1]);
          }).then(function(task){
            return Task.forge({id: task.get('id')}).fetch({withRelated: ['signedOffBy']});
          }).then(function(task){
            expect(task.get('status')).to.equal('complete');
            expect(task.related('signedOffBy').get('name')).to.equal('supertramp');
            return User.where({id: savedUserIds[1]}).fetch({withRelated: ['signedOffTasks']});
          }).then(function(user){
            expect(user.related('signedOffTasks').models.length).to.equal(1);
            done();
          });
      });

      it('should not let a user sign off his own task', function(done){
        Task.forge({name: 'take names'}).fetch()
          .then(function(task){
            return task.signOff(savedUserIds[0]);
          }).catch(function(err){
            expect(err).to.equal('cannot sign off your own tasks!');
            return Task.forge({name: 'take names'}).fetch({withRelated: ['signedOffBy']});
          }).then(function(task){
            expect(task.get('status')).to.equal('incomplete');
            expect(task.related('signedOffBy').attributes).to.eql({});
            return User.where({id: savedUserIds[0]}).fetch({withRelated: ['signedOffTasks']});
          }).then(function(user){
            expect(user.related('signedOffTasks').models.length).to.equal(0);
            done();
          });
      });

    });

    describe('Monitors', function() {

      it('should add users as monitors for a task', function(done) {
        Task.forge({
            name: 'take names'
          }).fetch()
          .then(function(task) {
            return task.updateRelations(savedUserIds, 'monitors');
          }).then(function() {
            return Task.forge({
              name: 'take names'
            }).fetch({
              withRelated: ['monitors']
            });
          }).then(function(task) {
            var monitors = task.related('monitors').models.map(function(user) {
              return user.get('name');
            });
            expect(task.related('monitors').models.length).to.equal(2);
            expect(monitors).to.have.members(['billy the kid', 'supertramp']);
            done();
          });
      });

      it('should remove users as monitors for a task', function(done) {
        Task.forge({
            name: 'take names'
          }).fetch()
          .then(function(task) {
            return task.updateRelations(savedUserIds.slice(1), 'monitors');
          }).then(function() {
            return Task.forge({
              name: 'take names'
            }).fetch({
              withRelated: ['monitors']
            });
          }).then(function(task) {
            var monitors = task.related('monitors').models.map(function(user) {
              return user.get('name');
            });
            expect(task.related('monitors').models.length).to.equal(1);
            expect(monitors).to.have.members(['supertramp']);
            expect(monitors).to.not.have.members(['billy the kid']);
            done();
          });
      });

      it('should display all tasks a user is monitoring', function(done) {
        Task.forge({
            name: 'take names'
          }).fetch()
          .then(function(task) {
            return task.updateRelations(savedUserIds, 'monitors');
          }).then(function() {
            return User.forge({
              name: 'supertramp'
            }).fetch({
              withRelated: ['monitoredTasks']
            });
          }).then(function(user) {
            var monitored = user.related('monitoredTasks').models.map(function(task) {
              return task.get('name');
            });
            expect(user.related('monitoredTasks').models.length).to.equal(1);
            expect(monitored).to.have.members(['take names']);
            done();
          });
      });

    }); // end describe
  }); // end describe
}); // end describe
