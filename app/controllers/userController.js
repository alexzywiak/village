'use strict';

var jwt = require('jsonwebtoken');
var _ = require('lodash');

var Users = require('../collections/users');
var User = require('../models/user');

var secret = require('../config/auth.config').secret;

var createToken = function(user) {
  return jwt.sign(_.omit(user.attributes, 'password'), secret, {
    expiresIn: 24 * 60 * 60
  });
};

module.exports = {

  authorize: function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          console.error(err);
          return res.status(500).send('error authorizing token');
        } else {
          req.token = decoded;
          return next();
        }
      });
    } else {
      console.error('not authorized');
      return res.sendStatus(403);
    }
  },

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
              id_token: createToken(user)
            })
          } else {
            res.sendStatus(403)
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
                  id_token: createToken(user)
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
