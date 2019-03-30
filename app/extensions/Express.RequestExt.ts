export {}; // force file to be loaded as module

declare global {
	namespace Express {
		interface Request {
			header(name: string): string | undefined;
		}
	}
}
