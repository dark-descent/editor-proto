const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = (dev = false) => ({
	mode: dev ? "development" : "production",
	devtool: dev ? "inline-source-map" : undefined,
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
		plugins: [
			new TsconfigPathsPlugin({})
		]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			env: JSON.stringify({
				isDev: dev,
				isEditor: true
			})
		})
	]
});