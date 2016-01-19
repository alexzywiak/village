var gulp = require('gulp');
var jshint = require('gulp-jshint');

var config = require('../config').jshint;

console.log(config.src);

gulp.task('jshint', function() {
  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
