var gulp = require('gulp');
var browser = require('browser-sync');

var config = require('../config').base;

gulp.task('serve', function() {
  browser({
    port: process.env.PORT || 4500,
    open: false,
    ghostMode: false,
    server: {
      baseDir: 'dist'
    }
  });
});