var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint     = require('gulp-jshint'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    browserSync = require("browser-sync").create(),

    input  = {
        'sass': 'source/scss/**/*.scss',
        'javascript': 'source/javascript/**/*.js',
        'vendorjs': 'public/assets/javascript/vendor/**/*.js'
    },

    output = {
        'stylesheets': 'public/assets/stylesheets',
        'javascript': 'public/assets/javascript'
    };

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['watch', 'browser-sync']);

/*reload with browser-sync*/
gulp.task('browser-sync', function(){
   browserSync.init({
       proxy: "localhost:8080",
       online:false
   })
});

/* run javascript through jshint */
gulp.task('jshint', function() {
    return gulp.src(input.javascript)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/* compile scss files */
gulp.task('build-css', function() {
    return gulp.src('source/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.stylesheets))
        .pipe(livereload())
        .pipe(browserSync.stream())
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function() {
    return gulp.src(input.javascript)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.javascript));
});

/* Watch these files for changes and run the task on update */
gulp.task('watch', function() {
    gulp.watch(input.javascript, ['jshint', 'build-js'], browserSync.reload);
    gulp.watch(input.sass, ['build-css'], browserSync.reload);

    livereload.listen();
});