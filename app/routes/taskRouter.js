'use strict';

var Tasks = require('../collections/tasks');
var Task = require('../models/task');
var User = require('../models/user');

module.exports = function(app) {

  // Get all tasks
  app.get('/', function(req, res) {
    Tasks.forge().fetch().then(function(task) {
      res.status(200).send(task.models);
    });
  });

  // Get task by id
  app.get('/:id', function(req, res) {
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
  });

  // Add new task
  app.post('/', function(req, res) {
    if (!req.body.name || !req.body.user_id) {
      res.status(400).send('name and user id required');
    } else {

    	// Check to see if user exists
      User.where({
          id: req.body.user_id
        }).fetch({
          require: true
        })
        .then(function(user) {
          
          // Create new task
          new Task({

              name: req.body.name,
              user_id: req.body.user_id,
              description: req.body.description

            })
            .save()
            .then(function(task) {
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
  });

  // Update existing task
  app.put('/:id', function(req, res) {

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
      }).then(function(task){
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

  });

  // Remove task by id
  app.delete('/:id', function(req, res) {

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
  });
};
