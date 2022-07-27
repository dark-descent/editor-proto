import { createSceneModal, openSceneModal } from "app/modals/SceneModal";
import { MenuItemProps, MenuSeperator } from "app/stores";
import { AppStore } from "app/stores/AppStore";
import { RootStore } from "app/stores/RootStore";

export const createMenuLayout = (rootStore: RootStore): MenuItemProps[] => 
{
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
					subMenu: []
				},
				{
					label: "New Scene",
					onClick: () => { createSceneModal.open(); }
				},
				MenuSeperator,
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