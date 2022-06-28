import { action, computed, observable } from "mobx";
import { SceneManager, Scene } from "@engine";
import { EditorStore } from "./EditorStore";
import { Store } from "./Store";

@Store.preload
export class SceneStore extends Store
{
	private _scenes: Scene[] = [];

	@observable
	private _activeSceneIndex: number = -1;

	@computed
	public get scenes() { return this._scenes; };

	@computed
	public get hasOpenScenes() { return this._scenes.length > 0; };

	@computed
	public get activeScene() { return (this._activeSceneIndex > -1 ? this._scenes[this._activeSceneIndex] : null) || null; };

	@action
	public readonly loadScene = (name: string) =>
	{
		const engine = this.getStore(EditorStore).editor.engine;
		const sceneManager = engine.getSubSystem(SceneManager);
		const scene = sceneManager.loadScene(name);
		this._activeSceneIndex = this._scenes.push(scene) - 1;
	}
}