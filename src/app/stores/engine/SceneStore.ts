import { makeObservable, observable } from "mobx";

export class SceneStore
{
	public static readonly create = (...args: SceneStoreArgs): SceneStore => makeObservable(new SceneStore());

	@observable
	private _entities: Entity[] = [];

	private constructor(...args: SceneStoreArgs)
	{

	}
}