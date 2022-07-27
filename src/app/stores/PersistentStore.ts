import { action, computed, observable } from "mobx";
import { RootStore } from "./RootStore";
import { Store } from "./Store";

import fs from "fs";
import { ipcRenderer } from "electron";

export abstract class PersistentStore<Data extends {}, Props extends {} = {}> extends Store<Props>
{
	public static readonly appDataPath = ipcRenderer.sendSync("get-app-data-path");

	@observable
	private _data: Data;

	public readonly path: string;

	protected abstract initData(): Data;

	public constructor(root: RootStore, path: string)
	{
		super(root);
		this.path = path;
		if (!fs.existsSync(this.path))
		{
			const data = this.initData();
			fs.writeFileSync(this.path, JSON.stringify(data), "utf-8");
			this._data = data;
		}
		else
		{
			this._data = JSON.parse(fs.readFileSync(this.path, "utf-8"));
		}
	}

	@computed
	public get data() { return this._data; }

	public readonly get = <K extends keyof Data>(key: K): Data[K] => this._data[key];

	@action
	public readonly set = <K extends keyof Data>(key: K, value: Data[K]) =>
	{
		this._data = { ...this._data, [key]: value };
		fs.writeFileSync(this.path, JSON.stringify(this._data), "utf-8");
	}

	@action
	private readonly setData = (data: Partial<Data>) =>
	{
		this._data = { ...this._data, ...data };
	}

	public update<K extends keyof Data>(key: K, updater: (value: Data[K]) => Data[K]): void;
	public update(data: Data): void;
	public update(updater: (value: Data) => Partial<Data>): void;
	public update<K extends keyof Data>(firstParam: K | Data | ((value: Data) => Partial<Data>), updater?: (value: Data[K]) => Data[K])
	{
		if (typeof firstParam === "string" && updater)
		{
			const key = firstParam as K;
			this.set(key, updater(this.get(key)));
		}
		else if (typeof firstParam === "function")
		{
			this.setData(firstParam(this._data))
		}
		else
		{
			this.setData(firstParam as Data);
		}
	}
}

type Updater<Data extends {}> = (<K extends keyof Data>(key: K, updater: (value: Data[K]) => Data[K]) => void) | ((data: Partial<Data>) => void);

export type PersistentData<T> = T extends PersistentStore<infer D> ? D : never;