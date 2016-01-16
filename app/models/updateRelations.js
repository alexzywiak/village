module.exports = {

  updateRelations: function(model) {

    return function(updateIdArray, relation) {

      var self = this;

      var mutualRelationships = ['friends'];

      var mutual = _.includes(mutualRelationships, relation);

      return model.forge(self.attributes).fetch({
        withRelated: [relation]
      }).then(function(model) {

        var currentIdArray = model.related(relation).models.map(function(relatedModel) {
          return relatedModel.get('id');
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
          return self;
        });
      });
    };
  }
}
