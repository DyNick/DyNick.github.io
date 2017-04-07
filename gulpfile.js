var config        = require('./config.js'),
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    font2css      = require('gulp-font2css'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cssnano       = require('gulp-cssnano'),
    uglify        = require('gulp-uglify'),
    cache         = require('gulp-cache'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload;

gulp.task('sass', function(){
    return gulp.src(config.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(cssnano())
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write(config.maps))
        .pipe(gulp.dest(config.dest.css))
        .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    return gulp.src(config.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
         .pipe(uglify())
        .pipe(sourcemaps.write(config.maps))
        .pipe(gulp.dest(config.dest.js))
        .pipe(reload({stream: true}));
});

gulp.task('compress-image',function(){
    gulp.src(config.src.img)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.dest.img))
});
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*.{otf,ttf,woff,woff2}')
        .pipe(font2css())
        .pipe(concat('fonts.css'))
        .pipe(gulp.dest('build/'))
});

gulp.task('browserSyncLocal', function(){
    browserSync(config.browserSyncConfig);
    gulp.watch(config.watchSass, ['sass']);
    gulp.watch(config.watchJS, ['js']);
    gulp.watch(config.watchHtml,reload);
});
gulp.task('dev', ['js','sass','browserSyncLocal','compress-image']);