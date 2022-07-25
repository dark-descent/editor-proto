import { Modal, ModalManager, withStore, withStores } from "app/stores";
import { RootStore } from "app/stores/RootStore";
import { SceneManager } from "app/stores/SceneManager";
import { Button, Container, View } from "app/views";
import React from "react";
import { preventEvent } from "utils";
import { getClassFromProps } from "utils/react";
import { useModal } from "../components";

import "./styles/open-modal.scss";

const CreateSceneModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [val, setVal] = React.useState("");

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
		{
			if (sceneManager.createScene(val))
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

export const createSceneModal = Modal.create({
	Component: CreateSceneModal,
	title: "Create Scene",
	maxWidth: 320,
	maxHeight: 220,
	minWidth: 320,
	minHeight: 220
});

const RenameSceneModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [val, setVal] = React.useState("");

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
		{
			if (sceneManager.createScene(val))
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

export const renameSceneModal = Modal.create({
	Component: RenameSceneModal,
	title: "Create Scene",
	maxWidth: 320,
	maxHeight: 220,
	minWidth: 320,
	minHeight: 220
});

const OpenModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [editTarget, setEditTarget] = React.useState(-1);

	const onSceneEditClicked = (index: number) =>
	{
		setEditTarget(index);
	};

	return (
		<Container className="open-modal">
			{sceneManager.data.scenes.length === 0 ? (
				<View>
					There are no projects yet!
					<Button text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if (sceneCreated) modal.close() })} />
					{/* TODO: <Button text="Sync With Server" /> */}
				</View>
			) : (
				<View className="projects-list">
					<Button text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if (sceneCreated) modal.close() })} />
					{sceneManager.data.scenes.map((p, i) => 
					{
						return (
							<View key={i} className={getClassFromProps("scene", { active: i === editTarget })} onClick={() => { sceneManager.loadScene(p.name); modal.close(); }}>
								{p.name}
								<View absolute className="edit-btn" onClick={(e) => { preventEvent(e); onSceneEditClicked(i); }}>
									<View fill className="inner-btn" />
								</View>
								{i === editTarget && (
									<View absolute className="edit-panel">
										<View onClick={() => renameSceneModal.open().then((newName) => sceneManager.renameScene(p.name, newName))}>
											Rename
										</View>
										<View>
											Delete
										</View>
									</View>
								)}
							</View>
						);
					})}
				</View>
			)}

		</Container>
	);
});

export const openSceneModal = Modal.create({
	Component: OpenModal,
	title: "Scenes",
	canClose: () => RootStore.get(SceneManager).loadedScenes.length > 0,
}, true);
