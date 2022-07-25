import { action, computed, observable } from "mobx";
import { RootStore } from "./RootStore";
import { Store } from "./Store";

import fs from "fs";
import path from "path";
import { ipcRenderer } from "electron";

export abstract class PersistentStore<Data extends {}> extends Store
{
	public static readonly appDataPath = ipcRenderer.sendSync("get-app-data-path");

	public abstract get name(): string;

	public readonly path: string;

	@observable
	private _data: Data;

	protected abstract initData(): Data;

	public constructor(root: RootStore)
	{
		super(root);
		this.path = this.initPath();
		this._data = JSON.parse(fs.readFileSync(this.path, "utf-8"));
	}

	private initPath() 
	{
		const p = path.resolve(PersistentStore.appDataPath, this.name + ".json");
		if(!fs.existsSync(p))
			fs.writeFileSync(p, JSON.stringify(this.initData()), "utf-8");
		return p;
	}

	@computed
	public get data() { return this._data; }

	public get<K extends keyof Data>(key: K): Data[K] { return this._data[key]; }
	
	@action
	public set<K extends keyof Data>(key: K, value: Data[K])
	{ 
		this._data = { ...this._data, [key]: value };
		fs.writeFileSync(this.path, JSON.stringify(this._data), "utf-8");
	}
}

export type PersistentData<T> = T extends PersistentStore<infer D> ? D : never;