'use strict';


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var sassdoc         = require('sassdoc');
var livereload      = require('gulp-livereload');
var webserver       = require('gulp-webserver');
var opn             = require('opn');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var input = './public/scss/**/*.scss';
var output = './public/css';
var sassOptions = { outputStyle: 'expanded' };
var autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };
var sassdocOptions = { dest: './public/sassdoc' };

var server = {
    host: 'localhost',
    port: '8001'
};

// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------

gulp.task('sass', function () {
    return gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output))
        .pipe(livereload());
});


// -----------------------------------------------------------------------------
// Sass documentation generation
// -----------------------------------------------------------------------------

gulp.task('sassdoc', function () {
    return gulp
        .src(input)
        .pipe(sassdoc(sassdocOptions))
        .resume();
});


// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
    livereload.listen();
    return gulp
        // Watch the input folder for change,
        // and run `sass` task when something happens
        .watch(input, ['sass'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
// -----------------------------------------------------------------------------
// Server
// -----------------------------------------------------------------------------

gulp.task('webserver', function() {
    gulp.src( '.' )
        .pipe(webserver({
            host:             server.host,
            port:             server.port,
            livereload:       true,
            directoryListing: false
        }));
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port );
});


// -----------------------------------------------------------------------------
// Production build
// -----------------------------------------------------------------------------

gulp.task('prod', ['sassdoc'], function () {
    return gulp
        .src(input)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output));
});


// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', ['sass', 'webserver', 'watch', 'openbrowser' /*, possible other tasks... */]);