var Schema = {

	users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false},
    name: {type: 'string', maxlength: 150, nullable: false},
    password: {type: 'string', maxlength: 150, nullable: false},
    twitter: {type: 'string', maxlength: 150, nullable: false}
  },

  tasks: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    signed_off_by: {type: 'integer', nullable: false, unsigned: true},
    status: {type: 'string', maxlength: 254, nullable: false},
    name: {type: 'string', maxlength: 150, nullable: false},
    description: {type: 'string', maxlength: 150, nullable: false},
    created_at: {type: 'dateTime', nullable: false},
    updated_at: {type: 'dateTime', nullable: false}
  }
};

module.exports = Schema;