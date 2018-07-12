var gulp = require("gulp");
var concat = require("gulp-concat");
var sass = require("gulp-sass");

// **** Start Task Definition ****

gulp.task("html", function(done) {
  return gulp.src(["app/**/*.html"]).pipe(gulp.dest("www/views/"));
});

gulp.task("js", function(done) {
  return gulp
    .src([
      "node_modules/babel-polyfill/dist/polyfill.min.js",
      "node_modules/squel/dist/squel.js",
      "node_modules/ionic-sdk/release/js/ionic.bundle.min.js",
      "app/**/*.js",
      "!app/**/*.test.js",
      "!app/**/*.e2e.js"
    ])
    .pipe(concat("dist.js"))
    .pipe(gulp.dest("www/js/"));
});

gulp.task("sass", function(done) {
  gulp
    .src(["scss/ionic.app.scss", "app/**/*.scss"])
    .pipe(sass())
    .pipe(concat("dist.css"))
    .on("error", sass.logError)
    .pipe(gulp.dest("www/css/"))
    .on("end", done);
});

gulp.task("watch", function() {
  gulp.watch("app/**/*.html", gulp.series("html"));
  gulp.watch("app/**/*.js", gulp.series("js"));
  gulp.watch("app/**/*.scss", gulp.series("sass"));
});

gulp.task("default", gulp.parallel("html", "js", "sass"));
