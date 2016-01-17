'use strict';

var Users = require('../collections/users');
var User = require('../models/user');

module.exports = function(app) {

  // Get all users
  app.get('/', function(req, res) {
    Users.forge().fetch().then(function(users) {
      res.status(200).send(users.models);
    });
  });

  // Get user by id
  app.get('/:id', function(req, res) {
    User.where({
        id: req.params.id
      }).fetch({
        require: true,
        withRelated: ['friends', 'tasks', 'monitoredTasks']
      })
      .then(function(user) {
        res.status(200).send(user);
      })
      .catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
  });

  // Add new User
  app.post('/', function(req, res) {
    if (!req.body.password || !req.body.name || !req.body.email) {
      res.status(400).send('password name and email required');
    } else {

      new User({

          name: req.body.name,
          password: req.body.password,
          email: req.body.email,
          twitter: req.body.twitter

        })
        .save()
        .then(function(user) {
          res.status(201).send(user);
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  });

  // Update existing user
  app.put('/:id', function(req, res) {

    User.where({
        id: req.params.id
      })
      .fetch({
        require: true
      })
      .then(function(user) {

        return user.save({
          name: req.body.name || user.get('name'),
          email: req.body.email || user.get('email'),
          twitter: req.body.twitter || user.get('twitter')
        });

      }).then(function(user) {
        if (req.body.friends) {
          return user.updateRelations(req.body.friends, 'friends');
        } else {
          return user;
        }
      }).then(function(user) {
        if (req.body.monitoredTasks) {
          return user.updateRelations(req.body.monitoredTasks, 'monitoredTasks');
        } else {
          return user;
        }
      }).then(function(user) {
        res.status(200).send(user);
      }).catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });

  });

  // Remove user by id
  app.delete('/:id', function(req, res) {

    User.where({
      id: req.params.id
    }).fetch({
      require: true
    }).then(function(user) {
      return user.destroy();
    })
    .then(function(){
      res.sendStatus(200);
    })
    .catch(function(err){
      console.error(err);
      res.sendStatus(404);
    });
  });
};
