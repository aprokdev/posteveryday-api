import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { BaseController } from '../base-controller';
import { ILogger } from '../logger/types';
import { IUserRepository } from '../user-repository/types';
import { IUserController } from './types';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IUserRepository) public userRepository: IUserRepository,
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

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body;
            this.logger.warn(body);
            const result = await this.userRepository.create(body);
            this.logger.info(`user ${result.first_name} ${result.last_name} created`);
            res.status(200).json({ success: true });
        } catch (error: any) {
            this.logger.error(error.message);
            next();
        }
    }

    login(req: Request, res: Response, next: NextFunction): void {
        const body = req.body;
        this.logger.info(body);
        res.json({ ...body, status: 'ok' });
    }

    info(req: Request, res: Response, next: NextFunction): void {
        const body = req.body;
        this.logger.info(body);
        res.json(body);
    }
}
