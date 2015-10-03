var gulp = require('gulp');
var filter = require('gulp-filter');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var modRewrite  = require('connect-modrewrite');

// Assets paths
var paths = {
    site: 'mudrosti',
    sass: {
       src: 'assets/_scss/**/*.scss',
       app: 'assets/_scss/app.scss'
    },
    css: {
        src: [
            'assets/css/**/*.css',
        ],
        dest: 'assets/css/'
    },
    scripts: {
        src: [
            'assets/js/src/**/*.js',
        ],
        dest: 'assets/js/prod/'
    },
    ngApp: {
        src: [
            'app/src/app.js',
            'app/src/controllers/*.js',
            'app/src/directives/*.js',
            'app/src/services/*.js',
            'app/src/views/*.js',
        ],
        dest: 'app/prod/'
    },
    html: ['views/**/*.html'],
    images: {
        sprite: {
            src: 'assets/images/src/sprite/*.*',
            dest: 'assets/images/prod/sprite/',
            sass_des: 'assets/_scss/partials/sprites/'
        }
    }
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function (cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], cb);
});

// TASK: Compile Sass
gulp.task('sass', function () {
    gulp.src(paths.sass.app)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10
        }))
        .on('error', function (err) { console.log(err.message); })
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(filter('**/*.css'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', ['clean'], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts.src)
        //.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(reload({stream: true}));
});

gulp.task('ng-app', ['clean'], function () {
    // Minify and copy all JavaScript
    // with sourcemaps all the way down
    return gulp.src(paths.ngApp.src)
        //.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        //.pipe(uglify())
        .pipe(concat('ng-app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.ngApp.dest))
        .pipe(reload({stream: true}));
});

// Generate sprite
gulp.task('sprite', function () {
    var spriteData = gulp.src(paths.images.sprite.src).pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../../'+paths.images.sprite.dest+'sprite.png',
        cssFormat: 'scss',
        cssName: 'sprite.scss'
    }));

    // Pipe image stream through image optimizer and onto disk
    spriteData.img
        //.pipe(imagemin())
        .pipe(gulp.dest(paths.images.sprite.dest));

    //spriteData.img.pipe(gulp.dest(paths.images.sprite.dest)); // output path for the sprite
    spriteData.css.pipe(gulp.dest(paths.images.sprite.sass_des)); // output path for the SCSS
});

// Rerun the task when a file changes
gulp.task('watch', ['sass', 'scripts', 'sprite', 'ng-app'], function () {
    //browserSync.init({
    //    //server: {
    //        proxy: "http://"+paths.site+".localhost",
    //        //baseDir: "./",
    //        //middleware: [
    //        //    modRewrite([
    //        //        '^([^.]+)$ /index.html [L]'
    //        //    ])
    //        //]
    //    //},
    //    //tunnel: paths.site,
    //    //open: "tunnel"
    //});

    gulp.watch(paths.sass.src, ['sass']);
    gulp.watch(paths.scripts.src, ['scripts']);
    gulp.watch(paths.images.sprite.src, ['sprite']);
    gulp.watch(paths.html, reload);
    gulp.watch(paths.ngApp.src, ['ng-app']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);
