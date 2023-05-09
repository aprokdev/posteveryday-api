import { AuthGuard } from '@middlewares/auth-guard';
import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { BaseController } from '@services/base-controller';
import { ILogger } from '@services/logger/types';
import { HTTPError, HTTPError406 } from '@src/errors';
import TYPES from '@src/inversify.types';
import { Request, Response } from 'express';
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
                path: '/',
                func: this.get,
                method: 'get',
            },
            {
                path: '/create',
                func: this.create,
                method: 'post',
                middlewares: [new AuthGuard()],
            },
            {
                path: '/update',
                func: this.update,
                method: 'put',
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

    public async update(req: IRequestWithUser, res: Response): Promise<void> {
        try {
            const updated = await this._posts.update(req);
            res.status(200).json({ success: true, data: updated });
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

    public async get(req: Request, res: Response): Promise<void> {
        try {
            const offset = req.query.offset as string;
            const limit = req.query.limit as string;
            const author_id = req.query.author_id as string;
            const order = req.query.order as string;
            const order_field = req.query.order_field as string;

            const list = await this._posts.getMany({
                offset,
                limit,
                author_id,
                order,
                order_field,
            });

            res.status(200).json({ success: true, data: { list } });
        } catch (error: any) {
            this._errorHandler(error, res);
        }
    }
}
