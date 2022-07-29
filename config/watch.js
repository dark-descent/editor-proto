const { fork } = require("child_process");
const find = require("find-process");
const { copyFileSync, watch, existsSync } = require("fs");
const { platform } = require("os");
const { webpack } = require("webpack");
const { engine, resolve, root } = require("./paths");
const run = require("./run");
const mainConfig = require("./webpack.main");
const rendererConfig = require("./webpack.renderer");

const isWin = platform() === "win32";

const watchEditor = (cb = () => { }) => 
{
	let editorProc;

	const startEditor = async () =>
	{
		await killEditor();
		editorProc = run("./dist/main.js", editorProc);
		editorProc.on("exit", () => { editorProc = null; });
	}

	const killEditor = () => find("name", "electron").then((list) =>
	{
		if (editorProc)
			editorProc.kill();
		editorProc = null;
		list.forEach((item) => 
		{
			if (item.bin.includes(root))
			{
				try
				{
					process.kill(item.pid);
				}
				catch { }
			}
		});
	}, (err) => console.log(err.stack || err));

	fork("config/watch.js", [".."], { cwd: engine, stdio: "inherit" });

	let copyTimeout = null;

	if (isWin)
	{
		const addonBuildPath = resolve("engine", "build", "Debug", "addon.node");
		watch(resolve("engine"), { recursive: true }, (e, name) => 
		{
			if (name && name.startsWith("build\\Debug\\addon.lib"))
			{
				copyTimeout && clearTimeout(copyTimeout);

				copyTimeout = setTimeout(async () => 
				{
					console.log(addonBuildPath);
					if (existsSync(addonBuildPath))
					{
						try
						{
							await killEditor();
						}
						catch { }

						copyFileSync(addonBuildPath, resolve("public", "addon.node"));
					}
				}, 500);
			}
		});
	}

	webpack(mainConfig(true)).watch({ ignored: ["src/editor/app/*", "engine/*"] }, (err, stats) => 
	{
		if (err)
		{
			console.error(err);
		}
		else
		{
			console.log(stats.toString("minimal"));
			startEditor();
		}
		cb(err, stats);
	});

	webpack(rendererConfig(true)).watch({ ignored: ["engine/src/addon/*"] }, (err, stats) => 
	{
		if (err)
		{
			console.error(err);
		}
		else
		{
			console.log(stats.toString("minimal"));
		}
		cb(err, stats);
	});
}

if (require.main === module)
	watchEditor();
else
	module.exports = watchEditor;
