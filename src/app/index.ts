import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { menuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

import { Engine } from "@engine";

try
{

	const engine = Engine.createEditorInstance();
	const gameEngine = Engine.createGameInstance();

	console.log(engine, gameEngine);
}
catch (e)
{
	console.warn(e);
}

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

root.render(React.createElement(RootStore.withApp(App, (init) => 
{
	init(PanelManager, testLayout);
	init(AppMenuStore, menuLayout);
})));