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
});

export const testLayout = PanelManager.createConfig(panels, "horizontal", [
	"test",
	"a",
	[
		"b",
		"c",
		"d"
	]
]);