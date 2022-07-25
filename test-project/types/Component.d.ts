declare abstract class Component
{
	public constructor(...args: EntityArgs);

	public start(): void;
	public render(): void;
	public update(): void;
	public onDestroy(): void;
}

type EntityArgs = [Entity];

type ComponentType<T extends Component> = new (...args: EntityArgs) => T;