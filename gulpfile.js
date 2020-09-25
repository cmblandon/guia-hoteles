'use strict'

let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync').create();
let del = require('del');
let imagemin = require('gulp-imagemin');
let uglify = require('gulp-uglify');
let usemin = require('gulp-usemin');
let rev = require('gulp-rev');
let cleanCss = require('gulp-clean-css');
let flatmap = require('gulp-flatmap');
let htmlmin = require('gulp-htmlmin');

sass.compiler = require('node-sass');

gulp.task('sass', ()=> {
    gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', ()=> {
    gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function(){
    var files = ['./*.html', './css/*.css', './images/*.{png, jpg, gif}', './js/*.js']
    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', gulp.parallel('browser-sync', 'sass'));

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('copyfonts', function(){
    gulp.src('./node_modules/open-iconic/font/fonts/*.{ttf,woff,eof,svg,eot,otf}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function(){
    return gulp.src('./images/*.{png,jpg,jpeg,gif}')
    .pipe(imagemin({optimizationLevel: 3, progressive: true, intelaced: true}))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('usemin', function(){
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
        .pipe(usemin({
            css: [rev()],
            html: [function(){return htmlmin({collapseWhitespace: true})}],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
        }));
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.parallel('clean', 'copyfonts', 'imagemin', 'usemin'));
