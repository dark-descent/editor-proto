export class TypeMap<Type>
{
	public readonly map: Map<ClassType<Type>, Type> = new Map();

	public readonly delete = this.map.delete.bind(this);
	public readonly clear = this.map.clear.bind(this);
	public readonly keys = this.map.keys.bind(this);
	public readonly forEach = (callbackfn: (value: Type, key: ClassType<Type>, map: Map<ClassType<Type>, Type>) => void, thisArg?: any) => this.map.forEach(callbackfn, thisArg);
	public readonly entries = this.map.entries.bind(this);
	public readonly has = this.map.has.bind(this);
	public get size() { return this.map.size; }
	public readonly values = this.map.values.bind(this);


	public readonly get = <T extends Type>(type: ClassType<T>): T | undefined =>
	{
		return this.map.get(type) as T | undefined;
	}

	public readonly set = <T extends Type>(type: ClassType<T>, instance: T): T =>
	{
		this.map.set(type, instance);
		return instance;
	}
}

export type ClassType<T> = new (...args: any[]) => T;
export type ClassTypeArgs<T> = T extends new (...args: infer Args) => any ? Args : [];