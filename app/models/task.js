var db = require('../config/bookshelf.config');
var User = require('./user');

var Task = db.Model.extend({
  tableName: 'tasks',
  hasTimestamps: true,
  monitors: function() {
    return this.belongsToMany(User);
  },
  user: function() {
    return this.belongsTo(User, 'user_id');
  },

  /**
   * Updates the specified many to many relationship to the id array provided.
   * Will add any new relations from the array, and will delete any current relations
   * that are not present in the provided array.
   * @param  {[array]} updateIdArray [id array to update to]
   * @param  {[string]} relation     [relation to update]
   * @return {[promise]}             [resolves with current user]
   */
  updateRelations: function(updateIdArray, relation) {

    var currentUser = this;
    console.log(this);
    var mutualRelationships = ['friends'];

    var mutual = _.includes(mutualRelationships, relation);

    return User.forge(currentUser.attributes).fetch({
      withRelated: [relation]
    }).then(function(user) {

      var currentIdArray = user.related(relation).models.map(function(model) {
        return model.get('id');
      });

      // Get all ids in updateIdArray not in currentIdArray
      var toAdd = this.executeUpdate.bind(this,
        _.difference(updateIdArray, currentIdArray),
        relation,
        'attach',
        mutual);

      // Get all ids in currentIdArray not in updateIdArray
      var toRemove = this.executeUpdate.bind(this,
        _.difference(currentIdArray, updateIdArray),
        relation,
        'detach',
        mutual);

      return BbPromise.each([toAdd, toRemove], function(task) {
        return task();
      }).then(function() {
        return currentUser;
      });
    });
  },

  /**
   * Executes many to many update on specified relation.
   * Can attach/detach according to specified method.
   * If mutual, then function will also run the same commands on all relations.
   * ie. Delete friend from user's friend list, also delete user from friend's friend list.
   * @param  {[array]} idArray   [list of relations' ids]
   * @param  {[string]} relation [relation to modify]
   * @param  {[string]} method   [attach/detach to add or remove]
   * @param  {[boolean]} mutual  [true to perform reciprocal operation]
   * @return {[promise]}         [resolves with modified relations]
   */
  executeUpdate: function(idArray, relation, method, mutual) {
    var id = this.get('id');
    // Attach new friends
    return this[relation]()[method](idArray).then(function() {
      if (mutual) {
        // Grab new friend models from DB
        return User.query('whereIn', 'id', idArray)
          .fetchAll().then(function(models) {
            // Attach current user as a friend to each friend model
            return BbPromise.map(models.models, function(model) {
              return model.executeUpdate([id], relation, method, false);
            });
          });
      } else {
        return this;
      }
    }.bind(this));
  }
});

module.exports = Task;
