import React from "react";
import { getClassFromProps } from "utils/react";
import { themeFromProps, View, ViewTheme } from "./View";

import "./styles/button.scss";

export const Button = ({ className, id, text, submit = false, onClick, primary, secundary, tertiary, transparent }: ButtonProps) =>
{
	const theme = transparent ? "transparent" : themeFromProps({ primary, secundary, tertiary } as ViewTheme);

	const btnProps: any = { type: submit ? "submit" : "button" };

	return (
		<View inline elType="button" id={id} className={getClassFromProps("button", { className, [theme]: true })} onClick={onClick as any} {...btnProps}>
			{text}
		</View>
	);
};

type ButtonProps = {
	transparent?: boolean;
	className?: string;
	id?: string;
	text: string;
	submit?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
} & ViewTheme;