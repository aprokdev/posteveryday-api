import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { BaseController } from '../base-controller';
import { ILogger } from '../logger/types';
import { IUserController } from './types';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) public logger: ILogger) {
        super(logger);
        this.bindRoutes([
            {
                path: '/register',
                func: this.register,
                method: 'post',
            },
        ]);
    }

    register(req: Request, res: Response, next: NextFunction): void {
        this.logger.error('YES');
        res.type('application/json');
        const userData = req.body;
        this.logger.info(userData);
        res.json(userData);
    }
}
