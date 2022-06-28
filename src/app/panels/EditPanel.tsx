import { Panel } from "app/stores";
import { View } from "app/views";
import React from "react";

export const EditPanel = Panel.create("Edit View", () => 
{
	const ref = React.useRef<HTMLCanvasElement>();

	React.useEffect(() =>
	{
		console.log("mount");
		
		return () => 
		{
			console.log("unmount");
		};
	}, []);

	return (
		<View>
			<canvas ref={() => ref} />
		</View>
	);
});