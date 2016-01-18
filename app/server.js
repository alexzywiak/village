'use strict';

var morgan = require('morgan'); // used for logging incoming request
var bodyParser = require('body-parser');
var path = require('path');

var db = require('./config/db.config');
var sanitizer = require('./util/sanitizer');
var secret = require('./config/auth.config').secret;


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
