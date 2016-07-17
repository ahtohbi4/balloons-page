'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const merge = require('merge-stream');

const posthtml = require('gulp-posthtml');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const bgImage = require('postcss-bgimage');

const PATHS = {
    src: './app/resources/views/pages/',
    dest: './build/'
};

gulp.task('clean', () => {
    return gulp.src(PATHS.dest, {
        read: false
    })
        .pipe(clean());
});

gulp.task('html', () => {
    let streamWithPlugin = gulp.src(`${PATHS.src}main.html`)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(`${PATHS.dest}without-plugin/`));

    let streamWithoutPlugin = gulp.src(`${PATHS.src}main.html`)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(`${PATHS.dest}with-plugin/`));

    return merge(streamWithPlugin, streamWithoutPlugin);
});

gulp.task('css', () => {
    let streamWithPlugin = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.css'))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest(`${PATHS.dest}without-plugin/`));

    let streamWithoutPluginTop = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.top.css'))
        .pipe(postcss([
            autoprefixer(),
            bgImage({
                mode: 'cutter'
            })
        ]))
        .pipe(gulp.dest(`${PATHS.dest}with-plugin/`));

    let streamWithoutPluginBottom = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.bottom.css'))
        .pipe(postcss([
            autoprefixer(),
            bgImage({
                mode: 'cutterInvertor'
            })
        ]))
        .pipe(gulp.dest(`${PATHS.dest}with-plugin/`));

    return merge(streamWithPlugin, streamWithoutPluginTop, streamWithoutPluginBottom);
});

gulp.task('default', [
    'css',
    'html'
]);

gulp.task('watch', ['default'], () => {
    gulp.watch(`${PATHS.src}*.css`, ['css']);
    gulp.watch(`${PATHS.src}*.html`, ['html']);
});
