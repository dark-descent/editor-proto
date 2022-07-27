import { action, computed, makeObservable, observable } from "mobx";
import path from "path";
import { PersistentStore } from "./PersistentStore";
import { RootStore } from "./RootStore";

const notEmpty = <T>(obj: any): obj is T => (typeof obj === "object" && Object.keys(obj).length !== 0);

class Scene extends PersistentStore<{}>
{
	protected initData()
	{
		return {};
	}

	protected override init()
	{

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
	private _activeScene: Scene | null = null;

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

	protected override init()
	{

	}

	public readonly createScene = (name: string) =>
	{
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
		const scenePath = this.data.scenes[name];
		if (scenePath)
		{
			this._activeScene = makeObservable(new Scene(this.rootStore, path.resolve(this.dir, "scenes", scenePath), {}));
			return true;
		}
		return false;
	}

	public readonly renameScene = (name: string, newName: string) =>
	{

	}

	public readonly removeScene = (name: string) =>
	{

	}
}



type SceneData = {
	name: string;
	path: string;
};

type ProjectData = {
	name: string;
	scenes: { [key: string]: string };
};

export class ProjectManagerStore extends PersistentStore<ProjectListData, ProjectStoreProps | {}>
{
	@observable
	private _loadedProject: Project | null = null;

	@computed
	public get current() { return this._loadedProject; }

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
	public readonly load = (dir: string): boolean =>
	{
		const p = this.findProject(dir);
		if (p)
		{
			this._loadedProject = makeObservable(new Project(this.rootStore, path.resolve(dir, "project.json"), { name: p.name, scenes: {} }));
			return true;
		}
		return false;
	}

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

		console.log("rename scene from ", name, "to", newName, "at index", index);

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