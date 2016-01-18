'use strict';

var Users = require('../collections/users');
var User = require('../models/user');
var userController = require('../controllers/userController');
var jwt = require('jsonwebtoken');

var secret = require('../config/auth.config').secret;

module.exports = function(app) {

  // Login existing user
  app.post('/login', userController.loginUser);

  // Add new User
  app.post('/signup', userController.saveNewUser);

  // Get all users
  app.get('/', userController.getAllUsers);

  // Get user by id
  app.get('/:id', userController.authorize, userController.getUserById);

  // Update existing user
  app.put('/:id',  userController.authorize,  userController.updateUser);

  // Remove user by id
  app.delete('/:id',  userController.authorize,  userController.deleteUser);
};
