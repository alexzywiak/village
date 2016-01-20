var migrate = require('./migrate');

migrate().then(function(){
	process.exit();
});