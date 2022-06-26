import React from "react";
import { ModalSpawner } from "./components";
import { PanelLayout } from "./components/PanelLayout";
import { ProjectModal } from "./modals/ProjectModal";
import { Modal } from "./stores";
import { View } from "./views";

export const App = () => 
{
	const projectModal = Modal.use({
		Component: ProjectModal,
		title: "Project"
	}, false);

	return (
		<View absolute fill primary>
			<PanelLayout />
			<ModalSpawner />
		</View>
	);
};