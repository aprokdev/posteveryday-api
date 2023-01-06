import { IHTTPError } from './types';

export class HTTPError extends Error implements IHTTPError {
    constructor(public statusCode: number, public message: string, public context: string) {
        super(message);
    }
}
