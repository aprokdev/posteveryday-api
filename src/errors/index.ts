import { IHTTPError } from './types';

export class HTTPError extends Error implements IHTTPError {
    constructor(public statusCode: number, public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError401 extends Error implements IHTTPError {
    statusCode = 401;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}
