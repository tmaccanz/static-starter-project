
/* Webpack Configurations */

import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

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

	mode: "none",

  	context: path.join(__dirname, "src"),
  	entry: {

    	main: ["./js/main"],
  	},
 	output: {

		path: path.join(__dirname, "dist/js/"),
		publicPath: "/",
		filename: "[name].min.js"
  	},
  	resolve: {

	},

plugins: [
  new webpack.ProvidePlugin({
    "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
  }),
  new ExtractTextPlugin('/css/main.css')
],

  externals:  [/^vendor\/.+\.js$/]
};