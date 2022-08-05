import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { createMenuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

import { ProjectManagerStore } from "./stores/ProjectStore";
import { openProjectModal } from "./modals/ProjectModal";

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

const InitializedApp = await RootStore.withApp(App, async (root, init) => 
{
	init(PanelManager, testLayout);
	init(AppMenuStore, createMenuLayout(root));

	if(!root.get(ProjectManagerStore).current)
		openProjectModal.open();
});

root.render(React.createElement(InitializedApp));