import { ILogger } from '@services/logger/types';
import TYPES from '@src/inversify.types';
import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IBaseController, Route } from './types';

@injectable()
export abstract class BaseController implements IBaseController {
    public router: Router;
    constructor(@inject(TYPES.ILogger) public logger: ILogger, public routeName: string) {
        this.router = Router();
    }

    public bindRoutes(routes: Route[]): void {
        for (const route of routes) {
            this.logger.info(
                `[route] '/${this.routeName}${
                    route.path
                }' (${route.method.toUpperCase()}) has been added`,
            );
            const handler = route.func.bind(this);
            const pipeline = route.middlewares
                ? [...route.middlewares.map((m) => m.execute.bind(m)), handler]
                : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}
