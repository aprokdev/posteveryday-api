import { AuthGuard } from '@middlewares/auth-guard';
import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { BaseController } from '@services/base-controller';
import { ILogger } from '@services/logger/types';
import { HTTPError } from '@src/errors';
import TYPES from '@src/inversify.types';
import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPosts } from '../posts/types';
import { IPostsController } from './types';

@injectable()
export class PostsController extends BaseController implements IPostsController {
    constructor(
        @inject(TYPES.ILogger) private _logger: ILogger,
        @inject(TYPES.IPosts) public posts: IPosts,
    ) {
        super(_logger, 'posts');
        this.bindRoutes([
            {
                path: '/create',
                func: this.create,
                method: 'post',
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    private _errorHandler(error: HTTPError, res: Response): void {
        this._logger.error(error.message);
        res.status(error?.status || 500).json({ success: false, message: error.message });
    }

    public async create(req: IRequestWithUser, res: Response, next: NextFunction): Promise<void> {
        try {
            const post = await this.posts.create(req);
            res.status(201).json({ success: true, data: post });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }
}
