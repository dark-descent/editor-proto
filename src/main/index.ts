import { app, BrowserWindow, dialog, ipcMain, session } from "electron";
import path from "path";
import fs from "fs";
import { findDevTools } from "./dev-tool";

const isDev = process.env.NODE_ENV === "development";

const pkg = __non_webpack_require__(path.resolve(__dirname, isDev ? ".." : ".", "package.json"));

const appDataPath = path.resolve(app.getPath("appData"), pkg.name);

let browserWindow: BrowserWindow;

if (env.isDev)
{
	const appPath = path.resolve(__dirname, "app");

	if (!fs.existsSync(appPath))
		fs.mkdirSync(appPath);

	fs.watch(appPath, () => browserWindow && browserWindow.webContents.reload());
}

app.commandLine.appendSwitch('enable-features', "SharedArrayBuffer");
app.commandLine.appendSwitch('enable-unsafe-webgpu');

app.whenReady().then(async () => 
{
	if (isDev)
	{
		console.log("Loading Dev Tools...");
		const devToolPaths = await findDevTools("React Developer Tools", "MobX Developer Tools");
		for (const p of devToolPaths)
			await session.defaultSession.loadExtension(p);
	}

	browserWindow = new BrowserWindow({
		maximizable: true,
		center: true,
		fullscreen: false,
		show: false,
		paintWhenInitiallyHidden: true,
		webPreferences: {
			backgroundThrottling: true,
			allowRunningInsecureContent: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			contextIsolation: false,
			devTools: true
		},
		title: "Dark Descent - Editor"
	});


	browserWindow.setMenu(null);

	browserWindow.loadFile(path.resolve(__dirname, "app", "index.html"), {});

	browserWindow.on("ready-to-show", () => 
	{
		console.log("READY :D");
		browserWindow.maximize();
		browserWindow.show();
		browserWindow.webContents.openDevTools();
	});
});

app.on("window-all-closed", () => 
{
	console.log("QUIT :D");
	app.quit();
});

ipcMain.on("get-app-data-path", (e) => 
{
	e.returnValue = appDataPath;
});

ipcMain.handle("get-dir", async (e) => 
{
	const result = await dialog.showOpenDialog(browserWindow, {
		properties: ['openDirectory'],
	});
	e.returnValue = result.filePaths[0];
	return result.filePaths[0];
});