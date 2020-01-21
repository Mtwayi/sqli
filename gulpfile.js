var gulp = require('gulp');
// var sass = require('gulp-sass');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var copy = require('gulp-copy');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Watching files
gulp.task('watch', function() {
    browserSync.init({
        proxy: 'http://197.185.157.242:8080',
        port: '8081'
    });
    gulp.watch("components/scripts/*.js", gulp.series('uglifyJS'));
    gulp.watch("components/styles/**/*.less", gulp.series('build-less'));
    gulp.watch('components/images/**/*.{jpg,png,gif}', gulp.series('imagemin'));
    gulp.watch("**/*.html").on('change', reload);
});

// Rename and Uglify JS
gulp.task('uglifyJS', function() {
    return gulp.src(['components/scripts/*.js'])
        /*.pipe(rename({
          suffix: ".min",
          extname: ".js"
        }))
        .pipe(uglify())*/
        .pipe(gulp.dest('public/js/'));
});

// Rename and Minify CSS
gulp.task('minifyCSS', function() {
    gulp.src('components/styles/**/*.less')
        /*.pipe(less().on('error', less.logError))
        .pipe(rename({
          suffix: ".min",
          extname: ".css"
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))*/
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

// Compiles LESS > CSS 
gulp.task('build-less', function() {
    return gulp.src('components/styles/sqli.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});

// Copying Fonts to Public Folder
gulp.task('copy-fonts', function() {
    return gulp.src(['components/fonts/**/*.*'])
        .pipe(copy('public/fonts/', { prefix: 4 }));
});

// Optimize Images
gulp.task('imagemin', function() {
    return gulp.src('components/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('public/images/'));
});

// gulp.task('build', ['copy-fonts', 'uglifyJS', 'build-less', 'imagemin']);
// gulp.task('default', ['watch']);

gulp.task('build', gulp.series('copy-fonts', 'uglifyJS', 'build-less', 'imagemin'));
gulp.task('default', gulp.series('watch'));