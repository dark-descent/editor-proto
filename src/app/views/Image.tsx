import React from "react";
import { getClassFromProps } from "utils/react";
import { ViewTheme } from "./View";

export const Image: React.FC<ImageProps> = ({ className, src, alt, ...rest }) =>
{
	return (
		<img src={src} alt={alt || ""} className={getClassFromProps("img", { className })} {...rest} />
	);
}

type ImageProps = ReactBaseProps &  {
	src: string;
	alt?: string;
} & ViewTheme;
