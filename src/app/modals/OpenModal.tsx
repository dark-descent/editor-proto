import { Modal, ModalManager, withStore, withStores } from "app/stores";
import { RootStore } from "app/stores/RootStore";
import { SceneManager } from "app/stores/SceneManager";
import { Button, Container, View } from "app/views";
import React from "react";
import { preventEvent } from "utils";
import { getClassFromProps, useRefState } from "utils/react";
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

	const [val, setVal] = React.useState(modal.openValue || "");

	const ref = React.useRef<HTMLInputElement | null>();

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
			modal.close(val);
	};

	React.useEffect(() => 
	{
		if (ref.current)
			ref.current.focus();
	}, []);

	return (
		<View>
			<input value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKeyDown} ref={(input) => ref.current = input} />
		</View>
	);
});

export const renameSceneModal = Modal.create({
	Component: RenameSceneModal,
	title: "Rename Scene",
	maxWidth: 320,
	maxHeight: 220,
	minWidth: 320,
	minHeight: 220
});

const OpenModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [editTarget, setEditTarget, editTargetRef] = useRefState(-1);

	const onWindowClicked = (e: MouseEvent) =>
	{
		if (editTargetRef.current > -1)
		{
			e.preventDefault();
			e.stopPropagation();
			setEditTarget(-1);
		}
	};

	const onSceneClick = (name: string) => (e: React.MouseEvent) =>
	{
		if (editTarget === -1)
		{
			sceneManager.loadScene(name);
			modal.close();
		}
	}

	const onEditClicked = (i: number) => (e: React.MouseEvent) =>
	{
		if (editTarget === -1)
			setEditTarget(i);
		else
			setEditTarget(-1);
		e.preventDefault();
		e.stopPropagation();
	}

	const onRenameClicked = (name: string) => (e: React.MouseEvent) =>
	{
		e.preventDefault();
		e.stopPropagation();
		setEditTarget(-1);
		renameSceneModal.open(name).then((newName) => 
		{
			if(name !== newName)
				sceneManager.renameScene(name, newName);
		});
	}

	const onDeleteClicked = (name: string) => () =>
	{
		sceneManager.removeScene(name);
		setEditTarget(-1);
	}

	const onOverlayClicked = () =>
	{
		setEditTarget(-1);
	}

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
							<View key={i} className={getClassFromProps("scene", { active: i === editTarget })} onClick={onSceneClick(p.name)}>
								{p.name}
								<View absolute className="edit-btn" onClick={onEditClicked(i)}>
									<View fill className="inner-btn" />
								</View>
								{
									i === editTarget && (
										<View absolute className="edit-panel">
											<View onClick={onRenameClicked(p.name)}>
												Rename
											</View>
											<View onClick={onDeleteClicked(p.name)}>
												Delete
											</View>
										</View>
									)
								}
							</View>
						);
					})}
				</View>
			)}
			{editTarget > -1 && (
				<View className="open-panel-overlay" onClick={onOverlayClicked}>

				</View>
			)}
		</Container >
	);
});

export const openSceneModal = Modal.create({
	Component: OpenModal,
	title: "Scenes",
	canClose: () => RootStore.get(SceneManager).loadedScenes.length > 0,
}, true);
