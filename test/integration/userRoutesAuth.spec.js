/*jslint node: true */
'use strict';

process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var BbPromise = require('bluebird');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var app = require('../../index');
var db = require('../../server/config/bookshelf.config.js');
var migrate = require('../../server/config/migrate');
var secret = require('../../server/config/auth.config').secret;

var User = require('../../server/models/user');
var Users = require('../../server/collections/users');

var tables = ['users', 'tasks', 'users_friends'];

var seed = [{
  name: 'billy the kid',
  email: 'billythekid@gmail.com',
  password: 'makemyday'
}, {
  name: 'supertramp',
  email: 'supertramp@gmail.com',
  password: 'makemyday'
}, {
  name: 'coolHandsLuke',
  email: 'coolHandsLuke@gmail.com',
  password: 'meatloaf'
}];

var savedUserIds;

describe('User Model', function() {
  
  var token;

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

  describe('Sign Up', function() {

    it('should sign up a new user and return a JWT', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'abc123@gmail.com',
          password: 'abc123'
        })
        .expect(201)
        .then(function(res) {
          expect(jwt.verify(res.body.id_token, secret).email).to.equal('abc123@gmail.com');
          expect(jwt.verify(res.body.id_token, secret).password).to.equal(undefined);
          done();
        });
    });

    it('should sign not sign up a user with an existing email', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'billythekid@gmail.com',
          password: 'abc123'
        })
        .expect(400)
        .end(done);
    });

  }); // end describe

  describe('Log In', function() {

    it('should login an existing user and return a JWT', function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          email: 'billythekid@gmail.com',
          password: 'makemyday'
        })
        .expect(200)
        .then(function(res) {
          expect(jwt.verify(res.body.id_token, secret).email).to.equal('billythekid@gmail.com');
          expect(jwt.verify(res.body.id_token, secret).password).to.equal(undefined);
          done();
        });
    });

    it('should not login an existing user with the wrong password', function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          email: 'billythekid@gmail.com',
          password: 'fakestreet'
        })
        .expect(403)
        .end(done);
    });

  });

  describe('Authorization', function() {
    var token;

    beforeEach(function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          email: 'billythekid@gmail.com',
          password: 'makemyday'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) console.error(err);
          token = res.body.id_token;
          done();
        });
    });

    it('should allow users into restricted routes with a valid jwt', function(done){
      request(app)
        .get('/api/user/' + savedUserIds[0])
        .set('x-access-token', token)
        .expect(200, done);
    });

    it('should not allow users into restricted routes without a valid jwt', function(done){
      request(app)
        .get('/api/user/' + savedUserIds[0])
        .set('x-access-token', 'fake')
        .expect(403, done);
    });

  });


}); // end describe
