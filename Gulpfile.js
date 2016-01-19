/**
 * Gulp Tasks
 * 
 * - mocha-test
 * - jshint
 * - component
 * - todo
 * - webpack
 */
var gulp = require('gulp');
var sync = require('run-sequence');
var requireDir = require('require-dir');

requireDir('./gulp/tasks', {
  recurse: true
});

gulp.task('default', function(done) {
  sync('jshint', 'clean', 'copy', 'webpack', done);
});
