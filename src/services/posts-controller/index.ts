import { AuthGuard } from '@middlewares/auth-guard';
import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { BaseController } from '@services/base-controller';
import { ILogger } from '@services/logger/types';
import { HTTPError, HTTPError406 } from '@src/errors';
import TYPES from '@src/inversify.types';
import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPosts } from '../posts/types';
import { IPostsController } from './types';

@injectable()
export class PostsController extends BaseController implements IPostsController {
    constructor(
        @inject(TYPES.ILogger) private _logger: ILogger,
        @inject(TYPES.IPosts) private _posts: IPosts,
    ) {
        super(_logger, 'posts');
        this.bindRoutes([
            {
                path: '/create',
                func: this.create,
                method: 'post',
                middlewares: [new AuthGuard()],
            },
            {
                path: '/delete',
                func: this.delete,
                method: 'delete',
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    private _errorHandler(error: HTTPError, res: Response): void {
        this._logger.error(error.message);
        res.status(error?.status || 500).json({ success: false, message: error.message });
    }

    public async create(req: IRequestWithUser, res: Response): Promise<void> {
        try {
            const post = await this._posts.create(req);
            res.status(201).json({ success: true, data: post });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }

    public async delete(req: IRequestWithUser, res: Response): Promise<void> {
        try {
            const { image, id } = req.body;
            if (image === undefined) {
                throw new HTTPError406('image field is required');
            }
            if (id === undefined) {
                throw new HTTPError406('id field is required');
            }
            if (image === '') {
                throw new HTTPError406('image field can not be an empty string');
            }
            if (id === '') {
                throw new HTTPError406('id field can not be an empty string');
            }
            await this._posts.delete({ id, image });
            res.status(200).json({ success: true });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }
}
