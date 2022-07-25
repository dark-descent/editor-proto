import React from "react";
import { getClassFromProps } from "utils/react";

import "./styles/button.scss";

export const Button = ({ className, id, text, submit = false, onClick }: ButtonProps) =>
{
	return (
		<button id={id} className={getClassFromProps("button", { className })} type={submit ? "submit" : "button"} onClick={onClick}>
			{text}
		</button>
	);
};

type ButtonProps = {
	className?: string;
	id?: string;
	text: string;
	submit?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
};