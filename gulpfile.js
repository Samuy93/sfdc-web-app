'use strict'

var path = require('path'),
    sr    = require(path.join(__dirname, 'sr.config.js')), // static resource details 
    del   = require('del'), // delete folder
    zip   = require('gulp-zip'), // create zip files 
    gulp  = require('gulp'),
    useref  = require('gulp-useref'), //  concatenate files in order 
    uglify  = require('gulp-uglify'), // minifying JavaScript files
    gulpIf  = require('gulp-if'),  // check for type file
    cssnano = require('gulp-cssnano'), // minifying CSS files
    metadata = require(path.join(__dirname, 'metadata.js')), //  metadata object
    browserSync = require('browser-sync').create(), // lunch server 
    runSequence = require('run-sequence'); //  run tasks in order
    

// Minify js, css files 
gulp.task('minifyAll', function(){// 
  return gulp.src('app/resourcesTemplate.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// delete folder dist
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// server task init
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    https: true,
    browser: "google chrome"
  });
});

// Create zip file  
gulp.task('zip', function(callback){

  return gulp.src('dist/**')
         .pipe(zip(sr.fullName+'.zip'))
         .pipe(gulp.dest('dist'));
});

// Create zip file
gulp.task('deploy', ['build'], function(callback){
  metadata.deploy();
});

// Build project
gulp.task('build', function(callback){
  runSequence('clean:dist', 'minifyAll', 'zip' , callback);
});




