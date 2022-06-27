import { MenuItemClickHandler, MenuItemProps } from "app/stores";

const onSceneOpen: MenuItemClickHandler = (e, item) =>
{
	console.log(`Open scene ${item.label}`);
};

export const menuLayout: MenuItemProps[] = [
	{
		label: "File",
		subMenu: [
			{
				label: "Save Scene",
				onClick: () => { console.log("saving scene..."); }
			},
			{
				label: "Open Scene",
				subMenu: [
					{
						label: "Test Scene",
						onClick: onSceneOpen,
					},
					{
						label: "Test Scene 2",
						onClick: onSceneOpen,
					},
					{
						label: "Test Scene 3",
						onClick: onSceneOpen,
					}
				]
			},
			// {
			// 	label: "Load Scene"
			// },
			// MenuSeperator,
			// {
			// 	label: "Load Scene"
			// }
		]
	},
	{
		label: "Edit",
	},
	{
		label: "Windows",
	}
];