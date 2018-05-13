// purpose: gulp-build-scripts
// author: bbraug
// date: 10-2-17
//
// var builder = require('@jenkins-cd/js-builder');
// builder.bundle('./src/main/js/myappbundle.js');

/* File: gulpfile.js */

// import gulp packages
//
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  uglify = require('gulp-uglify');

// folders
  folder = {
    src: 'src/',
    build: 'build/'
  };	
  
  
// development mode?
 devBuild = (process.env.NODE_ENV !== 'production'), 
  
  
  
// create a default task and just log a message
gulp.task('default', ['run', 'watch'], function() {
  return gutil.log('Gulp is running!')
}); 

gulp.task('build', [ 'html', 'css', 'js' ] , function() {
  return gutil.log('Gulp is building app!')
}); 

gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('source/*.html').pipe(gulp.dest('public'));
});

// image processing
gulp.task('images', function() {
	
  var out = './build/images/';
  console.log('out: '+ out);
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// HTML processing
gulp.task('html', ['images'], function() {
  var
    out = folder.build + 'html/',
    page = gulp.src(folder.src + 'html/**/*')
      .pipe(newer(out));

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }

  return page.pipe(gulp.dest(out));
});

// CSS processing
gulp.task('css', ['images'], function() {

  var postCssOpts = [
  assets({ loadPaths: ['images/'] }),
  autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
  mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build + 'css/'));

});

// JavaScript processing
gulp.task('js', function() {

  var jsbuild = gulp.src(folder.src + 'js/**/*')
    .pipe(deporder())
    .pipe(concat('main.js'));

  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});


// gulp.watch('source/javascript/**/*.js', ['jshint']);

// watch for changes
gulp.task('watch', function() {

  // image changes
  gulp.watch(folder.src + 'images/**/*', ['images']);

  // html changes
  gulp.watch(folder.src + 'html/**/*', ['html']);

  // javascript changes
  gulp.watch(folder.src + 'js/**/*', ['js']);

  // css changes
  gulp.watch(folder.src + 'scss/**/*', ['css']);

});
