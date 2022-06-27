import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { menuLayout } from "./config/MenuLayout";
import { testLayout } from "./config/PanelLayoutConfig";
import { AppMenuStore, PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

import { Editor } from "@engine/editor";

import { Engine } from "@engine";

Editor.logEngine();
Editor.test();

const engine = new Engine();

console.log(engine);

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

root.render(React.createElement(RootStore.withApp(App, (init) => 
{
	init(PanelManager, testLayout);
	init(AppMenuStore, menuLayout);
})));