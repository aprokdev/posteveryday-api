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

    // public sendOK(res: Response, code: number, json: string): ExtressReturnType {
    //     return res.send(code).send(json);
    // }

    bindRoutes(routes: Route[]): void {
        for (const route of routes) {
            this.logger.info(`[${route.method}] route '${route.path}' has been added`);
            const handler = route.func.bind(this);
            const pipeline = route.middlewares
                ? [...route.middlewares.map((m) => m.execute.bind(m)), handler]
                : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}
