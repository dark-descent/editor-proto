import { action, computed, makeObservable, observable } from "mobx";
import React from "react";
import { clamp } from "utils/math";
import { FlexBoxProps, FlexItemProps } from "../views";
import { Store } from "./Store";

type MenuItemProps = {
	label: string;
	onClick?: MenuItemClickHandler;
	subMenu?: (MenuItemProps | "seperator")[];
};

type MenuProps = {
	items: (MenuItemProps | "seperator")[];
};

export class PanelMenuItem
{
	public readonly menu: PanelMenu;
	public readonly parent: PanelMenuItem | null;

	@observable
	private _label: string;

	@computed
	public get label() { return this._label; }

	@observable
	private _onClick: MenuItemClickHandler | null;

	@observable
	private _subMenu: (PanelMenuItem | "seperator")[] = [];

	@computed
	public get subMenu() { return this._subMenu; };

	public constructor(menu: PanelMenu, { label, onClick, subMenu = [] }: MenuItemProps, parent?: PanelMenuItem)
	{
		this.menu = menu;
		this._label = label;
		this._onClick = onClick || null;
		this._subMenu = subMenu.map(item => typeof item === "string" ? item : makeObservable(new PanelMenuItem(menu, item))) as any;
		this.parent = parent || null;
	}

	public readonly onClick = (e: React.MouseEvent) => 
	{
		e.preventDefault();
		e.stopPropagation();
		this._onClick && this._onClick(this);
		return !!this._onClick;
	};

	@action
	public readonly setOnClickHandler = (onClick: MenuItemClickHandler) => this._onClick = onClick;

	@action
	public readonly setLabel = (label: string) => this._label = label;
}

type MenuItemClickHandler = (item: PanelMenuItem) => any;

export class PanelMenu
{
	private static readonly insertPositions: Omit<PanelInsertPosition, "center" | "none">[] = ["left", "top", "right", "bottom"];

	public isOpenRef: boolean = false;
	public readonly panel: Panel;

	@observable
	private _items: PanelMenuItem[];

	@computed
	public get items() { return this._items; }

	private get defaultItems(): (MenuItemProps | "seperator")[]
	{
		const manager = this.panel.item.manager;
		const panels = manager.panels;

		return [
			...PanelMenu.insertPositions.map(pos => 
			{
				return {
					label: `insert ${pos}...`,
					subMenu: Object.keys(panels).map(name => 
					{
						return {
							label: name,
							onClick: () =>
							{
								const insertItem = makeObservable(new PanelItem(manager, manager.getPanelProps(name), "auto"));
								this.panel.item.parent?.boxChild(manager, this.panel.item, insertItem, pos as any);
							}
						};
					})
				}
			}),
			"seperator",
			{
				label: "Close Panel",
				onClick: () => { this.panel.item.parent?.removeChild(this.panel.item); }
			},
		];
	}

	public constructor(panel: Panel, items: (MenuItemProps | "seperator")[] = [])
	{
		this.panel = panel;
		this._items = [
			...items.map(item => typeof item === "string" ? item : makeObservable(new PanelMenuItem(this, item))) as any,
			...this.defaultItems.map(item => typeof item === "string" ? item : makeObservable(new PanelMenuItem(this, item)))
		];
	}
}

export class Panel
{
	public static readonly create = (title: string, fc: React.FC<any>, menu?: MenuProps): PanelProps =>
	{
		const props: PanelProps = {
			title,
			fc
		};
		if (menu)
			props.menu = menu;
		return props;
	}

	public readonly item: PanelItem;
	public readonly menu: PanelMenu;

	@observable
	private _title: string

	@computed
	public get title() { return this._title; }

	@observable
	private _fc: React.FC<any>;

	@computed
	public get Body() { return this._fc; }

	public constructor(item: PanelItem, title: string, fc: React.FC<any>, menu: MenuProps | null = null)
	{
		this.item = item;
		this._title = title;
		this._fc = fc;
		this.menu = makeObservable(new PanelMenu(this, menu?.items));
	}
}

