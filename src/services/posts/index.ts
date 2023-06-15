import { HTTPError401, HTTPError422 } from '@errors/index';
import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { IDatabase } from '@services/database/types';
import { ILogger } from '@services/logger/types';
import { IS3Client } from '@services/s3-client/types';
import TYPES from '@src/inversify.types';
import formatDateString from '@utils/formateDateString';
import { feedModel } from '@utils/postDataFormat';
import busboy from 'busboy';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import {
    IDeletePostParams,
    IGetPostsParams,
    IParseUploadResponse,
    IPostData,
    IPosts,
} from './types';

@injectable()
export class Posts implements IPosts {
    constructor(
        @inject(TYPES.IDatabase) private _db: IDatabase,
        @inject(TYPES.IS3Client) private _s3: IS3Client,
        @inject(TYPES.ILogger) private _logger: ILogger,
    ) {}
    getPosts: (params: IGetPostsParams) => Promise<IPostData[]>;

    public async create(req: IRequestWithUser): Promise<IPostData> {
        const { user } = req;
        if (!user) throw new HTTPError401('You should be authorized to perform that action');

        const { id, first_name, last_name } = user;
        const { title, html, imageURL } = await this._parseFieldsAndS3Upload(req);

        const post = await this._db.instance.post.create({
            data: {
                title,
                html,
                html_preview: html.slice(0, 340),
                image: imageURL,
                author_id: Number(id),
                author_firstname: first_name,
                author_lastname: last_name,
            },
        });

        return { ...post, created: formatDateString(post.created.toISOString()) };
    }

    public async update(req: IRequestWithUser): Promise<IPostData> {
        const { user } = req;
        if (!user) throw new HTTPError401('You should be authorized to perform that action');

        const { title, html, imageURL, id } = await this._parseFieldsAndS3Upload(req);

        // ==== id field required in request! These 2 checks prevent undesirable behaviour
        // if image file was sent, it will be put in s3 anyways,
        // so after check we should remove it from bucket:
        const isIdField = id !== 'undefined' && id !== '' && id !== undefined;

        if (!isIdField && imageURL) {
            const url = new URL(imageURL);
            const key = url.pathname.slice(1); // key: '/images/filename.jpg' => 'images/filename.jpg'
            const isOk = await this._s3.deleteS3File(key);

            throw new HTTPError422("'id' field is required");
        }
        if (!isIdField && !imageURL) {
            throw new HTTPError422("'id' field is required");
        }
        if (!isIdField) {
            throw new HTTPError422("'id' field is required");
        }
        // ====

        // Don't forget to remove previous image from S3 bucket, if it had been passed
        const previousPost = await this._db.instance.post.findFirst({
            where: { id: Number(id) },
        });
        if (previousPost && imageURL) {
            const key = this._s3.getS3KeyFromURL(previousPost.image);
            const isOk = await this._s3.deleteS3File(key);
            console.log('isOk', isOk);
        }

        const data = {
            title: title.length > 0 ? title : undefined,
            html: html.length > 0 ? html : undefined,
            html_preview: html.length > 0 ? html.slice(0, 340) : undefined,
            image: imageURL,
        };

        const updated = await this._db.instance.post.update({
            where: {
                id: Number(id),
            },
            data,
        });

        this._logger.warn(`Update post[id=${id}] data: `, data);

        return { ...updated, created: formatDateString(updated.created.toISOString()) };
    }

    public async delete({ id, image }: IDeletePostParams): Promise<boolean> {
        // delete image from S3 bucket before deleting post:
        const key = this._s3.getS3KeyFromURL(image);
        const isOk = await this._s3.deleteS3File(key);
        await this._db.instance.post.delete({ where: { id: Number(id) } });
        return true;
    }

    public async getMany(params: IGetPostsParams): Promise<IPostData[]> {
        const { offset, limit, author_id, order, order_field } = params;
        const posts = await this._db.instance.post.findMany({
            take: Number(limit) || 0,
            skip: Number(offset) || 0,
            where: author_id ? { author_id: Number(author_id) } : undefined,
            orderBy: {
                [order_field ? `${order_field}` : 'created']: order || 'desc', // most recent by default
            },
            select: feedModel,
        });
        return posts.map((post) => ({
            ...post,
            created: formatDateString(post.created.toISOString()),
        }));
    }

    private _parseFieldsAndS3Upload(req: Request): Promise<IParseUploadResponse> {
        return new Promise((res, rej) => {
            const bb = busboy({ headers: req.headers });

            let isFile = false;

            const fields: any = {};

            bb.on('file', async (name, file, info) => {
                isFile = true;
                const { filename, mimeType } = info;

                try {
                    const imageURL = await this._s3.uploadImage(file, filename);
                    res({ imageURL, ...fields });
                } catch (error) {
                    rej(error);
                }
            });

            bb.on('field', (name, val, info) => {
                fields[`${name}`] = val;
            });

            bb.on('finish', () => {
                if (!isFile) {
                    res(fields);
                }
            });

            req.pipe(bb);
        });
    }
}
