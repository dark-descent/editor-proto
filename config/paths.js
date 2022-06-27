const path = require("path");

const resolve = (...rest) => path.resolve(__dirname, "..", ...rest);

const root = resolve(".");
const src = resolve("src");

module.exports = {
	root,
	src,
	dist: resolve("dist"),
	main: resolve(src, "main"),
	app: resolve(src, "app"),
	engine: resolve("engine"),
	resolve,
}