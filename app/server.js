'use strict';

var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  path = require('path'),

  db = require('./config/db.config'),
  sanitizer = require('./util/sanitizer');


module.exports = function(app, express) {

  var userRouter = express.Router();
  var taskRouter = express.Router();

  if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // Escape HTML
  app.use(sanitizer());

  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/api/user', userRouter);
  app.use('/api/task', taskRouter);

  require('./routes/userRouter')(userRouter);
  require('./routes/taskRouter')(taskRouter);
};