export class PanelItem
{
	public readonly manager: PanelManager;

	public readonly ref = React.createRef<HTMLDivElement>();

	public get element(): HTMLDivElement
	{
		if (!this.ref.current)
			throw new Error("Could not get Ref element!");
		return this.ref.current;
	}

	public static readonly is = (o: any): o is PanelItem => o instanceof PanelItem;

	public static readonly MIN_WEIGHT: number = 126;

	public get panelInsertPosition() { return this._panelInsertPosition; }

	// this is just a reference to the parent box to get its neighbours
	private _parent: PanelBox | null = null;

	public get parent() { return this._parent; }

	@observable
	private _weight: Weight = "auto";

	@computed
	public get weight() { return this._weight; }

	public set weight(weight: Weight) 
	{
		if (weight !== "auto")
			weight = clamp(weight, PanelItem.MIN_WEIGHT, Infinity);
		if (this._weight != weight)
			this.updateWeight(weight);
	}

	@observable
	private _child: Panel | PanelBox;

	@computed
	public get child() { return this._child; }

	@observable
	private _panelInsertPosition: PanelInsertPosition | "none" = "none";

	@action
	private readonly updatePanelInsertPosition = (pos: PanelInsertPosition | "none") => this._panelInsertPosition = pos;

	public readonly setPanelInsertPosition = (pos: PanelInsertPosition | "none") =>
	{
		if (this._panelInsertPosition !== pos)
			this.updatePanelInsertPosition(pos);
	}

	public constructor(manager: PanelManager, child: PanelProps | PanelBoxProps, weight: Weight = "auto")
	{
		this.manager = manager;

		this._weight = weight;

		if (PanelBox.isProps(child))
		{
			const box = new PanelBox(child.dir, this);
			box.appendChild(...PanelBox.parseChildren(manager, box, child.children));
			this._child = makeObservable(box);
		}
		else
		{
			this._child = makeObservable(new Panel(this, child.title, child.fc, child.menu));
		}
	};

	public readonly setParent = (parent: PanelBox) => this._parent = parent;

	@action
	private readonly updateWeight = (weight: Weight) => this._weight = weight;

	public readonly useFlexProps = () =>
	{
		return React.useMemo(() => 
		{
			const minSize = `${PanelItem.MIN_WEIGHT}px`;

			const props: FlexItemProps = {
				style: {
					minWidth: minSize,
					minHeight: minSize,
					maxHeight: "100%",
					maxWidth: "100%"
				}
			};

			if (this.weight === "auto")
			{
				props.grow = 1;
				props.shrink = 1;
				props.base = minSize;
			}
			else
			{
				props.base = this.weight + "px";
				props.grow = 0;
				props.shrink = 0;
			}

			return props;
		}, [this.weight]);
	}

	public readonly onMouseLeave = () => this.setPanelInsertPosition("none");
}

export class PanelBox
{
	public static readonly is = (o: any): o is PanelBox => o instanceof PanelBox;
	public static readonly isProps = (o: any): o is PanelBoxProps => typeof o === "object" && ("dir" in o) && ("children" in o);

	public static readonly parseChildren = (manager: PanelManager, box: PanelBox, children: (PanelItemProps | string | ((PanelItemProps | string)[]))[], parsedChildren: PanelItem[] = []): PanelItem[] =>
	{
		children.forEach(props => 
		{
			if (Array.isArray(props))
			{
				parsedChildren.push(makeObservable(new PanelItem(manager, {
					children: props,
					dir: box.dir === "horizontal" ? "vertical" : "horizontal"
				})));
			}
			else if (typeof props === "string")
			{
				const itemProps = manager.getPanelProps(props);
				parsedChildren.push(makeObservable(new PanelItem(manager, itemProps)));
			}
			else if (PanelBox.isProps(props.child))
			{
				if (props.child.dir === box.dir)
					this.parseChildren(manager, box, props.child.children, parsedChildren);
				else
					parsedChildren.push(makeObservable(new PanelItem(manager, props.child, props.weight)));
			}
			else
			{
				const itemProps = manager.getPanelProps(props.child);
				parsedChildren.push(makeObservable(new PanelItem(manager, itemProps, props.weight)));
			}
		});

		if (!parsedChildren.find(c => c.weight === "auto"))
		{
			const child = parsedChildren[parsedChildren.length - 1];
			if (child)
				child.weight = "auto";
		}

		return parsedChildren;
	}

