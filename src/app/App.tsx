import React from "react";
import { Menu, ModalSpawner, PanelLayout } from "./components";
import { ProjectModal } from "./modals/ProjectModal";
import { Modal } from "./stores";
import { RootStore } from "./stores/RootStore";
import { SceneStore } from "./stores/SceneStore";
import { FlexBox, FlexItem } from "./views";

export const App = () => 
{
	const projectModal = Modal.use({
		Component: ProjectModal,
		title: "Project"
	}, !RootStore.get(SceneStore).hasOpenScenes);

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