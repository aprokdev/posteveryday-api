import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { Request, Response, Router } from 'express';

export interface IPostsController {
    router: Router;
    create: (req: IRequestWithUser, res: Response) => Promise<void>;
    update: (req: IRequestWithUser, res: Response) => Promise<void>;
    delete: (req: IRequestWithUser, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
}
