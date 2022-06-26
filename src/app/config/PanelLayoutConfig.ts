import React from "react";
import { PanelBoxProps } from "../stores";

export const initPanelLayoutConfig: PanelBoxProps = {
	dir: "horizontal",
	children: [
		{
			child: {
				title: "A",
				fc: () => React.createElement("h1", {}, "AAAA"),
				menu: {
					items: [
						{
							label: "test",
							onClick: () => { console.log("test clicked!") }
						},
						{
							label: "test2",
							onClick: () => { console.log("test2 clicked!") }
						}
					]
				}
			},
			weight: 260
		},
		{
			child: {
				title: "B",
				fc: () => React.createElement("h1", {}, "BBBB"),
				menu: {
					items: [
						{
							label: "test",
							onClick: () => { console.log("test clicked!") }
						},
						{
							label: "test2",
							onClick: () => { console.log("test2 clicked!") }
						}
					]
				}
			},
		},
		{
			weight: 260,
			child: {
				dir: "vertical",
				children: [
					{
						child: {
							title: "C",
							fc: () => React.createElement("h1", {}, "CCCC"),
						}
					},
					{
						child: {
							title: "D",
							fc: () => React.createElement("h1", {}, "DDDD"),
						},
					},
					{
						child: {
							title: "E",
							fc: () => React.createElement("h1", {}, "EEEE"),
						},
					},
					{
						child: {
							title: "F",
							fc: () => React.createElement("h1", {}, "FFFF"),
						},
					},
					{
						child: {
							title: "G",
							fc: () => React.createElement("h1", {}, "GGGG"),
						},
						weight: 260
					},
					{
						child: {
							title: "H",
							fc: () => React.createElement("h1", {}, "HHHH"),
						},
					},
				]
			}
		},
	]
}