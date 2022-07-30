import React from "react";

export * as react from "./react";
export * as string from "./string";
export * as object from "./object";
export * as math from "./math";
export * as path from "./path";
export * from "./TypeMap"
export * as array from "./array";
export * from "./mobx";

export const wait = (time: number, target: "ms" | "s" | "min" = "ms") => new Promise<NodeJS.Timeout>((resolve) => 
{
	let ms = target === "ms" ? time : target === "s" ? time * 1000 : time * 60000;
	return setTimeout(resolve, ms);
});

export const isSubClass = (A: any, B: any, matchSameClass: boolean = false) =>
{
	if (matchSameClass)
		return A.prototype instanceof B || B === A;
	return A.prototype instanceof B;
}

export const exec = <T = any>(fn: () => T) => fn();

export const preventEvent = (e: Event | React.UIEvent<any>) => { e.stopPropagation(); e.preventDefault(); }