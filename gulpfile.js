const gulp = require('gulp');

const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');

gulp.task('html', () => {
    gulp.src('app/resources/views/pages/main.html')
        .pipe(rename('index.html'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('css', () => {
    gulp.src('app/resources/views/pages/main.css')
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./compiled/'));
});

gulp.task('default', [
    'css',
    'html'
]);

gulp.task('watch', ['default'], () => {
    gulp.watch(PATHS.src.css, ['css']);
    gulp.watch(PATHS.src.html, ['html']);
});