	// a reference to a panel item if its not the root panel box
	private _parent: PanelItem | null;

	public get parent() { return this._parent; }

	@observable
	private _children: PanelItem[] = [];

	@computed
	public get children() { return this._children; }

	@observable
	private _dir: PanelBoxDir;

	@computed
	public get dir() { return this._dir; }

	public constructor(dir: PanelBoxDir, parent: PanelItem | null = null)
	{
		this._dir = dir;
		this._parent = parent;
	}

	public readonly boxChild = (manager: PanelManager, targetItem: PanelItem, insertItem: PanelItem, pos: PanelInsertPosition) =>
	{
		const targetParent = targetItem.parent;

		if (!targetParent)
			throw new Error("");

		const targetIndex = targetParent.children.indexOf(targetItem);

		const item = new PanelItem(manager, {
			dir: pos === "left" || pos === "right" ? "horizontal" : "vertical",
			children: [],
		});

		const box = item.child as PanelBox;

		if (pos === "left" || pos === "top")
			box.appendChild(insertItem, targetItem);
		else
			box.appendChild(targetItem, insertItem);

		insertItem.weight = targetItem.weight = "auto";

		targetParent.replaceChild(makeObservable(item), targetIndex);
	}

	@action
	private readonly setDir = (dir: PanelBoxDir) => this._dir = dir;

	public readonly setDirection = (dir: PanelBoxDir) => 
	{
		if (this._dir !== dir)
		{
			const item = this._parent;
			const box = item?.parent;

			if (item && box)
			{
				if (box.dir === dir)
				{
					const index = box.children.indexOf(item);
					this._children.forEach((child, i) => box.insertChild(child, index + i));
					box.removeChild(item);
				}
			}
			else
			{
				this.setDir(dir);
			}
		}
	};

	@action
	public readonly appendChild = (...items: PanelItem[]) =>
	{
		const children = [...this._children];
		items.forEach(item => 
		{
			children.push(item);
			item.setParent(this);
		});
		this._children = children;
	}

	public readonly insertChild = (item: PanelItem, index: number) =>
	{
		if (index < 0)
			throw new Error(`Cannot add item at index ${index}!`);
		const children = [...this.children];

		item.setParent(this);

		if (index >= this.children.length)
			children.push(item);
		else
			children.splice(index, 0, item);

		this.updateChildren(children);
	}

	public readonly useFlexProps = () =>
	{
		return React.useMemo<Partial<FlexBoxProps>>(() => 
		{
			const isHorizontal = this.dir === "horizontal";

			return {
				horizontal: isHorizontal,
				vertical: !isHorizontal
			};
		}, [this.dir]);
	}

	@action
	private readonly updateChildren = (children: PanelItem[]) => this._children = children;

	public readonly removeChild = (item: PanelItem) =>
	{
		const index = this.children.indexOf(item);
		if (index > -1)
		{
			const children = [...this._children];
			children.splice(index, 1);

			if (children.length === 1)
			{
				const lastChild = children[0]!;
				const itemParent = this._parent;
				const parent = itemParent?.parent;

				if (itemParent && parent)
				{
					const index = parent.children.indexOf(itemParent);
					parent.insertChild(lastChild, index);
					parent.removeChild(itemParent);
					this.updateChildren([]);
				}
				else
				{
					this.updateChildren(children);
				}
			}
			else
			{
				if (!children.find(c => c.weight === "auto"))
					children[children.length - 1]!.weight = "auto";
				this.updateChildren(children);
			}
		}
		else
		{
			console.warn(`Could not remove item at index ${index}!`);
		}
	}

