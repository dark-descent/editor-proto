import { TypeMap } from "utils";
import React from "react";
import { Store, StoreType } from "./Store";

export class RootStore
{
	public static readonly instance = new RootStore();

	public static readonly get = <T extends Store>(storeType: StoreType<T>) => this.instance.get(storeType);

	private readonly stores = new TypeMap<Store>();

	private _isInitialized = false;
	private _isMounted = false;

	private readonly _initProps: InitStoreProps = new Map();

	public get isInitialized() { return this._isInitialized; };
	public get isMounted() { return this._isMounted; };

	private readonly getInitStoreProp = (type: StoreType<any>): any => this._initProps.get(type) || {};

	private constructor() { }

	public readonly get = <T extends Store<P>, P extends {}>(storeType: StoreType<T>): T =>
	{
		let store = this.stores.get(storeType);
		if (!store)
		{
			store = Store.create<T>(storeType, this);
			if (this.isInitialized)
			{
				store["init"](this.getInitStoreProp(storeType));
				Store.makeObservable(store);
			}
			if (this.isMounted)
				store["onMount"]();
			this.stores.set(storeType, store);
		}
		return store;
	}

	public static readonly withApp = async (app: React.FC<{}>, initStores: (rootStore: RootStore, init: StoreInitializer) => any = () => { }) =>
	{
		const ctx = require.context("./", false, /.(tsx?|jsx?|json)$/, "sync");

		await initStores(this.instance, (type, props) => this.instance._initProps.set(type, props));

		// load all the stores that wants to be preloaded
		ctx.keys().forEach(ctx);

		return () =>
		{
			React.useMemo(() => 
			{
				if (!this.instance.isInitialized)
				{
					this.instance._isInitialized = true;

					const init = (s: Store) => s["init"](this.instance.getInitStoreProp(s.constructor as any));

					this.instance.stores.forEach(init);
					this.instance.stores.forEach(Store.makeObservable);
				}
			}, []);

			React.useEffect(() => 
			{
				this.instance._isMounted = true;
				const mount = (s: Store) => s["onMount"]();
				this.instance.stores.forEach(mount);
				return () => 
				{
					this.instance._isMounted = false;
				};
			}, []);

			return React.createElement(app);
		}
	}
}

type InitStoreProps = Map<StoreType<any>, any>;
type StoreInitializer = <T extends Store<any>>(type: StoreType<T>, props: T extends Store<infer P> ? P : {}) => void;