import { NextFunction, Request, Response, Router } from 'express';

export type ExtressReturnType = Response<any, Record<string, any>>;

export interface Route {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
    middlewares?: Array<(req: Request, res: Response, next: NextFunction) => void>;
    func: (req: Request, res: Response, next: NextFunction) => void;
}
