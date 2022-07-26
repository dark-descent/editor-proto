import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "fs";

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
		title: "Dark Descent - Editor"
	});


	browserWindow.setMenu(null);

	browserWindow.loadFile(path.resolve(__dirname, "app", "index.html"), {});

	browserWindow.on("ready-to-show", () => 
	{
		browserWindow.maximize();
		browserWindow.show();
		browserWindow.webContents.openDevTools();
		console.log("READY :D");
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