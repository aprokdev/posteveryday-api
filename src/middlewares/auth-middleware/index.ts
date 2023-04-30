import { IDatabase } from '@services/database/types';
import TYPES from '@src/inversify.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { verify } from 'jsonwebtoken';
import { IMIddleware } from '../types';
import { IUserAuthInfoRequest } from './types';

@injectable()
export class AuthMiddleware implements IMIddleware {
    constructor(private _secret: string, @inject(TYPES.IDatabase) private _db: IDatabase) {}

    public execute(req: IUserAuthInfoRequest, res: Response, next: NextFunction): void {
        if (req.headers?.authorization) {
            // verifies authorization header 'Bearer ${token}'
            // if token ok, it returns email in payload in callback,
            // then AuthGuard on root level checks if request pass further or not
            verify(req.headers.authorization.split(' ')[1], this._secret, async (err, payload) => {
                if (err) {
                    next();
                } else if (typeof payload === 'string') {
                    const user = await this._db.instance.user.findUnique({
                        where: { email: payload },
                    });
                    req.user = user;
                    next();
                }
            });
        } else {
            next();
        }
    }
}
