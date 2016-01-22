/*jslint node: true */
'use strict';

var Bookshelf = require('../config/bookshelf.config');
var BbPromise = require('bluebird');
var _ = require('lodash');

/**
 * Returns an updateRelations function which will manage bulk updating many to many
 * relationships.  Requires the string name of the current bookshelf model.
 * @param  {[string]} model [string name of the current bookshelf model]
 * @return {[function]}     [updateRelations function]
 */
module.exports = function(model) {

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

  var executeUpdate = function(idArray, relation, method, mutual) {
    console.log(idArray, this.id, method);
    var Model = Bookshelf.model(model);

    var id = this.get('id');
    // Attach new friends
    return this[relation]()[method](idArray).then(function() {
      if (mutual) {
        // Grab new friend models from DB
        return Model.query('whereIn', 'id', idArray)
          .fetchAll().then(function(models) {
            // Attach current user as a friend to each friend model
            return BbPromise.map(models.models, function(model) {
              return executeUpdate.call(model, [id], relation, method, false);
            });
          });
      } else {
        return this;
      }
    }.bind(this));
  };

  /**
   * Updates the specified many to many relationship to the id array provided.
   * Will add any new relations from the array, and will delete any current relations
   * that are not present in the provided array.
   * @param  {[array]} updateIdArray [id array to update to]
   * @param  {[string]} relation     [relation to update]
   * @return {[promise]}             [resolves with current model]
   */

  return function updateRelations(updateIdArray, relation) {

    var Model = Bookshelf.model(model);

    var self = this;

    if(typeof updateIdArray[0] === 'object'){
      updateIdArray = updateIdArray.map(function(item){
        return item.id;
      });
    }

    // For many to many relationships on the same table.  Will manage both a --> b and b --> a entries
    var mutual = (this.mutualRelationships) ? _.includes(this.mutualRelationships, relation) : false;

    return Model.forge({id: self.get('id')}).fetch({
      withRelated: [relation]
    }).then(function(results) {
      console.log('results', results);
      var currentIdArray = results.related(relation).models.map(function(model) {
        return model.get('id');
      });

      console.log('current friends', currentIdArray);
      console.log('update friends', updateIdArray);

      // Get all ids in updateIdArray not in currentIdArray
      // and prepare to add them
      var toAdd = executeUpdate.bind(self,
        _.difference(updateIdArray, currentIdArray),
        relation,
        'attach',
        mutual);

      // Get all ids in currentIdArray not in updateIdArray
      // and prepare to remove them
      var toRemove = executeUpdate.bind(self,
        _.difference(currentIdArray, updateIdArray),
        relation,
        'detach',
        mutual);

      // Execute function to add/remove relations
      return BbPromise.each([toAdd, toRemove], function(updateCommand) {
        return updateCommand();
      }).then(function() {
        return self;
      });
    });
  };
};
