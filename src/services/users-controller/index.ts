import { HTTPError, HTTPError404, HTTPError422 } from '@errors/index';
import { AuthGuard } from '@middlewares/auth-guard';
import { IAuth } from '@services/auth/types';
import { BaseController } from '@services/base-controller';
import { ILogger } from '@services/logger/types';
import { IUsers } from '@services/users/types';
import TYPES from '@src/inversify.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUsersController } from './types';

@injectable()
export class UsersController extends BaseController implements IUsersController {
    constructor(
        @inject(TYPES.ILogger) private _logger: ILogger,
        @inject(TYPES.IUsers) private _users: IUsers,
        @inject(TYPES.IAuth) private _auth: IAuth,
    ) {
        super(_logger, 'users');
        this.bindRoutes([
            {
                path: '/',
                func: this.info,
                method: 'get',
                middlewares: [new AuthGuard()],
            },
            {
                path: '/register',
                func: this.register,
                method: 'post',
            },
            {
                path: '/login',
                func: this.login,
                method: 'post',
            },
        ]);
    }

    private _errorHandler(error: HTTPError, res: Response): void {
        this._logger.error(error.message);
        res.status(error?.status || 500).json({ success: false, message: error.message });
    }

    public async register({ body }: Request, res: Response): Promise<void> {
        try {
            await this._users.create(body);
            res.status(201).json({ success: true });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }

    public async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isUserValid = await this._users.validateUser(body);
            if (!isUserValid) {
                throw new HTTPError422('Provided credentials are invalid');
            }
            const jwt = await this._auth.signToken(body.email);
            res.status(200).json({ success: true, jwt });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }

    public async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = req.query.email as string;
            if (!email) {
                throw new HTTPError422('"email" param is required');
            }
            const user = await this._users.findByEmail(email);
            if (user) {
                const { hash, salt, ...rest } = user;
                this.logger.trace(`[/users?email="${email}"]`, rest);
                res.json(rest);
            } else {
                throw new HTTPError404('User is not found');
            }
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }
}
