import React from "react";
import { Menu, ModalSpawner, PanelLayout } from "./components";
import { OpenModal } from "./modals/OpenModal";
import { Modal } from "./stores";
import { EditorStore } from "./stores/EditorStore";
import { RootStore } from "./stores/RootStore";
import { SceneStore } from "./stores/SceneStore";
import { FlexBox, FlexItem } from "./views";

const hasOpenScenes = () => !!(RootStore.get(EditorStore).project && RootStore.get(SceneStore).hasOpenScenes);

export const App = () => 
{
	const openModal = Modal.use({
		Component: OpenModal,
		title: "Project",
		canClose: hasOpenScenes
	}, !hasOpenScenes());

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