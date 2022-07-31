import { Component } from "@engine";
import { observable } from "mobx";
import { EntityStore } from "./EntityStore";

export class CoreComponentStore<T extends Component>
{
	public readonly component: T;
	public readonly entity: EntityStore;

	@observable
	private readonly state: any;

	public constructor(entity: EntityStore, component: T)
	{
		this.entity = entity;
		this.component = component;
		this.init();
	}

	protected init() { }
}