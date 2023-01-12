import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../../errors';
import { IHTTPError } from '../../errors/types';
import TYPES from '../../inversify.types';
import { ILogger } from '../logger/types';
import { IErrorFilter } from './types';

@injectable()
export class ErrorFilter implements IErrorFilter {
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

    execute(error: Error | IHTTPError, req: Request, res: Response, next: NextFunction): void {
        if (error instanceof HTTPError) {
            this.logger.error(`[${error.context}] Error ${error.statusCode} ${error.message}`);
            res.status(error.statusCode).send({ error: error.message });
            return;
        }
        this.logger.error(`[ErrorFilter]: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
}
