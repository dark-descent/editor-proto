export const isWithinBounds = (index: number, arr: any[]) => index >= 0 && index < arr.length;

export const loop = (times: number, callback: (i: number) => any) =>
{
	for (let i = 0; i < times; i++)
		callback(i);
};

export const loopMap = <T>(times: number, callback: (i: number) => T): T[] => 
{
	const items: T[] = [];
	loop(times, (i) => items.push(callback(i)));
	return items;
};