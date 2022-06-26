import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { testLayout } from "./config/PanelLayoutConfig";
import { PanelManager } from "./stores";
import { RootStore } from "./stores/RootStore";

const rootEl = document.createElement("div");
rootEl.id = "root";
document.body.appendChild(rootEl);

const root = ReactDOM.createRoot(rootEl);

root.render(React.createElement(RootStore.withApp(App, (init) => 
{
	init(PanelManager, testLayout);
})));