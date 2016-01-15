var BbPromise = require('bluebird');
var bcrypt = require('bcrypt');
var db = require('../config/bookshelf.config');
var Task = require('./task');
var Users = require('../collections/users');

var User = db.Model.extend({

  tableName: 'users',

  initialize: function() {
    var user = this;
    this.on('creating', function(model, attrs, options) {
      var hash = bcrypt.hashSync(model.get('password'), 8);
      model.set('password', hash);
    });
  },

  task: function() {
    return this.hasMany(Task);
  }
}, {

  comparePassword: function(name, password) {

    return new BbPromise(function(resolve, reject) {
      if (!name || !password) throw new Error('Name and password are required, dude!');
      new this({
        name: name
      }).fetch({
        required: true
      }).then(function(user) {
        
        bcrypt.compare(password, user.get('password'), function(err, isMatch){

        	if(err){
        		reject(err);
        	} 
        	if(isMatch){
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
