import { NextFunction, Request, Response, Router } from 'express';
import { IMIddleware } from '../middleware/type';

export type ExtressReturnType = Response<any, Record<string, any>>;

export interface Route {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
    middlewares?: IMIddleware[];
    func: (req: Request, res: Response, next: NextFunction) => void;
}

export interface IBaseController {
    router: Router;
    // sendOK: (res: Response, code: number, json: string) => ExtressReturnType;
    bindRoutes: (routes: Route[]) => void;
}
