/*jslint node: true */
'use strict';

var BbPromise = require('bluebird');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var db = require('../config/bookshelf.config');
var Users = require('../collections/users');
var updateRelations = require('./updateRelations');

require('./task');

var User = db.Model.extend({

  tableName: 'users',

  /*
   *  Hashes password on creation 
   */
  initialize: function() {
    var user = this;
    this.on('creating', function(model, attrs, options) {
      var hash = bcrypt.hashSync(model.get('password'), 8);
      model.set('password', hash);
    });
  },

  tasks: function() {
    return this.hasMany('Task');
  },

  signedOffTasks: function(){
    return this.hasMany('Task', 'signed_off_by_user_id');
  },

  monitoredTasks: function() {
    return this.belongsToMany('Task', 'tasks_users', 'user_id', 'task_id');
  },

  friends: function() {
    return this.belongsToMany('User', 'users_friends', 'user_id', 'friend_id');
  },

  /**
   * Compares passed name and password to the name and corresponding hashed password on the DB
   * Resolves true on successful comparison, false on unsuccessful
   * @param  {[string]} password [password to compare]
   * @return {[Promise]}         [resolves true or false]
   */
  comparePassword: function(password){
    return new BbPromise(function(resolve, reject){
      bcrypt.compare(password, this.get('password'), function(err, match){
        if(err){
          reject(err);
        }
        if(match){
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }.bind(this));
  },

  // Specify Many to Many relationships on the same table
  // Will create reciprocal entries for a --> b and b --> a
  mutualRelationships: ['friends'],

  /**
   * Returns a function
   * Updates the specified many to many relationship to the id array provided.
   * Will add any new relations from the array, and will delete any current relations
   * that are not present in the provided array.
   * @param  {[array]} updateIdArray [id array to update to]
   * @param  {[string]} relation     [relation to update]
   * @return {[promise]}             [resolves with current user]
   */
  updateRelations: updateRelations('User')

});

module.exports = db.model('User', User);
