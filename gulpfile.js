const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync');
const minify = require('gulp-minify');
const clean = require('gulp-clean');
const critical = require('critical').stream;
const puppeteer = require("puppeteer");
const tap = require("gulp-tap");
const sitemap = require('gulp-sitemap');

sass.compiler = require('node-sass');

const server = browserSync.create();

gulp.task('asset-copy', () => gulp.src('./src/assets/**')
    .pipe(gulp.dest('./dist'))
);

gulp.task('sass', () => gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({
        level: 2,
        inline: ['local']
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(purgecss({
        content: ['./src/index.html'],
        whitelist: ['svg', 'prog', 'bg']
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

gulp.task('critical', () => gulp.src('./dist/index.html')
      .pipe(critical({
        base: './dist/',
        inline: true,
        css: [
          './dist/style.css'
        ]
      }))
      .pipe(gulp.dest('./dist'))
);

gulp.task('js', () => gulp.src('./src/*.js')
    .pipe(minify({
        noSource: true,
        ext:{
            min:'.js'
        },
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('clean', () => gulp.src('./dist/', {read: false, allowEmpty: true})
    .pipe(clean())
);

gulp.task('screenshot', () => gulp.src('./dist/index.html')
    .pipe(tap(async (file) => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 1
        });
        await page.goto("file://" + file.path);
        await page.screenshot({ path: "./dist/index_facebook_og.png" });
        await page.setViewport({
            width: 1200,
            height: 675,
            deviceScaleFactor: 1
        });
        await page.screenshot({ path: "./dist/index_twitter_card.png" });
        await browser.close();
    }))
);

gulp.task('sitemap', () => gulp.src('./dist/*.html')
    .pipe(sitemap({
        siteUrl: 'https://biraktim.tufantunc.com'
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

gulp.task('watch', () => gulp.watch('./src/*.{scss,html,js}', gulp.series(gulp.parallel(['sass', 'html', 'js']), gulp.parallel('critical', 'sitemap'))));

gulp.task('dev', gulp.series('clean', gulp.parallel('sass', 'html', 'js', 'asset-copy'), gulp.parallel('critical', 'sitemap'),  serve, 'watch'));

gulp.task('default', gulp.series(gulp.parallel('sass', 'html', 'js', 'asset-copy'), gulp.parallel('critical', 'screenshot', 'sitemap')));