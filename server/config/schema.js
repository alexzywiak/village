'use strict';

var Schema = {

	users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: true},
    name: {type: 'string', maxlength: 150, nullable: true},
    password: {type: 'string', maxlength: 150, nullable: false},
    twitter: {type: 'string', maxlength: 150, nullable: true}
  },

  tasks: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    signed_off_by_user_id: {type: 'integer', nullable: true, unsigned: true},
    status: {type: 'string', maxlength: 254, nullable: false, defaultTo:'incomplete'},
    due_date: {type: 'dateTime', nullable: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    description: {type: 'string', maxlength: 150, nullable: true},
    created_at: {type: 'dateTime', nullable: false},
    updated_at: {type: 'dateTime', nullable: false}
  },

  users_friends: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    friend_id: {type: 'integer', nullable: false, unsigned: true}
  },

  tasks_users: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    task_id: {type: 'integer', nullable: false, unsigned: true}
  }
};

module.exports = Schema;