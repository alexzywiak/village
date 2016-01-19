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
var browser = require('browser-sync');
var requireDir = require('require-dir');

var config = require('./gulp/config');

requireDir('./gulp/tasks', {
  recurse: true
});

gulp.task('watch', function() {
  gulp.watch(config.js, ['jshint', 'webpack', browser.reload]);
  gulp.watch(config.copy.toCopy, ['copy', browser.reload]);
});

gulp.task('default', function(done) {
  sync('jshint', 'clean', 'copy', 'webpack', 'serve', 'watch', done);
});