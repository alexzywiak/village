/*jslint node: true */
'use strict';

var morgan = require('morgan'); // used for logging incoming request
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

var db = require('./config/db.config');
var sanitizer = require('./util/sanitizer');
var secret = require('./config/auth.config').secret;


module.exports = function(app, express) {

  var userRouter = express.Router();
  var taskRouter = express.Router();

  if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'));
  }

  if(process.env.NODE_ENV === 'dev'){
    app.options('*', cors());
    app.use(cors({
      origin: 'http://localhost:4500'
    }));
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, '../dist')));

  app.use('/api/user', userRouter);
  app.use('/api/task', taskRouter);

  require('./routes/userRouter')(userRouter);
  require('./routes/taskRouter')(taskRouter);
};
