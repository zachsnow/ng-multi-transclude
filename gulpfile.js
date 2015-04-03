(function () {
  'use strict';

  var wiredep = require('wiredep');
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
  });

  var testFiles;

  gulp.task('preparetesthtml', function () {
    return gulp.src('test/unit/**/*.html')
      .pipe($.ngHtml2js({
        moduleName: 'test-partials',
        prefix: '/',
      }))
      .pipe($.rename(function(path){
        path.extname = '.tpl.js';
        return path;
      }))
      .pipe(gulp.dest('test/unit'))
      .pipe($.size());
  });

  gulp.task('preparetestfiles', ['preparetesthtml'], function () {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      dependencies: true,
      devDependencies: true
    });

    testFiles = bowerDeps.js.concat([
      'src/**/*.js',
      'test/unit/*.js',
    ]);
  });

  gulp.task('test', ['preparetestfiles'], function() {
    return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
  });

  gulp.task('jshint', function () {
    return gulp.src(['.tmp/**/*.js'])
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jshint.reporter('fail'));
  });

  gulp.task('compress', function() {
    return gulp.src(['.tmp/**/*.js'])
      .pipe($.uglify())
      .pipe($.concat('multi-transclude.min.js'))
      .pipe(gulp.dest('./'))
      .pipe($.size());
  });

  gulp.task('concat', function() {
    return gulp.src(['.tmp/**/*.js'])
      .pipe($.concat('multi-transclude.js'))
      .pipe(gulp.dest('./'))
      .pipe($.size());
  });

  gulp.task('default', ['build']);

  gulp.task('build', ['test', 'jshint', 'compress', 'concat']);
  /*gulp.task('build', function(cb) {
    runSequence('test', 'jshint', 'concat', 'compress', cb);
  });*/
})();
