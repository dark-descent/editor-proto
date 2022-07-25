const { readdirSync } = require("fs");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const entries = {};

readdirSync("src/components").forEach(e => entries["components/" + e] = "./src/components/" + e);

module.exports = {
	mode: "development",
	name: "test-game",
	target: "electron-renderer",
	entry: entries,
	output: {
		filename: `[name].js`,
		chunkFilename: "[id].js",
		path: path.resolve(__dirname, "build"),
		library: {
			name: "test-game",
			type: "umd",
		},
	},
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
	}
};