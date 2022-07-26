import React from "react";
import { react } from "utils";

import "./styles/view.scss";

export const themeFromProps = (p: ViewTheme) =>
{
	if (p.tertiary)
		return "tertiary";
	else if (p.secundary)
		return "secundary";
	else if (p.primary)
		return "primary";
	return "inherit";
}

export const View = ({ elRef, absolute, fixed, fill, centered = false, inline, className, elType = "div", suppressHydrationWarning = false, primary, secundary, tertiary, ...rest }: React.PropsWithChildren<ViewProps>) =>
{
	const theme = themeFromProps({ primary, secundary, tertiary } as ViewTheme);

	const cn = react.getClassFromProps("view", { absolute, fixed, centered, fill, inline, className, [theme]: true });

	return React.createElement(elType, { ref: elRef, className: cn, suppressHydrationWarning, ...rest });
}

type ReactProps<T extends HTMLElement> = React.PropsWithChildren<Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, "ref">>;

export interface IViewProps extends ReactProps<HTMLDivElement>
{
	elType?: keyof React.ReactHTML;
	absolute?: boolean;
	fixed?: boolean;
	fill?: boolean;
	inline?: boolean;
	centered?: boolean | "horizontal" | "vertical";
	elRef?: React.RefObject<HTMLDivElement>;
};

export type ViewProps = IViewProps & ViewTheme;

export type ViewTheme = {
	primary?: boolean;
	secundary?: boolean;
	tertiary?: boolean;
};