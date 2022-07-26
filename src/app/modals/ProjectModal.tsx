import { Modal, ModalManager, withStore, withStores } from "app/stores";
import { ProjectStore } from "app/stores/ProjectStore";
import { RootStore } from "app/stores/RootStore";
import { SceneManager } from "app/stores/SceneManager";
import { Button, Container, FlexBox, FlexItem, View } from "app/views";
import { ipcRenderer } from "electron";
import React from "react";
import { getClassFromProps, useRefState } from "utils/react";
import { useModal } from "../components";
import { openSceneModal } from "./OpenModal";

import "./styles/open-project-modal.scss";

const CreateProjectModal = withStores({ projectStore: ProjectStore }, ({ projectStore }) =>
{
	const modal = useModal();

	const [nameVal, setNameVal] = React.useState("");
	const [dirVal, setDirVal] = React.useState("");

	const ref = React.useRef<HTMLInputElement | null>();

	const onNameKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
			modal.close(projectStore.create(nameVal, dirVal));
	}

	const onDirKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.key === "Enter")
			modal.close(projectStore.create(nameVal, dirVal));
	}

	const onDirClicked = () =>
	{
		ipcRenderer.invoke("get-dir").then((val) => 
		{
			setDirVal(val);
		});
	}

	React.useEffect(() => 
	{
		if (ref.current)
			ref.current.focus();
	}, []);

	return (
		<View id="create-project-modal" fill>
			<Container fill>
				<FlexBox fill vertical absolute className="input-wrapper">
					<FlexItem>
						<View fill>
							<Container fill>
								<input placeholder="Name" value={nameVal} onChange={e => setNameVal(e.target.value)} onKeyDown={onNameKeyDown} ref={(input) => ref.current = input} />
							</Container>
						</View>
					</FlexItem>
					<FlexItem>
						<Container fill>
							<FlexBox style={{ alignItems: "baseline" }}>
								<FlexItem base={285}>
									<input className="dir-input" type="text" placeholder="Dir" value={dirVal} onChange={e => setDirVal(e.target.value)} onKeyDown={onDirKeyDown} ref={(input) => ref.current = input} />
								</FlexItem>
								<FlexItem>
									<Button className="btn-get-dir" text="Select Folder" onClick={onDirClicked} />
								</FlexItem>
							</FlexBox>
						</Container>
					</FlexItem>
				</FlexBox>
			</Container>
			<Container className="btn-wrapper" absolute fill>

				{/* <View className="btn-wrapper"> */}
				<Button className="btn-cancel" transparent text="Cancel" onClick={() => modal.close()} />
				<Button className="btn-create" text="Create" onClick={() => modal.close(projectStore.create(nameVal, dirVal))} />
				{/* </View> */}
			</Container>
		</View>
	);
});

export const createProjectModal = Modal.create({
	Component: CreateProjectModal,
	title: "Create Project",
	maxWidth: 420,
	maxHeight: 320,
	minWidth: 420,
	minHeight: 320
});

const RenameProjectModal = withStores({ sceneManager: SceneManager, modalManager: ModalManager }, ({ sceneManager, modalManager }) =>
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

export const renameProjectModal = Modal.create({
	Component: RenameProjectModal,
	title: "Rename Project",
	maxWidth: 320,
	maxHeight: 220,
	minWidth: 320,
	minHeight: 220
});

const OpenModal = withStore(ProjectStore, ({ store }) =>
{
	const modal = useModal();

	const [editTarget, setEditTarget, editTargetRef] = useRefState(-1);

	const onProjectClick = (dir: string) => (e: React.MouseEvent) =>
	{
		if (editTarget === -1)
		{
			store.load(dir);
			modal.close();
			openSceneModal.open();
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
		renameProjectModal.open(name).then((newName) => 
		{
			if (name !== newName)
				store.rename(name, newName);
		});
	}

	const onDeleteClicked = (dir: string) => () =>
	{
		store.remove(dir);
		setEditTarget(-1);
	}

	const onOverlayClicked = () =>
	{
		setEditTarget(-1);
	}

	return (
		<View fill>
			{store.data.projects.length === 0 ? (
				<View className="no-scenes" centered absolute>
					<View elType="h1">There are no projects yet!</View>
					<View className="btn-wrapper" centered="horizontal">
						<Button text="Create new" onClick={() => createProjectModal.open().then((projectCreated) => { if (projectCreated) modal.close() })} />
					</View>
				</View>
				/* TODO: <Button text="Sync With Server" /> */
			) : (
				<Container className="open-modal">
					<View className="projects-list">
						<View centered="horizontal">
							<Button className="btn-create-new" text="Create new" onClick={() => createProjectModal.open().then((projectCreated) => { if (projectCreated) modal.close() })} />
						</View>
						{store.data.projects.map((p, i) => 
						{
							return (
								<View key={i} className={getClassFromProps("scene", { active: i === editTarget })} onClick={onProjectClick(p.dir)}>
									<View>{p.name}</View>
									<View>{p.dir}</View>
									<View absolute className="edit-btn" onClick={onEditClicked(i)}>
										<View fill className="inner-btn" />
									</View>
									{
										i === editTarget && (
											<View absolute className="edit-panel">
												<View onClick={onRenameClicked(p.name)}>
													Rename
												</View>
												<View onClick={onDeleteClicked(p.dir)}>
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

export const openProjectModal = Modal.create({
	Component: OpenModal,
	title: "Projects",
	canClose: () => RootStore.get(ProjectStore).isLoaded,
}, false);
