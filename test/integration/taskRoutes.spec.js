'use strict';
process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var BbPromise = require('bluebird');
var _ = require('lodash');

var app = require('../../index');
var db = require('../../app/config/bookshelf.config.js');
var migrate = require('../../app/config/migrate');

var Task = require('../../app/models/task');
var Tasks = require('../../app/collections/users');
var User = require('../../app/models/user');

var tables = ['users', 'tasks', 'users_friends'];

var seedUsers = [{
  name: 'billy the kid',
  email: 'billythekid@gmail.com',
  password: 'makemyday'
}, {
  name: 'supertramp',
  password: 'makemyday'
}];

var seedTasks = [{
  name: 'take names',
}, {
  name: 'chew bubblegum',
}];

var savedUserIds;
var savedTaskIds;

describe('Task Routes', function() {

  var token;

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
      // Get access token for restricted routes
      request(app)
        .post('/api/user/login')
        .send({
          email: 'billythekid@gmail.com',
          password: 'makemyday'
        })
        .end(function(err, res) {
          token = res.body.id_token;
          done();
        });
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

  describe('GET api/task/', function(done) {

    it('should respond with all current tasks', function(done) {
      request(app)
        .get('/api/task')
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, res) {
          var names = _.map(res.body, function(result) {
            return result.name;
          });
          expect(res.body.length).to.equal(2);
          expect(names).to.have.members(['take names', 'chew bubblegum']);
          done();
        });
    });

  }); // end describe

  describe('GET api/task/:id', function() {

    it('should get one task by id', function(done) {
      request(app)
        .get('/api/task/' + savedTaskIds[0])
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.name).to.equal('take names');
          done();
        });
    });

    it('should 404 for an id that does not exist', function(done) {
      request(app)
        .get('/api/task/0')
        .set('x-access-token', token)
        .expect(404)
        .end(done);
    });

    it('should return with related user and monitors', function(done) {

      Task.where({
        id: savedTaskIds[0]
      }).fetch().then(function(task) {
        // add a monitored task
        return task.monitors().attach(savedUserIds[0]);
      }).then(function() {

        request(app)
          .get('/api/task/' + savedTaskIds[0])
          .set('x-access-token', token)
          .expect(200)
          .end(function(err, res) {
            var task = res.body;
            expect(task.monitors.length).to.equal(1);
            expect(task.monitors[0].name).to.equal('billy the kid');
            expect(task.user.name).to.equal('billy the kid');
            done();
          });
      });
    });

  }); // end describe

  describe('POST api/task', function() {

    it('should save a new task', function(done) {
      request(app)
        .post('/api/task')
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
          user_id: savedUserIds[0]
        })
        .expect(201)
        .end(done);
    });

    it('should 400 if missing information', function(done) {
      request(app)
        .post('/api/task')
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
        })
        .expect(400)
        .end(done);
    });

    it('should 404 if user_id does not exist', function(done) {
      request(app)
        .post('/api/task')
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
          user_id: 'fakestreet'
        })
        .expect(404)
        .end(done);
    });
  });

  describe('PUT api/task/:id', function() {

    it('should update an existing task', function(done) {
      request(app)
        .put('/api/task/' + savedTaskIds[0])
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.name).to.equal('frank zappa');
          done();
        });
    });

    it('should 404 if task does not exist', function(done) {
      request(app)
        .put('/api/task/0')
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
        })
        .expect(404)
        .end(done);
    });

    it('should update with new monitors', function(done) {
      request(app)
        .put('/api/task/' + savedTaskIds[0])
        .set('x-access-token', token)
        .send({
          monitors: [savedUserIds[1]]
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.name).to.equal('take names');

          Task.where({
              id: savedTaskIds[0]
            }).fetch({
              withRelated: ['monitors']
            })
            .then(function(task) {
              expect(task.related('monitors').models.length).to.equal(1);
              expect(task.related('monitors').models[0].get('name')).to.equal('supertramp');
              done();
            });
        });
    });


    it('should update and remove monitors', function(done) {

      // Add initial friend
      Task.where({
        id: savedTaskIds[0]
      }).fetch().then(function(user) {
        return user.updateRelations(savedUserIds.slice(1), 'monitors')
      }).then(function(user) {

        request(app)
          .put('/api/task/' + savedTaskIds[0])
          .set('x-access-token', token)
          .send({
            monitors: []
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.name).to.equal('take names');

            Task.where({
                id: savedTaskIds[0]
              }).fetch({
                withRelated: ['monitors']
              })
              .then(function(user) {
                expect(user.related('monitors').models.length).to.equal(0);
                done();
              });
          });

      });
    });

  }); // end describe

  describe('DELETE api/task/:id', function() {

    it('should delete an existing task', function(done) {
      request(app)
        .delete('/api/task/' + savedTaskIds[0])
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, res) {
          return Task.where({
            id: savedTaskIds[0]
          }).fetch().then(function(user) {
            expect(user).to.equal(null);
            done();
          });
        });
    });

    it('should 404 if a task does not exist', function(done) {
      request(app)
        .delete('/api/task/0')
        .set('x-access-token', token)
        .expect(404)
        .end(done);
    });

  }); // end describe

});
