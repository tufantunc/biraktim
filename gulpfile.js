const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync');

sass.compiler = require('node-sass');

const server = browserSync.create();

gulp.task('sass', () => gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({
        level: 2,
        inline: ['local']
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(purgecss({
        content: ['./src/index.html']
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('html', () => gulp.src('./src/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(gulp.dest('./dist'))
);

const serve = (done) => {
    server.init({
        port: 3000,
        files: ["./dist/**/*.*"],
        server: {
            baseDir: ["./dist/"],
        },
        cors: true,
        https: true
  });
  done();
}

gulp.task('watch', () => gulp.watch('./src/*.{scss,html,js}', gulp.parallel(['sass', 'html'])));

gulp.task('dev', gulp.series(gulp.parallel('sass', 'html'),  serve, 'watch'));

gulp.task('default', gulp.parallel('sass', 'html'));
