const { dist, engineBuild, addon, prodBuild } = require("./paths");
const fs = require("fs");

const rm = (path) =>
{
	if (fs.existsSync(path))
	{
		fs.rmSync(path, { recursive: true, force: true });
		console.log(`Removed ${path}`);
	}
}

rm(addon);
rm(engineBuild);
rm(dist);
rm(prodBuild);
console.log("Cleaned!");