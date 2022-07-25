import { MenuItemClickHandler, MenuItemProps } from "app/stores";
import { RootStore } from "app/stores/RootStore";
import { SceneManager } from "app/stores/SceneManager";



export const createMenuLayout = (rootStore: RootStore): MenuItemProps[] => 
{
	const sceneManager = rootStore.get(SceneManager);

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
					subMenu: sceneManager.data.scenes.map((s) => ({ label: s.name, onClick: () => sceneManager.loadScene(s.name) }))
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