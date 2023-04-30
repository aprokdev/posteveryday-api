import { IMIddleware } from '@middlewares/types';
import { NextFunction, Request, Response, Router } from 'express';

export type ExtressReturnType = Response<any, Record<string, any>>;

export interface IBaseController {
    router: Router;
    bindRoutes: (routes: Route[]) => void;
}

export interface Route {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
    middlewares?: IMIddleware[];
    func: (req: Request, res: Response, next: NextFunction) => void;
}
