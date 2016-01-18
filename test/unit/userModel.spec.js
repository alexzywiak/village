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

var User = require('../../app/models/user');
var Users = require('../../app/collections/users');

var tables = ['users', 'tasks', 'users_friends'];

var seed = [{
  name: 'billy the kid',
  password: 'makemyday'
}, {
  name: 'supertramp',
  password: 'makemyday'
}, {
  name: 'coolHandsLuke',
  password: 'meatloaf'
}];

var savedUserIds;

describe('User Model', function() {

  before(function(done) {
    // Creates tables for DB
    migrate().then(function() {
      done();
    });
  });

  beforeEach(function(done) {
    // Seeds user data
    return BbPromise.map(seed, function(user) {
      return new User(user).save();
    }).then(function(users) {
      savedUserIds = _.map(users, function(user) {
        return user.get('id');
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

  it('should have three users saved', function() {
    Users.forge().fetch().then(function(users) {
      expect(users.length).to.equal(3);
    });
  });

  it('should always have three users saved', function() {
    Users.forge().fetch().then(function(users) {
      expect(users.length).to.equal(3);
    });
  });

  it('should update a user', function(done) {
    User.forge({
      id: savedUserIds[0]
    }).fetch().then(function(user) {
      expect(user.get('name')).to.equal('billy the kid');
      return user.save({
        name: 'rock the casbah'
      });
    }).then(function() {
      return User.forge({
        id: savedUserIds[0]
      }).fetch()
    }).then(function(user) {
      expect(user.get('name')).to.equal('rock the casbah');
      done();
    });
  });

  describe('Authentication', function() {
    it('should hash a users\'s password', function(done) {
      User.forge({
        name: 'supertramp'
      }).fetch().then(function(found) {
        expect(found.get('name')).to.equal('supertramp');
        expect(found.get('password')).to.not.equal('makemyday');
        done();
      });
    });

    it('should require a password for a new user', function(done) {
      new User({
        name: 'insecure'
      }).fetch().then(function(user) {
        expect(user).to.equal(null);
        done();
      });
    });

    it('should return the user object when comparing a valid password', function(done) {
      User.where({id: savedUserIds[0]}).fetch()
        .then(function(user){
          return user.comparePassword('makemyday');
        })
        .then(function(authorized){
          expect(authorized).to.equal(true);
          done();
        });
    });

    it('should return false comparing an invalid password', function(done) {
      User.where({id: savedUserIds[0]}).fetch()
        .then(function(user){
          return user.comparePassword('funkymonkey');
        })
        .then(function(authorized){
          expect(authorized).to.equal(false);
          done();
        });
    });
  }); // end describe

  describe('Friends', function() {

    it('should add friends', function(done) {
      var user, friend;
      User.forge({
        name: 'supertramp'
      }).fetch().then(function(model) {
        user = model;
        return User.forge({
          name: 'coolHandsLuke'
        }).fetch();
      }).then(function(model) {
        friend = model;
        return user.friends().attach(friend.get('id'));
      }).then(function() {
        return User.forge({
          name: user.get('name')
        }).fetch({
          withRelated: ['friends']
        });
      }).then(function(model) {
        expect(model.related('friends').length).to.equal(1);
        done();
      });
    });

    describe('updateRelations Method', function() {

      it('should add new friends', function(done) {

        User.forge({
          id: savedUserIds[0]
        }).updateRelations([savedUserIds[1]], 'friends').then(function() {

          User.query('whereIn', 'id', savedUserIds)
            .fetchAll({
              withRelated: ['friends']
            })
            .then(function(results) {
              var friends = results.models.map(function(user) {
                return user.relations.friends.models.map(function(friend) {
                  return friend.get('name');
                });
              });
              expect(friends[0]).to.include('supertramp');
              expect(friends[1]).to.include('billy the kid');
              done();
            });
        });
      });

      it('should remove friends', function(done) {

        User.forge({
            id: savedUserIds[0]
          }).updateRelations(savedUserIds.slice(1), 'friends')
          .then(function() {

            return User.forge({
              id: savedUserIds[0]
            }).fetch({
              withRelated: ['friends']
            });

          }).then(function(user) {

            expect(user.related('friends').models.length).to.equal(2);
            return user.updateRelations([savedUserIds[1]], 'friends');

          }).then(function() {

            return User.forge({
              id: savedUserIds[0]
            }).fetch({
              withRelated: ['friends']
            });

          }).then(function(user) {

            expect(user.related('friends').models.length).to.equal(1);
            done();
          });
      });

    }); // end describe
  }); // end describe
}); // end describe
