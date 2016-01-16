var BbPromise = require('bluebird');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var db = require('../config/bookshelf.config');
var Task = require('./task');
var Users = require('../collections/users');


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
    return this.hasMany(Task);
  },

  monitoredTasks: function() {
    return this.belongsToMany(Task);
  },

  friends: function() {
    return this.belongsToMany(User, 'users_friends', 'user_id', 'friend_id');
  },

  updateFriends: function(updateFriendId) {
    var currentUser = this;
    return User.forge(currentUser.attributes).fetch({
      withRelated: ['friends']
    }).then(function(user) {

      var currentFriendId = user.related('friends').models.map(function(friend) {
        return friend.get('id');
      });

      // Get all ids in updateFriendId not in currentFriendId
      var toAdd = this.modifyFriends.bind(this, 
          _.difference(updateFriendId, currentFriendId),
          'attach');

      // Get all ids in currentFriendId not in updateFriendId
      var toRemove = this.modifyFriends.bind(this, 
          _.difference(currentFriendId, updateFriendId),
          'detach');

      return BbPromise.each([toAdd, toRemove], function(task){
        return task();
      });
    });
  },


  /**
   * Adds all friends by id in friendIdArray to the User specified by userId
   * Adds User as a friend to all Friends
   * @param {[type]} friendIdArray [array of new friends' ids]
   * @param {[type]} friendIdArray [array of new friends' ids]
   */
  modifyFriends: function(friendIdArray, method, done) {
    var id = this.get('id');
    // Attach new friends
    return this.friends()[method](friendIdArray).then(function() {
      if (!done) {
        // Grab new friend models from DB
        return User.query('whereIn', 'id', friendIdArray)
          .fetchAll().then(function(friends) {
            // Attach current user as a friend to each friend model
            return BbPromise.map(friends.models, function(friend) {
              return friend.modifyFriends([id], method, true);
            });
          });
      } else {
        return this;
      }
    }.bind(this));
  },

  removeFriends: function(friendIdArray, done) {
    var id = this.get('id');
    // Attach new friends
    return this.friends().detach(friendIdArray).then(function() {
      if (!done) {
        // Grab new friend models from DB
        return User.query('whereIn', 'id', friendIdArray)
          .fetchAll().then(function(friends) {
            // Attach current user as a friend to each friend model
            return BbPromise.map(friends.models, function(friend) {
              return friend.removeFriends([id], true);
            });
          });
      } else {
        return this;
      }
    }.bind(this));
  }
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

module.exports = User;
