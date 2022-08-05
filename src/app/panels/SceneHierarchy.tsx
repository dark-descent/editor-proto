import { Panel, withStore } from "app/stores";
import { ProjectManagerStore } from "app/stores/ProjectStore";
import { Button, View } from "app/views";
import { observer } from "mobx-react";
import React from "react";
import { Transform } from "@engine";

import "./styles/edit-panel.scss";
import { TransformStore } from "app/stores/engine/components/TransformStore";

const TransformItem = observer(({ transform }: { transform: TransformStore }) =>
{
	return (
		<View className="item">
			{transform.entity.name}
			<View className="children">
				{/* {transform.children.map((transform, i) => <TransformItem key={i} transform={transform} />)} */}
			</View>
		</View>
	);
});

const SceneHierarchy = withStore(ProjectManagerStore, ({ store }) => 
{
	const scene = store.current?.activeScene;

	if(!scene)
		return <h1>No Scene is loaded!</h1>;

	return (
		<View>
			<Button text="Add Entity" onClick={() => scene.addEntity()} />
			{scene.rootTransforms.map((transform, i) => <TransformItem key={i} transform={transform} />)}
		</View>
	);
});

export const SceneHierarchyPanel = Panel.create("Scene Hierarchy", SceneHierarchy);