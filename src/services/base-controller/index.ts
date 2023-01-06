import { Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { ILogger } from '../logger/types';
import { ExtressReturnType, IBaseController, Route } from './types';

@injectable()
export abstract class BaseController implements IBaseController {
    public router: Router;
    constructor(@inject(TYPES.ILogger) public logger: ILogger) {
        this.router = Router();
    }

    public sendOK(res: Response, data: { message: string }): ExtressReturnType {
        return res.send(200).send(data);
    }

    bindRoutes(routes: Route[]): void {
        for (const route of routes) {
            this.logger.info(`route '${route.path}' [${route.method}] has been added`);
            const handler = route.func.bind(this);
            const pipeline = route.middlewares ? [...route.middlewares, handler] : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}
