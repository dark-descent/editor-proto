import { createSceneModal, openSceneModal } from "app/modals/OpenModal";
import { MenuItemClickHandler, MenuItemProps } from "app/stores";
import { AppStore } from "app/stores/AppStore";
import { RootStore } from "app/stores/RootStore";
// import { SceneManager } from "app/stores/SceneManager";

export const createMenuLayout = (rootStore: RootStore): MenuItemProps[] => 
{
	// const sceneManager = rootStore.get(SceneManager);
	const appStore = rootStore.get(AppStore);

	return [
		{
			label: "File",
			subMenu: [
				{
					label: "Save Scene",
					onClick: () => { console.log("saving scene..."); }
				},
				{
					label: "Open Scene",
					onClick: () => { openSceneModal.open(); },
					// subMenu: sceneManager.data.scenes.map((s) => ({ label: s.name, onClick: () => sceneManager.loadScene(s.name) }))
				},
				{
					label: "Create Scene",
					onClick: () => { createSceneModal.open(); }
				},
				{
					label: "Build",
					onClick: () => appStore.build()
				}
			]
		},
		{
			label: "Edit",
		},
		{
			label: "Windows",
		}
	];
};