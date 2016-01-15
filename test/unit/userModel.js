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

  after(function(done) {
    migrate().then(function(){
    	done();
    });
  });

  it('should save a user to the db', function(done) {
    new User({
        name: 'billy the kid'
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
    Users.fetch().then(function(users) {
      expect(users.length).to.equal(1);
    });
  });

  // it('should hash a users\'s password', function(done) {
  //   new User({
  //       name: 'billy the kid',
  //       password: 'makemyday'
  //     }).save()
  //     .then(function() {
  //       new User({
  //         name: 'billy the kid'
  //       }).fetch().then(function(found) {
  //         expect(found).to.not.equal(undefined);
  //         expect(found.get('name')).to.equal('billy the kid');
  //         done();
  //       });
  //     });
  // });

});