	public readonly moveChild = (item: PanelItem, index: number) =>
	{
		const oldIndex = this.children.indexOf(item);
		if (oldIndex > -1)
		{
			const children = [...this._children];
			children.splice(oldIndex, 1);
			if (index >= this.children.length)
				children.push(item);
			else
				children.splice(index, 0, item);

			this.updateChildren(children);
		}
	}

	public readonly swapChildren = (a: number, b: number) =>
	{
		const children: PanelItem[] = [...this._children];
		const temp = children[a]!;
		children[a] = children[b]!;
		children[b] = temp;
		this.updateChildren(children);
	}

	public readonly relocateChild = (dragIndex: number, targetIndex: number) =>
	{
		if (dragIndex < targetIndex)
			targetIndex--;
		const children: PanelItem[] = [...this._children];
		const item = children.splice(dragIndex, 1)[0]!;
		children.splice(targetIndex, 0, item);
		this.updateChildren(children);
	}

	public readonly replaceChild = (item: PanelItem, index: number) =>
	{
		const children = [...this.children];
		children[index] = item;
		item.setParent(this);
		this.updateChildren(children);
	}
}

@Store.preload
export class PanelManager extends Store<PanelBoxProps>
{
	public static readonly createPanelMap = <Map extends PanelsMap>(panels: Map) => panels;

	public static readonly createConfig = <Map extends PanelsMap>(panels: Map, dir: PanelBoxDir, layout: PanelLayoutConfig<keyof Map>): InitPanelManagerProps<Map, keyof Map> =>
	{
		return {
			children: layout,
			dir,
			panels
		};
	};

	public readonly panels: InitPanelManagerProps<any, any>["panels"] = {};

	@observable
	private _rootBox: PanelBox = makeObservable(new PanelBox("horizontal"));

	@computed
	public get rootBox() { return this._rootBox; }

	@observable
	private _draggingItem: PanelItem | null = null;

	@computed
	public get draggingItem() { return this._draggingItem; }

	@computed
	public get isDragging() { return this._draggingItem !== null; }

	@observable
	private _slidingProps: SlidingProps | null = null;

	protected override init({ children = [], dir = "horizontal", panels = {} }: Partial<InitPanelManagerProps<any, any>>): void 
	{
		Object.keys(panels).forEach(key => this.panels[key] = panels[key]!);

		const box = new PanelBox(dir, null);
		box.appendChild(...PanelBox.parseChildren(this, box, children));
		this._rootBox = makeObservable(box);
	}

	protected override onMount(): void
	{
		window.addEventListener("mouseup", this.onMouseUp);
		window.addEventListener("mousemove", this.onMouseMove);
	}

	public readonly getPanelProps = (key: string) => 
	{
		const panelProps = this.panels[key];
		if (!panelProps)
			throw new Error(`Could not get panel props for ${key}!`);
		return panelProps;
	}

	public readonly useStartDragMethod = (item: PanelItem) => React.useMemo(() => () => this.setDraggingItem(item), [item]);
	public readonly usePanelMouseMoveMethod = (item: PanelItem) => React.useMemo(() => this.onPanelMouseMove(item), [item]);
	public readonly usePanelMouseUpMethod = (item: PanelItem) => React.useMemo(() => this.onPanelMouseUp(item), [item]);
	public readonly useStartSlideMethod = (item: PanelItem) => React.useMemo(() => this.onStartSlide(item), [item]);

	@action
	private readonly setDraggingItem = (item: PanelItem | null) => this._draggingItem = item;

	@action
	private readonly setSlidingProps = (props: SlidingProps | null) => this._slidingProps = props;

