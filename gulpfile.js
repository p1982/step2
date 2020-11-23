const gulp = require("gulp");
const gulpSass = require("gulp-sass");
const browserSync = require("browser-sync");
const gulpAutoPrefixer = require("gulp-autoprefixer");
const gulpConcat = require("gulp-concat");
const gulpMinifycss = require("gulp-clean-css");
const gulpImgmin = require("gulp-imagemin");
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const ghPages = require('gulp-gh-pages');

gulp.task("browser-sync", function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            // directory: true,
        },
        notify: false
    })
});
gulp.task("html", function () {
    return gulp
        .src("src/index.html")
        .pipe(gulp.dest("dist"))
});
gulp.task("scss", function (){
    return gulp
        .src("src/scss/**/*.scss")
        .pipe(gulpSass())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.reload({stream: true}))
});
gulp.task("js", function () {
    return gulp
         .src("src/js/*.js")
         .pipe(gulpConcat("common.min.js"))
         .pipe(uglify())
         .pipe(gulp.dest("dist/js"))
         .pipe(browserSync.reload({stream: true}))
});
gulp.task("watch", function() {
    gulp.watch("src/scss/**/*.scss", gulp.parallel("scss"));
    gulp.watch("*.html", gulp.parallel("code"));
    gulp.watch(["dist/js/min.js", "src/js/**/*.js"], gulp.parallel("js"));
});
gulp.task("code", function () {
    return gulp
        .src("*.html")
        .pipe(browserSync.reload({stream: true}))
});
gulp.task("clean", function () {
    return gulp
        .src("dist/*", {read: false})
        .pipe(clean())
});
gulp.task("modify", function () {
    return gulp
        .src("src/scss/**/*.scss")
        .pipe(gulpSass())
        .pipe(gulpAutoPrefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {cascade: true }))
        .pipe(gulpConcat("style.min.css"))
        .pipe(gulpMinifycss({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
});
gulp.task("img",  function () {
    return gulp
        .src("src/img/**/*")
        .pipe(gulpImgmin())
        .pipe(gulp.dest("dist/img"))
});
gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
gulp.task("build", gulp.series("clean", gulp.parallel("html", "modify", "js", "img"), "browser-sync", "watch"));
// gulp.task("dev", gulp.parallel("html", "modify", "js", "img", "browser-sync", "watch"));
gulp.task('deploy');