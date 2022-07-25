declare class Entity
{
	public constructor();

	public getComponent<T extends Component>(type: ComponentType<T>): T;
}