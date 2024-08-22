import { ExError } from "./error";

function errorWrapper(error: any, methodName?: string): ExError {
    const msg: string = (() => {
        if (methodName) {
            return `Error in ${methodName} request: ${error}`
        } else {
            return error
        }
    })()

    const statusCode: number = (() => {
        if (error.statusCode) {
            return error.statusCode
        } else {
            return 400
        }
    })()

    return new ExError(msg, statusCode)
}

export { errorWrapper }
