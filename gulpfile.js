const gulp = require('gulp');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
var svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const browserSync = require('browser-sync').create();

const paths = {
    root: './dist',
    templates: {
        pages: './src/views/pages/*.pug',
        src: './src/views/**/*.pug',
        dest: 'dist/'
    },
    styles: {
        main: './src/assets/styles/main.scss',
        src: './src/assets/styles/**/*.scss',
        dest: './dist/assets/styles'
    },
    fonts: {
        src: './src/assets/styles/fonts.scss',
        dest: './dist/assets/fonts/'
    },
    images: {
        src: './src/assets/images/*.*',
        dest: './dist/assets/images/'
    },
    scripts: {
        src: './src/assets/scripts/*.js',
        dest: './dist/assets/scripts/'
    }
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

function imgCompress() {
    return gulp.src('./src/assets/images/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/assets/images/'))
}

function clean() {
    return del(paths.root);
}

//svg-sprite
gulp.task('svgSprite', function() {
    return gulp.src('src/assets/images/icons/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }
    ))
    .pipe(gulp.dest('dist/assets/images/'));
})

function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    return gulp.src(paths.styles.main)
        .pipe(sourcemaps.init())
        .pipe(postcss(require("./postcss.config.js")))
        .pipe(sourcemaps.write())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest(paths.styles.dest))
}

//fonts
function fonts() {
    return gulp.src('src/assets/fonts/*.{otf,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/assets/fonts/'))
}

function images() {
    return gulp.src('src/assets/images/*.*')
        .pipe(gulp.dest('dist/assets/images/'))
}

//webpack
function scripts() {
    return gulp.src([paths.scripts.src])
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest))
}

exports.templates = templates;
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;
exports.imgCompress = imgCompress;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, fonts, images),
    gulp.parallel(watch, server)
));