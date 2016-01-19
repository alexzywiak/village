/*jslint node: true */
'use strict';

var Tasks = require('../collections/tasks');
var Task = require('../models/task');
var User = require('../models/user');
var taskController = require('../controllers/taskController');
var auth = require('../controllers/authController');

module.exports = function(app) {

  // Get all tasks
  app.get('/', auth.authorize, taskController.getAllTasks);

  // Get task by id
  app.get('/:id', auth.authorize, taskController.getTaskById);

  // Add new task
  app.post('/', auth.authorize, taskController.addNewTask);

  // Update existing task
  app.put('/:id', auth.authorize, taskController.updateTask);

  // Remove task by id
  app.delete('/:id', auth.authorize, taskController.deleteTask);
};
