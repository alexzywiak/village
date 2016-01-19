var gulp   = require('gulp');
var yargs  = require('yargs').argv;
var path   = require('path');
var tpl    = require('gulp-template');
var rename = require('gulp-rename');

// src - to save components
// templates - blank template directory templates/*.**
var config = require('../config').component;

// helper function
var resolveToComponents = function(glob){
  glob = glob || '';
  return path.join(config.src, glob); // app/components/{glob}
};

gulp.task('component', function(){
  var cap = function(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  var name = yargs.name;
  var parentPath = yargs.parent || '';
  var destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(config.templates)
    .pipe(tpl({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('component', name);
    }))
    .pipe(gulp.dest(destPath));
});
