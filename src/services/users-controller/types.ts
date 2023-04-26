import { NextFunction, Request, Response, Router } from 'express';

export interface IUsersController {
    router: Router;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
