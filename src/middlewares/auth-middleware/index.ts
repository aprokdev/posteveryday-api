import { IAuth } from '@services/auth/types';
import { IDatabase } from '@services/database/types';
import TYPES from '@src/inversify.types';
import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IMIddleware } from '../types';
import { IRequestWithUser } from './types';

@injectable()
export class AuthMiddleware implements IMIddleware {
    constructor(
        @inject(TYPES.IAuth) private _auth: IAuth,
        @inject(TYPES.IDatabase) private _db: IDatabase,
    ) {}

    public async execute(req: IRequestWithUser, res: Response, next: NextFunction): Promise<void> {
        if (req.headers?.authorization) {
            // verifies authorization header 'Bearer ${token}'
            // if token ok, it returns users email in callback,
            // then AuthGuard on root level checks if request pass further or not
            try {
                const email = await this._auth.verifyToken(req.headers.authorization.split(' ')[1]);
                if (email) {
                    const user = await this._db.instance.user.findUnique({
                        where: { email: email },
                    });
                    req.user = user;
                }
                next();
            } catch (error) {
                next();
            }
        } else {
            next();
        }
    }
}
