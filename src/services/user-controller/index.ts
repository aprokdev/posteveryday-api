import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { BaseController } from '../base-controller';
import { ILogger } from '../logger/types';
import { IUsers } from '../users/types';
import { IUserController } from './types';

@injectable()
export class UserController extends BaseController implements IUserController {
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
        ]);
    }

    async register({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            this.logger.warn(body);
            const result = await this.users.create(body);
            this.logger.info(`user created: [${result}]`);
            res.status(200).json({ success: result });
        } catch (error: any) {
            this.logger.error(error.message);
            next();
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const body = req.body;
        this.logger.info(body);
        res.json({ ...body, status: 'ok' });
    }

    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        const body = req.body;
        this.logger.info(body);
        res.json(body);
    }
}
