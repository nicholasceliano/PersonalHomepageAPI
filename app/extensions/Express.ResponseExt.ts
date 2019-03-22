export {}//force file to be loaded as module

declare global {
    namespace Express {
        interface Response {
            apiResponse(respData: object): Response
            apiError(error: string): Response
            locals: any;
        }
    }
}