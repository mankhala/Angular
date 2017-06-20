var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate');
    del = require('del');

gulp.task('jshint', function() {
 // return gulp.src('app/scripts/**/*.js')
    return gulp.src('../bower_components/*/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin','copyfonts');
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('./app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function() {
  return del(['dist/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('copyfonts', function() {
 return del(['dist/fonts']),gulp.src('app/fonts/**/*')
   .pipe(gulp.dest('dist/fonts'))
   .pipe(notify({ message: 'Fonts task complete' }));
});

//gulp.task('copyfonts', ['clean'], function() {
   //gulp.src('app/bower_components/font-awesome/fonts/**/*')
 //   gulp.src('app/fonts/**/*')
  // .pipe(notify({ message: 'Fonts task start' }));
 //  .pipe(gulp.dest('/dist/fonts'));
 //  .pipe(notify({ message: 'Fonts task complete' }));
 //   gulp.src('app/bower_components/bootstrap/dist/fonts/**/*')
  // .pipe(notify({ message: 'Glyphicons task start' }));
  // .pipe(gulp.dest('/dist/fonts'));
  // .pipe(notify({ message: 'Glyphicons task End' }));
//});

//Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);
  
  // Watch fonts files
  gulp.watch('app/fonts/**/*', ['copyfonts']);
  
});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'app/fonts/**/*',
      'dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html"
      }
   });
        // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
    });