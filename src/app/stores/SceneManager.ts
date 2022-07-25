import { action, computed, observable } from "mobx";
import { AppMenuStore, MenuItem } from "./AppMenuStore";
import { AppStore } from "./AppStore";
import { PersistentStore } from "./PersistentStore";

export class SceneManager extends PersistentStore<SceneListData>
{
	public get name(): string { return "scenes"; }

	@observable
	private _loadedScenes: Scene[] = [];

	@observable
	private _activeScene: Scene | null = null;

	private readonly menuStore = this.getStore(AppMenuStore);

	protected initData(): SceneListData
	{
		return {
			scenes: []
		};
	}

	@computed
	public get loadedScenes()
	{
		return [...this._loadedScenes];
	}

	public readonly findScene = (name: string) => this.data.scenes.find(s => s.name === name);

	@action
	public readonly createScene = (name: string) =>
	{
		const s = this.findScene(name);

		if (s)
			return false;

		const scene = { name };

		this.set("scenes", [...this.data.scenes, scene]);
		this.loadScene(name);

		const item = this.menuStore.items[0]?.subMenuItems[1];
		if (item instanceof MenuItem)
			item.setSubMenuItems(this.data.scenes.map((s) => ({ label: s.name, onClick: () => this.loadScene(s.name) })));


		return true;
	}

	@action
	public readonly loadScene = (name: string): void =>
	{
		const s = this.findScene(name);
		if (s)
		{
			if (!this._loadedScenes.includes(s))
				this._loadedScenes = [...this._loadedScenes, s];

			this._activeScene = s;

			this.getStore(AppStore).setTitle(name);
		}
	}

	@action
	public readonly renameScene = (name: string, newName: string): any =>
	{
		const index = this.data.scenes.findIndex((s) => s.name === name);

		if (index > -1)
		{
			// this._activeScene = s;d

			this.getStore(AppStore).setTitle(name);

			const item = this.menuStore.items[0]?.subMenuItems[1];
			if (item instanceof MenuItem)
				item.setSubMenuItems(this.data.scenes.map((s) => ({ label: s.name, onClick: () => this.loadScene(s.name) })));
		}
	}
}

type SceneListData = {
	scenes: Scene[];
};

type Scene = {
	name: string;
};