import { IHTTPError } from './types';

export class HTTPError extends Error implements IHTTPError {
    constructor(public status: number, public message: string, public context?: string) {
        super(message);
    }
    statusCode: number;
}

export class HTTPError401 extends Error implements IHTTPError {
    status = 401;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError422 extends Error implements IHTTPError {
    status = 422;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}
