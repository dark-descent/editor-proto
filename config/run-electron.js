const { spawn } = require("child_process");
const os = require("os");
const find = require("find-process");
const paths = require("./paths");

let proc;

const start = (index = paths.distEntry) =>
{
	if (!proc)
	{
		console.log("Starting electron...");
		proc = spawn(`electron${os.platform() === "win32" ? ".cmd" : ""}`, [index], { stdio: "inherit" });
		proc.on("close", () => proc = null);
	}
}

const kill = () => new Promise(async (res, rej) => 
{
	if (proc)
	{
		console.log("Killing electron instance...");
		proc.on("close", () => 
		{
			setTimeout(() => 
			{
				res();
			}, 250);
		});
		const list = await find("name", "electron");
		list.forEach((item) => 
		{
			if (item.bin.includes(paths.root))
				process.kill(item.pid);
		});
		try
		{
			proc.kill();
		}
		catch (e)
		{
			rej(e);
		}
	}
	else
	{
		res();
	}
})

const run = async (index = paths.distEntry) => 
{
	await kill();
	start(index, true);
};

module.exports = {
	run,
	start,
	kill
};