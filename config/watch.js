const mainConfig = require("./webpack.main")("main", true);
const rendererConfig = require("./webpack.renderer")("renderer", true);

const watchWebpack = require("./watch-webpack");
const watchAddon = require("../engine/config/watch");
const { kill, run, start } = require("./run-electron");

const { copyFileSync } = require("fs");
const { resolve } = require("./paths");

let didAddonCompile = false;
let didMainCompile = false;
let didRendererCompile = false;

const onWebpackCompiled = (err, name) =>
{
	if (!err)
	{
		if (name === "main")
		{
			if (didRendererCompile)
				run();
			didMainCompile = true;
		}
		else
		{
			if(didMainCompile)
				start();
			didRendererCompile = true;
		}
	}
}

watchAddon(async (hasError, buildPath) => 
{
	if (!didAddonCompile)
	{
		didAddonCompile = true;
		watchWebpack(mainConfig, onWebpackCompiled);
		watchWebpack(rendererConfig, onWebpackCompiled);
		copyFileSync(buildPath, resolve("public", "addon.node"));
	}
	else if (!hasError)
	{
		await kill();
		copyFileSync(buildPath, resolve("public", "addon.node"));
		start();
	}
});
