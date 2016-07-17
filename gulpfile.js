'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const merge = require('merge-stream');

const posthtml = require('gulp-posthtml');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const bgImage = require('postcss-bgimage');

/**
 * Paths
 *
 * @type {object}
 */
const PATHS = {
    src: './app/resources/views/pages/',
    dest: './build/',
    destWithoutPlugin: './build/without-plugin/',
    destWithPlugin: './build/with-plugin/'
};

gulp.task('clean', () => {
    return gulp.src(PATHS.dest, {
        read: false
    })
        .pipe(clean());
});

/**
 * Appends a link.
 *
 * @param {object} tree
 * @param {string} parent
 * @param {string} fileName
 *
 * @returns {boolean}
 */
const appendLink = (tree, parent, fileName) => {
    tree.match({
        tag: parent
    }, (node) => {
        let link = {
            tag: 'link',
            attrs: {
                rel: 'stylesheet',
                href: fileName
            }
        };

        node.content.push('\n    ');
        node.content.push(link);
        node.content.push('\n');

        return node;
    });
};

/**
 * Build of HTML
 */
gulp.task('html', () => {
    let streamWithPlugin = gulp.src(`${PATHS.src}main.html`)
        .pipe(rename('index.html'))
        .pipe(posthtml((tree) => {
            appendLink(tree, 'head', 'style.css');
        }))
        .pipe(gulp.dest(PATHS.destWithPlugin));

    let streamWithoutPlugin = gulp.src(`${PATHS.src}main.html`)
        .pipe(rename('index.html'))
        .pipe(posthtml((tree) => {
            appendLink(tree, 'head', 'style.top.css');
        }))
        .pipe(posthtml((tree) => {
            appendLink(tree, 'body', 'style.bottom.css');
        }))
        .pipe(gulp.dest(PATHS.destWithoutPlugin));

    return merge(streamWithPlugin, streamWithoutPlugin);
});

/**
 * Build of CSS
 */
gulp.task('css', () => {
    let streamWithPlugin = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.css'))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest(PATHS.destWithPlugin));

    let streamWithoutPluginTop = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.top.css'))
        .pipe(postcss([
            autoprefixer(),
            bgImage({
                mode: 'cutter'
            })
        ]))
        .pipe(gulp.dest(PATHS.destWithoutPlugin));

    let streamWithoutPluginBottom = gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.bottom.css'))
        .pipe(postcss([
            autoprefixer(),
            bgImage({
                mode: 'cutterInvertor'
            })
        ]))
        .pipe(gulp.dest(PATHS.destWithoutPlugin));

    return merge(streamWithPlugin, streamWithoutPluginTop, streamWithoutPluginBottom);
});

/**
 * Build by default
 */
gulp.task('default', [
    'css',
    'html'
]);

/**
 * Build in watch
 */
gulp.task('watch', ['default'], () => {
    gulp.watch(`${PATHS.src}*.css`, ['css']);
    gulp.watch(`${PATHS.src}*.html`, ['html']);
});
