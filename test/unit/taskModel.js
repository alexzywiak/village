process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var requets = require('supertest');
var express = require('express');

var app = require('../../index');
var db = require('../../app/config/bookshelf.config.js');
var migrate = require('../../app/config/migrate');

var User = require('../../app/models/user');
var Task = require('../../app/models/task');
var Tasks = require('../../app/collections/tasks');

describe('Task Model', function() {

  before(function(done) {
    migrate().then(function() {
      return new User({name: 'billy the kid'}).save();
    }).then(function(){
      done();
    });
  });

  after(function(done) {
    migrate().then(function(){
      done();
    });
  });

  it('should have a user saved on the db', function(done){
    new User({name: 'billy the kid'}).fetch().then(function(user){
      expect(user.get('name')).to.equal('billy the kid');
      done();
    });
  });

  it('should save a task to the db', function(done) {
    new Task({
        name: 'walk the walk'
      }).save()
      .then(function() {
        new Task({
          name: 'walk the walk'
        }).fetch().then(function(found) {
          expect(found).to.not.equal(undefined);
          expect(found.get('name')).to.equal('walk the walk');
          done();
        });
      });
  });

  it('should have access to a tasks collection', function(done) {
    Tasks.fetch().then(function(tasks) {
      expect(tasks.length).to.equal(1);
      done();
    });
  });

  it('should associate a user with a task', function(done) {
    User.where({name: 'billy the kid'}).fetch().then(function(user){
      return new Task({name:'ok corral', user_id: user.get('id')}).save();
    }).then(function(){
      User.where({name: 'billy the kid'}).fetch({withRelated: ['task']}).then(function(user){
        expect(user.get('name')).to.equal('billy the kid');
        expect(user.related('task').models.length).to.equal(1);
        expect(user.related('task').models[0].get('name')).to.equal('ok corral');
        done();
      });
    });
  });

});
