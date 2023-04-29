import { BaseController } from '@services/base-controller';
import { ILogger } from '@services/logger/types';
import { HTTPError } from '@src/errors';
import TYPES from '@src/inversify.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPosts } from '../posts/types';
import { IPostsController } from './types';

@injectable()
export class PostsController extends BaseController implements IPostsController {
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IPosts) public posts: IPosts,
    ) {
        super(logger);
        this.bindRoutes([
            {
                path: '/create',
                func: this.create,
                method: 'post',
            },
        ]);
    }

    errorHandler(error: HTTPError, res: Response): void {
        this.logger.error(error.message);
        res.status(error?.status || 500).json({ success: false, message: error.message });
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, html, imageURL: image } = await this.posts.parseFieldsAndS3Upload(req);
            // const result = await this.posts.create({
            //     data: {
            //         title,
            //         html,
            //         html_preview: html.slice(0, 340),
            //         image: imageURL,
            //         author_id: Number(session.id),
            //         author_firstname: session.first_name,
            //         author_lastname: session.last_name,
            //     },
            // });
            // res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            this.errorHandler(error, res);
        }
    }
}
