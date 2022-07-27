import { action, observable } from "mobx";
import { Store } from "./Store";

export class AppStore extends Store
{
	private static readonly TITLE = document.title;

	@observable
	private _title: string = AppStore.TITLE;

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