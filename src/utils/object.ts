export const isEmpty = (obj: { [key: string]: any }) => (typeof obj === "object" && !Array.isArray(obj)) ? (Object.keys(obj).length === 0) : false;

export const serialize = (obj: { [key: string]: any }) =>
{
	let parts = [];
	for (const p in obj)
		if (obj.hasOwnProperty(p))
			parts.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	return parts.join("&");
}

export const parseQuery = (query: string = "") =>
{
	let obj: any = {};
	// query.split("&").forEach(str => 
	// {
	// 	const [key, val] = str.split("=");
	// 	console.log(key, val);
	// 	obj[key] = JSON.parse(val);
	// });
	return obj;
}

export const lock = <T>(o: T): RecursiveReadonly<T> => {
	if(typeof o === "object")
	{
		const obj = o as any;
		Object.keys(obj).forEach((k) => obj[k] = lock(obj[k]));
	}
	return Object.seal(Object.freeze(o)) as RecursiveReadonly<T>;
};

