import { Modal, ModalManager, withStore, withStores } from "app/stores";
import { RootStore } from "app/stores/RootStore";
import { SceneManager } from "app/stores/SceneManager";
import { Button, Container, View } from "app/views";
import React from "react";
import { getClassFromProps, useRefState } from "utils/react";
import { useModal } from "../components";

import "./styles/open-modal.scss";

const CreateSceneModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
{
	const modal = useModal();

	const [val, setVal] = React.useState("");
	const ref = React.useRef<HTMLInputElement | null>();

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
			modal.close(sceneManager.createScene(val));
	}

	React.useEffect(() => 
	{
		if (ref.current)
			ref.current.focus();
	}, []);

	return (
		<View id="create-scene-modal" fill>
			<Container fill>
				<View absolute centered="horizontal">
					<input placeholder="Name" value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKeyDown} ref={(input) => ref.current = input} />
				</View>
			</Container>
			<Container className="btn-wrapper" absolute fill>

				{/* <View className="btn-wrapper"> */}
				<Button className="btn-cancel" transparent text="Cancel" onClick={() => modal.close()} />
				<Button className="btn-create" text="Create" onClick={() => modal.close(sceneManager.createScene(val))} />
				{/* </View> */}
			</Container>
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
		<View id="create-scene-modal" fill>
			<Container fill>
				<View absolute centered="horizontal">
					<input placeholder="Name" value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKeyDown} ref={(input) => ref.current = input} />
				</View>
			</Container>
			<Container className="btn-wrapper" absolute fill>
				<Button className="btn-cancel" transparent text="Cancel" onClick={() => modal.close()} />
				<Button className="btn-rename" text="Rename" onClick={() => modal.close(val)} />
			</Container>
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
			if (name !== newName)
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
		<View fill>
			{sceneManager.data.scenes.length === 0 ? (
				<View className="no-scenes" centered absolute>
					<View elType="h1">There are no projects yet!</View>
					<View className="btn-wrapper" centered="horizontal">
						<Button text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if (sceneCreated) modal.close() })} />
					</View>
				</View>
				/* TODO: <Button text="Sync With Server" /> */
			) : (
				<Container className="open-modal">
					<View className="projects-list">
						<View centered="horizontal">
							<Button className="btn-create-new" text="Create new" onClick={() => createSceneModal.open().then((sceneCreated) => { if (sceneCreated) modal.close() })} />
						</View>
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
				</Container>
			)}
			{editTarget > -1 && (
				<View className="open-panel-overlay" onClick={onOverlayClicked}>

				</View>
			)}
		</View>
	);
});

export const openSceneModal = Modal.create({
	Component: OpenModal,
	title: "Scenes",
	canClose: () => RootStore.get(SceneManager).loadedScenes.length > 0,
}, true);
