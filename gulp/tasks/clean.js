
var gulp = require('gulp');
var clean = require('gulp-clean');

var config = require('../config').clean;

gulp.task('clean', function() {
 return gulp.src(config)
 .pipe(clean());
});

gulp.task('clean-html', function() {
 return gulp.src(config + '**/*.html')
 .pipe(clean());
});