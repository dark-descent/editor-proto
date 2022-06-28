import { Editor, Project, ProjectProps } from "@engine/editor";
import { action, computed, observable } from "mobx";
import { SceneStore } from "./SceneStore";
import { Store } from "./Store";

@Store.preload
export class EditorStore extends Store
{
	public readonly editor = Editor.initialize();
	
	@observable
	private _project: Project | null = null;

	@computed
	public get project(): Readonly<Project> | null { return this._project; }

	@action
	public readonly loadProject = async (projectProps: ProjectProps) =>
	{
		const project = await this.editor.loadProject(projectProps);
		await this.getStore(SceneStore).loadScene("test");
		this._project = project;
	}
}