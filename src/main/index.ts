import { app, BrowserWindow } from "electron";
import path from "path";

import fs from "fs";

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

app.whenReady().then(() => 
{
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
	});

	browserWindow.setMenu(null);

	browserWindow.loadFile(path.resolve(__dirname, "app", "index.html"), {});

	browserWindow.on("ready-to-show", () => 
	{
		browserWindow.maximize();
		browserWindow.show();
		browserWindow.webContents.openDevTools();
	});
});