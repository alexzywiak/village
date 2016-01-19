/*jslint node: true */
'use strict';

var jwt = require('jsonwebtoken');

var Users = require('../collections/users');
var User = require('../models/user');
var userController = require('../controllers/userController');
var auth = require('../controllers/authController');

var secret = require('../config/auth.config').secret;

module.exports = function(app) {

  // Login existing user
  app.post('/login', userController.loginUser);

  // Add new User
  app.post('/signup', userController.saveNewUser);

  // Get all users
  app.get('/', userController.getAllUsers);

  // Get user by id
  app.get('/:id', auth.authorize, userController.getUserById);

  // Update existing user
  app.put('/:id',  auth.authorize,  userController.updateUser);

  // Remove user by id
  app.delete('/:id',  auth.authorize,  userController.deleteUser);
};