	private readonly onMouseUp = (e: MouseEvent) =>
	{
		if (this._slidingProps)
			this.setSlidingProps(null);
		if (this._draggingItem)
			this.setDraggingItem(null);
	}

	private readonly onMouseMove = (e: MouseEvent) =>
	{
		if (this._slidingProps)
			this._slidingProps.resizeHandler(e, this._slidingProps);
	}

	private readonly onHorizontalResizeBefore = (e: MouseEvent, { item, mousePos, startSize }: SlidingProps) =>
	{
		const delta = e.clientX - mousePos;
		item.weight = startSize + delta;
	}

	private readonly onHorizontalResizeAfter = (e: MouseEvent, { item, mousePos, startSize }: SlidingProps) =>
	{
		const delta = mousePos - e.clientX;
		item.weight = startSize + delta;
	}

	private readonly onVerticalResizeBefore = (e: MouseEvent, { item, mousePos, startSize }: SlidingProps) =>
	{
		const delta = e.clientY - mousePos;
		item.weight = startSize + delta;
	}

	private readonly onVerticalResizeAfter = (e: MouseEvent, { item, mousePos, startSize }: SlidingProps) =>
	{
		const delta = mousePos - e.clientY;
		item.weight = startSize + delta;
	}

	private readonly onStartSlide = (item: PanelItem) => (e: React.MouseEvent<HTMLDivElement>) =>
	{
		const p = item.parent;

		if (p)
		{
			const sibling = p.children[p.children.indexOf(item) + 1];

			const isSiblingTarget = (item.weight === "auto") && sibling && (sibling.weight !== "auto");
			const targetItem = isSiblingTarget ? sibling : item;

			let mousePos: number = 0;
			let startSize: number = 0;

			let resizeHandler: SlidingProps["resizeHandler"];

			p.children.forEach(c => c.weight = p.dir === "horizontal" ? c.element.clientWidth : c.element.clientHeight);

			if (isSiblingTarget)
				item.weight = "auto";
			else if (sibling)
				sibling.weight = "auto";

			if (p.dir === "horizontal")
			{
				mousePos = e.clientX;
				startSize = targetItem.element.clientWidth;
				resizeHandler = isSiblingTarget ? this.onHorizontalResizeAfter : this.onHorizontalResizeBefore;
			}
			else
			{
				mousePos = e.clientY;
				startSize = targetItem.element.clientHeight;
				resizeHandler = isSiblingTarget ? this.onVerticalResizeAfter : this.onVerticalResizeBefore;
			}

			this._slidingProps = {
				item: targetItem,
				mousePos,
				startSize,
				resizeHandler,
			};
		}
		else
		{
			throw new Error(`Could not get parent!`);
		}
	}

	private readonly onPanelMouseMove = (item: PanelItem) => (e: React.MouseEvent<HTMLDivElement>) =>
	{
		if (this._draggingItem && (this._draggingItem !== item))
			this.onPanelDrag(item, e.nativeEvent);
	}

	private readonly onPanelMouseUp = (item: PanelItem) => (e: React.MouseEvent<HTMLDivElement>) =>
	{
		if (this._draggingItem && (this._draggingItem !== item))
			this.onPanelDrop(this._draggingItem, item, e.nativeEvent);
	}

	private readonly getInsertPosition = (e: MouseEvent): PanelInsertPosition =>
	{
		let div = e.target as HTMLDivElement;

		while (div && !div.classList.contains("panel-wrapper"))
			div = div.parentElement as HTMLDivElement;

		if (!div)
			throw new Error(`Could not find panel-wrapper!`);

		const w = div.clientWidth;
		const h = div.clientHeight;

		const offX = e.offsetX / w;
		const offY = e.offsetY / h;

		const bounds = 0.4;

		if (offX >= bounds && offY > bounds)
		{
			if (offX > offY)
				return "right";
			else
				return "bottom";
		}
		else if (offX <= bounds && offY > bounds)
		{
			if ((bounds - offX) < (offY - bounds))
				return "bottom";
			else
				return "left";
		}
		else if (offX <= bounds && offY < bounds)
		{
			if (offX < offY)
				return "left";
			else
				return "top";
		}
		else if (offX >= bounds && offY < bounds)
		{
			if ((offX - bounds) < (bounds - offY))
				return "top";
			else
				return "right";
		}

		return "center";
	}

