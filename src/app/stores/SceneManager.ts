import { action, computed, observable } from "mobx";
import { AppStore } from "./AppStore";
import { PersistentStore } from "./PersistentStore";

export class SceneManager extends PersistentStore<SceneListData>
{
	public get name(): string { return "scenes"; }

	@observable
	private _loadedScenes: Scene[] = [];

	@observable
	private _activeScene: Scene | null = null;

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
		return true;
	}

	@action
	public readonly loadScene = (name: string): void =>
	{
		const s = this.findScene(name);
		if (s)
		{
			if(!this._loadedScenes.includes(s))
				this._loadedScenes = [...this._loadedScenes, s];
			
			this._activeScene = s;

			this.getStore(AppStore).setTitle(name);
		}
	}
}

type SceneListData = {
	scenes: Scene[];
};

type Scene = {
	name: string;
};