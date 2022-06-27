import React from "react";
import { Menu, ModalSpawner, PanelLayout } from "./components";
import { ProjectModal } from "./modals/ProjectModal";
import { Modal } from "./stores";
import { FlexBox, FlexItem } from "./views";

export const App = () => 
{
	const projectModal = Modal.use({
		Component: ProjectModal,
		title: "Project"
	}, false);

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