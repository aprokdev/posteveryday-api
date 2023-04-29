import { HTTPError, HTTPError404, HTTPError422 } from '@errors/index';
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
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IUsers) public users: IUsers,
    ) {
        super(logger);
        this.bindRoutes([
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
            {
                path: '/',
                func: this.info,
                method: 'get',
            },
        ]);
    }

    errorHandler(error: HTTPError, res: Response): void {
        this.logger.error(error.message);
        res.status(error?.status || 500).json({ success: false, message: error.message });
    }

    async register({ body }: Request, res: Response): Promise<void> {
        try {
            await this.users.create(body);
            res.status(201).json({ success: true });
        } catch (error: any) {
            this.errorHandler(error, res);
        }
    }

    async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isUserValid = await this.users.validateUser(body);
            if (!isUserValid) {
                throw new HTTPError422('Provided credentials are invalid');
            }
            const jwt = await this.users.signToken(body.email);
            res.status(200).json({ success: true, jwt });
        } catch (error: any) {
            this.errorHandler(error, res);
        }
    }

    async info({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.users.findByEmail(body.email);
            if (user) {
                const { hash, salt, ...rest } = user;
                this.logger.info(rest);
                res.json(rest);
            } else {
                throw new HTTPError404('User is not found');
            }
        } catch (error: any) {
            this.errorHandler(error, res);
        }
    }
}
