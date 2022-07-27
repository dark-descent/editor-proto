import { AppMenuStore, MenuItem, MenuSeperator, withStore } from "app/stores";
import { View } from "app/views";
import React from "react";
import { getClassFromProps } from "utils/react";

import "./styles/menu.scss";

export const MenuItemFC = withStore<AppMenuStore, { item: MenuItem }>(AppMenuStore, ({ store, item }) => 
{
	return (
		<View className={getClassFromProps("menu-item", { active: item.isActive })}>
			<View className="label" onMouseDown={item.onMouseDown} onMouseEnter={item.onMouseEnter} onMouseLeave={item.onMouseLeave}>
				{item.label}
			</View>
			{item.hasSubMenu && <View absolute className="sub-menu">{item.subMenuItems.map((item, i) => item === MenuSeperator ? <View key={i} className="sep"/> : <MenuItemFC item={item} key={i} />)}</View>}
		</View>
	);
});

export const Menu = withStore(AppMenuStore, ({ store }) => 
{
	return (
		<View className="menu" fill tertiary>
			{store.items.map((item, i) => <MenuItemFC item={item} key={i} />)}
		</View>
	);
});