	@action
	private readonly onPanelDrag = (targetItem: PanelItem, e: MouseEvent) =>
	{
		const dragPos = this.getInsertPosition(e);
		targetItem.setPanelInsertPosition(dragPos);
	}

	@action
	private readonly onPanelDrop = (dragItem: PanelItem, targetItem: PanelItem, e: MouseEvent) =>
	{
		const reset = () =>
		{
			targetItem.setPanelInsertPosition("none");
			this.setDraggingItem(null);
		}

		if (dragItem === targetItem)
		{
			reset();
			return;
		}

		const parent = dragItem.parent;
		const dragPos = this.getInsertPosition(e);
		const dragDir = dragPos === "left" || dragPos === "right" ? "horizontal" : "vertical";

		if (parent)
		{
			if (parent === targetItem.parent && parent.dir === dragDir)
			{
				const dragIndex = parent.children.indexOf(dragItem);
				const targetIndex = parent.children.indexOf(targetItem);
				if ((dragPos === "left" || dragPos === "top"))
				{
					if (dragIndex + 1 === targetIndex)
					{
						reset();
						return;
					}

					if (dragIndex === (targetIndex + 1))
						parent.swapChildren(dragIndex, targetIndex);
					else
						parent.relocateChild(dragIndex, targetIndex)
				}
				else
				{
					if (dragIndex === targetIndex + 1)
					{
						reset();
						return;
					}

					if (dragIndex === (targetIndex - 1))
						parent.swapChildren(dragIndex, targetIndex);
					else
						parent.relocateChild(dragIndex, targetIndex + 1);
				}
			}
			else
			{
				parent.removeChild(dragItem);

				const targetParent = targetItem.parent;

				if (targetParent)
				{
					if (targetParent.dir !== dragDir)
					{
						targetParent.boxChild(this, targetItem, dragItem, dragPos);
					}
					else
					{
						let targetIndex = targetParent.children.indexOf(targetItem);

						if (dragPos === "bottom" || dragPos === "right")
							targetIndex += 1;

						targetParent.insertChild(dragItem, targetIndex);
					}
				}
				else
				{
					throw new Error("could not get target parent!");
				}
			}

			reset();
		}
	}
}

type Weight = number | "auto";

export type PanelProps = {
	fc: React.FC<any>;
	title: string;
	menu?: MenuProps;
};

export type PanelBoxProps<K extends KeyType = string> = {
	dir: PanelBoxDir;
	children: (PanelItemProps<K> | K | ((PanelItemProps<K> | K)[]))[];
};

export type PanelType = {
	name: string;
};

type PanelItemProps<K extends KeyType = string> = {
	child: K | PanelBoxProps<K>;
	weight?: number | "auto";
};

type PanelBoxDir = "horizontal" | "vertical";

type PanelInsertPosition = "left" | "top" | "right" | "bottom" | "center";

type SlidingProps = {
	item: PanelItem;
	startSize: number;
	mousePos: number;
	resizeHandler: (e: MouseEvent, props: SlidingProps) => void;
};

type PanelsMap = {
	[name: KeyType]: PanelProps;
};

export type InitPanelManagerProps<M extends PanelsMap, K extends KeyType> = {
	panels: M;
	dir: PanelBoxDir;
	children: PanelLayoutConfig<K>;
};

type PanelLayoutConfig<K extends KeyType> = (PanelItemProps<K> | K | ((PanelItemProps<K> | K)[]))[];

type KeyType = string | number | symbol;