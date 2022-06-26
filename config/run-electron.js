const { spawn } = require("child_process");
const os = require("os");
const find = require("find-process");
const paths = require("./paths");

module.exports = (index, proc) =>
{
	if (proc)
		proc.kill();

	find("name", "electron").then((list) =>
	{
		list.forEach((item) => 
		{
			if (item.bin.includes(paths.root))
				process.kill(item.pid);
		});

		proc = spawn(`electron${os.platform() === "win32" ? ".cmd" : ""}`, [index], { stdio: "inherit" });
	}, (err) => console.log(err.stack || err));
}

if (require.main === module)
{
	const [, , index] = process.argv;
	module.exports(index);
}