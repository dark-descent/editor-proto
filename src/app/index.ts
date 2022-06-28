import path from "path";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { menuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { EditorStore } from "./stores/EditorStore";
import { RootStore } from "./stores/RootStore";

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

const InitializedApp = await RootStore.withApp(App, async (root, init) => 
{
	await root.get(EditorStore).loadProject({
		name: "Test Project",
		path: path.resolve(__dirname, "../../test-project"),
	});

	init(PanelManager, testLayout);
	init(AppMenuStore, menuLayout);
});

root.render(React.createElement(InitializedApp));