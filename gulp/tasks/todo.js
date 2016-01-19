var gulp = require('gulp');
var todo = require('gulp-todoist');

var config = require('../config').todo;

gulp.task('todo', function() {
  return gulp.src(config.src)
    .pipe(todo({silent: false, verbose: true}));
});