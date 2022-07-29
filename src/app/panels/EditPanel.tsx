import { Panel, withStore } from "app/stores";
import { WorkspaceStore } from "app/stores/WorkspaceStore";
import { FlexBox, FlexItem } from "app/views";
import React from "react";

import "./styles/edit-panel.scss";

const EditPanelComponent = withStore(WorkspaceStore, ({ store }) => 
{
	// const ref = React.useRef<HTMLCanvasElement | null>();

	const onRef = (canvas: HTMLCanvasElement | null) =>
	{
		store.resetCanvas(canvas);
	}

	return (
		<FlexBox className="edit-panel" absolute fill vertical>
			<FlexItem base={20}>
				
			</FlexItem>
			<FlexItem>
				<canvas ref={onRef} />
			</FlexItem>
		</FlexBox>
	);
});

export const EditPanel = Panel.create("Edit View", EditPanelComponent);