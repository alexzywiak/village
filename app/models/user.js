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

  monitoredTasks: function() {
    return this.belongsToMany('Task', 'tasks_users', 'user_id', 'task_id');
  },

  friends: function() {
    return this.belongsToMany('User', 'users_friends', 'user_id', 'friend_id');
  },

  // Many to Many relationships on the same table
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

}, {

  /**
   * Compares passed name and password to the name and corresponding hashed password
   * on the DB
   * Resolves user on successful comparison, false on unsuccessful
   * @param  {[string]} name     [name of the user]
   * @param  {[string]} password [password to compare]
   * @return {[Promise]}         [resolves with user or false]
   */
  comparePassword: function(name, password) {

    return new BbPromise(function(resolve, reject) {
      if (!name || !password) throw new Error('Name and password are required, dude!');
      new this({
        name: name
      }).fetch({
        required: true
      }).then(function(user) {

        bcrypt.compare(password, user.get('password'), function(err, isMatch) {

          if (err) {
            reject(err);
          }
          if (isMatch) {
            resolve(user.omit('password'));
          } else {
            resolve(false);
          }
        });
      });
    }.bind(this));
  }

});

module.exports = db.model('User', User);
