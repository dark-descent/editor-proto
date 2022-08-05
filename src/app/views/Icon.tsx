import React from "react";
import { View, ViewTheme } from "./View";

export const Icon: React.FC<IconProps> = ({ type = "solid", name, ...rest }) =>
{
	return (
		<View elType="i" className={`fa${type[0]} fa-${name}`} {...rest}/>
	);
}

type IconProps = ReactBaseProps & {
	type?: "solid" | "regular" | "brand";
	name: string;
} & ViewTheme;