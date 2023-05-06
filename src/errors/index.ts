import { IHTTPError } from './types';

export class HTTPError extends Error implements IHTTPError {
    constructor(public status: number, public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError401 extends Error implements IHTTPError {
    status = 401;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError404 extends Error implements IHTTPError {
    status = 404;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError405 extends Error implements IHTTPError {
    status = 405;
    constructor(public message: string, public context?: string) {
        super(message);
    }
}

export class HTTPError406 extends Error implements IHTTPError {
    status = 406;
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
