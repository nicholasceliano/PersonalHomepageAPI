export {}; // force file to be loaded as module

declare global {
	namespace Express {
		interface Response {
			locals: any;
			apiResponse(respData: object): Response;
			apiError(error: string): Response;
		}
	}
}
