import { Panel, withStores } from "app/stores";
import { FlexBox, FlexItem } from "app/views";
import React from "react";

import "./styles/edit-panel.scss";

const EditPanelComponent = withStores({  }, ({  }) => 
{
	const ref = React.useRef<HTMLCanvasElement>();

	return (
		<FlexBox className="edit-panel" absolute fill vertical>
			<FlexItem base={20}>
				
			</FlexItem>
			<FlexItem>
				<canvas ref={ref as any} />
			</FlexItem>
		</FlexBox>
	);
});

export const EditPanel = Panel.create("Edit View", EditPanelComponent);