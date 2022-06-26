const { fork } = require("child_process")

module.exports = (index, proc) =>
{
	if(proc)
		proc.kill();

	return fork("./config/run-electron.js", [index], { stdio: "inherit" });
}