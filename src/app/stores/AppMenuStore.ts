import { action, computed, makeObservable, observable } from "mobx";
import React from "react";
import { Store } from "./Store";

export const MenuSeperator = Symbol("seperator");

export class MenuItem
{
	public static readonly parseItems = (items: MenuItemProps[], menu: AppMenuStore, parent: MenuItem | null = null): MenuItems => items.map(item => 
	{
		if (item === MenuSeperator)
			return item;
		return makeObservable(new MenuItem(item, parent, menu));
	});

	public readonly parent: MenuItem | null;
	public readonly menu: AppMenuStore;

	@observable
	private _label: string;

	@computed
	public get label() { return this._label; }

	@observable
	private _subMenu: MenuItems = [];

	@computed
	public get subMenuItems() { return this._subMenu; };

	@observable
	private _isActive: boolean = false;

	@computed
	public get isActive() { return this._isActive; }

	private _onClick: MenuItemClickHandler | undefined;

	@computed
	public get hasSubMenu() { return this._subMenu.length > 0; }

	public get isRootItem() { return this.parent === null; }

	// private subMenuHideTimeout: NodeJS.Timeout | null = null;
	// private hideCallback: 

	public constructor(props: ItemProps, parent: MenuItem | null = null, menu: AppMenuStore)
	{
		this.menu = menu;
		this.parent = parent;
		this._label = props.label;
		this._onClick = props.onClick;
		if (props.subMenu)
			this.setSubMenu(MenuItem.parseItems(props.subMenu, menu, this));
	}

	@action
	private readonly setSubMenu = (items: MenuItems) => this._subMenu = items;

	@action
	private readonly updateActive = (isActive: boolean) => 
	{
		this._isActive = isActive;
		if(!this._isActive)
			this._subMenu.forEach(item => item !== MenuSeperator && item.setActive(false));
	};

	public readonly toggle = () => this.updateActive(!this._isActive)

	public readonly setActive = (isActive: boolean) =>
	{
		if(this._isActive !== isActive)
		{
			this.updateActive(isActive);
			if(isActive && this.parent)
				this.parent._subMenu.forEach(m => m !== this && m !== MenuSeperator && m.setActive(false));
		}
	};

	@action
	public readonly onMouseDown = (e: MouseEvent) =>
	{
		e.preventDefault();
		e.stopPropagation();

		if (this._onClick)
		{
			this._onClick(e, this);
			this.menu.setActiveItem(null);
			return true;
		}
		else if (this.isRootItem)
		{
			this.toggle();
			this.menu.setActiveItem(this._isActive ? this : null);
			return true;
		}
		else if(this.hasSubMenu)
		{
			this.toggle();
		}
		return false;

	}

	public readonly onMouseEnter = (e: MouseEvent) =>
	{
		const activeItem = this.parent?.subMenuItems.find(m => m !== MenuSeperator && m._isActive) as MenuItem | undefined;
		if(activeItem)
			activeItem.setActive(false);
	}

	public readonly onMouseLeave = (e: MouseEvent) =>
	{

	}
}

@Store.preload
export class AppMenuStore extends Store<MenuItemProps[]>
{
	@observable
	private _items: MenuItem[] = [];

	@computed
	public get items() { return this._items; }

	private _activeItem: MenuItem | null = null;

	protected override init(props: MenuItemProps[]): void
	{
		this._items = MenuItem.parseItems(props, this).filter(s => s !== MenuSeperator) as MenuItem[];
	}

	protected override onMount(): void
	{
		window.addEventListener("mousedown", () => 
		{
			if (this._activeItem)
			{
				this._activeItem.setActive(false);
				this._activeItem = null;
			}
		});
	}

	public readonly setActiveItem = (item: MenuItem | null) => 
	{
		if(this._activeItem)
			this._activeItem.setActive(false);
		this._activeItem = item;
	};
}

export type MenuItemProps = ItemProps | Seperator;

type ItemProps = {
	type?: "item";
	label: string;
	onClick?: MenuItemClickHandler;
	subMenu?: MenuItemProps[];
};

export type MenuItemClickHandler = (e: React.MouseEvent<HTMLDivElement>, item: MenuItem) => any;

type Seperator = typeof MenuSeperator;

type MenuItems = (MenuItem | Seperator)[];

type MouseEvent = React.MouseEvent<HTMLDivElement>;