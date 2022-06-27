import { EditPanel, ConsolePanel } from "app/panels";
import React from "react";
import { Panel, PanelManager } from "../stores";

const TestPanel = Panel.create("Test", () => React.createElement("h1", {}, "Test"));
const TestPanelA = Panel.create("Test", () => React.createElement("h1", {}, "Test A"));
const TestPanelB = Panel.create("Test", () => React.createElement("h1", {}, "Test B"));
const TestPanelC = Panel.create("Test", () => React.createElement("h1", {}, "Test C"));
const TestPanelD = Panel.create("Test", () => React.createElement("h1", {}, "Test D"));

const panels = PanelManager.createPanelMap({
	test: TestPanel,
	a: TestPanelA,
	b: TestPanelB,
	c: TestPanelC,
	d: TestPanelD,
	editor: EditPanel,
	console: ConsolePanel
});

export const testLayout = PanelManager.createConfig(panels, "horizontal", [
	"test",
	{
		child: {
			dir: "vertical",
			children: [
				{
					child: "editor",
					weight: window.innerHeight / 1.5,
				},
				"console"
			],
		},
		weight: window.innerWidth / 1.4
	},
	[
		"b",
		"c",
		"d"
	]
]);