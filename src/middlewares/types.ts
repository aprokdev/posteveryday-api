import { NextFunction, Request, Response } from 'express';
import { IUserAuthInfoRequest } from './auth-middleware/types';

export interface IMIddleware {
    execute: (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => void;
}
