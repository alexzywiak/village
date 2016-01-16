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

  task: function() {
    return this.hasMany(Task);
  },

  monitorTask: function() {
    return this.belongsToMany(Task);
  },

  friends: function() {
    return this.belongsToMany(User, 'users_friends', 'user_id', 'friend_id');
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
  },

  /**
   * Adds all friends by id in friendIdArray to the User specified by userId
   * Adds User as a friend to all Friends
   * @param {[int]} userId         [id of the user to add friends]
   * @param {[type]} friendIdArray [array of new friends' ids]
   */
  addFriends: function(userId, friendIdArray) {
    // Grab the current user
    return User
      .forge({
        id: userId
      })
      .fetch({
        withRelated: ['friends']
      })
      .then(function(user) {

        var currentFriendsIds = user.relations.friends.models.map(function(model) {
          return model.get('id');
        });

        friendIdArray = friendIdArray.filter(function(id){
          return currentFriendsIds.indexOf(id) === -1;
        });

          // Add new friends
        user.friends()
          .attach(friendIdArray);

        return User
          .query('whereIn', 'id', friendIdArray).fetchAll();
      }).then(function(friends) {

        // Add user as a friend of each user from friendIdArray
        friends.models.forEach(function(friend) {
          friend.friends().attach(userId);
        });

        // Resolve with new friends collection
        return friends;
      });
  }
});

module.exports = User;
