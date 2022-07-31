import { Engine, Scene, Transform } from "@engine";
import { action, computed, observable, makeObservable } from "mobx";
import { PersistentStore } from "../PersistentStore";
import { RootStore } from "../RootStore";
import { TransformStore } from "./components/TransformStore";
import { CoreComponentStore } from "./CoreComponentStore";
import { EntityStore } from "./EntityStore";

export class SceneStore extends PersistentStore<{}>
{
	public readonly engine: Engine;

	private readonly _entities: EntityStore[] = [];

	@observable
	private _rootTransforms: TransformStore[] = [];

	@computed
	public get rootTransforms() { return this._rootTransforms; }

	public readonly scene: Scene;

	protected initData()
	{
		return {};
	}

	public constructor(root: RootStore, path: string, initData: {}, engine: Engine, name?: string)
	{
		super(root, path, initData);
		this.engine = engine;
		this.scene = new Scene(name, engine, -1, true);
	}

	@action
	public readonly addEntity = (name?: string) =>
	{
		const entity = makeObservable(new EntityStore(this, name));
		this._entities.push(entity);
		this._rootTransforms = [...this._rootTransforms, entity.transform];
	}
}