'use strict';

var Users = require('../collections/users');
var User = require('../models/user');
var userController = require('../controllers/userController');

module.exports = function(app) {

  // Get all users
  app.get('/', userController.getAllUsers);

  // Get user by id
  app.get('/:id', userController.getUserById);

  // Login existing user
  app.post('/login', userController.loginUser);

  // Add new User
  app.post('/', userController.saveNewUser);

  // Update existing user
  app.put('/:id', userController.updateUser);

  // Remove user by id
  app.delete('/:id', userController.deleteUser);
};
