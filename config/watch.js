const { webpack } = require("webpack");
const run = require("./run");
const mainConfig = require("./webpack.main");
const rendererConfig = require("./webpack.renderer");

let proc;

const watchEditor = (cb = () => { }) => 
{
	webpack(mainConfig(true)).watch({ ignored: ["editor/app/*"] }, (err, stats) => 
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

	webpack(rendererConfig(true)).watch({}, (err, stats) => 
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
