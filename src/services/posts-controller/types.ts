import { NextFunction, Request, Response, Router } from 'express';

export interface IPostsController {
    router: Router;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
