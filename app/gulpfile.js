const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', () => {
    return gulp
        .src('dist', {allowEmpty: true})
        .pipe(clean());
});

gulp.task('static', gulp.series('clean', () => {
    return gulp
        .src(['src/**/*.json', 'src/**/**/*.js'])
        .pipe(gulp.dest('dist'));
}));

gulp.task('scripts', gulp.series('static', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('dist'));

}));

gulp.task('build', gulp.series('scripts'));