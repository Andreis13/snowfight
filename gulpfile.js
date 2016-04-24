var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


gulp.task('css', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function(){
  browserify('src/scripts/controller.js', { debug: true })
    .bundle()
    .pipe(source('controller.js'))
    .pipe(gulp.dest('app/assets/js/'));


  browserify('src/scripts/snowfight.js', { debug: true })
    .bundle()
    .pipe(source('snowfight.js'))
    .pipe(gulp.dest('app/assets/js/'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch("src/styles/*/*.scss", ['css']);
    gulp.watch("src/scripts/**/*.js", ['js', 'bs-reload']);
    gulp.watch("app/*.html", ['bs-reload']);
});
