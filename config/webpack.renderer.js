const { resolve, dist, app, engine } = require("./paths");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const baseConfig = require("./webpack.base");

const rendererConfig = (dev = false) =>
{
	const base = baseConfig(dev);
	return {
		...base,
		name: "editor-renderer",
		target: "electron-renderer",
		entry: resolve(app, "index.ts"),
		output: {
			filename: `js/[name].js`,
			chunkFilename: 'js/[id].js',
			clean: true,
			path: resolve(dist, "app"),
		},
		plugins: [
			...base.plugins,
			new HtmlWebpackPlugin({
				template: resolve("public", "index.html")
			}),
			new MiniCssExtractPlugin({
				filename: `css/[name].bundle.css`,
				chunkFilename: `css/[id].chunk.css`,
				ignoreOrder: false
			}),
			new CopyPlugin({
				patterns: [
					{
						from: resolve("public"),
						to: resolve(dist, "app"),
						globOptions: {
							ignore: ["index.html"],
						},
					}
				]
			}),
		],
		module: {
			rules: [
				...base.module.rules,
				{
					test: /\.(glsl|vert|frag)$/i,
					use: "raw-loader",
				},
				{
					test: /\.s?(c|a)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
					exclude: /node_modules/
				},
				{
					test: /\.(jpe?g|png|gif|svg|ico|webp)$/i,
					use: {
						loader: "url-loader",
						options: {
							fallback: "file-loader",
							limit: 40000,
							name: "images/[name].[ext]",
						},
					},
				}
			]
		},
		resolve: {
			...base.resolve,
			alias: {
				engine: engine,
			}
		}
	};
}

module.exports = rendererConfig;