import { IUserAuthInfoRequest } from '@middlewares/auth-middleware/types';
import { NextFunction, Request, Response } from 'express';
import { IMIddleware } from '../types';

export class AuthGuard implements IMIddleware {
    public async execute(
        { user }: IUserAuthInfoRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (user) {
            return next();
        }
        res.status(401).send({ message: 'You are not authorized' });
    }
}
