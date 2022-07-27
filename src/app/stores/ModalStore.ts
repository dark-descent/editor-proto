import { action, computed, observable } from "mobx";
import React from "react";
import { RootStore } from "./RootStore";
import { Store } from "./Store";

export class Modal
{
	public static readonly create = (props: ModalProps, initiallyOpen: boolean = false) => Store.makeObservable(new Modal(props, initiallyOpen));

	private readonly modalManager: ModalManager;

	@observable
	private _title: string = "";

	public readonly options: Readonly<ModalOptions>;

	private openPromiseResolver: ((value: unknown) => void) | null = null;
	private openPromiseRejecter: ((reason?: any) => void) | null = null;

	@computed
	public get title() { return this._title; }

	@observable
	private _Component: React.FC<any>;

	@computed
	public get Component() { return this._Component; }

	public readonly canClose: () => (boolean | null | undefined);

	private _openValue: any = undefined;

	public get openValue() { return this._openValue; }

	public constructor(props: ModalProps, initiallyOpen: boolean = false)
	{
		const { title, Component, canClose, ...options } = props;

		this._title = title;
		this._Component = Component;
		this.modalManager = RootStore.instance.get(ModalManager);
		if (options.closable === undefined)
			options.closable = true;
		this.options = options;
		this.canClose = canClose || (() => true);

		if (initiallyOpen)
			this.modalManager.open(this);
	}

	public readonly open = (openValue: any = undefined) => 
	{
		this.modalManager.open(this);
		this._openValue = openValue;
		return new Promise<any>((resolve, reject) =>
		{
			if (this.openPromiseResolver !== null && this.openPromiseRejecter)
				this.openPromiseRejecter("Previous modal was already open!");
			this.openPromiseResolver = resolve;
			this.openPromiseRejecter = reject;
		});
	};

	public readonly close = (val?: any) => 
	{
		if (this.canClose())
		{
			this.modalManager.close(this);
			if (this.openPromiseResolver)
				this.openPromiseResolver(val);
			this.openPromiseResolver = null;
			this.openPromiseRejecter = null;
		}
	};

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
	canClose?: () => (boolean | null | undefined);
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
	public closeTopModal = (e?: React.MouseEvent | MouseEvent) =>
	{
		if (this._openModals.length !== 0)
		{
			this._openModals[this._openModals.length - 1]?.close();
			e?.preventDefault();
			e?.stopPropagation();
		}
	}

	@action flushUpdates = () => this._openModals = [...this._openModals];
}