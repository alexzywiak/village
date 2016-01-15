var Schema = {
	users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    password: {type: 'string', maxlength: 150, nullable: false},
    twitter: {type: 'string', maxlength: 150, nullable: false}
  },
  tasks: {
    id: {type: 'increments', nullable: false, primary: true},
    status: {type: 'string', maxlength: 254, nullable: false, unique: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    description: {type: 'string', maxlength: 150, nullable: false}
  }
};

module.exports = Schema;