
/* Gulp Task Pipeline */

// Imports //

import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gulp from "gulp";
import webpack from "webpack";
import webpackconfig from "./webpack.conf.js";
import webpackstream from "webpack-stream";
import del from "del";
import autoprefixer from "autoprefixer";
import eslint from "gulp-eslint";
import uglify from "gulp-uglify";
import cssnano from "cssnano";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import sass from "gulp-sass";
const browsersync = require("browser-sync").create();

// Hugo Arguments //

const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];

// Hugo //

function buildSite(cb, options, environment = "development") {

    const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;
    process.env.NODE_ENV = environment;
    return spawn(hugoBin, args, {stdio: "inherit"});
}

// BrowserSync //

function browserSync(done) {

	browsersync.init({

		server: {

			baseDir: "./dist"
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload //

function browserSyncReload(done) {

	browsersync.reload();
	done();
}

// Clean Distribution Folder //

function clean() {

	return del(["./dist"]);
}

// Image Optimisation //

function images() {
	
	return gulp
		.src("./site/static/medias/**/*")
		.pipe(newer("./dist/media"))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({

					plugins: [
						{
						removeViewBox: false,
						collapseGroups: true
						}
					]
				})
			])
		)
		.pipe(gulp.dest("./dist/media"));
}

// Copy Fonts //

function fonts() {

	return gulp
		.src("./src/fonts/*")
		.pipe(plumber())
		.pipe(gulp.dest("./dist/fonts"))
		.pipe(browsersync.stream());
}

// Minify & Prefix SCSS //

function scss() {

	return gulp
		.src("./src/scss/*.scss")
		.pipe(plumber())
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(gulp.dest("./dist/css"))
		.pipe(browsersync.stream());
}

// Script Linting //

function scriptsLint() {

	return gulp
		.src(["./src/js/**/*", "./gulpfile.babel.js"])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

// Concatenate, Compile & Minify Scripts //

function scripts() {
	
	return (

		gulp
			.src(["./src/js/**/*"])
			.pipe(plumber())
			.pipe(webpackstream(webpackconfig, webpack))
			.pipe(uglify())
			.pipe(gulp.dest("./dist/js"))
			.pipe(browsersync.stream())
	);
}

// Watch Files //

function watchFiles() {

	gulp.watch("./src/scss/**/*.scss", scss);
	gulp.watch("./src/fonts/**/*", fonts);
	gulp.watch("./src/js/**/*.js", gulp.series(scripts));
	gulp.watch(
		[
			"./site/**/*"
		],
		gulp.series(buildSite, browserSyncReload)
	);
	gulp.watch("./site/static/media/**/*", images);
}

// Tasks //

const lint = gulp.series(scriptsLint);
const build = gulp.series(clean, gulp.parallel(fonts, scss, images, scripts, buildSite));
const watch = gulp.parallel(watchFiles, browserSync);

// Export Tasks //

exports.images = images;
exports.fonts = fonts;
exports.scss = scss;
exports.scripts = scripts;
exports.buildSite = buildSite;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.clean = clean;
exports.lint = lint;