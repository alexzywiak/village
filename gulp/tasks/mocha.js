var gulp = require('gulp');
var mocha = require('gulp-mocha');

var config = require('../config').mocha;

gulp.task('mocha-test', function() {
  return gulp.src(config.src)
    .pipe(mocha())
    .once('error', function(err) {
      console.log(err);
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});