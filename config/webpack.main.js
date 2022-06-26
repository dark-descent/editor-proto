const { resolve, dist, main } = require("./paths");
const baseConfig = require("./webpack.base");

const mainConfig = (dev = false) =>
{
	const base = baseConfig(dev);
	
	return {
		...base,
		name: "editor-main",
		target: "electron-main",
		entry: resolve(main, "index.ts"),
		output: {
			chunkFilename: '[id].js',
			path: dist,
		},
	};
};


module.exports = mainConfig;