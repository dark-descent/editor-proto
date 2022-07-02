const { exec } = require("child_process");
const { webpack } = require("webpack");
const { engine } = require("./paths");
const run = require("./run");
const mainConfig = require("./webpack.main");
const rendererConfig = require("./webpack.renderer");

let proc;

const watchEditor = (cb = () => { }) => 
{
	const addonProc = exec("npm run watch ..", { cwd: engine });

	addonProc.stdout.pipe(process.stdout);
	addonProc.stdin.pipe(process.stdin);
	addonProc.stderr.pipe(process.stderr);

	webpack(mainConfig(true)).watch({ ignored: ["src/editor/app/*", "engine/*"] }, (err, stats) => 
	{
		if (err)
		{
			console.error(err);
		}
		else
		{
			console.log(stats.toString("minimal"));
			proc = run("./dist/main.js", proc);
			proc.on("exit", () => { console.log("exit"); proc = null; });
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
			
			if (proc === null)
			{
				proc = run("./dist/main.js", proc);
				proc.on("exit", () => proc = null);
			}
		}
		cb(err, stats);
	});
}

if (require.main === module)
	watchEditor();
else
	module.exports = watchEditor;
