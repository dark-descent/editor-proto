import { action, computed, observable } from "mobx";
import { lock } from "utils/object";
import { toSnakeCase } from "utils/string";
import { Store } from "./Store";

@Store.preload
export class ThemeStore extends Store
{
	private readonly themes: Themes<"dark" | "ligth"> = lock({
		dark: {
			font: "sans-serif",
			accent: "rgb(255,172,68)",
			main: {
				background: "rgb(32,32,32)",
				color: "rgb(220,220,220)"
			},
			sec: {
				background: "rgb(78,78,78)",
				color: "rgb(220,220,220)"
			},
			tert: {
				background: "rgb(106,106,106)",
				color: "rgb(220,220,220)"
			},
			shadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.55)",
			btnTransition: "150ms",
			transparent: "rgba(0, 0, 0, 0.2)",
			transparentLight: "rgba(110, 110, 110, 0.1)",
			scrollbar: {
				size: "10px",
				thumb: "rgba(150, 150, 150, 0.05)",
				thumbHover: "rgba(150, 150, 150, 0.1)",
				track: "rgb(167,167,167,0.05);",
				background: "rgba(0, 0, 0, 0.01)",
			}
		},
		ligth: {
			font: "sans-serif",
			accent: "rgb(255,172,68)",
			main: {
				background: "rgb(225,225,225)",
				color: "rgb(64, 64, 64)"
			},
			sec: {
				background: "rgb(157,157,157)",
				color: "rgb(128,128,128)"
			},
			tert: {
				background: "rgb(157,157,157)",
				color: "rgb(128,128,128)"
			},
			shadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.55)",
			btnTransition: "150ms",
			transparent: "rgba(0, 0, 0, 0.2)",
			transparentLight: "rgba(110, 110, 110, 0.1)",
			scrollbar: {
				size: "10px",
				thumb: "rgba(0, 0, 0, 0.5)",
				thumbHover: "rgba()",
				track: "rgba()",
				background: "rgba()",
			}
		}
	});

	private readonly style: HTMLStyleElement = document.createElement("style");

	@observable
	private activeThemeName: string = "dark";

	@computed
	public get activeTheme() { return this.activeThemeName; }

	protected override init(): void
	{
		this.loadTheme(this.activeThemeName);
	}

	private readonly getTheme = (themeName: string) =>
	{
		const theme = (this.themes as Themes<any>)[themeName];
		if (!theme)
			throw new Error(`Could not find theme ${themeName}!`);
		return theme;
	};

	private readonly createThemeCSS = (theme: Theme) =>
	{
		const rules: string[] = [];

		const createRule = (name: string, val: string) => rules.push(`--${name}: ${val};`);

		const parse = (value: any, key: string) =>
		{
			if (typeof value === "object")
				for (const k in value)
					parse(value[k], `${toSnakeCase(key)}-${toSnakeCase(k)}`);
			else
				createRule(toSnakeCase(key), value);
		}

		Object.keys(theme).forEach(k => parse((theme as any)[k], k));

		const rootElements = "div, span, h1, h2, h3, h4, h5, h6, section, header, footer, button, a";

		return [
			`:root { ${rules.join(" ")} }`,
			"::-webkit-scrollbar { width: var(--scrollbar-background); width: var(--scrollbar-size); height: var(--scrollbar-size); }",
			"::-webkit-scrollbar-track { background: var(--scrollbar-track); }",
			"::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); }",
			"::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }",
			"html, body { overflow: hidden; }",
			`${rootElements} { text-decoration: unset; background-color: var(--main-background); color: var(--main-color); font-family: var(--font); padding: 0px; margin: 0px; } button { border: 1px solid var(--sec-background); background-color: var(--main-background); border-radius: 4px; }`
		].join(" ");
	}

	private readonly loadTheme = (themeName: string) =>
	{
		const theme = this.getTheme(themeName);

		if (env.isDev)
			console.log(`Loading theme ${themeName}...`);

		const css = this.createThemeCSS(theme);

		if (this.style.parentElement)
			this.style.parentElement.removeChild(this.style);

		this.style.innerHTML = css;

		document.head.appendChild(this.style);
	}

	@action
	private readonly setActiveThemeName = (themeName: string) =>
	{
		this.activeThemeName = themeName;
	};

	public readonly setActiveTheme = (themeName: string | ThemeNames) =>
	{
		if (themeName !== this.activeThemeName)
		{

			this.loadTheme(themeName);
			this.setActiveThemeName(themeName);
		}
	}
}

export type RGBAColor<R extends number, G extends number, B extends number, A extends number> = `rgba(${R},${G},${B},${A})`;
export type RGBColor<R extends number, G extends number, B extends number> = `rgb(${R},${G},${B})`;

export type HexRGBColor<R extends number | string, G extends number | string, B extends number | string> = `#${R}${G}${B}`;
export type HexColor<Hex extends number | string> = `#${Hex}`;

export type Color = RGBAColor<any, any, any, any> | RGBColor<any, any, any> | HexRGBColor<any, any, any> | HexColor<any>;

export type ScrollbarTheme = {
	thumb: Color;
	thumbHover: Color;
	track: Color;
	background: Color;
	size: string;
};

export type ThemeColor = {
	color: Color;
	background: Color;
}

export type Theme = {
	font: string;
	accent: Color;
	main: ThemeColor;
	sec: ThemeColor;
	tert: ThemeColor;
	shadow: string;
	btnTransition: string;
	transparent: Color;
	transparentLight: Color;
	scrollbar: ScrollbarTheme;
};

export type ThemeNames = keyof ThemeStore["themes"];

type Themes<S extends string> = RecursiveReadonly<{
	[K in S]: Theme;
}>;