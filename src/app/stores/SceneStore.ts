import { action, computed, observable } from "mobx";
import { AssetManager } from "../../../engine/src/AssetManager";
import { EditorStore } from "./EditorStore";
import { Store } from "./Store";

@Store.preload
export class SceneStore extends Store
{
	@observable
	private _scenes: any[] = [];

	@computed
	public get scenes() { return this._scenes; };

	@computed
	public get hasOpenScenes() { return this._scenes.length > 0; };

	@action
	public readonly loadScene = (name: string) =>
	{
		const engine = this.getStore(EditorStore).editor.engine;
		const assetManager = engine.getSubSystem(AssetManager);
		console.log(assetManager);
	}
}