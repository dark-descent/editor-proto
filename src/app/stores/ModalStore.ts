import { action, computed, observable } from "mobx";
import React from "react";
import { RootStore } from "./RootStore";
import { Store } from "./Store";

export class Modal
{
	public static readonly use = (props: ModalProps, initiallyOpen: boolean = false) => React.useMemo(() => Store.makeObservable(Store.create(Modal, props, initiallyOpen)), [props]);

	private readonly modalManager: ModalManager;

	@observable
	private _title: string = "";

	public readonly options: Readonly<ModalOptions>;

	@computed
	public get title() { return this._title; }

	@observable
	private _Component: React.FC<any>;

	@computed
	public get Component() { return this._Component; }

	public constructor(props: ModalProps, initiallyOpen: boolean = false)
	{
		const { title, Component, ...options } = props;

		this._title = title;
		this._Component = Component;
		this.modalManager = RootStore.instance.get(ModalManager);
		this.options = options;

		if(initiallyOpen)
			this.modalManager.open(this);
	}

	public readonly open = () => this.modalManager.open(this);

	public readonly close = () => this.modalManager.close(this);

	public readonly toggle = () =>
	{
		if (this.modalManager.isOpen(this))
			this.close();
		else
			this.open();
	}

	@action
	public setTitle = (title: string) => 
	{
		this._title = title;
		this.modalManager.flushUpdates();
	};
};

type ModalProps = {
	Component: React.FC<any>;
	title: string;
} & ModalOptions;

export type ModalOptions = {
	closable?: boolean;
	movable?: boolean;
	maxWidth?: number | string;
	maxHeight?: number | string;
	minWidth?: number | string;
	minHeight?: number | string;
	width?: number | string;
	height?: number | string;
};

export class ModalManager extends Store
{
	@observable
	private _openModals: Modal[] = [];

	@action
	public toggleModal(modal: Modal)
	{
		this._openModals = [...this._openModals, modal];
	}

	@action
	public open(modal: Modal)
	{
		this._openModals = [...this._openModals, modal];
		return modal;
	}

	@computed
	public get modals()
	{
		return [...this._openModals];
	}

	@action
	public close(modal: Modal)
	{
		const m = [...this._openModals];
		const i = m.indexOf(modal);
		if (i > -1)
		{
			m.splice(i, 1);
			this._openModals = [...m];
		}
	}

	public isOpen(modal: Modal)
	{
		return this._openModals.includes(modal);
	}

	@action
	public closeTopModal = () =>
	{
		if (this._openModals.length !== 0)
			this._openModals[this._openModals.length - 1]?.close();
	}

	@action flushUpdates = () => this._openModals = [...this._openModals];
}