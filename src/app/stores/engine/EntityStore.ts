import { Component, ComponentType, Entity, Transform } from "@engine";
import { computed, makeObservable, observable } from "mobx";
import { TransformStore } from "./components/TransformStore";
import { CoreComponentStore } from "./CoreComponentStore";
import { SceneStore } from "./SceneStore";

export class EntityStore
{
	private componentTypes: ComponentType<any>[] = [];
	private entity: Entity;

	@observable
	private _name: string;

	@computed
	public get name() { return this._name; }

	@observable
	private _components: CoreComponentStore<any>[];

	public readonly sceneStore: SceneStore;
	public readonly transform: TransformStore;

	public constructor(sceneStore: SceneStore, name: string = "Entity", entity: Entity = new Entity(name, sceneStore.scene))
	{
		this._name = name;
		this.sceneStore = sceneStore;
		this.entity = entity;

		this._components = [];

		this.transform = this.addComponent(Transform) as TransformStore;
	}

	public readonly addComponent = <T extends Component>(type: ComponentType<T>): CoreComponentStore<T> =>
	{
		const i = this.componentTypes.indexOf(type);
		if (i === -1)
		{
			let store = new CoreComponentStore<T>(this, this.entity.addComponent(type));
			try
			{
				store = makeObservable(store);
			}
			catch (e)
			{

			}
			this.componentTypes.push(type);
			this._components.push(store);
			return store;
		}
		return this._components[i] as CoreComponentStore<T>;
	}

	public readonly getComponent = <T extends Component>(type: ComponentType<T>): CoreComponentStore<T> | null =>
	{
		const i = this.componentTypes.indexOf(type);
		if (i === -1)
			return null;
		return this._components[i] as CoreComponentStore<T>;
	}
}