import { action, computed, observable } from "mobx";
import { AppMenuStore, MenuItem } from "./AppMenuStore";
import { AppStore } from "./AppStore";
import { PersistentStore } from "./PersistentStore";

export class SceneManager extends PersistentStore<SceneListData>
{
	@action
	public readonly removeScene = (name: string) =>
	{
		const index = this.findSceneIndex(name);
		if (index > -1)
		{
			const scenes = [...this.data.scenes];
			scenes.splice(index, 1);
			this.set("scenes", scenes);
			const s = [...this._loadedScenes];
			this._loadedScenes = s.map(i => 
			{
				if (i == index)
					return -1;
				else if(i > index)
					return i - 1;
				return i;
			}).filter(i => i > -1);
			
			if(this._activeScene == index)
				this._activeScene = this._loadedScenes.length > 0 ? this._loadedScenes[0]! : -1;
			else if(this._activeScene > index)
				this._activeScene -= 1;
			
			if(this._activeScene == -1)
			{
				this.getStore(AppStore).setTitle();
			}
			else
			{
				const s = scenes[this._activeScene]!;
				this.getStore(AppStore).setTitle(s.name);
			}
		}
	}
	public get name(): string { return "scenes"; }

	@observable
	private _loadedScenes: number[] = [];

	@observable
	private _activeScene: number = -1;

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
		return this._loadedScenes.map((index) => this.data.scenes[index]!);
	}

	@computed
	public get activeScene()
	{
		if (this._activeScene > -1)
			return this.data.scenes[this._activeScene];
		return null;
	}

	public readonly findScene = (name: string) => this.data.scenes.find(s => s.name === name);
	public readonly findSceneIndex = (name: string) => this.data.scenes.findIndex(s => s.name === name);

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
		const s = this.findSceneIndex(name);
		if (s > -1)
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
		const index = this.findSceneIndex(name);

		console.log("rename scene from ", name, "to", newName, "at index", index);

		if (index > -1)
		{
			const scenes = [...this.data.scenes];
			console.log(scenes);
			// scenes[index]!.name = newName;

			// this.set("scenes", scenes);
			// console.log(scenes);

			// const item = this.menuStore.items[0]?.subMenuItems[1];
			// if (item instanceof MenuItem)
			// item.setSubMenuItems(this.data.scenes.map((s) => ({ label: s.name, onClick: () => this.loadScene(s.name) })));
		}
	}
}

type SceneListData = {
	scenes: Scene[];
};

type Scene = {
	name: string;
};