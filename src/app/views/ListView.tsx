import React from "react";
import { react } from "utils";
import { View, ViewTheme } from "./View";

export const ListView: React.FC<ListViewProps> = ({ items, component, className, children, ...rest }) =>
{
	const cn = react.getClassFromProps("list-view", { className });
	return (
		<View className={cn} {...rest as any}>
			{items.map((l, i) => React.createElement(component, { key: i, ...l }))}
		</View>
	);
}

type ListViewProps  = ReactBasePropsWithChildren & {
	fill?: boolean
	items: any[];
	component: React.ComponentClass | React.FC;
} & ViewTheme;
