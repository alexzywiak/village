/*jslint node: true */
'use strict';

var _ = require('lodash');
var BbPromise = require('bluebird');

var db = require('../config/bookshelf.config');
var updateRelations = require('./updateRelations');

require('./user');

var Task = db.Model.extend({
  tableName: 'tasks',
  hasTimestamps: true,

  monitors: function() {
    return this.belongsToMany('User', 'tasks_users', 'task_id', 'user_id');
  },

  signedOffBy: function() {
    return this.belongsTo('User', 'signed_off_by_user_id');
  },

  signOff: function(userId) {

    var task = this;

    if (userId === this.get('user_id')) {
      return BbPromise.reject('cannot sign off your own tasks!');
    }

    return db.model('User').where({
        id: userId
      }).fetch({
        require: true
      })
      .then(function() {
        return task.save({status: 'complete', signed_off_by_user_id: userId});
      });
  },

  user: function() {
    return this.belongsTo('User', 'user_id');
  },

  /**
   * Returns a function
   * Updates the specified many to many relationship to the id array provided.
   * Will add any new relations from the array, and will delete any current relations
   * that are not present in the provided array.
   * @param  {[array]} updateIdArray [id array to update to]
   * @param  {[string]} relation     [relation to update]
   * @return {[promise]}             [resolves with current model]
   */

  updateRelations: updateRelations('Task')

});

module.exports = db.model('Task', Task);
