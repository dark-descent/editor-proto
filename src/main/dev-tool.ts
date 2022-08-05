import path from "path";
import os from "os";
import fs from "fs/promises"

const getExtensionsPath = () =>
{
	switch (os.platform())
	{
		case "win32":
			{
				const appData = process.env.APPDATA;
				if (!appData)
					throw new Error(`Could not get %APPDATA%`);
				return path.resolve(appData, "..", "Local", "Google", "Chrome", "User Data", "Default", "Extensions");
			}
		default:
			throw new Error(`Could not get extensions path!`);
	}
};

export const findDevTools = async (...names: string[]) => 
{
	const p = getExtensionsPath();

	const foundPaths: string[] = [];

	const rootDirs = await fs.readdir(p, {});
	for (const dir of rootDirs)
	{
		const d = path.resolve(p, dir);
		const subDirs = await fs.readdir(d, {});

		for (const subDir of subDirs)
		{
			const subDirManifest = path.resolve(d, subDir, "manifest.json");
			try
			{
				const s = await fs.stat(subDirManifest, {});
				if (s.isFile())
				{
					const data = JSON.parse(await fs.readFile(subDirManifest, "utf-8"));
					if (names.includes(data.name))
						foundPaths.push(path.resolve(d, subDir));
				}
			}
			catch { }
		}
	}

	return foundPaths;
};

// export const 