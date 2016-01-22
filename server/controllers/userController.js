/*jslint node: true */
'use strict';

var _ = require('lodash');

var Users = require('../collections/users');
var User = require('../models/user');
var auth = require('./authController');

var secret = require('../config/auth.config').secret;

module.exports = {

  getAllUsers: function(req, res) {
    Users.forge().fetch().then(function(users) {
      res.status(200).send(users.models);
    });
  },

  getUserById: function(req, res) {
    User.where({
        id: req.params.id
      }).fetch({
        require: true,
        withRelated: ['friends', 'tasks', 'monitoredTasks']
      })
      .then(function(user) {
        user.unset('password')
        res.status(200).send(user);
      })
      .catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
  },

  loginUser: function(req, res) {

    var user;

    if (!req.body.password || !req.body.email) {
      res.status(400).send('password, name and email required');
    } else {
      User.where({
          email: req.body.email
        }).fetch({
          require: true
        })
        .then(function(model) {
          user = model;
          return user.comparePassword(req.body.password);
        })
        .then(function(authorized) {
          if (authorized) {
            res.status(200).send({
              id_token: auth.createToken(user)
            });
          } else {
            res.sendStatus(403);
          }
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(404);
        });
    }
  },

  saveNewUser: function(req, res) {

    if (!req.body.password || !req.body.email) {
      res.status(400).send('password, name and email required');
    } else {

      User.where({email: req.body.email}).fetch()
        .then(function(user) {
          // check if email is already registered
          if (user) {
          	res.status(400).send('email is already registered');
          } else {
          	// register new user
            new User({

                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                twitter: req.body.twitter

              })
              .save()
              .then(function(user) {
                res.status(201).send({
                  id_token: auth.createToken(user)
                });
              })
              .catch(function(err) {
                console.error(err);
                res.sendStatus(500);
              });
          }
        });
    }
  },

  updateUser: function(req, res) {

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
        return User.where({id: user.id})
          .fetch({withRelated: ['tasks', 'friends']});
      }).then(function(user){
        res.status(200).send(user);
      }).catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });

  },

  deleteUser: function(req, res) {
    User.where({
        id: req.params.id
      }).fetch({
        require: true
      }).then(function(user) {
        return user.destroy();
      })
      .then(function() {
        res.sendStatus(200);
      })
      .catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
  }
};
