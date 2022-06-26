import React from "react";
import { react } from "utils";

import "./styles/view.scss";

const themeFromProps = (p: ViewTheme) =>
{
	if ("secundary" in p && p.secundary === true)
		return "secundary";
	return "primary";
}

export const View = ({ elRef, absolute, fixed, fill, centered = false, inline, className, type = "div", suppressHydrationWarning = false, primary, secundary, ...rest }: React.PropsWithChildren<ViewProps>) =>
{
	const theme = themeFromProps({ primary, secundary } as ViewTheme);

	const cn = react.getClassFromProps("view", { absolute, fixed, centered, fill, inline, className, [theme]: true });

	return React.createElement(type, { ref: elRef, className: cn, suppressHydrationWarning, ...rest });
}

type ReactProps<T extends HTMLElement> = React.PropsWithChildren<Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, "ref">>;

export interface IViewProps extends ReactProps<HTMLDivElement>
{
	type?: keyof React.ReactHTML;
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
};