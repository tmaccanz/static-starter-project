import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import watch from "gulp-watch";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import autoprefixer from "autoprefixer";
import sass from "gulp-sass";
import cssNano from "gulp-cssnano";
import imagemin from "gulp-imagemin";
import imageminJPG from "imagemin-jpeg-recompress"
import imageminPngquant from "imagemin-pngquant";
import del from "del";
import cache from 'gulp-cache';


const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", ["scss", "js", "fonts", "min", "clear"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["scss", "js", "fonts", "min"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile SCSS
gulp.task("scss", () => (
  gulp.src("./src/scss/*.scss")
    .pipe(sass({
      outputStyle:  "nested",
      precision: 10,
      includePaths: ["node_modules"],
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(cssNano())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Image minification

gulp.task('min', () =>
	gulp.src('site/static/images/*')
		.pipe(cache(imagemin(
      [imageminPngquant(), imageminJPG()],
      {verbose: true}
    )))
		.pipe(gulp.dest('dist/images'))
);


//Clean folders/files

gulp.task('clean', function(){
  return del('dist/images/*', {force:true});
});

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Development server with browsersync
gulp.task("server", ["hugo", "scss", "js", "fonts", "clean", "min"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  watch("./src/js/**/*.js", () => { gulp.start(["js"]) });
  watch("./src/scss/**/*.scss", () => { gulp.start(["scss"]) });
  watch("./src/fonts/**/*", () => { gulp.start(["fonts"]) });
  watch("./site/**/*", () => { gulp.start(["hugo"]) });
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}

gulp.task('clear', () =>
    cache.clearAll()
);