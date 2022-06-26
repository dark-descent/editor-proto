import React from "react";
import { react } from "utils";
import { View, ViewTheme } from "./View";

export const FlexItem: React.FC<FlexItemProps> = ({ className, children, style = {}, base, grow, shrink, ...rest }) =>
{
	base = typeof base === "number" ? base + "px" : base || 0;
	grow = grow || (base ? 0 : 1);
	shrink = shrink || (base ? 0 : 1);

	const cn = react.getClassFromProps("flex-item", { className });

	return (
		<View className={cn} style={{ flex: `${grow} ${shrink} ${base}`, ...style }} {...rest as any}>
			{children}
		</View>
	);
}

export type FlexItemProps = ReactBasePropsWithChildren & {
	base?: number | string;
	grow?: number;
	shrink?: number;
	elRef?: React.RefObject<HTMLDivElement>;
} & ViewTheme;
