var gulp        = require('gulp'),
    tap         = require('gulp-tap'),
    browserify  = require('browserify'),
    buffer      = require('gulp-buffer'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    path        = require('path')
    concat      = require('gulp-concat');;

// Transpile LESS to CSS
gulp.task('less', function() {
  return gulp.src('./public/styles/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./public/styles/css'));
});

gulp.task('react', function(){
  return gulp.src('./public/jsx/*.jsx') // place to read react files from
    .pipe(tap(function(file) {
      file.contents = browserify(file.path).transform('babelify', {presets: ['es2015', 'react']}).bundle()
    }))
    .pipe(buffer())
    .pipe(concat('./production-app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/js')); // place to send uglified regular js files
});

gulp.task('watch', function() {
  gulp.watch(['./public/jsx/keyboard.js'], ['react']); // place to watch for react changes
  gulp.watch(['./public/styles/less/style.less'], ['less']);
});

gulp.task('default', ['react', 'less']);
