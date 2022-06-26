export const toSnakeCase = (str: string, delimiter: string = "-"): string => str.split("").map((l, i) => 
{
	if (i !== 0 && l === l.toUpperCase() && l !== delimiter)
		return `${delimiter}${l}`;
	return l;
}).join("").toLowerCase();

export const capitalize = (str: string) => str.length > 0 ? ((str[0] || "").toUpperCase() + str.slice(1, str.length).toLowerCase()) : "";

export const toBase64 = (str: string) => Buffer.from(str).toString("base64");
