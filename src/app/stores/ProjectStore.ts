import { action, computed, observable } from "mobx";
import { PersistentStore } from "./PersistentStore";
import { Store } from "./Store";

export class ProjectStore extends PersistentStore<ProjectsData, ProjectStoreProps>
{
	public get name(): string
	{
		return "projects";
	}

	@observable
	private _loadedProject: number = -1;

	@computed
	public get isLoaded() { return this._loadedProject > -1; }

	protected override init(props: ProjectStoreProps): void
	{
		const dir = props.projectDir;
		
		if (dir)
		{
			this._loadedProject = this.data.projects.findIndex(p => p.dir === dir);
		}
		
		if (this._loadedProject > -1)
		{
			
		}
		else
		{

		}
	}

	protected initData(): ProjectsData
	{
		return {
			projects: []
		};
	}

	private readonly findProjectIndex = (dir: string) => this.data.projects.findIndex(p => p.dir === dir);

	@action
	public readonly create = (name: string, dir: string) =>
	{
		this.set("projects", [...this.data.projects, { name, dir }]);
	}

	@action
	public readonly load = (dir: string) =>
	{
		this._loadedProject = this.findProjectIndex(dir);
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
			
			if (this._loadedProject == index)
				this._loadedProject = -1;
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

type Project = {
	name: string;
	dir: string;
};

type ProjectsData = {
	projects: Project[]
};