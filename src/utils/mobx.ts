export namespace mobx
{
	export namespace array
	{
		export const push = <Class, K extends keyof Class, T extends Class[K]>(thisType: Class, arrayKey: K, ...items: T extends Array<any> ? T : never[]): T =>
		{
			const a = thisType[arrayKey];
			if(Array.isArray(a))
			{
				const newArray: any = [...a, ...items];
				thisType[arrayKey] = newArray;
				return newArray as T;
			}
			throw new Error(`Cannot push into non array type ${(thisType as any).constructor.name}.${arrayKey.toString()}!`);
		}
	}
};