import { Modal, ModalManager, withStore, withStores } from "app/stores";
import { SceneManager } from "app/stores/SceneManager";
import { Button, Container, View } from "app/views";
import React from "react";
import { useModal } from "../components"

export const CreateSceneModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [val, setVal] = React.useState("");

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
		{
			if(sceneManager.createScene(val))
			{
				console.log("modal close");
				modal.close(true);
			}
		}
	}

	return (
		<View>
			<input value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKeyDown} />
		</View>
	);
});

export const OpenModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const createSceneModal = Modal.use({
		Component: CreateSceneModal,
		title: "Create Scene",
		maxWidth: 320,
		maxHeight: 220,
		minWidth: 320,
		minHeight: 220
	});

	return (
		<Container>
			{sceneManager.data.scenes.length === 0 ? (
				<View>
					There are no projects yet!
					<Button text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if(sceneCreated) modal.close() })} />
					{/* TODO: <Button text="Sync With Server" /> */}
				</View>
			) : (
				<View className="projects-list">
					<Button text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if(sceneCreated) modal.close() })} />
					{sceneManager.data.scenes.map((p, i) => 
					{
						return (
							<View key={i} className="project" onClick={() => { sceneManager.loadScene(p.name); modal.close(); }}>
								{p.name}
							</View>
						);
					})}
				</View>
			)}

		</Container>
	);
})