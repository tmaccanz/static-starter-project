
/* Webpack Configurations */

import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  
  	module: {

    	rules: [
      	{

			test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
			loader: "file-loader?name=/[hash].[ext]"
		}, 
      	{
			test: /\.json$/, loader: "json-loader"
		},
      	{
			loader: "babel-loader",
			test: /\.js?$/,
			exclude: /node_modules/,
			query: {cacheDirectory: true}
      	},
      	{
        	test: /\.scss$/,
        	use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader']
        	})
      	}
    	]
  	},

  	context: path.join(__dirname, "src"),
  	entry: {

    	main: ["./js/main"],
  	},
 	output: {

		path: path.join(__dirname, "dist/js/"),
		publicPath: "/",
		filename: "[name].js"
  	},
  	resolve: {

    	alias: {
			
			"TweenLite": path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
			"TweenMax": path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
			"TimelineLite": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
			"TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
			"ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
			"animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
			"debug.addIndicators": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
    	}
	},

plugins: [
  new webpack.ProvidePlugin({
    "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
  }),

  new ExtractTextPlugin('/css/main.css')
],
  externals:  [/^vendor\/.+\.js$/]
};
