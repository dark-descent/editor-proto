import { action, computed, makeObservable, observable } from "mobx";
import path from "path";
import { PersistentStore } from "./PersistentStore";
import { RootStore } from "./RootStore";
import fs from "fs";
import { Component, Engine, EngineConfig, Entity, Transform } from "@engine";
import { ComponentType } from "react";
import { Scene } from "../../../engine/src/Scene";
import { mobx } from "utils";

const notEmpty = <T>(obj: any): obj is T => (typeof obj === "object" && Object.keys(obj).length !== 0);

export class ComponentStore<T extends Component>
{
	public readonly component: T;
	public readonly entity: EntityStore;

	public constructor(entity: EntityStore, component: T)
	{
		this.entity = entity;
		this.component = component;
	}
}

export class TransformStore extends ComponentStore<Transform>
{
	@observable
	private _children: TransformStore[];

	@computed
	public get children(): ReadonlyArray<TransformStore> { return this._children; }

	public constructor(entity: EntityStore, transform: Transform, children: TransformStore[] = [])
	{
		super(entity,transform);
		this._children = children;
	}
}

export class EntityStore
{
	private componentTypes: ComponentType<any>[] = [];
	private entity: Entity;

	@observable
	private _name: string;

	@computed
	public get name() { return this._name; }

	@observable
	private _components: ComponentStore<any>[];

	public readonly sceneStore: SceneStore;
	public readonly transform: TransformStore;
	
	public constructor(sceneStore: SceneStore, name: string = "Entity", entity: Entity = new Entity(name, sceneStore.scene))
	{
		this._name = name;
		this.sceneStore = sceneStore;
		this.entity = entity;
		
		this._components = [makeObservable(new TransformStore(this, new Transform(this.entity)))]
		this.transform = this._components[0]! as TransformStore;
	}

	public addComponent<T extends Component>(type: ComponentType<T>): ComponentStore<T>
	{
		const i = this.componentTypes.indexOf(type);
		if(i === -1)
		{
			const store = makeObservable(new ComponentStore<T>(this, this.entity.addComponent(type)));
			this.componentTypes.push(type);
			this._components.push(store);
			return store;
		}
		return this._components[i] as ComponentStore<T>;
	}

	public getComponent<T extends Component>(type: ComponentType<T>): ComponentStore<T> | null
	{
		const i = this.componentTypes.indexOf(type);
		if(i === -1)
			return null;
		return this._components[i] as ComponentStore<T>;
	}
}

class SceneStore extends PersistentStore<{}>
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
		this.scene = new Scene(name, engine);
	}

	@action
	public readonly addEntity = (name?: string) =>
	{
		console.log("add entity");
		const entity = makeObservable(new EntityStore(this, name));
		
		console.log("entity created");
		this._entities.push(entity);
		this._rootTransforms = [...this._rootTransforms, entity.transform];
	}
}

class Project extends PersistentStore<ProjectData, ProjectData | {}>
{
	@computed
	public get sceneCount()
	{
		return Object.keys(this.get("scenes")).length;
	}

	@computed
	public get hasScenes()
	{
		return this.sceneCount > 0;
	}

	@observable
	private _activeScene: SceneStore | null = null;

	@computed
	public get activeScene() { return this._activeScene; }

	private _engine: Engine | null = null;

	public get engine(): Engine { if (!this._engine) throw new Error("Engine is not initialized!"); return this._engine; }

	public readonly iterateScenes = <R>(iterator: (sceneInfo: SceneData, index: number) => R): R[] =>
	{
		const scenes = this.get("scenes");
		return Object.keys(scenes).map((name, i) => iterator({ name, path: scenes[name]! }, i));
	}

	protected initData(): ProjectData
	{
		return {
			name: "",
			scenes: {}
		};
	}

	public readonly initializeEngine = async (config: EngineConfig) =>
	{
		if (!this._engine)
			this._engine = await Engine.initialize(config);
	}

	private readonly createScenePath = (scenePath: string) => path.resolve(this.dir, "scenes", scenePath);

