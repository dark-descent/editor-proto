import React from "react";
import { Menu, ModalSpawner, PanelLayout } from "./components";
import { FlexBox, FlexItem } from "./views";

export const App = () => 
{
	return (
		<FlexBox vertical absolute fill primary className="app">
			<FlexItem base={18}>
				<Menu />
			</FlexItem>
			<FlexItem>
				<PanelLayout />
			</FlexItem>
			<ModalSpawner />
		</FlexBox>
	);
};