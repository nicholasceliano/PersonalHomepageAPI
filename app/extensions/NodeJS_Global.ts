export {};

declare global {
	namespace NodeJS {
		interface Global {
			appRoot: string;
		}
	}
}
