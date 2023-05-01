import { HTTPError } from '@errors/index';
import { IHTTPError } from '@errors/types';
import { ILogger } from '@services/logger/types';
import TYPES from '@src/inversify.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IErrorFilter } from './types';

@injectable()
export class ErrorFilter implements IErrorFilter {
    constructor(@inject(TYPES.ILogger) private _logger: ILogger) {}

    public execute(
        error: Error | IHTTPError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (error instanceof HTTPError) {
            this._logger.error(`[${error.context}] Error ${error.status} ${error.message}`);
            res.status(error.status).send({ error: error.message });
            return;
        }
        this._logger.error(`[ErrorFilter]: ${error.message}`);
        res.status(500).send({ sucess: false, error: error.message });
    }
}
