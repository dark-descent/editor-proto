import { Transform } from "@engine";
import { observable } from "mobx";
import { CoreComponentStore } from "../CoreComponentStore";

export class TransformStore extends CoreComponentStore<Transform>
{
	@observable
	private readonly children: TransformStore[] = [];

	protected override init(): void
	{
		const children = this.component.children.map((c) => 
		{
			
		});
	}
}