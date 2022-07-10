import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { menuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

import { Engine } from "@engine";

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

const InitializedApp = await RootStore.withApp(App, async (root, init) => 
{
	init(PanelManager, testLayout);
	init(AppMenuStore, menuLayout);
});

root.render(React.createElement(InitializedApp));

const engine = Engine.initialize({
	gameName: "Test",
	logHandler: (level, msg) => 
	{
		switch (level)
		{
			case "exception":
			case "error":
				console.error(msg);
				break;
			case "info":
				console.info(msg);
				break;
			case "warn":
				console.warn(msg);
				break;
		}
	}
});

console.log(engine);

// engine.systems.Renderer.on("test", (data) => 
// {
// 	console.log(data.test ? ":D" : ":(");
// });

// engine.systems.Renderer.testEvent("test", { test: true });
// engine.systems.Renderer.testEvent("test", { test: false });