import React from "react";
import { View, ViewTheme } from "./View";
import { react } from "utils";

import "./styles/flex-box.scss";

export const FlexBox: React.FC<FlexBoxProps> = ({ className, children, horizontal = true, vertical = false, ...rest }) =>
{
	const cn = react.getClassFromProps("flex-box", {
		horizontal: !vertical,
		vertical,
		className
	});
	
	return (
		<View className={cn} {...rest}>
			{children}
		</View>
	);
}

export type FlexBoxProps = ReactBasePropsWithChildren & {
	fill?: boolean;
	horizontal?: boolean;
	vertical?: boolean;
	absolute?: boolean;
} & ViewTheme;
