/*jslint node: true, nomen: true, es5: true */
'use strict';

var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    del = require('del');

gulp.task('clean', function (done) {
    del(['dist'], done);
});

gulp.task('obfuscate', ['clean'], function () {
    return gulp.src('./*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({
                empty: true
            })],
            js: [ngAnnotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['obfuscate']);