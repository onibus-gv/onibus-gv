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
      "bower_components/ionic/js/ionic.bundle.min.js",
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

gulp.task("watch", ["default"], function() {
  gulp.watch("app/**/*.html", ["html"]);
  gulp.watch("app/**/*.js", ["js"]);
  gulp.watch("app/**/*.scss", ["sass"]);
});

gulp.task("default", ["html", "js", "sass"]);
