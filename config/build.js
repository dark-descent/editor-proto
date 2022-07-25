const isDev = process.env.NODE_ENV === "development";

const { webpack } = require("webpack");
const { engine, resolve } = require("./paths");
const mainConfig = require("./webpack.main");
const rendererConfig = require("./webpack.renderer");
const { fork } = require("child_process");
const { createReadStream, copyFileSync, existsSync, unlinkSync, cp, exists, mkdirSync, cpSync, writeFileSync } = require("fs");
const download = require('electron-download');
const pkg = require("../package.json");
const os = require("os");
const path = require("path");
const unzipper = require("unzipper");

const copy = () =>
{
	const appPath = path.resolve(__dirname, "../build/resources/app");
	if (!existsSync(appPath))
		mkdirSync(appPath)

	cpSync(path.resolve(__dirname, "../dist"), appPath, { force: true, recursive: true });
	writeFileSync(path.resolve(appPath, "package.json"), JSON.stringify({
		name: "@dark-descent/editor",
		version: "0.1.0",
		main: "main.js",
		repository: {
			type: "git",
			url: "git+https://github.com/dev-dmtrllv/dark-descent.git"
		},
		keywords: [],
		author: "Dimitri Lilov",
		contributors: [
			"Dimitri Lilov"
		],
		license: "ISC",
		bugs: {
			url: "https://github.com/dark-descent/editor/issues"
		},
		homepage: "https://github.com/dark-descent/editor#readme",
	}), "utf-8");
}

const buildAndCopyApp = () =>
{
	let compiledCount = 0;

	const onCompiled = (err, stats) =>
	{
		if (err)
			throw err;
		console.log(stats.toString("minimal"));
		compiledCount++;
		if (compiledCount == 2)
			copy();
	}

	const p = fork(`config/build.js`, ["..", isDev ? "--dev" : "--release"], { cwd: engine, stdio: "inherit", env: process.env });

	p.on("close", () => 
	{
		const addonBuildPath = resolve("engine", "build", isDev ? "Debug" : "Release", "addon.node");
		copyFileSync(addonBuildPath, resolve("public", "addon.node"));

		webpack(mainConfig(isDev), onCompiled);
		webpack(rendererConfig(isDev), onCompiled);

	});
};
if (!existsSync("../build"))
{
	download({
		version: pkg.devDependencies.electron.replace("^", ""),
		arch: os.arch(),
		platform: os.platform(),
		cache: path.resolve(__dirname, "../node_modules/.cache")
	}, (err, zipPath) =>
	{
		if (err)
			throw err;

		const rs = createReadStream(zipPath);
		rs.pipe(unzipper.Extract({
			path: path.resolve(__dirname, "../build")
		}));
		rs.on("close", () => 
		{
			unlinkSync(path.resolve(__dirname, "../build/resources/default_app.asar"));
			buildAndCopyApp();
		});
	});
}
else
{
	buildAndCopyApp();
}