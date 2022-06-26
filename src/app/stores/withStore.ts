import React from "react";
import { observer } from "mobx-react";
import { Store, StoreType } from "./Store";
import { RootStore } from "./RootStore";

export const withStore = <T extends Store, Props extends {}>(storeType: StoreType<T>, Component: React.FC<Props & { store: T }>, weak: boolean = false): React.FC<Props> =>
{
	Component = observer(Component);

	if (weak)
	{
		return (props: Props) =>
		{
			const store = React.useMemo(() => RootStore.instance.get(storeType), []);
			const p: Props & { store: T } = { store, ...props };
			return React.createElement(Component, p);
		};
	}
	else
	{
		const store = RootStore.instance.get(storeType);

		return (props: Props) =>
		{
			const p: Props & { store: T } = { store, ...props };
			return React.createElement(Component, p);
		};
	}
}

export const withStores = <T extends { [key: string]: Store }, Props extends {}>(storeTypes: { [K in keyof T]: StoreType<T[K]> }, Component: React.FC<Props & T>, weak: boolean = false): React.FC<Props> =>
{
	Component = observer(Component);

	if (weak)
	{
		return (props: Props) =>
		{
			const stores = React.useMemo(() =>
			{
				const o: Partial<T> = {};
				for (const k in storeTypes)
					o[k] = RootStore.instance.get(storeTypes[k]);
				return o as T;
			}, []);
			const p: Props & T = { ...stores, ...props };
			return React.createElement(Component, p);
		};
	}
	else
	{
		const stores: Partial<T> = {};
		for (const k in storeTypes)
			stores[k] = RootStore.instance.get(storeTypes[k]);

		return (props: Props) =>
		{
			const p = { ...stores, ...props } as Props & T;
			return React.createElement(Component, p);
		};
	}
}
