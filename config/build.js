const isDev = process.env.NODE_ENV === "development";

const { webpack } = require("webpack");
const { engine, resolve } = require("./paths");
const mainConfig = require("./webpack.main");
const rendererConfig = require("./webpack.renderer");
const { fork } = require("child_process");
const { copyFileSync } = require("fs");

const onCompiled = (err, stats) =>
{
	if(err)
		throw err;
	console.log(stats.toString("minimal"));
}

const p = fork(`config/build.js`, ["..", isDev ? "--dev" : "--release"], { cwd: engine, stdio: "inherit", env: process.env });
p.on("close", () => 
{
	const addonBuildPath = resolve("engine", "build", isDev ? "Debug" : "Release", "addon.node");
	copyFileSync(addonBuildPath, resolve("public", "addon.node"));

	webpack(mainConfig(isDev), onCompiled);
	webpack(rendererConfig(isDev), onCompiled);
});
