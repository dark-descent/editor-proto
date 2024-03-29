import { observer } from "mobx-react-lite";
import React from "react";
import { preventEvent } from "utils";
import { getClassFromProps } from "utils/react";
import { PanelItem, PanelBox, PanelManager, withStore, Panel, PanelMenu, PanelMenuItem } from "../stores";
import { FlexBox, FlexItem, View } from "../views";

import "./styles/panel-layout.scss";

const PanelMenuItemFC = observer<{ item: PanelMenuItem | "seperator", onItemClick: (item: PanelMenuItem) => (e: React.MouseEvent) => void }>(({ item, onItemClick }) => 
{
	if (item === "seperator")
		return (
			<View className="sep" />
		);
	return (
		<View onClick={onItemClick(item)}>
			{item.label}
			{item.subMenu.length > 0 && (
				<View className="sub-menu">
					{item.subMenu.map((item, i) => <PanelMenuItemFC key={i} item={item} onItemClick={onItemClick} />)}
				</View>
			)}
		</View>
	);
})

const PanelMenuFC = observer<{ menu: PanelMenu }>(({ menu }) => 
{
	const [isOpen, _setIsOpen] = React.useState(false);

	const setIsOpen = (_isOpen: boolean) =>
	{
		menu.isOpenRef = _isOpen;
		_setIsOpen(_isOpen);
	}

	const setIsOpenRef = React.useRef(setIsOpen);

	React.useEffect(() => 
	{
		const listener = () => setIsOpenRef.current(false);

		window.addEventListener("mousedown", listener);
		return () => window.removeEventListener("mousedown", listener);
	}, []);

	const toggle = (e: React.MouseEvent) => 
	{
		e.preventDefault();
		e.stopPropagation();
		setIsOpenRef.current(!isOpen);
	};

	const onItemClick = (item: PanelMenuItem) => (e: React.MouseEvent) =>
	{
		if (item.onClick(e))
			setIsOpenRef.current(!isOpen);
	}

	return (
		<View absolute className={getClassFromProps("menu-wrapper", { open: isOpen })} onMouseDown={preventEvent}>
			<View className="btn" absolute onClick={toggle}>
				<View absolute centered />
			</View>
			<View className="menu" absolute>
				{menu.items.map((item, i) => <PanelMenuItemFC key={i} item={item} onItemClick={onItemClick} />)}
			</View>
		</View>
	);
});

const PanelWrapper = withStore<PanelManager, { panel: Panel, item: PanelItem }>(PanelManager, ({ panel, item, store }) =>
{
	const onStartDrag = store.useStartDragMethod(item);
	const onMouseMove = store.usePanelMouseMoveMethod(item);
	const onMouseUp = store.usePanelMouseUpMethod(item);

	return (
		<View className="panel-wrapper" absolute fill onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={item.onMouseLeave}>
			<FlexBox className="panel" absolute fill vertical>
				<FlexItem base={24}>
					<View className="panel-titlebar" fill absolute onMouseDown={onStartDrag}>
						<View className="title">{panel.title}</View>
						{panel.menu && <PanelMenuFC menu={panel.menu} />}
					</View>
				</FlexItem>
				<FlexItem>
					<View className="panel-body" fill absolute>
						<panel.Body />
					</View>
				</FlexItem>
			</FlexBox>
			<View className={getClassFromProps("panel-overlay", { [item.panelInsertPosition]: true, isDragging: store.draggingItem === item })} absolute />
		</View>
	);
});

const Item = withStore<PanelManager, { item: PanelItem, isLast: boolean }>(PanelManager, ({ item, store, isLast }) =>
{
	const props = item.useFlexProps();

	const onStartSlide = store.useStartSlideMethod(item);

	return (
		<FlexItem {...props} elRef={item.ref}>
			{PanelBox.is(item.child) ? <Box box={item.child} /> : <PanelWrapper panel={item.child} item={item} />}
			{!isLast && <View absolute className={getClassFromProps("slider", {})} onMouseDown={onStartSlide}><View /></View>}
		</FlexItem>
	);
});

const Box = withStore<PanelManager, { box: PanelBox }>(PanelManager, ({ box, store }) =>
{
	const props = box.useFlexProps();

	const lastIndex = box.children.length - 1;

	return (
		<FlexBox fill {...props}>
			{box.children.map((item, i) => <Item key={i} item={item} isLast={i === lastIndex} />)}
		</FlexBox>
	);
});

export const PanelLayout = withStore(PanelManager, ({ store }) => 
{
	return (
		<View absolute fill className="panel-layout">
			<Box box={store.rootBox} />
		</View>
	);
});