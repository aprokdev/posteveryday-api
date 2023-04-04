import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
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
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isUserValid = await this.users.validateUser(body);
            if (!isUserValid) {
                const message = "Provided password doesn't match";
                this.logger.error(message);
                res.status(401).json({ message });
            }
            const secret = this.envConfig.get('SECRET');

            if (!secret) {
                throw new Error('secret is absent in .env file');
            }
            if (secret) {
                const jwt = await sign(body.email, secret, { algorithm: 'HS256' });
                res.status(200).json({ success: true, jwt });
            }
            next();
        } catch (error: any) {
            this.logger.error(error.message);
            if (error instanceof HTTPError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: error.message });
        }
    }

    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        const body = req.body;
        this.logger.info(body);
        res.json(body);
    }
}
