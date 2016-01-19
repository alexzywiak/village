/*jslint node: true */
'use strict';

process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var BbPromise = require('bluebird');
var _ = require('lodash');

var app = require('../../index');
var db = require('../../server/config/bookshelf.config.js');
var migrate = require('../../server/config/migrate');
var secret = require('../../server/config/auth.config').secret;

var User = require('../../server/models/user');
var Users = require('../../server/collections/users');
var Task = require('../../server/models/task');

var tables = ['users', 'tasks', 'users_friends'];

var seedUsers = [{
  name: 'billy the kid',
  email: 'billythekid@gmail.com',
  password: 'makemyday'
}, {
  name: 'supertramp',
  email: 'supertramp@gmail.com',
  password: 'makemyday'
}];

var seedTasks = [{
  name: 'take names',
}, {
  name: 'check bubblegum',
}];

var savedUserIds;
var savedTaskIds;

describe('User Routes', function() {

  // Auth token
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
      });
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

  describe('GET api/user/', function(done) {

    it('should respond with all current users', function(done) {
      request(app)
        .get('/api/user')
        .expect(200)
        .then(function(results) {
          var names = _.map(results.body, function(result) {
            return result.name;
          });
          expect(results.body.length).to.equal(2);
          expect(names).to.have.members(['supertramp', 'billy the kid']);
          done();
        });
    });

  }); // end describe

  describe('GET api/user/:id', function() {

    it('should get one user by id', function(done) {
      request(app)
        .get('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.name).to.equal('billy the kid');
          done();
        });
    });

    it('should 404 for an id that does not exist', function(done) {
      request(app)
        .get('/api/user/0')
        .set('x-access-token', token)
        .expect(404, done);
    });

    it('should return with all related tasks, friends, and monitored tasks', function(done) {

      User.where({
        id: savedUserIds[0]
      }).fetch().then(function(user) {
        // add a friend
        return user.updateRelations([savedUserIds[1]], 'friends');
      }).then(function(user) {
        // add a monitored task
        return user.monitoredTasks().attach(savedTaskIds[0]);
      }).then(function() {

        request(app)
          .get('/api/user/' + savedUserIds[0])
          .set('x-access-token', token)
          .expect(200)
          .end(function(err, res) {
            var user = res.body;
            expect(user.friends.length).to.equal(1);
            expect(user.tasks.length).to.equal(2);
            expect(user.monitoredTasks.length).to.equal(1);
            done();
          });
      });
    });

  }); // end describe

  describe('POST api/user', function() {

    it('should save a new user', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({
          name: 'frank zappa',
          password: 'moonunit',
          email: 'yellowsnow@gmail.com'
        })
        .expect(201)
        .end(done);
    });

    it('should 400 if missing information', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({
          name: 'frank zappa',
          email: 'yellowsnow@gmail.com'
        })
        .expect(400)
        .end(done);
    });
  });

  describe('PUT api/user/:id', function() {

    it('should update an existing user', function(done) {
      request(app)
        .put('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
        })
        .expect(200)
        .then(function(res) {
          expect(res.body.name).to.equal('frank zappa');
          done();
        });
    });

    it('should 404 if user does not exist', function(done) {
      request(app)
        .put('/api/user/0')
        .set('x-access-token', token)
        .send({
          name: 'frank zappa',
          email: 'yellowsnow@gmail.com'
        })
        .expect(404)
        .end(done);
    });

    it('should update with new friends', function(done) {
      request(app)
        .put('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .send({
          friends: [savedUserIds[1]]
        })
        .expect(200)
        .then(function(res) {
          expect(res.body.name).to.equal('billy the kid');

          User.where({
              id: savedUserIds[0]
            }).fetch({
              withRelated: ['friends']
            })
            .then(function(user) {
              expect(user.related('friends').models.length).to.equal(1);
              expect(user.related('friends').models[0].get('name')).to.equal('supertramp');
              done();
            });
        });
    });


    it('should update and remove friends', function(done) {

      // Add initial friend
      User.where({
        id: savedUserIds[0]
      }).fetch().then(function(user) {
        return user.updateRelations(savedUserIds.slice(1), 'friends');
      }).then(function(user) {

        request(app)
          .put('/api/user/' + savedUserIds[0])
          .set('x-access-token', token)
          .send({
            friends: []
          })
          .expect(200)
          .then(function(res) {
            expect(res.body.name).to.equal('billy the kid');

            User.where({
                id: savedUserIds[0]
              }).fetch({
                withRelated: ['friends']
              })
              .then(function(user) {
                expect(user.related('friends').models.length).to.equal(0);
                done();
              });
          });

      });
    });

    it('should update monitored tasks', function(done) {
      request(app)
        .put('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .send({
          monitoredTasks: [savedTaskIds[0]]
        })
        .expect(200)
        .then(function(res) {
          expect(res.body.name).to.equal('billy the kid');

          User.where({
              id: savedUserIds[0]
            }).fetch({
              withRelated: ['monitoredTasks']
            })
            .then(function(user) {
              expect(user.related('monitoredTasks').models.length).to.equal(1);
              expect(user.related('monitoredTasks').models[0].get('name')).to.equal('take names');
              done();
            });
        });
    });

  }); // end describe

  describe('DELETE api/user/:id', function() {

    it('should delete an existing user', function(done) {
      request(app)
        .delete('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .expect(200)
        .then(function() {
          return User.where({
            id: savedUserIds[0]
          }).fetch().then(function(user) {
            expect(user).to.equal(null);
            done();
          });
        });
    });

    it('should 404 if a user does not exist', function(done) {
      request(app)
        .delete('/api/user/0')
        .set('x-access-token', token)
        .expect(404)
        .end(done);
    });

  }); // end describe

});
