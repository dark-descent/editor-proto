import { makeObservable } from "mobx";
import { RootStore } from "./RootStore";

export class Store<P extends {} = {}>
{
	public static readonly create = <T extends Store<any>>(storeType: StoreType<T>, ...params: ConstructorParameters<StoreType<T>>): T => 
	{
		const store = new storeType(...params) as any;
		return store;
	}

	public static readonly makeObservable = <T>(store: T): T =>
	{
		try
		{
			return makeObservable(store as any);
		}
		catch (e)
		{
			const error = e as Error;
			const err = "[MobX] No annotations were passed to makeObservable, but no decorated members have been found either";
			if (error.message === err)
				error.message += `!\r\nTried to decorate "${(store as any).constructor.name}"!`;
			console.warn(error);
			return store;
		}
	}

	public static readonly preload = (ctor: any) => { RootStore.instance.get(ctor); };

	public readonly rootStore: RootStore;

	protected readonly getStore: <T extends Store<P>, P extends {}>(storeType: StoreType<T>) => T;

	public constructor(root: RootStore)
	{
		this.rootStore = root;
		this.getStore = this.rootStore.get;
	}


	protected init(props: Partial<P>) { }

	protected onMount() { }
}

export type StoreType<T extends Store> = new (root: RootStore,) => T;