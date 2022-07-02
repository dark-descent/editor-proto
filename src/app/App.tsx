import React from "react";
import { Menu, ModalSpawner, PanelLayout } from "./components";
import { OpenModal } from "./modals/OpenModal";
import { Modal } from "./stores";
import { FlexBox, FlexItem } from "./views";

export const App = () => 
{
	const openModal = Modal.use({
		Component: OpenModal,
		title: "Project",
		canClose: () => false
	}, true);

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