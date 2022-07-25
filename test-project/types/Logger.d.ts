declare class LogHandler
{
	public static get(): LogHandler;
	
	private constructor();

	public info(...args: any[]);
	public warn(...args: any[]);
	public error(...args: any[]);
}

declare const Logger: LogHandler;