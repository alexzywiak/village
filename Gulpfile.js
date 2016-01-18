var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

var paths = {
  app: ['app/**/*.js'],
  test: ['test/**/*.js']
};

gulp.task('test', function() {
  return gulp.src(paths.test)
    .pipe(mocha())
    .once('error', function(err) {
      console.log(err);
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('test-one', function() {
  return gulp.src('test/integration/userRoutesAuth.spec.js')
    .pipe(mocha())
    .once('error', function(err) {
      console.log(err);
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('hint', function() {
  return gulp.src(paths.app)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
