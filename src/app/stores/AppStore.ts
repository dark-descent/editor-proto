import { action, observable } from "mobx";
import { Engine } from "../../../engine/src/Engine";
import { Store } from "./Store";

export class AppStore extends Store<{ engine: Engine }>
{
	private static readonly TITLE = document.title;

	@observable
	private _title: string = AppStore.TITLE;

	private _engine!: Engine;

	protected override init({ engine }: Partial<{ engine: Engine }>): void
	{
		if (!engine)
			throw new Error("Could not load engine!\n");
		this._engine = engine;
	}

	@action
	public readonly setTitle = (...titles: string[]) => 
	{
		this._title = [AppStore.TITLE, ...titles].join(" - ");
		document.title = this._title;
	}

	@action
	public readonly build = () =>
	{

	}
}