import { Panel, withStores } from "app/stores";
import { EditorStore } from "app/stores/EditorStore";
import { SceneStore } from "app/stores/SceneStore";
import { Renderer } from "@engine/editor";
import { FlexBox, FlexItem } from "app/views";
import React from "react";

import "./styles/edit-panel.scss";
import { ECS } from "../../../engine/src/ECS";
import { RenderSystem } from "../../../engine/src/RenderSystem";

const EditPanelComponent = withStores({ editorStore: EditorStore, sceneStore: SceneStore }, ({ editorStore, sceneStore }) => 
{
	const ref = React.useRef<HTMLCanvasElement>();

	React.useEffect(() =>
	{
		const renderer = editorStore.editor.engine.getSubSystem(Renderer);
		editorStore.editor.engine.getSubSystem(ECS).updateSystem(RenderSystem);
		
		if (ref.current)
			renderer.updateCanvas(ref.current);
		return () => renderer.reset();
	}, []);

	return (
		<FlexBox className="edit-panel" absolute fill vertical>
			<FlexItem base={20}>
				{sceneStore.activeScene?.name}
			</FlexItem>
			<FlexItem>
				<canvas ref={ref as any} />
			</FlexItem>
		</FlexBox>
	);
});

export const EditPanel = Panel.create("Edit View", EditPanelComponent);