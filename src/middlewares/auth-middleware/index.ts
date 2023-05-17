import { IDatabase } from '@services/database/types';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IMIddleware } from '../types';
import { IRequestWithUser } from './types';

export class AuthMiddleware implements IMIddleware {
    constructor(private _secret: string, private _db: IDatabase) {}

    public execute(req: IRequestWithUser, res: Response, next: NextFunction): void {
        if (req.headers?.authorization) {
            // verifies authorization header 'Bearer ${token}'
            // if token ok, it returns user in payload in callback,
            // then AuthGuard on root level checks if request pass further or not
            verify(req.headers.authorization.split(' ')[1], this._secret, async (err, payload) => {
                if (err) {
                    next();
                } else if (typeof payload === 'object') {
                    const user = await this._db.instance.user.findUnique({
                        where: { email: payload.email },
                    });
                    req.user = user;
                    next();
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    }
}
