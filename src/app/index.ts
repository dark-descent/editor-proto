import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { createMenuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

import { Engine } from "@engine";
import { AppStore } from "./stores/AppStore";
import { ProjectStore } from "./stores/ProjectStore";
import { openProjectModal } from "./modals/ProjectModal";

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

const InitializedApp = await RootStore.withApp(App, async (root, init) => 
{
	const engine = await Engine.initialize({
		gameName: "Dark Descent",
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

	init(PanelManager, testLayout);
	init(AppMenuStore, createMenuLayout(root));
	init(AppStore, { engine });

	if(!root.get(ProjectStore).isLoaded)
		openProjectModal.open();
});

root.render(React.createElement(InitializedApp));