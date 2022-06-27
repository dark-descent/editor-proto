import { computed, observable } from "mobx";
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
}