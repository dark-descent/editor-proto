import { Store } from "./Store";

export class WorkspaceStore extends Store
{
	private _canvas: HTMLCanvasElement | null = null;
	private _gpu: GPU | null = null;

	public get canvas() { return this._canvas; }
	public get gpuContext() { return this._gpu; }

	public resetCanvas(canvas: HTMLCanvasElement | null)
	{
		this._canvas = canvas;
	}
}