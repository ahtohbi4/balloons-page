const gulp = require('gulp');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

const posthtml = require('gulp-posthtml');
const minifier = require('posthtml-minifier');

const PATHS = {
    src: './app/resources/views/pages/',
    dest: './build/'
};

gulp.task('clean', () => {
    gulp.src(PATHS.dest, {
        read: false
    })
        .pipe(clean());
});

gulp.task('html', () => {
    gulp.src(`${PATHS.src}main.html`)
        .pipe(rename('index.html'))
        .pipe(posthtml([
            minifier({
                collapseWhitespace: true,
                removeComments: true
            })
        ]))
        .pipe(gulp.dest(`${PATHS.dest}a/`))
        .pipe(gulp.dest(`${PATHS.dest}b/`));
});

gulp.task('css', () => {
    gulp.src(`${PATHS.src}main.css`)
        .pipe(rename('style.css'))
        .pipe(gulp.dest(`${PATHS.dest}a/`))
        .pipe(gulp.dest(`${PATHS.dest}b/`));
});

gulp.task('default', [
    'css',
    'html'
]);

gulp.task('watch', ['default'], () => {
    gulp.watch(`${PATHS.src}*.css`, ['css']);
    gulp.watch(`${PATHS.src}*.html`, ['html']);
});
