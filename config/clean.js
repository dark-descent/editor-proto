const { dist, resolve } = require("./paths");
const fs = require("fs");

const rm = (path) =>
{
	if (fs.existsSync(path))
		fs.rmSync(path, { recursive: true, force: true });
}


rm(resolve("public/addon.node"));
rm(resolve("engine/build"));
rm(dist);