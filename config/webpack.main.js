const { resolve, dist, main } = require("./paths");
const baseConfig = require("./webpack.base");

const mainConfig = (name = "main", dev = false) =>
{
	const base = baseConfig(dev);
	
	return {
		...base,
		name,
		target: "electron-main",
		entry: resolve(main, "index.ts"),
		output: {
			chunkFilename: '[id].js',
			path: dist,
		},
	};
};


module.exports = mainConfig;