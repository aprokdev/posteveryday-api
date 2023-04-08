import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../../errors';
import TYPES from '../../inversify.types';
import { BaseController } from '../base-controller';
import { IENVConfig } from '../env-config/types';
import { ILogger } from '../logger/types';
import { IUsers } from '../users/types';
import { IUserController } from './types';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IUsers) public users: IUsers,
        @inject(TYPES.IENVConfig) public envConfig: IENVConfig,
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
        ]);
    }

    async register({ body }: Request, res: Response): Promise<void> {
        try {
            await this.users.create(body);
            res.status(201).json({ success: true });
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isUserValid = await this.users.validateUser(body);
            if (!isUserValid) {
                throw new HTTPError(422, 'Provided credentials are invalid');
            }
            const jwt = await this.users.signToken(body.email);
            res.status(200).json({ success: true, jwt });
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    async info({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        this.logger.info(body);
        res.json(body);
    }
}
