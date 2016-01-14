var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  path = require('path');


module.exports = function(app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var taskRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/api/user', userRouter); // use user router for all user request
  app.use('/api/task', taskRouter);
  // inject our routers into their respective route files
  require('./routes/userRouter')(userRouter);
  require('./routes/taskRouter')(taskRouter);
};
