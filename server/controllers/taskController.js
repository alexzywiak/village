/*jslint node: true */
'use strict';

var Tasks = require('../collections/tasks');
var Task = require('../models/task');
var User = require('../models/user');

module.exports = {

  getAllTasks: function(req, res) {
    Tasks.forge().fetch().then(function(task) {
      res.status(200).send(task.models);
    });
  },

  getTaskById: function(req, res) {
    Task.where({
        id: req.params.id
      }).fetch({
        require: true,
        withRelated: ['user', 'monitors']
      })
      .then(function(task) {
        res.status(200).send(task);
      })
      .catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
  },

  addNewTask: function(req, res) {
    if (!req.body.name || !req.body.user_id) {
      res.status(400).send('name and user id required');
    } else {

      // Check to see if user exists
      User.where({
          id: req.body.user_id
        }).fetch({
          require: true
        })
        .then(function() {

          // Create new task
          new Task({

              name: req.body.name,
              user_id: req.body.user_id,
              description: req.body.description,
              due_date: req.body.due_date

            })
            .save()
            .then(function(task) {
              return Task.where({
                id: task.id
              }).fetch();
            }).then(function(task){
              res.status(201).send(task);
            })
            .catch(function(err) {
              console.error(err);
              res.sendStatus(500);
            });
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(404);
        });
    }
  },

  updateTask: function(req, res) {

    Task.where({
        id: req.params.id
      })
      .fetch({
        require: true
      })
      .then(function(task) {

        return task.save({
          // Update name and description
          name: req.body.name || task.get('name'),
          description: req.body.description || task.get('description'),
          status: (req.body.status === 'pending') ? 'pending' : this.get('status')
        });

      }).then(function(task) {
        // Check for update to monitors array
        if (req.body.monitors) {
          return task.updateRelations(req.body.monitors, 'monitors');
        } else {
          return task;
        }
      }).then(function(task) {
        // Check for update to sign off status
        if (req.body.signOff) {
          return task.signOff(req.body.signOff);
        } else {
          return task;
        }
      }).then(function(task) {
        res.status(200).send(task);
      }).catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
  },

  deleteTask: function(req, res) {

    Task.where({
        id: req.params.id
      }).fetch({
        require: true
      }).then(function(task) {
        return task.destroy();
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