	public readonly createScene = (name: string) =>
	{
		console.log(`create scene ${name}...`);
		const scenes = this.get("scenes");
		const keys = Object.keys(scenes);
		if (keys.includes(name))
			return false;
		const o = { ...scenes, [name]: `${keys.length + 1}.json` };
		this.set("scenes", o);
		return true;
	}

	@action
	public readonly loadScene = (name: string) =>
	{
		console.log(`Load scene ${name}`);
		const scenePath = this.data.scenes[name];
		if (scenePath)
		{
			this._activeScene = makeObservable(new SceneStore(this.rootStore, this.createScenePath(scenePath), {}, this.engine, name));
			return true;
		}
		return false;
	}

	public readonly renameScene = (name: string, newName: string) =>
	{
		this.update("scenes", (scenes) => 
		{
			const s = scenes[name];
			if (s)
			{
				scenes[newName] = s;
				delete scenes[name];
			}
			return scenes;
		});
	}

	public readonly removeScene = (name: string) =>
	{
		this.update("scenes", (scenes) => 
		{
			if (scenes[name])
			{
				const p = scenes[name]!;
				const dir = this.createScenePath(p);
				fs.existsSync(dir) && fs.unlinkSync(dir); // TODO: change to async
				delete scenes[name];
			}
			return scenes;
		});
	}
}

export class ProjectManagerStore extends PersistentStore<ProjectListData, ProjectStoreProps | {}>
{
	@observable
	private _loadedProject: Project | null = null;

	@computed
	public get current() { return this._loadedProject; }

	@observable
	private _loadingProject: string = "";

	@computed
	public get isLoading() { return this._loadingProject !== ""; }

	@computed
	public get loadingProject() { return this._loadingProject; }

	public constructor(root: RootStore)
	{
		super(root, path.resolve(PersistentStore.appDataPath, "projects.json"));
	}

	protected override init(props: ProjectStoreProps | {}): void
	{
		if (notEmpty<ProjectStoreProps>(props))
		{
			const dir = props.projectDir;
		}

	}

	protected initData(): ProjectListData
	{
		return {
			projects: []
		};
	}

	private readonly findProjectIndex = (dir: string) => this.data.projects.findIndex(p => p.dir === dir);

	private readonly findProject = (dir: string) => this.data.projects.find(p => p.dir === dir);

	@action
	public readonly create = (name: string, dir: string) =>
	{
		this.set("projects", [...this.data.projects, { name, dir }]);
	}

	@action
	public readonly setLoadingProjectName = (name: string) => this._loadingProject = name;

	@action
	public readonly load = (dir: string): Promise<boolean> => 
	{
		const p = this.findProject(dir);
		if (p)
		{
			this._loadingProject = p.name;
			return new Promise<boolean>(action((res) => 
			{
				this._loadedProject = makeObservable(new Project(this.rootStore, path.resolve(dir, "project.json"), { name: p.name, scenes: {} }));
				this._loadedProject.initializeEngine({
					gameName: p.name,
				}).then(() => 
				{
					this.setLoadingProjectName("");
					res(true);
				});
			}));
		}
		return new Promise((res) => res(false));
	};

	@action
	public readonly remove = (dir: string) =>
	{
		const index = this.findProjectIndex(dir);
		if (index > -1)
		{
			const projects = [...this.data.projects];
			projects.splice(index, 1);
			this.set("projects", projects);

		}
	}

	@action
	public readonly rename = (name: string, newName: string) =>
	{
		const index = this.data.projects.findIndex(p => p.name === name);

		if (index > -1)
		{
			const projects = [...this.data.projects];

			projects[index]!.name = newName;

			this.set("projects", projects);
		}
	}
}

type ProjectStoreProps = {
	projectDir?: string;
};

type ProjectInfo = {
	name: string;
	dir: string;
};

type ProjectListData = {
	projects: ProjectInfo[]
};

type SceneData = {
	name: string;
	path: string;
};

type ProjectData = {
	name: string;
	scenes: { [key: string]: string };
};