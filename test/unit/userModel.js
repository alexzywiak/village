process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var requets = require('supertest');
var express = require('express');

var app = require('../../index');
var db = require('../../app/config/bookshelf.config.js');
var migrate = require('../../app/config/migrate');

var User = require('../../app/models/user');
var Users = require('../../app/collections/users');

describe('User Model', function() {

  before(function(done) {
    migrate().then(function() {
      done();
    });
  });

  it('should save a user to the db', function(done) {
    new User({
        name: 'billy the kid',
        password: 'makemyday'
      }).save()
      .then(function() {
        new User({
          name: 'billy the kid'
        }).fetch().then(function(found) {
          expect(found).to.not.equal(undefined);
          expect(found.get('name')).to.equal('billy the kid');
          done();
        });
      });
  });

  it('should have access to a users collection', function() {
    Users.forge().fetch().then(function(users) {
      expect(users.length).to.equal(1);
    });
  });

  describe('Authentication', function() {
    it('should hash a users\'s password', function(done) {
      new User({
          name: 'supertramp',
          password: 'makemyday'
        }).save()
        .then(function() {
          new User({
            name: 'supertramp'
          }).fetch().then(function(found) {
            expect(found.get('name')).to.equal('supertramp');
            expect(found.get('password')).to.not.equal('makemyday');
            done();
          });
        });
    });

    it('should return the user object when comparing a valid password', function(done) {
      User.comparePassword('supertramp', 'makemyday')
        .then(function(user) {
          expect(user.name).to.equal('supertramp');
          done();
        });
    });

    it('should return false comparing an invalid password', function(done) {
      User.comparePassword('supertramp', 'fakestreet')
        .then(function(user) {
          expect(user).to.equal(false);
          done();
        });
    });
  });

  describe('Friends', function() {

    var friendId;

    it('should add friends', function(done) {
      User.forge({
        name: 'supertramp'
      }).fetch().then(function(user) {
        friendId = user.get('id');
      }).then(function() {
        return new User({
          name: 'coolHandsLuke',
          password: 'meatloaf'
        }).save()
      }).then(function(user) {
        return user.friends().attach(friendId);
      }).then(function(user) {
        new User({
          name: 'coolHandsLuke'
        }).fetch({
          withRelated: ['friends']
        }).then(function(user) {
          expect(user.relations.friends.models.length).to.equal(1);
          expect(user.relations.friends.models[0].get('name')).to.equal('supertramp');
          done();
        });
      });
    });

    it('should add friends through the model\'s addFriend method', function(done) {
      User.addFriends(1, [2, 3]).then(function(friends) {
        
        expect(friends.models.length).to.equal(2);
        
        User.query('whereIn', 'id', [1, 2, 3])
          .fetchAll({
            withRelated: ['friends']
          })
          .then(function(results) {
            var friends = results.models.map(function(user){
              return user.relations.friends.models.map(function(friend){
                return friend.get('name');
              });
            });
            expect(results.length).to.equal(3);
            expect(friends[0]).to.have.members(['supertramp', 'coolHandsLuke']);
            expect(friends[1]).to.include('billy the kid');
            expect(friends[2]).to.include('billy the kid');
            done();
          });
      });
    });

    it('should not add the same friend twice through the model\'s addFriend method', function(done) {
      User.addFriends(1, [2, 3]).then(function(friends) {
        expect(friends.models.length).to.equal(0);
        done();
      });
    });

  });



});
