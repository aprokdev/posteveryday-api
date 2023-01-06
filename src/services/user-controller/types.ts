import { NextFunction, Request, Response, Router } from 'express';

export interface IUserController {
    router: Router;
    register: (req: Request, res: Response, next: NextFunction) => void;
}
