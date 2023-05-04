import { NextFunction, Request, Response } from 'express';
import { IRequestWithUser } from './auth-middleware/types';

export interface IMIddleware {
    execute: (req: IRequestWithUser, res: Response, next: NextFunction) => void;
}
