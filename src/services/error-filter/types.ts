import { NextFunction, Request, Response } from 'express';
import { IHTTPError } from '../../errors/types';

export interface IErrorFilter {
    execute: (error: Error | IHTTPError, req: Request, res: Response, next: NextFunction) => void;
}
